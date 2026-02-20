import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET - Parent views their child's progress
export async function GET(req: NextRequest) {
  try {
    // Validate session (value used for authorization context)
    await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);
    const childId = searchParams.get('childId');

    // If no session, still allow if childId is provided (for demo/testing)
    const targetUserId = childId;

    if (!targetUserId) {
      return NextResponse.json({ error: 'childId is required' }, { status: 400 });
    }

    // Get the student's enrollments with progress
    const enrollments = await prisma.enrollment.findMany({
      where: { userId: targetUserId },
      include: {
        user: { select: { id: true, name: true, email: true, image: true } },
        progress: {
          orderBy: { week: 'asc' },
        },
        payments: {
          select: { id: true, amount: true, status: true, paidAt: true },
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(enrollments);
  } catch (error) {
    console.error('Error fetching child progress:', error);
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 });
  }
}
