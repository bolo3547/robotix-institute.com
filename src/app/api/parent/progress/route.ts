import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import prisma from '@/lib/prisma';

// GET - Parent views child's progress (by userId query param, or auto-detect children)
export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const { searchParams } = new URL(req.url);
    let userId = searchParams.get('userId');

    // If no explicit userId, try to find the parent's children from token
    if (!userId && token?.sub) {
      const parentUser = await prisma.user.findUnique({
        where: { id: token.sub },
        include: { children: { select: { id: true } } },
      });
      if (parentUser?.children?.length) {
        userId = parentUser.children[0].id;
      }
    }

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
    const allProgress = enrollments.flatMap((e: { progress: Array<{ score: number | null; attendance: string; homework: string }> }) => e.progress);
    const totalWeeks = allProgress.length;
    const scoredEntries = allProgress.filter((p: { score: number | null }) => p.score !== null);
    const avgScore = scoredEntries.length > 0
      ? Math.round(scoredEntries.reduce((a: number, b: { score: number | null }) => a + (b.score || 0), 0) / scoredEntries.length)
      : 0;
    const attendanceRate = totalWeeks > 0
      ? Math.round((allProgress.filter((p: { attendance: string }) => p.attendance === 'present' || p.attendance === 'late').length / totalWeeks) * 100)
      : 0;
    const homeworkCompleted = allProgress.filter((p: { homework: string }) => p.homework === 'submitted' || p.homework === 'graded').length;

    return NextResponse.json({
      enrollments,
      summary: {
        totalEnrollments: enrollments.length,
        activeEnrollments: enrollments.filter((e: { status: string }) => e.status === 'active').length,
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
