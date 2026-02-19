// ============================================================
// Cybersecurity Training Platform — Data Service
// Fetches real data from /api/cyber/* endpoints (Prisma-backed)
// ============================================================
import { CHALLENGES } from '@/constants/cyber';
import type {
  StudentStats,
  LeaderboardEntry,
  AdminStats,
  ChallengeProgress,
  Challenge,
} from '@/types/cyber';

const API_BASE = '/api/cyber';

// ── Challenges (from DB via API) ──────────────────────────────

export async function getAllChallenges(): Promise<Challenge[]> {
  try {
    const res = await fetch(`${API_BASE}/challenges`);
    if (!res.ok) throw new Error('Failed to fetch challenges');
    return res.json();
  } catch {
    // Fallback to static constants if API fails
    return CHALLENGES.filter((c) => c.isActive);
  }
}

export async function getChallengeBySlug(slug: string): Promise<Challenge | null> {
  try {
    const res = await fetch(`${API_BASE}/challenges/${slug}`);
    if (!res.ok) return CHALLENGES.find((c) => c.slug === slug) || null;
    return res.json();
  } catch {
    return CHALLENGES.find((c) => c.slug === slug) || null;
  }
}

export function getChallengeById(id: string): Challenge | null {
  return CHALLENGES.find((c) => c.id === id) || null;
}

// ── User Profile ──────────────────────────────────────────────

export async function getCurrentUser() {
  try {
    const res = await fetch(`${API_BASE}/profile`);
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

// ── Progress ──────────────────────────────────────────────────

export async function getUserProgress(userId?: string): Promise<ChallengeProgress[]> {
  try {
    const url = userId ? `${API_BASE}/progress?userId=${userId}` : `${API_BASE}/progress`;
    const res = await fetch(url);
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function submitProgress(data: {
  challengeId: string;
  status: string;
  score?: number;
  maxScore?: number;
  flagsFound?: number;
  totalFlags?: number;
  timeSpent?: number;
}) {
  try {
    const res = await fetch(`${API_BASE}/progress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to submit progress');
    return res.json();
  } catch (err) {
    console.error('Failed to submit progress:', err);
    return null;
  }
}

// ── Stats ─────────────────────────────────────────────────────

export async function getStudentStats(userId?: string): Promise<StudentStats | null> {
  try {
    const url = userId ? `${API_BASE}/stats?userId=${userId}` : `${API_BASE}/stats`;
    const res = await fetch(url);
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

// ── Leaderboard ───────────────────────────────────────────────

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  try {
    const res = await fetch(`${API_BASE}/leaderboard`);
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

// ── Admin ─────────────────────────────────────────────────────

export interface AdminData {
  stats: AdminStats;
  students: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string;
    xp: number;
    level: number;
    challengesCompleted: number;
    badges: number;
    lastActive: string;
    joinedAt: string;
    progress: Array<{
      challengeId: string;
      challengeTitle: string;
      status: string;
      score: number;
      maxScore: number;
      completedAt?: string;
    }>;
  }>;
  challengeStats: Array<{
    id: string;
    title: string;
    difficulty: string;
    points: number;
    totalAttempts: number;
    completions: number;
    completionRate: number;
  }>;
}

export async function getAdminData(): Promise<AdminData | null> {
  try {
    const res = await fetch(`${API_BASE}/admin`);
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}
