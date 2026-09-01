import Image from 'next/image';
import { BUILDER } from '@/lib/site';
import { MotifBand, PetalField } from './brand/BrandGraphics';
import Reveal from './ui/Reveal';
import SectionHeading from './ui/SectionHeading';

export default function Builder() {
  return (
    <section id="builder" className="on-dark relative isolate overflow-hidden bg-teal-800">
      <Image
        src="/assets/builder/builder-profile-bg-01.jpg"
        alt=""
        fill
        sizes="100vw"
        className="object-cover opacity-[0.18]"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-teal-950/85 via-teal-800/92 to-teal-800" />
      <div className="absolute inset-0 text-paper">
        <PetalField opacity={0.05} />
      </div>
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden text-paper lg:block">
        <MotifBand opacity={0.08} className="h-full" />
      </div>

      <div className="shell relative section-y">
        <SectionHeading
          onDark
          eyebrow="The developers"
          title={BUILDER.heading}
          body={<p>{BUILDER.body}</p>}
          className="max-w-3xl"
        />

        {/* Track record — projects only. */}
        <Reveal delay={0.08}>
          <p className="mt-14 text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-mist-300">
            Past &amp; ongoing projects
          </p>
        </Reveal>
        <ul className="mt-5 grid gap-px overflow-hidden rounded-card bg-paper/12 sm:grid-cols-2 lg:grid-cols-4">
          {BUILDER.portfolio.map((project, i) => (
            <Reveal as="li" key={project.name} delay={(i % 4) * 0.05} className="bg-teal-800">
              <div className="flex h-full flex-col justify-between gap-8 p-6 sm:p-7">
                <span
                  className={`inline-flex w-fit rounded-full border-[0.8px] px-2.5 py-1 text-[0.5625rem] font-semibold uppercase tracking-[0.16em] ${
                    project.status === 'Completed'
                      ? 'border-mist-300/50 text-mist-200'
                      : 'border-sky-400/60 text-sky-400'
                  }`}
                >
                  {project.status}
                </span>
                <div>
                  <p className="font-display text-[1.5rem] leading-tight text-paper">{project.name}</p>
                  {project.note && <p className="mt-2 text-sm text-mist-300">{project.note}</p>}
                </div>
              </div>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={0.1}>
          <p className="mt-10 border-t-[0.8px] border-paper/15 pt-6 text-xs leading-relaxed text-mist-300">
            {BUILDER.consultants}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
