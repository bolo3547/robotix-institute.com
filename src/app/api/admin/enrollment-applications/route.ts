import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import {
  sendAcceptanceLetter,
  sendRejectionNotice,
} from '@/lib/email';

/* ─────────────── GET  — list applications ─────────────── */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const program = searchParams.get('program');
    const search = searchParams.get('search');

    const where: any = {};
    if (status && status !== 'all') where.status = status;
    if (program && program !== 'all') where.program = program;
    if (search) {
      where.OR = [
        { studentFirstName: { contains: search, mode: 'insensitive' } },
        { studentLastName: { contains: search, mode: 'insensitive' } },
        { parent: { name: { contains: search, mode: 'insensitive' } } },
        { parent: { email: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const applications = await prisma.application.findMany({
      where,
      include: {
        parent: { select: { id: true, name: true, email: true, phone: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Compute stats
    const all = await prisma.application.groupBy({
      by: ['status'],
      _count: { id: true },
    });
    const stats = {
      total: all.reduce((s, g) => s + g._count.id, 0),
      pending: all.find((g) => g.status === 'pending')?._count.id ?? 0,
      under_review: all.find((g) => g.status === 'under_review')?._count.id ?? 0,
      accepted: all.find((g) => g.status === 'accepted')?._count.id ?? 0,
      rejected: all.find((g) => g.status === 'rejected')?._count.id ?? 0,
      waitlisted: all.find((g) => g.status === 'waitlisted')?._count.id ?? 0,
    };

    return NextResponse.json({ applications, stats });
  } catch (error) {
    console.error('Get applications error:', error);
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
  }
}

/* ─────────────── PUT  — review / update status ─────────────── */
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { applicationId, action, adminNotes, rejectionReason, startDate } = body;

    if (!applicationId || !action) {
      return NextResponse.json({ error: 'applicationId and action are required' }, { status: 400 });
    }

    const app = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { parent: { select: { id: true, name: true, email: true, phone: true } } },
    });

    if (!app) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    const adminId = (session.user as any)?.id || 'admin';

    /* ── ACCEPT ── */
    if (action === 'accept') {
      // 1. Create student user
      const { hash } = await import('bcryptjs');
      const pw = await hash(`student_${Date.now()}`, 10);
      const studentUser = await prisma.user.create({
        data: {
          email: `${app.studentFirstName.toLowerCase()}.${app.studentLastName.toLowerCase()}.${Date.now()}@student.robotix`,
          name: `${app.studentFirstName} ${app.studentLastName}`,
          password: pw,
          role: 'student',
          parentId: app.parentId,
        },
      });

      // 2. Determine level
      const beginnerPrograms = ['Robotics Foundations', 'Coding Basics', 'Digital Skills'];
      const intermediatePrograms = ['Python Programming'];
      const level = beginnerPrograms.includes(app.program)
        ? 'beginner'
        : intermediatePrograms.includes(app.program)
          ? 'intermediate'
          : 'advanced';

      // 3. Create enrollment
      const enrollment = await prisma.enrollment.create({
        data: {
          userId: studentUser.id,
          program: app.program,
          level,
          status: 'active',
          notes: JSON.stringify({
            preferredSchedule: app.preferredSchedule,
            studentDOB: app.studentDOB,
            studentGender: app.studentGender,
            studentGrade: app.studentGrade,
            medicalConditions: app.medicalConditions,
            allergies: app.allergies,
            medications: app.medications,
            emergencyName: app.emergencyName,
            emergencyPhone: app.emergencyPhone,
            emergencyRelation: app.emergencyRelation,
            applicationId: app.id,
          }),
        },
      });

      // 4. Update application
      const updated = await prisma.application.update({
        where: { id: applicationId },
        data: {
          status: 'accepted',
          reviewedBy: adminId,
          reviewedAt: new Date(),
          adminNotes: adminNotes || null,
          enrollmentId: enrollment.id,
        },
      });

      // 5. Send acceptance email
      try {
        await sendAcceptanceLetter({
          parentName: app.parent.name || 'Parent',
          parentEmail: app.parent.email,
          studentName: `${app.studentFirstName} ${app.studentLastName}`,
          program: app.program,
          schedule: app.preferredSchedule || undefined,
          startDate: startDate || undefined,
          adminMessage: adminNotes || undefined,
        });
        await prisma.application.update({
          where: { id: applicationId },
          data: { acceptanceLetterSentAt: new Date() },
        });
      } catch (emailErr) {
        console.error('Acceptance email error:', emailErr);
      }

      return NextResponse.json({
        message: 'Application accepted — enrollment created & acceptance letter sent',
        application: updated,
        enrollmentId: enrollment.id,
        studentId: studentUser.id,
      });
    }

    /* ── REJECT ── */
    if (action === 'reject') {
      const updated = await prisma.application.update({
        where: { id: applicationId },
        data: {
          status: 'rejected',
          reviewedBy: adminId,
          reviewedAt: new Date(),
          adminNotes: adminNotes || null,
          rejectionReason: rejectionReason || null,
        },
      });

      try {
        await sendRejectionNotice({
          parentName: app.parent.name || 'Parent',
          parentEmail: app.parent.email,
          studentName: `${app.studentFirstName} ${app.studentLastName}`,
          program: app.program,
          reason: rejectionReason || undefined,
          waitlisted: false,
        });
      } catch (emailErr) {
        console.error('Rejection email error:', emailErr);
      }

      return NextResponse.json({ message: 'Application rejected', application: updated });
    }

    /* ── WAITLIST ── */
    if (action === 'waitlist') {
      const updated = await prisma.application.update({
        where: { id: applicationId },
        data: {
          status: 'waitlisted',
          reviewedBy: adminId,
          reviewedAt: new Date(),
          adminNotes: adminNotes || null,
        },
      });

      try {
        await sendRejectionNotice({
          parentName: app.parent.name || 'Parent',
          parentEmail: app.parent.email,
          studentName: `${app.studentFirstName} ${app.studentLastName}`,
          program: app.program,
          reason: adminNotes || undefined,
          waitlisted: true,
        });
      } catch (emailErr) {
        console.error('Waitlist email error:', emailErr);
      }

      return NextResponse.json({ message: 'Application waitlisted', application: updated });
    }

    /* ── UNDER REVIEW ── */
    if (action === 'under_review') {
      const updated = await prisma.application.update({
        where: { id: applicationId },
        data: {
          status: 'under_review',
          reviewedBy: adminId,
          adminNotes: adminNotes || null,
        },
      });

      return NextResponse.json({ message: 'Application marked under review', application: updated });
    }

    /* ── RESEND ACCEPTANCE LETTER ── */
    if (action === 'resend_letter') {
      if (app.status !== 'accepted') {
        return NextResponse.json({ error: 'Can only resend letter for accepted applications' }, { status: 400 });
      }

      await sendAcceptanceLetter({
        parentName: app.parent.name || 'Parent',
        parentEmail: app.parent.email,
        studentName: `${app.studentFirstName} ${app.studentLastName}`,
        program: app.program,
        schedule: app.preferredSchedule || undefined,
        adminMessage: adminNotes || undefined,
      });

      await prisma.application.update({
        where: { id: applicationId },
        data: { acceptanceLetterSentAt: new Date() },
      });

      return NextResponse.json({ message: 'Acceptance letter resent successfully' });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Update application error:', error);
    return NextResponse.json({ error: 'Failed to update application' }, { status: 500 });
  }
}
