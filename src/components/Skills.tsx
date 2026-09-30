'use client';

import { motion } from 'framer-motion';
import { SectionHeader } from './SectionHeader';
import { Marquee } from './Marquee';
import { DriftHeader, GhostWord } from './ScrollEffects';
import { useSectionDrive, useVelocitySkew } from '@/hooks/useScrollEffects';
import { skills } from '@/data/portfolio';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

const skillCategories = [
  { id: 'languages', title: 'Languages', items: skills.languages, icon: '💻' },
  { id: 'fundamentals', title: 'CS Fundamentals', items: skills.fundamentals, icon: '📚' },
  { id: 'ai-ml', title: 'AI / ML', items: skills.aiMl, icon: '🧠' },
  { id: 'web-dev', title: 'Web Development', items: skills.webDevelopment, icon: '🌐' },
  { id: 'databases-tools', title: 'Databases & Tools', items: skills.databasesTools, icon: '🛠️' },
  { id: 'hardware-edge', title: 'Hardware / Edge', items: skills.hardwareEdge, icon: '🔧' },
];

export function Skills() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const animated = !prefersReducedMotion;
  const { ref: driveRef, progress } = useSectionDrive();
  const skewX = useVelocitySkew();

  return (
    <section id="skills" className="relative overflow-hidden bg-bg py-12 md:py-16" aria-labelledby="skills-heading">
      <GhostWord animated={animated} text="Stack" reverse className="left-0 top-10 text-[20vw]" />
      <div ref={driveRef} className="relative mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16">
        <DriftHeader progress={progress} animated={animated}>
          <SectionHeader
            id="skills-heading"
            eyebrow="Technical Stack"
            heading="Tools I build with"
            headingHighlight="build with"
            subtext="A growing toolkit across software development, artificial intelligence, computer vision, and edge computing."
          />
        </DriftHeader>

        <motion.div
          className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3"
          style={animated ? { skewX } : undefined}
          initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {skillCategories.map((category, categoryIndex) => (
            <SkillCard
              key={category.id}
              category={category}
              categoryIndex={categoryIndex}
              prefersReducedMotion={prefersReducedMotion}
            />
          ))}
        </motion.div>
      </div>
      <Marquee
        reverse
        duration={44}
        items={[
          ...skills.languages,
          ...skills.fundamentals,
          ...skills.aiMl,
          ...skills.webDevelopment,
          ...skills.databasesTools,
          ...skills.hardwareEdge,
        ]}
      />
    </section>
  );
}

function SkillCard({
  category,
  categoryIndex,
  prefersReducedMotion,
}: {
  category: (typeof skillCategories)[0];
  categoryIndex: number;
  prefersReducedMotion: boolean;
}) {
  return (
    <motion.article
      className="skill-card"
      initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: categoryIndex * 0.1, ease: 'easeOut' }}
      whileHover={prefersReducedMotion ? undefined : { y: -8, transition: { duration: 0.3, ease: 'easeOut' } }}
      style={{
        transition: 'transform 0.3s ease-out',
      }}
    >
      <div className="mb-4 flex items-center gap-3">
        <span className="text-3xl" aria-hidden="true">
          {category.icon}
        </span>
        <h3 className="font-display text-xl italic text-text-primary">{category.title}</h3>
      </div>

      <div className="flex flex-wrap gap-2">
        {category.items.map((skill, skillIndex) => (
          <motion.span
            key={skill}
            className="rounded-full border border-stroke/30 bg-stroke/30 px-3 py-1.5 text-sm text-muted transition-colors duration-300 hover:border-accent/30 hover:text-text-primary"
            initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: categoryIndex * 0.1 + skillIndex * 0.03, type: 'spring', stiffness: 400 }}
          >
            {skill}
          </motion.span>
        ))}
      </div>
    </motion.article>
  );
}
