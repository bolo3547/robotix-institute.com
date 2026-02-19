import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import prisma from '@/lib/prisma';

// POST /api/seed-admin — one-time admin seed (protected by secret key)
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Simple protection: require a seed key
    if (body.seedKey !== 'robotix-seed-2025') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const email = body.email || 'admin@robotix.com';
    const password = body.password || 'admin123';
    const name = body.name || 'Admin User';

    // Check if admin already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      // Update password in case it changed
      const hashed = await hash(password, 10);
      await prisma.user.update({
        where: { email },
        data: { password: hashed, role: 'admin' },
      });
      return NextResponse.json({ message: 'Admin user updated', email });
    }

    // Create admin user
    const hashed = await hash(password, 10);
    await prisma.user.create({
      data: { email, name, password: hashed, role: 'admin' },
    });

    return NextResponse.json({ message: 'Admin user created', email });
  } catch (error: any) {
    console.error('Seed admin error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET — check if NEXTAUTH_SECRET is set (debugging helper)
export async function GET() {
  const hasSecret = !!process.env.NEXTAUTH_SECRET;
  const hasUrl = !!process.env.NEXTAUTH_URL;
  const hasDb = !!process.env.DATABASE_URL;

  let userCount = 0;
  let adminCount = 0;
  try {
    userCount = await prisma.user.count();
    adminCount = await prisma.user.count({ where: { role: 'admin' } });
  } catch (e) {}

  return NextResponse.json({
    env: {
      NEXTAUTH_SECRET: hasSecret ? 'SET' : 'MISSING',
      NEXTAUTH_URL: hasUrl ? 'SET' : 'MISSING',
      DATABASE_URL: hasDb ? 'SET' : 'MISSING',
    },
    users: { total: userCount, admins: adminCount },
  });
}
