'use client';

import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, Zap } from 'lucide-react';

export default function SystemHealth() {
  const health = [
    { label: 'API Server', status: 'healthy', uptime: '99.9%', icon: CheckCircle },
    { label: 'Database', status: 'healthy', uptime: '99.95%', icon: CheckCircle },
    { label: 'Cache', status: 'warning', uptime: '98.5%', icon: AlertTriangle },
    { label: 'Mail Service', status: 'healthy', uptime: '99.8%', icon: CheckCircle },
  ];

  const statusColors = {
    healthy: 'bg-green-900 text-green-200 border-green-700',
    warning: 'bg-yellow-900 text-yellow-200 border-yellow-700',
    error: 'bg-red-900 text-red-200 border-red-700',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700"
    >
      <div className="flex items-center gap-3 mb-6">
        <Zap className="w-6 h-6 text-yellow-400" />
        <h2 className="text-2xl font-bold text-white">System Health</h2>
      </div>

      <div className="space-y-3">
        {health.map((item, idx) => {
          const Icon = item.icon;
          const colorClass = statusColors[item.status as keyof typeof statusColors];

          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`${colorClass} rounded-lg p-4 border flex items-center justify-between`}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5" />
                <div>
                  <p className="font-semibold">{item.label}</p>
                  <p className="text-sm opacity-80">Uptime: {item.uptime}</p>
                </div>
              </div>
              <span className="text-xs font-bold uppercase">{item.status}</span>
            </motion.div>
          );
        })}
      </div>

      <button className="w-full mt-4 bg-gray-700 hover:bg-gray-600 text-gray-200 py-2 rounded-lg transition font-medium">
        View Detailed Report
      </button>
    </motion.div>
  );
}
