'use client';

import { motion } from 'framer-motion';
import { SectionHeader } from './SectionHeader';
import { ProjectCard } from './ProjectCard';
import { DriftHeader, GhostWord } from './ScrollEffects';
import { useSectionDrive, useVelocitySkew } from '@/hooks/useScrollEffects';
import { personalInfo, projects } from '@/data/portfolio';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

export function SelectedWork() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const animated = !prefersReducedMotion;
  const { ref: driveRef, progress } = useSectionDrive();
  const skewX = useVelocitySkew();

  // Bento spans 7 / 5 / 5 / 7
  const colSpans = [
    'col-span-12 md:col-span-7',
    'col-span-12 md:col-span-5',
    'col-span-12 md:col-span-5',
    'col-span-12 md:col-span-7',
  ];

  return (
    <section id="work" className="relative overflow-hidden bg-bg py-12 md:py-16" aria-labelledby="work-heading">
      <GhostWord animated={animated} text="Work" className="left-0 top-4 text-[22vw]" />
      <div ref={driveRef} className="relative mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <DriftHeader progress={progress} animated={animated}>
            <SectionHeader
              id="work-heading"
              eyebrow="Selected Work"
              heading="Featured projects"
              headingHighlight="projects"
              subtext="A selection of AI, computer vision, and full-stack projects I've built from idea to implementation."
            />
          </DriftHeader>

          <motion.a
            href={personalInfo.github}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary accent-gradient-border hidden shrink-0 md:inline-flex"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View all work
            <span aria-hidden="true"> →</span>
          </motion.a>
        </div>

        <motion.div
          className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-12 md:gap-6"
          style={animated ? { skewX } : undefined}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              colSpan={colSpans[index] ?? 'col-span-12 md:col-span-6'}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
