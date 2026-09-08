import Image from 'next/image';
import { CalendarClock, FileText, IndianRupee } from 'lucide-react';
import { CONTACT, LEAD_SOURCES } from '@/lib/site';
import LeadForm from './LeadForm';
import { ContourLines } from './brand/BrandGraphics';
import Reveal from './ui/Reveal';

const PROMISES = [
  { icon: IndianRupee, title: 'Current price sheet', note: 'Pre-launch pricing, shared privately.' },
  { icon: FileText, title: 'All six floor plans', note: 'Full resolution, all six layouts.' },
  { icon: CalendarClock, title: 'A callback', note: `Within ${CONTACT.callbackHours} hours, at a time that suits you.` },
];

/** The main inline capture block, placed roughly two-thirds down the page. */
export default function InlineLeadBlock() {
  return (
    <section id="enquire" className="on-dark relative isolate overflow-hidden bg-navy-900">
      <Image
        src="/assets/hero-exterior/horizon-03.jpg"
        alt=""
        fill
        sizes="100vw"
        className="object-cover opacity-25"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-900/95 to-navy-900/70" />
      <div className="absolute inset-0 text-sky-400">
        <ContourLines opacity={0.14} />
      </div>

      <div className="shell relative section-y">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="lg:pr-8">
            <Reveal>
              <p className="eyebrow-on-dark">Get exclusive pre-launch pricing</p>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-4 font-display text-display-lg text-paper">
                Pricing is shared privately. Ask, and it&apos;s yours.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-5 max-w-prose text-body-lg text-mist-200">
                We don&apos;t publish rates for Sridira Lake Creek. Leave your details and our sales team will send
                everything you need to compare it properly.
              </p>
            </Reveal>

            <ul className="mt-10 space-y-5">
              {PROMISES.map((promise, i) => (
                <Reveal as="li" key={promise.title} delay={0.12 + i * 0.06}>
                  <div className="flex items-start gap-4">
                    <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-[0.8px] border-paper/25 text-mist-200">
                      <promise.icon className="h-4 w-4" aria-hidden />
                    </span>
                    <div>
                      <p className="text-[0.9375rem] font-semibold text-paper">{promise.title}</p>
                      <p className="mt-0.5 text-sm text-mist-300">{promise.note}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>

          <Reveal delay={0.08}>
            <div className="rounded-card bg-paper p-6 shadow-lift-lg sm:p-8">
              <p className="eyebrow">Register your interest</p>
              <h3 className="mt-3 font-display text-display-sm text-ink">Tell us where to send it.</h3>
              <div className="mt-6">
                <LeadForm source={LEAD_SOURCES.inline} variant="inline" />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
