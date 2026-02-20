'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const rotatingWords = [
  'Robotics & Coding',
  'Problem Solving',
  'Creative Thinking',
  'Future Careers',
  'Digital Innovation',
];

export default function HeroClient() {
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mb-8 max-w-xl">
      <p className="text-lg text-brand-100 leading-relaxed">
        Empowering tomorrow&apos;s innovators with hands-on{' '}
        <span className="relative inline-block min-w-[200px] align-bottom">
          <AnimatePresence mode="wait">
            <motion.span
              key={wordIndex}
              initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -20, filter: 'blur(4px)' }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="font-bold text-white typewriter-cursor"
            >
              {rotatingWords[wordIndex]}
            </motion.span>
          </AnimatePresence>
        </span>
        {' '}education. Programs for children and teens aged 6-18.
      </p>
    </div>
  );
}
