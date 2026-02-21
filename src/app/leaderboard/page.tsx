'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Flame, Star, Zap, Crown, Medal, ChevronDown } from 'lucide-react';

interface LeaderboardEntry {
  rank: number;
  childName: string;
  avatar: string;
  xp: number;
  level: number;
  streak: number;
  badges: number;
  program: string;
}

interface Badge {
  id: string;
  name: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  description: string;
}

const rarityColors = {
  common: 'border-gray-400 bg-gray-500/20 text-gray-300',
  rare: 'border-blue-400 bg-blue-500/20 text-blue-300',
  epic: 'border-purple-400 bg-purple-500/20 text-purple-300',
  legendary: 'border-yellow-400 bg-yellow-500/20 text-yellow-300',
};

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <Crown className="w-6 h-6 text-yellow-400" />;
  if (rank === 2) return <Medal className="w-6 h-6 text-gray-300" />;
  if (rank === 3) return <Medal className="w-6 h-6 text-amber-600" />;
  return <span className="text-gray-500 font-bold text-lg">#{rank}</span>;
}

function XPLevelBar({ xp, level }: { xp: number; level: number }) {
  const xpForNextLevel = level * 1000;
  const currentLevelXP = xp % 1000;
  const progress = (currentLevelXP / xpForNextLevel) * 100;

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1 bg-accent-500/20 px-2.5 py-1 rounded-full">
        <Star className="w-3.5 h-3.5 text-accent-400" />
        <span className="text-accent-400 text-xs font-bold">Lv.{level}</span>
      </div>
      <div className="flex-1">
        <div className="h-2 bg-gray-50 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(progress, 100)}%` }}
            transition={{ duration: 1, delay: 0.3 }}
            className="h-full bg-gradient-to-r from-accent-500 to-yellow-400 rounded-full"
          />
        </div>
      </div>
      <span className="text-gray-600 text-xs font-mono">{xp.toLocaleString()} XP</span>
    </div>
  );
}

