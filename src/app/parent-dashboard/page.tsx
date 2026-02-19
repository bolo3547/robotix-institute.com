'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Clock, Award, BookOpen, TrendingUp } from 'lucide-react';
import ParentDashboardLayout from '@/components/dashboard/parent/ParentDashboardLayout';
import ChildProfile from '@/components/dashboard/parent/ChildProfile';
import ProgressTracking from '@/components/dashboard/parent/ProgressTracking';
import AttendanceRecords from '@/components/dashboard/parent/AttendanceRecords';
import InstructorFeedback from '@/components/dashboard/parent/InstructorFeedback';
import PaymentHistory from '@/components/dashboard/parent/PaymentHistory';
import Notifications from '@/components/dashboard/parent/Notifications';

interface PaymentData {
  id: string;
  description: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'overdue';
  method: string | null;
  reference: string | null;
  receiptNumber: string | null;
  paidAt: string | null;
  dueDate: string | null;
  notes: string | null;
  createdAt: string;
}

export default function ParentDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [payments, setPayments] = useState<PaymentData[]>([]);
  const [paymentsLoading, setPaymentsLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  const fetchPayments = useCallback(async () => {
    try {
      const res = await fetch('/api/payments');
      if (res.ok) {
        const data = await res.json();
        setPayments(data);
      }
    } catch (err) {
      console.error('Failed to fetch payments:', err);
    } finally {
      setPaymentsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchPayments();
    }
  }, [status, fetchPayments]);

  if (status === 'loading') {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if ((session?.user as any)?.role !== 'parent') {
    return <div className="flex items-center justify-center min-h-screen">Unauthorized</div>;
  }

  const childData = {
    id: 'child-1',
    name: 'Emma',
    age: 9,
    enrolledProgram: 'Robotics Beginner',
    profileImage: '👧',
    totalHours: 42,
    startDate: '2024-01-15',
  };

  const skillProgress = [
    { name: 'Coding', value: 75, target: 100 },
    { name: 'Robotics', value: 68, target: 100 },
    { name: 'Logic', value: 82, target: 100 },
  ];

  const attendanceData = [
    { week: 'Week 1', attended: 3, total: 3 },
    { week: 'Week 2', attended: 2, total: 3 },
    { week: 'Week 3', attended: 3, total: 3 },
    { week: 'Week 4', attended: 3, total: 3 },
  ];

  // Map API payments to PaymentHistory format
  const paymentHistoryData = payments.length > 0
    ? payments.map((p) => ({
        id: p.id,
        date: p.paidAt || p.createdAt,
        description: p.description,
        amount: p.amount,
        status: p.status as 'paid' | 'pending' | 'overdue',
        receiptNumber: p.receiptNumber,
        method: p.method,
        currency: p.currency,
      }))
    : [
        { id: 'demo-1', date: '2026-01-15', description: 'January Tuition', amount: 15000, status: 'paid' as const, receiptNumber: null, method: null, currency: 'ZMW' },
        { id: 'demo-2', date: '2026-02-15', description: 'February Tuition', amount: 15000, status: 'paid' as const, receiptNumber: null, method: null, currency: 'ZMW' },
        { id: 'demo-3', date: '2026-03-15', description: 'March Tuition', amount: 15000, status: 'pending' as const, receiptNumber: null, method: null, currency: 'ZMW' },
      ];

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899'];

  return (
    <ParentDashboardLayout>
      <div className="space-y-8">
        {/* Header with Notifications */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-start"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome, {session?.user?.name}!</h1>
            <p className="text-gray-600 mt-2">Monitor your child's learning journey</p>
          </div>
          <Notifications />
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Hours</p>
                <p className="text-2xl font-bold text-blue-600 mt-2">{childData.totalHours}h</p>
              </div>
              <Clock className="w-8 h-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Skills Progress</p>
                <p className="text-2xl font-bold text-purple-600 mt-2">75%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Attendance</p>
                <p className="text-2xl font-bold text-green-600 mt-2">97%</p>
              </div>
              <BookOpen className="w-8 h-8 text-green-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Achievements</p>
                <p className="text-2xl font-bold text-orange-600 mt-2">8</p>
              </div>
              <Award className="w-8 h-8 text-orange-400" />
            </div>
          </div>
        </motion.div>

        {/* Child Profile */}
        <ChildProfile child={childData} />

        {/* Progress Tracking */}
        <ProgressTracking skills={skillProgress} />

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Attendance Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md p-6 border border-gray-100"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4">Attendance Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="attended" fill="#3b82f6" name="Attended" />
                <Bar dataKey="total" fill="#e5e7eb" name="Total" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Skills Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md p-6 border border-gray-100"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4">Skills Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={skillProgress} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                  {skillProgress.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Attendance Records */}
        <AttendanceRecords attendance={attendanceData} />

        {/* Instructor Feedback */}
        <InstructorFeedback />

        {/* Payment History */}
        <PaymentHistory payments={paymentHistoryData} />
      </div>
    </ParentDashboardLayout>
  );
}
