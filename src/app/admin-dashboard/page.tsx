'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, DollarSign, AlertCircle, Plus } from 'lucide-react';
import AdminDashboardLayout from '@/components/dashboard/admin/AdminDashboardLayout';
import UserManagement from '@/components/dashboard/admin/UserManagement';
import FinancialOverview from '@/components/dashboard/admin/FinancialOverview';
import SystemHealth from '@/components/dashboard/admin/SystemHealth';
import RecentActivity from '@/components/dashboard/admin/RecentActivity';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if ((session?.user as any)?.role !== 'admin') {
    return <div className="flex items-center justify-center min-h-screen">Unauthorized</div>;
  }

  const stats = [
    { label: 'Total Users', value: 247, change: '+12%', icon: Users, color: 'blue' },
    { label: 'Active Students', value: 156, change: '+8%', icon: TrendingUp, color: 'green' },
    { label: 'Revenue (ZMW)', value: '2.3M', change: '+23%', icon: DollarSign, color: 'purple' },
    { label: 'System Issues', value: 2, change: '-1', icon: AlertCircle, color: 'red' },
  ];

  return (
    <AdminDashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-start"
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
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
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
