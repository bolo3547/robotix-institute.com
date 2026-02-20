export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/portfolio — list all public portfolios with stats
export async function GET() {
  try {
    const portfolios = await prisma.portfolio.findMany({
      where: { isPublic: true },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { totalXp: 'desc' },
    });

    // Fetch project & cert counts in parallel
    const enriched = await Promise.all(
      portfolios.map(async (p) => {
        const [projectCount, certCount] = await Promise.all([
          prisma.portfolioProject.count({ where: { userId: p.userId } }),
          prisma.certificate.count({ where: { userId: p.userId } }),
        ]);
        return {
          ...p,
          projectCount,
          certCount,
        };
      })
    );

    return NextResponse.json(enriched);
  } catch (error) {
    console.error('Portfolio list error:', error);
    return NextResponse.json({ error: 'Failed to load portfolios' }, { status: 500 });
  }
}
