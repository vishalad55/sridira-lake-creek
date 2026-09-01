import { QUICK_FACTS } from '@/lib/site';
import { MotifBand, PetalField } from './brand/BrandGraphics';
import Reveal from './ui/Reveal';

/**
 * "At a glance", laid out the way the brochure lays it out: a navy field, a
 * widely-tracked title with a hairline rule beneath it, and each fact as a
 * display-face value followed by a small caption on the same baseline.
 */
export default function StatBar() {
  return (
    <section
      id="at-a-glance"
      aria-labelledby="at-a-glance-title"
      className="on-dark relative isolate overflow-hidden bg-navy-900"
    >
      <div className="absolute inset-0 text-paper">
        <PetalField opacity={0.05} />
      </div>
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden text-paper lg:block">
        <MotifBand opacity={0.07} className="h-full" />
      </div>

      <div className="shell relative py-14 md:py-20">
        <Reveal className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
          <h2 id="at-a-glance-title" className="font-sans text-brand-title font-light uppercase text-paper">
            At a Glance
          </h2>
          <span className="text-[0.625rem] font-semibold uppercase tracking-[0.22em] text-sky-400">Phase 1</span>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="mt-5 h-px w-full bg-paper/25" />
        </Reveal>

        <dl className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {QUICK_FACTS.map((fact, i) => (
            <Reveal key={fact.unit} delay={i * 0.05}>
              <div className="flex flex-wrap items-baseline gap-x-3">
                <dt className="sr-only">{fact.unit}</dt>
                <dd className="flex flex-wrap items-baseline gap-x-3">
                  <span className="font-display text-stat text-paper">{fact.value}</span>
                  <span className="font-display text-[1.375rem] leading-none text-paper sm:text-[1.625rem]">
                    {fact.unit}
                  </span>
                  <span className="text-sm text-mist-200">{fact.caption}</span>
                </dd>
              </div>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
