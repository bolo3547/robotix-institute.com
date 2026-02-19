// ============================================================
// Cybersecurity Training Platform — Type Definitions
// ============================================================

// ── Roles & Auth ──────────────────────────────────────────────
export type CyberRole = 'student' | 'teacher' | 'admin';

export interface CyberUser {
  id: string;
  email: string;
  name: string;
  role: CyberRole;
  avatar?: string;
  level: number;
  xp: number;
  rank: string;
  joinedAt: string;
  lastActive: string;
}

export interface LoginAttempt {
  email: string;
  timestamp: number;
  success: boolean;
  ip?: string;
}

// ── Challenges ────────────────────────────────────────────────
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
export type ChallengeStatus = 'locked' | 'available' | 'in-progress' | 'completed';
export type ChallengeCategory =
  | 'password-security'
  | 'encryption'
  | 'awareness'
  | 'networking'
  | 'injection'
  | 'xss'
  | 'hashing'
  | 'validation'
  | 'ctf'
  | 'vulnerability'
  | 'auth-debug'
  | 'rbac';

export interface Challenge {
  id: string;
  title: string;
  slug: string;
  description: string;
  objective: string;
  difficulty: Difficulty;
  category: ChallengeCategory;
  estimatedTime: number; // minutes
  points: number;
  order: number;
  tags: string[];
  prerequisiteIds: string[];
  isActive: boolean;
}

export interface ChallengeProgress {
  challengeId: string;
  userId: string;
  status: ChallengeStatus;
  score: number;
  maxScore: number;
  startedAt?: string;
  completedAt?: string;
  attempts: number;
  flagsFound: number;
  totalFlags: number;
  timeSpent: number; // seconds
}

// ── Progress & Gamification ───────────────────────────────────
export interface StudentStats {
  userId: string;
  totalXp: number;
  level: number;
  rank: string;
  challengesCompleted: number;
  challengesTotal: number;
  currentStreak: number;
  longestStreak: number;
  badges: Badge[];
  recentActivity: ActivityEntry[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt?: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

export interface ActivityEntry {
  id: string;
  type: 'challenge_started' | 'challenge_completed' | 'badge_earned' | 'level_up' | 'login';
  description: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatar?: string;
  xp: number;
  level: number;
  challengesCompleted: number;
  badges: number;
}

// ── Admin ─────────────────────────────────────────────────────
export interface AdminStats {
  totalStudents: number;
  totalTeachers: number;
  totalChallenges: number;
  activeSessions: number;
  averageCompletion: number;
  topChallenge: string;
  recentSignups: number;
}

// ── Lab Environment ───────────────────────────────────────────
export interface LabEnvironment {
  challengeId: string;
  sandboxId: string;
  status: 'loading' | 'ready' | 'running' | 'completed' | 'error';
  startTime: number;
  timeLimit?: number; // seconds
  hints: LabHint[];
  flags: LabFlag[];
}

export interface LabHint {
  id: string;
  order: number;
  text: string;
  cost: number; // XP cost to reveal
  revealed: boolean;
}

export interface LabFlag {
  id: string;
  order: number;
  description: string;
  found: boolean;
  value?: string;
}

// ── Navigation ────────────────────────────────────────────────
export interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: string | number;
  adminOnly?: boolean;
}

// ── XP & Level Calculations ───────────────────────────────────
export const XP_PER_LEVEL = 500;
export const RANKS = [
  { level: 1, name: 'Script Kiddie', color: '#6b7280' },
  { level: 3, name: 'Packet Sniffer', color: '#22c55e' },
  { level: 5, name: 'White Hat Jr', color: '#3b82f6' },
  { level: 8, name: 'Pentester', color: '#a855f7' },
  { level: 12, name: 'Security Analyst', color: '#f59e0b' },
  { level: 16, name: 'Exploit Dev', color: '#ef4444' },
  { level: 20, name: 'Cyber Sentinel', color: '#06b6d4' },
  { level: 25, name: 'Zero-Day Hunter', color: '#ec4899' },
] as const;

export function getLevelFromXp(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

export function getRank(level: number): (typeof RANKS)[number] {
  let rank = RANKS[0];
  for (const r of RANKS) {
    if (level >= r.level) rank = r;
  }
  return rank;
}

export function getXpProgress(xp: number): { current: number; needed: number; percent: number } {
  const inLevel = xp % XP_PER_LEVEL;
  return { current: inLevel, needed: XP_PER_LEVEL, percent: (inLevel / XP_PER_LEVEL) * 100 };
}
