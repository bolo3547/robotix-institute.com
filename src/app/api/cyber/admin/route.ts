// ============================================================
// GET /api/cyber/admin — Admin stats & student data
// ============================================================
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Total students with cyber profiles
    const totalStudents = await prisma.cyberProfile.count();

    // Total teachers / admins
    const totalTeachers = await prisma.user.count({
      where: { role: { in: ['instructor', 'admin'] } },
    });

    // Total active challenges
    const totalChallenges = await prisma.cyberChallenge.count({ where: { isActive: true } });

    // Active sessions (users active in last 24 hours)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const activeSessions = await prisma.cyberProfile.count({
      where: { lastActiveAt: { gte: oneDayAgo } },
    });

    // Average completion
    const allProgress = await prisma.cyberChallengeProgress.count();
    const completedProgress = await prisma.cyberChallengeProgress.count({
      where: { status: 'completed' },
    });
    const averageCompletion = allProgress > 0 ? Math.round((completedProgress / allProgress) * 100) : 0;

    // Top challenge (most completions)
    const topChallengeData = await prisma.cyberChallengeProgress.groupBy({
      by: ['challengeId'],
      where: { status: 'completed' },
      _count: { challengeId: true },
      orderBy: { _count: { challengeId: 'desc' } },
      take: 1,
    });
    let topChallenge = 'None yet';
    if (topChallengeData.length > 0) {
      const ch = await prisma.cyberChallenge.findUnique({ where: { id: topChallengeData[0].challengeId } });
      topChallenge = ch?.title || 'Unknown';
    }

    // Recent signups (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentSignups = await prisma.cyberProfile.count({
      where: { createdAt: { gte: sevenDaysAgo } },
    });

    // Students list with their profiles
    const students = await prisma.cyberProfile.findMany({
      include: {
        user: { select: { id: true, name: true, email: true, role: true, image: true, createdAt: true } },
      },
      orderBy: { xp: 'desc' },
    });

    // Per-student challenge progress
    const studentData = await Promise.all(
      students.map(async (s) => {
        const progress = await prisma.cyberChallengeProgress.findMany({
          where: { userId: s.userId },
          include: { challenge: true },
        });
        const completedCount = progress.filter((p) => p.status === 'completed').length;
        const badgeCount = await prisma.cyberUserBadge.count({ where: { userId: s.userId } });

        return {
          id: s.userId,
          name: s.user.name,
          email: s.user.email,
          role: s.user.role,
          avatar: s.user.image,
          xp: s.xp,
          level: s.level,
          challengesCompleted: completedCount,
          badges: badgeCount,
          lastActive: s.lastActiveAt.toISOString(),
          joinedAt: s.user.createdAt.toISOString(),
          progress: progress.map((p) => ({
            challengeId: p.challengeId,
            challengeTitle: p.challenge.title,
            status: p.status,
            score: p.score,
            maxScore: p.maxScore,
            completedAt: p.completedAt?.toISOString(),
          })),
        };
      })
    );

    // Challenge stats
    const challenges = await prisma.cyberChallenge.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    });
    const challengeStats = await Promise.all(
      challenges.map(async (ch) => {
        const totalAttempts = await prisma.cyberChallengeProgress.count({ where: { challengeId: ch.id } });
        const completed = await prisma.cyberChallengeProgress.count({
          where: { challengeId: ch.id, status: 'completed' },
        });
        return {
          id: ch.id,
          title: ch.title,
          difficulty: ch.difficulty,
          points: ch.points,
          totalAttempts,
          completions: completed,
          completionRate: totalAttempts > 0 ? Math.round((completed / totalAttempts) * 100) : 0,
        };
      })
    );

    return NextResponse.json({
      stats: {
        totalStudents,
        totalTeachers,
        totalChallenges,
        activeSessions,
        averageCompletion,
        topChallenge,
        recentSignups,
      },
      students: studentData,
      challengeStats,
    });
  } catch (error) {
    console.error('Failed to fetch admin stats:', error);
    return NextResponse.json({ error: 'Failed to fetch admin stats' }, { status: 500 });
  }
}
