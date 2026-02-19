'use client';

import { motion } from 'framer-motion';
import { Activity, CheckCircle, AlertCircle, Clock } from 'lucide-react';

export default function RecentActivity() {
  const activities = [
    { id: 1, type: 'user_joined', message: 'New parent John Doe joined', time: '2 hours ago', icon: CheckCircle },
    { id: 2, type: 'payment', message: 'Payment received from Parent #34', amount: 'ZMW 15,000', time: '3 hours ago', icon: CheckCircle },
    { id: 3, type: 'alert', message: 'Student attendance below threshold', student: 'Mike Wilson', time: '5 hours ago', icon: AlertCircle },
    { id: 4, type: 'course', message: 'New course "Advanced Robotics" created', time: '1 day ago', icon: CheckCircle },
    { id: 5, type: 'system', message: 'Database backup completed', time: '2 days ago', icon: CheckCircle },
  ];

  const iconMap = {
    user_joined: CheckCircle,
    payment: CheckCircle,
    alert: AlertCircle,
    course: CheckCircle,
    system: Clock,
  };

  const colorMap = {
    user_joined: 'bg-blue-900 border-blue-700 text-blue-200',
    payment: 'bg-green-900 border-green-700 text-green-200',
    alert: 'bg-yellow-900 border-yellow-700 text-yellow-200',
    course: 'bg-purple-900 border-purple-700 text-purple-200',
    system: 'bg-gray-700 border-gray-600 text-gray-300',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700"
    >
      <div className="flex items-center gap-3 mb-6">
        <Activity className="w-6 h-6 text-blue-400" />
        <h2 className="text-2xl font-bold text-white">Recent Activity</h2>
      </div>

      <div className="space-y-3">
        {activities.map((activity, idx) => {
          const Icon = iconMap[activity.type as keyof typeof iconMap];
          const colorClass = colorMap[activity.type as keyof typeof colorMap];

          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`${colorClass} rounded-lg p-4 border flex items-start justify-between`}
            >
              <div className="flex gap-3 flex-1">
                <Icon className="w-5 h-5 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold">{activity.message}</p>
                  {activity.amount && <p className="text-sm opacity-75">{activity.amount}</p>}
                  {activity.student && <p className="text-sm opacity-75">{activity.student}</p>}
                </div>
              </div>
              <p className="text-xs opacity-75 ml-4 flex-shrink-0">{activity.time}</p>
            </motion.div>
          );
        })}
      </div>

      <button className="w-full mt-4 bg-gray-700 hover:bg-gray-600 text-gray-200 py-2 rounded-lg transition font-medium">
        View All Activity
      </button>
    </motion.div>
  );
}
