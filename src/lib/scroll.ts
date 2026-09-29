import type Lenis from 'lenis';
import { motionValue } from 'framer-motion';

/**
 * Live Lenis scroll velocity, published for scroll-reactive animation
 * (e.g. velocity skew). Stays 0 when Lenis isn't running.
 */
export const scrollVelocity = motionValue(0);

let lenisInstance: Lenis | null = null;

export function setLenisInstance(instance: Lenis | null) {
  lenisInstance = instance;
}

export function getLenisInstance(): Lenis | null {
  return lenisInstance;
}

/**
 * Smooth-scroll to a selector through Lenis when it is running,
 * otherwise fall back to native smooth scrolling. Using one path
 * avoids Lenis and the browser fighting over the same scroll.
 */
export function scrollToTarget(selector: string) {
  const el = document.querySelector(selector);
  if (!el) return;

  const lenis = getLenisInstance();
  if (lenis) {
    lenis.scrollTo(el as HTMLElement, { offset: -96, duration: 1.4 });
  } else {
    (el as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
