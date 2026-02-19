'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  ArrowLeft, Plus, Edit, Trash2, Save, X,
  BookOpen, CheckCircle, AlertCircle, Clock,
  TrendingUp, Award, BarChart2
} from 'lucide-react';

interface ProgressEntry {
  id: string;
  userId: string;
  enrollmentId: string;
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
  user?: { id: string; name: string | null; email: string };
  enrollment?: { id: string; program: string; level: string; status: string };
}

const attendanceOpts = ['present', 'absent', 'late', 'excused'];
const homeworkOpts = ['pending', 'submitted', 'graded', 'late'];
const behaviorOpts = ['excellent', 'good', 'needs_improvement'];

export default function AdminProgressPage() {
  const searchParams = useSearchParams();
  const enrollmentId = searchParams.get('enrollmentId');

  const [entries, setEntries] = useState<ProgressEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ProgressEntry | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    enrollmentId: enrollmentId || '',
    week: 1,
    topic: '',
    score: '',
    attendance: 'present',
    homework: 'pending',
    homeworkGrade: '',
    notes: '',
    skills: '',
    behavior: 'good',
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchProgress = useCallback(async () => {
    try {
      const url = enrollmentId
        ? `/api/admin/progress?enrollmentId=${enrollmentId}`
        : '/api/admin/progress';
      const res = await fetch(url);
      if (res.ok) setEntries(await res.json());
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, [enrollmentId]);

  useEffect(() => { fetchProgress(); }, [fetchProgress]);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const startCreate = () => {
    const maxWeek = entries.length > 0 ? Math.max(...entries.map(e => e.week)) : 0;
    setForm({
      enrollmentId: enrollmentId || '',
      week: maxWeek + 1,
      topic: '',
      score: '',
      attendance: 'present',
      homework: 'pending',
      homeworkGrade: '',
      notes: '',
      skills: '',
      behavior: 'good',
    });
    setCreating(true);
    setEditing(null);
  };

  const startEdit = (entry: ProgressEntry) => {
    setForm({
      enrollmentId: entry.enrollmentId,
      week: entry.week,
      topic: entry.topic,
      score: entry.score?.toString() || '',
      attendance: entry.attendance,
      homework: entry.homework,
      homeworkGrade: entry.homeworkGrade?.toString() || '',
      notes: entry.notes || '',
      skills: entry.skills || '',
      behavior: entry.behavior || 'good',
    });
    setEditing(entry);
    setCreating(false);
  };

  const handleSave = async () => {
    if (!form.enrollmentId || !form.topic) {
      showMessage('error', 'Enrollment ID and topic are required');
      return;
    }
    setSaving(true);
    try {
      const method = editing ? 'PUT' : 'POST';
      const body = {
        ...(editing && { id: editing.id }),
        enrollmentId: form.enrollmentId,
        week: form.week,
        topic: form.topic,
        score: form.score ? parseInt(form.score) : null,
        attendance: form.attendance,
        homework: form.homework,
        homeworkGrade: form.homeworkGrade ? parseInt(form.homeworkGrade) : null,
        notes: form.notes || null,
        skills: form.skills || null,
        behavior: form.behavior,
      };

      const res = await fetch('/api/admin/progress', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        showMessage('success', editing ? 'Progress updated!' : 'Progress added!');
        setEditing(null);
        setCreating(false);
        fetchProgress();
      } else {
        const data = await res.json().catch(() => null);
        showMessage('error', data?.error || 'Failed to save');
      }
    } catch {
      showMessage('error', 'Network error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (entry: ProgressEntry) => {
    if (!confirm(`Delete Week ${entry.week} progress entry?`)) return;
    try {
      const res = await fetch(`/api/admin/progress?id=${entry.id}`, { method: 'DELETE' });
      if (res.ok) { showMessage('success', 'Entry deleted'); fetchProgress(); }
    } catch { showMessage('error', 'Failed to delete'); }
  };

  // Stats
  const avgScore = entries.length > 0
    ? Math.round(entries.filter(e => e.score).reduce((sum, e) => sum + (e.score || 0), 0) /
      entries.filter(e => e.score).length) || 0
    : 0;
  const attendanceRate = entries.length > 0
    ? Math.round((entries.filter(e => e.attendance === 'present').length / entries.length) * 100)
    : 0;
  const homeworkRate = entries.length > 0
    ? Math.round((entries.filter(e => e.homework === 'submitted' || e.homework === 'graded').length / entries.length) * 100)
    : 0;

  const studentName = entries[0]?.user?.name || entries[0]?.user?.email || 'Student';
  const programName = entries[0]?.enrollment?.program || 'Program';

  const attendanceIcon = (att: string) => {
    switch (att) {
      case 'present': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'absent': return <AlertCircle className="w-4 h-4 text-red-400" />;
      case 'late': return <Clock className="w-4 h-4 text-yellow-400" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const scoreColor = (score: number | null) => {
    if (!score) return 'text-gray-400';
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href={enrollmentId ? '/admin/enrollments' : '/admin'}
              className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
              <ArrowLeft className="w-5 h-5 text-white" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">Student Progress</h1>
              {enrollmentId && entries.length > 0 && (
                <p className="text-gray-400">{studentName} &middot; {programName}</p>
              )}
              {!enrollmentId && <p className="text-gray-400">Track how each child is learning week by week</p>}
            </div>
          </div>
          {enrollmentId && (
            <motion.button whileTap={{ scale: 0.95 }} onClick={startCreate}
              className="flex items-center gap-2 px-5 py-2.5 bg-accent-500 hover:bg-accent-600 text-white rounded-xl font-semibold transition-colors">
              <Plus className="w-5 h-5" /> Add Week
            </motion.button>
          )}
        </div>

        {/* Message */}
        <AnimatePresence>
          {message && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className={`mb-6 p-4 rounded-xl ${message.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Bar */}
        {entries.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/5 rounded-xl border border-white/10 p-4 text-center">
              <BarChart2 className="w-5 h-5 text-accent-400 mx-auto mb-1" />
              <p className="text-2xl font-bold text-white">{avgScore}%</p>
              <p className="text-xs text-gray-400">Avg Score</p>
            </div>
            <div className="bg-white/5 rounded-xl border border-white/10 p-4 text-center">
              <CheckCircle className="w-5 h-5 text-green-400 mx-auto mb-1" />
              <p className="text-2xl font-bold text-white">{attendanceRate}%</p>
              <p className="text-xs text-gray-400">Attendance</p>
            </div>
            <div className="bg-white/5 rounded-xl border border-white/10 p-4 text-center">
              <BookOpen className="w-5 h-5 text-blue-400 mx-auto mb-1" />
              <p className="text-2xl font-bold text-white">{homeworkRate}%</p>
              <p className="text-xs text-gray-400">Homework Done</p>
            </div>
            <div className="bg-white/5 rounded-xl border border-white/10 p-4 text-center">
              <Award className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
              <p className="text-2xl font-bold text-white">{entries.length}</p>
              <p className="text-xs text-gray-400">Weeks Logged</p>
            </div>
          </div>
        )}

        {/* Editor */}
        {(creating || editing) && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">
                {editing ? `Edit Week ${form.week}` : `Add Week ${form.week}`}
              </h2>
              <button onClick={() => { setEditing(null); setCreating(false); }} className="p-2 text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {!enrollmentId && (
              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-1">Enrollment ID *</label>
                <input type="text" value={form.enrollmentId}
                  onChange={e => setForm(p => ({ ...p, enrollmentId: e.target.value }))}
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none"
                  placeholder="Enrollment ID" />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Week #</label>
                <input type="number" min={1} value={form.week}
                  onChange={e => setForm(p => ({ ...p, week: parseInt(e.target.value) || 1 }))}
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-400 mb-1">Topic / Lesson *</label>
                <input type="text" value={form.topic}
                  onChange={e => setForm(p => ({ ...p, topic: e.target.value }))}
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none"
                  placeholder="e.g. Introduction to Scratch Loops" />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Score (0-100)</label>
                <input type="number" min={0} max={100} value={form.score}
                  onChange={e => setForm(p => ({ ...p, score: e.target.value }))}
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none"
                  placeholder="85" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Attendance</label>
                <select value={form.attendance}
                  onChange={e => setForm(p => ({ ...p, attendance: e.target.value }))} title="Attendance"
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none">
                  {attendanceOpts.map(a => <option key={a} value={a}>{a.charAt(0).toUpperCase() + a.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Homework</label>
                <select value={form.homework}
                  onChange={e => setForm(p => ({ ...p, homework: e.target.value }))} title="Homework"
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none">
                  {homeworkOpts.map(h => <option key={h} value={h}>{h.charAt(0).toUpperCase() + h.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Homework Grade</label>
                <input type="number" min={0} max={100} value={form.homeworkGrade}
                  onChange={e => setForm(p => ({ ...p, homeworkGrade: e.target.value }))}
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none"
                  placeholder="90" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Behavior</label>
                <select value={form.behavior}
                  onChange={e => setForm(p => ({ ...p, behavior: e.target.value }))} title="Behavior"
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none">
                  {behaviorOpts.map(b => (
                    <option key={b} value={b}>{b.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Skills Learned</label>
                <input type="text" value={form.skills}
                  onChange={e => setForm(p => ({ ...p, skills: e.target.value }))}
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none"
                  placeholder="e.g. loops, conditionals, variables" />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm text-gray-400 mb-1">Instructor Notes</label>
              <textarea value={form.notes}
                onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                rows={3}
                className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none resize-none"
                placeholder="Notes about the student's performance, areas to improve, etc." />
            </div>

            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-accent-500 hover:bg-accent-600 disabled:opacity-50 text-white rounded-xl font-semibold transition-colors">
              <Save className="w-5 h-5" /> {saving ? 'Saving...' : 'Save Progress'}
            </button>
          </motion.div>
        )}

        {/* Score Progress Chart (simple bar chart) */}
        {entries.length > 1 && entries.some(e => e.score) && (
          <div className="bg-white/5 rounded-xl border border-white/10 p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-accent-400" />
              <h3 className="font-bold text-white">Score Trend</h3>
            </div>
            <div className="flex items-end gap-2 h-32">
              {entries
                .sort((a, b) => a.week - b.week)
                .map(entry => {
                  const score = entry.score || 0;
                  const height = `${Math.max(score, 5)}%`;
                  return (
                    <div key={entry.id} className="flex-1 flex flex-col items-center gap-1">
                      <span className={`text-xs font-bold ${scoreColor(entry.score)}`}>
                        {entry.score || '-'}
                      </span>
                      <div className="w-full rounded-t-md bg-accent-500/40 transition-all"
                        style={{ height }} />
                      <span className="text-xs text-gray-500">W{entry.week}</span>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Progress Entries */}
        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading progress...</div>
        ) : entries.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No progress entries yet</h3>
            <p className="text-gray-400 mb-6">
              {enrollmentId
                ? 'Add the first weekly progress entry for this student.'
                : 'Select an enrollment from the enrollments page, then add progress.'}
            </p>
            {enrollmentId && (
              <button onClick={startCreate} className="px-6 py-3 bg-accent-500 text-white rounded-xl font-semibold">
                <Plus className="w-5 h-5 inline mr-2" /> Add First Week
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {entries.sort((a, b) => b.week - a.week).map(entry => (
              <motion.div key={entry.id} layout
                className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/10 p-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg font-bold text-accent-400">W{entry.week}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold text-white">{entry.topic}</h3>
                      {!enrollmentId && entry.user && (
                        <span className="text-sm text-gray-400">({entry.user.name || entry.user.email})</span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-3 mt-2">
                      {/* Score */}
                      <div className="flex items-center gap-1 text-sm">
                        <BarChart2 className="w-3.5 h-3.5 text-gray-500" />
                        <span className={scoreColor(entry.score)}>
                          {entry.score !== null ? `${entry.score}%` : 'No score'}
                        </span>
                      </div>
                      {/* Attendance */}
                      <div className="flex items-center gap-1 text-sm">
                        {attendanceIcon(entry.attendance)}
                        <span className="text-gray-400 capitalize">{entry.attendance}</span>
                      </div>
                      {/* Homework */}
                      <div className="flex items-center gap-1 text-sm">
                        <BookOpen className="w-3.5 h-3.5 text-gray-500" />
                        <span className="text-gray-400 capitalize">{entry.homework}</span>
                        {entry.homeworkGrade !== null && (
                          <span className={`ml-1 ${scoreColor(entry.homeworkGrade)}`}>({entry.homeworkGrade}%)</span>
                        )}
                      </div>
                      {/* Behavior */}
                      {entry.behavior && (
                        <div className="flex items-center gap-1 text-sm">
                          <Award className="w-3.5 h-3.5 text-gray-500" />
                          <span className={`capitalize ${
                            entry.behavior === 'excellent' ? 'text-green-400' :
                            entry.behavior === 'good' ? 'text-blue-400' : 'text-yellow-400'
                          }`}>
                            {entry.behavior.replace('_', ' ')}
                          </span>
                        </div>
                      )}
                    </div>
                    {entry.skills && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {entry.skills.split(',').map((skill, i) => (
                          <span key={i} className="px-2 py-0.5 text-xs bg-accent-500/20 text-accent-400 rounded-full">
                            {skill.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                    {entry.notes && (
                      <p className="text-sm text-gray-400 mt-2 italic">&quot;{entry.notes}&quot;</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => startEdit(entry)}
                      className="p-2 text-gray-400 hover:text-accent-400 transition-colors" title="Edit">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(entry)}
                      className="p-2 text-gray-400 hover:text-red-400 transition-colors" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
