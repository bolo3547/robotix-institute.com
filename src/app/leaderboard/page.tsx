'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Flame, Star, Zap, Crown, Medal, ChevronDown } from 'lucide-react';

const mockLeaderboard = [
  { rank: 1, childName: 'Mwamba Chisanga', avatar: '👦🏾', xp: 12450, level: 15, streak: 42, badges: 18, program: 'All Programs' },
  { rank: 2, childName: 'Natasha Mulenga', avatar: '👧🏾', xp: 11200, level: 14, streak: 38, badges: 15, program: 'All Programs' },
  { rank: 3, childName: 'Chilufya Bwalya', avatar: '👦🏿', xp: 10800, level: 13, streak: 35, badges: 14, program: 'All Programs' },
  { rank: 4, childName: 'Thandiwe Nyirenda', avatar: '👧🏿', xp: 9500, level: 12, streak: 28, badges: 12, program: 'All Programs' },
  { rank: 5, childName: 'Kunda Tembo', avatar: '👦🏾', xp: 8900, level: 11, streak: 25, badges: 11, program: 'All Programs' },
  { rank: 6, childName: 'Mapalo Zulu', avatar: '👧🏾', xp: 8200, level: 10, streak: 22, badges: 10, program: 'All Programs' },
  { rank: 7, childName: 'Bupe Mwale', avatar: '👦🏿', xp: 7600, level: 9, streak: 20, badges: 9, program: 'All Programs' },
  { rank: 8, childName: 'Chanda Kapata', avatar: '👧🏿', xp: 7100, level: 9, streak: 18, badges: 8, program: 'All Programs' },
  { rank: 9, childName: 'Luka Sakala', avatar: '👦🏾', xp: 6500, level: 8, streak: 15, badges: 7, program: 'All Programs' },
  { rank: 10, childName: 'Monde Sichone', avatar: '👧🏾', xp: 6000, level: 7, streak: 12, badges: 6, program: 'All Programs' },
];

const allBadges = [
  { id: '1', name: 'First Steps', icon: '🎯', rarity: 'common' as const, description: 'Complete your first lesson' },
  { id: '2', name: 'Code Warrior', icon: '⚔️', rarity: 'rare' as const, description: 'Complete 10 coding challenges' },
  { id: '3', name: 'Robot Master', icon: '🤖', rarity: 'epic' as const, description: 'Build 5 robot projects' },
  { id: '4', name: 'Streak Legend', icon: '🔥', rarity: 'legendary' as const, description: '30-day attendance streak' },
  { id: '5', name: 'Team Player', icon: '🤝', rarity: 'common' as const, description: 'Collaborate on a group project' },
  { id: '6', name: 'Bug Hunter', icon: '🐛', rarity: 'rare' as const, description: 'Find and fix 20 bugs' },
  { id: '7', name: 'Creative Mind', icon: '💡', rarity: 'epic' as const, description: 'Create an original project' },
  { id: '8', name: 'Zambian Champion', icon: '🇿🇲', rarity: 'legendary' as const, description: 'Top scorer in national competition' },
];

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
              {/* Top 3 Podium */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[mockLeaderboard[1], mockLeaderboard[0], mockLeaderboard[2]].map((student, idx) => (
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

              {/* Program Filter */}
              <div className="flex justify-end mb-4">
                <div className="relative">
                  <select
                    aria-label="Filter by program"
                    value={showProgram}
                    onChange={(e) => setShowProgram(e.target.value)}
                    className="appearance-none px-4 py-2 pr-8 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/50"
                  >
                    <option value="all">All Programs</option>
                    <option value="robotics">Robotics Fundamentals</option>
                    <option value="python">Python for Kids</option>
                    <option value="web">Web Development</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
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
                {mockLeaderboard.map((student, idx) => (
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
            </motion.div>
          )}

          {/* Badges Tab */}
          {selectedTab === 'badges' && (
            <motion.div key="badges" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {allBadges.map((badge, idx) => (
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

                <div className="space-y-4">
                  {mockLeaderboard.slice(0, 5).map((student, idx) => (
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
