'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft, Plus, Trash2, Edit2, CheckCircle, Clock, AlertCircle,
  X, DollarSign, Search, Filter, User as UserIcon
} from 'lucide-react';

interface UserInfo {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Payment {
  id: string;
  userId: string;
  user: UserInfo;
  description: string;
  amount: number;
  currency: string;
  status: string;
  method: string | null;
  reference: string | null;
  receiptNumber: string | null;
  paidAt: string | null;
  dueDate: string | null;
  notes: string | null;
  createdAt: string;
}

const statusColors: Record<string, { bg: string; text: string; icon: typeof CheckCircle }> = {
  paid: { bg: 'bg-green-500/20 border-green-500/30', text: 'text-green-400', icon: CheckCircle },
  pending: { bg: 'bg-yellow-500/20 border-yellow-500/30', text: 'text-yellow-400', icon: Clock },
  overdue: { bg: 'bg-red-500/20 border-red-500/30', text: 'text-red-400', icon: AlertCircle },
  cancelled: { bg: 'bg-gray-500/20 border-gray-500/30', text: 'text-gray-400', icon: X },
};

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState({
    userId: '',
    description: '',
    amount: '',
    currency: 'ZMW',
    status: 'pending',
    method: '',
    reference: '',
    dueDate: '',
    notes: '',
  });

  const fetchPayments = useCallback(async () => {
    try {
      const url = filterStatus !== 'all' ? `/api/admin/payments?status=${filterStatus}` : '/api/admin/payments';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setPayments(data);
      }
    } catch (err) {
      console.error('Failed to fetch payments:', err);
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  }, []);

