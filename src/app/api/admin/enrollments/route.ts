import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - List enrollments (with optional filters)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');
    const program = searchParams.get('program');

    const where: Record<string, unknown> = {};
    if (userId) where.userId = userId;
    if (status) where.status = status;
    if (program) where.program = program;

    const enrollments = await prisma.enrollment.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true, role: true, parentId: true, image: true } },
        progress: { orderBy: { week: 'asc' } },
        payments: { select: { id: true, amount: true, status: true, paidAt: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(enrollments);
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    return NextResponse.json({ error: 'Failed to fetch enrollments' }, { status: 500 });
  }
}

// POST - Create enrollment (when student is enrolled after payment)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, program, level, startDate, notes } = body;

    if (!userId || !program) {
      return NextResponse.json({ error: 'userId and program are required' }, { status: 400 });
    }

    const enrollment = await prisma.enrollment.create({
      data: {
        userId,
        program,
        level: level || 'beginner',
        startDate: startDate ? new Date(startDate) : new Date(),
        notes: notes || null,
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    return NextResponse.json(enrollment, { status: 201 });
  } catch (error) {
    console.error('Error creating enrollment:', error);
    return NextResponse.json({ error: 'Failed to create enrollment' }, { status: 500 });
  }
}

// PUT - Update enrollment status
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, level, endDate, notes } = body;

    if (!id) {
      return NextResponse.json({ error: 'Enrollment ID is required' }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {};
    if (status) updateData.status = status;
    if (level) updateData.level = level;
    if (endDate) updateData.endDate = new Date(endDate);
    if (notes !== undefined) updateData.notes = notes;

    const enrollment = await prisma.enrollment.update({
      where: { id },
      data: updateData,
      include: {
        user: { select: { id: true, name: true, email: true } },
        progress: { orderBy: { week: 'asc' } },
      },
    });

    return NextResponse.json(enrollment);
  } catch (error) {
    console.error('Error updating enrollment:', error);
    return NextResponse.json({ error: 'Failed to update enrollment' }, { status: 500 });
  }
}

// DELETE - Delete enrollment
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Enrollment ID is required' }, { status: 400 });
    }

    await prisma.enrollment.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting enrollment:', error);
    return NextResponse.json({ error: 'Failed to delete enrollment' }, { status: 500 });
  }
}
