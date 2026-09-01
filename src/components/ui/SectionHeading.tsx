import { cn } from '@/lib/cn';
import Reveal from './Reveal';

type Props = {
  eyebrow?: string;
  /** Small pill tag rendered beside the eyebrow, e.g. "Phase 1". */
  tag?: string;
  title: React.ReactNode;
  body?: React.ReactNode;
  onDark?: boolean;
  align?: 'left' | 'center';
  className?: string;
  /** Display size — `lg` for the primary section headline, `md` for sub-blocks. */
  size?: 'lg' | 'md';
};

export default function SectionHeading({
  eyebrow,
  tag,
  title,
  body,
  onDark = false,
  align = 'left',
  className,
  size = 'lg',
}: Props) {
  return (
    <div
      className={cn(
        'max-w-prose',
        align === 'center' && 'mx-auto text-center',
        className,
      )}
    >
      {(eyebrow || tag) && (
        <Reveal className={cn('flex flex-wrap items-center gap-3', align === 'center' && 'justify-center')}>
          {eyebrow && <span className={onDark ? 'eyebrow-on-dark' : 'eyebrow'}>{eyebrow}</span>}
          {tag && (
            <span
              className={cn(
                'rounded-full border-[0.8px] px-2.5 py-1 text-[0.625rem] font-semibold uppercase tracking-[0.18em]',
                onDark ? 'border-paper/30 text-mist-200' : 'border-teal-800/35 text-teal-800',
              )}
            >
              {tag}
            </span>
          )}
        </Reveal>
      )}

      <Reveal delay={0.05}>
        <h2
          className={cn(
            'mt-4 font-display',
            size === 'lg' ? 'text-display-lg' : 'text-display-md',
            onDark && 'text-paper',
          )}
        >
          {title}
        </h2>
      </Reveal>

      {body && (
        <Reveal delay={0.1}>
          <div className={cn('mt-5 text-body-lg', onDark ? 'text-mist-200' : 'text-ink-soft')}>{body}</div>
        </Reveal>
      )}
    </div>
  );
}
