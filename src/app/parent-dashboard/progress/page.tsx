'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft, BookOpen, CheckCircle, AlertCircle, Clock,
  TrendingUp, Award, BarChart2, GraduationCap, Star, User
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
  behavior: string | null;
  createdAt: string;
}

interface EnrollmentData {
  id: string;
  program: string;
  level: string;
  status: string;
  startDate: string;
  endDate: string | null;
  progress: ProgressEntry[];
}

interface ChildData {
  id: string;
  name: string | null;
  email: string;
  enrollments: EnrollmentData[];
  payments: { id: string; amount: number; status: string; createdAt: string }[];
}

export default function ParentProgressPage() {
  const [children, setChildren] = useState<ChildData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChild, setSelectedChild] = useState<string | null>(null);
  const [selectedEnrollment, setSelectedEnrollment] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProgress = async () => {
      try {
        // Fetch from parent progress API (auto-detects children from session)
        const res = await fetch('/api/parent/progress');
        if (res.ok) {
          const data = await res.json();
          if (data.enrollments && data.enrollments.length > 0) {
            // Transform enrollments into child-centric structure
            const childUser = data.enrollments[0]?.user;
            const childData: ChildData = {
              id: childUser?.id || 'unknown',
              name: childUser?.name || null,
              email: childUser?.email || '',
              enrollments: data.enrollments.map((e: any) => ({
                id: e.id,
                program: e.program,
                level: e.level,
                status: e.status,
                startDate: e.startDate,
                endDate: e.endDate,
                progress: e.progress || [],
              })),
              payments: data.enrollments.flatMap((e: any) => e.payments || []),
            };
            setChildren([childData]);
            setSelectedChild(childData.id);
            if (childData.enrollments.length > 0) {
              setSelectedEnrollment(childData.enrollments[0].id);
            }
          } else {
            setChildren([]);
          }
        } else {
          setError('Please log in to view your child\'s progress.');
        }
      } catch {
        setError('Unable to load progress data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    loadProgress();
  }, []);

  const child = children.find(c => c.id === selectedChild);
  const enrollment = child?.enrollments?.find(e => e.id === selectedEnrollment);
  const progressEntries = enrollment?.progress?.sort((a, b) => a.week - b.week) || [];

  // Stats
  const avgScore = progressEntries.length > 0
    ? Math.round(progressEntries.filter(e => e.score).reduce((sum, e) => sum + (e.score || 0), 0) /
      (progressEntries.filter(e => e.score).length || 1))
    : 0;
  const attendanceRate = progressEntries.length > 0
    ? Math.round((progressEntries.filter(e => e.attendance === 'present').length / progressEntries.length) * 100)
    : 0;
  const homeworkRate = progressEntries.length > 0
    ? Math.round((progressEntries.filter(e => e.homework === 'submitted' || e.homework === 'graded').length / progressEntries.length) * 100)
    : 0;

  const scoreColor = (score: number | null) => {
    if (!score) return 'text-gray-400';
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const attendanceIcon = (att: string) => {
    switch (att) {
      case 'present': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'absent': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'late': return <Clock className="w-4 h-4 text-yellow-500" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading progress data...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 pt-32 px-4">
        <div className="max-w-lg mx-auto text-center">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Required</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link href="/auth/login" className="px-6 py-3 bg-accent-500 text-white rounded-xl font-semibold hover:bg-accent-600 transition-colors">
            Log In
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="pt-32 pb-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/dashboard/parent" className="p-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <motion.h1
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl md:text-4xl font-bold text-gray-900"
              >
                My Child&apos;s Progress
              </motion.h1>
              <p className="text-gray-600">Track your child&apos;s learning journey</p>
            </div>
          </div>

          {/* Child & Enrollment Selectors */}
          {children.length > 0 && (
            <div className="flex flex-wrap gap-4 mb-8">
              {children.length > 1 && (
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Child</label>
                  <select
                    value={selectedChild || ''}
                    onChange={e => {
                      setSelectedChild(e.target.value);
                      const c = children.find(ch => ch.id === e.target.value);
                      if (c?.enrollments?.[0]) setSelectedEnrollment(c.enrollments[0].id);
                    }}
                    title="Select child"
                    className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-accent-400 outline-none"
                  >
                    {children.map(c => (
                      <option key={c.id} value={c.id}>{c.name || c.email}</option>
                    ))}
                  </select>
                </div>
              )}
              {child && child.enrollments.length > 0 && (
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Program</label>
                  <select
                    value={selectedEnrollment || ''}
                    onChange={e => setSelectedEnrollment(e.target.value)}
                    title="Select program"
                    className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-accent-400 outline-none"
                  >
                    {child.enrollments.map(en => (
                      <option key={en.id} value={en.id}>
                        {en.program} ({en.status})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* No enrollments */}
      {(!child || child.enrollments.length === 0) && (
        <section className="px-4 pb-20">
          <div className="max-w-lg mx-auto text-center py-20">
            <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">No Enrollments Yet</h2>
            <p className="text-gray-600 mb-6">Your child hasn&apos;t been enrolled in any programs yet. Contact us to get started!</p>
            <Link href="/contact" className="px-6 py-3 bg-accent-500 text-white rounded-xl font-semibold hover:bg-accent-600">
              Contact Us
            </Link>
          </div>
        </section>
      )}

      {/* Enrollment Info + Stats */}
      {enrollment && (
        <>
          <section className="px-4 pb-8">
            <div className="max-w-5xl mx-auto">
              {/* Program Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-gray-200 p-6 mb-6"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-xl bg-accent-100 flex items-center justify-center">
                    <GraduationCap className="w-7 h-7 text-accent-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{enrollment.program}</h2>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span className="capitalize">Level: {enrollment.level}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        enrollment.status === 'active' ? 'bg-green-100 text-green-700' :
                        enrollment.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>{enrollment.status}</span>
                      <span>Started: {new Date(enrollment.startDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: BarChart2, label: 'Avg Score', value: `${avgScore}%`, color: 'text-accent-600', bg: 'bg-accent-100' },
                  { icon: CheckCircle, label: 'Attendance', value: `${attendanceRate}%`, color: 'text-green-600', bg: 'bg-green-100' },
                  { icon: BookOpen, label: 'Homework', value: `${homeworkRate}%`, color: 'text-blue-600', bg: 'bg-blue-100' },
                  { icon: Award, label: 'Weeks Done', value: `${progressEntries.length}`, color: 'text-yellow-600', bg: 'bg-yellow-100' },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white rounded-xl border border-gray-200 p-4 text-center"
                  >
                    <div className={`w-10 h-10 ${stat.bg} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                      <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-xs text-gray-500">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Score Trend */}
          {progressEntries.length > 1 && progressEntries.some(e => e.score) && (
            <section className="px-4 pb-8">
              <div className="max-w-5xl mx-auto bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-accent-600" />
                  <h3 className="font-bold text-gray-900">Score Trend</h3>
                </div>
                <div className="flex items-end gap-2 h-40">
                  {progressEntries.map(entry => {
                    const score = entry.score || 0;
                    return (
                      <div key={entry.id} className="flex-1 flex flex-col items-center gap-1">
                        <span className={`text-xs font-bold ${scoreColor(entry.score)}`}>
                          {entry.score || '-'}
                        </span>
                        <div
                          className="w-full rounded-t-lg bg-gradient-to-t from-accent-500 to-accent-400 transition-all"
                          style={{ height: `${Math.max(score, 5)}%` }}
                        />
                        <span className="text-xs text-gray-500">W{entry.week}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          )}

          {/* Weekly Progress Details */}
          <section className="px-4 pb-20">
            <div className="max-w-5xl mx-auto">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Weekly Progress</h3>
              {progressEntries.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                  <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600">No progress entries yet. Your child&apos;s instructor will update this weekly.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {[...progressEntries].reverse().map((entry, i) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-white rounded-xl border border-gray-200 p-5"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-accent-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-lg font-bold text-accent-600">W{entry.week}</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 mb-1">{entry.topic}</h4>
                          <div className="flex flex-wrap gap-4 text-sm mb-2">
                            {/* Score */}
                            <div className="flex items-center gap-1">
                              <BarChart2 className="w-4 h-4 text-gray-400" />
                              <span className={`font-medium ${scoreColor(entry.score)}`}>
                                {entry.score !== null ? `${entry.score}%` : 'Not graded'}
                              </span>
                            </div>
                            {/* Attendance */}
                            <div className="flex items-center gap-1">
                              {attendanceIcon(entry.attendance)}
                              <span className="text-gray-600 capitalize">{entry.attendance}</span>
                            </div>
                            {/* Homework */}
                            <div className="flex items-center gap-1">
                              <BookOpen className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-600 capitalize">{entry.homework}</span>
                              {entry.homeworkGrade !== null && (
                                <span className={`font-medium ${scoreColor(entry.homeworkGrade)}`}>
                                  ({entry.homeworkGrade}%)
                                </span>
                              )}
                            </div>
                            {/* Behavior */}
                            {entry.behavior && (
                              <div className="flex items-center gap-1">
                                <Star className={`w-4 h-4 ${
                                  entry.behavior === 'excellent' ? 'text-green-500 fill-green-500' :
                                  entry.behavior === 'good' ? 'text-blue-500' : 'text-yellow-500'
                                }`} />
                                <span className="text-gray-600 capitalize">{entry.behavior.replace('_', ' ')}</span>
                              </div>
                            )}
                          </div>
                          {/* Skills */}
                          {entry.skills && (
                            <div className="flex flex-wrap gap-1 mb-2">
                              {entry.skills.split(',').map((skill, si) => (
                                <span key={si} className="px-2 py-0.5 text-xs bg-accent-50 text-accent-600 rounded-full border border-accent-100">
                                  {skill.trim()}
                                </span>
                              ))}
                            </div>
                          )}
                          {/* Notes */}
                          {entry.notes && (
                            <div className="bg-gray-50 rounded-lg p-3 mt-2">
                              <p className="text-sm text-gray-600 italic">
                                <span className="font-medium text-gray-700">Instructor note:</span> {entry.notes}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </>
      )}
    </main>
  );
}
