import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getToken } from 'next-auth/jwt';

// GET /api/payments - Get current user's payments
export async function GET(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  if (!token || !token.id) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const payments = await prisma.payment.findMany({
    where: { userId: token.id as string },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(payments);
}
