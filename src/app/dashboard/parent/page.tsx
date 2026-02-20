'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { 
  TrendingUp, MessageSquare, Download, Settings,
  BookOpen, Calendar, Clock, GraduationCap, BarChart3, Eye
} from 'lucide-react';

interface ProgressEntry {
  id: string;
  week: number;
  topic: string;
  score: number | null;
  attendance: string;
  homework: string;
  behavior: string;
  createdAt?: string;
}

interface EnrollmentData {
  id: string;
  program: string;
  level: string;
  status: string;
  startDate: string;
  user: { id: string; name: string; email: string; image: string | null };
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
  const { data: session, status: authStatus } = useSession();
  const [enrollments, setEnrollments] = useState<EnrollmentData[]>([]);
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [childName, setChildName] = useState('Your Child');
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  useEffect(() => {
    if (authStatus === 'authenticated') {
      fetchData();
    } else if (authStatus === 'unauthenticated') {
      setLoading(false);
    }
  }, [authStatus]);

  const fetchData = async () => {
    try {
      // Use parent progress API - it auto-detects children from session
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
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'from-blue-400 to-blue-600';
      case 'intermediate': return 'from-purple-400 to-purple-600';
      case 'advanced': return 'from-orange-400 to-orange-600';
      default: return 'from-blue-400 to-blue-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-400/20 text-emerald-300';
      case 'completed': return 'bg-blue-400/20 text-blue-300';
      case 'paused': return 'bg-yellow-400/20 text-yellow-300';
      default: return 'bg-white/10 text-white/60';
    }
  };

  const getProgramEmoji = (program: string) => {
    if (program.includes('Robot')) return '🤖';
    if (program.includes('Python') || program.includes('Cod')) return '💻';
    if (program.includes('Game')) return '🎮';
    if (program.includes('Web')) return '🌐';
    if (program.includes('Art') || program.includes('Design')) return '🎨';
    if (program.includes('AI') || program.includes('Machine')) return '🧠';
    return '📚';
  };

  // Compute course progress from enrollment data (weeks completed out of estimated total)
  const getCourseProgress = (enrollment: EnrollmentData) => {
    const totalEstimatedWeeks = 12; // Default estimate per program
    const completed = enrollment.progress.length;
    return Math.min(Math.round((completed / totalEstimatedWeeks) * 100), 100);
  };

  const getLatestTopic = (enrollment: EnrollmentData) => {
    if (enrollment.progress.length === 0) return 'Not started yet';
    const latest = enrollment.progress[enrollment.progress.length - 1];
    return `Week ${latest.week}: ${latest.topic}`;
  };

