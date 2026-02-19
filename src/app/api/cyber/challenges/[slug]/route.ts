// ============================================================
// GET /api/cyber/challenges/[slug] — Get challenge by slug
// ============================================================
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const challenge = await prisma.cyberChallenge.findUnique({
      where: { slug: params.slug },
    });

    if (!challenge) {
      return NextResponse.json({ error: 'Challenge not found' }, { status: 404 });
    }

    return NextResponse.json({
      ...challenge,
      tags: JSON.parse(challenge.tags || '[]'),
      prerequisiteIds: JSON.parse(challenge.prerequisiteIds || '[]'),
      order: challenge.displayOrder,
    });
  } catch (error) {
    console.error('Failed to fetch challenge:', error);
    return NextResponse.json({ error: 'Failed to fetch challenge' }, { status: 500 });
  }
}
