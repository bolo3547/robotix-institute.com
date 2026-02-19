'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft, Plus, Edit, Trash2, Save, X,
  Users, GraduationCap, Search, Filter
} from 'lucide-react';

interface User {
  id: string;
  name: string | null;
  email: string;
}

interface Enrollment {
  id: string;
  userId: string;
  program: string;
  level: string;
  status: string;
  startDate: string;
  endDate: string | null;
  createdAt: string;
  user: User;
  progress: { id: string; week: number; score: number | null }[];
  payments: { id: string; amount: number; status: string }[];
}

const programs = [
  'Tiny Tots Robotics (2-5)',
  'Explorers Robotics (6-9)',
  'Builders Robotics (10-13)',
  'Coders Academy (14-18)',
  'Python Programming',
  'Scratch Coding',
  'Arduino Workshop',
  'AI & Machine Learning',
  'Web Development',
  '3D Printing',
];
const levels = ['beginner', 'intermediate', 'advanced'];
const statuses = ['active', 'completed', 'paused', 'cancelled'];

export default function AdminEnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Enrollment | null>(null);
  const [creating, setCreating] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [form, setForm] = useState({
    userId: '',
    program: programs[0],
    level: 'beginner',
    status: 'active',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
  });
  const [users, setUsers] = useState<User[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchEnrollments = useCallback(async () => {
    try {
      let url = '/api/admin/enrollments';
      if (statusFilter !== 'all') url += `?status=${statusFilter}`;
      const res = await fetch(url);
      if (res.ok) setEnrollments(await res.json());
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => { fetchEnrollments(); }, [fetchEnrollments]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/admin/users');
        if (res.ok) {
          const data = await res.json();
          setUsers(Array.isArray(data) ? data : data.users || []);
        }
      } catch { /* no users endpoint yet */ }
    };
    fetchUsers();
  }, []);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const startCreate = () => {
    setForm({
      userId: users[0]?.id || '',
      program: programs[0],
      level: 'beginner',
      status: 'active',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
    });
    setCreating(true);
    setEditing(null);
  };

  const startEdit = (enr: Enrollment) => {
    setForm({
      userId: enr.userId,
      program: enr.program,
      level: enr.level,
      status: enr.status,
      startDate: new Date(enr.startDate).toISOString().split('T')[0],
      endDate: enr.endDate ? new Date(enr.endDate).toISOString().split('T')[0] : '',
    });
    setEditing(enr);
    setCreating(false);
  };

  const handleSave = async () => {
    if (!form.userId || !form.program) {
      showMessage('error', 'Student and program are required');
      return;
    }
    setSaving(true);
    try {
      const method = editing ? 'PUT' : 'POST';
      const body = editing
        ? { id: editing.id, ...form, endDate: form.endDate || null }
        : { ...form, endDate: form.endDate || null };

      const res = await fetch('/api/admin/enrollments', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        showMessage('success', editing ? 'Enrollment updated!' : 'Student enrolled!');
        setEditing(null);
        setCreating(false);
        fetchEnrollments();
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

  const handleDelete = async (enr: Enrollment) => {
    if (!confirm(`Remove enrollment of ${enr.user?.name || enr.user?.email} from ${enr.program}?`)) return;
    try {
      const res = await fetch(`/api/admin/enrollments?id=${enr.id}`, { method: 'DELETE' });
      if (res.ok) { showMessage('success', 'Enrollment removed'); fetchEnrollments(); }
    } catch { showMessage('error', 'Failed to delete'); }
  };

  const filtered = enrollments.filter(e => {
    const name = e.user?.name || e.user?.email || '';
    return name.toLowerCase().includes(search.toLowerCase()) ||
      e.program.toLowerCase().includes(search.toLowerCase());
  });

  const statusColor = (s: string) => {
    switch (s) {
      case 'active': return 'bg-green-500/20 text-green-400';
      case 'completed': return 'bg-blue-500/20 text-blue-400';
      case 'paused': return 'bg-yellow-500/20 text-yellow-400';
      case 'cancelled': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
              <ArrowLeft className="w-5 h-5 text-white" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">Student Enrollments</h1>
              <p className="text-gray-400">Manage student enrollments in programs</p>
            </div>
          </div>
          <motion.button whileTap={{ scale: 0.95 }} onClick={startCreate}
            className="flex items-center gap-2 px-5 py-2.5 bg-accent-500 hover:bg-accent-600 text-white rounded-xl font-semibold transition-colors">
            <Plus className="w-5 h-5" /> Enroll Student
          </motion.button>
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

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search student or program..." 
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-accent-400 outline-none" />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} title="Filter"
              className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white outline-none">
              <option value="all">All Status</option>
              {statuses.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
          </div>
        </div>

        {/* Editor */}
        {(creating || editing) && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">{editing ? 'Edit Enrollment' : 'Enroll Student'}</h2>
              <button onClick={() => { setEditing(null); setCreating(false); }} className="p-2 text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Student *</label>
                {users.length > 0 ? (
                  <select value={form.userId} onChange={e => setForm(p => ({ ...p, userId: e.target.value }))} title="Student"
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none">
                    <option value="">Select student...</option>
                    {users.map(u => <option key={u.id} value={u.id}>{u.name || u.email}</option>)}
                  </select>
                ) : (
                  <input type="text" value={form.userId}
                    onChange={e => setForm(p => ({ ...p, userId: e.target.value }))}
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none"
                    placeholder="Enter student user ID" />
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Program *</label>
                <select value={form.program} onChange={e => setForm(p => ({ ...p, program: e.target.value }))} title="Program"
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none">
                  {programs.map(pr => <option key={pr} value={pr}>{pr}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Level</label>
                <select value={form.level} onChange={e => setForm(p => ({ ...p, level: e.target.value }))} title="Level"
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none">
                  {levels.map(l => <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Status</label>
                <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} title="Status"
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none">
                  {statuses.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Start Date</label>
                <input type="date" value={form.startDate}
                  onChange={e => setForm(p => ({ ...p, startDate: e.target.value }))}
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">End Date</label>
                <input type="date" value={form.endDate}
                  onChange={e => setForm(p => ({ ...p, endDate: e.target.value }))}
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none" />
              </div>
            </div>

            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-accent-500 hover:bg-accent-600 disabled:opacity-50 text-white rounded-xl font-semibold transition-colors">
              <Save className="w-5 h-5" /> {saving ? 'Saving...' : 'Save Enrollment'}
            </button>
          </motion.div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total', count: enrollments.length, color: 'text-white' },
            { label: 'Active', count: enrollments.filter(e => e.status === 'active').length, color: 'text-green-400' },
            { label: 'Completed', count: enrollments.filter(e => e.status === 'completed').length, color: 'text-blue-400' },
            { label: 'Paused', count: enrollments.filter(e => e.status === 'paused').length, color: 'text-yellow-400' },
          ].map(stat => (
            <div key={stat.label} className="bg-white/5 rounded-xl border border-white/10 p-4 text-center">
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.count}</p>
              <p className="text-sm text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Enrollments List */}
        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading enrollments...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No enrollments found</h3>
            <p className="text-gray-400 mb-6">Enroll your first student to get started.</p>
            <button onClick={startCreate} className="px-6 py-3 bg-accent-500 text-white rounded-xl font-semibold">
              <Plus className="w-5 h-5 inline mr-2" /> Enroll Student
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(enr => (
              <motion.div key={enr.id} layout
                className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/10 p-5 flex items-center gap-5">
                <div className="w-12 h-12 rounded-full bg-accent-500/20 flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-6 h-6 text-accent-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-white truncate">{enr.user?.name || enr.user?.email || 'Unknown'}</h3>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${statusColor(enr.status)}`}>
                      {enr.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">{enr.program} &middot; {enr.level}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                    <span>Started: {new Date(enr.startDate).toLocaleDateString()}</span>
                    {enr.progress?.length > 0 && <span>{enr.progress.length} weeks logged</span>}
                    {enr.payments?.length > 0 && <span>{enr.payments.length} payments</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link href={`/admin/progress?enrollmentId=${enr.id}`}
                    className="p-2 text-gray-400 hover:text-green-400 transition-colors" title="View Progress">
                    <GraduationCap className="w-4 h-4" />
                  </Link>
                  <button onClick={() => startEdit(enr)}
                    className="p-2 text-gray-400 hover:text-accent-400 transition-colors" title="Edit">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(enr)}
                    className="p-2 text-gray-400 hover:text-red-400 transition-colors" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
