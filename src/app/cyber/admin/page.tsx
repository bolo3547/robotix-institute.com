'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Users, BarChart3, Settings, Trophy, Target, TrendingUp, Search, ChevronDown, Loader2, Star } from 'lucide-react';
import { getAdminData, type AdminData } from '@/lib/cyberService';
import { getRank } from '@/types/cyber';

export default function AdminPage() {
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'overview' | 'students' | 'challenges'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);

  useEffect(() => {
    getAdminData()
      .then((d) => setData(d))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-emerald-400 animate-spin" />
        <span className="ml-3 text-sm text-gray-400">Loading admin panel…</span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-20">
        <Shield className="w-12 h-12 text-gray-700 mx-auto mb-4" />
        <p className="text-gray-500 text-sm">Failed to load admin data. You may not have admin access.</p>
      </div>
    );
  }

  const { stats, students, challengeStats } = data;

  const filteredStudents = students.filter((s) =>
    s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-mono flex items-center gap-3">
            <Settings className="w-6 h-6 text-red-400" /> Admin Panel
          </h1>
          <p className="text-sm text-gray-400 mt-1">Manage students and monitor progress</p>
        </div>
        <span className="text-[10px] bg-red-500/10 text-red-400 px-3 py-1 rounded-full border border-red-500/20 font-mono">ADMIN ACCESS</span>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-900/50 border border-gray-800 rounded-lg p-1">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'students', label: 'Students', icon: Users },
          { id: 'challenges', label: 'Challenges', icon: Target },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as typeof tab)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded text-xs font-medium transition-all flex-1 justify-center ${
              tab === t.id ? 'bg-emerald-500/10 text-emerald-400' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <t.icon className="w-3.5 h-3.5" /> {t.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {tab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Total Students', value: stats.totalStudents, icon: Users, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
              { label: 'Avg Completion', value: `${stats.averageCompletion}%`, icon: Target, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
              { label: 'Active Today', value: stats.activeSessions, icon: TrendingUp, color: 'text-purple-400', bg: 'bg-purple-500/10' },
              { label: 'Total Challenges', value: stats.totalChallenges, icon: Shield, color: 'text-orange-400', bg: 'bg-orange-500/10' },
            ].map((s) => (
              <div key={s.label} className="bg-[#0d1117] border border-gray-800/60 rounded-lg p-4">
                <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center mb-2`}>
                  <s.icon className={`w-4 h-4 ${s.color}`} />
                </div>
                <p className="text-xl font-bold text-white font-mono">{s.value}</p>
                <p className="text-[10px] text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Difficulty Distribution */}
          <div className="bg-[#0d1117] border border-gray-800/60 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-gray-300 font-mono mb-4">Challenge Distribution</h3>
            <div className="space-y-3">
              {[
                { label: 'Beginner', count: challengeStats.filter((c) => c.difficulty === 'beginner').length, color: 'bg-emerald-500', pct: 33 },
                { label: 'Intermediate', count: challengeStats.filter((c) => c.difficulty === 'intermediate').length, color: 'bg-yellow-500', pct: 33 },
                { label: 'Advanced', count: challengeStats.filter((c) => c.difficulty === 'advanced').length, color: 'bg-red-500', pct: 34 },
              ].map((d) => (
                <div key={d.label} className="flex items-center gap-3">
                  <span className="text-xs text-gray-400 w-24">{d.label}</span>
                  <div className="flex-1 h-6 bg-gray-800 rounded-full overflow-hidden">
                    <div className={`h-full ${d.color} rounded-full flex items-center px-2`} style={{ width: `${d.pct}%` }}>
                      <span className="text-[10px] text-white font-medium">{d.count}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Performers */}
          <div className="bg-[#0d1117] border border-gray-800/60 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-gray-300 font-mono mb-4 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-400" /> Top Performers
            </h3>
            <div className="space-y-2">
              {students.slice(0, 5).map((student, i) => (
                <div key={student.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-800/20">
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      i === 0 ? 'bg-yellow-500/20 text-yellow-400' : i === 1 ? 'bg-gray-500/20 text-gray-300' : i === 2 ? 'bg-amber-500/20 text-amber-400' : 'bg-gray-800 text-gray-500'
                    }`}>
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-xs text-gray-200">{student.name}</p>
                      <p className="text-[10px] text-gray-500">{getRank(student.level).name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-emerald-400 font-mono">{student.xp} XP</p>
                    <p className="text-[10px] text-gray-500">{student.challengesCompleted}/12 done</p>
                  </div>
                </div>
              ))}
              {students.length === 0 && (
                <p className="text-xs text-gray-600 text-center py-2">No students yet</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Students Tab */}
      {tab === 'students' && (
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search students…"
              className="w-full pl-10 pr-4 py-2.5 bg-[#0d1117] border border-gray-800 rounded-lg text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          <div className="space-y-2">
            {filteredStudents.map((student) => {
              const isExpanded = expandedStudent === student.id;

              return (
                <div key={student.id} className="bg-[#0d1117] border border-gray-800/60 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setExpandedStudent(isExpanded ? null : student.id)}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-800/20 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-xs text-gray-300 font-mono">
                        {student.name?.charAt(0) || '?'}
                      </div>
                      <div className="text-left">
                        <p className="text-sm text-gray-200 font-medium">{student.name}</p>
                        <p className="text-[10px] text-gray-500">{student.email} • {student.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-xs font-bold text-emerald-400 font-mono">{student.xp} XP</p>
                        <p className="text-[10px] text-gray-500">Lvl {student.level} • {student.challengesCompleted}/12</p>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="border-t border-gray-800 p-4 bg-gray-900/20">
                      <div className="grid grid-cols-3 gap-3 mb-3">
                        <div className="text-center">
                          <p className="text-xs font-bold text-white font-mono">{student.progress.filter((p) => p.status === 'completed').length}</p>
                          <p className="text-[10px] text-gray-500">Completed</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs font-bold text-white font-mono">{student.progress.filter((p) => p.status !== 'completed').length}</p>
                          <p className="text-[10px] text-gray-500">In Progress</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs font-bold text-white font-mono">{12 - student.progress.length}</p>
                          <p className="text-[10px] text-gray-500">Not Started</p>
                        </div>
                      </div>

                      {student.progress.length > 0 ? (
                        <div className="space-y-1">
                          {student.progress.map((p) => (
                            <div key={p.challengeId} className="flex items-center justify-between py-1.5 text-[11px]">
                              <span className="text-gray-400">{p.challengeTitle}</span>
                              <div className="flex items-center gap-2">
                                <span className={`px-1.5 py-0.5 rounded text-[9px] ${
                                  p.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-cyan-500/10 text-cyan-400'
                                }`}>
                                  {p.status === 'completed' ? `${p.score}%` : 'IN PROGRESS'}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-600 text-center py-2">No progress yet</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
            {filteredStudents.length === 0 && (
              <p className="text-center text-xs text-gray-600 py-8">No students found</p>
            )}
          </div>
        </div>
      )}

      {/* Challenges Tab */}
      {tab === 'challenges' && (
        <div className="space-y-3">
          {challengeStats.map((ch) => (
            <div key={ch.id} className="bg-[#0d1117] border border-gray-800/60 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-medium text-gray-200">{ch.title}</h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded border font-mono ${
                      ch.difficulty === 'beginner' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      ch.difficulty === 'intermediate' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                      'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}>
                      {ch.difficulty}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-500">{ch.points} XP</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-white font-mono">{ch.completionRate}%</p>
                  <p className="text-[10px] text-gray-500">{ch.completions} completed • {ch.totalAttempts - ch.completions} attempting</p>
                </div>
              </div>
              <div className="mt-2 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full" style={{ width: `${ch.completionRate}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
