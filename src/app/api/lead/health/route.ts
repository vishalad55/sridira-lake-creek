import { NextResponse } from 'next/server';
import { checkGhl, checkSheetAccess, checkSupabaseAccess } from '@/lib/leads';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/lead/health?token=…
 *
 * Live check of every lead sink, so a misconfiguration can be diagnosed from a
 * URL instead of by reading deployment logs.
 *
 * Gated behind LEAD_HEALTH_TOKEN — it reports which integrations exist and the
 * errors they return, which is not something to leave open on a public site.
 * With the variable unset the route 404s, exactly as if it did not exist.
 */
export async function GET(request: Request) {
  const expected = process.env.LEAD_HEALTH_TOKEN;
  if (!expected) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const provided = new URL(request.url).searchParams.get('token') ?? '';
  // Constant-time-ish compare: bail on length first, then diff every char.
  const ok =
    provided.length === expected.length &&
    provided.split('').reduce((acc, c, i) => acc | (c.charCodeAt(0) ^ expected.charCodeAt(i)), 0) === 0;
  if (!ok) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const [sheets, supabase] = await Promise.all([checkSheetAccess(), checkSupabaseAccess()]);
  const sinks = [checkGhl(), sheets, supabase];
  const healthy = sinks.some((s) => s.ok);

  return NextResponse.json(
    {
      ok: healthy,
      summary: healthy
        ? `${sinks.filter((s) => s.ok).length} of ${sinks.length} sinks working.`
        : 'No lead sink is working — submissions will be refused.',
      sinks,
      checkedAt: new Date().toISOString(),
    },
    { status: healthy ? 200 : 503, headers: { 'Cache-Control': 'no-store' } },
  );
}
