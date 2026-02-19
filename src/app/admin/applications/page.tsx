'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft, Briefcase, Search, Filter, Mail, Phone, MapPin,
  Calendar, ChevronDown, RefreshCw, Eye, Clock, CheckCircle, XCircle,
  GraduationCap, Link as LinkIcon, FileText
} from 'lucide-react';

interface Application {
  id: number;
  key: string;
  type: string;
  position: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  dateOfBirth?: string;
  gender?: string;
  education?: string;
  experience?: string;
  skills?: string;
  hasTeachingExp?: string;
  yearsExperience?: string;
  linkedIn?: string;
  portfolio?: string;
  whyJoin?: string;
  availability?: string;
  startDate?: string;
  hearAbout?: string;
  additionalInfo?: string;
  submittedAt: string;
  status: string;
}

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [positionFilter, setPositionFilter] = useState('all');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/join-team');
      if (res.ok) {
        const data = await res.json();
        setApplications(data);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchApplications(); }, [fetchApplications]);

  const filteredApps = applications.filter(a => {
    const matchSearch = !search || 
      a.fullName.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase()) ||
      a.position.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || a.status === statusFilter;
    const matchPosition = positionFilter === 'all' || a.position === positionFilter;
    return matchSearch && matchStatus && matchPosition;
  });

  const positions = [...new Set(applications.map(a => a.position))];

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    reviewed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    accepted: 'bg-green-500/20 text-green-400 border-green-500/30',
    rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  const statusIcons: Record<string, React.ReactNode> = {
    pending: <Clock className="w-3.5 h-3.5" />,
    reviewed: <Eye className="w-3.5 h-3.5" />,
    accepted: <CheckCircle className="w-3.5 h-3.5" />,
    rejected: <XCircle className="w-3.5 h-3.5" />,
  };

  const updateStatus = async (appKey: string, newStatus: string) => {
    try {
      // Update in SiteSetting by finding and updating the value JSON
      const app = applications.find(a => a.key === appKey);
      if (!app) return;

      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: appKey, value: JSON.stringify({ ...app, status: newStatus }) }),
      });

      if (res.ok) {
        setApplications(prev => prev.map(a => a.key === appKey ? { ...a, status: newStatus } : a));
        if (selectedApp?.key === appKey) setSelectedApp({ ...selectedApp, status: newStatus });
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    reviewed: applications.filter(a => a.status === 'reviewed').length,
    accepted: applications.filter(a => a.status === 'accepted').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2 text-white/70 hover:text-white transition">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-orange-400" />
            Team Applications
          </h1>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={fetchApplications}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
          >
            <RefreshCw className="w-5 h-5" />
          </motion.button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Applications', value: stats.total, color: 'from-orange-500 to-amber-600', icon: <Briefcase className="w-5 h-5" /> },
            { label: 'Pending Review', value: stats.pending, color: 'from-yellow-500 to-orange-600', icon: <Clock className="w-5 h-5" /> },
            { label: 'Reviewed', value: stats.reviewed, color: 'from-blue-500 to-indigo-600', icon: <Eye className="w-5 h-5" /> },
            { label: 'Accepted', value: stats.accepted, color: 'from-green-500 to-emerald-600', icon: <CheckCircle className="w-5 h-5" /> },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-xl bg-gradient-to-br ${stat.color} p-4`}
            >
              <div className="flex items-center gap-2 text-white/80 text-sm mb-1">
                {stat.icon} {stat.label}
              </div>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, email, or position..."
              className="w-full bg-white/10 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-white/40 focus:border-orange-400 outline-none"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-white/10 border border-white/10 rounded-lg pl-10 pr-8 py-2.5 text-white appearance-none cursor-pointer focus:border-orange-400 outline-none"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
          </div>
          {positions.length > 0 && (
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <select
                value={positionFilter}
                onChange={e => setPositionFilter(e.target.value)}
                className="bg-white/10 border border-white/10 rounded-lg pl-10 pr-8 py-2.5 text-white appearance-none cursor-pointer focus:border-orange-400 outline-none"
              >
                <option value="all">All Positions</option>
                {positions.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
            </div>
          )}
        </div>

        {/* Applications List */}
        {loading ? (
          <div className="text-center py-20">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="inline-block">
              <RefreshCw className="w-8 h-8 text-orange-400" />
            </motion.div>
            <p className="text-white/60 mt-2">Loading applications...</p>
          </div>
        ) : filteredApps.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-xl border border-white/10">
            <Briefcase className="w-12 h-12 text-white/20 mx-auto mb-3" />
            <p className="text-white/60">No applications found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredApps.map((app, idx) => (
              <motion.div
                key={app.key || idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/[0.07] transition cursor-pointer"
                onClick={() => setSelectedApp(app)}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-amber-600 flex items-center justify-center text-lg font-bold shrink-0">
                      {app.fullName?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <h3 className="font-bold text-white">{app.fullName}</h3>
                      <p className="text-white/60 text-sm">{app.position}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-white/40">
                        <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {app.email}</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {app.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[app.status] || 'bg-white/10 text-white/60'}`}>
                      {statusIcons[app.status]} {app.status}
                    </span>
                    <span className="text-white/40 text-xs">
                      {app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : ''}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedApp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedApp(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto space-y-5"
            >
              {/* Header */}
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-400 to-amber-600 flex items-center justify-center text-2xl font-bold shrink-0">
                  {selectedApp.fullName?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white">{selectedApp.fullName}</h3>
                  <p className="text-orange-400">{selectedApp.position}</p>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border mt-1 ${statusColors[selectedApp.status] || ''}`}>
                    {statusIcons[selectedApp.status]} {selectedApp.status}
                  </span>
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-white/5 rounded-xl p-4 space-y-2.5">
                <h4 className="text-sm font-bold text-white/80 uppercase tracking-wider">Contact</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  <span className="flex items-center gap-2"><Mail className="w-4 h-4 text-cyan-400" /> <a href={`mailto:${selectedApp.email}`} className="text-cyan-400 hover:underline">{selectedApp.email}</a></span>
                  <span className="flex items-center gap-2"><Phone className="w-4 h-4 text-green-400" /> {selectedApp.phone}</span>
                  <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-yellow-400" /> {selectedApp.location}</span>
                  {selectedApp.dateOfBirth && <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-purple-400" /> {selectedApp.dateOfBirth}</span>}
                </div>
              </div>

              {/* Qualifications */}
              <div className="bg-white/5 rounded-xl p-4 space-y-2.5">
                <h4 className="text-sm font-bold text-white/80 uppercase tracking-wider">Qualifications</h4>
                <div className="space-y-2 text-sm">
                  {selectedApp.education && (
                    <div><GraduationCap className="w-4 h-4 text-blue-400 inline mr-2" /><span className="text-white/60">Education:</span> <span className="text-white">{selectedApp.education}</span></div>
                  )}
                  {selectedApp.experience && (
                    <div><Briefcase className="w-4 h-4 text-orange-400 inline mr-2" /><span className="text-white/60">Experience:</span> <span className="text-white">{selectedApp.experience}</span></div>
                  )}
                  {selectedApp.skills && (
                    <div><span className="text-white/60">Skills:</span> <span className="text-white">{selectedApp.skills}</span></div>
                  )}
                  {selectedApp.yearsExperience && (
                    <div><span className="text-white/60">Years:</span> <span className="text-white">{selectedApp.yearsExperience}</span></div>
                  )}
                  {selectedApp.hasTeachingExp && (
                    <div><span className="text-white/60">Teaching exp:</span> <span className="text-white">{selectedApp.hasTeachingExp}</span></div>
                  )}
                </div>
              </div>

              {/* Links */}
              {(selectedApp.linkedIn || selectedApp.portfolio) && (
                <div className="bg-white/5 rounded-xl p-4 space-y-2">
                  <h4 className="text-sm font-bold text-white/80 uppercase tracking-wider">Links</h4>
                  <div className="flex flex-col gap-1 text-sm">
                    {selectedApp.linkedIn && (
                      <a href={selectedApp.linkedIn} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-cyan-400 hover:underline">
                        <LinkIcon className="w-4 h-4" /> LinkedIn
                      </a>
                    )}
                    {selectedApp.portfolio && (
                      <a href={selectedApp.portfolio} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-cyan-400 hover:underline">
                        <FileText className="w-4 h-4" /> Portfolio
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Motivation */}
              {selectedApp.whyJoin && (
                <div className="bg-white/5 rounded-xl p-4 space-y-2">
                  <h4 className="text-sm font-bold text-white/80 uppercase tracking-wider">Why They Want to Join</h4>
                  <p className="text-white/80 text-sm leading-relaxed">{selectedApp.whyJoin}</p>
                </div>
              )}

              {/* Availability */}
              <div className="bg-white/5 rounded-xl p-4 space-y-2 text-sm">
                <h4 className="text-sm font-bold text-white/80 uppercase tracking-wider">Availability</h4>
                <div className="grid grid-cols-2 gap-2">
                  {selectedApp.availability && <div><span className="text-white/60">Type:</span> <span className="text-white">{selectedApp.availability}</span></div>}
                  {selectedApp.startDate && <div><span className="text-white/60">Can start:</span> <span className="text-white">{selectedApp.startDate}</span></div>}
                  {selectedApp.hearAbout && <div><span className="text-white/60">Heard via:</span> <span className="text-white">{selectedApp.hearAbout}</span></div>}
                </div>
              </div>

              {/* Additional Info */}
              {selectedApp.additionalInfo && (
                <div className="bg-white/5 rounded-xl p-4 space-y-2">
                  <h4 className="text-sm font-bold text-white/80 uppercase tracking-wider">Additional Info</h4>
                  <p className="text-white/80 text-sm">{selectedApp.additionalInfo}</p>
                </div>
              )}

              {/* Actions */}
              <div className="pt-2 space-y-3">
                <h4 className="text-sm font-bold text-white/80 uppercase tracking-wider">Update Status</h4>
                <div className="flex flex-wrap gap-2">
                  {(['pending', 'reviewed', 'accepted', 'rejected'] as const).map(s => (
                    <motion.button
                      key={s}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => updateStatus(selectedApp.key, s)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition ${
                        selectedApp.status === s
                          ? statusColors[s]
                          : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                      }`}
                    >
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </motion.button>
                  ))}
                </div>
                <div className="flex gap-2 pt-2">
                  <a
                    href={`mailto:${selectedApp.email}`}
                    className="flex-1 py-2.5 rounded-lg bg-orange-500 text-white text-center font-medium text-sm hover:bg-orange-600 transition"
                  >
                    📧 Email Applicant
                  </a>
                  <button
                    onClick={() => setSelectedApp(null)}
                    className="px-4 py-2.5 rounded-lg bg-white/10 text-white/70 text-sm hover:bg-white/20 transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
