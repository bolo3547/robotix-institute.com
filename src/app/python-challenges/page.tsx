'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Search,
  Trophy,
  Zap,
  Clock,
  ChevronRight,
  CheckCircle2,
  PlayCircle,
  Lock,
  Flame,
  Star,
  Filter,
  Code2,
  Target,
  Lightbulb,
} from 'lucide-react';
import {
  PYTHON_CHALLENGES,
  DIFFICULTY_CONFIG,
  CATEGORY_CONFIG,
  LEVELS,
  type Difficulty,
  type PythonChallenge,
} from '@/constants/pythonChallenges';

/* ─── Local Storage Progress ─── */
interface ChallengeProgress {
  challengeId: string;
  status: 'completed' | 'in-progress';
  xpEarned: number;
  completedAt?: string;
}

function getProgress(): ChallengeProgress[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem('python-challenge-progress') || '[]');
  } catch {
    return [];
  }
}

function getLevel(totalXp: number) {
  if (!LEVELS || LEVELS.length === 0) {
    return { level: 1, title: 'Beginner Coder', xpRequired: 0, xpForNext: 200, progressPct: 0, totalXp };
  }
  let current = LEVELS[0];
  for (const lvl of LEVELS) {
    if (totalXp >= lvl.xpRequired) current = lvl;
    else break;
  }
  const nextLevel = LEVELS.find((l) => l.xpRequired > totalXp);
  const xpForNext = nextLevel ? nextLevel.xpRequired - totalXp : 0;
  const progressPct = nextLevel
    ? ((totalXp - current.xpRequired) / (nextLevel.xpRequired - current.xpRequired)) * 100
    : 100;
  return { ...current, xpForNext, progressPct, totalXp };
}

