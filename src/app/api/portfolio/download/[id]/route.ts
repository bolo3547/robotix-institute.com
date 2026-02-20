export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/portfolio/download/[id] — download source code as file
export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const project = await prisma.portfolioProject.findUnique({
      where: { id: params.id },
      select: { title: true, sourceCode: true, tags: true },
    });

    if (!project || !project.sourceCode) {
      return NextResponse.json({ error: 'Source code not found' }, { status: 404 });
    }

    // Determine file extension from tags
    let ext = '.txt';
    const tagsStr = (project.tags || '').toLowerCase();
    if (tagsStr.includes('python') || tagsStr.includes('pandas') || tagsStr.includes('matplotlib')) ext = '.py';
    else if (tagsStr.includes('arduino')) ext = '.ino';
    else if (tagsStr.includes('scratch')) ext = '.txt';
    else if (tagsStr.includes('javascript') || tagsStr.includes('node')) ext = '.js';
    else if (tagsStr.includes('html')) ext = '.html';

    const filename = project.title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase() + ext;

    return new Response(project.sourceCode, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json({ error: 'Download failed' }, { status: 500 });
  }
}
