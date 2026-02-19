'use client';

import { motion } from 'framer-motion';
import { Users, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';

interface Student {
  id: number;
  name: string;
  class: string;
  progress: number;
  attendance: string;
  status: 'excellent' | 'good' | 'needs_help';
}

interface StudentListProps {
  students: Student[];
}

export default function StudentList({ students }: StudentListProps) {
  const statusConfig = {
    excellent: { color: 'text-green-600', bg: 'bg-green-50', icon: CheckCircle },
    good: { color: 'text-blue-600', bg: 'bg-blue-50', icon: TrendingUp },
    needs_help: { color: 'text-orange-600', bg: 'bg-orange-50', icon: AlertCircle },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md p-6 border border-gray-100"
    >
      <div className="flex items-center gap-3 mb-6">
        <Users className="w-6 h-6 text-purple-600" />
        <h2 className="text-2xl font-bold text-gray-900">Students</h2>
      </div>

      <div className="space-y-3">
        {students.map((student, idx) => {
          const config = statusConfig[student.status];
          const Icon = config.icon;

          return (
            <motion.div
              key={student.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`${config.bg} rounded-lg p-4 border border-gray-200`}
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-semibold text-gray-900">{student.name}</p>
                  <p className="text-xs text-gray-600 mt-1">{student.class}</p>
                </div>
                <Icon className={`w-5 h-5 ${config.color}`} />
              </div>

              <div className="flex justify-between text-xs text-gray-600 mt-2">
                <span>Progress: <strong>{student.progress}%</strong></span>
                <span>Attendance: <strong>{student.attendance}</strong></span>
              </div>

              <div className="mt-2 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full"
                  style={{ width: `${student.progress}%` }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
