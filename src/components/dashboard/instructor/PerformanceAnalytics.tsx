'use client';

import { motion } from 'framer-motion';
import { BarChart2 } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function PerformanceAnalytics() {
  const performanceData: { week: string; avgScore: number }[] = [];

  const skillData: { skill: string; score: number }[] = [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6"
    >
      {/* Performance Trend */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border border-gray-100">
        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4">Performance Trend</h3>
        {performanceData.length === 0 ? (
          <div className="flex items-center justify-center h-[250px] text-gray-400">
            <div className="text-center">
              <BarChart2 className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p className="text-sm">No performance data available yet.</p>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="avgScore" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Skills Breakdown */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border border-gray-100">
        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4">Skills Breakdown</h3>
        {skillData.length === 0 ? (
          <div className="flex items-center justify-center h-[250px] text-gray-400">
            <div className="text-center">
              <BarChart2 className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p className="text-sm">No skill data available yet.</p>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={skillData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="skill" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="score" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  );
}
