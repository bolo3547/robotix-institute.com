export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/portfolio/[id] — single student portfolio with projects + certificates
export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;

    const portfolio = await prisma.portfolio.findUnique({
      where: { userId },
      include: {
        user: { select: { id: true, name: true, email: true, createdAt: true } },
      },
    });

    if (!portfolio) {
      return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 });
    }

    const [projects, certificates] = await Promise.all([
      prisma.portfolioProject.findMany({
        where: { userId, isPublic: true },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.certificate.findMany({
        where: { userId },
        orderBy: { issueDate: 'desc' },
      }),
    ]);

    return NextResponse.json({ portfolio, projects, certificates });
  } catch (error) {
    console.error('Portfolio detail error:', error);
    return NextResponse.json({ error: 'Failed to load portfolio' }, { status: 500 });
  }
}