export default function LeaderboardPage() {
  const [selectedTab, setSelectedTab] = useState<'leaderboard' | 'badges' | 'streaks'>('leaderboard');
  const [showProgram, setShowProgram] = useState('all');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch from /api/leaderboard and /api/badges when endpoints are ready
    setLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-500/20 text-accent-400 rounded-full text-sm font-medium mb-4">
            <Trophy className="w-4 h-4" /> Gamification
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">Leaderboard &amp; Achievements</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Compete, earn XP, unlock badges, and climb the ranks!
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-white p-1.5 rounded-xl w-fit mx-auto">
          {(['leaderboard', 'badges', 'streaks'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${
                selectedTab === tab
                  ? 'bg-accent-500 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {tab === 'leaderboard' && <span className="flex items-center gap-2"><Trophy className="w-4 h-4" /> Rankings</span>}
              {tab === 'badges' && <span className="flex items-center gap-2"><Star className="w-4 h-4" /> Badges</span>}
              {tab === 'streaks' && <span className="flex items-center gap-2"><Flame className="w-4 h-4" /> Streaks</span>}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Leaderboard Tab */}
          {selectedTab === 'leaderboard' && (
            <motion.div key="leaderboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              {loading ? (
                <div className="text-center py-16">
                  <div className="w-8 h-8 border-4 border-accent-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-gray-500">Loading rankings...</p>
                </div>
              ) : leaderboard.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
                  <Trophy className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No rankings yet</h3>
                  <p className="text-gray-500 max-w-sm mx-auto">Rankings will appear here as students earn XP by attending classes, completing assignments, and participating in challenges.</p>
                </div>
              ) : (
                <>
                  {/* Top 3 Podium */}
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    {[leaderboard[1], leaderboard[0], leaderboard[2]].filter(Boolean).map((student, idx) => (
                      <motion.div
                        key={student.rank}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.15 }}
                        className={`text-center p-6 rounded-2xl border ${
                          student.rank === 1
                            ? 'bg-gradient-to-b from-yellow-500/20 to-yellow-50 border-yellow-500/30 order-2 scale-105'
                            : student.rank === 2
                            ? 'bg-gradient-to-b from-gray-400/20 to-gray-50 border-gray-400/30 order-1'
                            : 'bg-gradient-to-b from-amber-700/20 to-amber-50 border-amber-700/30 order-3'
                        }`}
                      >
                        <div className="text-4xl mb-2">{student.avatar}</div>
                        <RankBadge rank={student.rank} />
                        <h3 className="text-gray-900 font-bold mt-2">{student.childName}</h3>
                        <p className="text-accent-400 font-bold text-lg">{student.xp.toLocaleString()} XP</p>
                        <div className="flex items-center justify-center gap-1 mt-1 text-gray-600 text-sm">
                          <Flame className="w-3.5 h-3.5 text-orange-400" />
                          {student.streak} day streak
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Full Leaderboard */}
                  <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                    <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-100 text-gray-500 text-xs font-semibold uppercase tracking-wider">
                      <div className="col-span-1">Rank</div>
                      <div className="col-span-4">Student</div>
                      <div className="col-span-3">XP & Level</div>
                      <div className="col-span-2 text-center">Streak</div>
                      <div className="col-span-2 text-center">Badges</div>
                    </div>
                    {leaderboard.map((student, idx) => (
                      <motion.div
                        key={student.rank}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="grid grid-cols-12 gap-4 px-6 py-4 items-center border-t border-gray-100 hover:bg-gray-100 transition-colors"
                      >
                        <div className="col-span-1"><RankBadge rank={student.rank} /></div>
                        <div className="col-span-4 flex items-center gap-3">
                          <span className="text-2xl">{student.avatar}</span>
                          <span className="text-gray-900 font-medium">{student.childName}</span>
                        </div>
                        <div className="col-span-3">
                          <XPLevelBar xp={student.xp} level={student.level} />
                        </div>
                        <div className="col-span-2 flex items-center justify-center gap-1">
                          <Flame className="w-4 h-4 text-orange-400" />
                          <span className="text-gray-900 font-semibold">{student.streak}</span>
                          <span className="text-gray-500 text-sm">days</span>
                        </div>
                        <div className="col-span-2 flex items-center justify-center gap-1">
                          <Star className="w-4 h-4 text-accent-400" />
                          <span className="text-gray-900 font-semibold">{student.badges}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          )}

          {/* Badges Tab */}
          {selectedTab === 'badges' && (
            <motion.div key="badges" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              {badges.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
                  <Star className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No badges available yet</h3>
                  <p className="text-gray-500 max-w-sm mx-auto">Badges will be available as the gamification system is set up. Check back soon!</p>
                </div>
              ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {badges.map((badge, idx) => (
                  <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.08 }}
                    className={`p-6 rounded-2xl border text-center ${rarityColors[badge.rarity]} hover:scale-105 transition-transform cursor-pointer`}
                  >
                    <span className="text-4xl block mb-3">{badge.icon}</span>
                    <h3 className="font-bold text-gray-900 mb-1">{badge.name}</h3>
                    <p className="text-sm opacity-80 mb-3">{badge.description}</p>
                    <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-semibold uppercase tracking-wider">
                      {badge.rarity}
                    </span>
                  </motion.div>
                ))}
              </div>
              )}
            </motion.div>
          )}

          {/* Streaks Tab */}
          {selectedTab === 'streaks' && (
            <motion.div key="streaks" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="bg-white rounded-2xl border border-gray-200 p-8">
                <div className="text-center mb-8">
                  <Flame className="w-16 h-16 mx-auto text-orange-400 mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Streak Champions</h2>
                  <p className="text-gray-600">Students with the longest consecutive attendance streaks</p>
                </div>

                {leaderboard.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No streak data yet. Streaks will appear as students attend classes consistently.</p>
                  </div>
                ) : (
                <div className="space-y-4">
                  {leaderboard.slice(0, 5).map((student, idx) => (
                    <motion.div
                      key={student.rank}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-center gap-4 p-4 bg-gray-100 rounded-xl"
                    >
                      <span className="text-2xl">{student.avatar}</span>
                      <div className="flex-1">
                        <h3 className="text-gray-900 font-semibold">{student.childName}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 h-2 bg-gray-50 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(student.streak / 50) * 100}%` }}
                              transition={{ duration: 1, delay: 0.3 + idx * 0.1 }}
                              className="h-full bg-gradient-to-r from-orange-500 to-red-400 rounded-full"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <Flame className="w-5 h-5 text-orange-400" />
                          <span className="text-gray-900 font-bold text-xl">{student.streak}</span>
                        </div>
                        <span className="text-gray-500 text-xs">days</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
                )}

                {/* XP Earning Guide */}
                <div className="mt-8 p-6 bg-gray-100 rounded-xl">
                  <h3 className="text-gray-900 font-bold mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-accent-400" /> How to Earn XP
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {[
                      { action: 'Attend a class', xp: '+50 XP', icon: '📚' },
                      { action: 'Complete an assignment', xp: '+100 XP', icon: '✅' },
                      { action: 'Pass a quiz', xp: '+75 XP', icon: '🎯' },
                      { action: 'Maintain 7-day streak', xp: '+200 XP', icon: '🔥' },
                      { action: 'Help a classmate', xp: '+30 XP', icon: '🤝' },
                      { action: 'Win a challenge', xp: '+150 XP', icon: '🏆' },
                    ].map((item) => (
                      <div key={item.action} className="flex items-center justify-between p-3 bg-white rounded-lg">
                        <span className="flex items-center gap-2 text-gray-700 text-sm">
                          <span>{item.icon}</span> {item.action}
                        </span>
                        <span className="text-accent-400 font-bold text-sm">{item.xp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
