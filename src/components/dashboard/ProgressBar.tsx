'use client';

import { motion } from 'framer-motion';

interface ProgressBarProps {
  value: number; // 0-100
  label?: string;
}

export default function ProgressBar({ value, label }: ProgressBarProps) {
  const safe = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div aria-label={label ? `${label} progress` : 'Course progress'}>
      <div className="flex items-center justify-between mb-2">
        {label ? <div className="text-sm font-medium text-gray-800">{label}</div> : null}
        <div className="text-sm font-semibold text-gray-700">{safe}%</div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden" role="progressbar" aria-valuenow={safe} aria-valuemin={0} aria-valuemax={100}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${safe}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-4 bg-gradient-to-r from-amber-400 via-pink-500 to-indigo-600"
        />
      </div>
    </div>
  );
}
