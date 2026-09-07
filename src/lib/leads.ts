import crypto from 'crypto';

/**
 * Lead intake for Sridira Lake Creek.
 *
 * Sinks fan out rather than falling through: a lead should land in the CRM AND
 * be recorded in the tracking sheet AND be durable in the database. Only if
 * every configured sink fails do we reach for the email/file fallbacks.
 *
 * Each sink is independent and self-disabling — if its env vars are unset it
 * reports `not-configured` and nothing else is affected. That keeps preview
 * deploys and local dev working with zero configuration.
 */

export type LeadPayload = {
  name: string;
  phone: string;
  email: string;
  configuration: string;
  visitSlot?: string;
  consent: boolean;
  source: string;
  intent?: string;
  pageUrl?: string;
  utm?: Record<string, string>;
  receivedAt: string;
};

export type Delivery = { channel: string; ok: boolean; detail?: string };

/* ------------------------------------------------------------- validation */

const PHONE_RE = /^\d{10}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validate(
  body: Record<string, unknown>,
): { ok: true; data: LeadPayload } | { ok: false; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  const name = String(body.name ?? '').trim();
  const phone = String(body.phone ?? '')
    .replace(/\D/g, '')
    .replace(/^91(?=\d{10}$)/, '');
  const email = String(body.email ?? '').trim();

  if (name.length < 2) errors.name = 'Please enter your full name.';
  if (!PHONE_RE.test(phone)) errors.phone = 'Enter a valid 10-digit mobile number.';
  if (!EMAIL_RE.test(email)) errors.email = 'Enter a valid email address.';
  // TRAI / DPDP Act: explicit consent is mandatory before we may call or message.
  if (body.consent !== true) errors.consent = 'Consent is required so we can contact you.';

  if (Object.keys(errors).length) return { ok: false, errors };

  return {
    ok: true,
    data: {
      name,
      phone,
      email,
      configuration: String(body.configuration || '3 BHK + 3T'),
      visitSlot: body.visitSlot ? String(body.visitSlot) : undefined,
      consent: true,
      source: String(body.source || 'unknown'),
      intent: body.intent ? String(body.intent) : undefined,
      pageUrl: body.pageUrl ? String(body.pageUrl) : undefined,
      utm: body.utm && typeof body.utm === 'object' ? (body.utm as Record<string, string>) : undefined,
      receivedAt: new Date().toISOString(),
    },
  };
}

/** Column order for the tracking sheet — keep in step with SHEET_HEADERS. */
export const SHEET_HEADERS = [
  'Timestamp (IST)',
  'Name',
  'Phone',
  'Email',
  'Configuration',
  'Preferred Site Visit',
  'Source',
  'Intent',
  'Consent',
  'Page URL',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'gclid / fbclid',
];

function istTimestamp(iso: string) {
  return new Date(iso).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false });
}

export function toSheetRow(lead: LeadPayload) {
  const utm = lead.utm ?? {};
  return [
    istTimestamp(lead.receivedAt),
    lead.name,
    // Leading apostrophe stops Sheets mangling the number into scientific notation.
    `'+91${lead.phone}`,
    lead.email,
    lead.configuration,
    lead.visitSlot || '',
    lead.source,
    lead.intent || '',
    lead.consent ? 'Yes' : 'No',
    lead.pageUrl || '',
    utm.utm_source || '',
    utm.utm_medium || '',
    utm.utm_campaign || '',
    utm.gclid || utm.fbclid || '',
  ];
}

async function withTimeout<T>(fn: (signal: AbortSignal) => Promise<T>, ms: number): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fn(controller.signal);
  } finally {
    clearTimeout(timer);
  }
}

const errText = (err: unknown) => (err instanceof Error ? err.message : 'unknown error');

/* -------------------------------------------------------------------- GHL */

/**
 * PLACEHOLDER until the client supplies it — set GHL_WEBHOOK_URL to the
 * "Inbound Webhook" trigger URL from your GoHighLevel workflow, which looks
 * like https://services.leadconnectorhq.com/hooks/<locationId>/webhook-trigger/<id>
 */
export async function pushToGhl(lead: LeadPayload): Promise<Delivery> {
  const url = process.env.GHL_WEBHOOK_URL;
  if (!url) return { channel: 'ghl', ok: false, detail: 'not-configured' };

  try {
    const res = await withTimeout(
      (signal) =>
        fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal,
          body: JSON.stringify({
            first_name: lead.name.split(' ')[0],
            last_name: lead.name.split(' ').slice(1).join(' '),
            full_name: lead.name,
            phone: `+91${lead.phone}`,
            email: lead.email,
            project: 'Sridira Lake Creek',
            configuration: lead.configuration,
            preferred_site_visit: lead.visitSlot || '',
            consent_to_contact: lead.consent,
            lead_source: lead.source,
            lead_intent: lead.intent || '',
            page_url: lead.pageUrl || '',
            ...lead.utm,
            submitted_at: lead.receivedAt,
          }),
        }),
      8000,
    );
    if (!res.ok) return { channel: 'ghl', ok: false, detail: `HTTP ${res.status}` };
    return { channel: 'ghl', ok: true };
  } catch (err) {
    return { channel: 'ghl', ok: false, detail: errText(err) };
  }
}

