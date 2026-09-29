'use client';

import { motion, useTransform, type MotionValue } from 'framer-motion';

/**
 * Shared scroll-driven vocabulary (the "Ideas in motion" language) for
 * content sections: ghost backdrop words and drifting headers.
 * Scrub-based only — no pinning, so sections can never trap scrolling
 * or cover each other.
 */

/**
 * Giant backdrop word on a slow continuous loop — the same pattern as the
 * "Ideas in motion" / contact marquee. Two identical halves translate
 * 0% → -50% so the loop is seamless: always visible, never pops in or
 * out, never rushes. Decorative only.
 */
export function GhostWord({
  animated,
  text,
  className = '',
  reverse = false,
  duration = 38,
}: {
  animated: boolean;
  text: string;
  className?: string;
  reverse?: boolean;
  duration?: number;
}) {
  const half = `${text} · ${text} · `;
  return (
    <motion.span
      aria-hidden="true"
      className={`pointer-events-none absolute flex w-max select-none whitespace-nowrap font-display italic leading-none text-white/[0.04] ${className}`}
      animate={animated ? { x: reverse ? ['-50%', '0%'] : ['0%', '-50%'] } : undefined}
      transition={{ duration, ease: 'linear', repeat: Infinity }}
    >
      <span>{half}</span>
      <span>{half}</span>
    </motion.span>
  );
}

/** Header block drifting gently with scroll. Plain-motion div so it never
    fights the entrance animation owned by the header component inside it. */
export function DriftHeader({
  progress,
  animated,
  children,
  className = '',
  distance = 48,
}: {
  progress: MotionValue<number>;
  animated: boolean;
  children: React.ReactNode;
  className?: string;
  distance?: number;
}) {
  const x = useTransform(progress, [0, 1], [distance, -distance]);
  return (
    <motion.div className={className} style={animated ? { x } : undefined}>
      {children}
    </motion.div>
  );
}
