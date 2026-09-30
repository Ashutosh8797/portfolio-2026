'use client';

import { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { scrollVelocity, setLenisInstance } from '@/lib/scroll';

gsap.registerPlugin(ScrollTrigger);

export function useLenis() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down');
  const [scrollProgress, setScrollProgress] = useState(0);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 2.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.85,
      touchMultiplier: 2.5,
      infinite: false,
      gestureOrientation: 'vertical',
    });
    lenisRef.current = lenis;
    setLenisInstance(lenis);

    lenis.on('scroll', (e: Lenis) => {
      scrollVelocity.set(e.velocity ?? 0);
      setScrollProgress(e.progress);
      setScrollDirection(e.velocity > 0 ? 'down' : e.velocity < 0 ? 'up' : 'down');
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

  return { lenis: lenisRef.current, scrollDirection, scrollProgress };
}