/* ----------------------------------------------------------- Google Sheets */

const SHEET_ID = process.env.GOOGLE_SHEETS_ID || '1-1oUBpa2dZDwpzBxK5ZF7z8dcKPgD0hL8xN15gO3jVk';
const SHEET_TAB = process.env.GOOGLE_SHEETS_TAB || 'website leads';

/**
 * Builds an A1 range. A sheet name containing anything but letters, digits and
 * underscores — a space, in our case ("website leads") — must be wrapped in
 * single quotes, with any embedded quote doubled. Without this the Sheets API
 * rejects the call with `400 Unable to parse range`.
 */
export function a1Range(tab: string, cells: string) {
  const name = /^[A-Za-z0-9_]+$/.test(tab) ? tab : `'${tab.replace(/'/g, "''")}'`;
  return `${name}!${cells}`;
}

/** Access tokens live ~1h; cache across warm invocations. */
let cachedToken: { token: string; expiresAt: number } | null = null;
/** Header check only needs to happen once per cold start. */
let headerChecked = false;

function normalisePrivateKey(raw: string) {
  // Vercel stores the key with literal \n sequences; PEM needs real newlines.
  return raw.replace(/\\n/g, '\n').trim();
}

async function getAccessToken(email: string, privateKey: string): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) return cachedToken.token;

  const now = Math.floor(Date.now() / 1000);
  const b64 = (o: unknown) => Buffer.from(JSON.stringify(o)).toString('base64url');
  const unsigned = `${b64({ alg: 'RS256', typ: 'JWT' })}.${b64({
    iss: email,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  })}`;

  const signature = crypto.createSign('RSA-SHA256').update(unsigned).sign(privateKey, 'base64url');

  const res = await withTimeout(
    (signal) =>
      fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        signal,
        body: new URLSearchParams({
          grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
          assertion: `${unsigned}.${signature}`,
        }),
      }),
    8000,
  );

  const json = (await res.json()) as { access_token?: string; expires_in?: number; error_description?: string };
  if (!res.ok || !json.access_token) {
    throw new Error(json.error_description || `token HTTP ${res.status}`);
  }

  cachedToken = { token: json.access_token, expiresAt: Date.now() + (json.expires_in ?? 3600) * 1000 };
  return cachedToken.token;
}

/** Writes the header row once, so a brand-new tab is self-describing. */
async function ensureHeaderRow(token: string) {
  if (headerChecked) return;
  headerChecked = true;

  const range = encodeURIComponent(a1Range(SHEET_TAB, 'A1:A1'));
  const res = await withTimeout(
    (signal) =>
      fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}`, {
        headers: { Authorization: `Bearer ${token}` },
        signal,
      }),
    8000,
  );
  if (!res.ok) return; // append will surface the real error

  const json = (await res.json()) as { values?: string[][] };
  if (json.values?.length) return;

  const writeRange = encodeURIComponent(a1Range(SHEET_TAB, 'A1'));
  await withTimeout(
    (signal) =>
      fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${writeRange}?valueInputOption=RAW`,
        {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          signal,
          body: JSON.stringify({ values: [SHEET_HEADERS] }),
        },
      ),
    8000,
  );
}

/**
 * Appends to the tracking sheet. Two ways in, checked in order:
 *   1. A Google service account (GOOGLE_SERVICE_ACCOUNT_EMAIL + GOOGLE_PRIVATE_KEY),
 *      which talks to the Sheets API directly — no public endpoint.
 *   2. An Apps Script web app (GOOGLE_SHEETS_WEBHOOK_URL), which is far quicker
 *      to set up. See the README for the script.
 */
