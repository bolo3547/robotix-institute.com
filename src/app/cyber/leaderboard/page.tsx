'use client';

import { useState, useEffect } from 'react';
import { Trophy, Medal, Crown, TrendingUp, Star, Flame, Loader2 } from 'lucide-react';
import { getLeaderboard } from '@/lib/cyberService';
import { getRank } from '@/types/cyber';
import type { LeaderboardEntry } from '@/types/cyber';

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'all' | 'week' | 'month'>('all');

  useEffect(() => {
    getLeaderboard()
      .then((data) => setLeaderboard(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-emerald-400 animate-spin" />
        <span className="ml-3 text-sm text-gray-400">Loading leaderboard…</span>
      </div>
    );
  }

  const getRankIcon = (position: number) => {
    if (position === 1) return <Crown className="w-5 h-5 text-yellow-400" />;
    if (position === 2) return <Medal className="w-5 h-5 text-gray-300" />;
    if (position === 3) return <Medal className="w-5 h-5 text-amber-600" />;
    return <span className="text-sm font-mono text-gray-500 w-5 text-center">{position}</span>;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-mono flex items-center gap-3">
            <Trophy className="w-6 h-6 text-yellow-400" /> Leaderboard
          </h1>
          <p className="text-sm text-gray-400 mt-1">Top cybersecurity trainees</p>
        </div>
        <div className="flex gap-1 bg-gray-900/50 border border-gray-800 rounded-lg p-1">
          {(['all', 'month', 'week'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                timeframe === t ? 'bg-emerald-500/10 text-emerald-400' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {t === 'all' ? 'All Time' : t === 'month' ? 'This Month' : 'This Week'}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-3 gap-3">
        {leaderboard.slice(0, 3).map((_entry, i) => {
          const reorder = [leaderboard[1], leaderboard[0], leaderboard[2]];
          const e = reorder[i];
          if (!e) return null;
          const positions = [2, 1, 3];
          const pos = positions[i];
          const isFirst = pos === 1;

          return (
            <div
              key={e.userId}
              className={`flex flex-col items-center p-4 rounded-xl border transition-all ${
                isFirst ? 'bg-yellow-500/5 border-yellow-500/20 md:-mt-4' : 'bg-[#0d1117] border-gray-800/60'
              }`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                isFirst ? 'bg-yellow-500/10 ring-2 ring-yellow-500/30' : 'bg-gray-800/50'
              }`}>
                {getRankIcon(pos)}
              </div>
              <p className="text-sm font-semibold text-white text-center">{e.name}</p>
              <p className="text-xs text-gray-500 font-mono">{getRank(e.level).name}</p>
              <p className="text-lg font-bold text-emerald-400 font-mono mt-1">{e.xp.toLocaleString()}</p>
              <p className="text-[10px] text-gray-500">XP</p>
              <div className="flex items-center gap-2 mt-2 text-[10px] text-gray-500">
                <span className="flex items-center gap-0.5"><Star className="w-3 h-3" /> {e.challengesCompleted}</span>
                <span className="flex items-center gap-0.5"><Flame className="w-3 h-3" /> Lvl {e.level}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Leaderboard */}
      <div className="bg-[#0d1117] border border-gray-800/60 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-800">
          <div className="grid grid-cols-12 gap-2 text-[10px] text-gray-500 font-mono">
            <span className="col-span-1">#</span>
            <span className="col-span-4">Player</span>
            <span className="col-span-2 text-right">XP</span>
            <span className="col-span-1 text-right">Lvl</span>
            <span className="col-span-2 text-right">Completed</span>
            <span className="col-span-2 text-right">Badges</span>
          </div>
        </div>

        <div className="divide-y divide-gray-800/40">
          {leaderboard.map((entry, i) => {
            const rankName = getRank(entry.level).name;

            return (
              <div
                key={entry.userId}
                className="grid grid-cols-12 gap-2 items-center px-4 py-3 transition-colors hover:bg-gray-800/20"
              >
                <div className="col-span-1 flex items-center">
                  {getRankIcon(i + 1)}
                </div>
                <div className="col-span-4">
                  <p className="text-sm text-gray-200 font-medium">{entry.name}</p>
                  <p className="text-[10px] text-gray-500">{rankName}</p>
                </div>
                <div className="col-span-2 text-right">
                  <p className="text-sm font-bold text-emerald-400 font-mono">{entry.xp.toLocaleString()}</p>
                </div>
                <div className="col-span-1 text-right">
                  <span className="text-xs text-gray-400 font-mono">{entry.level}</span>
                </div>
                <div className="col-span-2 text-right">
                  <span className="text-xs text-gray-400">{entry.challengesCompleted}/12</span>
                  <div className="h-1 bg-gray-800 rounded-full mt-1">
                    <div
                      className="h-full bg-cyan-500 rounded-full"
                      style={{ width: `${(entry.challengesCompleted / 12) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="col-span-2 text-right flex items-center justify-end gap-1">
                  <Star className="w-3 h-3 text-yellow-400" />
                  <span className="text-xs text-gray-400">{entry.badges}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats Footer */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Players', value: leaderboard.length, icon: TrendingUp },
          { label: 'Top XP', value: leaderboard[0]?.xp.toLocaleString() || '0', icon: Trophy },
          { label: 'Avg Completion', value: leaderboard.length > 0 ? `${Math.round((leaderboard.reduce((s, e) => s + e.challengesCompleted, 0) / leaderboard.length / 12) * 100)}%` : '0%', icon: Star },
        ].map((s) => (
          <div key={s.label} className="bg-[#0d1117] border border-gray-800/60 rounded-lg p-3 text-center">
            <s.icon className="w-4 h-4 text-gray-500 mx-auto mb-1" />
            <p className="text-sm font-bold text-white font-mono">{s.value}</p>
            <p className="text-[10px] text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
