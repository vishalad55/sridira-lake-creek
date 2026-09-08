import Image from 'next/image';
import { LEAD_SOURCES, MASTER_PLAN } from '@/lib/site';
import LeadCTA from './ui/LeadCTA';
import Reveal from './ui/Reveal';
import SectionHeading from './ui/SectionHeading';

export default function MasterPlan() {
  return (
    <section id="master-plan" className="section-y bg-mist-50">
      <div className="shell">
        <SectionHeading
          eyebrow="Master plan"
          tag="4.48 acres · 70% open"
          title={MASTER_PLAN.heading}
          body={
            <p>
              Two towers set back from the water, with the clubhouse, pool deck and forest trail arranged so that
              every home looks onto green rather than onto another home.
            </p>
          }
        />

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:gap-14">
          <Reveal>
            <figure className="overflow-hidden rounded-card border-[0.8px] border-hairline bg-panel p-3 shadow-lift sm:p-5">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[0.375rem] bg-mist-100">
                <Image
                  src={MASTER_PLAN.image}
                  alt="Master plan of Sridira Lake Creek showing towers, clubhouse, pool deck, jogging track and forest trail"
                  fill
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-contain"
                />
              </div>
              <figcaption className="mt-4 px-1 text-xs text-ink-faint">
                Indicative master plan. Not to scale — refer to the sanctioned plan for final dimensions.
              </figcaption>
            </figure>
          </Reveal>

          <Reveal delay={0.08}>
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-ink-faint">
              Highlights on plan
            </p>
            <ol className="mt-5 border-t-[0.8px] border-hairline">
              {MASTER_PLAN.legend.map((item) => (
                <li
                  key={item.n}
                  className="flex items-center gap-4 border-b-[0.8px] border-hairline py-3.5 text-[0.9375rem] text-ink"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-[0.8px] border-hairline bg-panel font-display text-xs text-ink-soft">
                    {String(item.n).padStart(2, '0')}
                  </span>
                  {item.label}
                </li>
              ))}
            </ol>
            <p className="mt-5 text-sm text-ink-faint">
              Ten of the thirty numbered points on the sanctioned master plan. The full legend is in the brochure.
            </p>
            <LeadCTA
              source={LEAD_SOURCES.masterPlan}
              intent="master-plan"
              className="btn-primary mt-6 w-full sm:w-auto"
              title="Get the full master plan"
              blurb="We will send the high-resolution master plan with the complete 30-point legend, along with the brochure."
            >
              Get the full master plan
            </LeadCTA>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
