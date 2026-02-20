import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET - Instructor views their dashboard data (classes, students, stats)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch all enrollments (programs act as "classes")
    const enrollments = await prisma.enrollment.findMany({
      where: { status: 'active' },
      include: {
        user: { select: { id: true, name: true, email: true } },
        progress: { orderBy: { week: 'desc' }, take: 5 },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Group enrollments by program (simulates "classes")
    const programMap = new Map<string, {
      id: string;
      name: string;
      level: string;
      studentCount: number;
      totalProgress: number;
      students: { id: string; name: string; program: string; progress: number; attendance: string; status: string }[];
    }>();

    enrollments.forEach((enrollment) => {
      const key = enrollment.program;
      if (!programMap.has(key)) {
        programMap.set(key, {
          id: enrollment.id,
          name: enrollment.program,
          level: enrollment.level,
          studentCount: 0,
          totalProgress: 0,
          students: [],
        });
      }
      const cls = programMap.get(key)!;
      cls.studentCount += 1;

      // Calculate student's progress percentage
      const totalWeeks = 12; // estimated per program
      const completedWeeks = enrollment.progress.length;
      const progressPct = Math.min(Math.round((completedWeeks / totalWeeks) * 100), 100);
      cls.totalProgress += progressPct;

      // Calculate attendance
      const allProgress = enrollment.progress;
      const presentCount = allProgress.filter(p => p.attendance === 'present' || p.attendance === 'late').length;
      const attendanceRate = allProgress.length > 0 ? Math.round((presentCount / allProgress.length) * 100) : 0;

      // Determine status
      let studentStatus: string = 'good';
      if (progressPct >= 80 && attendanceRate >= 90) studentStatus = 'excellent';
      else if (progressPct < 50 || attendanceRate < 70) studentStatus = 'needs_help';

      cls.students.push({
        id: enrollment.user.id,
        name: enrollment.user.name || enrollment.user.email,
        program: enrollment.program,
        progress: progressPct,
        attendance: `${attendanceRate}%`,
        status: studentStatus,
      });
    });

    const classes = Array.from(programMap.values()).map((cls, idx) => ({
      id: idx + 1,
      name: cls.name,
      level: cls.level.charAt(0).toUpperCase() + cls.level.slice(1),
      students: cls.studentCount,
      schedule: 'See timetable',
      progress: cls.studentCount > 0 ? Math.round(cls.totalProgress / cls.studentCount) : 0,
    }));

    // Flatten all students (unique by ID, take first 10)
    const allStudents = Array.from(programMap.values())
      .flatMap(cls => cls.students)
      .filter((s, i, arr) => arr.findIndex(x => x.id === s.id) === i)
      .slice(0, 10)
      .map((s, idx) => ({ ...s, id: idx + 1, class: s.program }));

    // Count total assignments (progress entries with homework)
    const totalAssignments = enrollments.reduce((sum, e) => 
      sum + e.progress.filter(p => p.homework === 'submitted' || p.homework === 'graded').length, 0
    );

    return NextResponse.json({
      classes,
      students: allStudents,
      stats: {
        activeClasses: classes.length,
        totalStudents: enrollments.length,
        avgProgress: classes.length > 0 ? Math.round(classes.reduce((s, c) => s + c.progress, 0) / classes.length) : 0,
        totalAssignments,
      },
    });
  } catch (error) {
    console.error('Error fetching instructor dashboard:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}
