import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Get progress records (by enrollment or student)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const enrollmentId = searchParams.get('enrollmentId');
    const userId = searchParams.get('userId');

    const where: Record<string, unknown> = {};
    if (enrollmentId) where.enrollmentId = enrollmentId;
    if (userId) where.userId = userId;

    const progress = await prisma.studentProgress.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true, image: true } },
        enrollment: { select: { id: true, program: true, level: true, status: true } },
      },
      orderBy: { week: 'asc' },
    });

    return NextResponse.json(progress);
  } catch (error) {
    console.error('Error fetching progress:', error);
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 });
  }
}

// POST - Add a progress entry
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      userId, enrollmentId, week, topic, score,
      attendance, homework, homeworkGrade, notes, skills, behavior
    } = body;

    if (!userId || !enrollmentId || !week || !topic) {
      return NextResponse.json(
        { error: 'userId, enrollmentId, week, and topic are required' },
        { status: 400 }
      );
    }

    const progress = await prisma.studentProgress.create({
      data: {
        userId,
        enrollmentId,
        week: parseInt(week),
        topic,
        score: score ? parseInt(score) : null,
        attendance: attendance || 'present',
        homework: homework || 'pending',
        homeworkGrade: homeworkGrade ? parseInt(homeworkGrade) : null,
        notes: notes || null,
        skills: skills ? JSON.stringify(skills) : null,
        behavior: behavior || 'good',
      },
      include: {
        user: { select: { id: true, name: true } },
        enrollment: { select: { id: true, program: true } },
      },
    });

    return NextResponse.json(progress, { status: 201 });
  } catch (error) {
    console.error('Error creating progress:', error);
    return NextResponse.json({ error: 'Failed to create progress entry' }, { status: 500 });
  }
}

// PUT - Update a progress entry
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, topic, score, attendance, homework, homeworkGrade, notes, skills, behavior } = body;

    if (!id) {
      return NextResponse.json({ error: 'Progress ID is required' }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {};
    if (topic !== undefined) updateData.topic = topic;
    if (score !== undefined) updateData.score = score ? parseInt(score) : null;
    if (attendance !== undefined) updateData.attendance = attendance;
    if (homework !== undefined) updateData.homework = homework;
    if (homeworkGrade !== undefined) updateData.homeworkGrade = homeworkGrade ? parseInt(homeworkGrade) : null;
    if (notes !== undefined) updateData.notes = notes;
    if (skills !== undefined) updateData.skills = skills ? JSON.stringify(skills) : null;
    if (behavior !== undefined) updateData.behavior = behavior;

    const progress = await prisma.studentProgress.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(progress);
  } catch (error) {
    console.error('Error updating progress:', error);
    return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 });
  }
}

// DELETE - Delete a progress entry
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Progress ID is required' }, { status: 400 });
    }

    await prisma.studentProgress.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting progress:', error);
    return NextResponse.json({ error: 'Failed to delete progress' }, { status: 500 });
  }
}
