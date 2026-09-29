'use client';

import { motion } from 'framer-motion';
import { footerLinks } from '@/data/portfolio';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

export function Footer() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <footer className="relative z-20 border-t border-white/10 px-6 py-8 md:px-10 lg:px-16">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-6 md:flex-row">
        {/* Links */}
        <nav aria-label="Footer navigation" className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {footerLinks.map((link) => (
            <motion.a
              key={link.label}
              href={link.href}
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noopener noreferrer' : undefined}
              className="text-sm font-medium text-white/50 transition-colors duration-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
              whileHover={prefersReducedMotion ? undefined : { scale: 1.05 }}
              whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
            >
              {link.label}
            </motion.a>
          ))}
        </nav>

        {/* Availability */}
        <div className="flex items-center gap-2 text-sm text-white/40">
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span
              className="absolute inline-flex h-full w-full rounded-full bg-accent/50"
              style={
                prefersReducedMotion
                  ? undefined
                  : { animation: 'gradient-pulse 2s ease-in-out infinite' }
              }
            />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          <span>Open to opportunities</span>
        </div>
      </div>

      <p className="mt-8 text-center text-sm text-white/30">
        © 2026 Ashutosh Kumar Sinha
      </p>
    </footer>
  );
}
