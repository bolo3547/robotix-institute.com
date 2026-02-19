import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/photos - Public list of published photos
export async function GET() {
  const photos = await prisma.photo.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(photos);
}
