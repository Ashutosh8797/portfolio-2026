'use client';

import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useVelocitySkew } from '@/hooks/useScrollEffects';

/**
 * Full-bleed infinite ticker tape: an uppercase item strip on a slow
 * seamless loop (two identical halves, 0% → -50%), framed by hairlines.
 * Framer Motion owns the loop; Lenis scroll velocity feeds a subtle
 * skew while flick-scrolling. Decorative — duplicates visible content,
 * so it is hidden from assistive tech.
 */
export function Marquee({
  items,
  reverse = false,
  duration = 32,
  className = '',
}: {
  items: string[];
  reverse?: boolean;
  duration?: number;
  className?: string;
}) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const animated = !prefersReducedMotion;
  const skewX = useVelocitySkew(3);

  return (
    <div
      aria-hidden="true"
      className={`relative mt-12 overflow-hidden border-y border-stroke/50 py-4 md:mt-16 ${className}`}
    >
      <motion.div
        className="flex w-max items-center whitespace-nowrap will-change-transform"
        style={animated ? { skewX } : undefined}
        animate={animated ? { x: reverse ? ['-50%', '0%'] : ['0%', '-50%'] } : undefined}
        transition={{ duration, ease: 'linear', repeat: Infinity }}
      >
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center">
            {items.map((item, i) => (
              <span key={`${copy}-${i}`} className="flex items-center">
                <span className="px-6 text-xs font-medium uppercase tracking-[0.25em] text-muted/70">
                  {item}
                </span>
                <span className="text-[10px] text-accent/60">✦</span>
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
