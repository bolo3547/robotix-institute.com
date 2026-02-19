'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft, TrendingUp, Award, Clock, BookOpen, CheckCircle2,
  XCircle, AlertTriangle, Star, ChevronDown, ChevronUp, BarChart3,
  GraduationCap, Target, Calendar, User
} from 'lucide-react';

interface ProgressEntry {
  id: string;
  week: number;
  topic: string;
  score: number | null;
  attendance: string;
  homework: string;
  homeworkGrade: number | null;
  notes: string | null;
  skills: string | null;
  behavior: string;
  createdAt: string;
}

interface EnrollmentData {
  id: string;
  program: string;
  level: string;
  status: string;
  startDate: string;
  endDate: string | null;
  notes: string | null;
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

export default function ParentProgressPage() {
  const [enrollments, setEnrollments] = useState<EnrollmentData[]>([]);
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedEnrollment, setExpandedEnrollment] = useState<string | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<string | null>(null);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      // In production, userId would come from session; using demo user
      const res = await fetch('/api/parent/progress?userId=demo-student-1');
      if (res.ok) {
        const data = await res.json();
        setEnrollments(data.enrollments || []);
        setSummary(data.summary || null);
        if (data.enrollments?.length > 0) {
          setExpandedEnrollment(data.enrollments[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to fetch progress:', err);
    } finally {
      setLoading(false);
    }
  };

  const getAttendanceIcon = (attendance: string) => {
    switch (attendance) {
      case 'present': return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'late': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'absent': return <XCircle className="w-4 h-4 text-red-400" />;
      case 'excused': return <Clock className="w-4 h-4 text-blue-400" />;
      default: return <Clock className="w-4 h-4 text-white/50" />;
    }
  };

  const getScoreColor = (score: number | null) => {
    if (score === null) return 'text-white/50';
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreGradient = (score: number | null) => {
    if (score === null) return 'from-white/20 to-white/10';
    if (score >= 80) return 'from-emerald-400 to-emerald-600';
    if (score >= 60) return 'from-yellow-400 to-yellow-600';
    return 'from-red-400 to-red-600';
  };

  const getBehaviorBadge = (behavior: string) => {
    switch (behavior) {
      case 'excellent': return { color: 'bg-emerald-400/20 text-emerald-300 border-emerald-400/30', icon: '⭐' };
      case 'good': return { color: 'bg-blue-400/20 text-blue-300 border-blue-400/30', icon: '👍' };
      case 'needs_improvement': return { color: 'bg-orange-400/20 text-orange-300 border-orange-400/30', icon: '📝' };
      default: return { color: 'bg-white/10 text-white/70 border-white/20', icon: '–' };
    }
  };

  const getHomeworkBadge = (hw: string) => {
    switch (hw) {
      case 'graded': return 'bg-emerald-400/20 text-emerald-300';
      case 'submitted': return 'bg-blue-400/20 text-blue-300';
      case 'late': return 'bg-orange-400/20 text-orange-300';
      case 'pending': return 'bg-white/10 text-white/60';
      default: return 'bg-white/10 text-white/60';
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
      case 'cancelled': return 'bg-red-400/20 text-red-300';
      default: return 'bg-white/10 text-white/60';
    }
  };

  const parseSkills = (skills: string | null): string[] => {
    if (!skills) return [];
    try { return JSON.parse(skills); } catch { return skills.split(',').map(s => s.trim()); }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
          className="w-12 h-12 border-4 border-blue-400/30 border-t-blue-400 rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-transparent" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 bg-white/5 backdrop-blur-xl sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/parent"
              className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Dashboard</span>
            </Link>
            <div className="w-px h-6 bg-white/20" />
            <div>
              <h1 className="text-lg font-bold text-white">Learning Progress</h1>
              <p className="text-white/60 text-xs">Detailed weekly progress report</p>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        {summary && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-10"
          >
            {[
              { label: 'Programs', value: summary.totalEnrollments, icon: GraduationCap, color: 'text-blue-400' },
              { label: 'Active', value: summary.activeEnrollments, icon: Target, color: 'text-emerald-400' },
              { label: 'Weeks', value: summary.totalWeeks, icon: Calendar, color: 'text-purple-400' },
              { label: 'Avg Score', value: `${summary.avgScore}%`, icon: TrendingUp, color: 'text-orange-400' },
              { label: 'Attendance', value: `${summary.attendanceRate}%`, icon: CheckCircle2, color: 'text-cyan-400' },
              { label: 'Homework', value: `${summary.homeworkCompleted}/${summary.totalHomework}`, icon: BookOpen, color: 'text-pink-400' },
            ].map((stat, idx) => (
              <motion.div key={idx} variants={itemVariants}>
                <div className="rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-xl p-4 text-center hover:border-white/40 transition-all">
                  <stat.icon className={`w-5 h-5 mx-auto mb-2 ${stat.color}`} />
                  <p className="text-xl font-bold text-white">{stat.value}</p>
                  <p className="text-white/60 text-xs mt-1">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Empty State */}
        {enrollments.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-2xl font-bold text-white mb-2">No Progress Data Yet</h3>
            <p className="text-white/60 max-w-md mx-auto">
              Once your child is enrolled in a program and begins their learning journey,
              their weekly progress will appear here.
            </p>
            <Link
              href="/programs"
              className="inline-block mt-6 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-400 to-blue-600 text-white font-medium hover:shadow-lg transition-all"
            >
              Explore Programs
            </Link>
          </motion.div>
        )}

        {/* Enrollments */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
          {enrollments.map((enrollment) => {
            const isExpanded = expandedEnrollment === enrollment.id;
            const progressEntries = enrollment.progress || [];
            const avgScore = progressEntries.filter(p => p.score !== null).length > 0
              ? Math.round(progressEntries.filter(p => p.score !== null).reduce((a, b) => a + (b.score || 0), 0) / progressEntries.filter(p => p.score !== null).length)
              : null;

            return (
              <motion.div key={enrollment.id} variants={itemVariants} layout>
                <div className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-xl overflow-hidden hover:border-white/30 transition-all">
                  {/* Enrollment Header */}
                  <button
                    onClick={() => setExpandedEnrollment(isExpanded ? null : enrollment.id)}
                    className="w-full text-left p-6 flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${getLevelColor(enrollment.level)} flex items-center justify-center text-2xl shadow-lg`}>
                        {enrollment.program.includes('Robot') ? '🤖' :
                         enrollment.program.includes('Python') || enrollment.program.includes('Cod') ? '💻' :
                         enrollment.program.includes('Game') ? '🎮' :
                         enrollment.program.includes('Web') ? '🌐' :
                         enrollment.program.includes('Art') || enrollment.program.includes('Design') ? '🎨' :
                         enrollment.program.includes('AI') || enrollment.program.includes('Machine') ? '🧠' : '📚'}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors">
                          {enrollment.program}
                        </h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full border ${getStatusColor(enrollment.status)}`}>
                            {enrollment.status}
                          </span>
                          <span className="text-xs text-white/60 capitalize">{enrollment.level}</span>
                          <span className="text-xs text-white/50">
                            {progressEntries.length} week{progressEntries.length !== 1 ? 's' : ''}
                          </span>
                          {avgScore !== null && (
                            <span className={`text-xs font-medium ${getScoreColor(avgScore)}`}>
                              Avg: {avgScore}%
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown className="w-5 h-5 text-white/50" />
                    </motion.div>
                  </button>

                  {/* Expanded Content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 space-y-4">
                          {/* Score Progress Bar */}
                          {progressEntries.length > 0 && (
                            <div className="rounded-lg bg-white/5 border border-white/10 p-4">
                              <h4 className="text-sm font-semibold text-white/70 mb-3 flex items-center gap-2">
                                <BarChart3 className="w-4 h-4" /> Score Trend
                              </h4>
                              <div className="flex items-end gap-1 h-20">
                                {progressEntries.map((p, i) => {
                                  const score = p.score ?? 0;
                                  return (
                                    <motion.div
                                      key={i}
                                      initial={{ height: 0 }}
                                      animate={{ height: `${score}%` }}
                                      transition={{ delay: i * 0.05, duration: 0.4 }}
                                      className={`flex-1 rounded-t bg-gradient-to-t ${getScoreGradient(p.score)} cursor-pointer min-w-[8px]`}
                                      title={`Week ${p.week}: ${p.score ?? 'N/A'}%`}
                                      onClick={() => setSelectedWeek(selectedWeek === p.id ? null : p.id)}
                                    />
                                  );
                                })}
                              </div>
                              <div className="flex justify-between mt-1">
                                <span className="text-[10px] text-white/40">Wk {progressEntries[0]?.week}</span>
                                <span className="text-[10px] text-white/40">Wk {progressEntries[progressEntries.length - 1]?.week}</span>
                              </div>
                            </div>
                          )}

                          {/* Weekly Progress Entries */}
                          <div className="space-y-3">
                            {progressEntries.length === 0 ? (
                              <div className="text-center py-8 text-white/50">
                                <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">No weekly progress entries yet</p>
                              </div>
                            ) : (
                              progressEntries.map((entry) => {
                                const isSelected = selectedWeek === entry.id;
                                const behaviorBadge = getBehaviorBadge(entry.behavior);
                                const skills = parseSkills(entry.skills);

                                return (
                                  <motion.div
                                    key={entry.id}
                                    layout
                                    onClick={() => setSelectedWeek(isSelected ? null : entry.id)}
                                    className={`rounded-lg border backdrop-blur cursor-pointer transition-all duration-300 ${
                                      isSelected
                                        ? 'bg-white/10 border-white/30 shadow-lg'
                                        : 'bg-white/5 border-white/10 hover:border-white/20'
                                    }`}
                                  >
                                    {/* Week Summary Row */}
                                    <div className="p-4 flex items-center gap-4">
                                      {/* Week Badge */}
                                      <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                                        <span className="text-sm font-bold text-white">W{entry.week}</span>
                                      </div>

                                      {/* Topic */}
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-white truncate">{entry.topic}</p>
                                        <div className="flex items-center gap-3 mt-1">
                                          <div className="flex items-center gap-1">
                                            {getAttendanceIcon(entry.attendance)}
                                            <span className="text-xs text-white/60 capitalize">{entry.attendance}</span>
                                          </div>
                                          <span className={`text-xs px-2 py-0.5 rounded-full ${getHomeworkBadge(entry.homework)}`}>
                                            HW: {entry.homework}
                                          </span>
                                        </div>
                                      </div>

                                      {/* Score */}
                                      <div className="text-right shrink-0">
                                        <p className={`text-lg font-bold ${getScoreColor(entry.score)}`}>
                                          {entry.score !== null ? `${entry.score}%` : '—'}
                                        </p>
                                        <span className={`text-xs px-2 py-0.5 rounded-full border ${behaviorBadge.color}`}>
                                          {behaviorBadge.icon} {entry.behavior.replace('_', ' ')}
                                        </span>
                                      </div>

                                      {/* Expand */}
                                      <motion.div animate={{ rotate: isSelected ? 180 : 0 }}>
                                        <ChevronUp className="w-4 h-4 text-white/40" />
                                      </motion.div>
                                    </div>

                                    {/* Expanded Details */}
                                    <AnimatePresence>
                                      {isSelected && (
                                        <motion.div
                                          initial={{ height: 0, opacity: 0 }}
                                          animate={{ height: 'auto', opacity: 1 }}
                                          exit={{ height: 0, opacity: 0 }}
                                          transition={{ duration: 0.2 }}
                                          className="overflow-hidden"
                                        >
                                          <div className="px-4 pb-4 pt-0 border-t border-white/10 mt-0 space-y-3">
                                            <div className="h-px" />
                                            
                                            {/* Homework Grade */}
                                            {entry.homeworkGrade !== null && (
                                              <div className="flex items-center gap-2">
                                                <Award className="w-4 h-4 text-purple-400" />
                                                <span className="text-sm text-white/70">Homework Grade:</span>
                                                <span className={`text-sm font-semibold ${getScoreColor(entry.homeworkGrade)}`}>
                                                  {entry.homeworkGrade}%
                                                </span>
                                              </div>
                                            )}

                                            {/* Skills */}
                                            {skills.length > 0 && (
                                              <div>
                                                <p className="text-xs text-white/50 mb-2 flex items-center gap-1">
                                                  <Star className="w-3 h-3" /> Skills Learned
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                  {skills.map((skill, i) => (
                                                    <span key={i} className="text-xs px-2 py-1 rounded-full bg-blue-400/10 text-blue-300 border border-blue-400/20">
                                                      {skill}
                                                    </span>
                                                  ))}
                                                </div>
                                              </div>
                                            )}

                                            {/* Instructor Notes */}
                                            {entry.notes && (
                                              <div className="rounded-lg bg-white/5 border border-white/10 p-3">
                                                <p className="text-xs text-white/50 mb-1 flex items-center gap-1">
                                                  <User className="w-3 h-3" /> Instructor Notes
                                                </p>
                                                <p className="text-sm text-white/80 leading-relaxed">{entry.notes}</p>
                                              </div>
                                            )}

                                            {/* Date */}
                                            <p className="text-xs text-white/40">
                                              Recorded: {new Date(entry.createdAt).toLocaleDateString('en-ZA', {
                                                year: 'numeric', month: 'short', day: 'numeric'
                                              })}
                                            </p>
                                          </div>
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </motion.div>
                                );
                              })
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 mt-20 py-8 text-center text-white/50 text-sm">
        <p>&copy; 2026 ROBOTIX Institute. Empowering young minds through robotics and coding.</p>
      </footer>
    </div>
  );
}
