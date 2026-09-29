'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Project } from '@/data/portfolio';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

interface ProjectCardProps {
  project: Project;
  colSpan?: string;
}

export function ProjectCard({
  project,
  colSpan = 'col-span-12 md:col-span-6 lg:col-span-7',
}: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <motion.article
      className={`project-card halftone-overlay ${colSpan}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      whileHover={prefersReducedMotion ? undefined : { scale: 1.03, y: -8 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {/* Visual */}
      <motion.div
        className="relative aspect-[16/10] overflow-hidden"
        initial={{ opacity: 0, scale: 1.05 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#89AACC]/10 to-[#4E85BF]/10" />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="text-6xl opacity-30 md:text-8xl"
            animate={prefersReducedMotion ? undefined : { rotate: [0, 2, -2, 0], scale: [1, 1.02, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            aria-hidden="true"
          >
            {getProjectIcon(project.visual)}
          </motion.div>
        </div>
      </motion.div>

      {/* Hover overlay — pointer devices. Links are duplicated in the body
          below so they remain reachable on touch. */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute inset-0 hidden items-center justify-center bg-bg/70 p-6 text-center backdrop-blur-lg md:flex"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            aria-hidden="true"
          >
            <div className="transform-gpu">
              <motion.h3
                className="mb-2 font-display text-2xl italic text-text-primary md:text-3xl"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
              >
                {project.title}
              </motion.h3>
              <motion.p
                className="mb-6 max-w-sm text-sm leading-relaxed text-muted md:text-base"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.4 }}
              >
                {project.description}
              </motion.p>
              <motion.span
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-bg/60 px-4 py-2 text-sm text-text-primary"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.4, type: 'spring', stiffness: 300 }}
              >
                View
                <span className="text-muted">—</span>
                <span className="font-display text-base italic">{project.title}</span>
              </motion.span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Body */}
      <motion.div
        className="p-6 md:p-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.1em] text-muted">
          <span className="rounded-full bg-stroke/50 px-2 py-1">{project.category}</span>
        </div>

        <motion.h3
          className="mb-3 font-display text-xl italic text-text-primary md:text-2xl"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {project.title}
        </motion.h3>

        <motion.p
          className="mb-4 text-pretty text-sm leading-relaxed text-muted md:text-base"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          {project.description}
        </motion.p>

        <motion.div
          className="mb-5 flex flex-wrap gap-2"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {project.technologies.map((tech: string, i) => (
            <motion.span
              key={tech}
              className="rounded-full border border-stroke/50 bg-stroke/50 px-3 py-1 text-xs text-muted"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.25 + i * 0.05, type: 'spring', stiffness: 400 }}
            >
              {tech}
            </motion.span>
          ))}
        </motion.div>

        {/* Always-visible actions so they work without a pointer */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          {(project.githubUrl || project.liveUrl) && (
            <div className="flex flex-wrap items-center gap-2">
              {project.githubUrl && (
                <motion.a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-stroke px-4 py-2 text-sm text-muted transition-colors duration-300 hover:border-accent/50 hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  GitHub <span aria-hidden="true">↗</span>
                </motion.a>
              )}
              {project.liveUrl && (
                <motion.a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-text-primary px-4 py-2 text-sm text-bg transition-colors duration-300 hover:bg-accent"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Live Demo <span aria-hidden="true">↗</span>
                </motion.a>
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
    </motion.article>
  );
}

function getProjectIcon(visual: string): string {
  switch (visual) {
    case 'ai-campus':
      return '🤖';
    case 'vehicle-detection':
      return '🚗';
    case 'attendance-calculator':
      return '📊';
    case 'lost-found':
      return '🔍';
    default:
      return '💻';
  }
}
