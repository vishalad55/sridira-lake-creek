/**
 * Thin, fail-safe wrappers around the Meta Pixel and GA4.
 *
 * Every call is a no-op when the tags are not loaded — which is the case in
 * development and on preview deploys — so nothing here can break the form. The
 * tag IDs and the decision to load them live in components/Analytics.tsx, which
 * is server-only; this module gets bundled into the client, so it stays
 * env-free.
 */

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

/**
 * A tap on the phone number or the WhatsApp button. For a project like this a
 * direct call is a conversion in its own right, so it is worth optimising ads
 * against alongside form submissions.
 */
export function trackContact(channel: 'call' | 'whatsapp') {
  if (typeof window === 'undefined') return;
  try {
    window.fbq?.('track', 'Contact', { channel, content_name: 'Sridira Lake Creek' });
  } catch {
    /* no-op */
  }
  try {
    window.gtag?.('event', 'contact', { channel, project: 'Sridira Lake Creek' });
  } catch {
    /* no-op */
  }
}
