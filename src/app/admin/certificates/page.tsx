'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft, Plus, Edit2, Trash2, Save, X, Eye, Send,
  Award, Search, CheckCircle, AlertCircle, FileText, Users,
  Loader2, ChevronDown,
} from 'lucide-react';

/* ─── Types ─── */
interface CertificateData {
  id: string;
  userId: string;
  childName: string;
  courseName: string;
  grade: string;
  issueDate: string;
  certNumber: string;
  skills: string | null;
  instructorName: string | null;
  directorName: string;
  cohort: string | null;
  completionHours: number;
  description: string | null;
  status: string;
  publishedAt: string | null;
  createdAt: string;
  user?: { id: string; name: string; email: string };
}

interface UserOption {
  id: string;
  name: string;
  email: string;
}

const PROGRAMS = [
  'Robotics Fundamentals',
  'Python for Kids',
  'Web Development Junior',
  'Advanced Robotics & IoT',
  'Scratch Programming',
  'AI & Machine Learning Basics',
  'Electronics & Circuits',
  '3D Design & Printing',
  'Game Development',
  'Cybersecurity for Teens',
];

const GRADES = [
  { value: 'distinction', label: 'With Distinction', color: 'bg-purple-600' },
  { value: 'merit', label: 'With Merit', color: 'bg-indigo-500' },
  { value: 'pass', label: 'Completed', color: 'bg-slate-500' },
];

/* ═══════════════════════════════════════════════
   CERTIFICATE FORM MODAL
   ═══════════════════════════════════════════════ */

