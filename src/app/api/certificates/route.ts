import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET — List published certificates (optionally filtered by userId or certNumber)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const certNumber = searchParams.get('certNumber');

    const where: Record<string, unknown> = { status: 'published' };
    if (userId) where.userId = userId;
    if (certNumber) where.certNumber = certNumber;

    const certificates = await prisma.certificate.findMany({
      where,
      orderBy: { issueDate: 'desc' },
    });

    return NextResponse.json(certificates);
  } catch (error) {
    console.error('Failed to fetch published certificates:', error);
    return NextResponse.json({ error: 'Failed to fetch certificates' }, { status: 500 });
  }
}
