'use client';

import { motion } from 'framer-motion';

interface SectionHeaderProps {
  eyebrow: string;
  heading: string;
  headingHighlight?: string;
  subtext?: string;
  /** Applied to the <h2> so a parent <section aria-labelledby> points at it. */
  id?: string;
  className?: string;
}

export function SectionHeader({
  eyebrow,
  heading,
  headingHighlight,
  subtext,
  id,
  className = '',
}: SectionHeaderProps) {
  const highlight = headingHighlight ?? '';
  const highlightIndex = highlight ? heading.indexOf(highlight) : -1;
  const before = highlightIndex >= 0 ? heading.slice(0, highlightIndex) : heading;
  const after = highlightIndex >= 0 ? heading.slice(highlightIndex + highlight.length) : '';

  return (
    <motion.div
      className={`section-header ${className}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <p className="section-eyebrow">{eyebrow}</p>
      <h2 id={id} className="section-heading">
        {before}
        {highlightIndex >= 0 && (
          <span className="font-display italic">{highlight}</span>
        )}
        {after}
      </h2>
      {subtext && <p className="section-subtext">{subtext}</p>}
    </motion.div>
  );
}
