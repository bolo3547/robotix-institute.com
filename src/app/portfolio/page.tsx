'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Award, Star, Trophy, Code, Heart, Share2,
  ExternalLink, Calendar, MapPin, Zap, Eye, Download,
  ArrowLeft, FileCode, Loader2
} from 'lucide-react';

/* ── Types ──────────────────────────────────────────────── */
interface PortfolioSummary {
  id: string;
  userId: string;
  avatar: string;
  bio: string;
  location: string;
  totalXp: number;
  level: number;
  daysStreak: number;
  isPublic: boolean;
  user: { id: string; name: string; email: string };
  projectCount: number;
  certCount: number;
}

interface Project {
  id: string;
  userId: string;
  title: string;
  description: string;
  tags: string;
  programName: string;
  mediaEmoji: string;
  sourceCode: string | null;
  likes: number;
  featured: boolean;
  isPublic: boolean;
  createdAt: string;
}

interface Certificate {
  id: string;
  userId: string;
  courseName: string;
  grade: string;
  issueDate: string;
  certNumber: string;
  description: string;
  skills: string;
  instructorName: string;
}

interface PortfolioDetail {
  portfolio: {
    id: string;
    userId: string;
    avatar: string;
    bio: string;
    location: string;
    totalXp: number;
    level: number;
    daysStreak: number;
    user: { id: string; name: string; email: string; createdAt: string };
  };
  projects: Project[];
  certificates: Certificate[];
}

/* ── Helpers ────────────────────────────────────────────── */
function parseTags(tags: string): string[] {
  try { return JSON.parse(tags); } catch { return []; }
}

function parseSkills(skills: string): string[] {
  try { return JSON.parse(skills); } catch { return []; }
}

