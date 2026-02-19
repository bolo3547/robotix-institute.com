import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { mockUsers, addUser } from '@/lib/mockDb';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, password, role, childAge, qualifications } = body;

    // Validate required fields
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: 'Name, email, password, and role are required' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // Check if user already exists
    if (mockUsers[email]) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    // Validate role
    if (!['parent', 'instructor', 'student'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be parent, instructor, or student' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Create new user
    const newUser = {
      id: `${role}-${Date.now()}`,
      email,
      name,
      role,
      password: hashedPassword,
      phone: phone || '',
      ...(role === 'parent' ? { childAge: childAge || '', children: [] } : {}),
      ...(role === 'instructor' ? { qualifications: qualifications || '', bio: '' } : {}),
      ...(role === 'student' ? { grade: '', enrolledPrograms: [] } : {}),
      createdAt: new Date().toISOString(),
    };

    addUser(newUser);

    return NextResponse.json(
      { message: 'Account created successfully', userId: newUser.id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    );
  }
}
