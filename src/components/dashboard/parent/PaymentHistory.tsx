'use client';

import { motion } from 'framer-motion';
import { CreditCard, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface Payment {
  id: number;
  date: string;
  description: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
}

interface PaymentHistoryProps {
  payments: Payment[];
}

export default function PaymentHistory({ payments }: PaymentHistoryProps) {
  const statusConfig = {
    paid: { icon: CheckCircle, color: 'green', bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-600' },
    pending: { icon: Clock, color: 'yellow', bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-600' },
    overdue: { icon: AlertCircle, color: 'red', bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-600' },
  };

  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
  const paidAmount = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md p-8 border border-gray-100"
    >
      <div className="flex items-center gap-3 mb-6">
        <CreditCard className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">Payment History</h2>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <p className="text-sm text-gray-600">Total Amount</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">ZMW {totalAmount.toLocaleString()}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <p className="text-sm text-gray-600">Paid</p>
          <p className="text-2xl font-bold text-green-600 mt-1">ZMW {paidAmount.toLocaleString()}</p>
        </div>
        <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
          <p className="text-sm text-gray-600">Outstanding</p>
          <p className="text-2xl font-bold text-orange-600 mt-1">ZMW {(totalAmount - paidAmount).toLocaleString()}</p>
        </div>
      </div>

      {/* Payment Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Description</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment, idx) => {
              const config = statusConfig[payment.status];
              const Icon = config.icon;
              return (
                <motion.tr
                  key={payment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`border-b border-gray-100 ${config.bg} hover:opacity-75`}
                >
                  <td className="py-3 px-4 text-gray-900 font-medium">{new Date(payment.date).toLocaleDateString()}</td>
                  <td className="py-3 px-4 text-gray-700">{payment.description}</td>
                  <td className="py-3 px-4 font-semibold">ZMW {payment.amount.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <div className={`flex items-center gap-2 font-semibold ${config.text}`}>
                      <Icon className="w-4 h-4" />
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
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
