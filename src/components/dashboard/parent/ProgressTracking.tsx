'use client';

import { motion } from 'framer-motion';
import { Trophy, Code, Brain, Zap } from 'lucide-react';

interface Skill {
  name: string;
  value: number;
  target: number;
}

interface ProgressTrackingProps {
  skills: Skill[];
}

export default function ProgressTracking({ skills }: ProgressTrackingProps) {
  const skillIcons: Record<string, React.ReactNode> = {
    Coding: <Code className="w-6 h-6" />,
    Robotics: <Zap className="w-6 h-6" />,
    Logic: <Brain className="w-6 h-6" />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md p-8 border border-gray-100"
    >
      <div className="flex items-center gap-3 mb-6">
        <Trophy className="w-6 h-6 text-yellow-500" />
        <h2 className="text-2xl font-bold text-gray-900">Skill Progress</h2>
      </div>

      <div className="space-y-6">
        {skills.map((skill, index) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="text-blue-600">{skillIcons[skill.name]}</div>
                <div>
                  <h3 className="font-semibold text-gray-900">{skill.name}</h3>
                  <p className="text-sm text-gray-500">{skill.value} / {skill.target} points</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{Math.round((skill.value / skill.target) * 100)}%</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(skill.value / skill.target) * 100}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full"
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Achievements */}
      <div className="mt-8 pt-8 border-t border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4">Recent Achievements</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['🏆', '⭐', '🎯', '🚀'].map((emoji, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.1 }}
              className="bg-gradient-to-br from-yellow-50 to-orange-100 rounded-lg p-4 text-center border border-yellow-200"
            >
              <div className="text-4xl mb-2">{emoji}</div>
              <p className="text-xs font-semibold text-gray-700">Achievement</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
