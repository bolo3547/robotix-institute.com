'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft, Search, Filter, CheckCircle2, XCircle, Clock, Eye, Send,
  ChevronDown, ChevronUp, User, Phone, MapPin, Heart, AlertTriangle,
  GraduationCap, Calendar, FileText, Mail, RefreshCw, Loader2, ClipboardList, MessageCircle,
} from 'lucide-react';

const INSTITUTE_WA = '260956355117';

function waLink(phone: string | null | undefined, message: string) {
  const num = (phone || INSTITUTE_WA).replace(/[^0-9]/g, '');
  return `https://wa.me/${num}?text=${encodeURIComponent(message)}`;
}

/* ───── Types ───── */
interface Application {
  id: string;
  parentId: string;
  parentPhone: string | null;
  parentRelation: string | null;
  parentAddress: string | null;
  parentCity: string | null;
  parentAltPhone: string | null;
  studentFirstName: string;
  studentLastName: string;
  studentDOB: string;
  studentGender: string | null;
  studentGrade: string | null;
  previousExperience: string | null;
  learningGoals: string | null;
  program: string;
  preferredSchedule: string | null;
  medicalConditions: string | null;
  allergies: string | null;
  medications: string | null;
  emergencyName: string;
  emergencyPhone: string;
  emergencyRelation: string | null;
  howHeard: string | null;
  specialNeeds: string | null;
  photoConsent: boolean;
  paymentMethod: string | null;
  status: string;
  reviewedBy: string | null;
  reviewedAt: string | null;
  adminNotes: string | null;
  rejectionReason: string | null;
  enrollmentId: string | null;
  acceptanceLetterSentAt: string | null;
  createdAt: string;
  updatedAt: string;
  parent: { id: string; name: string; email: string; phone: string | null };
}

interface Stats {
  total: number;
  pending: number;
  under_review: number;
  accepted: number;
  rejected: number;
  waitlisted: number;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  pending:       { label: 'Pending',       color: 'text-amber-700',   bg: 'bg-amber-50 border-amber-200',     icon: Clock },
  under_review:  { label: 'Under Review',  color: 'text-blue-700',    bg: 'bg-blue-50 border-blue-200',       icon: Eye },
  accepted:      { label: 'Accepted',      color: 'text-green-700',   bg: 'bg-green-50 border-green-200',     icon: CheckCircle2 },
  rejected:      { label: 'Rejected',      color: 'text-red-700',     bg: 'bg-red-50 border-red-200',         icon: XCircle },
  waitlisted:    { label: 'Waitlisted',    color: 'text-purple-700',  bg: 'bg-purple-50 border-purple-200',   icon: Clock },
};

