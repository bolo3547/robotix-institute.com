'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, CheckCircle, TrendingUp, Plus } from 'lucide-react';
import InstructorDashboardLayout from '@/components/dashboard/instructor/InstructorDashboardLayout';
import ClassList from '@/components/dashboard/instructor/ClassList';
import StudentList from '@/components/dashboard/instructor/StudentList';
import PerformanceAnalytics from '@/components/dashboard/instructor/PerformanceAnalytics';

export default function InstructorDashboard() {
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

  if ((session?.user as any)?.role !== 'instructor') {
    return <div className="flex items-center justify-center min-h-screen">Unauthorized</div>;
  }

  const classes = [
    {
      id: 1,
      name: 'Robotics Beginner - Batch A',
      level: 'Beginner',
      students: 15,
      schedule: 'Mon, Wed, Fri - 3:00 PM',
      progress: 65,
    },
    {
      id: 2,
      name: 'Coding Basics - Batch B',
      level: 'Beginner',
      students: 12,
      schedule: 'Tue, Thu - 4:00 PM',
      progress: 72,
    },
    {
      id: 3,
      name: 'Advanced Robotics - Batch C',
      level: 'Intermediate',
      students: 10,
      schedule: 'Sat - 10:00 AM',
      progress: 58,
    },
  ];

  const students = [
    { id: 1, name: 'Emma', class: 'Robotics Beginner', progress: 85, attendance: '95%', status: 'excellent' as const },
    { id: 2, name: 'John', class: 'Robotics Beginner', progress: 72, attendance: '90%', status: 'good' as const },
    { id: 3, name: 'Sarah', class: 'Coding Basics', progress: 68, attendance: '85%', status: 'good' as const },
    { id: 4, name: 'Mike', class: 'Coding Basics', progress: 45, attendance: '70%', status: 'needs_help' as const },
  ];

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
                <p className="text-3xl font-bold text-blue-600 mt-2">{classes.length}</p>
              </div>
              <BookOpen className="w-8 h-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Students</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">{classes.reduce((sum, c) => sum + c.students, 0)}</p>
              </div>
              <Users className="w-8 h-8 text-purple-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Avg. Progress</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{Math.round(classes.reduce((sum, c) => sum + c.progress, 0) / classes.length)}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Assignments</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">12</p>
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
