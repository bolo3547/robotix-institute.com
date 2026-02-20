import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import prisma from '@/lib/prisma';

// GET /api/chat/users — list all users (for starting DMs or adding to groups)
export async function GET(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token?.sub) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(request.url);
  const search = url.searchParams.get('q') || '';
  const role = url.searchParams.get('role');

  const users = await prisma.user.findMany({
    where: {
      AND: [
        { id: { not: token.sub } }, // Exclude self
        search
          ? {
              OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {},
        role ? { role } : {},
      ],
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
    },
    orderBy: { name: 'asc' },
    take: 50,
  });

  return NextResponse.json(users);
}
