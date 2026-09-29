'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { useHLSVideo } from '@/hooks/useHLSVideo';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { personalInfo } from '@/data/portfolio';
import { Footer } from './Footer';

const HLS_VIDEO_URL =
  'https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8';

const MARQUEE_ITEM = 'BUILDING THE FUTURE • ';

export function Contact() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const { videoRef } = useHLSVideo(HLS_VIDEO_URL);
  const marqueeRef = useRef<HTMLDivElement>(null);

  // Continuous cinematic marquee — always moving, per spec:
  // xPercent: -50, duration: 40, ease: none, repeat: -1.
  useEffect(() => {
    if (prefersReducedMotion) return;
    const marquee = marqueeRef.current;
    if (!marquee) return;

    const ctx = gsap.context(() => {
      gsap.to('.marquee-track', {
        xPercent: -50,
        duration: 40,
        ease: 'none',
        repeat: -1,
      });
    }, marqueeRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      id="contact"
      className="relative z-40 flex min-h-screen flex-col overflow-hidden"
      aria-labelledby="contact-heading"
    >
      {/* Background video, flipped vertically */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_0%,#101c2b_0%,#0a0a0a_60%,#0a0a0a_100%)]"
          aria-hidden="true"
        />
        <video
          ref={videoRef}
          className="h-full w-full scale-y-[-1] object-cover"
          style={{ objectPosition: 'center' }}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-black/60" aria-hidden="true" />
      </div>

      {/* Marquee — continuous loop + edge fade + light sheen sweep */}
      <div
        ref={marqueeRef}
        className="pointer-events-none relative z-10 mt-20 overflow-hidden md:mt-28"
        aria-hidden="true"
        style={{
          WebkitMaskImage:
            'linear-gradient(90deg, transparent, black 8%, black 92%, transparent)',
          maskImage:
            'linear-gradient(90deg, transparent, black 8%, black 92%, transparent)',
        }}
      >
        <div className="marquee-track flex w-max whitespace-nowrap will-change-transform">
          {[0, 1].map((copy) => (
            <span
              key={copy}
              className="font-display text-8xl italic font-light leading-none text-white/5 md:text-9xl lg:text-[11rem]"
            >
              {Array.from({ length: 10 }, (_, i) => (
                <span key={i}>{MARQUEE_ITEM}</span>
              ))}
            </span>
          ))}
        </div>
        {!prefersReducedMotion && (
          <motion.span
            className="pointer-events-none absolute inset-y-0 left-0 w-1/3"
            style={{
              background:
                'linear-gradient(100deg, transparent, rgba(137,170,204,0.10), transparent)',
              mixBlendMode: 'screen',
            }}
            animate={{ x: ['-120%', '420%'] }}
            transition={{ duration: 9, ease: 'linear', repeat: Infinity }}
          />
        )}
      </div>

      {/* CTA */}
      <div className="relative z-20 mx-auto flex w-full max-w-[1200px] flex-1 items-center px-6 py-16 md:px-10 lg:px-16">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <h2
            id="contact-heading"
            className="font-display text-4xl italic leading-[1.1] tracking-tight text-white md:text-6xl lg:text-7xl"
          >
            Let&rsquo;s build something <span className="font-display italic">meaningful</span>.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-white/70 md:text-xl">
            I&rsquo;m always open to interesting projects, collaborations, internships, and
            opportunities to learn and build.
          </p>
          <div className="mt-10 flex justify-center">
            <a
              href={`mailto:${personalInfo.email}`}
              className="btn-secondary accent-gradient-border max-w-full break-all border-white/20 text-white hover:bg-white/5"
            >
              {personalInfo.email}
              <span aria-hidden="true"> ↗</span>
            </a>
          </div>
        </motion.div>
      </div>

      <Footer />
    </section>
  );
}