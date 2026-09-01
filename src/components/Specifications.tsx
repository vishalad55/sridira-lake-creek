import Image from 'next/image';
import { Plus } from 'lucide-react';
import { SPECIFICATIONS } from '@/lib/site';
import Reveal from './ui/Reveal';
import SectionHeading from './ui/SectionHeading';

/**
 * Native <details> accordions: collapsed by default, but the full text stays in
 * the DOM for crawlers and screen readers. Spec bullets are verbatim from the
 * brochure — buyers compare these line by line, so nothing is paraphrased.
 */
export default function Specifications() {
  const half = Math.ceil(SPECIFICATIONS.length / 2);
  const columns = [SPECIFICATIONS.slice(0, half), SPECIFICATIONS.slice(half)];

  return (
    <section id="specifications" className="relative isolate overflow-hidden bg-mist-50">
      <Image
        src="/assets/hero-exterior/specs-bg-05.jpg"
        alt=""
        fill
        sizes="100vw"
        className="object-cover opacity-[0.06]"
      />

      <div className="shell relative section-y">
        <SectionHeading
          eyebrow="Specifications"
          title="Written down, so nothing is assumed."
          body={
            <p>
              The full specification for Phase 1, exactly as issued — structure, finishes, fittings and common-area
              provisions.
            </p>
          }
        />

        <div className="mt-12 grid gap-x-10 gap-y-0 lg:grid-cols-2">
          {columns.map((column, columnIndex) => (
            <div key={columnIndex}>
              {column.map((spec, i) => (
                <Reveal key={spec.group} delay={i * 0.03}>
                  <details className="group border-b-[0.8px] border-hairline">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left [&::-webkit-details-marker]:hidden">
                      <h3 className="font-display text-[1.25rem] leading-tight text-ink sm:text-[1.375rem]">
                        {spec.group}
                      </h3>
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-[0.8px] border-hairline bg-panel text-ink-soft transition-transform duration-300 ease-brand group-open:rotate-45">
                        <Plus className="h-4 w-4" aria-hidden />
                      </span>
                    </summary>
                    <ul className="space-y-2.5 pb-6 pr-12">
                      {spec.items.map((item) => (
                        <li key={item} className="flex items-start gap-3 text-[0.9375rem] leading-relaxed text-ink-soft">
                          <span className="mt-[0.6rem] h-1 w-1 shrink-0 rounded-full bg-teal-800" aria-hidden />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </details>
                </Reveal>
              ))}
            </div>
          ))}
        </div>

        <Reveal delay={0.1}>
          <p className="mt-8 max-w-prose text-sm text-ink-faint">
            Brands named are indicative; equivalents of the same grade may be substituted. Specifications are subject
            to change as per architectural and structural requirements.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
