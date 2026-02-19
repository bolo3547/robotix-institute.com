import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';

// Mock database for team
let teamMembers = [
  {
    id: 1,
    name: 'Dr. Chileshe Mwale',
    role: 'Founder & Director',
    bio: 'PhD in Computer Science, 15+ years in tech education',
    specialty: 'Robotics & AI',
  },
];

export async function GET() {
  try {
    return NextResponse.json(teamMembers, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch team members' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;
  try {
    const body = await request.json();

    const newMember = {
      id: Math.max(...teamMembers.map((m) => m.id), 0) + 1,
      ...body,
    };

    teamMembers.push(newMember);
    return NextResponse.json(newMember, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create team member' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    const index = teamMembers.findIndex((m) => m.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Team member not found' }, { status: 404 });
    }

    teamMembers[index] = { ...teamMembers[index], ...updateData };
    return NextResponse.json(teamMembers[index], { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update team member' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') || '0');

    teamMembers = teamMembers.filter((m) => m.id !== id);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete team member' }, { status: 500 });
  }
}