export async function appendToSheet(lead: LeadPayload): Promise<Delivery> {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey = process.env.GOOGLE_PRIVATE_KEY;
  const webhook = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

  if (email && rawKey) {
    try {
      const token = await getAccessToken(email, normalisePrivateKey(rawKey));
      await ensureHeaderRow(token);

      const range = encodeURIComponent(a1Range(SHEET_TAB, 'A:N'));
      const res = await withTimeout(
        (signal) =>
          fetch(
            `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}:append` +
              `?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
            {
              method: 'POST',
              headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
              signal,
              body: JSON.stringify({ values: [toSheetRow(lead)] }),
            },
          ),
        9000,
      );

      if (!res.ok) {
        const detail = await res.text().catch(() => '');
        return { channel: 'sheets', ok: false, detail: `HTTP ${res.status} ${detail.slice(0, 160)}` };
      }
      return { channel: 'sheets', ok: true };
    } catch (err) {
      return { channel: 'sheets', ok: false, detail: errText(err) };
    }
  }

  if (webhook) {
    try {
      const res = await withTimeout(
        (signal) =>
          fetch(webhook, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal,
            body: JSON.stringify({ tab: SHEET_TAB, headers: SHEET_HEADERS, row: toSheetRow(lead) }),
          }),
        9000,
      );
      if (!res.ok) return { channel: 'sheets-webhook', ok: false, detail: `HTTP ${res.status}` };
      return { channel: 'sheets-webhook', ok: true };
    } catch (err) {
      return { channel: 'sheets-webhook', ok: false, detail: errText(err) };
    }
  }

  return { channel: 'sheets', ok: false, detail: 'not-configured' };
}

/* ------------------------------------------------------------ diagnostics */

export type SinkStatus = {
  sink: string;
  configured: boolean;
  ok?: boolean;
  detail?: string;
  hint?: string;
};

/**
 * Live round-trip against the Sheets API — reads the tab's first cell using the
 * exact same range builder the writer uses, so a green result here means a
 * write will land.
 */
export async function checkSheetAccess(): Promise<SinkStatus> {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey = process.env.GOOGLE_PRIVATE_KEY;
  const webhook = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  const base = { sink: 'sheets', configured: Boolean((email && rawKey) || webhook) };

  if (!base.configured) {
    return { ...base, ok: false, detail: 'not-configured', hint: 'Set GOOGLE_SERVICE_ACCOUNT_EMAIL + GOOGLE_PRIVATE_KEY (then redeploy).' };
  }
  if (!email || !rawKey) {
    return { ...base, ok: true, detail: 'apps-script-webhook (not probed)' };
  }

  const range = a1Range(SHEET_TAB, 'A1:A1');

  try {
    const token = await getAccessToken(email, normalisePrivateKey(rawKey));
    const res = await withTimeout(
      (signal) =>
        fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(range)}`, {
          headers: { Authorization: `Bearer ${token}` },
          signal,
        }),
      9000,
    );

    if (res.ok) {
      return { ...base, ok: true, detail: `reachable · sheet ${SHEET_ID.slice(0, 8)}… · range ${range}` };
    }

    const text = await res.text().catch(() => '');
    const hint =
      res.status === 403
        ? `Share the spreadsheet with ${email} as an Editor, and make sure the Google Sheets API is enabled.`
        : res.status === 400
          ? `The tab "${SHEET_TAB}" does not exist in that spreadsheet — check the tab name at the bottom of the sheet.`
          : res.status === 404
            ? 'GOOGLE_SHEETS_ID does not match any spreadsheet.'
            : 'See the raw response below.';
    return { ...base, ok: false, detail: `HTTP ${res.status} ${text.slice(0, 200)}`, hint };
  } catch (err) {
    const msg = errText(err);
    const hint = /DECODER|asn1|PEM|routines/i.test(msg)
      ? 'GOOGLE_PRIVATE_KEY is malformed — recopy the whole private_key value from the JSON, including the BEGIN/END lines.'
      : /invalid_grant|account not found/i.test(msg)
        ? 'GOOGLE_SERVICE_ACCOUNT_EMAIL does not match a real service account.'
        : 'Unexpected error talking to Google.';
    return { ...base, ok: false, detail: msg, hint };
  }
}

export async function checkSupabaseAccess(): Promise<SinkStatus> {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const table = process.env.SUPABASE_LEADS_TABLE || 'leads';
  const base = { sink: 'supabase', configured: Boolean(url && key) };

  if (!url || !key) {
    return { ...base, ok: false, detail: 'not-configured', hint: 'Set SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY.' };
  }

  try {
    const res = await withTimeout(
      (signal) =>
        fetch(`${url.replace(/\/$/, '')}/rest/v1/${table}?select=id&limit=1`, {
          headers: { apikey: key, Authorization: `Bearer ${key}` },
          signal,
        }),
      8000,
    );
    if (res.ok) return { ...base, ok: true, detail: `reachable · table "${table}"` };
    const text = await res.text().catch(() => '');
    return {
      ...base,
      ok: false,
      detail: `HTTP ${res.status} ${text.slice(0, 200)}`,
      hint: res.status === 404 ? `Table "${table}" does not exist — run the create table SQL.` : 'Check the service-role key.',
    };
  } catch (err) {
    return { ...base, ok: false, detail: errText(err) };
  }
}

export function checkGhl(): SinkStatus {
  const configured = Boolean(process.env.GHL_WEBHOOK_URL);
  return {
    sink: 'ghl',
    configured,
    ok: configured,
    detail: configured ? 'webhook set (not probed — probing would create a test lead)' : 'not-configured',
    hint: configured ? undefined : 'Set GHL_WEBHOOK_URL when the CRM webhook is ready.',
  };
}

/* --------------------------------------------------------------- Supabase */

/**
 * Durable storage. Uses the service-role key, so this must only ever run
 * server-side — the key bypasses row-level security.
 */
export async function insertIntoSupabase(lead: LeadPayload): Promise<Delivery> {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const table = process.env.SUPABASE_LEADS_TABLE || 'leads';

  if (!url || !key) return { channel: 'supabase', ok: false, detail: 'not-configured' };

  try {
    const res = await withTimeout(
      (signal) =>
        fetch(`${url.replace(/\/$/, '')}/rest/v1/${table}`, {
          method: 'POST',
          headers: {
            apikey: key,
            Authorization: `Bearer ${key}`,
            'Content-Type': 'application/json',
            Prefer: 'return=minimal',
          },
          signal,
          body: JSON.stringify({
            name: lead.name,
            phone: `+91${lead.phone}`,
            email: lead.email,
            configuration: lead.configuration,
            visit_slot: lead.visitSlot || null,
            consent: lead.consent,
            source: lead.source,
            intent: lead.intent || null,
            page_url: lead.pageUrl || null,
            utm: lead.utm ?? {},
            created_at: lead.receivedAt,
          }),
        }),
      8000,
    );

    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      return { channel: 'supabase', ok: false, detail: `HTTP ${res.status} ${detail.slice(0, 160)}` };
    }
    return { channel: 'supabase', ok: true };
  } catch (err) {
    return { channel: 'supabase', ok: false, detail: errText(err) };
  }
}