export default function EnrollmentApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<'accept' | 'reject' | 'waitlist' | 'resend_letter' | null>(null);
  const [modalApp, setModalApp] = useState<Application | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [startDate, setStartDate] = useState('');

  /* ─── Fetch ─── */
  const fetchApplications = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterStatus !== 'all') params.set('status', filterStatus);
      if (searchQuery) params.set('search', searchQuery);
      const res = await fetch(`/api/admin/enrollment-applications?${params}`);
      const data = await res.json();
      setApplications(data.applications || []);
      setStats(data.stats || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filterStatus, searchQuery]);

  useEffect(() => { fetchApplications(); }, [fetchApplications]);

  /* ─── Actions ─── */
  const openModal = (action: 'accept' | 'reject' | 'waitlist' | 'resend_letter', app: Application) => {
    setModalAction(action);
    setModalApp(app);
    setAdminNotes('');
    setRejectionReason('');
    setStartDate('');
    setModalOpen(true);
  };

  const executeAction = async () => {
    if (!modalApp || !modalAction) return;
    setActionLoading(modalApp.id);
    try {
      const res = await fetch('/api/admin/enrollment-applications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId: modalApp.id,
          action: modalAction,
          adminNotes: adminNotes || undefined,
          rejectionReason: rejectionReason || undefined,
          startDate: startDate || undefined,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        alert(err.error || 'Action failed');
      } else {
        await fetchApplications();
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong');
    } finally {
      setActionLoading(null);
      setModalOpen(false);
    }
  };

  const markUnderReview = async (appId: string) => {
    setActionLoading(appId);
    try {
      await fetch('/api/admin/enrollment-applications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId: appId, action: 'under_review' }),
      });
      await fetchApplications();
    } catch (err) { console.error(err); }
    finally { setActionLoading(null); }
  };

  /* ─── Render helpers ─── */
  const StatusBadge = ({ status }: { status: string }) => {
    const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
    const Icon = cfg.icon;
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${cfg.bg} ${cfg.color}`}>
        <Icon className="w-3.5 h-3.5" />
        {cfg.label}
      </span>
    );
  };

  const InfoRow = ({ icon: Icon, label, value }: { icon: any; label: string; value: string | null | undefined }) => {
    if (!value) return null;
    return (
      <div className="flex items-start gap-2 text-sm">
        <Icon className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
        <span className="text-gray-500 min-w-[100px]">{label}:</span>
        <span className="text-gray-800 font-medium">{value}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="p-2 hover:bg-gray-100 rounded-lg transition">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Enrollment Applications</h1>
              <p className="text-sm text-gray-500 hidden sm:block">Review, accept or reject student enrollment forms</p>
            </div>
          </div>
          <button onClick={fetchApplications} className="p-2 hover:bg-gray-100 rounded-lg transition" title="Refresh">
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Stats row */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {([
              { key: 'total',        label: 'Total',        val: stats.total,        color: 'bg-gray-100 text-gray-800' },
              { key: 'pending',      label: 'Pending',      val: stats.pending,      color: 'bg-amber-50 text-amber-700' },
              { key: 'under_review', label: 'Reviewing',    val: stats.under_review, color: 'bg-blue-50 text-blue-700' },
              { key: 'accepted',     label: 'Accepted',     val: stats.accepted,     color: 'bg-green-50 text-green-700' },
              { key: 'rejected',     label: 'Rejected',     val: stats.rejected,     color: 'bg-red-50 text-red-700' },
              { key: 'waitlisted',   label: 'Waitlisted',   val: stats.waitlisted,   color: 'bg-purple-50 text-purple-700' },
            ]).map((s) => (
              <button
                key={s.key}
                onClick={() => setFilterStatus(s.key === 'total' ? 'all' : s.key)}
                className={`rounded-xl p-3 text-center border transition hover:shadow-sm ${
                  (s.key === 'total' && filterStatus === 'all') || filterStatus === s.key
                    ? 'ring-2 ring-violet-400 ' + s.color
                    : s.color + ' border-transparent'
                }`}
              >
                <div className="text-2xl font-bold">{s.val}</div>
                <div className="text-xs font-medium mt-0.5">{s.label}</div>
              </button>
            ))}
          </div>
        )}

        {/* Search & Filter bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by student or parent name / email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-violet-400 focus:border-transparent text-sm"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-10 pr-8 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-violet-400 text-sm appearance-none bg-white"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="under_review">Under Review</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
              <option value="waitlisted">Waitlisted</option>
            </select>
          </div>
        </div>

        {/* Application list */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-20">
            <ClipboardList className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">No applications found</p>
            <p className="text-sm text-gray-400 mt-1">Applications will appear here when parents submit enrollment forms</p>
          </div>
        ) : (
          <div className="space-y-3">
            {applications.map((app) => {
              const expanded = expandedId === app.id;
              return (
                <motion.div
                  key={app.id}
                  layout
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-sm transition"
                >
                  {/* Summary row */}
                  <button
                    onClick={() => setExpandedId(expanded ? null : app.id)}
                    className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 sm:p-5 text-left"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {app.studentFirstName[0]}{app.studentLastName[0]}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 truncate">
                          {app.studentFirstName} {app.studentLastName}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {app.program} &middot; Parent: {app.parent.name} ({app.parent.email})
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <StatusBadge status={app.status} />
                      <span className="text-xs text-gray-400">
                        {new Date(app.createdAt).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      {expanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                    </div>
                  </button>

                  {/* Expanded detail */}
                  <AnimatePresence>
                    {expanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-t border-gray-100"
                      >
                        <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {/* Student Info */}
                          <div className="space-y-2">
                            <h4 className="font-semibold text-gray-800 flex items-center gap-2"><GraduationCap className="w-4 h-4 text-violet-500" /> Student</h4>
                            <InfoRow icon={User} label="Name" value={`${app.studentFirstName} ${app.studentLastName}`} />
                            <InfoRow icon={Calendar} label="DOB" value={app.studentDOB} />
                            <InfoRow icon={User} label="Gender" value={app.studentGender} />
                            <InfoRow icon={GraduationCap} label="Grade" value={app.studentGrade} />
                            <InfoRow icon={FileText} label="Experience" value={app.previousExperience} />
                            <InfoRow icon={FileText} label="Goals" value={app.learningGoals} />
                          </div>

                          {/* Parent Info */}
                          <div className="space-y-2">
                            <h4 className="font-semibold text-gray-800 flex items-center gap-2"><User className="w-4 h-4 text-violet-500" /> Parent / Guardian</h4>
                            <InfoRow icon={User} label="Name" value={app.parent.name} />
                            <InfoRow icon={Mail} label="Email" value={app.parent.email} />
                            <InfoRow icon={Phone} label="Phone" value={app.parentPhone} />
                            <InfoRow icon={Phone} label="Alt Phone" value={app.parentAltPhone} />
                            <InfoRow icon={User} label="Relation" value={app.parentRelation} />
                            <InfoRow icon={MapPin} label="Address" value={app.parentAddress} />
                            <InfoRow icon={MapPin} label="City" value={app.parentCity} />
                            {/* WhatsApp parent button */}
                            {app.parentPhone && (
                              <a
                                href={waLink(app.parentPhone, `Hi ${app.parent.name}, this is ROBOTIX Institute regarding ${app.studentFirstName}'s enrollment application for ${app.program}. `)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 rounded-lg bg-green-500 text-white text-xs font-semibold hover:bg-green-600 transition shadow-sm"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                                WhatsApp Parent
                              </a>
                            )}
                          </div>

                          {/* Program & Medical */}
                          <div className="space-y-2">
                            <h4 className="font-semibold text-gray-800 flex items-center gap-2"><GraduationCap className="w-4 h-4 text-violet-500" /> Program</h4>
                            <InfoRow icon={GraduationCap} label="Program" value={app.program} />
                            <InfoRow icon={Calendar} label="Schedule" value={app.preferredSchedule} />
                            <InfoRow icon={FileText} label="Payment" value={app.paymentMethod} />
                            <InfoRow icon={FileText} label="How Heard" value={app.howHeard} />

                            <h4 className="font-semibold text-gray-800 flex items-center gap-2 pt-3"><Heart className="w-4 h-4 text-red-500" /> Medical</h4>
                            <InfoRow icon={Heart} label="Conditions" value={app.medicalConditions} />
                            <InfoRow icon={AlertTriangle} label="Allergies" value={app.allergies} />
                            <InfoRow icon={Heart} label="Medications" value={app.medications} />
                            <InfoRow icon={FileText} label="Special Needs" value={app.specialNeeds} />

                            <h4 className="font-semibold text-gray-800 flex items-center gap-2 pt-3"><Phone className="w-4 h-4 text-orange-500" /> Emergency</h4>
                            <InfoRow icon={User} label="Name" value={app.emergencyName} />
                            <InfoRow icon={Phone} label="Phone" value={app.emergencyPhone} />
                            <InfoRow icon={User} label="Relation" value={app.emergencyRelation} />
                          </div>
                        </div>

                        {/* Admin notes display */}
                        {(app.adminNotes || app.rejectionReason) && (
                          <div className="px-5 pb-4 space-y-2">
                            {app.adminNotes && (
                              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
                                <span className="font-semibold text-blue-700">Admin Notes:</span>{' '}
                                <span className="text-blue-800">{app.adminNotes}</span>
                              </div>
                            )}
                            {app.rejectionReason && (
                              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm">
                                <span className="font-semibold text-red-700">Rejection Reason:</span>{' '}
                                <span className="text-red-800">{app.rejectionReason}</span>
                              </div>
                            )}
                          </div>
                        )}

                        {app.acceptanceLetterSentAt && (
                          <div className="px-5 pb-2">
                            <p className="text-xs text-green-600 flex items-center gap-1">
                              <Mail className="w-3.5 h-3.5" />
                              Acceptance letter sent on {new Date(app.acceptanceLetterSentAt).toLocaleString('en-ZA')}
                            </p>
                          </div>
                        )}

                        {/* Action bar */}
                        <div className="px-5 pb-5 pt-2 flex flex-wrap gap-2">
                          {/* WhatsApp quick action — always visible */}
                          {app.parentPhone && (
                            <a
                              href={waLink(app.parentPhone, `Hi ${app.parent.name}, this is ROBOTIX Institute. We're writing regarding ${app.studentFirstName} ${app.studentLastName}'s enrollment application for ${app.program}. `)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 text-sm font-medium rounded-lg bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition flex items-center gap-1.5"
                            >
                              <MessageCircle className="w-4 h-4" /> WhatsApp
                            </a>
                          )}
                          {app.status === 'pending' && (
                            <>
                              <button
                                onClick={() => markUnderReview(app.id)}
                                disabled={actionLoading === app.id}
                                className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition flex items-center gap-1.5 disabled:opacity-50"
                              >
                                {actionLoading === app.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
                                Mark Under Review
                              </button>
                              <button
                                onClick={() => openModal('accept', app)}
                                className="px-4 py-2 text-sm font-medium rounded-lg bg-green-600 text-white hover:bg-green-700 transition flex items-center gap-1.5"
                              >
                                <CheckCircle2 className="w-4 h-4" /> Accept & Send Letter
                              </button>
                              <button
                                onClick={() => openModal('reject', app)}
                                className="px-4 py-2 text-sm font-medium rounded-lg bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition flex items-center gap-1.5"
                              >
                                <XCircle className="w-4 h-4" /> Reject
                              </button>
                              <button
                                onClick={() => openModal('waitlist', app)}
                                className="px-4 py-2 text-sm font-medium rounded-lg bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 transition flex items-center gap-1.5"
                              >
                                <Clock className="w-4 h-4" /> Waitlist
                              </button>
                            </>
                          )}
                          {app.status === 'under_review' && (
                            <>
                              <button
                                onClick={() => openModal('accept', app)}
                                className="px-4 py-2 text-sm font-medium rounded-lg bg-green-600 text-white hover:bg-green-700 transition flex items-center gap-1.5"
                              >
                                <CheckCircle2 className="w-4 h-4" /> Accept & Send Letter
                              </button>
                              <button
                                onClick={() => openModal('reject', app)}
                                className="px-4 py-2 text-sm font-medium rounded-lg bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition flex items-center gap-1.5"
                              >
                                <XCircle className="w-4 h-4" /> Reject
                              </button>
                              <button
                                onClick={() => openModal('waitlist', app)}
                                className="px-4 py-2 text-sm font-medium rounded-lg bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 transition flex items-center gap-1.5"
                              >
                                <Clock className="w-4 h-4" /> Waitlist
                              </button>
                            </>
                          )}
                          {app.status === 'accepted' && (
                            <button
                              onClick={() => openModal('resend_letter', app)}
                              className="px-4 py-2 text-sm font-medium rounded-lg bg-violet-50 text-violet-700 border border-violet-200 hover:bg-violet-100 transition flex items-center gap-1.5"
                            >
                              <Send className="w-4 h-4" /> Resend Acceptance Letter
                            </button>
                          )}
                          {app.status === 'waitlisted' && (
                            <button
                              onClick={() => openModal('accept', app)}
                              className="px-4 py-2 text-sm font-medium rounded-lg bg-green-600 text-white hover:bg-green-700 transition flex items-center gap-1.5"
                            >
                              <CheckCircle2 className="w-4 h-4" /> Accept from Waitlist
                            </button>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Action modal */}
      <AnimatePresence>
        {modalOpen && modalApp && modalAction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold text-gray-900">
                {modalAction === 'accept' && '✅ Accept Application'}
                {modalAction === 'reject' && '❌ Reject Application'}
                {modalAction === 'waitlist' && '⏳ Waitlist Application'}
                {modalAction === 'resend_letter' && '📧 Resend Acceptance Letter'}
              </h3>
              <p className="text-sm text-gray-500">
                Student: <strong>{modalApp.studentFirstName} {modalApp.studentLastName}</strong> &middot; {modalApp.program}
              </p>

              {/* Accept: optional start date */}
              {modalAction === 'accept' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date (optional)</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-violet-400"
                  />
                </div>
              )}

              {/* Reject: reason */}
              {modalAction === 'reject' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reason for rejection</label>
                  <textarea
                    rows={3}
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="e.g. Class is full, age requirement not met..."
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-violet-400 resize-none"
                  />
                </div>
              )}

              {/* Admin notes (all actions) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {modalAction === 'resend_letter' ? 'Additional message in letter' : 'Admin notes (optional)'}
                </label>
                <textarea
                  rows={3}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder={modalAction === 'accept' ? 'Any message for the parent in the acceptance letter...' : 'Internal notes...'}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-violet-400 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={executeAction}
                  disabled={actionLoading === modalApp.id}
                  className={`px-5 py-2 text-sm font-semibold rounded-lg text-white transition flex items-center gap-2 disabled:opacity-50 ${
                    modalAction === 'accept' || modalAction === 'resend_letter'
                      ? 'bg-green-600 hover:bg-green-700'
                      : modalAction === 'reject'
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-purple-600 hover:bg-purple-700'
                  }`}
                >
                  {actionLoading === modalApp.id && <Loader2 className="w-4 h-4 animate-spin" />}
                  {modalAction === 'accept' && 'Accept & Send Letter'}
                  {modalAction === 'reject' && 'Reject Application'}
                  {modalAction === 'waitlist' && 'Place on Waitlist'}
                  {modalAction === 'resend_letter' && 'Resend Letter'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
