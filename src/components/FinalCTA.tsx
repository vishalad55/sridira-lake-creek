import Image from 'next/image';
import { LEAD_SOURCES } from '@/lib/site';
import { PetalField, RippleRule } from './brand/BrandGraphics';
import LeadCTA from './ui/LeadCTA';
import Reveal from './ui/Reveal';

/**
 * The brochure's closing device: a flat, semi-transparent brand-colour panel
 * laid over photography, rather than a full-width scrim.
 */
export default function FinalCTA() {
  return (
    <section aria-labelledby="final-cta-title" className="relative isolate">
      <div className="relative flex min-h-[30rem] items-center overflow-hidden md:min-h-[38rem]">
        <Image
          src="/assets/lifestyle-lake/crafted-lifestyle-08.jpg"
          alt="Evening by the water at Sridira Lake Creek, Horamavu"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-navy-950/50" />

        <div className="shell relative py-16 md:py-24">
          <div className="on-dark relative isolate mx-auto max-w-3xl overflow-hidden bg-navy-900/92 px-6 py-14 text-center backdrop-blur-[2px] sm:px-14 sm:py-16">
            <div className="absolute inset-0 text-paper">
              <PetalField opacity={0.06} />
            </div>

            <div className="relative">
              <Reveal>
                <div className="flex justify-center text-sky-400">
                  <RippleRule className="h-5 w-32" />
                </div>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 id="final-cta-title" className="mt-6 font-display text-display-lg text-paper">
                  A place to slow down. A place to call yours.
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mx-auto mt-6 max-w-prose text-body-lg text-mist-100">
                  Phase 1 is open for registrations. Pricing, floor plans and the brochure are one form away.
                </p>
              </Reveal>
              <Reveal delay={0.16}>
                <LeadCTA
                  source={LEAD_SOURCES.finalCta}
                  className="btn-on-dark mt-9"
                  title="Register your interest"
                  blurb="Be among the first to receive Phase 1 pricing, the full floor plans and the brochure for Sridira Lake Creek."
                >
                  Register Your Interest
                </LeadCTA>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
