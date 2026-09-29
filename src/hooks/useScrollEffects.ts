'use client';

import { useRef } from 'react';
import { useScroll, useSpring, useTransform } from 'framer-motion';
import { scrollVelocity } from '@/lib/scroll';

/** Drive ref + 0→1 progress across an element's viewport passage. */
export function useSectionDrive() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress: progress } = useScroll({
    target: ref,
    offset: ['start end', 'end end'],
  });
  return { ref, progress };
}

/** Smoothed Lenis-velocity skew. Relaxes back to 0 at rest. */
export function useVelocitySkew(amount = 4) {
  const smooth = useSpring(scrollVelocity, {
    stiffness: 120,
    damping: 30,
    mass: 0.4,
  });
  return useTransform(smooth, [-60, 60], [amount, -amount]);
}
