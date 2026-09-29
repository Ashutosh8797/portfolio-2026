'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { stats, type StatItem } from '@/data/portfolio';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

function StatCard({
  stat,
  index,
  prefersReducedMotion,
  isVisible,
}: {
  stat: StatItem;
  index: number;
  prefersReducedMotion: boolean;
  isVisible: boolean;
}) {
  // Parse the numeric value from the string (e.g., "4+" -> 4, "6+" -> 6, "2023–27" -> 2023)
  const numericValue = parseInt(stat.value.replace(/\D/g, '')) || 0;
  const hasPlus = stat.value.includes('+');
  const isYearRange = stat.value.includes('–') || stat.value.includes('-');

  const count = useMotionValue(isVisible && !prefersReducedMotion && !isYearRange ? numericValue : 0);
  const displayCount = useSpring(count, { stiffness: 100, damping: 20, restDelta: 0.1 });
  const displayValue = useTransform(displayCount, (v) =>
    isYearRange ? stat.value : `${Math.round(v)}${hasPlus ? '+' : ''}`
  );

  // Trigger the count animation when visible
  useEffect(() => {
    if (isVisible && !prefersReducedMotion && !isYearRange) {
      count.set(numericValue);
    }
  }, [isVisible, count, prefersReducedMotion, isYearRange, numericValue]);

  return (
    <motion.div
      key={stat.label}
      className="glass-card rounded-2xl p-8 text-center md:p-10"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
      whileHover={{ y: -4, transition: { duration: 0.3 } }}
    >
      <motion.dd className="mb-2 font-display text-4xl italic text-text-primary md:text-5xl lg:text-6xl">
        {isYearRange ? stat.value : <motion.span>{displayValue}</motion.span>}
      </motion.dd>
      <dt className="text-sm uppercase tracking-[0.1em] text-muted md:text-base">
        {stat.label}
      </dt>
    </motion.div>
  );
}

export function Stats() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="stats"
      className="relative z-30 bg-bg py-12 md:py-16"
      aria-label="Portfolio at a glance"
    >
      <div className="mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16">
        <motion.dl
          className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {stats.map((stat, index) => (
            <StatCard
              key={stat.label}
              stat={stat}
              index={index}
              prefersReducedMotion={prefersReducedMotion}
              isVisible={isVisible}
            />
          ))}
        </motion.dl>
      </div>
    </section>
  );
}