  const insights = summary ? [
    { label: 'Weeks Completed', value: String(summary.totalWeeks), icon: BookOpen, color: 'text-blue-400' },
    { label: 'Active Programs', value: String(summary.activeEnrollments), icon: GraduationCap, color: 'text-orange-400' },
    { label: 'Avg Score', value: `${summary.avgScore}%`, icon: TrendingUp, color: 'text-emerald-400' },
    { label: 'Attendance', value: `${summary.attendanceRate}%`, icon: BarChart3, color: 'text-purple-400' },
  ] : [
    { label: 'Weeks Completed', value: '—', icon: BookOpen, color: 'text-blue-400' },
    { label: 'Active Programs', value: '—', icon: GraduationCap, color: 'text-orange-400' },
    { label: 'Avg Score', value: '—', icon: TrendingUp, color: 'text-emerald-400' },
    { label: 'Attendance', value: '—', icon: BarChart3, color: 'text-purple-400' },
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
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
              className="w-12 h-12 border-4 border-blue-400/30 border-t-blue-400 rounded-full"
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
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-white/10 backdrop-blur-xl p-8">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-purple-400/10 opacity-50"></div>
                <div className="relative z-10">
                  <h2 className="text-4xl font-bold text-white mb-2">Welcome back! 👋</h2>
                  <p className="text-white/70">
                    {enrollments.length > 0
                      ? `${childName}'s learning is progressing wonderfully. Check out the latest updates below.`
                      : `Set up ${childName}'s first enrollment to start tracking their learning journey.`}
                  </p>
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

            {/* Enrolled Programs Section */}
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="mb-12"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white">Enrolled Programs</h3>
                  <p className="text-white/60 text-sm mt-1">
                    {enrollments.length > 0
                      ? `${enrollments.length} enrolled program${enrollments.length !== 1 ? 's' : ''}`
                      : 'No enrollments yet'}
                  </p>
                </div>
                <Link href="/dashboard/parent/progress">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-400 to-blue-600 text-white text-sm font-medium hover:shadow-lg transition-all flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" /> View Detailed Progress
                  </motion.button>
                </Link>
              </div>

              {enrollments.length === 0 ? (
                <div className="text-center py-16 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-5xl mb-4">📚</div>
                  <h4 className="text-lg font-semibold text-white mb-2">No Enrollments Yet</h4>
                  <p className="text-white/60 text-sm max-w-md mx-auto mb-4">
                    Once your child is enrolled in a program, their courses and progress will appear here.
                  </p>
                  <Link href="/programs" className="inline-block px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-400 to-blue-600 text-white text-sm font-medium">
                    Explore Programs
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {enrollments.map((enrollment, idx) => {
                    const progress = getCourseProgress(enrollment);
                    const latestTopic = getLatestTopic(enrollment);
                    const avgScore = enrollment.progress.filter(p => p.score !== null).length > 0
                      ? Math.round(enrollment.progress.filter(p => p.score !== null).reduce((a, b) => a + (b.score || 0), 0) / enrollment.progress.filter(p => p.score !== null).length)
                      : null;

                    return (
                      <motion.div
                        key={enrollment.id}
                        variants={itemVariants}
                        whileHover={{ y: -4 }}
                        onClick={() => setSelectedCourse(enrollment.id)}
                        className="group cursor-pointer"
                      >
                        <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-xl p-6 hover:border-white/40 transition-all duration-300 ${selectedCourse === enrollment.id ? 'ring-2 ring-white/30' : ''}`}>
                          {/* Header */}
                          <div className="flex items-start justify-between mb-6">
                            <div className="flex items-start gap-4 flex-1">
                              <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${getLevelColor(enrollment.level)} flex items-center justify-center text-2xl shadow-lg group-hover:shadow-xl transition-shadow`}>
                                {getProgramEmoji(enrollment.program)}
                              </div>
                              <div>
                                <h4 className="text-lg font-bold text-white">{enrollment.program}</h4>
                                <div className="flex items-center gap-2 mt-2">
                                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(enrollment.status)}`}>
                                    {enrollment.status}
                                  </span>
                                  <span className="text-xs text-white/60 capitalize">{enrollment.level}</span>
                                  <span className="text-xs text-white/60">{enrollment.progress.length} weeks</span>
                                </div>
                              </div>
                            </div>
                            {avgScore !== null && (
                              <div className="text-right">
                                <span className={`text-2xl font-bold ${avgScore >= 80 ? 'text-emerald-400' : avgScore >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                                  {avgScore}%
                                </span>
                                <p className="text-xs text-white/50">avg score</p>
                              </div>
                            )}
                          </div>

                          {/* Progress Bar */}
                          <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-white/70">Progress</span>
                              <span className="text-sm font-semibold text-white">{progress}%</span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 1, delay: idx * 0.1 }}
                                className={`h-full rounded-full bg-gradient-to-r ${getLevelColor(enrollment.level)}`}
                              ></motion.div>
                            </div>
                          </div>

                          {/* Latest Topic */}
                          <div className="flex items-center gap-2 text-white/70 text-sm">
                            <Clock className="w-4 h-4" />
                            <span>Latest: {latestTopic}</span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>

            {/* Recent Progress Section */}
            {enrollments.some(e => e.progress.length > 0) && (
              <motion.div
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className="mb-12"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white">Recent Activity</h3>
                    <p className="text-white/60 text-sm mt-1">Latest weekly updates from all programs</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {enrollments
                    .flatMap(e => e.progress.map(p => ({ ...p, program: e.program, enrollmentId: e.id })))
                    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
                    .slice(0, 5)
                    .map((entry, idx) => (
                      <motion.div
                        key={entry.id || idx}
                        variants={itemVariants}
                        whileHover={{ x: 4 }}
                        className="relative overflow-hidden rounded-lg bg-gradient-to-r from-white/10 to-white/5 border border-white/20 backdrop-blur-xl p-4 hover:border-white/40 transition-all duration-300"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white font-semibold">Week {entry.week}: {entry.topic}</p>
                            <p className="text-white/60 text-sm">{entry.program}</p>
                          </div>
                          <div className="text-right flex items-center gap-4">
                            <div>
                              <span className={`text-lg font-bold ${
                                entry.score !== null
                                  ? entry.score >= 80 ? 'text-emerald-400' : entry.score >= 60 ? 'text-yellow-400' : 'text-red-400'
                                  : 'text-white/40'
                              }`}>
                                {entry.score !== null ? `${entry.score}%` : '—'}
                              </span>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              entry.attendance === 'present' ? 'bg-emerald-400/20 text-emerald-300'
                                : entry.attendance === 'late' ? 'bg-yellow-400/20 text-yellow-300'
                                : 'bg-red-400/20 text-red-300'
                            }`}>
                              {entry.attendance}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                </div>

                {enrollments.flatMap(e => e.progress).length > 5 && (
                  <div className="text-center mt-4">
                    <Link href="/dashboard/parent/progress" className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                      View all progress entries →
                    </Link>
                  </div>
                )}
              </motion.div>
            )}

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
                <p className="text-white/60 text-xs">Get in touch</p>
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
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 mt-20 py-8 text-center text-white/50 text-sm">
        <p>© 2026 ROBOTIX Institute. Empowering young minds through robotics and coding.</p>
      </footer>
    </div>
  );
}
