import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/photos/[id]/image - Serve photo binary from database
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const photo = await prisma.photo.findUnique({
      where: { id: params.id },
      select: { imageData: true, mimeType: true, published: true },
    });

    if (!photo || !photo.imageData) {
      return new NextResponse('Image not found', { status: 404 });
    }

    const buffer = Buffer.from(photo.imageData, 'base64');

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': photo.mimeType || 'image/jpeg',
        'Content-Length': buffer.length.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Serve image error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
