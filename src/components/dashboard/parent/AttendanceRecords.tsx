'use client';

import { motion } from 'framer-motion';
import { Calendar, Check } from 'lucide-react';

interface AttendanceRecord {
  week: string;
  attended: number;
  total: number;
}

interface AttendanceRecordsProps {
  attendance: AttendanceRecord[];
}

export default function AttendanceRecords({ attendance }: AttendanceRecordsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md p-4 sm:p-6 md:p-8 border border-gray-100"
    >
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
        <h2 className="text-lg sm:text-2xl font-bold text-gray-900">Attendance Records</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold text-gray-700 text-xs sm:text-sm">Week</th>
              <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold text-gray-700 text-xs sm:text-sm">Attended</th>
              <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold text-gray-700 text-xs sm:text-sm">Total</th>
              <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold text-gray-700 text-xs sm:text-sm">Rate</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map((record, idx) => {
              const rate = (record.attended / record.total) * 100;
              return (
                <motion.tr
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="border-b border-gray-100 hover:bg-blue-50"
                >
                  <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-900 font-medium text-xs sm:text-sm">{record.week}</td>
                  <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-700 text-xs sm:text-sm">{record.attended} days</td>
                  <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-700 text-xs sm:text-sm">{record.total} days</td>
                  <td className="py-2 sm:py-3 px-2 sm:px-4">
                    <div className="flex items-center gap-2">
                      <div className="bg-green-100 rounded-full p-1">
                        <Check className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="font-semibold text-green-600">{Math.round(rate)}%</span>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