  useEffect(() => { fetchPayments(); }, [fetchPayments]);
  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingPayment ? 'PUT' : 'POST';
      const body = editingPayment ? { id: editingPayment.id, ...form } : form;
      const res = await fetch('/api/admin/payments', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setShowForm(false);
        setEditingPayment(null);
        setForm({ userId: '', description: '', amount: '', currency: 'ZMW', status: 'pending', method: '', reference: '', dueDate: '', notes: '' });
        fetchPayments();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to save');
      }
    } catch (err) {
      console.error('Save failed:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this payment record?')) return;
    try {
      await fetch(`/api/admin/payments?id=${id}`, { method: 'DELETE' });
      fetchPayments();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const markAsPaid = async (payment: Payment) => {
    const method = prompt('Payment method (mobile_money / bank_transfer / card / cash):', 'mobile_money');
    if (!method) return;
    const reference = prompt('Payment reference / transaction ID:', '');
    try {
      await fetch('/api/admin/payments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: payment.id,
          status: 'paid',
          method,
          reference: reference || undefined,
        }),
      });
      fetchPayments();
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  const openEdit = (payment: Payment) => {
    setEditingPayment(payment);
    setForm({
      userId: payment.userId,
      description: payment.description,
      amount: payment.amount.toString(),
      currency: payment.currency,
      status: payment.status,
      method: payment.method || '',
      reference: payment.reference || '',
      dueDate: payment.dueDate ? payment.dueDate.split('T')[0] : '',
      notes: payment.notes || '',
    });
    setShowForm(true);
  };

  const filteredPayments = payments.filter((p) => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        p.user.name.toLowerCase().includes(term) ||
        p.user.email.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        (p.receiptNumber && p.receiptNumber.toLowerCase().includes(term))
      );
    }
    return true;
  });

  const totalAmount = filteredPayments.reduce((sum, p) => sum + p.amount, 0);
  const paidAmount = filteredPayments.filter((p) => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = filteredPayments.filter((p) => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
  const overdueAmount = filteredPayments.filter((p) => p.status === 'overdue').reduce((sum, p) => sum + p.amount, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-orange-400 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
              <ArrowLeft className="w-5 h-5 text-white" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">Payment Management</h1>
              <p className="text-white/60 text-sm mt-1">Track and update parent payments</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setEditingPayment(null);
              setForm({ userId: '', description: '', amount: '', currency: 'ZMW', status: 'pending', method: '', reference: '', dueDate: '', notes: '' });
              setShowForm(true);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-orange-400 to-orange-600 text-white font-medium hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            Add Payment
          </motion.button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total', amount: totalAmount, color: 'from-blue-500/20 to-blue-600/20 border-blue-500/30', textColor: 'text-blue-400' },
            { label: 'Paid', amount: paidAmount, color: 'from-green-500/20 to-green-600/20 border-green-500/30', textColor: 'text-green-400' },
            { label: 'Pending', amount: pendingAmount, color: 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/30', textColor: 'text-yellow-400' },
            { label: 'Overdue', amount: overdueAmount, color: 'from-red-500/20 to-red-600/20 border-red-500/30', textColor: 'text-red-400' },
          ].map((stat) => (
            <div key={stat.label} className={`rounded-xl bg-gradient-to-br ${stat.color} border backdrop-blur-xl p-5`}>
              <p className="text-white/60 text-sm">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.textColor} mt-1`}>ZMW {stat.amount.toLocaleString()}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search by name, email, description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/50"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-white/40" />
            {['all', 'pending', 'paid', 'overdue', 'cancelled'].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  filterStatus === s
                    ? 'bg-orange-500 text-white'
                    : 'bg-white/10 text-white/60 hover:bg-white/20'
                }`}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Payments Table */}
        <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-4 text-xs font-semibold text-white/50 uppercase">Parent</th>
                  <th className="text-left py-4 px-4 text-xs font-semibold text-white/50 uppercase">Description</th>
                  <th className="text-left py-4 px-4 text-xs font-semibold text-white/50 uppercase">Amount</th>
                  <th className="text-left py-4 px-4 text-xs font-semibold text-white/50 uppercase">Status</th>
                  <th className="text-left py-4 px-4 text-xs font-semibold text-white/50 uppercase">Receipt</th>
                  <th className="text-left py-4 px-4 text-xs font-semibold text-white/50 uppercase">Date</th>
                  <th className="text-right py-4 px-4 text-xs font-semibold text-white/50 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-white/40">
                      <DollarSign className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p>No payments found</p>
                    </td>
                  </tr>
                ) : (
                  filteredPayments.map((payment) => {
                    const sc = statusColors[payment.status] || statusColors.pending;
                    const StatusIcon = sc.icon;
                    return (
                      <motion.tr
                        key={payment.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-xs font-bold">
                              {payment.user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-white text-sm font-medium">{payment.user.name}</p>
                              <p className="text-white/40 text-xs">{payment.user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-white/80 text-sm">{payment.description}</td>
                        <td className="py-3 px-4 text-white font-semibold text-sm">
                          {payment.currency} {payment.amount.toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${sc.bg} ${sc.text}`}>
                            <StatusIcon className="w-3 h-3" />
                            {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-white/60 text-xs font-mono">
                          {payment.receiptNumber || '—'}
                        </td>
                        <td className="py-3 px-4 text-white/60 text-xs">
                          {new Date(payment.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-end gap-1">
                            {payment.status !== 'paid' && (
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => markAsPaid(payment)}
                                className="p-1.5 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
                                title="Mark as Paid"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </motion.button>
                            )}
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => openEdit(payment)}
                              className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDelete(payment.id)}
                              className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">
                {editingPayment ? 'Edit Payment' : 'Create Payment'}
              </h2>
              <button onClick={() => { setShowForm(false); setEditingPayment(null); }} className="p-1 rounded-lg hover:bg-white/10">
                <X className="w-5 h-5 text-white/60" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Parent Selection */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">
                  <UserIcon className="w-4 h-4 inline mr-1" />
                  Parent / User *
                </label>
                <select
                  required
                  value={form.userId}
                  onChange={(e) => setForm({ ...form, userId: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/50"
                >
                  <option value="">Select a parent...</option>
                  {users.filter((u) => u.role === 'parent').map((u) => (
                    <option key={u.id} value={u.id} className="bg-slate-900">{u.name} ({u.email})</option>
                  ))}
                  <optgroup label="All Users" className="bg-slate-900">
                    {users.filter((u) => u.role !== 'parent').map((u) => (
                      <option key={u.id} value={u.id} className="bg-slate-900">{u.name} ({u.email}) - {u.role}</option>
                    ))}
                  </optgroup>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Description *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. February 2026 Tuition"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/50"
                />
              </div>

              {/* Amount + Currency */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-white/70 mb-1">Amount *</label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="15000"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">Currency</label>
                  <select
                    value={form.currency}
                    onChange={(e) => setForm({ ...form, currency: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/50"
                  >
                    <option value="ZMW" className="bg-slate-900">ZMW</option>
                    <option value="USD" className="bg-slate-900">USD</option>
                  </select>
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/50"
                >
                  <option value="pending" className="bg-slate-900">Pending</option>
                  <option value="paid" className="bg-slate-900">Paid</option>
                  <option value="overdue" className="bg-slate-900">Overdue</option>
                  <option value="cancelled" className="bg-slate-900">Cancelled</option>
                </select>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Payment Method</label>
                <select
                  value={form.method}
                  onChange={(e) => setForm({ ...form, method: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/50"
                >
                  <option value="" className="bg-slate-900">Not specified</option>
                  <option value="mobile_money" className="bg-slate-900">Mobile Money (MTN/Airtel/Zamtel)</option>
                  <option value="bank_transfer" className="bg-slate-900">Bank Transfer</option>
                  <option value="card" className="bg-slate-900">Card</option>
                  <option value="cash" className="bg-slate-900">Cash</option>
                </select>
              </div>

              {/* Reference */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Payment Reference / Transaction ID</label>
                <input
                  type="text"
                  placeholder="e.g. TXN-123456"
                  value={form.reference}
                  onChange={(e) => setForm({ ...form, reference: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/50"
                />
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Due Date</label>
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/50"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Notes</label>
                <textarea
                  rows={2}
                  placeholder="Optional notes..."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/50 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setEditingPayment(null); }}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-white/10 text-white/70 hover:bg-white/20 transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 rounded-lg bg-gradient-to-r from-orange-400 to-orange-600 text-white font-medium hover:shadow-lg transition-all text-sm"
                >
                  {editingPayment ? 'Update Payment' : 'Create Payment'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
