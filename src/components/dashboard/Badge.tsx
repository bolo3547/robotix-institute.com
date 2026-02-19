'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface BadgeProps {
  name: string;
  icon?: React.ReactNode;
  earned?: boolean;
}

export default function Badge({ name, icon, earned = false }: BadgeProps) {
  return (
    <motion.div
      initial={{ scale: earned ? 1 : 0.95, opacity: earned ? 1 : 0.7 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`flex items-center gap-3 p-3 rounded-lg ${earned ? 'bg-amber-100 border border-amber-300' : 'bg-gray-100 border border-gray-200'}`}
      role="group"
      aria-label={`${name} badge ${earned ? 'earned' : 'locked'}`}>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${earned ? 'bg-amber-400 text-white' : 'bg-white text-gray-400'}`}>
        {icon ?? '🏅'}
      </div>
      <div>
        <div className="text-sm font-bold text-gray-800">{name}</div>
        <div className="text-xs text-gray-600">{earned ? 'Earned' : 'Locked'}</div>
      </div>
    </motion.div>
  );
}