/* ── Page Component ─────────────────────────────────────── */
export default function PortfolioPage() {
  const [activeView, setActiveView] = useState<'portfolio' | 'explore'>('explore');
  const [portfolios, setPortfolios] = useState<PortfolioSummary[]>([]);
  const [_selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [detail, setDetail] = useState<PortfolioDetail | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);

  // Load all portfolios on mount
  useEffect(() => {
    fetch('/api/portfolio')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setPortfolios(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Load a specific portfolio detail
  const loadDetail = async (userId: string) => {
    setDetailLoading(true);
    setSelectedUserId(userId);
    setActiveView('portfolio');
    try {
      const res = await fetch(`/api/portfolio/${userId}`);
      const data = await res.json();
      if (data.portfolio) setDetail(data);
    } catch (err) {
      console.error('Failed to load portfolio', err);
    }
    setDetailLoading(false);
  };

  // Download source code
  const downloadSource = (projectId: string) => {
    window.open(`/api/portfolio/download/${projectId}`, '_blank');
  };

  // Download certificate
  const downloadCert = (certId: string) => {
    window.open(`/api/portfolio/certificate/${certId}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-accent-500 mx-auto mb-3" />
          <p className="text-gray-500">Loading portfolios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-500/20 text-accent-400 rounded-full text-sm font-medium mb-4">
            <User className="w-4 h-4" /> Student Portfolios
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">Student Showcase</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Explore amazing projects built by our students. Download source code, view certificates, and get inspired!
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-white p-1.5 rounded-xl w-fit mx-auto">
          {[
            { id: 'explore', label: 'Explore All' },
            { id: 'portfolio', label: 'View Portfolio' },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveView(id as typeof activeView)}
              className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${
                activeView === id
                  ? 'bg-accent-500 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ────── Explore All Tab ────── */}
        {activeView === 'explore' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolios.map((p, idx) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white border border-gray-200 rounded-2xl p-6 text-center hover:border-accent-500/30 transition-all cursor-pointer"
              >
                <span className="text-5xl block mb-3">{p.avatar}</span>
                <h3 className="text-gray-900 font-bold text-lg mb-1">{p.user.name}</h3>
                <p className="text-gray-500 text-sm mb-1 flex items-center justify-center gap-1">
                  <MapPin className="w-3 h-3" /> {p.location}
                </p>
                <div className="flex items-center justify-center gap-1 mb-4">
                  <Star className="w-4 h-4 text-accent-400" />
                  <span className="text-accent-400 font-bold text-sm">Level {p.level}</span>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-gray-100 rounded-lg p-2">
                    <p className="text-gray-900 font-bold">{p.projectCount}</p>
                    <p className="text-gray-500 text-xs">Projects</p>
                  </div>
                  <div className="bg-gray-100 rounded-lg p-2">
                    <p className="text-gray-900 font-bold">{p.totalXp.toLocaleString()}</p>
                    <p className="text-gray-500 text-xs">XP</p>
                  </div>
                  <div className="bg-gray-100 rounded-lg p-2">
                    <p className="text-gray-900 font-bold">{p.certCount}</p>
                    <p className="text-gray-500 text-xs">Certs</p>
                  </div>
                </div>
                <button
                  onClick={() => loadDetail(p.userId)}
                  className="w-full py-2.5 bg-accent-500 text-white rounded-lg font-semibold text-sm hover:bg-accent-600 transition-colors flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" /> View Portfolio
                </button>
              </motion.div>
            ))}
          </div>
        )}

        {/* ────── Portfolio Detail Tab ────── */}
        {activeView === 'portfolio' && (
          <>
            {detailLoading && (
              <div className="text-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-accent-500 mx-auto mb-3" />
                <p className="text-gray-500">Loading portfolio...</p>
              </div>
            )}

            {!detailLoading && !detail && (
              <div className="text-center py-20">
                <User className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-gray-900 font-bold text-xl mb-2">Select a Portfolio</h3>
                <p className="text-gray-500 mb-6">Choose a student from the &ldquo;Explore All&rdquo; tab to view their full portfolio.</p>
                <button
                  onClick={() => setActiveView('explore')}
                  className="px-6 py-2.5 bg-accent-500 text-white rounded-lg font-semibold text-sm hover:bg-accent-600 transition-colors"
                >
                  Explore Students
                </button>
              </div>
            )}

            {!detailLoading && detail && (
              <>
                {/* Back button */}
                <button
                  onClick={() => { setActiveView('explore'); setDetail(null); setSelectedUserId(null); }}
                  className="flex items-center gap-2 text-gray-500 hover:text-gray-900 text-sm mb-6 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to all students
                </button>

                {/* Profile Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-r from-accent-50 to-gray-50 border border-gray-200 rounded-2xl p-8 mb-8"
                >
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="text-center">
                      <span className="text-6xl block mb-2">{detail.portfolio.avatar}</span>
                      <div className="flex items-center gap-1 bg-accent-500/20 px-3 py-1 rounded-full">
                        <Star className="w-4 h-4 text-accent-400" />
                        <span className="text-accent-400 text-sm font-bold">Level {detail.portfolio.level}</span>
                      </div>
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <h2 className="text-2xl font-bold text-gray-900 mb-1">{detail.portfolio.user.name}</h2>
                      <p className="text-gray-600 mb-3">{detail.portfolio.bio}</p>
                      <div className="flex flex-wrap gap-3 justify-center md:justify-start text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" /> Joined{' '}
                          {new Date(detail.portfolio.user.createdAt).toLocaleDateString('en-ZM', { month: 'long', year: 'numeric' })}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" /> {detail.portfolio.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Zap className="w-3.5 h-3.5 text-accent-400" /> {detail.portfolio.totalXp.toLocaleString()} XP
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: `${detail.portfolio.user.name} — Robotix Portfolio`,
                            url: window.location.href,
                          });
                        } else {
                          navigator.clipboard.writeText(window.location.href);
                          alert('Portfolio link copied!');
                        }
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-accent-500 text-white rounded-lg font-semibold text-sm hover:bg-accent-600 transition-colors"
                    >
                      <Share2 className="w-4 h-4" /> Share Portfolio
                    </button>
                  </div>

                  {/* Stats Row */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
                    {[
                      { label: 'Projects', value: detail.projects.length, icon: Code },
                      { label: 'Certificates', value: detail.certificates.length, icon: Award },
                      { label: 'Total XP', value: detail.portfolio.totalXp.toLocaleString(), icon: Trophy },
                      { label: 'Day Streak', value: detail.portfolio.daysStreak, icon: Zap },
                    ].map(({ label, value, icon: Icon }) => (
                      <div key={label} className="text-center p-3 bg-gray-100 rounded-xl">
                        <Icon className="w-5 h-5 mx-auto text-accent-400 mb-1" />
                        <p className="text-gray-900 font-bold text-xl">{value}</p>
                        <p className="text-gray-500 text-xs">{label}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Certificates */}
                {detail.certificates.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Award className="w-5 h-5 text-accent-400" /> Certificates ({detail.certificates.length})
                    </h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {detail.certificates.map((cert, idx) => (
                        <motion.div
                          key={cert.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="bg-white border border-gray-200 rounded-xl p-5"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <Award className="w-10 h-10 text-accent-400" />
                            <span className={`inline-block px-3 py-0.5 rounded-full text-xs font-bold ${
                              cert.grade === 'distinction' ? 'bg-yellow-500/20 text-yellow-600' :
                              cert.grade === 'merit' ? 'bg-blue-500/20 text-blue-600' :
                              'bg-green-500/20 text-green-600'
                            }`}>
                              {cert.grade.charAt(0).toUpperCase() + cert.grade.slice(1)}
                            </span>
                          </div>
                          <h4 className="text-gray-900 font-semibold mb-1">{cert.courseName}</h4>
                          <p className="text-gray-500 text-xs mb-2">
                            {new Date(cert.issueDate).toLocaleDateString('en-ZM', { day: 'numeric', month: 'short', year: 'numeric' })}
                            {' · '}{cert.instructorName}
                          </p>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{cert.description}</p>
                          {/* Skills */}
                          <div className="flex flex-wrap gap-1 mb-3">
                            {parseSkills(cert.skills).slice(0, 3).map(skill => (
                              <span key={skill} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                                {skill}
                              </span>
                            ))}
                          </div>
                          <button
                            onClick={() => downloadCert(cert.id)}
                            className="w-full flex items-center justify-center gap-2 py-2 bg-accent-500/10 text-accent-600 rounded-lg text-sm font-medium hover:bg-accent-500/20 transition-colors"
                          >
                            <Download className="w-4 h-4" /> Download Certificate
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Projects */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Code className="w-5 h-5 text-accent-400" /> Projects ({detail.projects.length})
                  </h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {detail.projects.map((project, idx) => (
                      <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.08 }}
                        className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-accent-500/30 transition-all group cursor-pointer"
                        onClick={() => setSelectedProject(project)}
                      >
                        {/* Thumbnail */}
                        <div className="h-32 bg-gradient-to-br from-brand-400/20 to-accent-500/10 flex items-center justify-center relative">
                          <span className="text-5xl">{project.mediaEmoji}</span>
                          {project.featured && (
                            <span className="absolute top-3 left-3 px-2 py-0.5 bg-accent-500 text-white text-xs font-bold rounded-full">
                              ⭐ Featured
                            </span>
                          )}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Eye className="w-8 h-8 text-white" />
                          </div>
                        </div>

                        {/* Details */}
                        <div className="p-4">
                          <h4 className="text-gray-900 font-bold mb-1">{project.title}</h4>
                          <p className="text-gray-600 text-sm line-clamp-2 mb-3">{project.description}</p>
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {parseTags(project.tags).map(tag => (
                              <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                                {tag}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">{project.programName}</span>
                            <span className="flex items-center gap-1 text-gray-600">
                              <Heart className="w-3.5 h-3.5" /> {project.likes}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {/* ────── Project Detail Modal ────── */}
        <AnimatePresence>
          {selectedProject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
              onClick={() => setSelectedProject(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6"
              >
                <div className="text-center mb-4">
                  <span className="text-5xl">{selectedProject.mediaEmoji}</span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">{selectedProject.title}</h2>
                <p className="text-gray-600 text-sm mb-4">{selectedProject.description}</p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {parseTags(selectedProject.tags).map(tag => (
                    <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">{tag}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>{selectedProject.programName}</span>
                  <span>{new Date(selectedProject.createdAt).toLocaleDateString('en-ZM', { month: 'long', year: 'numeric' })}</span>
                </div>

                {/* Source Code Preview */}
                {selectedProject.sourceCode && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-gray-900 font-semibold text-sm flex items-center gap-2">
                        <FileCode className="w-4 h-4" /> Source Code
                      </h4>
                      <button
                        onClick={() => downloadSource(selectedProject.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-accent-500 text-white rounded-lg text-xs font-medium hover:bg-accent-600 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" /> Download
                      </button>
                    </div>
                    <pre className="bg-gray-900 text-green-400 text-xs p-4 rounded-xl overflow-x-auto max-h-64">
                      <code>{selectedProject.sourceCode}</code>
                    </pre>
                  </div>
                )}

                <div className="flex gap-3">
                  <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gray-200 text-gray-800 rounded-lg text-sm hover:bg-gray-300 transition-colors">
                    <Heart className="w-4 h-4" /> Like ({selectedProject.likes})
                  </button>
                  {selectedProject.sourceCode && (
                    <button
                      onClick={() => downloadSource(selectedProject.id)}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-accent-500 text-white rounded-lg font-semibold text-sm hover:bg-accent-600 transition-colors"
                    >
                      <Download className="w-4 h-4" /> Download Code
                    </button>
                  )}
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="w-full mt-3 py-2 text-gray-500 hover:text-gray-900 text-sm transition-colors"
                >
                  Close
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
