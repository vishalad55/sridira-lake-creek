import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

/**
 * Lead intake for Sridira Lake Creek.
 *
 * Delivery order — a lead is only ever reported as lost if every channel fails:
 *   1. POST to the GHL inbound webhook (GHL_WEBHOOK_URL)
 *   2. If that fails, email it via Resend (RESEND_API_KEY + LEAD_NOTIFY_EMAIL)
 *   3. If that also fails (or in local dev), append to ./leads.json
 *
 * The Meta Pixel `Lead` and GA4 `generate_lead` events are fired client-side on
 * a successful response — see src/lib/analytics.ts.
 */

const GHL_WEBHOOK_URL = process.env.GHL_WEBHOOK_URL || '';
const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const LEAD_NOTIFY_EMAIL = process.env.LEAD_NOTIFY_EMAIL || '';
const LEAD_FROM_EMAIL = process.env.LEAD_FROM_EMAIL || 'Sridira Lake Creek <onboarding@resend.dev>';

/**
 * PLACEHOLDER — set GHL_WEBHOOK_URL in .env.local / Vercel project settings to
 * the "Inbound Webhook" trigger URL from your GoHighLevel workflow. It looks
 * like: https://services.leadconnectorhq.com/hooks/<locationId>/webhook-trigger/<id>
 */
const GHL_PLACEHOLDER_NOTICE =
  'GHL_WEBHOOK_URL is not set — skipping CRM push. Set it to your GoHighLevel inbound webhook trigger URL.';

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
};

type Delivery = { channel: string; ok: boolean; detail?: string };

const PHONE_RE = /^\d{10}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(body: Partial<LeadPayload>): { ok: true; data: LeadPayload } | { ok: false; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  const name = String(body.name ?? '').trim();
  const phone = String(body.phone ?? '').replace(/\D/g, '').replace(/^91(?=\d{10}$)/, '');
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
      utm: body.utm && typeof body.utm === 'object' ? body.utm : undefined,
    },
  };
}

async function pushToGhl(lead: LeadPayload): Promise<Delivery> {
  if (!GHL_WEBHOOK_URL) {
    console.warn(`[lead] ${GHL_PLACEHOLDER_NOTICE}`);
    return { channel: 'ghl', ok: false, detail: 'not-configured' };
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(GHL_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
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
        submitted_at: new Date().toISOString(),
      }),
    });

    clearTimeout(timeout);
    if (!res.ok) return { channel: 'ghl', ok: false, detail: `HTTP ${res.status}` };
    return { channel: 'ghl', ok: true };
  } catch (err) {
    return { channel: 'ghl', ok: false, detail: err instanceof Error ? err.message : 'unknown error' };
  }
}

async function emailViaResend(lead: LeadPayload): Promise<Delivery> {
  if (!RESEND_API_KEY || !LEAD_NOTIFY_EMAIL) {
    return { channel: 'resend', ok: false, detail: 'not-configured' };
  }

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
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#5A615C">${k}</td><td style="padding:4px 0"><b>${v}</b></td></tr>`)
    .join('');

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: LEAD_FROM_EMAIL,
        to: LEAD_NOTIFY_EMAIL.split(',').map((s) => s.trim()),
        subject: `[FALLBACK] Lake Creek lead — ${lead.name} (${lead.source})`,
        html: `<p>The GHL webhook did not accept this lead, so it is being delivered by email instead.</p><table>${rows}</table>`,
      }),
    });

    if (!res.ok) return { channel: 'resend', ok: false, detail: `HTTP ${res.status}` };
    return { channel: 'resend', ok: true };
  } catch (err) {
    return { channel: 'resend', ok: false, detail: err instanceof Error ? err.message : 'unknown error' };
  }
}

/** Last-resort local sink so a dev-mode lead is never silently dropped. */
async function appendToFile(lead: LeadPayload): Promise<Delivery> {
  try {
    const { promises: fs } = await import('fs');
    const path = await import('path');
    const file = path.join(process.cwd(), 'leads.json');

    let existing: unknown[] = [];
    try {
      existing = JSON.parse(await fs.readFile(file, 'utf8'));
      if (!Array.isArray(existing)) existing = [];
    } catch {
      existing = [];
    }

    existing.push({ ...lead, receivedAt: new Date().toISOString() });
    await fs.writeFile(file, JSON.stringify(existing, null, 2), 'utf8');
    return { channel: 'file', ok: true, detail: 'leads.json' };
  } catch (err) {
    return { channel: 'file', ok: false, detail: err instanceof Error ? err.message : 'unknown error' };
  }
}

export async function POST(request: Request) {
  let body: Partial<LeadPayload>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: 'Invalid request body.' }, { status: 400 });
  }

  const parsed = validate(body);
  if (!parsed.ok) {
    return NextResponse.json({ ok: false, errors: parsed.errors }, { status: 422 });
  }

  const lead = parsed.data;
  const deliveries: Delivery[] = [];

  const ghl = await pushToGhl(lead);
  deliveries.push(ghl);

  if (!ghl.ok) {
    const email = await emailViaResend(lead);
    deliveries.push(email);

    if (!email.ok) {
      deliveries.push(await appendToFile(lead));
    }
  }

  const delivered = deliveries.some((d) => d.ok);

  if (!delivered) {
    // Loud, structured log — this is the only remaining copy of the lead.
    console.error('[lead] ALL DELIVERY CHANNELS FAILED', JSON.stringify({ lead, deliveries }));
    return NextResponse.json(
      { ok: false, message: 'We could not record your details. Please call us instead.' },
      { status: 502 },
    );
  }

  return NextResponse.json({
    ok: true,
    message: 'Lead received.',
    deliveredVia: deliveries.filter((d) => d.ok).map((d) => d.channel),
  });
}
