'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2, Edit2, Eye, EyeOff, X, Calendar, MapPin, Star } from 'lucide-react';

interface EventItem {
  id: string;
  title: string;
  description: string | null;
  date: string;
  time: string | null;
  endDate: string | null;
  location: string | null;
  image: string | null;
  category: string;
  featured: boolean;
  published: boolean;
  createdAt: string;
}

const categories = ['workshop', 'competition', 'seminar', 'camp', 'exhibition', 'general'];

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [form, setForm] = useState({
    title: '', description: '', date: '', time: '', endDate: '',
    location: '', image: '', category: 'workshop', featured: false, published: true,
  });

  const fetchEvents = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/events');
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      }
    } catch (err) {
      console.error('Failed to fetch events:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingEvent ? 'PUT' : 'POST';
      const body = editingEvent ? { id: editingEvent.id, ...form } : form;

      const res = await fetch('/api/admin/events', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setShowForm(false);
        setEditingEvent(null);
        setForm({ title: '', description: '', date: '', time: '', endDate: '', location: '', image: '', category: 'workshop', featured: false, published: true });
        fetchEvents();
      }
    } catch (err) {
      console.error('Save failed:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      await fetch(`/api/admin/events?id=${id}`, { method: 'DELETE' });
      fetchEvents();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const togglePublished = async (event: EventItem) => {
    try {
      await fetch('/api/admin/events', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: event.id, published: !event.published }),
      });
      fetchEvents();
    } catch (err) {
      console.error('Toggle failed:', err);
    }
  };

  const openEdit = (event: EventItem) => {
    setEditingEvent(event);
    setForm({
      title: event.title,
      description: event.description || '',
      date: event.date ? new Date(event.date).toISOString().split('T')[0] : '',
      time: event.time || '',
      endDate: event.endDate ? new Date(event.endDate).toISOString().split('T')[0] : '',
      location: event.location || '',
      image: event.image || '',
      category: event.category,
      featured: event.featured,
      published: event.published,
    });
    setShowForm(true);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      {/* Header */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-white/60 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-lg font-bold text-white">Events Manager</h1>
              <p className="text-white/60 text-xs">{events.length} events</p>
            </div>
          </div>
          <button
            onClick={() => { setShowForm(true); setEditingEvent(null); setForm({ title: '', description: '', date: '', time: '', endDate: '', location: '', image: '', category: 'workshop', featured: false, published: true }); }}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-brand-500 to-brand-600 text-white text-sm font-medium hover:shadow-lg transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Event
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Form Modal */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 border border-white/20 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">{editingEvent ? 'Edit Event' : 'Create New Event'}</h2>
                <button onClick={() => setShowForm(false)} className="text-white/60 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1">Event Title *</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                    required
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:border-brand-500 focus:outline-none"
                    placeholder="e.g., Robotics Summer Camp"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:border-brand-500 focus:outline-none"
                    placeholder="Event description"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-1">Start Date *</label>
                    <input
                      type="date"
                      value={form.date}
                      onChange={(e) => setForm(prev => ({ ...prev, date: e.target.value }))}
                      required
                      className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:border-brand-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-1">Time</label>
                    <input
                      type="time"
                      value={form.time}
                      onChange={(e) => setForm(prev => ({ ...prev, time: e.target.value }))}
                      className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:border-brand-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1">End Date</label>
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={(e) => setForm(prev => ({ ...prev, endDate: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:border-brand-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1">Location</label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => setForm(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:border-brand-500 focus:outline-none"
                    placeholder="e.g., Robotix Lab, Main Campus"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1">Image URL</label>
                  <input
                    type="text"
                    value={form.image}
                    onChange={(e) => setForm(prev => ({ ...prev, image: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:border-brand-500 focus:outline-none"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:border-brand-500 focus:outline-none"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat} className="bg-slate-900">{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={(e) => setForm(prev => ({ ...prev, featured: e.target.checked }))}
                      className="rounded border-white/20"
                    />
                    <span className="text-sm text-white/80">Featured event</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.published}
                      onChange={(e) => setForm(prev => ({ ...prev, published: e.target.checked }))}
                      className="rounded border-white/20"
                    />
                    <span className="text-sm text-white/80">Published</span>
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setShowForm(false)} className="flex-1 px-4 py-2 rounded-lg border border-white/20 text-white/60 hover:text-white transition-colors">
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-brand-500 to-brand-600 text-white font-medium hover:shadow-lg transition-all">
                    {editingEvent ? 'Save Changes' : 'Create Event'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* Events List */}
        {loading ? (
          <div className="text-center py-20 text-white/60">Loading events...</div>
        ) : events.length === 0 ? (
          <div className="text-center py-20">
            <Calendar className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <p className="text-white/60 text-lg mb-2">No events yet</p>
            <p className="text-white/40 text-sm">Click "Add Event" to create your first event.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {events.map((event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`relative rounded-xl overflow-hidden bg-white/5 border transition-all ${
                  event.featured ? 'border-brand-500/30' : 'border-white/10'
                } hover:border-white/20`}
              >
                <div className="p-4 flex items-start gap-4">
                  {/* Date badge */}
                  <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-brand-500/20 flex flex-col items-center justify-center text-brand-400">
                    <span className="text-xs uppercase font-medium">
                      {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                    <span className="text-lg font-bold leading-none">
                      {new Date(event.date).getDate()}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-white truncate">{event.title}</h3>
                      {event.featured && <Star className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0" />}
                      {!event.published && (
                        <span className="text-[10px] uppercase tracking-wider text-white/40 bg-white/10 px-2 py-0.5 rounded-full">Draft</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-white/40">
                      <span>{formatDate(event.date)}{event.time ? ` at ${event.time}` : ''}</span>
                      {event.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {event.location}
                        </span>
                      )}
                      <span className="capitalize bg-white/10 px-2 py-0.5 rounded-full">{event.category}</span>
                    </div>
                    {event.description && (
                      <p className="text-xs text-white/50 mt-1 line-clamp-2">{event.description}</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => openEdit(event)} className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => togglePublished(event)} className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors" title={event.published ? 'Unpublish' : 'Publish'}>
                      {event.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button onClick={() => handleDelete(event.id)} className="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors">
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
