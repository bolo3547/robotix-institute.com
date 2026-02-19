'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Shield,
  TrendingUp,
  Trophy,
  Zap,
  Target,
  Clock,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  ArrowUpRight,
  Flame,
  Loader2,
} from 'lucide-react';
import { CHALLENGES, DIFFICULTY_CONFIG } from '@/constants/cyber';
import { getStudentStats, getUserProgress } from '@/lib/cyberService';
import type { StudentStats, ChallengeProgress } from '@/types/cyber';

const ACTIVITY_ICONS: Record<string, typeof CheckCircle2> = {
  challenge_completed: CheckCircle2,
  challenge_started: ArrowUpRight,
  badge_earned: Trophy,
  level_up: Zap,
};
const ACTIVITY_COLORS: Record<string, string> = {
  challenge_completed: 'text-emerald-400',
  challenge_started: 'text-cyan-400',
  badge_earned: 'text-yellow-400',
  level_up: 'text-purple-400',
};

export default function CyberDashboardPage() {
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [progress, setProgress] = useState<ChallengeProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getStudentStats(), getUserProgress()])
      .then(([s, p]) => {
        setStats(s);
        setProgress(p);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-emerald-400 animate-spin" />
        <span className="ml-3 text-sm text-gray-400">Loading dashboard…</span>
      </div>
    );
  }

  const totalXp = stats?.totalXp ?? 0;
  const level = stats?.level ?? 1;
  const rankName = stats?.rank ?? 'Script Kiddie';
  const completed = stats?.challengesCompleted ?? 0;
  const total = stats?.challengesTotal ?? 12;
  const streak = stats?.currentStreak ?? 0;
  const badgeCount = stats?.badges?.length ?? 0;

  const completionPct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const xpInLevel = totalXp % 500;
  const xpNeeded = 500;

  // Build completed IDs from real progress
  const completedIds = new Set(progress.filter((p) => p.status === 'completed').map((p) => p.challengeId));
  const inProgressIds = new Set(progress.filter((p) => p.status === 'in-progress').map((p) => p.challengeId));

  // Next recommended challenges (first incomplete)
  const nextChallenges = CHALLENGES.filter(
    (c) => !completedIds.has(c.id) && !inProgressIds.has(c.id)
  ).slice(0, 3);

  // Recent activity from stats
  const recentActivity = (stats?.recentActivity ?? []).slice(0, 4);
  const userName = (stats as any)?.user?.name || 'Trainee';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white font-mono flex items-center gap-2">
          <span className="text-emerald-400">&gt;</span> Dashboard
        </h1>
        <p className="text-sm text-gray-500 mt-1">Welcome back, {userName}. Your mission continues.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total XP', value: totalXp.toLocaleString(), icon: Zap, accent: 'emerald', sub: `Level ${level}` },
          { label: 'Challenges', value: `${completed}/${total}`, icon: Shield, accent: 'cyan', sub: `${completionPct}% complete` },
          { label: 'Current Streak', value: `${streak} days`, icon: Flame, accent: 'orange', sub: 'Keep it up!' },
          { label: 'Rank', value: rankName, icon: Target, accent: 'purple', sub: `${badgeCount} badges earned` },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-[#0d1117] border border-gray-800/60 rounded-xl p-4 hover:border-gray-700/60 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">{stat.label}</span>
              <stat.icon className={`w-4 h-4 text-${stat.accent}-400`} />
            </div>
            <p className="text-xl font-bold text-white font-mono">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* XP Progress Bar */}
      <div className="bg-[#0d1117] border border-gray-800/60 rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-semibold text-white">Level Progress</h3>
            <p className="text-xs text-gray-500">Level {level} → Level {level + 1}</p>
          </div>
          <span className="text-xs font-mono text-emerald-400">{xpInLevel} / {xpNeeded} XP</span>
        </div>
        <div className="h-2.5 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full transition-all duration-1000"
            style={{ width: `${(xpInLevel / xpNeeded) * 100}%` }}
          />
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Recommended Challenges */}
        <div className="lg:col-span-2 bg-[#0d1117] border border-gray-800/60 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
              Next Challenges
            </h3>
            <Link href="/cyber/challenges" className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1">
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {nextChallenges.map((ch) => {
              const diff = DIFFICULTY_CONFIG[ch.difficulty];
              return (
                <Link
                  key={ch.id}
                  href={`/cyber/challenges/${ch.slug}`}
                  className="flex items-center gap-4 p-3 rounded-lg bg-gray-900/40 border border-gray-800/40 hover:border-emerald-500/30 hover:bg-gray-900/60 transition-all group"
                >
                  <div className={`w-10 h-10 rounded-lg ${diff.bg} ${diff.border} border flex items-center justify-center`}>
                    <Shield className={`w-5 h-5 ${diff.text}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors">{ch.title}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className={`text-[10px] font-mono ${diff.text} ${diff.bg} px-1.5 py-0.5 rounded`}>
                        {diff.label}
                      </span>
                      <span className="text-[10px] text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {ch.estimatedTime}m
                      </span>
                      <span className="text-[10px] text-gray-500 flex items-center gap-1">
                        <Zap className="w-3 h-3" /> {ch.points} pts
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-emerald-400 transition-colors" />
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-[#0d1117] border border-gray-800/60 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.length > 0 ? recentActivity.map((item) => {
              const Icon = ACTIVITY_ICONS[item.type] || ArrowUpRight;
              const color = ACTIVITY_COLORS[item.type] || 'text-gray-400';
              return (
                <div key={item.id} className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <Icon className={`w-4 h-4 ${color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-300">
                      <span className="font-medium">{item.description}</span>
                    </p>
                    <p className="text-[10px] text-gray-600 mt-0.5">{new Date(item.timestamp).toLocaleDateString()}</p>
                  </div>
                </div>
              );
            }) : (
              <p className="text-xs text-gray-600">No recent activity. Start a challenge!</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Threat Intel Banner */}
      <div className="bg-gradient-to-r from-emerald-500/5 to-cyan-500/5 border border-emerald-500/20 rounded-xl p-4 flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
          <Shield className="w-5 h-5 text-emerald-400" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-white">Security Tip of the Day</p>
          <p className="text-xs text-gray-400 mt-0.5">
            Always validate input on both client and server. Client-side validation improves UX, but server-side validation is your real defense.
          </p>
        </div>
      </div>
    </div>
  );
}
