'use client';

import { motion } from 'framer-motion';
import { BookOpen, Users, Clock } from 'lucide-react';

interface Class {
  id: number;
  name: string;
  level: string;
  students: number;
  schedule: string;
  progress: number;
}

interface ClassListProps {
  classes: Class[];
}

export default function ClassList({ classes }: ClassListProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md p-6 border border-gray-100"
    >
      <div className="flex items-center gap-3 mb-6">
        <BookOpen className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">My Classes</h2>
      </div>

      <div className="space-y-4">
        {classes.map((cls, idx) => (
          <motion.div
            key={cls.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-5 border border-gray-200 hover:shadow-lg transition cursor-pointer"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">{cls.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{cls.level}</p>
              </div>
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                {Math.round(cls.progress)}%
              </span>
            </div>

            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Users className="w-4 h-4" />
                {cls.students} students
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-4 h-4" />
                {cls.schedule}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-3 bg-gray-200 rounded-full h-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${cls.progress}%` }}
                transition={{ duration: 0.8 }}
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-full"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