/* ─── Page Component ─── */
export default function PythonChallengesPage() {
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState('');
  const [filterDiff, setFilterDiff] = useState<Difficulty | 'all'>('all');
  const [filterCat, setFilterCat] = useState<string>('all');
  const [progress, setProgress] = useState<ChallengeProgress[]>([]);

  useEffect(() => {
    setMounted(true);
    setProgress(getProgress());
  }, []);

  const completedIds = useMemo(
    () => new Set(progress.filter((p) => p.status === 'completed').map((p) => p.challengeId)),
    [progress]
  );
  const inProgressIds = useMemo(
    () => new Set(progress.filter((p) => p.status === 'in-progress').map((p) => p.challengeId)),
    [progress]
  );
  const totalXp = useMemo(
    () => progress.reduce((sum, p) => sum + (p.xpEarned || 0), 0),
    [progress]
  );
  const level = getLevel(totalXp);

  /* Filter challenges */
  const filtered = useMemo(() => {
    return PYTHON_CHALLENGES.filter((ch) => {
      if (filterDiff !== 'all' && ch.difficulty !== filterDiff) return false;
      if (filterCat !== 'all' && ch.category !== filterCat) return false;
      if (
        search &&
        !ch.title.toLowerCase().includes(search.toLowerCase()) &&
        !ch.description.toLowerCase().includes(search.toLowerCase()) &&
        !ch.skillsTaught.some((s) => s.toLowerCase().includes(search.toLowerCase()))
      )
        return false;
      return true;
    });
  }, [search, filterDiff, filterCat]);

  /* Group by difficulty */
  const groups: { key: Difficulty; challenges: PythonChallenge[] }[] = (
    ['starter', 'explorer', 'builder', 'master'] as Difficulty[]
  )
    .map((d) => ({
      key: d,
      challenges: filtered.filter((c) => c.difficulty === d),
    }))
    .filter((g) => g.challenges.length > 0);

  function getStatus(id: string) {
    if (completedIds.has(id)) return 'completed';
    if (inProgressIds.has(id)) return 'in-progress';
    return 'available';
  }

  const maxXp = PYTHON_CHALLENGES.reduce((s, c) => s + c.xp, 0);

  /* SSR-safe: show skeleton until mounted */
  if (!mounted) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <section className="pt-28 pb-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">🐍</span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900">
                Python Challenge Arena
              </h1>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mb-6">
              Solve 30 real-world Python challenges. Earn XP, level up, and build the skills that
              power the world&apos;s best software.
            </p>
            <div className="animate-pulse space-y-4 mt-8">
              <div className="h-20 bg-gray-200 rounded-2xl" />
              <div className="h-12 bg-gray-200 rounded-2xl" />
              <div className="grid gap-4 md:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-32 bg-gray-200 rounded-xl" />
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden pt-28 pb-16 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 via-orange-400/10 to-red-400/5" />
        <div className="absolute top-10 right-10 text-8xl opacity-10 select-none">🐍</div>
        <div className="max-w-6xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">🐍</span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900">
                Python Challenge Arena
              </h1>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mb-6">
              Solve 30 real-world Python challenges. Earn XP, level up, and build the skills that
              power the world&apos;s best software.
            </p>

            {/* Level / XP Card */}
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              <div className="bg-white border border-orange-200 rounded-2xl p-5 shadow-sm flex-1 max-w-md">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-orange-500" />
                    <span className="font-bold text-gray-900">
                      Level {level.level} — {level.title}
                    </span>
                  </div>
                  <span className="text-sm font-mono text-orange-600">{totalXp} XP</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(level.progressPct, 100)}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
                {level.xpForNext > 0 && (
                  <p className="text-xs text-gray-500 mt-1">{level.xpForNext} XP to next level</p>
                )}
              </div>

              {/* Quick Stats */}
              <div className="flex gap-4">
                <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <div>
                    <p className="text-lg font-bold text-green-700">{completedIds.size}</p>
                    <p className="text-xs text-green-600">Solved</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
                  <Flame className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="text-lg font-bold text-blue-700">{totalXp}/{maxXp}</p>
                    <p className="text-xs text-blue-600">Total XP</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Filters ── */}
      <section className="px-4 pb-4 -mt-2">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm space-y-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search challenges, skills, topics..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
              />
            </div>

            {/* Difficulty Filter */}
            <div className="flex flex-wrap items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-500 mr-1">Level:</span>
              {(['all', 'starter', 'explorer', 'builder', 'master'] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setFilterDiff(d)}
                  aria-label={`Filter by ${d === 'all' ? 'all levels' : d}`}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    filterDiff === d
                      ? d === 'all'
                        ? 'bg-gray-900 border-gray-900 text-white'
                        : `${DIFFICULTY_CONFIG[d].bg} ${DIFFICULTY_CONFIG[d].border} ${DIFFICULTY_CONFIG[d].color} border`
                      : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  {d === 'all' ? 'All' : `${DIFFICULTY_CONFIG[d].emoji} ${DIFFICULTY_CONFIG[d].label}`}
                </button>
              ))}
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap items-center gap-2">
              <Code2 className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-500 mr-1">Topic:</span>
              <button
                onClick={() => setFilterCat('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  filterCat === 'all'
                    ? 'bg-gray-900 border-gray-900 text-white'
                    : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                All
              </button>
              {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => (
                <button
                  key={key}
                  onClick={() => setFilterCat(key)}
                  aria-label={`Filter by ${cfg.label}`}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    filterCat === key
                      ? `bg-gray-900 border-gray-900 text-white`
                      : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  {cfg.emoji} {cfg.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Challenge Groups ── */}
      <section className="px-4 pb-20">
        <div className="max-w-6xl mx-auto space-y-10">
          {groups.length === 0 && (
            <div className="text-center py-16">
              <Target className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No challenges match your filters</p>
              <button
                onClick={() => {
                  setSearch('');
                  setFilterDiff('all');
                  setFilterCat('all');
                }}
                className="mt-3 text-orange-600 text-sm font-medium hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}

          {groups.map((group, gi) => {
            const diff = DIFFICULTY_CONFIG[group.key];
            const groupCompleted = group.challenges.filter((c) => completedIds.has(c.id)).length;

            return (
              <motion.div
                key={group.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: gi * 0.1 }}
              >
                {/* Group Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{diff.emoji}</span>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{diff.label}</h2>
                      <p className="text-sm text-gray-500">{diff.description}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-semibold ${diff.color}`}>
                    {groupCompleted}/{group.challenges.length} solved
                  </span>
                </div>

                {/* Challenge Grid */}
                <div className="grid gap-4 md:grid-cols-2">
                  {group.challenges.map((ch, ci) => {
                    const status = getStatus(ch.id);
                    const catCfg = CATEGORY_CONFIG[ch.category];

                    return (
                      <motion.div
                        key={ch.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: gi * 0.1 + ci * 0.03 }}
                      >
                        <Link
                          href={`/python-challenges/${ch.id}`}
                          className={`group block bg-white border rounded-xl p-5 transition-all hover:shadow-md hover:-translate-y-0.5 ${
                            status === 'completed'
                              ? 'border-green-200 bg-green-50/30'
                              : status === 'in-progress'
                              ? 'border-blue-200 bg-blue-50/20'
                              : 'border-gray-200 hover:border-orange-300'
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            {/* Status Icon */}
                            <div
                              className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                                status === 'completed'
                                  ? 'bg-green-100'
                                  : status === 'in-progress'
                                  ? 'bg-blue-100'
                                  : `${diff.bg}`
                              }`}
                            >
                              {status === 'completed' ? (
                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                              ) : status === 'in-progress' ? (
                                <PlayCircle className="w-5 h-5 text-blue-600" />
                              ) : (
                                <Code2 className={`w-5 h-5 ${diff.color}`} />
                              )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors truncate">
                                  {ch.title}
                                </h3>
                                {status === 'completed' && (
                                  <span className="shrink-0 text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                    SOLVED
                                  </span>
                                )}
                                {status === 'in-progress' && (
                                  <span className="shrink-0 text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                    STARTED
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                                {ch.description}
                              </p>
                              <div className="flex items-center gap-3 flex-wrap">
                                <span
                                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${diff.bg} ${diff.color} border ${diff.border}`}
                                >
                                  {diff.label}
                                </span>
                                <span className="text-[11px] text-gray-500">
                                  {catCfg?.emoji} {catCfg?.label}
                                </span>
                                <span className="text-[11px] text-gray-400 flex items-center gap-1">
                                  <Star className="w-3 h-3" /> {ch.xp} XP
                                </span>
                                <span className="text-[11px] text-gray-400 flex items-center gap-1">
                                  <Lightbulb className="w-3 h-3" /> {ch.hints.length} hints
                                </span>
                              </div>
                            </div>

                            {/* Arrow */}
                            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-orange-500 transition-colors mt-2 shrink-0" />
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
