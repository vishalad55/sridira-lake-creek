import Image from 'next/image';
import { Droplets, Leaf, Maximize2, ShieldCheck, Telescope } from 'lucide-react';
import { OPEN_BY_DESIGN } from '@/lib/site';
import { PetalField } from './brand/BrandGraphics';
import Reveal from './ui/Reveal';
import SectionHeading from './ui/SectionHeading';

const ICONS = {
  expand: Maximize2,
  view: Telescope,
  water: Droplets,
  leaf: Leaf,
  shield: ShieldCheck,
} as const;

export default function OpenByDesign() {
  return (
    <>
      {/* Navy band — the first of the two alternating brand grounds. */}
      <section id="open-by-design" className="on-dark relative isolate overflow-hidden section-y bg-navy-900">
        <div className="absolute inset-0 text-paper">
          <PetalField opacity={0.05} />
        </div>
        <div className="shell relative grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              onDark
              eyebrow={OPEN_BY_DESIGN.eyebrow}
              title={OPEN_BY_DESIGN.heading}
              body={<p>{OPEN_BY_DESIGN.body}</p>}
            />

            <ul className="mt-10 divide-y-[0.8px] divide-paper/10 border-y-[0.8px] border-paper/10">
              {OPEN_BY_DESIGN.features.map((feature, i) => {
                const Icon = ICONS[feature.icon as keyof typeof ICONS];
                return (
                  <Reveal as="li" key={feature.title} delay={i * 0.05}>
                    <div className="flex items-start gap-4 py-4">
                      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-[0.8px] border-paper/25 text-mist-200">
                        <Icon className="h-4 w-4" aria-hidden />
                      </span>
                      <div>
                        <p className="text-[0.9375rem] font-semibold text-paper">{feature.title}</p>
                        <p className="mt-0.5 text-sm text-mist-300">{feature.note}</p>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </ul>
          </div>

          {/* The brochure's recurring organic curve motif. */}
          <Reveal delay={0.1} className="relative">
            <div className="petal-panel petal-panel-alt relative aspect-[4/5] overflow-hidden lg:aspect-[3/4]">
              <Image
                src="/assets/lifestyle-lake/biophilic-design-05.jpg"
                alt="Biophilic architecture at Sridira Lake Creek — planted terraces facing Horamavu Lake"
                fill
                sizes="(max-width: 1024px) 100vw, 46vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-5 -left-5 hidden max-w-[13rem] rounded-card bg-teal-800 p-5 shadow-lift-lg sm:block">
              <p className="font-display text-3xl leading-none text-paper">270°</p>
              <p className="mt-2 text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-teal-100">
                Open corner views
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Full-bleed image statement. */}
      <section aria-label="The horizon, now part of your home" className="relative isolate">
        <div className="relative h-[60vh] min-h-[380px] w-full overflow-hidden md:h-[70vh]">
          <Image
            src="/assets/lifestyle-lake/water-life-panel-02.jpg"
            alt="Uninterrupted lake and horizon views from a Sridira Lake Creek residence"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-navy-950/55" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950/80 via-navy-950/40 to-transparent" />
          <div className="on-dark absolute inset-0 flex items-center">
            <div className="shell">
              <Reveal>
                <p className="max-w-2xl font-display text-display-md text-paper text-shadow-hero">
                  The horizon, now part of your home.
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
