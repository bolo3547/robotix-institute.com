import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/events - Public list of published events
export async function GET() {
  const events = await prisma.event.findMany({
    where: { published: true },
    orderBy: { date: 'asc' },
  });

  return NextResponse.json(events, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    },
  });
}
