import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';

// In-memory database for programs (starts empty — admin adds via dashboard)
let programs: { id: number; [key: string]: unknown }[] = [];

export async function GET() {
  try {
    return NextResponse.json(programs, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch programs' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;
  try {
    const body = await request.json();

    const newProgram = {
      id: Math.max(...programs.map((p) => p.id), 0) + 1,
      ...body,
    };

    programs.push(newProgram);
    return NextResponse.json(newProgram, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create program' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    const index = programs.findIndex((p) => p.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Program not found' }, { status: 404 });
    }

    programs[index] = { ...programs[index], ...updateData };
    return NextResponse.json(programs[index], { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update program' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') || '0');

    programs = programs.filter((p) => p.id !== id);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete program' }, { status: 500 });
  }
}
