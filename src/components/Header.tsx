'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, Phone, X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { CONTACT, LEAD_SOURCES, NAV, PROJECT } from '@/lib/site';
import { Wordmark } from './brand/BrandGraphics';
import { useLead } from './LeadProvider';

export default function Header() {
  const { open } = useLead();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const dark = !scrolled && !menuOpen;

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 h-[var(--header-h)] border-b-[0.8px] transition-colors duration-500 ease-brand',
        dark
          ? 'on-dark border-paper/20 bg-navy-950/20 backdrop-blur-md'
          : 'border-hairline bg-paper/92 backdrop-blur-md',
      )}
    >
      <div className="shell flex h-full items-center justify-between gap-6">
        {/* The Coax wordmark itself — masked, so it is only ever a brand colour. */}
        <a
          href="#top"
          aria-label={`${PROJECT.name} — back to top`}
          className={cn('shrink-0 transition-colors', dark ? 'text-paper' : 'text-navy-900')}
        >
          <Wordmark variant="stacked" className="w-[6.75rem] shrink-0 sm:w-[7.75rem]" />
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                'link-underline text-[0.6875rem] font-semibold uppercase tracking-[0.16em] transition-colors',
                dark ? 'text-mist-100 hover:text-paper' : 'text-ink-soft hover:text-ink',
              )}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href={`tel:${CONTACT.phone}`}
            aria-label={`Call ${CONTACT.phoneDisplay}`}
            className={cn(
              'hidden h-9 w-9 items-center justify-center rounded-full border-[0.8px] transition-colors sm:flex',
              dark ? 'border-paper/35 text-paper hover:bg-paper/10' : 'border-hairline text-ink hover:bg-mist-100',
            )}
          >
            <Phone className="h-3.5 w-3.5" aria-hidden />
          </a>

          <button
            type="button"
            onClick={() =>
              open(LEAD_SOURCES.headerCta, {
                title: 'Get pricing & floor plans',
                blurb:
                  'Pricing for Sridira Lake Creek is shared privately. Leave your details and our team will call you back with the current price sheet and availability.',
              })
            }
            className={cn('btn btn-sm', dark ? 'btn-on-dark' : 'btn-primary')}
          >
            Get pricing
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-full border-[0.8px] transition-colors lg:hidden',
              dark ? 'border-paper/35 text-paper' : 'border-hairline text-ink',
            )}
          >
            {menuOpen ? <X className="h-4 w-4" aria-hidden /> : <Menu className="h-4 w-4" aria-hidden />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            id="mobile-nav"
            aria-label="Mobile"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-x-0 top-full border-b-[0.8px] border-hairline bg-paper shadow-lift lg:hidden"
          >
            <ul className="shell divide-y-[0.8px] divide-hairline py-2">
              {NAV.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="block py-4 text-sm font-semibold uppercase tracking-[0.14em] text-ink"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={`tel:${CONTACT.phone}`}
                  className="block py-4 text-sm font-semibold uppercase tracking-[0.14em] text-teal-800"
                >
                  Call {CONTACT.phoneDisplay}
                </a>
              </li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
