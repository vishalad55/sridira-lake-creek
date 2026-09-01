import { MapPin } from 'lucide-react';
import { LEAD_SOURCES, LOCATION, PROJECT } from '@/lib/site';
import LeadCTA from './ui/LeadCTA';
import Reveal from './ui/Reveal';
import SectionHeading from './ui/SectionHeading';

export default function Location() {
  return (
    <section id="location" className="section-y bg-paper">
      <div className="shell">
        <SectionHeading
          eyebrow="Why Horamavu"
          title={LOCATION.heading}
          body={<p>{LOCATION.body}</p>}
          className="max-w-3xl"
        />

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-14">
          {/* Distance list — bordered rows, matching the reference's connectivity block. */}
          <div>
            <Reveal>
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-ink-faint">
                A few minutes is all it takes
              </p>
            </Reveal>
            <ul className="mt-5 border-t-[0.8px] border-hairline">
              {LOCATION.distances.map((item, i) => (
                <Reveal as="li" key={item.place} delay={i * 0.04}>
                  <div className="flex items-baseline justify-between gap-6 border-b-[0.8px] border-hairline px-1 py-4 sm:px-2 sm:py-5">
                    <span className="flex items-baseline gap-3 text-[0.9375rem] text-ink">
                      <span
                        className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-teal-800"
                        aria-hidden
                      />
                      {item.place}
                    </span>
                    <span className="shrink-0 font-display text-[1.375rem] leading-none text-ink">{item.distance}</span>
                  </div>
                </Reveal>
              ))}
            </ul>

            <Reveal delay={0.1}>
              <p className="mt-6 text-sm text-ink-faint">
                Distances are approximate and measured by road from the project site at Horamavu, Bengaluru.
              </p>
              <LeadCTA
                source={LEAD_SOURCES.masterPlan}
                intent="site-visit"
                className="btn-ghost mt-6"
                icon={<MapPin className="h-3.5 w-3.5" aria-hidden />}
                title="Book a site visit"
                blurb="Pick a slot and we will arrange a guided walkthrough of the site and the lake frontage at Horamavu."
              >
                Book a site visit
              </LeadCTA>
            </Reveal>
          </div>

          {/* Map — dark label bar over the embed, as on the reference site. */}
          <Reveal delay={0.08}>
            <div className="overflow-hidden rounded-card border-[0.8px] border-hairline">
              <div className="flex items-center justify-between gap-4 bg-navy-900 px-5 py-4">
                <div>
                  <p className="text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-mist-300">
                    Beside Horamavu Lake
                  </p>
                  <p className="mt-1.5 font-display text-lg leading-none text-paper">{PROJECT.name}</p>
                </div>
                <a
                  href={LOCATION.mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-mist-200 link-underline"
                >
                  Open in Maps
                </a>
              </div>
              <iframe
                title={`Map of ${PROJECT.name}, Horamavu, Bengaluru`}
                src={LOCATION.mapEmbed}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                className="block h-[340px] w-full border-0 bg-mist-100 sm:h-[440px] lg:h-[520px]"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
