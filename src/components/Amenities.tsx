import Image from 'next/image';
import { cn } from '@/lib/cn';
import { Baby, Dumbbell, Flower2, PartyPopper, Trees, Waves } from 'lucide-react';
import { AMENITY_CATEGORIES, AMENITY_IMAGES, LEAD_SOURCES } from '@/lib/site';
import LeadCTA from './ui/LeadCTA';
import Reveal from './ui/Reveal';
import SectionHeading from './ui/SectionHeading';
import { MotifBand, PetalField } from './brand/BrandGraphics';

const ICONS = {
  wellness: Flower2,
  sports: Dumbbell,
  kids: Baby,
  nature: Trees,
  water: Waves,
  social: PartyPopper,
} as const;

export default function Amenities() {
  return (
    <section id="amenities" className="on-dark relative isolate overflow-hidden section-y bg-teal-800">
      <div className="absolute inset-0 text-paper">
        <PetalField opacity={0.05} />
      </div>
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden text-paper lg:block">
        <MotifBand opacity={0.07} className="h-full" />
      </div>
      <div className="shell relative">
        <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <SectionHeading
            onDark
            eyebrow="From wellness to recreation"
            tag="50+ Amenities"
            title="A full life, without leaving home."
            body={
              <p>
                Six worlds of amenity woven through 70% open space — wellness gardens, sports courts, kids&apos; zones,
                urban forest, water experiences and social greens.
              </p>
            }
          />
          <Reveal delay={0.1} className="lg:pb-2">
            <LeadCTA
              source={LEAD_SOURCES.amenities}
              intent="brochure"
              className="btn-on-dark w-full sm:w-auto"
              title="See the full amenity list"
              blurb="The brochure carries the complete amenity plan across all six zones, plus the master plan and specifications."
            >
              Get the full list
            </LeadCTA>
          </Reveal>
        </div>

        {/* Categorised grid — the six brochure groupings. */}
        <ul className="mt-12 grid gap-px overflow-hidden rounded-card bg-paper/10 sm:grid-cols-2 lg:grid-cols-3">
          {AMENITY_CATEGORIES.map((category, i) => {
            const Icon = ICONS[category.icon as keyof typeof ICONS];
            return (
              <Reveal as="li" key={category.name} delay={(i % 3) * 0.06} className="bg-teal-800">
                <div className="h-full p-6 transition-colors duration-300 hover:bg-teal-700 sm:p-7">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border-[0.8px] border-paper/25 text-mist-200">
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  <h3 className="mt-5 font-display text-[1.5rem] leading-none text-paper">{category.name}</h3>
                  <ul className="mt-4 space-y-2">
                    {category.items.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm text-mist-200">
                        <span className="mt-[0.55rem] h-1 w-1 shrink-0 rounded-full bg-mist-400" aria-hidden />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            );
          })}
        </ul>

        {/* Amenity imagery — portrait renders from the brochure, on a 3-up grid.
            The first and last tiles carry the petal corner so the identity's
            shape language frames the photography. */}
        <ul className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-3">
          {AMENITY_IMAGES.map((image, i) => (
            <Reveal as="li" key={image.src} delay={(i % 3) * 0.06}>
              <div
                className={cn(
                  'relative aspect-[3/4] overflow-hidden rounded-card',
                  i === 0 && 'petal-panel',
                  i === AMENITY_IMAGES.length - 1 && 'petal-panel petal-panel-alt',
                )}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 31vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
