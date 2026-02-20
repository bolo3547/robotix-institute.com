'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, DollarSign, AlertCircle, Plus } from 'lucide-react';
import AdminDashboardLayout from '@/components/dashboard/admin/AdminDashboardLayout';
import UserManagement from '@/components/dashboard/admin/UserManagement';
import FinancialOverview from '@/components/dashboard/admin/FinancialOverview';
import SystemHealth from '@/components/dashboard/admin/SystemHealth';
import RecentActivity from '@/components/dashboard/admin/RecentActivity';

interface AdminStats {
  totalUsers: number;
  totalStudents: number;
  revenueDisplay: string;
  pendingPayments: number;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [dashStats, setDashStats] = useState<AdminStats>({ totalUsers: 0, totalStudents: 0, revenueDisplay: '0', pendingPayments: 0 });
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  const fetchDashboard = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/dashboard');
      if (res.ok) {
        const data = await res.json();
        setDashStats(data.stats || { totalUsers: 0, totalStudents: 0, revenueDisplay: '0', pendingPayments: 0 });
      }
    } catch (err) {
      console.error('Failed to fetch admin dashboard:', err);
    } finally {
      setDataLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchDashboard();
    }
  }, [status, fetchDashboard]);

  if (status === 'loading' || (status === 'authenticated' && dataLoading)) {
    return (
      <AdminDashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </AdminDashboardLayout>
    );
  }

  if ((session?.user as any)?.role !== 'admin') {
    return <div className="flex items-center justify-center min-h-screen">Unauthorized</div>;
  }

  const stats = [
    { label: 'Total Users', value: dashStats.totalUsers, change: '', icon: Users, color: 'blue' },
    { label: 'Active Students', value: dashStats.totalStudents, change: '', icon: TrendingUp, color: 'green' },
    { label: 'Revenue (ZMW)', value: dashStats.revenueDisplay, change: '', icon: DollarSign, color: 'purple' },
    { label: 'Pending Payments', value: dashStats.pendingPayments, change: '', icon: AlertCircle, color: 'red' },
  ];

  return (
    <AdminDashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage platform operations and analytics</p>
          </div>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            <Plus className="w-5 h-5" />
            Add User
          </button>
        </motion.div>

        {/* KPI Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6"
        >
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            const colorClasses = {
              blue: 'from-blue-50 to-blue-100 border-blue-200',
              green: 'from-green-50 to-green-100 border-green-200',
              purple: 'from-purple-50 to-purple-100 border-purple-200',
              red: 'from-red-50 to-red-100 border-red-200',
            };

            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`bg-gradient-to-br ${colorClasses[stat.color as keyof typeof colorClasses]} rounded-lg p-6 border`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    <p className="text-xs text-green-600 mt-2">↑ {stat.change}</p>
                  </div>
                  <Icon className="w-8 h-8 text-gray-400" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Management */}
          <div className="lg:col-span-2">
            <UserManagement />
          </div>

          {/* System Health */}
          <SystemHealth />
        </div>

        {/* Financial Overview */}
        <FinancialOverview />

        {/* Recent Activity */}
        <RecentActivity />
      </div>
    </AdminDashboardLayout>
  );
}
