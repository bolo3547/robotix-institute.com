// ============================================================
// GET /api/cyber/stats?userId=... — Get student stats
// ============================================================
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    let userId = searchParams.get('userId');

    if (!userId) {
      const session = await getServerSession(authOptions);
      userId = (session?.user as any)?.id || null;
    }

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Get or create profile
    let profile = await prisma.cyberProfile.findUnique({ where: { userId } });
    if (!profile) {
      profile = await prisma.cyberProfile.create({
        data: { userId, xp: 0, level: 1, currentStreak: 0, longestStreak: 0 },
      });
    }

    // Get user info
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true, image: true, createdAt: true },
    });

    // Count challenges
    const totalChallenges = await prisma.cyberChallenge.count({ where: { isActive: true } });
    const completedCount = await prisma.cyberChallengeProgress.count({
      where: { userId, status: 'completed' },
    });

    // Get badges
    const userBadges = await prisma.cyberUserBadge.findMany({
      where: { userId },
      include: { badge: true },
      orderBy: { earnedAt: 'desc' },
    });

    // Recent activity
    const recentActivity = await prisma.cyberActivity.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    const rankName = getRankName(profile.level);

    return NextResponse.json({
      userId,
      totalXp: profile.xp,
      level: profile.level,
      rank: rankName,
      challengesCompleted: completedCount,
      challengesTotal: totalChallenges,
      currentStreak: profile.currentStreak,
      longestStreak: profile.longestStreak,
      badges: userBadges.map((ub) => ({
        id: ub.badge.id,
        name: ub.badge.name,
        description: ub.badge.description,
        icon: ub.badge.icon,
        rarity: ub.badge.rarity,
        earnedAt: ub.earnedAt.toISOString(),
      })),
      recentActivity: recentActivity.map((a) => ({
        id: a.id,
        type: a.type,
        description: a.description,
        timestamp: a.createdAt.toISOString(),
        metadata: a.metadata ? JSON.parse(a.metadata) : undefined,
      })),
      user: user
        ? {
            name: user.name,
            email: user.email,
            role: user.role,
            image: user.image,
            joinedAt: user.createdAt.toISOString(),
          }
        : null,
    });
  } catch (error) {
    console.error('Failed to fetch stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
