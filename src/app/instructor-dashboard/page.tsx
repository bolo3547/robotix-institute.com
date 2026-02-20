'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, CheckCircle, TrendingUp, Plus } from 'lucide-react';
import InstructorDashboardLayout from '@/components/dashboard/instructor/InstructorDashboardLayout';
import ClassList from '@/components/dashboard/instructor/ClassList';
import StudentList from '@/components/dashboard/instructor/StudentList';
import PerformanceAnalytics from '@/components/dashboard/instructor/PerformanceAnalytics';

interface ClassData {
  id: number;
  name: string;
  level: string;
  students: number;
  schedule: string;
  progress: number;
}

interface StudentData {
  id: number;
  name: string;
  class: string;
  progress: number;
  attendance: string;
  status: 'excellent' | 'good' | 'needs_help';
}

interface DashboardStats {
  activeClasses: number;
  totalStudents: number;
  avgProgress: number;
  totalAssignments: number;
}

export default function InstructorDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [students, setStudents] = useState<StudentData[]>([]);
  const [stats, setStats] = useState<DashboardStats>({ activeClasses: 0, totalStudents: 0, avgProgress: 0, totalAssignments: 0 });
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  const fetchDashboard = useCallback(async () => {
    try {
      const res = await fetch('/api/instructor/dashboard');
      if (res.ok) {
        const data = await res.json();
        setClasses(data.classes || []);
        setStudents(data.students || []);
        setStats(data.stats || { activeClasses: 0, totalStudents: 0, avgProgress: 0, totalAssignments: 0 });
      }
    } catch (err) {
      console.error('Failed to fetch instructor dashboard:', err);
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
      <InstructorDashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </InstructorDashboardLayout>
    );
  }

  if ((session?.user as any)?.role !== 'instructor') {
    return <div className="flex items-center justify-center min-h-screen">Unauthorized</div>;
  }

  return (
    <InstructorDashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-start"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome, {session?.user?.name}!</h1>
            <p className="text-gray-600 mt-2">Manage your classes and track student progress</p>
          </div>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            <Plus className="w-5 h-5" />
            Create Lesson
          </button>
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
                <p className="text-gray-600 text-sm font-medium">Active Classes</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{stats.activeClasses}</p>
              </div>
              <BookOpen className="w-8 h-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Students</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">{stats.totalStudents}</p>
              </div>
              <Users className="w-8 h-8 text-purple-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Avg. Progress</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{stats.avgProgress}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Assignments</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">{stats.totalAssignments}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-orange-400" />
            </div>
          </div>
        </motion.div>

        {/* Classes and Students */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ClassList classes={classes} />
          </div>
          <div>
            <StudentList students={students} />
          </div>
        </div>

        {/* Performance Analytics */}
        <PerformanceAnalytics />
      </div>
    </InstructorDashboardLayout>
  );
}
