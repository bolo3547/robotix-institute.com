'use client';

import { motion } from 'framer-motion';
import { Bell, AlertCircle, Info, CheckCircle, X } from 'lucide-react';
import { useState } from 'react';

export default function Notifications() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'success',
      title: 'Great Progress!',
      message: 'Emma completed the robotics challenge successfully',
      time: '2 hours ago',
    },
    {
      id: 2,
      type: 'info',
      title: 'Class Reminder',
      message: 'Robotics class tomorrow at 3:00 PM',
      time: '1 day ago',
    },
    {
      id: 3,
      type: 'warning',
      title: 'Payment Due',
      message: 'Monthly tuition payment due on March 15th',
      time: '3 days ago',
    },
  ]);

  const [isOpen, setIsOpen] = useState(false);

  const removeNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const iconMap = {
    success: CheckCircle,
    info: Info,
    warning: AlertCircle,
  };

  const colorMap = {
    success: 'border-green-200 bg-green-50',
    info: 'border-blue-200 bg-blue-50',
    warning: 'border-yellow-200 bg-yellow-50',
  };

  return (
    <div className="relative">
      {/* Bell Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
      >
        <Bell className="w-6 h-6" />
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {notifications.length}
          </span>
        )}
      </motion.button>

      {/* Dropdown */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-100 z-50"
        >
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-900">Notifications</h3>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <p>No notifications</p>
              </div>
            ) : (
              notifications.map((notif) => {
                const Icon = iconMap[notif.type as keyof typeof iconMap];
                return (
                  <motion.div
                    key={notif.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-4 border-l-4 border-b flex justify-between items-start ${colorMap[notif.type as keyof typeof colorMap]}`}
                  >
                    <div className="flex gap-3 flex-1">
                      <Icon className="w-5 h-5 flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 text-sm">{notif.title}</p>
                        <p className="text-xs text-gray-600 mt-1">{notif.message}</p>
                        <p className="text-xs text-gray-500 mt-2">{notif.time}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeNotification(notif.id)}
                      className="text-gray-400 hover:text-gray-600 ml-2"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                );
              })
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