/* ---------------------------------------------------- fallbacks: email, file */

export async function emailViaResend(lead: LeadPayload): Promise<Delivery> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFY_EMAIL;
  const from = process.env.LEAD_FROM_EMAIL || 'Sridira Lake Creek <onboarding@resend.dev>';

  if (!apiKey || !to) return { channel: 'resend', ok: false, detail: 'not-configured' };

  const rows = [
    ['Name', lead.name],
    ['Phone', `+91 ${lead.phone}`],
    ['Email', lead.email],
    ['Configuration', lead.configuration],
    ['Preferred site visit', lead.visitSlot || '—'],
    ['Source', lead.source],
    ['Intent', lead.intent || '—'],
    ['Page', lead.pageUrl || '—'],
  ]
    .map(
      ([k, v]) =>
        `<tr><td style="padding:4px 12px 4px 0;color:#4C4849">${k}</td><td style="padding:4px 0"><b>${v}</b></td></tr>`,
    )
    .join('');

  try {
    const res = await withTimeout(
      (signal) =>
        fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
          signal,
          body: JSON.stringify({
            from,
            to: to.split(',').map((s) => s.trim()),
            subject: `[FALLBACK] Lake Creek lead — ${lead.name} (${lead.source})`,
            html: `<p>No primary sink accepted this lead, so it is being delivered by email instead.</p><table>${rows}</table>`,
          }),
        }),
      8000,
    );
    if (!res.ok) return { channel: 'resend', ok: false, detail: `HTTP ${res.status}` };
    return { channel: 'resend', ok: true };
  } catch (err) {
    return { channel: 'resend', ok: false, detail: errText(err) };
  }
}

/**
 * Last-resort local sink for development. Serverless filesystems are ephemeral,
 * so this is deliberately skipped in production — a file nobody can read is
 * worse than a loud error.
 */
export async function appendToFile(lead: LeadPayload): Promise<Delivery> {
  if (process.env.NODE_ENV === 'production' && !process.env.LEAD_FILE_SINK) {
    return { channel: 'file', ok: false, detail: 'disabled-in-production' };
  }
  try {
    const { promises: fs } = await import('fs');
    const path = await import('path');
    const file = path.join(process.cwd(), 'leads.json');

    let existing: unknown[] = [];
    try {
      const parsed = JSON.parse(await fs.readFile(file, 'utf8'));
      if (Array.isArray(parsed)) existing = parsed;
    } catch {
      existing = [];
    }

    existing.push(lead);
    await fs.writeFile(file, JSON.stringify(existing, null, 2), 'utf8');
    return { channel: 'file', ok: true, detail: 'leads.json' };
  } catch (err) {
    return { channel: 'file', ok: false, detail: errText(err) };
  }
}
