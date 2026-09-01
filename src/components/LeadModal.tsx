'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import LeadForm from './LeadForm';
import { useLead } from './LeadProvider';
import { PROJECT } from '@/lib/site';
import { Wordmark } from './brand/BrandGraphics';

export default function LeadModal() {
  const { isOpen, close, source, intent, title, blurb } = useLead();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
      if (event.key !== 'Tab') return;

      // Minimal focus trap: cycle within the dialog while it is open.
      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables?.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    const focusTimer = setTimeout(() => {
      panelRef.current?.querySelector<HTMLInputElement>('input[name="name"]')?.focus();
    }, 240);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      clearTimeout(focusTimer);
    };
  }, [isOpen, close]);

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <button
            type="button"
            aria-label="Close form"
            onClick={close}
            className="absolute inset-0 h-full w-full cursor-default bg-navy-950/70 backdrop-blur-sm"
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="lead-modal-title"
            initial={{ y: 40, opacity: 0, scale: 0.985 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 24, opacity: 0, scale: 0.99 }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 max-h-[92dvh] w-full max-w-3xl overflow-y-auto rounded-t-organic bg-paper shadow-lift-lg sm:rounded-card"
          >
            <button
              type="button"
              onClick={close}
              aria-label="Close form"
              className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full border-[0.8px] border-hairline bg-paper/90 text-ink transition-colors hover:bg-mist-100 sm:right-5 sm:top-5"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>

            <div className="grid md:grid-cols-[0.85fr_1fr]">
              {/* Visual rail — hidden on mobile so the form is above the fold. */}
              <div className="relative hidden min-h-[520px] md:block">
                <Image
                  src="/assets/lifestyle-lake/open-by-design-01.jpg"
                  alt=""
                  fill
                  sizes="340px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/35 to-navy-950/10" />
                <div className="on-dark absolute inset-x-0 bottom-0 p-7">
                  <Wordmark variant="stacked" className="w-[9rem] text-paper" />
                  <p className="mt-3 font-display text-[1.75rem] leading-none text-paper">
                    Lake-facing 3 BHK homes in Horamavu.
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-mist-200">
                    2 towers · 28 floors · 4.48 acres · 70% open space
                  </p>
                </div>
              </div>

              <div className="p-6 sm:p-8">
                <p className="eyebrow">{PROJECT.phase}</p>
                <h2 id="lead-modal-title" className="mt-3 font-display text-display-sm">
                  {title || 'Get pricing & floor plans'}
                </h2>
                <p className="mt-3 max-w-prose text-sm leading-relaxed text-ink-soft">
                  {blurb ||
                    'Share your details and our sales team will send the price sheet, full floor plans and the brochure — and call you back to answer anything else.'}
                </p>

                <div className="mt-6">
                  <LeadForm
                    source={source}
                    intent={intent}
                    variant="modal"
                    onSuccess={() => {
                      // Give the thank-you state a beat, then reveal the page behind it.
                      closeTimer.current = setTimeout(close, 2800);
                    }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
