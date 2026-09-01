'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  /** Stagger position within a group. */
  delay?: number;
  /** Travel distance in px — keep it small; the reference site is restrained. */
  y?: number;
  className?: string;
  as?: 'div' | 'li' | 'section' | 'article' | 'figure';
};

/**
 * Scroll reveal used site-wide. Fires once, moves 18px, 0.65s — subtle enough
 * that it reads as polish rather than motion for its own sake, and it fully
 * disables under prefers-reduced-motion.
 */
export default function Reveal({ children, delay = 0, y = 18, className, as = 'div' }: Props) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as];

  if (reduce) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  );
}
