'use client';

import { motion } from 'framer-motion';
import { SectionHeader } from './SectionHeader';
import { DriftHeader, GhostWord } from './ScrollEffects';
import { useSectionDrive, useVelocitySkew } from '@/hooks/useScrollEffects';
import { education, type EducationEntry } from '@/data/portfolio';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

export function Education() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const animated = !prefersReducedMotion;
  const { ref: driveRef, progress } = useSectionDrive();
  const skewX = useVelocitySkew();

  return (
    <section
      id="about"
      className="relative z-10 overflow-hidden bg-bg py-12 md:py-16"
      aria-labelledby="education-heading"
    >
      <GhostWord animated={animated} text="Study" reverse className="left-0 top-8 text-[20vw]" />
      <div ref={driveRef} className="relative mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16">
        <DriftHeader progress={progress} animated={animated}>
          <SectionHeader
            id="education-heading"
            eyebrow="Education"
            heading="The foundation"
            headingHighlight="foundation"
            subtext="My academic journey from school through university, specialising in Artificial Intelligence and Autonomous Systems."
          />
        </DriftHeader>

        <motion.div
          className="mt-12 space-y-5 md:space-y-6"
          style={animated ? { skewX } : undefined}
          initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {education.map((entry, index) => (
            <EducationCard key={entry.id} entry={entry} index={index} prefersReducedMotion={prefersReducedMotion} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function EducationCard({
  entry,
  index,
  prefersReducedMotion,
}: {
  entry: EducationEntry;
  index: number;
  prefersReducedMotion: boolean;
}) {
  const isCurrent = index === 0;

  return (
    <motion.article
      className="glass-card group relative overflow-hidden rounded-3xl p-6 md:p-8"
      initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
      whileHover={prefersReducedMotion ? undefined : { y: -4, transition: { duration: 0.3 } }}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#89AACC]/5 to-[#4E85BF]/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 flex-1">
          <motion.div
            className="mb-3 flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.1em] text-muted"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <span className="rounded-full border border-stroke/50 bg-stroke/50 px-3 py-1 font-medium text-text-primary">
              {entry.period}
            </span>
            {isCurrent && (
              <span className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 font-medium text-text-primary">
                Current
              </span>
            )}
          </motion.div>

          <motion.h3
            className="mb-1 font-display text-2xl italic text-text-primary md:text-3xl"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            {entry.institution}
          </motion.h3>
          <motion.p
            className="mb-4 text-lg text-text-primary/80"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {entry.degree}
          </motion.p>

          <motion.div
            className="mb-4 inline-flex items-center gap-2 rounded-xl border border-stroke/30 bg-stroke/30 px-4 py-2"
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.25, type: 'spring', stiffness: 400 }}
          >
            <span className="text-sm text-muted">Grade</span>
            <span className="font-display text-xl font-medium italic text-text-primary">
              {entry.grade}
            </span>
          </motion.div>

          {entry.specialization && (
            <motion.div className="mb-4" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }}>
              <p className="mb-1.5 text-sm text-muted">Specialization</p>
              <p className="font-medium text-text-primary">{entry.specialization}</p>
            </motion.div>
          )}

          {entry.coursework && entry.coursework.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.35 }}
            >
              <p className="mb-3 text-sm uppercase tracking-[0.1em] text-muted">
                Relevant Coursework
              </p>
              <div className="flex flex-wrap gap-2">
                {entry.coursework.map((course, i) => (
                  <motion.span
                    key={course}
                    className="rounded-full border border-stroke/30 bg-stroke/30 px-3 py-1.5 text-sm text-muted transition-colors duration-300 hover:border-accent/30 hover:text-text-primary"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.4 + i * 0.05, type: 'spring', stiffness: 400 }}
                  >
                    {course}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {isCurrent && (
          <motion.div
            className="hidden h-24 w-24 shrink-0 rounded-2xl accent-gradient opacity-20 md:block"
            animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.02, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            aria-hidden="true"
          />
        )}
      </div>
    </motion.article>
  );
}