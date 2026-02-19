// ============================================================
// GET /api/cyber/profile — Get current user's cyber profile
// POST /api/cyber/profile — Create/init cyber profile for current user
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

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true, image: true, createdAt: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get or create cyber profile
    let profile = await prisma.cyberProfile.findUnique({ where: { userId } });
    if (!profile) {
      profile = await prisma.cyberProfile.create({
        data: { userId, xp: 0, level: 1, currentStreak: 0, longestStreak: 0 },
      });
    }

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.image,
      level: profile.level,
      xp: profile.xp,
      rank: getRankName(profile.level),
      joinedAt: user.createdAt.toISOString(),
      lastActive: profile.lastActiveAt.toISOString(),
    });
  } catch (error) {
    console.error('Failed to fetch profile:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Create profile if it doesn't exist
    const profile = await prisma.cyberProfile.upsert({
      where: { userId },
      update: { lastActiveAt: new Date() },
      create: { userId, xp: 0, level: 1, currentStreak: 0, longestStreak: 0 },
    });

    return NextResponse.json({ success: true, profile });
  } catch (error) {
    console.error('Failed to create profile:', error);
    return NextResponse.json({ error: 'Failed to create profile' }, { status: 500 });
  }
}
