'use client';

import { motion } from 'framer-motion';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function PerformanceAnalytics() {
  const performanceData = [
    { week: 'Week 1', avgScore: 65 },
    { week: 'Week 2', avgScore: 72 },
    { week: 'Week 3', avgScore: 68 },
    { week: 'Week 4', avgScore: 78 },
    { week: 'Week 5', avgScore: 82 },
  ];

  const skillData = [
    { skill: 'Coding', score: 75 },
    { skill: 'Robotics', score: 68 },
    { skill: 'Logic', score: 82 },
    { skill: 'Teamwork', score: 70 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6"
    >
      {/* Performance Trend */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border border-gray-100">
        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4">Performance Trend</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="avgScore" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Skills Breakdown */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border border-gray-100">
        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4">Skills Breakdown</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={skillData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="skill" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="score" fill="#8b5cf6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
