'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { trackLeadFormOpen } from '@/lib/analytics';

const UNLOCK_KEY = 'slc:unlocked';
const EXIT_KEY = 'slc:exit-intent-shown';

export type LeadContextValue = {
  /** Open the lead modal. `source` is recorded for per-section ad attribution. */
  open: (source: string, opts?: { intent?: string; title?: string; blurb?: string }) => void;
  close: () => void;
  isOpen: boolean;
  source: string;
  intent?: string;
  title?: string;
  blurb?: string;
  /** True once any form on the site has been submitted — reveals gated content. */
  unlocked: boolean;
  markUnlocked: () => void;
  /** Exit-intent modal fires at most once per session. */
  exitIntentSpent: boolean;
  spendExitIntent: () => void;
};

const LeadContext = createContext<LeadContextValue | null>(null);

export function useLead() {
  const ctx = useContext(LeadContext);
  if (!ctx) throw new Error('useLead must be used inside <LeadProvider>');
  return ctx;
}

export function LeadProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [source, setSource] = useState('unknown');
  const [intent, setIntent] = useState<string | undefined>();
  const [title, setTitle] = useState<string | undefined>();
  const [blurb, setBlurb] = useState<string | undefined>();
  const [unlocked, setUnlocked] = useState(false);
  const [exitIntentSpent, setExitIntentSpent] = useState(true);

  // Rehydrate from sessionStorage after mount so SSR markup stays stable.
  useEffect(() => {
    try {
      setUnlocked(sessionStorage.getItem(UNLOCK_KEY) === '1');
      setExitIntentSpent(sessionStorage.getItem(EXIT_KEY) === '1');
    } catch {
      setExitIntentSpent(false);
    }
  }, []);

  const open = useCallback<LeadContextValue['open']>((nextSource, opts) => {
    setSource(nextSource);
    setIntent(opts?.intent);
    setTitle(opts?.title);
    setBlurb(opts?.blurb);
    setIsOpen(true);
    trackLeadFormOpen({ source: nextSource, intent: opts?.intent });
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  const markUnlocked = useCallback(() => {
    setUnlocked(true);
    try {
      sessionStorage.setItem(UNLOCK_KEY, '1');
    } catch {
      /* private mode — the in-memory flag still works for this page view */
    }
  }, []);

  const spendExitIntent = useCallback(() => {
    setExitIntentSpent(true);
    try {
      sessionStorage.setItem(EXIT_KEY, '1');
    } catch {
      /* no-op */
    }
  }, []);

  // Lock body scroll while the modal is up.
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  const value = useMemo(
    () => ({
      open,
      close,
      isOpen,
      source,
      intent,
      title,
      blurb,
      unlocked,
      markUnlocked,
      exitIntentSpent,
      spendExitIntent,
    }),
    [open, close, isOpen, source, intent, title, blurb, unlocked, markUnlocked, exitIntentSpent, spendExitIntent],
  );

  return <LeadContext.Provider value={value}>{children}</LeadContext.Provider>;
}
