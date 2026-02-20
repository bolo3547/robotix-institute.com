export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/portfolio/project/[id] — get project detail with source code
export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const project = await prisma.portfolioProject.findUnique({
      where: { id: params.id },
      include: {
        user: { select: { id: true, name: true } },
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error('Project detail error:', error);
    return NextResponse.json({ error: 'Failed to load project' }, { status: 500 });
  }
}
