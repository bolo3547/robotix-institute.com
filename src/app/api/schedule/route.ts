import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/adminAuth';

// GET /api/schedule - Public: list all active schedules
export async function GET() {
  try {
    const schedules = await prisma.schedule.findMany({
      where: { active: true },
      orderBy: [
        { dayOfWeek: 'asc' },
        { startTime: 'asc' },
      ],
    });

    return NextResponse.json(schedules);
  } catch (error) {
    console.error('Schedule fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch schedules' },
      { status: 500 }
    );
  }
}

// POST /api/schedule - Admin: create a new schedule entry
export async function POST(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const {
      title,
      description,
      program,
      instructor,
      dayOfWeek,
      startTime,
      endTime,
      location,
      ageGroup,
      capacity,
    } = body;

    if (!title || !program || !dayOfWeek || !startTime || !endTime) {
      return NextResponse.json(
        { error: 'title, program, dayOfWeek, startTime, and endTime are required' },
        { status: 400 }
      );
    }

    const schedule = await prisma.schedule.create({
      data: {
        title,
        description: description || null,
        program,
        instructor: instructor || null,
        dayOfWeek: dayOfWeek.toLowerCase(),
        startTime,
        endTime,
        location: location || null,
        ageGroup: ageGroup || null,
        capacity: capacity ? parseInt(capacity, 10) : 20,
      },
    });

    return NextResponse.json(schedule, { status: 201 });
  } catch (error) {
    console.error('Schedule create error:', error);
    return NextResponse.json(
      { error: 'Failed to create schedule' },
      { status: 500 }
    );
  }
}

// PUT /api/schedule - Admin: update an existing schedule entry
export async function PUT(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: 'Schedule id is required' }, { status: 400 });
    }

    if (data.dayOfWeek) {
      data.dayOfWeek = data.dayOfWeek.toLowerCase();
    }
    if (data.capacity) {
      data.capacity = parseInt(data.capacity, 10);
    }

    const schedule = await prisma.schedule.update({
      where: { id },
      data,
    });

    return NextResponse.json(schedule);
  } catch (error) {
    console.error('Schedule update error:', error);
    return NextResponse.json(
      { error: 'Failed to update schedule' },
      { status: 500 }
    );
  }
}

// DELETE /api/schedule - Admin: deactivate a schedule entry
export async function DELETE(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Schedule id is required' }, { status: 400 });
    }

    await prisma.schedule.update({
      where: { id },
      data: { active: false },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Schedule delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete schedule' },
      { status: 500 }
    );
  }
}
