'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

interface LoadingScreenProps {
  onComplete: () => void;
}

const DURATION_MS = 2700;
const HOLD_MS = 400;
const WORDS = ['Build', 'Create', 'Innovate'] as const;
const WORD_INTERVAL_MS = 900;

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [progress, setProgress] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const frameRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const holdRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    if (prefersReducedMotion) {
      const t = window.setTimeout(onComplete, 250);
      return () => window.clearTimeout(t);
    }

    const tick = (timestamp: number) => {
      if (startRef.current === null) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;

      const next = Math.min(Math.floor((elapsed / DURATION_MS) * 100), 100);
      setProgress(next);
      setWordIndex(Math.floor(elapsed / WORD_INTERVAL_MS) % WORDS.length);

      if (next < 100) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        timeoutRef.current = window.setTimeout(() => {
          setIsComplete(true);
          holdRef.current = window.setTimeout(onComplete, HOLD_MS);
        }, 0);
      }
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
      if (holdRef.current !== null) window.clearTimeout(holdRef.current);
    };
  }, [onComplete, prefersReducedMotion]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="fixed inset-0 z-[9999] flex flex-col bg-bg"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.6, ease: 'easeOut' } }}
        role="status"
        aria-live="polite"
        aria-label="Loading portfolio"
      >
        {/* Top-left */}
        <motion.div
          className="absolute left-6 top-6 text-xs uppercase tracking-[0.3em] text-muted md:left-8 md:top-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
        >
          Portfolio
        </motion.div>

        {/* Centre cycling word */}
        <div className="flex flex-1 items-center justify-center px-4">
          <AnimatePresence mode="wait">
            <motion.span
              key={prefersReducedMotion ? 'static' : wordIndex}
              className="font-display text-4xl italic text-text-primary md:text-6xl lg:text-7xl"
              initial={{ y: 20, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -20, opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, ease: 'easeOut', type: 'spring', stiffness: 300 }}
            >
              {WORDS[prefersReducedMotion ? 0 : wordIndex]}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Bottom-right counter */}
        <motion.div
          className="absolute bottom-8 right-6 font-display text-6xl tabular-nums text-text-primary md:bottom-10 md:right-10 md:text-8xl lg:text-9xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {String(progress).padStart(3, '0')}
        </motion.div>

        {/* Progress bar — plain div driven by state. A previous version
            combined a spring MotionValue in style with keyframes in animate
            on the same node, which fought and jumped. */}
        <div className="absolute inset-x-0 bottom-0 h-[3px] bg-stroke/50">
          <div
            className="accent-gradient h-full origin-left"
            style={{
              transform: `scaleX(${progress / 100})`,
              boxShadow: '0 0 8px rgba(137, 170, 204, 0.35)',
            }}
          />
        </div>

        {/* Completion pulse */}
        {isComplete && (
          <motion.div
            className="absolute inset-0 bg-accent/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.3, 0] }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
}
