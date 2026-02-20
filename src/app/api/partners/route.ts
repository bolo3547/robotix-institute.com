import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/partners — public: fetch active partners for the homepage
export async function GET() {
  try {
    const partners = await prisma.partner.findMany({
      where: { active: true },
      orderBy: { displayOrder: 'asc' },
      select: {
        id: true,
        name: true,
        subtitle: true,
        logoUrl: true,
        websiteUrl: true,
      },
    });
    return NextResponse.json(partners);
  } catch {
    // Return empty array on error so the homepage still renders
    return NextResponse.json([]);
  }
}
