// ============================================================
// GET /api/cyber/progress?userId=... — Get user progress
// POST /api/cyber/progress — Submit/update challenge progress
// ============================================================
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    let userId = searchParams.get('userId');

    // If no userId provided, try to get from session
    if (!userId) {
      const session = await getServerSession(authOptions);
      userId = (session?.user as any)?.id || null;
    }

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const progress = await prisma.cyberChallengeProgress.findMany({
      where: { userId },
      include: { challenge: true },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json(progress);
  } catch (error) {
    console.error('Failed to fetch progress:', error);
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { challengeId, status, score, maxScore, flagsFound, totalFlags, timeSpent } = body;

    if (!challengeId) {
      return NextResponse.json({ error: 'challengeId required' }, { status: 400 });
    }

    // Upsert progress
    const progress = await prisma.cyberChallengeProgress.upsert({
      where: {
        challengeId_userId: { challengeId, userId },
      },
      update: {
        status: status || 'in-progress',
        score: score ?? undefined,
        maxScore: maxScore ?? undefined,
        flagsFound: flagsFound ?? undefined,
        totalFlags: totalFlags ?? undefined,
        timeSpent: timeSpent ?? undefined,
        attempts: { increment: 1 },
        completedAt: status === 'completed' ? new Date() : undefined,
      },
      create: {
        challengeId,
        userId,
        status: status || 'in-progress',
        score: score || 0,
        maxScore: maxScore || 0,
        flagsFound: flagsFound || 0,
        totalFlags: totalFlags || 0,
        timeSpent: timeSpent || 0,
        attempts: 1,
        startedAt: new Date(),
      },
    });

    // If completed, update XP on profile
    if (status === 'completed' && score > 0) {
      await prisma.cyberProfile.upsert({
        where: { userId },
        update: {
          xp: { increment: score },
          lastActiveAt: new Date(),
        },
        create: {
          userId,
          xp: score,
          level: 1,
          currentStreak: 1,
          longestStreak: 1,
        },
      });

      // Recalculate level
      const profile = await prisma.cyberProfile.findUnique({ where: { userId } });
      if (profile) {
        const newLevel = Math.floor(profile.xp / 500) + 1;
        if (newLevel !== profile.level) {
          await prisma.cyberProfile.update({
            where: { userId },
            data: { level: newLevel },
          });

          // Log level up activity
          await prisma.cyberActivity.create({
            data: {
              userId,
              type: 'level_up',
              description: `Reached Level ${newLevel}`,
            },
          });
        }
      }

      // Log challenge completion activity
      const challenge = await prisma.cyberChallenge.findUnique({ where: { id: challengeId } });
      await prisma.cyberActivity.create({
        data: {
          userId,
          type: 'challenge_completed',
          description: `Completed "${challenge?.title || challengeId}"`,
          metadata: JSON.stringify({ challengeId, score, maxScore }),
        },
      });

      // Check for badges
      await checkAndAwardBadges(userId);
    } else if (status === 'in-progress') {
      // Log challenge started
      const existingActivity = await prisma.cyberActivity.findFirst({
        where: { userId, type: 'challenge_started', metadata: { contains: challengeId } },
      });
      if (!existingActivity) {
        const challenge = await prisma.cyberChallenge.findUnique({ where: { id: challengeId } });
        await prisma.cyberActivity.create({
          data: {
            userId,
            type: 'challenge_started',
            description: `Started "${challenge?.title || challengeId}"`,
            metadata: JSON.stringify({ challengeId }),
          },
        });
      }
    }

    return NextResponse.json(progress);
  } catch (error) {
    console.error('Failed to update progress:', error);
    return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 });
  }
}

// ── Badge checks ──────────────────────────────────────────────
async function checkAndAwardBadges(userId: string) {
  const completedProgress = await prisma.cyberChallengeProgress.findMany({
    where: { userId, status: 'completed' },
    include: { challenge: true },
  });

  const completedCount = completedProgress.length;
  const existingBadges = await prisma.cyberUserBadge.findMany({ where: { userId } });
  const earnedIds = new Set(existingBadges.map((b) => b.badgeId));

  const badgesToAward: string[] = [];

  // First Blood — 1 challenge completed
  if (completedCount >= 1 && !earnedIds.has('b-first-blood')) {
    badgesToAward.push('b-first-blood');
  }

  // Beginner Clear — all 4 beginner challenges
  const beginnerDone = completedProgress.filter((p) => p.challenge.difficulty === 'beginner').length;
  if (beginnerDone >= 4 && !earnedIds.has('b-beginner-clear')) {
    badgesToAward.push('b-beginner-clear');
  }

  // Intermediate Clear — all 4 intermediate
  const intermediateDone = completedProgress.filter((p) => p.challenge.difficulty === 'intermediate').length;
  if (intermediateDone >= 4 && !earnedIds.has('b-intermediate-clear')) {
    badgesToAward.push('b-intermediate-clear');
  }

  // Advanced Clear — all 4 advanced
  const advancedDone = completedProgress.filter((p) => p.challenge.difficulty === 'advanced').length;
  if (advancedDone >= 4 && !earnedIds.has('b-advanced-clear')) {
    badgesToAward.push('b-advanced-clear');
  }

  // Full Clear — all 12
  if (completedCount >= 12 && !earnedIds.has('b-full-clear')) {
    badgesToAward.push('b-full-clear');
  }

  // Perfect Score — 100% on any challenge
  const hasPerfect = completedProgress.some((p) => p.score === p.maxScore && p.maxScore > 0);
  if (hasPerfect && !earnedIds.has('b-perfect-score')) {
    badgesToAward.push('b-perfect-score');
  }

  // Speed Demon — under 5 minutes (300 seconds)
  const hasFast = completedProgress.some((p) => p.timeSpent > 0 && p.timeSpent < 300);
  if (hasFast && !earnedIds.has('b-speed-demon')) {
    badgesToAward.push('b-speed-demon');
  }

  // SQL Ninja
  const sqlPerfect = completedProgress.find(
    (p) => p.challengeId === 'ch-sql-injection' && p.score === p.maxScore && p.maxScore > 0
  );
  if (sqlPerfect && !earnedIds.has('b-sql-ninja')) {
    badgesToAward.push('b-sql-ninja');
  }

  // XSS Hunter
  const xssPerfect = completedProgress.find(
    (p) => p.challengeId === 'ch-xss-simulation' && p.score === p.maxScore && p.maxScore > 0
  );
  if (xssPerfect && !earnedIds.has('b-xss-hunter')) {
    badgesToAward.push('b-xss-hunter');
  }

  // CTF Master
  const ctfPerfect = completedProgress.find(
    (p) => p.challengeId === 'ch-ctf' && p.score === p.maxScore && p.maxScore > 0
  );
  if (ctfPerfect && !earnedIds.has('b-ctf-master')) {
    badgesToAward.push('b-ctf-master');
  }

  // Award badges
  for (const badgeId of badgesToAward) {
    await prisma.cyberUserBadge.create({
      data: { badgeId, userId },
    });
    const badge = await prisma.cyberBadge.findUnique({ where: { id: badgeId } });
    await prisma.cyberActivity.create({
      data: {
        userId,
        type: 'badge_earned',
        description: `Earned "${badge?.name}" badge`,
        metadata: JSON.stringify({ badgeId }),
      },
    });
  }
}
