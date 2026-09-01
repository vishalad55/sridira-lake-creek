'use client';

import { useEffect, useState } from 'react';
import { Phone } from 'lucide-react';
import { cn } from '@/lib/cn';
import { CONTACT, LEAD_SOURCES } from '@/lib/site';
import { useLead } from './LeadProvider';

/** Mobile-first: a persistent call/enquire bar once the hero is behind you. */
export default function MobileActionBar() {
  const { open } = useLead();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className={cn(
        'fixed inset-x-0 bottom-0 z-40 border-t-[0.8px] border-paper/10 bg-navy-950/95 backdrop-blur-md transition-transform duration-500 ease-brand md:hidden',
        'pb-[env(safe-area-inset-bottom)]',
        visible ? 'translate-y-0' : 'translate-y-full',
      )}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <a
          href={`tel:${CONTACT.phone}`}
          className="btn btn-sm btn-ghost-dark flex-1"
          aria-label={`Call ${CONTACT.phoneDisplay}`}
        >
          <Phone className="h-3.5 w-3.5" aria-hidden />
          Call
        </a>
        <button
          type="button"
          onClick={() =>
            open(LEAD_SOURCES.mobileBar, {
              title: 'Get pricing & floor plans',
              blurb: 'Leave your details and our sales team will call you back with pricing and availability.',
            })
          }
          className="btn btn-sm btn-on-dark flex-[1.6]"
        >
          Get Pricing
        </button>
      </div>
    </div>
  );
}
