'use client';

import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

interface DashboardChartsProps {
  attendanceData: { week: string; attended: number; total: number }[];
  skillProgress: { name: string; value: number; target: number }[];
}

export default function DashboardCharts({ attendanceData, skillProgress }: DashboardChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Attendance Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md p-4 sm:p-6 border border-gray-100"
      >
        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4">Attendance Trend</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={attendanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="attended" fill="#3b82f6" name="Attended" />
            <Bar dataKey="total" fill="#e5e7eb" name="Total" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Skills Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md p-4 sm:p-6 border border-gray-100"
      >
        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4">Skills Distribution</h3>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie data={skillProgress} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
              {skillProgress.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}
