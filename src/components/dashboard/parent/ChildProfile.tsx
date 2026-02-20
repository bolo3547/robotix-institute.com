'use client';

import { motion } from 'framer-motion';
import { Calendar, Zap } from 'lucide-react';

interface ChildProfileProps {
  child: {
    id: string;
    name: string;
    age: number;
    enrolledProgram: string;
    profileImage: string;
    totalHours: number;
    startDate: string;
  };
}

export default function ChildProfile({ child }: ChildProfileProps) {
  const startDate = new Date(child.startDate);
  const monthsActive = Math.floor((Date.now() - startDate.getTime()) / (30 * 24 * 60 * 60 * 1000));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md p-4 sm:p-6 md:p-8 border border-gray-100"
    >
      <h2 className="text-lg sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Child Profile</h2>

      <div className="flex flex-col md:flex-row gap-4 sm:gap-8">
        {/* Profile Section */}
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="text-4xl sm:text-6xl">{child.profileImage}</div>
          <div>
            <h3 className="text-lg sm:text-2xl font-bold text-gray-900">{child.name}</h3>
            <p className="text-gray-600 text-sm sm:text-lg">{child.age} years old</p>
            <div className="flex items-center gap-2 text-blue-600 mt-2 sm:mt-3 font-semibold text-sm sm:text-base">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
              {child.enrolledProgram}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 flex-1">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 sm:p-4 border border-blue-200">
            <div className="text-xs sm:text-sm text-gray-600 font-medium">Total Learning Hours</div>
            <div className="text-xl sm:text-3xl font-bold text-blue-600 mt-1 sm:mt-2">{child.totalHours}</div>
            <div className="text-xs text-gray-500 mt-1 sm:mt-2">hours completed</div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3 sm:p-4 border border-purple-200">
            <div className="text-xs sm:text-sm text-gray-600 font-medium">Duration</div>
            <div className="text-xl sm:text-3xl font-bold text-purple-600 mt-1 sm:mt-2">{monthsActive}</div>
            <div className="text-xs text-gray-500 mt-1 sm:mt-2">months active</div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 sm:p-4 border border-green-200 col-span-2">
            <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
              <Calendar className="w-4 h-4" />
              Started {startDate.toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
