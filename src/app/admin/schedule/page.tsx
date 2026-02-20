'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft, Plus, Edit2, Trash2, Save, X,
  Calendar, Check, AlertCircle, Eye
} from 'lucide-react';

interface ScheduleEntry {
  id: string;
  title: string;
  description?: string;
  program: string;
  instructor?: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  location?: string;
  ageGroup?: string;
  capacity: number;
  enrolled: number;
  active: boolean;
  createdAt: string;
}

const DAYS = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' },
];

const emptyForm = {
  title: '',
  description: '',
  program: '',
  instructor: '',
  dayOfWeek: 'monday',
  startTime: '09:00',
  endTime: '10:00',
  location: '',
  ageGroup: '',
  capacity: '20',
};

export default function AdminSchedulePage() {
  const [schedules, setSchedules] = useState<ScheduleEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [filterDay, setFilterDay] = useState('all');

  const fetchSchedules = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/schedule');
      if (res.ok) {
        const data = await res.json();
        setSchedules(data);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditing(null);
    setShowForm(false);
    setError('');
  };

  const openEditForm = (entry: ScheduleEntry) => {
    setForm({
      title: entry.title,
      description: entry.description || '',
      program: entry.program,
      instructor: entry.instructor || '',
      dayOfWeek: entry.dayOfWeek,
      startTime: entry.startTime,
      endTime: entry.endTime,
      location: entry.location || '',
      ageGroup: entry.ageGroup || '',
      capacity: String(entry.capacity),
    });
    setEditing(entry.id);
    setShowForm(true);
    setError('');
  };

  const handleSave = async () => {
    if (!form.title || !form.program || !form.dayOfWeek || !form.startTime || !form.endTime) {
      setError('Title, Program, Day, Start Time, and End Time are required');
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const method = editing ? 'PUT' : 'POST';
      const body = editing ? { id: editing, ...form } : form;

      const res = await fetch('/api/schedule', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to save');
        return;
      }

      setSuccess(editing ? 'Schedule updated!' : 'Schedule created!');
      resetForm();
      fetchSchedules();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Network error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this schedule entry?')) return;

    try {
      const res = await fetch(`/api/schedule?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSchedules((prev) => prev.filter((s) => s.id !== id));
        setSuccess('Schedule removed');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const filteredSchedules = filterDay === 'all'
    ? schedules
    : schedules.filter((s) => s.dayOfWeek === filterDay);

  // Group by day for display
  const groupedByDay: Record<string, ScheduleEntry[]> = {};
  DAYS.forEach((d) => (groupedByDay[d.value] = []));
  filteredSchedules.forEach((s) => {
    if (groupedByDay[s.dayOfWeek]) groupedByDay[s.dayOfWeek].push(s);
  });
  Object.values(groupedByDay).forEach((arr) =>
    arr.sort((a, b) => a.startTime.localeCompare(b.startTime))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
          <Link href="/admin" className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white">Staff Timetable Manager</h1>
            <p className="text-white/60 text-sm mt-1">
              Create and manage the weekly schedule — workers see this on the{' '}
              <Link href="/timetable" className="text-orange-400 hover:underline">/timetable</Link> page.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/timetable"
              target="_blank"
              className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Eye className="w-4 h-4" />
              View Timetable
            </Link>
            <button
              onClick={() => { resetForm(); setShowForm(true); }}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-400 to-orange-600 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Entry
            </button>
          </div>
        </div>

        {/* Success / Error Messages */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 px-4 py-3 rounded-lg bg-green-500/20 border border-green-500/30 text-green-400 text-sm flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              {success}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form Modal */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mb-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-6 sm:p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-orange-400" />
                  {editing ? 'Edit Schedule Entry' : 'New Schedule Entry'}
                </h2>
                <button
                  onClick={resetForm}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                  aria-label="Close form"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>

              {error && (
                <div className="mb-4 px-4 py-2.5 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">Title *</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Robotics Morning Class"
                    className="w-full px-3 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/30 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  />
                </div>

                {/* Program */}
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">Program *</label>
                  <input
                    type="text"
                    value={form.program}
                    onChange={(e) => setForm({ ...form, program: e.target.value })}
                    placeholder="e.g. Robotics Foundations"
                    className="w-full px-3 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/30 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  />
                </div>

                {/* Instructor */}
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">Instructor</label>
                  <input
                    type="text"
                    value={form.instructor}
                    onChange={(e) => setForm({ ...form, instructor: e.target.value })}
                    placeholder="e.g. Mr. Banda"
                    className="w-full px-3 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/30 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  />
                </div>

                {/* Day of Week */}
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">Day of Week *</label>
                  <select
                    value={form.dayOfWeek}
                    onChange={(e) => setForm({ ...form, dayOfWeek: e.target.value })}
                    title="Day of week"
                    className="w-full px-3 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  >
                    {DAYS.map((d) => (
                      <option key={d.value} value={d.value} className="bg-slate-800">{d.label}</option>
                    ))}
                  </select>
                </div>

                {/* Start Time */}
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">Start Time *</label>
                  <input
                    type="time"
                    value={form.startTime}
                    onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                    title="Start time"
                    className="w-full px-3 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  />
                </div>

                {/* End Time */}
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">End Time *</label>
                  <input
                    type="time"
                    value={form.endTime}
                    onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                    title="End time"
                    className="w-full px-3 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">Location</label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="e.g. Lab A"
                    className="w-full px-3 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/30 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  />
                </div>

                {/* Age Group */}
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">Age Group</label>
                  <input
                    type="text"
                    value={form.ageGroup}
                    onChange={(e) => setForm({ ...form, ageGroup: e.target.value })}
                    placeholder="e.g. 9-12"
                    className="w-full px-3 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/30 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  />
                </div>

                {/* Capacity */}
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">Capacity</label>
                  <input
                    type="number"
                    value={form.capacity}
                    onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                    min="1"
                    title="Capacity"
                    className="w-full px-3 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-white/70 mb-1.5">Description (optional)</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={2}
                  placeholder="Additional notes about this session..."
                  className="w-full px-3 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/30 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={resetForm}
                  className="px-4 py-2.5 rounded-lg bg-white/10 text-white/70 hover:bg-white/20 transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-orange-400 to-orange-600 text-white font-medium hover:shadow-lg transition-all text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {editing ? 'Update' : 'Create'}
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Day Filter */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setFilterDay('all')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              filterDay === 'all'
                ? 'bg-orange-500 text-white'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            All Days
          </button>
          {DAYS.map((d) => (
            <button
              key={d.value}
              onClick={() => setFilterDay(d.value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                filterDay === d.value
                  ? 'bg-orange-500 text-white'
                  : 'bg-white/10 text-white/60 hover:bg-white/20'
              }`}
            >
              {d.label}
              {groupedByDay[d.value]?.length > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-white/20 text-[10px]">
                  {groupedByDay[d.value].length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-orange-200 border-t-orange-500"></div>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredSchedules.length === 0 && (
          <div className="text-center py-20">
            <Calendar className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white/60 mb-2">No schedules yet</h3>
            <p className="text-white/40 mb-6">Click &quot;Add Entry&quot; to create the first timetable entry</p>
            <button
              onClick={() => { resetForm(); setShowForm(true); }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-400 to-orange-600 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all"
            >
              <Plus className="w-4 h-4" />
              Add First Entry
            </button>
          </div>
        )}

        {/* Schedule Entries by Day */}
        {!loading && filteredSchedules.length > 0 && (
          <div className="space-y-6">
            {DAYS.map((day) => {
              const entries = groupedByDay[day.value];
              if (filterDay !== 'all' && filterDay !== day.value) return null;
              if (entries.length === 0) return null;

              return (
                <motion.div
                  key={day.value}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl overflow-hidden"
                >
                  <div className="px-5 py-3 bg-white/5 border-b border-white/10 flex items-center justify-between">
                    <h3 className="font-bold text-white text-lg flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-orange-400" />
                      {day.label}
                    </h3>
                    <span className="text-white/40 text-sm">
                      {entries.length} session{entries.length !== 1 ? 's' : ''}
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left px-4 py-2.5 text-xs font-semibold text-white/50 uppercase">Time</th>
                          <th className="text-left px-4 py-2.5 text-xs font-semibold text-white/50 uppercase">Title</th>
                          <th className="text-left px-4 py-2.5 text-xs font-semibold text-white/50 uppercase">Program</th>
                          <th className="text-left px-4 py-2.5 text-xs font-semibold text-white/50 uppercase">Instructor</th>
                          <th className="text-left px-4 py-2.5 text-xs font-semibold text-white/50 uppercase">Location</th>
                          <th className="text-left px-4 py-2.5 text-xs font-semibold text-white/50 uppercase">Capacity</th>
                          <th className="text-right px-4 py-2.5 text-xs font-semibold text-white/50 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {entries.map((entry) => (
                          <tr
                            key={entry.id}
                            className="border-b last:border-b-0 border-white/5 hover:bg-white/5 transition-colors"
                          >
                            <td className="px-4 py-3 text-sm font-mono text-orange-300 whitespace-nowrap">
                              {entry.startTime} – {entry.endTime}
                            </td>
                            <td className="px-4 py-3">
                              <div className="text-sm font-semibold text-white">{entry.title}</div>
                              {entry.ageGroup && (
                                <div className="text-xs text-white/40 mt-0.5">Ages {entry.ageGroup}</div>
                              )}
                            </td>
                            <td className="px-4 py-3 text-sm text-white/70">{entry.program}</td>
                            <td className="px-4 py-3 text-sm text-white/70">{entry.instructor || '—'}</td>
                            <td className="px-4 py-3 text-sm text-white/70">{entry.location || '—'}</td>
                            <td className="px-4 py-3 text-sm text-white/70">
                              {entry.enrolled}/{entry.capacity}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center gap-1 justify-end">
                                <button
                                  onClick={() => openEditForm(entry)}
                                  className="p-2 rounded-lg hover:bg-white/10 text-white/50 hover:text-orange-400 transition-colors"
                                  title="Edit"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(entry.id)}
                                  className="p-2 rounded-lg hover:bg-white/10 text-white/50 hover:text-red-400 transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
