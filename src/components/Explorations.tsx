'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { explorations, personalInfo, type Exploration } from '@/data/portfolio';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { scrollVelocity } from '@/lib/scroll';

gsap.registerPlugin(ScrollTrigger);

const TOTAL = explorations.length;

export function Explorations() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();
  const [activeItem, setActiveItem] = useState<Exploration | null>(null);

  // Showpiece only on desktop without reduced motion.
  const spectacular = !isMobile && !prefersReducedMotion;

  const driveRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);

  // 0 → 1 across the whole drive; feeds the counter, progress bar and
  // ghost-type parallax. Written directly by ScrollTrigger's onUpdate —
  // a pinned element's rect never moves, so measured scroll hooks would
  // freeze. GSAP owns the rail X on a different node.
  const driveProgress = useMotionValue(0);

  // Lenis scroll velocity → smoothed, then mapped to a subtle skew.
  const smoothVelocity = useSpring(scrollVelocity, {
    stiffness: 120,
    damping: 30,
    mass: 0.4,
  });
  const skewX = useTransform(smoothVelocity, [-60, 60], [5, -5]);
  const ghostX = useTransform(driveProgress, [0, 1], ['3%', '-22%']);
  const counterText = useTransform(
    driveProgress,
    (v) => `${String(Math.min(TOTAL, Math.floor(v * TOTAL) + 1)).padStart(2, '0')} / ${String(TOTAL).padStart(2, '0')}`
  );

  useEffect(() => {
    if (!spectacular) return;
    const drive = driveRef.current;
    const rail = railRef.current;
    if (!drive || !rail) return;

    const ctx = gsap.context(() => {
      // Pinned viewport: vertical scroll is converted 1:1 into rail travel.
      // The drive distance matches the rail length exactly (+ a breath at
      // the end), so the page holds still while cards move right, then
      // releases downward exactly when the last card is shown.
      const travel = () => Math.max(0, rail.scrollWidth - window.innerWidth);
      gsap.to(rail, {
        x: () => -travel(),
        ease: 'none',
        scrollTrigger: {
          trigger: drive,
          start: 'top top',
          end: () => `+=${travel() + window.innerHeight * 0.6}`,
          scrub: 0.6,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => driveProgress.set(self.progress),
        },
      });
    }, driveRef);

    return () => ctx.revert();
  }, [spectacular, driveProgress]);

  const open = useCallback((item: Exploration) => setActiveItem(item), []);
  const close = useCallback(() => setActiveItem(null), []);

  useEffect(() => {
    if (!activeItem) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKeyDown);

    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previous;
    };
  }, [activeItem, close]);

  return (
    <section
      id="explorations"
      className="relative z-0 overflow-hidden bg-bg"
      aria-labelledby="explorations-heading"
    >
      {spectacular ? (
        /* ---------- Desktop showpiece: pinned horizontal drive ----------
           GSAP pins this viewport for exactly the scroll distance the rail
           needs: scrolling down moves cards right while the page holds,
           then releases downward once the last card is shown. */
        <div ref={driveRef} className="relative">
          <div className="relative flex h-screen flex-col justify-center overflow-hidden">
            {/* Ghost parallax type */}
            <motion.span
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-0 -translate-y-1/2 whitespace-nowrap font-display text-[22vw] italic leading-none text-white/[0.04]"
              style={{ x: ghostX }}
            >
              Explore · Create · Explore · Create ·
            </motion.span>

            {/* HUD: eyebrow + counter + progress */}
            <div className="absolute inset-x-0 top-0 z-10 mx-auto w-full max-w-[1200px] px-6 pt-24 md:px-10 lg:px-16">
              <div className="flex items-end justify-between gap-6">
                <p className="section-eyebrow !mb-0">Explorations</p>
                <p className="font-display text-lg italic tabular-nums text-muted">
                  <motion.span>{counterText}</motion.span>
                </p>
              </div>
              <div className="mt-3 h-px w-full bg-stroke/60">
                <motion.div
                  className="accent-gradient h-full origin-left"
                  style={{ scaleX: driveProgress }}
                />
              </div>
            </div>

            {/* Rail: intro panel + cards + finale */}
            <div
              ref={railRef}
              className="relative z-10 flex w-max items-center gap-6 pl-[7vw] pr-[10vw] will-change-transform md:gap-10"
            >
              {/* Intro panel */}
              <div className="w-[80vw] shrink-0 md:w-[32vw]">
                <h2 id="explorations-heading" className="section-heading">
                  Ideas in <span className="font-display italic">motion</span>
                </h2>
                <p className="section-subtext">
                  From AI experiments to interfaces and hardware projects, this is where
                  technology meets curiosity.
                </p>
                <div className="mt-8 flex">
                  <a
                    href={personalInfo.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary accent-gradient-border"
                  >
                    GitHub
                    <span aria-hidden="true"> ↗</span>
                  </a>
                </div>
              </div>

              {explorations.map((item, index) => (
                <ShowCard
                  key={item.id}
                  item={item}
                  index={index}
                  skewX={skewX}
                  reduceMotion={prefersReducedMotion}
                  onOpen={open}
                />
              ))}

              {/* Finale panel */}
              <div className="flex w-[60vw] shrink-0 items-center justify-center md:w-[24vw]">
                <a
                  href={personalInfo.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group grid h-40 w-40 place-items-center rounded-full border border-stroke text-center transition-colors duration-300 hover:border-accent/50 md:h-52 md:w-52"
                >
                  <span className="px-6 text-sm font-medium text-muted transition-colors group-hover:text-text-primary">
                    More on GitHub
                    <span aria-hidden="true" className="mt-1 block text-xl">
                      ↗
                    </span>
                  </span>
                </a>
              </div>
            </div>

            <p className="absolute inset-x-0 bottom-8 z-10 text-center text-[0.65rem] uppercase tracking-[0.25em] text-muted/70">
              Scroll to travel
            </p>
          </div>
        </div>
      ) : (
        /* ---------- Mobile / reduced motion: zigzag river ---------- */
        <div className="mx-auto max-w-[1200px] px-6 py-12 md:px-10 md:py-16 lg:px-16">
          <motion.div
            className="mx-auto max-w-2xl text-center"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="section-eyebrow">Explorations</p>
            <h2 id="explorations-heading" className="section-heading">
              Ideas in <span className="font-display italic">motion</span>
            </h2>
            <p className="section-subtext mx-auto">
              From AI experiments to interfaces and hardware projects, this is where technology
              meets curiosity.
            </p>
            <div className="mt-8 flex justify-center">
              <a
                href={personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary accent-gradient-border"
              >
                GitHub
                <span aria-hidden="true"> ↗</span>
              </a>
            </div>
          </motion.div>

          <div className="mt-12 flex flex-col gap-5 md:mt-16 md:gap-8">
            {explorations.map((item, index) => (
              <RiverCard
                key={item.id}
                item={item}
                index={index}
                align={index % 2 === 0 ? 'start' : 'end'}
                reduceMotion={prefersReducedMotion}
                onOpen={open}
              />
            ))}
          </div>
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {activeItem && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="absolute inset-0 bg-bg/85 backdrop-blur-lg" onClick={close} aria-hidden="true" />

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="lightbox-title"
              className="glass-card relative w-full max-w-md rounded-3xl p-8 text-center"
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <button
                type="button"
                onClick={close}
                aria-label="Close dialog"
                className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full border border-stroke text-muted transition-colors hover:bg-stroke/50 hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <line x1="5" y1="5" x2="19" y2="19" />
                  <line x1="19" y1="5" x2="5" y2="19" />
                </svg>
              </button>

              <div className="mb-4 text-4xl" aria-hidden="true">
                {getExplorationIcon(activeItem.id)}
              </div>
              <h3 id="lightbox-title" className="mb-3 font-display text-2xl italic text-text-primary sm:text-3xl">
                {activeItem.title}
              </h3>
              <p className="mb-6 text-pretty text-sm leading-relaxed text-muted">
                {activeItem.description}
              </p>
              <a
                href={personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary accent-gradient-border"
              >
                See it on GitHub
                <span aria-hidden="true"> ↗</span>
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function ShowCard({
  item,
  index,
  skewX,
  reduceMotion,
  onOpen,
}: {
  item: Exploration;
  index: number;
  skewX: MotionValue<number>;
  reduceMotion: boolean;
  onOpen: (item: Exploration) => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={() => onOpen(item)}
      aria-label={`Open ${item.title} details`}
      className="glass-card group relative aspect-square h-[46vh] w-auto shrink-0 cursor-pointer overflow-hidden rounded-2xl p-6 text-center transition-[border-color,box-shadow] duration-300 hover:border-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 md:h-[54vh] md:p-8"
      style={{ skewX, rotate: item.rotation }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: (index % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
      whileHover={reduceMotion ? undefined : { scale: 1.03 }}
      whileTap={reduceMotion ? undefined : { scale: 0.98 }}
    >
      <span
        aria-hidden="true"
        className="absolute left-5 top-4 font-display text-5xl italic text-white/15 md:text-6xl"
      >
        {String(index + 1).padStart(2, '0')}
      </span>
      <span className="flex h-full flex-col items-center justify-center">
        <motion.span
          className="mb-4 block text-5xl transition-transform duration-500 group-hover:scale-110 md:text-7xl"
          animate={reduceMotion ? undefined : { y: [0, -7, 0] }}
          transition={{
            duration: 3.4,
            delay: index * 0.45,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          aria-hidden="true"
        >
          {getExplorationIcon(item.id)}
        </motion.span>
        <span className="mb-2 block font-display text-xl italic leading-tight text-text-primary md:text-2xl">
          {item.title}
        </span>
        <span className="block max-w-[26ch] text-pretty text-sm leading-relaxed text-muted md:text-base">
          {item.description}
        </span>
      </span>
    </motion.button>
  );
}

function RiverCard({
  item,
  index,
  align,
  reduceMotion,
  onOpen,
}: {
  item: Exploration;
  index: number;
  align: 'start' | 'end';
  reduceMotion: boolean;
  onOpen: (item: Exploration) => void;
}) {
  return (
    <motion.div
      className={`w-full lg:w-[46%] ${align === 'end' ? 'lg:self-end' : 'lg:self-start'}`}
      initial={reduceMotion ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: (index % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.button
        type="button"
        onClick={() => onOpen(item)}
        aria-label={`Open ${item.title} details`}
        className="glass-card group aspect-square w-full cursor-pointer rounded-2xl p-6 text-center transition-[border-color,box-shadow] duration-300 hover:border-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 md:p-8"
        style={{ rotate: item.rotation }}
        whileHover={reduceMotion ? undefined : { scale: 1.03 }}
        whileTap={reduceMotion ? undefined : { scale: 0.98 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <motion.span
          className="mb-4 block text-5xl transition-transform duration-500 group-hover:scale-110 md:text-7xl"
          animate={reduceMotion ? undefined : { y: [0, -7, 0] }}
          transition={{
            duration: 3.4,
            delay: index * 0.45,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          aria-hidden="true"
        >
          {getExplorationIcon(item.id)}
        </motion.span>
        <span className="mb-2 block font-display text-xl italic leading-tight text-text-primary md:text-2xl">
          {item.title}
        </span>
        <span className="block text-pretty text-sm leading-relaxed text-muted md:text-base">
          {item.description}
        </span>
      </motion.button>
    </motion.div>
  );
}

function getExplorationIcon(id: string): string {
  switch (id) {
    case 'ai-ml':
      return '🧠';
    case 'computer-vision':
      return '👁️';
    case 'full-stack':
      return '🌐';
    case 'edge-computing':
      return '📡';
    case 'autonomous-systems':
      return '🤖';
    case 'creative-coding':
      return '✨';
    default:
      return '💡';
  }
}
