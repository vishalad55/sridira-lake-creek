'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Download } from 'lucide-react';
import { cn } from '@/lib/cn';
import { HERO_IMAGES, LEAD_SOURCES, PROJECT } from '@/lib/site';
import { Wordmark } from './brand/BrandGraphics';
import LeadCTA from './ui/LeadCTA';

const ROTATE_MS = 7000;

/**
 * Deliberately spare: identity, one line, one promise, two actions. The scrim is
 * kept light so the photography carries the section — just enough gradient under
 * the text block to hold contrast, rather than a wash over the whole frame.
 */
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
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 1.4 }, scale: { duration: 9, ease: 'linear' } }}
          >
            <Image
              src={HERO_IMAGES[index].src}
              alt={HERO_IMAGES[index].alt}
              fill
              priority={index === 0}
              fetchPriority={index === 0 ? 'high' : 'auto'}
              quality={90}
              sizes="100vw"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {/* A whisper of navy for cohesion, then one gradient under the copy. */}
        <div className="absolute inset-0 bg-navy-950/20" />
        <div className="absolute inset-x-0 bottom-0 h-[68%] bg-gradient-to-t from-navy-950/85 via-navy-950/40 to-transparent" />
      </div>

      <div className="on-dark shell relative pb-16 pt-[calc(var(--header-h)+4rem)] sm:pb-20 md:pb-24">
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="flex justify-center text-paper"
          >
            <Wordmark variant="stacked" className="w-[11.5rem] shrink-0 sm:w-[14rem]" />
          </motion.div>

          <motion.h1
            className="mt-10 font-display text-display-xl text-paper text-shadow-hero"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          >
            Welcome Home.
          </motion.h1>

          <motion.p
            className="mx-auto mt-6 max-w-md text-[0.8125rem] font-medium uppercase tracking-[0.24em] text-mist-100 text-shadow-hero"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            {PROJECT.tagline}
          </motion.p>

          <motion.div
            className="mt-11 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
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

      {/* Slide indicators, centred and understated. */}
      <div className="shell relative flex justify-center pb-8">
        <div className="flex items-center gap-2.5" role="tablist" aria-label="Hero images">
          {HERO_IMAGES.map((image, i) => (
            <button
              key={image.src}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Show image ${i + 1}`}
              onClick={() => setIndex(i)}
              className={cn(
                'h-[2px] rounded-full transition-all duration-700 ease-brand',
                i === index ? 'w-12 bg-paper' : 'w-6 bg-paper/40 hover:bg-paper/70',
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
