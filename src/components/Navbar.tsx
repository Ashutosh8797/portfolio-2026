'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { navigation, personalInfo } from '@/data/portfolio';
import { scrollToTarget } from '@/lib/scroll';

const SECTION_IDS = ['hero', 'work', 'skills', 'about', 'contact'];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { threshold: [0.25, 0.5, 0.75], rootMargin: '-25% 0px -55% 0px' }
    );

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Lock scroll + close on Escape while the sheet is open
  useEffect(() => {
    if (!menuOpen) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    const mql = window.matchMedia('(min-width: 768px)');
    const onResize = (event: MediaQueryListEvent) => {
      if (event.matches) setMenuOpen(false);
    };

    window.addEventListener('keydown', onKeyDown);
    mql.addEventListener('change', onResize);

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKeyDown);
      mql.removeEventListener('change', onResize);
    };
  }, [menuOpen]);

  const go = (href: string) => {
    setMenuOpen(false);
    // Wait a tick for the sheet to close + body scroll lock to release,
    // then scroll through Lenis so it never fights native scrolling.
    window.setTimeout(() => scrollToTarget(href), 60);
  };

  const sectionLinks = navigation.filter((item) => !item.external);
  const resumeLink = navigation.find((item) => item.external);

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:pt-6"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
    >
      <nav
        aria-label="Main navigation"
        className={[
          'mx-auto flex max-w-[1200px] items-center justify-between gap-2 rounded-full border px-2 py-2',
          'transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300 md:gap-4',
          scrolled
            ? 'border-white/10 bg-surface/80 shadow-[0_8px_30px_rgba(0,0,0,0.4)] backdrop-blur-md'
            : 'border-transparent bg-transparent',
        ].join(' ')}
      >
        {/* Logo */}
        <motion.button
          onClick={() => go('#hero')}
          aria-label="Go to top of page"
          className="group relative grid h-9 w-9 shrink-0 place-items-center rounded-full p-[1.5px]"
          whileHover={prefersReducedHoverSafe() ? { scale: 1.1 } : undefined}
          whileTap={{ scale: 0.95 }}
        >
          <span className="accent-gradient absolute inset-0 rounded-full" />
          {/* reverse gradient direction on hover */}
          <span className="accent-gradient absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100 [transform:rotate(180deg)]" />
          <span className="absolute inset-[1.5px] rounded-full bg-bg" />
          <span className="relative font-display text-[13px] italic leading-none text-text-primary">
            AK
          </span>
        </motion.button>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 md:flex">
          {sectionLinks.map((item) => {
            const id = item.href.replace('#', '');
            const isActive = activeSection === id;
            return (
              <button
                key={item.label}
                onClick={() => go(item.href)}
                aria-current={isActive ? 'page' : undefined}
                className={`nav-link ${isActive ? 'nav-link-active' : ''}`}
              >
                {item.label}
              </button>
            );
          })}

          {resumeLink && (
            <a
              href={resumeLink.href}
              target="_blank"
              rel="noopener noreferrer"
              className="nav-link"
            >
              {resumeLink.label}
            </a>
          )}
        </div>

        {/* Say hi + menu toggle */}
        <div className="flex shrink-0 items-center gap-2">
          <motion.a
            href={`mailto:${personalInfo.email}`}
            aria-label="Send email"
            className="accent-gradient-border hidden items-center gap-1.5 rounded-full border-2 bg-bg px-4 py-2 text-sm font-medium text-text-primary transition-colors duration-300 sm:inline-flex"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Say hi
            <span aria-hidden="true">↗</span>
          </motion.a>

          <button
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className="grid h-9 w-9 place-items-center rounded-full border border-stroke text-text-primary transition-colors duration-200 hover:bg-stroke/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 md:hidden"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true">
              {menuOpen ? (
                <>
                  <line x1="6" y1="6" x2="18" y2="18" />
                  <line x1="18" y1="6" x2="6" y2="18" />
                </>
              ) : (
                <>
                  <line x1="4" y1="7" x2="20" y2="7" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="17" x2="20" y2="17" />
                </>
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile sheet */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            className="mx-auto mt-2 max-w-[1200px] overflow-hidden rounded-3xl border border-white/10 bg-surface/95 backdrop-blur-md md:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <ul className="flex flex-col gap-1 p-3">
              {navigation.map((item) => (
                <li key={item.label}>
                  {item.external ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between rounded-2xl px-4 py-3 text-base font-medium text-text-primary transition-colors hover:bg-stroke/50"
                    >
                      {item.label}
                      <span aria-hidden="true" className="text-sm text-muted">↗</span>
                    </a>
                  ) : (
                    <button
                      onClick={() => go(item.href)}
                      className={[
                        'flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-base font-medium transition-colors',
                        activeSection === item.href.replace('#', '')
                          ? 'bg-stroke/50 text-text-primary'
                          : 'text-muted hover:bg-stroke/40 hover:text-text-primary',
                      ].join(' ')}
                    >
                      {item.label}
                      <span aria-hidden="true" className="text-sm opacity-60">→</span>
                    </button>
                  )}
                </li>
              ))}

              <li className="mt-1 sm:hidden">
                <a
                  href={`mailto:${personalInfo.email}`}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-text-primary px-4 py-3 text-base font-medium text-bg"
                >
                  Say hi <span aria-hidden="true">↗</span>
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

/** Hover scaling is a desktop nicety; keep it off touch devices. */
function prefersReducedHoverSafe() {
  if (typeof window === 'undefined' || !window.matchMedia) return true;
  return window.matchMedia('(hover: hover)').matches;
}
