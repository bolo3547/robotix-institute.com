'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import {
  Users, BookOpen, MessageSquare, Plus,
  TrendingUp, Award, CheckCircle, Settings,
  Download, Calendar, Activity, ChevronRight
} from 'lucide-react';

interface ClassItem {
  id: number;
  name: string;
  level: string;
  students: number;
  schedule: string;
  progress: number;
}

interface StudentItem {
  id: number;
  name: string;
  class: string;
  progress: number;
  attendance: string;
  status: string;
}

export default function InstructorDashboard() {
  const { data: session, status: authStatus } = useSession();
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [apiStats, setApiStats] = useState({ activeClasses: 0, totalStudents: 0, avgProgress: 0, totalAssignments: 0 });
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/instructor/dashboard');
      if (res.ok) {
        const data = await res.json();
        setClasses(data.classes || []);
        setStudents(data.students || []);
        setApiStats(data.stats || { activeClasses: 0, totalStudents: 0, avgProgress: 0, totalAssignments: 0 });
      }
    } catch (err) {
      console.error('Failed to fetch instructor data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authStatus === 'authenticated') {
      fetchData();
    } else if (authStatus === 'unauthenticated') {
      setLoading(false);
    }
  }, [authStatus, fetchData]);

  const instructorName = session?.user?.name || 'Instructor';

  const stats = [
    { label: 'Total Classes', value: String(apiStats.activeClasses), icon: BookOpen, color: 'text-blue-400' },
    { label: 'Total Students', value: String(apiStats.totalStudents), icon: Users, color: 'text-purple-400' },
    { label: 'Avg Progress', value: `${apiStats.avgProgress}%`, icon: TrendingUp, color: 'text-emerald-400' },
    { label: 'Assignments', value: String(apiStats.totalAssignments), icon: MessageSquare, color: 'text-orange-400' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-transparent"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 bg-white/5 backdrop-blur-xl sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-400 to-pink-600 flex items-center justify-center text-lg shadow-lg">
                👨‍🏫
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">ROBOTIX</h1>
                <p className="text-white/60 text-xs">Instructor Hub</p>
              </div>
            </Link>
          </motion.div>

          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              <MessageSquare className="w-5 h-5 text-white/70" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              <Settings className="w-5 h-5 text-white/70" />
            </motion.button>
            <Link href="/auth/login">
              <Button variant="ghost" className="text-white/70 hover:text-white text-sm">Sign Out</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
              className="w-12 h-12 border-4 border-purple-400/30 border-t-purple-400 rounded-full"
            />
          </div>
        )}

        {!loading && (
          <>
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-white/10 backdrop-blur-xl p-8">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 to-pink-400/10 opacity-50"></div>
            <div className="relative z-10">
              <h2 className="text-4xl font-bold text-white mb-2">Welcome, {instructorName}! 👋</h2>
              <p className="text-white/70">Manage your classes, monitor student progress, and inspire the next generation of innovators.</p>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
        >
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div key={idx} variants={itemVariants}>
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-xl p-6 hover:border-white/40 transition-all duration-300 group cursor-pointer">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center ${stat.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <p className="text-white/70 text-sm font-medium mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Classes Section */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-white">Your Classes</h3>
              <p className="text-white/60 text-sm mt-1">{classes.length} active classes</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-400 to-purple-600 text-white text-sm font-medium hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Class
            </motion.button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {classes.map((classItem, idx) => {
              const colors = ['from-blue-400 to-blue-600', 'from-purple-400 to-purple-600', 'from-emerald-400 to-emerald-600', 'from-orange-400 to-orange-600'];
              const emojis = ['🤖', '⚡', '💻', '🎮'];
              return (
              <motion.div
                key={classItem.id}
                variants={itemVariants}
                whileHover={{ y: -4 }}
                onClick={() => setSelectedClass(classItem.id)}
                className="group cursor-pointer"
              >
                <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-xl p-6 hover:border-white/40 transition-all duration-300 ${selectedClass === classItem.id ? 'ring-2 ring-white/30' : ''}`}>
                  {/* Header */}
                  <div className="mb-6">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${colors[idx % colors.length]} flex items-center justify-center text-lg shadow-lg group-hover:shadow-xl transition-shadow mb-4`}>
                      {emojis[idx % emojis.length]}
                    </div>
                    <h4 className="text-lg font-bold text-white">{classItem.name}</h4>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/70">{classItem.level}</span>
                      <span className="text-xs px-2 py-1 rounded-full bg-emerald-400/20 text-emerald-300">Active</span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="space-y-3 mb-4 pb-4 border-b border-white/10">
                    <div className="flex items-center gap-2 text-white/70 text-sm">
                      <Users className="w-4 h-4" />
                      <span>{classItem.students} students</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/70 text-sm">
                      <TrendingUp className="w-4 h-4" />
                      <span>{classItem.progress}% avg progress</span>
                    </div>
                  </div>

                  {/* Action */}
                  <div className="flex items-center gap-2 text-purple-400 font-semibold text-sm">
                    <span>Manage</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Student Progress Section */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-white">Student Performance</h3>
              <p className="text-white/60 text-sm mt-1">{students.length} students being tracked</p>
            </div>
          </div>

          <div className="space-y-3">
            {students.map((student, idx) => {
              const statusLabel = student.status === 'excellent' ? 'Exceeding' : student.status === 'needs_help' ? 'Needs Support' : 'On Track';
              const statusIcon = student.status === 'excellent' ? '⭐' : student.status === 'needs_help' ? '⚠️' : '✓';
              return (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ x: 4 }}
                className="relative overflow-hidden rounded-lg bg-gradient-to-r from-white/10 to-white/5 border border-white/20 backdrop-blur-xl p-4 hover:border-white/40 transition-all duration-300"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-lg">{statusIcon}</span>
                      <div>
                        <p className="text-white font-semibold">{student.name}</p>
                        <p className="text-white/60 text-sm">{student.class}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-24 h-2 rounded-full bg-white/10 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${student.progress}%` }}
                          transition={{ duration: 1 }}
                          className="h-full bg-gradient-to-r from-blue-400 to-purple-600"
                        ></motion.div>
                      </div>
                      <span className="text-white/70 text-sm w-12 text-right">{student.progress}%</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      statusLabel === 'Exceeding' ? 'bg-emerald-400/20 text-emerald-300' :
                      statusLabel === 'Needs Support' ? 'bg-orange-400/20 text-orange-300' :
                      'bg-blue-400/20 text-blue-300'
                    }`}>
                      {statusLabel}
                    </span>
                  </div>
                </div>
              </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Recent Activity Section */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-white">Quick Overview</h3>
              <p className="text-white/60 text-sm mt-1">Summary of class performance</p>
            </div>
          </div>

          <div className="space-y-2">
            {classes.length === 0 ? (
              <div className="text-center py-8 rounded-lg bg-white/5 border border-white/10">
                <p className="text-white/60">No classes found. Student enrollments will appear here.</p>
              </div>
            ) : (
              classes.map((cls, idx) => (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="relative overflow-hidden rounded-lg bg-gradient-to-r from-white/10 to-white/5 border border-white/20 backdrop-blur-xl p-4 hover:border-white/40 transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-blue-400/20">
                      <BookOpen className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm">
                        <span className="font-semibold">{cls.name}</span>
                        {' — '}
                        {cls.students} students, {cls.progress}% avg progress
                      </p>
                      <p className="text-white/60 text-xs mt-1">{cls.level}</p>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative overflow-hidden rounded-lg bg-gradient-to-br from-blue-400/20 to-blue-600/20 border border-blue-400/30 backdrop-blur-xl p-4 hover:border-blue-400/50 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div className="text-left">
                <p className="text-white font-semibold text-sm">Create Assignment</p>
                <p className="text-white/60 text-xs">New task for students</p>
              </div>
              <Plus className="w-5 h-5 text-blue-400" />
            </div>
          </motion.button>

          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative overflow-hidden rounded-lg bg-gradient-to-br from-purple-400/20 to-purple-600/20 border border-purple-400/30 backdrop-blur-xl p-4 hover:border-purple-400/50 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div className="text-left">
                <p className="text-white font-semibold text-sm">Generate Report</p>
                <p className="text-white/60 text-xs">Class performance</p>
              </div>
              <Download className="w-5 h-5 text-purple-400" />
            </div>
          </motion.button>

          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative overflow-hidden rounded-lg bg-gradient-to-br from-emerald-400/20 to-emerald-600/20 border border-emerald-400/30 backdrop-blur-xl p-4 hover:border-emerald-400/50 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div className="text-left">
                <p className="text-white font-semibold text-sm">Message Students</p>
                <p className="text-white/60 text-xs">Send announcement</p>
              </div>
              <MessageSquare className="w-5 h-5 text-emerald-400" />
            </div>
          </motion.button>
        </motion.div>
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 mt-20 py-8 text-center text-white/50 text-sm">
        <p>© 2026 ROBOTIX Institute. Empowering educators and students worldwide.</p>
      </footer>
    </div>
  );
}
