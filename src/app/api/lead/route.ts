import { NextResponse } from 'next/server';
import {
  appendToFile,
  appendToSheet,
  emailViaResend,
  insertIntoSupabase,
  pushToGhl,
  validate,
  type Delivery,
} from '@/lib/leads';

export const runtime = 'nodejs';

/**
 * POST /api/lead
 *
 * Primary sinks run in parallel — the CRM, the tracking sheet and the database
 * each get every lead, because they serve different jobs (follow-up, reporting,
 * durability). If none of them is configured or all of them fail, we fall back
 * to email, then to a local file in dev, and only then report failure.
 *
 * Meta Pixel `Lead` and GA4 `generate_lead` fire client-side on a 200 —
 * see src/lib/analytics.ts.
 */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, message: 'Invalid request body.' }, { status: 400 });
  }

  const parsed = validate(body);
  if (!parsed.ok) {
    return NextResponse.json({ ok: false, errors: parsed.errors }, { status: 422 });
  }

  const lead = parsed.data;

  const primary: Delivery[] = await Promise.all([
    pushToGhl(lead),
    appendToSheet(lead),
    insertIntoSupabase(lead),
  ]);

  const deliveries = [...primary];
  let delivered = deliveries.some((d) => d.ok);

  if (!delivered) {
    const email = await emailViaResend(lead);
    deliveries.push(email);
    delivered = email.ok;

    if (!delivered) {
      const file = await appendToFile(lead);
      deliveries.push(file);
      delivered = file.ok;
    }
  }

  // No primary sink configured at all is a deployment mistake, not a runtime
  // failure — call it out separately so it is obvious in the Vercel logs.
  if (primary.every((d) => d.detail === 'not-configured')) {
    console.error(
      '[lead] MISCONFIGURED: no lead sink is set. Set at least one of ' +
        'GHL_WEBHOOK_URL, GOOGLE_SERVICE_ACCOUNT_EMAIL + GOOGLE_PRIVATE_KEY, ' +
        'GOOGLE_SHEETS_WEBHOOK_URL, or SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY.',
    );
  }

  // A sink that is configured but failing is an operational problem even when
  // another sink saved the lead — log it either way.
  const broken = deliveries.filter(
    (d) => !d.ok && d.detail !== 'not-configured' && d.detail !== 'disabled-in-production',
  );
  if (broken.length) {
    console.warn('[lead] sink failures', JSON.stringify(broken));
  }

  if (!delivered) {
    // Loud and structured — this log line is the only remaining copy.
    console.error('[lead] ALL SINKS FAILED', JSON.stringify({ lead, deliveries }));
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
