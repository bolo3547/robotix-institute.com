// ============================================================
// GET /api/cyber/challenges — List all active challenges
// POST /api/cyber/challenges — (admin) create a challenge
// ============================================================
export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const challenges = await prisma.cyberChallenge.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    });

    // Parse JSON fields
    const parsed = challenges.map((ch) => ({
      ...ch,
      tags: JSON.parse(ch.tags || '[]'),
      prerequisiteIds: JSON.parse(ch.prerequisiteIds || '[]'),
      order: ch.displayOrder,
    }));

    return NextResponse.json(parsed);
  } catch (error) {
    console.error('Failed to fetch challenges:', error);
    return NextResponse.json({ error: 'Failed to fetch challenges' }, { status: 500 });
  }
}
