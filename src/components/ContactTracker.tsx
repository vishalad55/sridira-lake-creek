'use client';

import { useEffect } from 'react';
import { trackContact } from '@/lib/analytics';

/**
 * Fires a `Contact` conversion for any tap on a phone or WhatsApp link,
 * wherever it appears — header, footer, mobile action bar, floating button.
 *
 * Done with one delegated listener rather than a handler on each link: the
 * footer is a server component, and this way a link added later is covered
 * automatically without anyone remembering to wire it up.
 */
export default function ContactTracker() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const link = target?.closest?.('a[href^="tel:"], a[href*="wa.me"]');
      if (!link) return;
      const href = link.getAttribute('href') ?? '';
      trackContact(href.startsWith('tel:') ? 'call' : 'whatsapp');
    };

    // Capture phase, so the event is recorded even if something later calls
    // stopPropagation or the click navigates straight out of the page.
    document.addEventListener('click', onClick, { capture: true });
    return () => document.removeEventListener('click', onClick, { capture: true });
  }, []);

  return null;
}
