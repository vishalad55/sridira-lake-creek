'use client';

import Image from 'next/image';
import { ExternalLink, Lock, Unlock } from 'lucide-react';
import { cn } from '@/lib/cn';
import { FLOOR_PLANS, LEAD_SOURCES } from '@/lib/site';
import Reveal from './ui/Reveal';
import SectionHeading from './ui/SectionHeading';
import { useLead } from './LeadProvider';

/**
 * The primary lead gate for the whole site. Layouts are shown blurred with
 * their real stats visible; a successful submission anywhere on the page sets
 * the session unlock flag and every plan resolves in place.
 */
export default function FloorPlans() {
  const { open, unlocked } = useLead();

  return (
    <section id="floor-plans" className="section-y bg-paper">
      <div className="shell">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <SectionHeading
            eyebrow="Floor plans"
            tag={unlocked ? 'Unlocked' : '6 layouts · gated'}
            title="The horizon, now part of your home."
            body={
              <p>
                Six 3 BHK corner layouts from 1715 to 1870 SFT. Unlock any one of them and we will send the
                full-resolution plans along with the price sheet.
              </p>
            }
          />
          {unlocked && (
            <Reveal delay={0.05} className="lg:pb-2">
              <p className="inline-flex items-center gap-2 rounded-full border-[0.8px] border-teal-800/35 bg-teal-100/60 px-4 py-2 text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-teal-800">
                <Unlock className="h-3.5 w-3.5" aria-hidden />
                All plans unlocked
              </p>
            </Reveal>
          )}
        </div>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FLOOR_PLANS.map((plan, i) => (
            <Reveal as="li" key={plan.id} delay={(i % 3) * 0.06}>
              <article className="group flex h-full flex-col overflow-hidden rounded-card border-[0.8px] border-hairline bg-panel transition-shadow duration-300 hover:shadow-lift">
                <div className="relative aspect-[4/3] overflow-hidden bg-mist-50">
                  <Image
                    src={plan.image}
                    alt={
                      unlocked
                        ? `${plan.label} floor plan — ${plan.config}, ${plan.sft}`
                        : `${plan.label} floor plan preview — unlock to view`
                    }
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    style={{ objectPosition: plan.position }}
                    className={cn(
                      'object-cover transition-[filter,transform] duration-700 ease-brand',
                      !unlocked && 'gated',
                    )}
                  />

                  {!unlocked && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-navy-950/35 p-4 text-center">
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-paper/95 text-navy-900">
                        <Lock className="h-4 w-4" aria-hidden />
                      </span>
                      <p className="text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-paper">
                        Layout locked
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-display text-[1.5rem] leading-none text-ink">{plan.label}</h3>
                    <span className="text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-teal-800">
                      {plan.config}
                    </span>
                  </div>
                  <p className="mt-3 text-[0.9375rem] text-ink">{plan.sft}</p>
                  <p className="mt-1 text-sm text-ink-faint">{plan.facing}</p>

                  {unlocked ? (
                    <a
                      href={plan.image}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-ghost mt-5 w-full"
                    >
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                      View full size
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        open(LEAD_SOURCES.floorPlan, {
                          intent: plan.id,
                          title: `Unlock ${plan.label}`,
                          blurb: `${plan.config} · ${plan.sft} · ${plan.facing}. Share your details to reveal every layout on this page and receive the full-resolution plans.`,
                        })
                      }
                      className="btn btn-sm btn-primary mt-5 w-full"
                    >
                      Unlock Full Layout
                    </button>
                  )}
                </div>
              </article>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={0.1}>
          <p className="mt-8 max-w-prose text-sm text-ink-faint">
            Areas shown are Super Built-Up Area (SBUA) as per the brochure. Layouts are indicative — confirm the
            final unit plan with the sales team before booking.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
