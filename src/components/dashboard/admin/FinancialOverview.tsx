'use client';

import { motion } from 'framer-motion';
import { DollarSign } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function FinancialOverview() {
  const revenueData = [
    { month: 'Jan', revenue: 150000 },
    { month: 'Feb', revenue: 180000 },
    { month: 'Mar', revenue: 210000 },
    { month: 'Apr', revenue: 195000 },
    { month: 'May', revenue: 230000 },
  ];

  const paymentMethods = [
    { method: 'Mobile Money', amount: 450000 },
    { method: 'Bank Transfer', amount: 320000 },
    { method: 'Card', amount: 195000 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700"
    >
      <div className="flex items-center gap-3 mb-6">
        <DollarSign className="w-6 h-6 text-green-400" />
        <h2 className="text-2xl font-bold text-white">Financial Overview</h2>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
          <p className="text-gray-400 text-sm">Total Revenue</p>
          <p className="text-3xl font-bold text-green-400 mt-2">ZMW 2.3M</p>
          <p className="text-xs text-green-300 mt-2">↑ +23% this month</p>
        </div>
        <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
          <p className="text-gray-400 text-sm">Pending Payments</p>
          <p className="text-3xl font-bold text-yellow-400 mt-2">ZMW 180K</p>
          <p className="text-xs text-yellow-300 mt-2">12 invoices pending</p>
        </div>
        <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
          <p className="text-gray-400 text-sm">Expenses</p>
          <p className="text-3xl font-bold text-red-400 mt-2">ZMW 580K</p>
          <p className="text-xs text-red-300 mt-2">25% of revenue</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
          <h3 className="text-lg font-bold text-white mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#555" />
              <XAxis dataKey="month" stroke="#999" />
              <YAxis stroke="#999" />
              <Tooltip contentStyle={{ backgroundColor: '#374151', border: 'none', borderRadius: '8px', color: '#fff' }} />
              <Line type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={2} dot={{ fill: '#22c55e' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Payment Methods */}
        <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
          <h3 className="text-lg font-bold text-white mb-4">Payment Methods</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={paymentMethods}>
              <CartesianGrid strokeDasharray="3 3" stroke="#555" />
              <XAxis dataKey="method" stroke="#999" />
              <YAxis stroke="#999" />
              <Tooltip contentStyle={{ backgroundColor: '#374151', border: 'none', borderRadius: '8px', color: '#fff' }} />
              <Bar dataKey="amount" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}
