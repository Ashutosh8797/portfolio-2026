'use client';

import { motion } from 'framer-motion';
import { SectionHeader } from './SectionHeader';
import { Marquee } from './Marquee';
import { DriftHeader, GhostWord } from './ScrollEffects';
import { useSectionDrive, useVelocitySkew } from '@/hooks/useScrollEffects';
import { certifications, certificationsDriveUrl } from '@/data/portfolio';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

export function Certifications() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const animated = !prefersReducedMotion;
  const { ref: driveRef, progress } = useSectionDrive();
  const skewX = useVelocitySkew();

  return (
    <section
      id="certifications"
      className="relative z-20 overflow-hidden bg-bg py-12 md:py-16"
      aria-labelledby="certifications-heading"
    >
      <GhostWord animated={animated} text="Proof" className="left-0 top-10 text-[18vw]" />
      <div ref={driveRef} className="relative mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16">
        <DriftHeader progress={progress} animated={animated}>
          <SectionHeader
            id="certifications-heading"
            eyebrow="Certifications"
            heading="Certifications"
            subtext="Verified certifications across cloud, software engineering, databases, and English proficiency."
          />
        </DriftHeader>

        <motion.div
          className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-4"
          style={animated ? { skewX } : undefined}
          initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {certifications.map((cert, index) => (
            <CertificationCard
              key={cert.id}
              cert={cert}
              index={index}
              prefersReducedMotion={prefersReducedMotion}
            />
          ))}
        </motion.div>

        <motion.div
          className="mt-10 flex justify-center"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <motion.a
            href={certificationsDriveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary accent-gradient-border"
            whileHover={prefersReducedMotion ? undefined : { scale: 1.05 }}
            whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
          >
            View all
            <span aria-hidden="true"> ↗</span>
          </motion.a>
        </motion.div>
      </div>
      <Marquee reverse duration={36} items={certifications.map((c) => c.title)} />
    </section>
  );
}

function CertificationCard({
  cert,
  index,
  prefersReducedMotion,
}: {
  cert: (typeof certifications)[0];
  index: number;
  prefersReducedMotion: boolean;
}) {
  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
      whileHover={prefersReducedMotion ? undefined : { y: -6, transition: { duration: 0.3, ease: 'easeOut' } }}
      className="certification-card group flex items-start gap-4"
    >
      <motion.div
        className="mb-4 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl accent-gradient transition-transform duration-300 group-hover:scale-110"
        whileHover={{ scale: 1.1, rotate: 5, transition: { type: 'spring', stiffness: 400 } }}
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.1 + 0.2, type: 'spring', stiffness: 400 }}
      >
        <svg
          className="h-6 w-6 text-bg"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </motion.div>

      <div className="min-w-0 flex-1">
        <motion.h3
          className="mb-1 text-pretty font-medium text-text-primary transition-colors group-hover:text-accent"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 + 0.1 }}
        >
          {cert.title}
        </motion.h3>
        <motion.p
          className="text-pretty text-sm text-muted"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 + 0.15 }}
        >
          {cert.issuer}
        </motion.p>
      </div>

      {cert.url && (
        <motion.span
          className="mt-1 shrink-0 text-sm text-muted transition-transform duration-300 group-hover:translate-x-1"
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
        >
          ↗
        </motion.span>
      )}
    </motion.div>
  );
}
