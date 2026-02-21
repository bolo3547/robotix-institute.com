import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/uploads/[id] - Serve uploaded image from database
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const upload = await prisma.upload.findUnique({
      where: { id: params.id },
      select: { imageData: true, mimeType: true, filename: true },
    });

    if (!upload || !upload.imageData) {
      return new NextResponse('Image not found', { status: 404 });
    }

    const buffer = Buffer.from(upload.imageData, 'base64');

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': upload.mimeType || 'image/jpeg',
        'Content-Length': buffer.length.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Disposition': `inline; filename="${upload.filename}"`,
      },
    });
  } catch (error) {
    console.error('Serve upload error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
