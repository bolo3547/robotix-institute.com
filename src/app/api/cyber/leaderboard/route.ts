// ============================================================
// GET /api/cyber/leaderboard — Global leaderboard
// ============================================================
export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const RANKS = [
  { level: 1, name: 'Script Kiddie' },
  { level: 3, name: 'Packet Sniffer' },
  { level: 5, name: 'White Hat Jr' },
  { level: 8, name: 'Pentester' },
  { level: 12, name: 'Security Analyst' },
  { level: 16, name: 'Exploit Dev' },
  { level: 20, name: 'Cyber Sentinel' },
  { level: 25, name: 'Zero-Day Hunter' },
];

function getRankName(level: number): string {
  let rank = RANKS[0].name;
  for (const r of RANKS) {
    if (level >= r.level) rank = r.name;
  }
  return rank;
}

export async function GET() {
  try {
    // Get all cyber profiles with user info
    const profiles = await prisma.cyberProfile.findMany({
      include: {
        user: {
          select: { id: true, name: true, image: true },
        },
      },
      orderBy: { xp: 'desc' },
      take: 50,
    });

    // Get completed challenge counts and badge counts for each user
    const entries = await Promise.all(
      profiles.map(async (profile, index) => {
        const completedCount = await prisma.cyberChallengeProgress.count({
          where: { userId: profile.userId, status: 'completed' },
        });
        const badgeCount = await prisma.cyberUserBadge.count({
          where: { userId: profile.userId },
        });

        return {
          rank: index + 1,
          userId: profile.userId,
          name: profile.user.name,
          avatar: profile.user.image || undefined,
          xp: profile.xp,
          level: profile.level,
          challengesCompleted: completedCount,
          badges: badgeCount,
        };
      })
    );

    return NextResponse.json(entries);
  } catch (error) {
    console.error('Failed to fetch leaderboard:', error);
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}
