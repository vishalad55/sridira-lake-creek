'use client';

import { cn } from '@/lib/cn';
import { useLead } from '../LeadProvider';

type Props = {
  source: string;
  intent?: string;
  title?: string;
  blurb?: string;
  children: React.ReactNode;
  className?: string;
  /** Rendered before the label, e.g. a lucide icon. */
  icon?: React.ReactNode;
};

/**
 * Every pricing-adjacent CTA on the site routes through here, so each one is
 * tagged with the section that produced it before the modal opens.
 */
export default function LeadCTA({ source, intent, title, blurb, children, className, icon }: Props) {
  const { open } = useLead();

  return (
    <button type="button" onClick={() => open(source, { intent, title, blurb })} className={cn('btn', className)}>
      {icon}
      {children}
    </button>
  );
}
