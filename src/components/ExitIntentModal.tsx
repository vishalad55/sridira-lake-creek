'use client';

import { useEffect, useRef } from 'react';
import { LEAD_SOURCES } from '@/lib/site';
import { useLead } from './LeadProvider';

/**
 * Fires at most once per session, and never after the visitor has already
 * submitted. Desktop uses a real exit intent (pointer leaving via the top edge);
 * mobile uses a deliberate scroll-back-up gesture past a third of the page,
 * which is the closest honest equivalent without hijacking the back button.
 */
export default function ExitIntentModal() {
  const { open, isOpen, unlocked, exitIntentSpent, spendExitIntent } = useLead();
  const lastY = useRef(0);
  const armed = useRef(false);

  useEffect(() => {
    if (exitIntentSpent || unlocked) return;

    // Don't ambush someone who just arrived.
    const armTimer = setTimeout(() => {
      armed.current = true;
    }, 12_000);

    const fire = () => {
      if (!armed.current || isOpen) return;
      armed.current = false;
      spendExitIntent();
      open(LEAD_SOURCES.exitIntent, {
        title: 'Before you go — get the price sheet',
        blurb:
          'Pricing and the full floor plans for Sridira Lake Creek are shared on request. Leave your details and we will send them across.',
      });
    };

    const onMouseOut = (event: MouseEvent) => {
      if (event.relatedTarget || event.clientY > 8) return;
      fire();
    };

    const onScroll = () => {
      const y = window.scrollY;
      const depth = y / Math.max(1, document.body.scrollHeight - window.innerHeight);
      // A fast upward flick after real engagement with the page.
      if (depth > 0.33 && lastY.current - y > 90) fire();
      lastY.current = y;
    };

    lastY.current = window.scrollY;
    document.addEventListener('mouseout', onMouseOut);
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      clearTimeout(armTimer);
      document.removeEventListener('mouseout', onMouseOut);
      window.removeEventListener('scroll', onScroll);
    };
  }, [exitIntentSpent, unlocked, isOpen, open, spendExitIntent]);

  return null;
}