function CertificateForm({
  cert,
  users,
  onSave,
  onClose,
}: {
  cert: CertificateData | null;
  users: UserOption[];
  onSave: (data: Record<string, unknown>) => Promise<void>;
  onClose: () => void;
}) {
  const isEdit = !!cert;
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Form fields
  const [userId, setUserId] = useState(cert?.userId || '');
  const [childName, setChildName] = useState(cert?.childName || '');
  const [courseName, setCourseName] = useState(cert?.courseName || PROGRAMS[0]);
  const [grade, setGrade] = useState(cert?.grade || 'pass');
  const [issueDate, setIssueDate] = useState(
    cert?.issueDate ? new Date(cert.issueDate).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10)
  );
  const [certNumber, setCertNumber] = useState(cert?.certNumber || '');
  const [skills, setSkills] = useState<string[]>(
    cert?.skills ? (() => { try { return JSON.parse(cert.skills); } catch { return []; } })() : []
  );
  const [skillInput, setSkillInput] = useState('');
  const [instructorName, setInstructorName] = useState(cert?.instructorName || '');
  const [directorName, setDirectorName] = useState(cert?.directorName || 'Dr. Chileshe Mwale');
  const [cohort, setCohort] = useState(cert?.cohort || '');
  const [completionHours, setCompletionHours] = useState(cert?.completionHours || 0);

  // Auto-generate cert number for new certs
  useEffect(() => {
    if (!isEdit && !certNumber) {
      const prefix = 'RIZ';
      const year = new Date().getFullYear();
      const code = courseName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
      const rand = String(Math.floor(Math.random() * 9000) + 1000);
      setCertNumber(`${prefix}-${year}-${code}-${rand}`);
    }
  }, [isEdit, certNumber, courseName]);

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setSkillInput('');
    }
  };

  const removeSkill = (s: string) => setSkills(skills.filter(sk => sk !== s));

  const handleSubmit = async () => {
    if (!userId) return setError('Please select a student');
    if (!childName.trim()) return setError('Student name is required');
    if (!certNumber.trim()) return setError('Certificate number is required');
    setSaving(true);
    setError('');
    try {
      await onSave({
        ...(isEdit ? { id: cert!.id } : {}),
        userId,
        childName: childName.trim(),
        courseName,
        grade,
        issueDate,
        certNumber: certNumber.trim(),
        skills: skills,
        instructorName: instructorName.trim() || null,
        directorName: directorName.trim(),
        cohort: cohort.trim() || null,
        completionHours,
      });
      onClose();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95 }}
        onClick={e => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 border-b px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <Award className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">{isEdit ? 'Edit Certificate' : 'Create Certificate'}</h2>
              <p className="text-xs text-gray-500">Fill in student details to generate a certificate</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors" aria-label="Close certificate form">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {error && (
            <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}

          {/* Student selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Student Account</label>
              <select
                value={userId}
                onChange={e => {
                  setUserId(e.target.value);
                  const user = users.find(u => u.id === e.target.value);
                  if (user && !childName) setChildName(user.name);
                }}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Select student…</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Name on Certificate *</label>
              <input
                value={childName}
                onChange={e => setChildName(e.target.value)}
                placeholder="Full name displayed on certificate"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Program & Grade */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Program</label>
              <select
                value={courseName}
                onChange={e => setCourseName(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {PROGRAMS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Grade</label>
              <div className="flex gap-2">
                {GRADES.map(g => (
                  <button
                    key={g.value}
                    onClick={() => setGrade(g.value)}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all border-2 ${
                      grade === g.value
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Certificate Number & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Certificate # *</label>
              <input
                value={certNumber}
                onChange={e => setCertNumber(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm font-mono focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Issue Date</label>
              <input
                type="date"
                value={issueDate}
                onChange={e => setIssueDate(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Completion Hrs</label>
              <input
                type="number"
                value={completionHours}
                onChange={e => setCompletionHours(Number(e.target.value))}
                min={0}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Instructor, Director, Cohort */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Instructor</label>
              <input
                value={instructorName}
                onChange={e => setInstructorName(e.target.value)}
                placeholder="e.g. Mr. Banda"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Director</label>
              <input
                value={directorName}
                onChange={e => setDirectorName(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Cohort</label>
              <input
                value={cohort}
                onChange={e => setCohort(e.target.value)}
                placeholder="e.g. January 2026"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Skills Earned</label>
            <div className="flex gap-2 mb-2">
              <input
                value={skillInput}
                onChange={e => setSkillInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                placeholder="Type a skill and press Enter"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button onClick={addSkill} className="px-4 py-2 bg-purple-100 text-purple-700 rounded-xl text-sm font-medium hover:bg-purple-200 transition-colors">
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map(s => (
                <span key={s} className="inline-flex items-center gap-1 px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full border border-purple-200">
                  {s}
                  <button onClick={() => removeSkill(s)} className="ml-0.5 hover:text-red-500" aria-label={`Remove skill ${s}`}><X className="w-3 h-3" /></button>
                </span>
              ))}
              {skills.length === 0 && <p className="text-xs text-gray-400 italic">No skills added yet</p>}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex items-center justify-end gap-3 rounded-b-2xl">
          <button onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 text-white text-sm font-semibold rounded-xl hover:bg-purple-700 disabled:opacity-50 transition-all"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isEdit ? 'Update' : 'Create'} Certificate
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   LIVE PREVIEW PANEL (Google-style)
   ═══════════════════════════════════════════════ */

function CertificatePreview({ cert }: { cert: CertificateData }) {
  const parsedSkills: string[] = cert.skills ? (() => { try { return JSON.parse(cert.skills); } catch { return []; } })() : [];
  const date = new Date(cert.issueDate).toLocaleDateString('en-ZM', { year: 'numeric', month: 'long', day: 'numeric' });
  const gradeLabel = cert.grade === 'distinction' ? 'With Distinction' : cert.grade === 'merit' ? 'With Merit' : 'Completed';

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border" style={{ aspectRatio: '1.414/1' }}>
      {/* Top accent */}
      <div className="h-2 bg-gradient-to-r from-purple-700 via-purple-500 to-purple-700" />

      <div className="p-6 sm:p-8 flex flex-col justify-between h-[calc(100%-8px)] relative">
        {/* Header */}
        <div className="text-center space-y-1">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-purple-700 flex items-center justify-center">
              <span className="text-white font-bold text-xs">R</span>
            </div>
            <span className="text-sm font-bold text-gray-900 tracking-wide">ROBOTIX INSTITUTE</span>
          </div>
          <p className="text-[10px] text-gray-400 tracking-[0.3em] uppercase">Certificate of Achievement</p>
        </div>

        {/* Body */}
        <div className="text-center space-y-3 py-4">
          <p className="text-[10px] text-gray-400 tracking-widest uppercase">This certifies that</p>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{cert.childName || 'Student Name'}</h2>
          <p className="text-[10px] text-gray-400 tracking-widest uppercase">has successfully completed</p>
          <h3 className="text-sm sm:text-base font-semibold text-purple-700">{cert.courseName}</h3>
          <span className="inline-block px-3 py-1 bg-purple-50 text-purple-700 text-[10px] font-bold tracking-wider rounded-full border border-purple-200">
            {gradeLabel}
          </span>
          {parsedSkills.length > 0 && (
            <div className="flex flex-wrap justify-center gap-1.5 pt-1">
              {parsedSkills.slice(0, 5).map(s => (
                <span key={s} className="text-[8px] px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">{s}</span>
              ))}
            </div>
          )}
        </div>

        {/* Signatures */}
        <div className="flex justify-between items-end text-center pt-2 border-t border-gray-100">
          <div className="flex-1">
            <div className="h-6 border-b border-gray-300 mx-4" />
            <p className="text-[9px] text-gray-500 mt-1">{cert.instructorName || 'Instructor'}</p>
            <p className="text-[8px] text-gray-400">Program Instructor</p>
          </div>
          <div className="flex-1">
            <p className="text-[9px] text-gray-400">{date}</p>
            <p className="text-[8px] text-gray-400">#{cert.certNumber}</p>
          </div>
          <div className="flex-1">
            <div className="h-6 border-b border-gray-300 mx-4" />
            <p className="text-[9px] text-gray-500 mt-1">{cert.directorName}</p>
            <p className="text-[8px] text-gray-400">Director</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   MAIN ADMIN CERTIFICATES PAGE
   ═══════════════════════════════════════════════ */

export default function AdminCertificatesPage() {
  const [certificates, setCertificates] = useState<CertificateData[]>([]);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [editCert, setEditCert] = useState<CertificateData | null>(null);
  const [previewCert, setPreviewCert] = useState<CertificateData | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [certRes, usersRes] = await Promise.all([
        fetch('/api/admin/certificates'),
        fetch('/api/chat/users'),
      ]);
      const certs = await certRes.json();
      const usersData = await usersRes.json();
      setCertificates(Array.isArray(certs) ? certs : []);
      setUsers(Array.isArray(usersData) ? usersData : []);
    } catch (e) {
      console.error('Fetch failed:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSave = async (data: Record<string, unknown>) => {
    const isEdit = !!data.id;
    const url = isEdit ? `/api/admin/certificates/${data.id}` : '/api/admin/certificates';
    const method = isEdit ? 'PATCH' : 'POST';

    // Serialize skills array to JSON string for the database
    const payload = {
      ...data,
      skills: Array.isArray(data.skills) ? JSON.stringify(data.skills) : data.skills,
    };

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to save');
    }

    await fetchData();
  };

  const handlePublish = async (id: string, publish: boolean) => {
    setActionLoading(id);
    try {
      await fetch(`/api/admin/certificates/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: publish ? 'published' : 'draft' }),
      });
      await fetchData();
    } catch (e) {
      console.error('Publish failed:', e);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this certificate permanently?')) return;
    setActionLoading(id);
    try {
      await fetch(`/api/admin/certificates/${id}`, { method: 'DELETE' });
      await fetchData();
    } catch (e) {
      console.error('Delete failed:', e);
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = certificates.filter(c => {
    const matchSearch = !search ||
      c.childName.toLowerCase().includes(search.toLowerCase()) ||
      c.certNumber.toLowerCase().includes(search.toLowerCase()) ||
      c.courseName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalDraft = certificates.filter(c => c.status === 'draft').length;
  const totalPublished = certificates.filter(c => c.status === 'published').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="p-2 rounded-lg hover:bg-gray-100 transition-colors" aria-label="Back to admin dashboard">
              <ArrowLeft className="w-5 h-5 text-gray-500" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-600" />
                Certificate Designer
              </h1>
              <p className="text-xs text-gray-500">Create, edit & publish student certificates</p>
            </div>
          </div>
          <button
            onClick={() => { setEditCert(null); setShowForm(true); }}
            className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white text-sm font-semibold rounded-xl hover:bg-purple-700 transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" /> New Certificate
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Total', value: certificates.length, icon: Award, color: 'text-purple-600', bg: 'bg-purple-50' },
            { label: 'Published', value: totalPublished, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Drafts', value: totalDraft, icon: FileText, color: 'text-amber-600', bg: 'bg-amber-50' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl p-4 border flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center`}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Search & filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, program or certificate #..."
              aria-label="Search certificates"
              className="w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              aria-label="Filter by status"
              className="appearance-none pl-4 pr-10 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
            >
              <option value="all">All Status</option>
              <option value="draft">Drafts Only</option>
              <option value="published">Published Only</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Certificate list */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border">
            <Award className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No certificates found</p>
            <p className="text-sm text-gray-400 mt-1">Create your first certificate to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(cert => {
              const isPublished = cert.status === 'published';
              const gradeInfo = GRADES.find(g => g.value === cert.grade);
              const isLoading = actionLoading === cert.id;

              return (
                <motion.div
                  key={cert.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl border p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-md transition-shadow"
                >
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 truncate">{cert.childName}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        isPublished ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {cert.status}
                      </span>
                      {gradeInfo && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                          {gradeInfo.label}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{cert.courseName}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                      <span className="font-mono">{cert.certNumber}</span>
                      <span>•</span>
                      <span>{new Date(cert.issueDate).toLocaleDateString('en-ZM', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                      {cert.user && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1"><Users className="w-3 h-3" />{cert.user.email}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setPreviewCert(cert)}
                      className="px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors flex items-center gap-1.5"
                      title="Preview"
                      aria-label="Preview certificate"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => { setEditCert(cert); setShowForm(true); }}
                      className="px-3 py-2 rounded-lg text-sm font-medium bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors flex items-center gap-1.5"
                      title="Edit"
                      aria-label="Edit certificate"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handlePublish(cert.id, !isPublished)}
                      disabled={isLoading}
                      className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                        isPublished
                          ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                          : 'bg-green-50 text-green-700 hover:bg-green-100'
                      }`}
                      title={isPublished ? 'Unpublish' : 'Publish for parents'}
                    >
                      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      {isPublished ? 'Unpublish' : 'Publish'}
                    </button>
                    <button
                      onClick={() => handleDelete(cert.id)}
                      disabled={isLoading}
                      className="px-3 py-2 rounded-lg text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                      title="Delete"
                      aria-label="Delete certificate"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <CertificateForm
            cert={editCert}
            users={users}
            onSave={handleSave}
            onClose={() => { setShowForm(false); setEditCert(null); }}
          />
        )}
      </AnimatePresence>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewCert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setPreviewCert(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-3xl"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-semibold flex items-center gap-2"><Eye className="w-4 h-4" /> Preview</h3>
                <button onClick={() => setPreviewCert(null)} className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white" aria-label="Close preview">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <CertificatePreview cert={previewCert} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
