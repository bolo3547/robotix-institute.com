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

interface ProgressEntry {
  week: number;
  topic: string;
  score: number | null;
  attendance: string;
  homework: string;
}

interface EnrollmentEntry {
  id: string;
  program: string;
  level: string;
  status: string;
  startDate: string;
  user?: { id: string; name: string; email: string };
  progress: ProgressEntry[];
  payments: { id: string; amount: number; status: string; paidAt: string | null }[];
}

interface SummaryData {
  totalEnrollments: number;
  activeEnrollments: number;
  totalWeeks: number;
  avgScore: number;
  attendanceRate: number;
  homeworkCompleted: number;
  totalHomework: number;
}

export default function ParentDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [payments, setPayments] = useState<PaymentData[]>([]);
  const [paymentsLoading, setPaymentsLoading] = useState(true);
  const [enrollments, setEnrollments] = useState<EnrollmentEntry[]>([]);
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [childName, setChildName] = useState('Your Child');
  const [dataLoading, setDataLoading] = useState(true);

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

  const fetchChildProgress = useCallback(async () => {
    try {
      const res = await fetch('/api/parent/progress');
      if (res.ok) {
        const data = await res.json();
        setEnrollments(data.enrollments || []);
        setSummary(data.summary || null);
        if (data.enrollments?.length > 0 && data.enrollments[0].user?.name) {
          setChildName(data.enrollments[0].user.name);
        }
      }
    } catch (err) {
      console.error('Failed to fetch child progress:', err);
    } finally {
      setDataLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchPayments();
      fetchChildProgress();
    }
  }, [status, fetchPayments, fetchChildProgress]);

  if (status === 'loading' || (status === 'authenticated' && dataLoading)) {
    return (
      <ParentDashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </ParentDashboardLayout>
    );
  }

  if ((session?.user as any)?.role !== 'parent') {
    return <div className="flex items-center justify-center min-h-screen">Unauthorized</div>;
  }

  // Compute child data from real enrollments
  const totalHours = summary ? summary.totalWeeks * 2 : 0; // ~2 hours per session
  const childData = {
    id: enrollments[0]?.user?.id || 'child-1',
    name: childName,
    age: 0, // Age not stored in DB
    enrolledProgram: enrollments.length > 0 ? enrollments.map(e => e.program).join(', ') : 'Not enrolled',
    profileImage: '👧',
    totalHours,
    startDate: enrollments.length > 0 ? enrollments[0].startDate : new Date().toISOString(),
  };

  // Compute skill progress from enrollments
  const skillProgress = enrollments.length > 0
    ? enrollments.map(e => {
        const scored = e.progress.filter(p => p.score !== null);
        const avgVal = scored.length > 0
          ? Math.round(scored.reduce((a, b) => a + (b.score || 0), 0) / scored.length)
          : 0;
        return { name: e.program.split(' ')[0], value: avgVal, target: 100 };
      })
    : [
        { name: 'Coding', value: 0, target: 100 },
        { name: 'Robotics', value: 0, target: 100 },
      ];

  // Compute attendance data from progress entries
  const allProgress = enrollments.flatMap(e => e.progress);
  const weekMap = new Map<number, { attended: number; total: number }>();
  allProgress.forEach(p => {
    const existing = weekMap.get(p.week) || { attended: 0, total: 0 };
    existing.total += 1;
    if (p.attendance === 'present' || p.attendance === 'late') existing.attended += 1;
    weekMap.set(p.week, existing);
  });
  const attendanceData = Array.from(weekMap.entries())
    .sort(([a], [b]) => a - b)
    .slice(-4) // Last 4 weeks
    .map(([week, data]) => ({
      week: `Week ${week}`,
      attended: data.attended,
      total: data.total,
    }));

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

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

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
            <p className="text-gray-600 mt-2">Monitor {childName}&apos;s learning journey</p>
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
                <p className="text-2xl font-bold text-blue-600 mt-2">{totalHours}h</p>
              </div>
              <Clock className="w-8 h-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Avg Score</p>
                <p className="text-2xl font-bold text-purple-600 mt-2">{summary?.avgScore || 0}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Attendance</p>
                <p className="text-2xl font-bold text-green-600 mt-2">{summary?.attendanceRate || 0}%</p>
              </div>
              <BookOpen className="w-8 h-8 text-green-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Programs</p>
                <p className="text-2xl font-bold text-orange-600 mt-2">{summary?.totalEnrollments || 0}</p>
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
        {attendanceData.length > 0 && (
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
        )}

        {/* Attendance Records */}
        <AttendanceRecords attendance={attendanceData.length > 0 ? attendanceData : [{ week: 'No data', attended: 0, total: 0 }]} />

        {/* Instructor Feedback */}
        <InstructorFeedback />

        {/* Payment History */}
        <PaymentHistory payments={paymentHistoryData} />
      </div>
    </ParentDashboardLayout>
  );
}
