'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import {
  Users, BookOpen, MessageSquare, Plus,
  TrendingUp, Award, CheckCircle, Settings,
  Download, Calendar, Activity, ChevronRight
} from 'lucide-react';

const classes = [
  {
    id: 1,
    name: 'Robotics Foundations',
    level: 'Beginner',
    students: 12,
    nextClass: 'Tomorrow at 2:00 PM',
    status: 'Active',
    color: 'from-blue-400 to-blue-600',
  },
  {
    id: 2,
    name: 'Advanced Robotics',
    level: 'Advanced',
    students: 8,
    nextClass: 'Tomorrow at 4:00 PM',
    status: 'Active',
    color: 'from-purple-400 to-purple-600',
  },
  {
    id: 3,
    name: 'Python for Kids',
    level: 'Intermediate',
    students: 10,
    nextClass: 'Friday at 3:00 PM',
    status: 'Active',
    color: 'from-emerald-400 to-emerald-600',
  },
];

const students = [
  { id: 1, name: 'Zainab Chanda', course: 'Robotics Foundations', progress: 68, status: 'On Track', icon: '✓' },
  { id: 2, name: 'Lwamba Mwale', course: 'Advanced Robotics', progress: 45, status: 'On Track', icon: '✓' },
  { id: 3, name: 'Grace Banda', course: 'Python for Kids', progress: 82, status: 'Exceeding', icon: '⭐' },
  { id: 4, name: 'David Kafwimbi', course: 'Robotics Foundations', progress: 52, status: 'Needs Support', icon: '⚠️' },
];

const recentActivity = [
  { student: 'Zainab', action: 'Completed Lesson 7: Motors & Movement', time: '2 hours ago', type: 'completion' },
  { student: 'Grace', action: 'Achieved "Code Starter" Badge', time: '4 hours ago', type: 'achievement' },
  { student: 'Lwamba', action: 'Submitted Project: Line-Following Bot', time: '1 day ago', type: 'submission' },
  { student: 'David', action: 'Started Lesson 5: Sensors', time: '1 day ago', type: 'start' },
];

const stats = [
  { label: 'Total Classes', value: '3', icon: BookOpen, color: 'text-blue-400' },
  { label: 'Total Students', value: '30', icon: Users, color: 'text-purple-400' },
  { label: 'Avg Performance', value: '87%', icon: TrendingUp, color: 'text-emerald-400' },
  { label: 'Pending Messages', value: '5', icon: MessageSquare, color: 'text-orange-400' },
];

export default function InstructorDashboard() {
  const [instructorName] = useState('Thomas Kafwimbi');
  const [selectedClass, setSelectedClass] = useState<number | null>(null);

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
            {classes.map((classItem) => (
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
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${classItem.color} flex items-center justify-center text-lg shadow-lg group-hover:shadow-xl transition-shadow mb-4`}>
                      {classItem.id === 1 ? '🤖' : classItem.id === 2 ? '⚡' : '💻'}
                    </div>
                    <h4 className="text-lg font-bold text-white">{classItem.name}</h4>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/70">{classItem.level}</span>
                      <span className="text-xs px-2 py-1 rounded-full bg-emerald-400/20 text-emerald-300">{classItem.status}</span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="space-y-3 mb-4 pb-4 border-b border-white/10">
                    <div className="flex items-center gap-2 text-white/70 text-sm">
                      <Users className="w-4 h-4" />
                      <span>{classItem.students} students</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/70 text-sm">
                      <Calendar className="w-4 h-4" />
                      <span>{classItem.nextClass}</span>
                    </div>
                  </div>

                  {/* Action */}
                  <div className="flex items-center gap-2 text-purple-400 font-semibold text-sm">
                    <span>Manage</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            ))}
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
            {students.map((student, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ x: 4 }}
                className="relative overflow-hidden rounded-lg bg-gradient-to-r from-white/10 to-white/5 border border-white/20 backdrop-blur-xl p-4 hover:border-white/40 transition-all duration-300"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-lg">{student.icon}</span>
                      <div>
                        <p className="text-white font-semibold">{student.name}</p>
                        <p className="text-white/60 text-sm">{student.course}</p>
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
                      student.status === 'Exceeding' ? 'bg-emerald-400/20 text-emerald-300' :
                      student.status === 'Needs Support' ? 'bg-orange-400/20 text-orange-300' :
                      'bg-blue-400/20 text-blue-300'
                    }`}>
                      {student.status}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
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
              <h3 className="text-2xl font-bold text-white">Recent Activity</h3>
              <p className="text-white/60 text-sm mt-1">Latest updates from your students</p>
            </div>
          </div>

          <div className="space-y-2">
            {recentActivity.map((activity, idx) => {
              const isCompletion = activity.type === 'completion';
              const isAchievement = activity.type === 'achievement';
              const isSubmission = activity.type === 'submission';

              return (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="relative overflow-hidden rounded-lg bg-gradient-to-r from-white/10 to-white/5 border border-white/20 backdrop-blur-xl p-4 hover:border-white/40 transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isCompletion ? 'bg-emerald-400/20' :
                      isAchievement ? 'bg-yellow-400/20' :
                      isSubmission ? 'bg-blue-400/20' :
                      'bg-purple-400/20'
                    }`}>
                      {isCompletion ? <CheckCircle className="w-5 h-5 text-emerald-400" /> :
                       isAchievement ? <Award className="w-5 h-5 text-yellow-400" /> :
                       isSubmission ? <BookOpen className="w-5 h-5 text-blue-400" /> :
                       <Activity className="w-5 h-5 text-purple-400" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm">
                        <span className="font-semibold">{activity.student}</span>
                        {' '}
                        {activity.action}
                      </p>
                      <p className="text-white/60 text-xs mt-1">{activity.time}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
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
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 mt-20 py-8 text-center text-white/50 text-sm">
        <p>© 2026 ROBOTIX Institute. Empowering educators and students worldwide.</p>
      </footer>
    </div>
  );
}
