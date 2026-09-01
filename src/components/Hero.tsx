'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowDown, Download } from 'lucide-react';
import { cn } from '@/lib/cn';
import { HERO_IMAGES, LEAD_SOURCES, PROJECT } from '@/lib/site';
import { PetalField, Wordmark } from './brand/BrandGraphics';
import LeadCTA from './ui/LeadCTA';

const ROTATE_MS = 6500;

export default function Hero() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % HERO_IMAGES.length), ROTATE_MS);
    return () => clearInterval(id);
  }, [reduce]);

  return (
    <section id="top" className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden bg-navy-950">
      <div className="absolute inset-0 -z-10">
        <AnimatePresence initial={false}>
          <motion.div
            key={index}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 1.2 }, scale: { duration: 8, ease: 'linear' } }}
          >
            <Image
              src={HERO_IMAGES[index].src}
              alt={HERO_IMAGES[index].alt}
              fill
              priority={index === 0}
              fetchPriority={index === 0 ? 'high' : 'auto'}
              quality={82}
              sizes="100vw"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>
        {/* Navy scrim — the brand's primary field colour, not a neutral black. */}
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950/75 via-navy-900/30 to-navy-950/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950/55 to-transparent" />
        <div className="absolute inset-0 text-paper">
          <PetalField opacity={0.05} />
        </div>
      </div>

      <div className="on-dark shell relative pb-14 pt-[calc(var(--header-h)+3rem)] sm:pb-20 md:pb-24">
        <div className="mx-auto max-w-3xl text-center">
          {/* The identity leads, in the approved ivory colourway. */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex justify-center text-paper"
          >
            <Wordmark variant="stacked" className="w-[13rem] shrink-0 sm:w-[16rem]" />
          </motion.div>

          <motion.div
            className="mx-auto mt-8 h-px w-16 bg-paper/40"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          />

          <motion.h1
            className="mt-8 font-display text-display-xl text-paper text-shadow-hero"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
          >
            Welcome Home.
          </motion.h1>

          <motion.p
            className="mx-auto mt-5 max-w-xl text-[0.8125rem] font-medium uppercase tracking-[0.22em] text-sky-400"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            {PROJECT.tagline}
          </motion.p>

          <motion.p
            className="mx-auto mt-6 max-w-prose text-[0.9375rem] leading-relaxed text-mist-100"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {PROJECT.positioning}
          </motion.p>

          <motion.div
            className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.38, ease: [0.22, 1, 0.36, 1] }}
          >
            <LeadCTA
              source={LEAD_SOURCES.heroPrimary}
              className="btn-on-dark"
              title="Get pricing & floor plans"
              blurb="Pricing for Sridira Lake Creek is shared privately with interested buyers. Leave your details and our team will send the price sheet and full floor plans."
            >
              Get Pricing &amp; Floor Plans
            </LeadCTA>
            <LeadCTA
              source={LEAD_SOURCES.heroBrochure}
              intent="brochure"
              className="btn-ghost-dark"
              icon={<Download className="h-3.5 w-3.5" aria-hidden />}
              title="Download the brochure"
              blurb="The full Sridira Lake Creek brochure — layouts, specifications, amenities and master plan. Tell us where to send it."
            >
              Download Brochure
            </LeadCTA>
          </motion.div>
        </div>
      </div>

      <div className="shell relative flex items-center justify-between pb-6">
        <div className="flex items-center gap-2" role="tablist" aria-label="Hero images">
          {HERO_IMAGES.map((image, i) => (
            <button
              key={image.src}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Show image ${i + 1}`}
              onClick={() => setIndex(i)}
              className={cn(
                'h-[3px] rounded-full transition-all duration-500 ease-brand',
                i === index ? 'w-10 bg-paper' : 'w-5 bg-paper/35 hover:bg-paper/60',
              )}
            />
          ))}
        </div>
        <a
          href="#at-a-glance"
          className="flex items-center gap-2 text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-mist-200 transition-colors hover:text-paper"
        >
          Explore
          <ArrowDown className="h-3.5 w-3.5 animate-bounce" aria-hidden />
        </a>
      </div>
    </section>
  );
}
