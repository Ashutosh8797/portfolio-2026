'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { useHLSVideo } from '@/hooks/useHLSVideo';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { personalInfo, roles } from '@/data/portfolio';
import { scrollToTarget } from '@/lib/scroll';

const HLS_VIDEO_URL =
  'https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8';

export function Hero() {
  // Video plays on every screen size to preserve the intended hero look;
  // it is still skipped when the user has Save-Data enabled.
  const { videoRef } = useHLSVideo(HLS_VIDEO_URL, { disableOnSmallScreens: false });
  const prefersReducedMotion = usePrefersReducedMotion();
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const heroRef = useRef<HTMLElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left - rect.width / 2) / (rect.width / 2));
    mouseY.set((e.clientY - rect.top - rect.height / 2) / (rect.height / 2));
  };

  const handleMouseLeave = () => {
    if (prefersReducedMotion) return;
    mouseX.set(0);
    mouseY.set(0);
  };

  // Mouse parallax offsets. These live on OUTER wrappers only — GSAP owns
  // the entrance transform of the INNER elements, so the two libraries
  // never write to the same node and can't fight over it.
  const nameOffsetX = useTransform(mouseX, [-1, 1], [-15, 15]);
  const nameOffsetY = useTransform(mouseY, [-1, 1], [-10, 10]);
  const roleOffsetX = useTransform(mouseX, [-1, 1], [-8, 8]);
  const roleOffsetY = useTransform(mouseY, [-1, 1], [-5, 5]);
  const descOffsetX = useTransform(mouseX, [-1, 1], [-5, 5]);
  const descOffsetY = useTransform(mouseY, [-1, 1], [-3, 3]);
  const ctaOffsetX = useTransform(mouseX, [-1, 1], [-3, 3]);
  const ctaOffsetY = useTransform(mouseY, [-1, 1], [-2, 2]);

  // Rotate roles every ~2s
  useEffect(() => {
    if (prefersReducedMotion) return;
    const interval = window.setInterval(() => {
      setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
    }, 2000);
    return () => window.clearInterval(interval);
  }, [prefersReducedMotion]);

  // GSAP hero entrance
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.name-reveal', '.blur-in'], { opacity: 1, y: 0, filter: 'blur(0px)' });
        return;
      }

      const tl = gsap.timeline({ ease: 'power3.out' });

      tl.to(
        '.name-reveal',
        { opacity: 1, y: 0, duration: 1.2, delay: 0.1, stagger: 0.05 },
        0
      ).to(
        '.blur-in',
        { opacity: 1, filter: 'blur(0px)', y: 0, duration: 1, stagger: 0.1, delay: 0.3 },
        0.1
      );
    }, heroRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  const scrollToWork = () => {
    scrollToTarget('#work');
  };

  const parallaxStyle = (x: typeof nameOffsetX, y: typeof nameOffsetY) =>
    prefersReducedMotion ? undefined : { x, y };

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
      aria-label="Introduction"
    >
      {/* HLS video background */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_15%,#12243a_0%,#0a0a0a_60%,#0a0a0a_100%)]"
          aria-hidden="true"
        />
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          style={{ objectPosition: 'center' }}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        />
        {/* overlay */}
        <div className="absolute inset-0 bg-black/20" aria-hidden="true" />
        {/* bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-bg to-transparent" aria-hidden="true" />
      </div>

      {/* Content — single min-h-screen so nothing overflows on short viewports */}
      <div
        ref={containerRef}
        className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center px-6 pb-28 pt-24 text-center md:py-20"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Eyebrow — GSAP entrance only */}
        <p
          className="blur-in mb-6 text-xs uppercase tracking-[0.3em] text-muted"
          style={{ opacity: 0, transform: 'translateY(20px)', filter: 'blur(10px)' }}
        >
          AI &amp; Autonomous Systems · 2026
        </p>

        {/* Name — parallax wrapper outside, GSAP entrance inside */}
        <motion.div className="mb-6" style={parallaxStyle(nameOffsetX, nameOffsetY)}>
          <h1 className="name-reveal" style={{ opacity: 0, transform: 'translateY(50px)' }}>
            <span className="sr-only">Ashutosh Kumar Sinha</span>
            <span
              aria-hidden="true"
              className="block font-display text-6xl italic leading-[0.9] tracking-tight text-text-primary md:text-8xl lg:text-9xl"
            >
              ASHUTOSH
            </span>
            <span
              aria-hidden="true"
              className="block font-display text-6xl italic leading-[0.9] tracking-tight text-text-primary md:text-8xl lg:text-9xl"
            >
              KUMAR
            </span>
          </h1>
        </motion.div>

        {/* Rotating role — parallax wrapper outside, FM entrance inside */}
        <motion.div
          className="mb-8 flex min-h-[3rem] items-center justify-center"
          style={parallaxStyle(roleOffsetX, roleOffsetY)}
        >
          <AnimatePresence mode="wait">
            <motion.p
              key={currentRoleIndex}
              className="animate-role-fade-in text-center font-display text-lg italic text-text-primary md:text-xl"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              A {roles[currentRoleIndex]} building intelligent experiences.
            </motion.p>
          </AnimatePresence>
        </motion.div>

        {/* Description — parallax wrapper outside, GSAP entrance inside */}
        <motion.div className="mb-10" style={parallaxStyle(descOffsetX, descOffsetY)}>
          <p
            className="blur-in max-w-lg text-pretty text-sm leading-relaxed text-muted md:text-base"
            style={{ opacity: 0, transform: 'translateY(20px)', filter: 'blur(10px)' }}
          >
            Computer Science student specializing in Artificial Intelligence and Autonomous Systems,
            building AI-powered applications, computer vision systems, and full-stack web
            experiences.
          </p>
        </motion.div>

        {/* CTAs — parallax wrapper outside, GSAP entrance inside */}
        <motion.div
          className="w-full max-w-xs sm:w-auto sm:max-w-none"
          style={parallaxStyle(ctaOffsetX, ctaOffsetY)}
        >
          <div
            className="blur-in flex w-full flex-col items-stretch gap-4 sm:w-auto sm:flex-row sm:items-center"
            style={{ opacity: 0, transform: 'translateY(20px)', filter: 'blur(10px)' }}
          >
            <motion.button
              type="button"
              onClick={scrollToWork}
              className="btn-primary"
              whileHover={prefersReducedMotion ? undefined : { scale: 1.05 }}
              whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
            >
              View My Work
            </motion.button>

            <motion.a
              href={`mailto:${personalInfo.email}`}
              className="btn-secondary accent-gradient-border"
              whileHover={prefersReducedMotion ? undefined : { scale: 1.05 }}
              whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
            >
              Let&rsquo;s Connect
              <span aria-hidden="true"> ↗</span>
            </motion.a>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute inset-x-0 bottom-8 z-10 flex flex-col items-center gap-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        aria-hidden="true"
      >
        <span className="text-xs uppercase tracking-[0.2em] text-muted">Scroll</span>
        <span className="relative block h-10 w-px overflow-hidden bg-stroke">
          <span
            className="accent-gradient absolute inset-x-0 top-0 h-1/2 animate-scroll-down"
            style={
              prefersReducedMotion
                ? { animation: 'none', transform: 'translateY(0)' }
                : undefined
            }
          />
        </span>
      </motion.div>
    </section>
  );
}
