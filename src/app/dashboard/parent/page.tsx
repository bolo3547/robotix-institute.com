'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { 
  Zap, TrendingUp, MessageSquare, Download, Settings,
  BookOpen, Code, Gamepad2, Cpu, Calendar, Clock
} from 'lucide-react';

const courses = [
  {
    id: 1,
    name: 'Robotics Foundations',
    level: 'Beginner',
    progress: 68,
    nextLesson: 'Lesson 7: Motors & Movement',
    lessons: 10,
    icon: Cpu,
    color: 'from-blue-400 to-blue-600',
    bgColor: 'bg-blue-400/10',
    borderColor: 'border-blue-400/30',
  },
  {
    id: 2,
    name: 'Python for Kids',
    level: 'Intermediate',
    progress: 42,
    nextLesson: 'Lesson 5: Loops & Functions',
    lessons: 12,
    icon: Code,
    color: 'from-emerald-400 to-emerald-600',
    bgColor: 'bg-emerald-400/10',
    borderColor: 'border-emerald-400/30',
  },
  {
    id: 3,
    name: 'Game Creator',
    level: 'Beginner',
    progress: 12,
    nextLesson: 'Lesson 1: Getting Started',
    lessons: 8,
    icon: Gamepad2,
    color: 'from-purple-400 to-purple-600',
    bgColor: 'bg-purple-400/10',
    borderColor: 'border-purple-400/30',
  },
  {
    id: 4,
    name: 'Advanced Robotics',
    level: 'Advanced',
    progress: 4,
    nextLesson: 'Lesson 1: Competition Prep',
    lessons: 16,
    icon: Zap,
    color: 'from-orange-400 to-orange-600',
    bgColor: 'bg-orange-400/10',
    borderColor: 'border-orange-400/30',
  },
];

const achievements = [
  { name: 'Rookie Builder', earned: true, icon: '⚙️', rarity: 'Common' },
  { name: 'Code Starter', earned: true, icon: '💾', rarity: 'Common' },
  { name: 'Competition Ready', earned: false, icon: '🏆', rarity: 'Rare' },
  { name: 'Team Leader', earned: false, icon: '👥', rarity: 'Epic' },
];

const projects = [
  { name: 'Line-Following Bot', category: 'Robotics', progress: 100, status: 'Completed' },
  { name: 'Math Game', category: 'Game', progress: 85, status: 'In Progress' },
  { name: 'Weather App', category: 'Coding', progress: 60, status: 'In Progress' },
];

const insights = [
  { label: 'Lessons Completed', value: '24', icon: BookOpen, color: 'text-blue-400' },
  { label: 'Current Streak', value: '7 days', icon: Zap, color: 'text-orange-400' },
  { label: 'Performance', value: '94%', icon: TrendingUp, color: 'text-emerald-400' },
  { label: 'Messages', value: '3 new', icon: MessageSquare, color: 'text-purple-400' },
];

