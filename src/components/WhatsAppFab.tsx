'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/cn';
import { whatsappHref } from '@/lib/site';

/** Persistent WhatsApp action, lifted clear of the mobile action bar. */
export default function WhatsAppFab() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <a
      href={whatsappHref()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp about Sridira Lake Creek"
      className={cn(
        'fixed right-4 z-40 flex items-center justify-center rounded-full bg-[#25D366] text-paper shadow-lift-lg transition-all duration-500 ease-brand',
        'bottom-[calc(env(safe-area-inset-bottom)+5.5rem)] md:bottom-6 md:right-6',
        'h-12 w-12 md:h-14 md:w-14',
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0',
      )}
    >
      {/* Inline mark — lucide has no WhatsApp glyph. */}
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 md:h-7 md:w-7" aria-hidden>
        <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47s1.06 2.86 1.21 3.06c.15.2 2.09 3.2 5.07 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.28.17-1.41-.07-.13-.27-.2-.57-.35Z" />
        <path d="M12.04 2C6.6 2 2.18 6.42 2.18 11.86c0 1.74.46 3.44 1.32 4.94L2.05 22l5.34-1.4a9.83 9.83 0 0 0 4.65 1.18h.01c5.43 0 9.85-4.42 9.85-9.86 0-2.63-1.02-5.11-2.88-6.97A9.79 9.79 0 0 0 12.04 2Zm0 17.96h-.01a8.2 8.2 0 0 1-4.17-1.14l-.3-.18-3.1.81.83-3.02-.2-.31a8.13 8.13 0 0 1-1.25-4.36c0-4.52 3.68-8.2 8.2-8.2a8.14 8.14 0 0 1 5.79 2.4 8.14 8.14 0 0 1 2.4 5.8c0 4.52-3.68 8.2-8.19 8.2Z" />
      </svg>
    </a>
  );
}
