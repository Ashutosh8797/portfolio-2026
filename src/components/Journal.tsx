'use client';

import { motion } from 'framer-motion';
import { SectionHeader } from './SectionHeader';
import { journalEntries } from '@/data/portfolio';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

export function Journal() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <section id="journal" className="bg-bg py-12 md:py-16" aria-labelledby="journal-heading">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16">
        <SectionHeader
          id="journal-heading"
          eyebrow="Learning & Building"
          heading="Recent explorations"
          headingHighlight="explorations"
          subtext="Things I'm learning, building, and exploring across AI, software development, and autonomous systems."
        />

        <motion.div
          className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-4"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {journalEntries.map((entry, index) => (
            <JournalCard
              key={entry.id}
              entry={entry}
              index={index}
              prefersReducedMotion={prefersReducedMotion}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function JournalCard({
  entry,
  index,
  prefersReducedMotion,
}: {
  entry: (typeof journalEntries)[0];
  index: number;
  prefersReducedMotion: boolean;
}) {
  return (
    <motion.article
      className="journal-entry"
      initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
      whileHover={prefersReducedMotion ? undefined : { y: -6, transition: { duration: 0.3, ease: 'easeOut' } }}
    >
      <motion.div
        className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.1em] text-muted"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <span className="rounded-full bg-stroke/50 px-2 py-1">{entry.topic}</span>
      </motion.div>
      <motion.h3
        className="mb-3 font-display text-lg italic text-text-primary transition-colors group-hover:text-accent md:text-xl"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        {entry.title}
      </motion.h3>
      <motion.p
        className="text-pretty text-sm leading-relaxed text-muted"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {entry.description}
      </motion.p>
    </motion.article>
  );
}