export default function ParentDashboard() {
  const [childName] = useState('Zainab');
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);

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
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-transparent"></div>
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
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-lg shadow-lg">
                🤖
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">ROBOTIX</h1>
                <p className="text-white/60 text-xs">Parent Dashboard</p>
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
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-white/10 backdrop-blur-xl p-8">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-purple-400/10 opacity-50"></div>
            <div className="relative z-10">
              <h2 className="text-4xl font-bold text-white mb-2">Welcome back! 👋</h2>
              <p className="text-white/70">{childName}'s learning is progressing wonderfully. Check out the latest updates below.</p>
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
          {insights.map((insight, idx) => {
            const Icon = insight.icon;
            return (
              <motion.div key={idx} variants={itemVariants}>
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-xl p-6 hover:border-white/40 transition-all duration-300 group cursor-pointer">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center ${insight.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <p className="text-white/70 text-sm font-medium mb-1">{insight.label}</p>
                  <p className="text-3xl font-bold text-white">{insight.value}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Courses Section */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-white">Active Courses</h3>
              <p className="text-white/60 text-sm mt-1">{courses.length} enrolled courses</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-400 to-blue-600 text-white text-sm font-medium hover:shadow-lg transition-all"
            >
              View All
            </motion.button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {courses.map((course, idx) => {
              return (
                <motion.div
                  key={course.id}
                  variants={itemVariants}
                  whileHover={{ y: -4 }}
                  onClick={() => setSelectedCourse(course.id)}
                  className="group cursor-pointer"
                >
                  <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-xl p-6 hover:border-white/40 transition-all duration-300 ${selectedCourse === course.id ? 'ring-2 ring-white/30' : ''}`}>
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-start gap-4 flex-1">
                        <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${course.color} flex items-center justify-center text-2xl shadow-lg group-hover:shadow-xl transition-shadow`}>
                          {course.id === 1 ? '🤖' : course.id === 2 ? '💻' : course.id === 3 ? '🎮' : '⚡'}
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-white">{course.name}</h4>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/70">{course.level}</span>
                            <span className="text-xs text-white/60">{course.lessons} lessons</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-white/70">Progress</span>
                        <span className="text-sm font-semibold text-white">{course.progress}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${course.progress}%` }}
                          transition={{ duration: 1, delay: idx * 0.1 }}
                          className={`h-full rounded-full bg-gradient-to-r ${course.color}`}
                        ></motion.div>
                      </div>
                    </div>

                    {/* Next Lesson */}
                    <div className="flex items-center gap-2 text-white/70 text-sm">
                      <Clock className="w-4 h-4" />
                      <span>Next: {course.nextLesson}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Achievements Section */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-white">Achievements</h3>
              <p className="text-white/60 text-sm mt-1">{achievements.filter(a => a.earned).length} earned · {achievements.filter(a => !a.earned).length} locked</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {achievements.map((achievement, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className={`relative overflow-hidden rounded-xl border backdrop-blur-xl p-6 text-center transition-all duration-300 ${
                  achievement.earned
                    ? 'bg-gradient-to-br from-white/10 to-white/5 border-white/20 hover:border-white/40'
                    : 'bg-white/5 border-white/10 opacity-60 hover:opacity-80'
                }`}
              >
                <div className={`text-3xl mb-3 ${achievement.earned ? '' : 'grayscale'}`}>{achievement.icon}</div>
                <p className="text-white text-sm font-semibold mb-1">{achievement.name}</p>
                <p className="text-white/60 text-xs">{achievement.rarity}</p>
                {achievement.earned && <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-400"></div>}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Projects Section */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-white">Projects</h3>
              <p className="text-white/60 text-sm mt-1">{projects.filter(p => p.status === 'Completed').length} completed · {projects.filter(p => p.status === 'In Progress').length} in progress</p>
            </div>
          </div>

          <div className="space-y-3">
            {projects.map((project, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ x: 4 }}
                className="relative overflow-hidden rounded-lg bg-gradient-to-r from-white/10 to-white/5 border border-white/20 backdrop-blur-xl p-4 hover:border-white/40 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-semibold">{project.name}</p>
                    <p className="text-white/60 text-sm">{project.category}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-20 h-2 rounded-full bg-white/10 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${project.progress}%` }}
                          transition={{ duration: 1 }}
                          className="h-full bg-gradient-to-r from-blue-400 to-purple-600"
                        ></motion.div>
                      </div>
                      <span className="text-white/70 text-sm w-10 text-right">{project.progress}%</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${project.status === 'Completed' ? 'bg-emerald-400/20 text-emerald-300' : 'bg-blue-400/20 text-blue-300'}`}>
                      {project.status}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
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
                <p className="text-white font-semibold text-sm">Download Report</p>
                <p className="text-white/60 text-xs">Monthly summary</p>
              </div>
              <Download className="w-5 h-5 text-blue-400" />
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
                <p className="text-white font-semibold text-sm">Message Instructor</p>
                <p className="text-white/60 text-xs">3 unread</p>
              </div>
              <MessageSquare className="w-5 h-5 text-purple-400" />
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
                <p className="text-white font-semibold text-sm">Schedule Call</p>
                <p className="text-white/60 text-xs">With instructor</p>
              </div>
              <Calendar className="w-5 h-5 text-emerald-400" />
            </div>
          </motion.button>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 mt-20 py-8 text-center text-white/50 text-sm">
        <p>© 2026 ROBOTIX Institute. Empowering young minds through robotics and coding.</p>
      </footer>
    </div>
  );
}
