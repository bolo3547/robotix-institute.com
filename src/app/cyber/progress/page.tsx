'use client';

import { useState, useEffect } from 'react';
import { Target, Flame, Star, Award, TrendingUp, Clock, ChevronRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { getStudentStats, getUserProgress, getAllChallenges } from '@/lib/cyberService';
import { XP_PER_LEVEL } from '@/types/cyber';
import type { StudentStats, ChallengeProgress, Challenge } from '@/types/cyber';

export default function ProgressPage() {
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [progress, setProgress] = useState<ChallengeProgress[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getStudentStats(), getUserProgress(), getAllChallenges()])
      .then(([s, p, c]) => {
        setStats(s);
        setProgress(p);
        setChallenges(c);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-emerald-400 animate-spin" />
        <span className="ml-3 text-sm text-gray-400">Loading progress…</span>
      </div>
    );
  }

  const totalXp = stats?.totalXp ?? 0;
  const level = stats?.level ?? 1;
  const rank = stats?.rank ?? 'Script Kiddie';
  const xpInLevel = totalXp % XP_PER_LEVEL;
  const xpProgress = xpInLevel / XP_PER_LEVEL;

  const completed = progress.filter((p) => p.status === 'completed');
  const inProgress = progress.filter((p) => p.status === 'in-progress');
  const notStarted = challenges.filter((c) => !progress.find((p) => p.challengeId === c.id));

  const completionRate = challenges.length > 0 ? Math.round((completed.length / challenges.length) * 100) : 0;
  const avgScore = completed.length > 0 ? Math.round(completed.reduce((s, p) => s + p.score, 0) / completed.length) : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white font-mono">Progress Tracker</h1>
        <p className="text-sm text-gray-400 mt-1">Your cybersecurity training journey</p>
      </div>

      {/* Rank & Level Card */}
      <div className="bg-gradient-to-br from-[#0d1117] to-[#111827] border border-gray-800/60 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center">
              <span className="text-2xl font-bold text-emerald-400 font-mono">{level}</span>
            </div>
            <div>
              <p className="text-lg font-bold text-white">{rank}</p>
              <p className="text-xs text-gray-500">Level {level} • {totalXp.toLocaleString()} XP total</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-emerald-400 font-mono">{completionRate}%</p>
            <p className="text-[10px] text-gray-500">Completion Rate</p>
          </div>
        </div>

        {/* XP Progress */}
        <div>
          <div className="flex justify-between text-[10px] text-gray-500 mb-1">
            <span>Level {level} → Level {level + 1}</span>
            <span>{xpInLevel} / {XP_PER_LEVEL} XP</span>
          </div>
          <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full transition-all duration-500"
              style={{ width: `${xpProgress * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Completed', value: completed.length, icon: Target, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'In Progress', value: inProgress.length, icon: Clock, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
          { label: 'Avg Score', value: `${avgScore}%`, icon: TrendingUp, color: 'text-purple-400', bg: 'bg-purple-500/10' },
          { label: 'Day Streak', value: stats?.currentStreak ?? 0, icon: Flame, color: 'text-orange-400', bg: 'bg-orange-500/10' },
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

      {/* Badges */}
      <div>
        <h2 className="text-sm font-semibold text-gray-300 font-mono mb-3 flex items-center gap-2">
          <Award className="w-4 h-4 text-yellow-400" /> Badges Earned ({stats?.badges?.length ?? 0})
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {(stats?.badges ?? []).map((badge) => (
            <div key={badge.id} className="bg-[#0d1117] border border-gray-800/60 rounded-lg p-3 text-center">
              <span className="text-2xl">{badge.icon}</span>
              <p className="text-xs text-gray-200 mt-1 font-medium">{badge.name}</p>
              <p className="text-[10px] text-gray-500">{badge.rarity}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Challenge Breakdown */}
      <div className="space-y-4">
        {/* Completed */}
        {completed.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-emerald-400 font-mono mb-2 flex items-center gap-1">
              <Star className="w-3 h-3" /> Completed ({completed.length})
            </h3>
            <div className="space-y-1">
              {completed.map((p) => {
                const ch = challenges.find((c) => c.id === p.challengeId);
                if (!ch) return null;
                return (
                  <Link
                    key={p.challengeId}
                    href={`/cyber/challenges/${ch.slug}`}
                    className="flex items-center justify-between p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-lg hover:border-emerald-500/30 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-400" />
                      <div>
                        <p className="text-xs text-gray-200 group-hover:text-white">{ch.title}</p>
                        <p className="text-[10px] text-gray-500">{ch.difficulty} • {p.score}% • {ch.points} XP</p>
                      </div>
                    </div>
                    <ChevronRight className="w-3 h-3 text-gray-600 group-hover:text-gray-400" />
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* In Progress */}
        {inProgress.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-cyan-400 font-mono mb-2">In Progress ({inProgress.length})</h3>
            <div className="space-y-1">
              {inProgress.map((p) => {
                const ch = challenges.find((c) => c.id === p.challengeId);
                if (!ch) return null;
                return (
                  <Link
                    key={p.challengeId}
                    href={`/cyber/challenges/${ch.slug}`}
                    className="flex items-center justify-between p-3 bg-cyan-500/5 border border-cyan-500/10 rounded-lg hover:border-cyan-500/30 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                      <div>
                        <p className="text-xs text-gray-200 group-hover:text-white">{ch.title}</p>
                        <p className="text-[10px] text-gray-500">{ch.difficulty} • Started</p>
                      </div>
                    </div>
                    <ChevronRight className="w-3 h-3 text-gray-600 group-hover:text-gray-400" />
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Not Started */}
        {notStarted.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-gray-500 font-mono mb-2">Not Started ({notStarted.length})</h3>
            <div className="space-y-1">
              {notStarted.map((ch) => (
                <Link
                  key={ch.id}
                  href={`/cyber/challenges/${ch.slug}`}
                  className="flex items-center justify-between p-3 bg-gray-900/30 border border-gray-800/40 rounded-lg hover:border-gray-700 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-gray-700" />
                    <div>
                      <p className="text-xs text-gray-400 group-hover:text-gray-200">{ch.title}</p>
                      <p className="text-[10px] text-gray-600">{ch.difficulty} • {ch.points} XP</p>
                    </div>
                  </div>
                  <ChevronRight className="w-3 h-3 text-gray-700 group-hover:text-gray-500" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Activity Timeline */}
      <div>
        <h2 className="text-sm font-semibold text-gray-300 font-mono mb-3">Recent Activity</h2>
        <div className="space-y-0 border-l-2 border-gray-800 ml-2 pl-4">
          {(stats?.recentActivity ?? []).map((activity, i) => (
            <div key={activity.id || i} className="relative pb-4">
              <div className="absolute -left-[22px] top-1 w-3 h-3 rounded-full bg-[#0d1117] border-2 border-emerald-500/40" />
              <p className="text-xs text-gray-300">{activity.description}</p>
              <p className="text-[10px] text-gray-600">{new Date(activity.timestamp).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
