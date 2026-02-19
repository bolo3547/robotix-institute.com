import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/settings/logo - Get the site logo URL (public)
export async function GET() {
  try {
    const setting = await prisma.siteSetting.findUnique({
      where: { key: 'logoUrl' },
    });

    return NextResponse.json({
      logoUrl: setting?.value || '/logo.svg',
    });
  } catch {
    return NextResponse.json({ logoUrl: '/logo.svg' });
  }
}
