'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

type CursorState = 'default' | 'hover' | 'view';

/**
 * Custom cursor: an instant dot plus a spring-lagged ring. The ring grows
 * over links/buttons and morphs into a "View" pill over cards marked
 * with data-cursor="view". Fine-pointer devices only — touch keeps the
 * native cursor and this renders nothing.
 */
export function Cursor() {
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)');
  const prefersReducedMotion = usePrefersReducedMotion();
  const [state, setState] = useState<CursorState>('default');
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 320, damping: 30, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 320, damping: 30, mass: 0.6 });

  useEffect(() => {
    if (!finePointer) return;

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
    };
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t || typeof t.closest !== 'function') return;
      if (t.closest('[data-cursor="view"]')) setState('view');
      else if (t.closest('a, button')) setState('hover');
      else setState('default');
    };
    const onLeave = () => setVisible(false);

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      document.documentElement.removeEventListener('mouseleave', onLeave);
    };
  }, [finePointer, x, y]);

  if (!finePointer) return null;

  const animateRing =
    state === 'view'
      ? { width: 92, height: 92, opacity: visible ? 1 : 0 }
      : state === 'hover'
        ? { width: 56, height: 56, opacity: visible ? 1 : 0 }
        : { width: 32, height: 32, opacity: visible ? 1 : 0 };

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[9998]">
      {/* Instant dot */}
      <motion.div
        className="absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-white"
        style={{ x, y, translateX: '-50%', translateY: '-50%' }}
        animate={{ opacity: visible ? 1 : 0, scale: state === 'default' ? 1 : 0.5 }}
        transition={{ duration: 0.2 }}
      />
      {/* Lagging ring / pill */}
      <motion.div
        className="absolute left-0 top-0 flex items-center justify-center rounded-full border border-white/25 bg-white/[0.04] backdrop-blur-[2px]"
        style={{ x: prefersReducedMotion ? x : ringX, y: prefersReducedMotion ? y : ringY, translateX: '-50%', translateY: '-50%' }}
        animate={animateRing}
        transition={{ type: 'spring', stiffness: 300, damping: 26 }}
      >
        <span
          className={`text-[11px] font-medium uppercase tracking-[0.18em] text-white transition-opacity duration-200 ${
            state === 'view' ? 'opacity-100' : 'opacity-0'
          }`}
        >
          View
        </span>
      </motion.div>
    </div>
  );
}
