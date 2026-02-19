'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Shield,
  Clock,
  Zap,
  Search,
  Filter,
  Lock,
  CheckCircle2,
  PlayCircle,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { CHALLENGES, DIFFICULTY_CONFIG, CATEGORY_LABELS } from '@/constants/cyber';
import { getUserProgress } from '@/lib/cyberService';
import type { Difficulty, ChallengeProgress } from '@/types/cyber';

export default function ChallengesPage() {
  const [search, setSearch] = useState('');
  const [filterDiff, setFilterDiff] = useState<Difficulty | 'all'>('all');
  const [progress, setProgress] = useState<ChallengeProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserProgress()
      .then((p) => setProgress(p))
      .finally(() => setLoading(false));
  }, []);

  // Build completion status from real progress
  const completedIds = new Set(progress.filter((p) => p.status === 'completed').map((p) => p.challengeId));
  const inProgressIds = new Set(progress.filter((p) => p.status === 'in-progress').map((p) => p.challengeId));

  const filtered = CHALLENGES.filter((ch) => {
    if (filterDiff !== 'all' && ch.difficulty !== filterDiff) return false;
    if (search && !ch.title.toLowerCase().includes(search.toLowerCase()) && !ch.tags.some((t) => t.includes(search.toLowerCase()))) return false;
    return true;
  });

  const groups: { label: string; difficulty: Difficulty; challenges: typeof CHALLENGES }[] = [
    { label: '🟢 Beginner', difficulty: 'beginner', challenges: filtered.filter((c) => c.difficulty === 'beginner') },
    { label: '🟡 Intermediate', difficulty: 'intermediate', challenges: filtered.filter((c) => c.difficulty === 'intermediate') },
    { label: '🔴 Advanced', difficulty: 'advanced', challenges: filtered.filter((c) => c.difficulty === 'advanced') },
  ].filter((g) => g.challenges.length > 0);

  function getStatus(id: string) {
    if (completedIds.has(id)) return 'completed';
    if (inProgressIds.has(id)) return 'in-progress';
    return 'available';
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white font-mono flex items-center gap-2">
          <span className="text-emerald-400">&gt;</span> Challenges
        </h1>
        <p className="text-sm text-gray-500 mt-1">{CHALLENGES.length} challenges across 3 difficulty levels</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search challenges..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#0d1117] border border-gray-800 rounded-lg text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          {(['all', 'beginner', 'intermediate', 'advanced'] as const).map((diff) => (
            <button
              key={diff}
              onClick={() => setFilterDiff(diff)}
              className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                filterDiff === diff
                  ? diff === 'all'
                    ? 'bg-gray-700/50 border-gray-600 text-white'
                    : `${DIFFICULTY_CONFIG[diff].bg} ${DIFFICULTY_CONFIG[diff].border} ${DIFFICULTY_CONFIG[diff].text}`
                  : 'bg-transparent border-gray-800 text-gray-500 hover:text-gray-300 hover:border-gray-700'
              }`}
            >
              {diff === 'all' ? 'All' : DIFFICULTY_CONFIG[diff].label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Bar */}
      <div className="flex items-center gap-6 px-4 py-3 bg-[#0d1117] border border-gray-800/60 rounded-lg">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="text-xs text-gray-400"><span className="text-white font-medium">{completedIds.size}</span> completed</span>
        </div>
        <div className="flex items-center gap-2">
          <PlayCircle className="w-4 h-4 text-cyan-400" />
          <span className="text-xs text-gray-400"><span className="text-white font-medium">{inProgressIds.size}</span> in progress</span>
        </div>
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-gray-600" />
          <span className="text-xs text-gray-400"><span className="text-white font-medium">{CHALLENGES.length - completedIds.size - inProgressIds.size}</span> remaining</span>
        </div>
      </div>

      {/* Challenge Groups */}
      {groups.map((group) => (
        <div key={group.difficulty}>
          <h2 className="text-lg font-bold text-white mb-3 font-mono">{group.label}</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {group.challenges.map((ch) => {
              const status = getStatus(ch.id);
              const diff = DIFFICULTY_CONFIG[ch.difficulty];

              return (
                <Link
                  key={ch.id}
                  href={`/cyber/challenges/${ch.slug}`}
                  className={`group relative bg-[#0d1117] border rounded-xl p-4 transition-all hover:shadow-lg hover:shadow-emerald-500/5 ${
                    status === 'completed'
                      ? 'border-emerald-500/20 hover:border-emerald-500/40'
                      : status === 'in-progress'
                      ? 'border-cyan-500/20 hover:border-cyan-500/40'
                      : 'border-gray-800/60 hover:border-gray-700/60'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg ${diff.bg} ${diff.border} border flex items-center justify-center shrink-0`}>
                      {status === 'completed' ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Shield className={`w-5 h-5 ${diff.text}`} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-gray-200 group-hover:text-white transition-colors truncate">{ch.title}</h3>
                        {status === 'completed' && (
                          <span className="shrink-0 text-[10px] font-mono bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded">DONE</span>
                        )}
                        {status === 'in-progress' && (
                          <span className="shrink-0 text-[10px] font-mono bg-cyan-500/10 text-cyan-400 px-1.5 py-0.5 rounded">IN PROGRESS</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-2 mb-2">{ch.description}</p>
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className={`text-[10px] font-mono ${diff.text} ${diff.bg} px-1.5 py-0.5 rounded border ${diff.border}`}>
                          {diff.label}
                        </span>
                        <span className="text-[10px] text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {ch.estimatedTime}m
                        </span>
                        <span className="text-[10px] text-gray-500 flex items-center gap-1">
                          <Zap className="w-3 h-3" /> {ch.points} pts
                        </span>
                        <span className="text-[10px] text-gray-600">
                          {CATEGORY_LABELS[ch.category]}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-700 group-hover:text-emerald-400 transition-colors mt-1 shrink-0" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
