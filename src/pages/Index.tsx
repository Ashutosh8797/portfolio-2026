import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useLenis } from '@/hooks/useLenis';
import { LoadingScreen } from '@/components/LoadingScreen';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { SelectedWork } from '@/components/SelectedWork';
import { Skills } from '@/components/Skills';
import { Journal } from '@/components/Journal';
import { Explorations } from '@/components/Explorations';
import { Education } from '@/components/Education';
import { Certifications } from '@/components/Certifications';
import { Stats } from '@/components/Stats';
import { Contact } from '@/components/Contact';

export function Index() {
  useLenis();
  const [isLoading, setIsLoading] = useState(true);
  const handleComplete = useCallback(() => setIsLoading(false), []);

  // Hold scroll position while the loading screen is up.
  useEffect(() => {
    if (!isLoading) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isLoading]);

  return (
    <>
      <AnimatePresence>
        {isLoading && <LoadingScreen onComplete={handleComplete} />}
      </AnimatePresence>

      <Navbar />

      <main>
        <Hero />
        <SelectedWork />
        <Skills />
        <Journal />
        <Explorations />
        <Education />
        <Certifications />
        <Stats />
        <Contact />
      </main>
    </>
  );
}
