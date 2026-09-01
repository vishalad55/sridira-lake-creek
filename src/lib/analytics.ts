/**
 * Thin, fail-safe wrappers around the Meta Pixel and GA4.
 * Both are optional — if the env var is unset the script never loads and these
 * become no-ops, so the form still works in dev and on preview deploys.
 */

export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || '';
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || '';

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export type LeadEventPayload = {
  /** Which CTA/section triggered the form — used for per-section ad attribution. */
  source: string;
  /** Optional secondary context, e.g. the floor plan being unlocked. */
  intent?: string;
};

/** Meta Pixel `Lead` + GA4 `generate_lead`, fired only on a successful submit. */
export function trackLead({ source, intent }: LeadEventPayload) {
  if (typeof window === 'undefined') return;

  try {
    window.fbq?.('track', 'Lead', {
      content_name: 'Sridira Lake Creek',
      content_category: 'Residential — Horamavu, Bengaluru',
      source,
      intent,
    });
  } catch {
    /* analytics must never break the submit path */
  }

  try {
    window.gtag?.('event', 'generate_lead', {
      currency: 'INR',
      value: 0,
      source,
      intent,
      project: 'Sridira Lake Creek',
    });
  } catch {
    /* no-op */
  }
}

/** Lighter-weight funnel signal: the form was opened but not yet submitted. */
export function trackLeadFormOpen({ source, intent }: LeadEventPayload) {
  if (typeof window === 'undefined') return;
  try {
    window.fbq?.('track', 'InitiateCheckout', { source, intent });
  } catch {
    /* no-op */
  }
  try {
    window.gtag?.('event', 'lead_form_open', { source, intent });
  } catch {
    /* no-op */
  }
}
