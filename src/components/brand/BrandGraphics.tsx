import { cn } from '@/lib/cn';

/**
 * The brand's graphic vocabulary, rebuilt as SVG from the Brand Guidelines deck.
 *
 * Everything is drawn from one primitive: the *petal* — a square cell with two
 * opposite corners removed by quarter-arcs of radius = the cell side. Circles
 * and half-discs from the same grid complete the set. Because it is all
 * geometry, every mark scales cleanly and takes its colour from `currentColor`.
 */

/** Petal with sharp points at the cell's top-left and bottom-right corners. */
function petalTLBR(x: number, y: number, s: number) {
  return `M${x},${y} A${s},${s} 0 0 1 ${x + s},${y + s} A${s},${s} 0 0 1 ${x},${y} Z`;
}

/** Petal with sharp points at the cell's bottom-left and top-right corners. */
function petalBLTR(x: number, y: number, s: number) {
  return `M${x},${y + s} A${s},${s} 0 0 0 ${x + s},${y} A${s},${s} 0 0 0 ${x},${y + s} Z`;
}

/* ------------------------------------------------------------------ mark */

/**
 * The Sridira Lake Creek monogram: two stacked circles, a facing pair of
 * petals, a half-disc, and two more petals fanning right.
 */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 200" className={className} fill="currentColor" aria-hidden focusable="false">
      <circle cx="50" cy="50" r="50" />
      <circle cx="50" cy="150" r="50" />
      <path d={petalTLBR(100, 0, 100)} />
      <path d={petalBLTR(100, 100, 100)} />
      <path d="M300,0 A100,100 0 0 0 300,200 Z" />
      <path d={petalBLTR(300, 0, 100)} />
      <path d={petalTLBR(300, 100, 100)} />
    </svg>
  );
}

/* ----------------------------------------------------------- petal field */

/**
 * Oversized, barely-there petal rosettes — the watermark that sits behind
 * nearly every page of the brand deck. Purely decorative.
 */
export function PetalField({
  className,
  opacity = 0.06,
}: {
  className?: string;
  opacity?: number;
}) {
  return (
    <svg
      viewBox="0 0 600 400"
      preserveAspectRatio="xMidYMid slice"
      className={cn('pointer-events-none absolute inset-0 h-full w-full', className)}
      fill="currentColor"
      style={{ opacity }}
      aria-hidden
      focusable="false"
    >
      {/* Four petals meeting at a point, plus an offset pair — as on the deck. */}
      <g>
        <path d={petalTLBR(60, 20, 170)} />
        <path d={petalBLTR(230, 20, 170)} />
        <path d={petalBLTR(60, 190, 170)} />
        <path d={petalTLBR(230, 190, 170)} />
      </g>
      <g>
        <path d={petalTLBR(400, 120, 130)} />
        <path d={petalBLTR(400, 250, 130)} />
        <circle cx="530" cy="90" r="65" />
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------ motif band */

/**
 * The repeating geometric band from "Graphic Elements" — circles and petals in
 * a lighter tint of the field colour, held to the right edge of the band.
 */
export function MotifBand({ className, opacity = 0.16 }: { className?: string; opacity?: number }) {
  return (
    <svg
      viewBox="0 0 400 200"
      preserveAspectRatio="xMaxYMid meet"
      className={cn('pointer-events-none h-full w-auto', className)}
      fill="currentColor"
      style={{ opacity }}
      aria-hidden
      focusable="false"
    >
      <circle cx="50" cy="50" r="50" />
      <circle cx="50" cy="150" r="50" />
      <path d={petalTLBR(100, 0, 100)} />
      <path d={petalBLTR(100, 100, 100)} />
      <path d="M300,0 A100,100 0 0 0 300,200 Z" />
      <path d={petalBLTR(300, 0, 100)} />
      <path d={petalTLBR(300, 100, 100)} />
    </svg>
  );
}

/* --------------------------------------------------------- contour lines */

/**
 * "Organic contour lines echo the natural landscape" — a stack of offset
 * flowing strokes, as used across the deck's teal and navy spreads.
 */
export function ContourLines({
  className,
  opacity = 0.22,
  lines = 9,
}: {
  className?: string;
  opacity?: number;
  lines?: number;
}) {
  return (
    <svg
      viewBox="0 0 1200 420"
      preserveAspectRatio="xMidYMid slice"
      className={cn('pointer-events-none absolute inset-0 h-full w-full', className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      style={{ opacity }}
      aria-hidden
      focusable="false"
    >
      {Array.from({ length: lines }, (_, i) => {
        const o = i * 26;
        return (
          <path
            key={i}
            d={`M-40,${70 + o} C 180,${10 + o} 300,${150 + o} 520,${140 + o} S 860,${30 + o} 1240,${120 + o}`}
          />
        );
      })}
    </svg>
  );
}

/* ---------------------------------------------------------- ripple lines */

/**
 * "Inspired by the gentle ripples of the lake" — concentric arcs, used sparingly
 * as a section divider.
 */
export function RippleRule({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 24"
      className={cn('h-6 w-60', className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
      aria-hidden
      focusable="false"
    >
      {[0, 6, 12].map((o) => (
        <path key={o} d={`M0,${18 - o} C 60,${4 - o} 180,${32 - o} 240,${18 - o}`} />
      ))}
    </svg>
  );
}

/* ---------------------------------------------------------------- logo */

/**
 * The Coax wordmark, painted through a CSS mask so it always renders in an
 * approved brand colour and is never re-typeset in a substitute face.
 */
export function Wordmark({
  variant = 'stacked',
  className,
}: {
  variant?: 'stacked' | 'single';
  className?: string;
}) {
  return (
    <span
      role="img"
      aria-label="Sridira Lake Creek"
      className={cn('wordmark', variant === 'stacked' ? 'wordmark-stacked' : 'wordmark-single', className)}
    />
  );
}
