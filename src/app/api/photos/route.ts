import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/photos - Public list of published photos (excludes imageData for performance)
export async function GET() {
  const photos = await prisma.photo.findMany({
    where: { published: true },
    select: {
      id: true,
      title: true,
      description: true,
      url: true,
      category: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(photos);
}
