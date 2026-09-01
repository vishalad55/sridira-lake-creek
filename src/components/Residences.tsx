import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { LEAD_SOURCES, RESIDENCES } from '@/lib/site';
import LeadCTA from './ui/LeadCTA';
import Reveal from './ui/Reveal';

/**
 * Mirrors the reference site's "The Home Everyone Wants" block — a full-bleed
 * image statement followed by configuration cards. Lake Creek has a single
 * configuration in Phase 1, so it is presented as one featured card rather
 * than a selector.
 */
export default function Residences() {
  const { config } = RESIDENCES;

  return (
    <section id="residences" className="section-y bg-paper">
      <div className="shell">
        <div className="relative isolate overflow-hidden rounded-organic">
          <div className="relative aspect-[4/5] w-full sm:aspect-[16/10] lg:aspect-[16/8]">
            <Image
              src="/assets/lifestyle-lake/residences-corner-06.jpg"
              alt="A corner residence at Sridira Lake Creek with wraparound balconies"
              fill
              sizes="(max-width: 1280px) 100vw, 1248px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/45 to-navy-950/15" />
          </div>

          <div className="on-dark absolute inset-x-0 bottom-0 p-6 sm:p-10 lg:p-14">
            <Reveal>
              <p className="eyebrow-on-dark">Phase 1 · 3 BHK only</p>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-4 font-display text-display-lg text-paper text-shadow-hero">{RESIDENCES.heading}</h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-5 max-w-prose text-body-lg text-mist-100">{RESIDENCES.body}</p>
            </Reveal>
          </div>
        </div>

        {/* Featured configuration card — one config, so no selector. */}
        <Reveal delay={0.08} className="mx-auto mt-10 max-w-3xl">
          <div className="overflow-hidden rounded-card border-[0.8px] border-hairline bg-panel shadow-lift">
            <div className="flex flex-col gap-8 p-7 sm:p-9 md:flex-row md:items-center md:justify-between">
              <div>
                <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-teal-800">
                  {config.tag}
                </span>
                <p className="mt-3 font-display text-[2.5rem] leading-none text-ink sm:text-[3rem]">{config.title}</p>
                <p className="mt-3 text-sm font-semibold uppercase tracking-[0.14em] text-ink-soft">{config.size}</p>
              </div>

              <div className="md:text-right">
                <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-ink-faint">
                  Pricing on request
                </p>
                <LeadCTA
                  source={LEAD_SOURCES.residences}
                  intent="floor-plans"
                  className="btn-primary mt-4 w-full md:w-auto"
                  icon={<ArrowRight className="h-3.5 w-3.5" aria-hidden />}
                  title={config.cta}
                  blurb="Six 3 BHK layouts from 1700 to 1870 Sft. Share your details and we will unlock the full plans and send the price sheet."
                >
                  {config.cta}
                </LeadCTA>
              </div>
            </div>

            <dl className="grid grid-cols-2 border-t-[0.8px] border-hairline sm:grid-cols-4">
              {config.highlights.map((item, i) => (
                <div
                  key={item.label}
                  className={`px-5 py-5 ${i > 0 ? 'border-l-[0.8px] border-hairline' : ''} ${
                    i === 2 ? 'border-l-0 sm:border-l-[0.8px]' : ''
                  } ${i > 1 ? 'border-t-[0.8px] sm:border-t-0' : ''}`}
                >
                  <dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-ink">{item.label}</dt>
                  <dd className="mt-1.5 text-sm text-ink-faint">{item.note}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
