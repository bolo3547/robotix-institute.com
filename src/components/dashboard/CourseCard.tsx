'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ProgressBar from './ProgressBar';

interface CourseCardProps {
  id: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  icon?: React.ReactNode;
  progress?: number;
  lessons?: number;
}

export default function CourseCard({ id, title, difficulty, icon, progress = 0, lessons = 8 }: CourseCardProps) {
  const difficultyColor = {
    Beginner: 'bg-green-100 text-green-700',
    Intermediate: 'bg-yellow-100 text-yellow-700',
    Advanced: 'bg-pink-100 text-pink-700',
  }[difficulty];

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl p-5 shadow-md border border-gray-100"
      aria-labelledby={`course-${id}-title`}>
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-300 to-indigo-500 flex items-center justify-center text-3xl text-white">
          {icon ?? '🤖'}
        </div>
        <div className="flex-1">
          <h3 id={`course-${id}-title`} className="text-lg font-bold text-gray-900">{title}</h3>
          <div className="flex items-center gap-3 mt-2">
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${difficultyColor}`}>{difficulty}</span>
            <span className="text-xs text-gray-500">{lessons} lessons</span>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <ProgressBar value={progress} label="Course progress" />
      </div>

      <div className="mt-4 flex gap-3">
        <Link href={`/dashboard/course/${id}`} className="flex-1">
          <button className="w-full bg-brand-600 text-white font-bold py-3 rounded-lg hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-300" aria-label={`Open ${title}`}>
            Continue
          </button>
        </Link>
        <button className="px-4 py-3 rounded-lg border border-gray-200 bg-white text-sm font-semibold" aria-label={`More for ${title}`}>
          Details
        </button>
      </div>
    </motion.article>
  );
}
