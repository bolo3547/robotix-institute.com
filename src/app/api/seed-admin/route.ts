import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import prisma from '@/lib/prisma';

// POST /api/seed-admin — one-time admin seed (protected by secret key)
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Protection: require seed key from environment variable
    const expectedKey = process.env.ADMIN_SEED_KEY;
    if (!expectedKey || body.seedKey !== expectedKey) {
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

// GET — health check (no sensitive info exposed)
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Seed admin endpoint is available. Use POST with seedKey to create admin.',
  });
}
