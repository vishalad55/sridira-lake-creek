import { Plus } from 'lucide-react';
import { FAQS, LEAD_SOURCES } from '@/lib/site';
import LeadCTA from './ui/LeadCTA';
import Reveal from './ui/Reveal';
import SectionHeading from './ui/SectionHeading';

export default function FAQ() {
  return (
    <section id="faq" className="section-y bg-paper">
      <div className="shell grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div>
          <SectionHeading
            eyebrow="FAQ"
            title="Frequently asked questions"
            body={
              <p>
                Anything not answered here, our sales team will cover on your callback — including pricing, payment
                plans and possession.
              </p>
            }
          />
          <Reveal delay={0.1}>
            <LeadCTA
              source={LEAD_SOURCES.finalCta}
              className="btn-ghost mt-8"
              title="Ask the sales team"
              blurb="Send your question along with your details and we will come back to you with a straight answer."
            >
              Ask a question
            </LeadCTA>
          </Reveal>
        </div>

        <div className="border-t-[0.8px] border-hairline">
          {FAQS.map((faq, i) => (
            <Reveal key={faq.q} delay={i * 0.03}>
              <details className="group border-b-[0.8px] border-hairline">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-left [&::-webkit-details-marker]:hidden">
                  <h3 className="max-w-2xl font-display text-[1.1875rem] leading-snug text-ink sm:text-[1.375rem]">
                    {faq.q}
                  </h3>
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-[0.8px] border-hairline text-ink-soft transition-transform duration-300 ease-brand group-open:rotate-45">
                    <Plus className="h-4 w-4" aria-hidden />
                  </span>
                </summary>
                <p className="max-w-prose pb-6 pr-10 text-[0.9375rem] leading-relaxed text-ink-soft">{faq.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
