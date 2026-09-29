'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { scrollVelocity, setLenisInstance } from '@/lib/scroll';

gsap.registerPlugin(ScrollTrigger);

export function useLenis() {
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    // Requirement 32: no smooth-scroll hijacking when reduced motion is on.
    if (typeof window === 'undefined' || prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    setLenisInstance(lenis);

    // Keep GSAP ScrollTrigger in sync and publish scroll velocity
    // for Framer Motion scroll-reactive effects (e.g. velocity skew).
    lenis.on('scroll', (e: Lenis) => {
      scrollVelocity.set(e.velocity ?? 0);
      ScrollTrigger.update();
    });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      setLenisInstance(null);
    };
  }, [prefersReducedMotion]);
}
