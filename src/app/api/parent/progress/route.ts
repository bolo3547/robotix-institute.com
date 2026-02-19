import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET - Parent views child's progress (by userId query param)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    // Fetch the student's enrollments + progress
    const enrollments = await prisma.enrollment.findMany({
      where: { userId },
      include: {
        user: { select: { id: true, name: true, email: true, image: true } },
        progress: { orderBy: { week: 'asc' } },
        payments: { select: { id: true, amount: true, status: true, paidAt: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Compute summary stats
    const allProgress = enrollments.flatMap(e => e.progress);
    const totalWeeks = allProgress.length;
    const avgScore = totalWeeks > 0
      ? Math.round(allProgress.filter(p => p.score !== null).reduce((a, b) => a + (b.score || 0), 0) / Math.max(allProgress.filter(p => p.score !== null).length, 1))
      : 0;
    const attendanceRate = totalWeeks > 0
      ? Math.round((allProgress.filter(p => p.attendance === 'present' || p.attendance === 'late').length / totalWeeks) * 100)
      : 0;
    const homeworkCompleted = allProgress.filter(p => p.homework === 'submitted' || p.homework === 'graded').length;

    return NextResponse.json({
      enrollments,
      summary: {
        totalEnrollments: enrollments.length,
        activeEnrollments: enrollments.filter(e => e.status === 'active').length,
        totalWeeks,
        avgScore,
        attendanceRate,
        homeworkCompleted,
        totalHomework: totalWeeks,
      },
    });
  } catch (error) {
    console.error('Error fetching parent progress:', error);
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 });
  }
}
