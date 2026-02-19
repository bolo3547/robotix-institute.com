import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/adminAuth';

// GET /api/admin/users - List users (for payment assignment)
export async function GET(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const role = searchParams.get('role');

  const where: Record<string, unknown> = {};
  if (role) where.role = role;

  const users = await prisma.user.findMany({
    where,
    select: { id: true, name: true, email: true, role: true, phone: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(users);
}
