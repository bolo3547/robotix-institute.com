import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/adminAuth';

// GET /api/admin/photos - List all photos (admin)
export async function GET(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  const photos = await prisma.photo.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(photos);
}

// POST /api/admin/photos - Create a new photo
export async function POST(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { title, description, url, category, published } = body;

    if (!title || !url) {
      return NextResponse.json(
        { error: 'Title and image URL are required' },
        { status: 400 }
      );
    }

    const photo = await prisma.photo.create({
      data: {
        title,
        description: description || '',
        url,
        category: category || 'general',
        published: published !== false,
      },
    });

    return NextResponse.json(photo, { status: 201 });
  } catch (error) {
    console.error('Create photo error:', error);
    return NextResponse.json({ error: 'Failed to create photo' }, { status: 500 });
  }
}

// PUT /api/admin/photos - Update a photo
export async function PUT(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { id, title, description, url, category, published } = body;

    if (!id) {
      return NextResponse.json({ error: 'Photo ID is required' }, { status: 400 });
    }

    const photo = await prisma.photo.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(url !== undefined && { url }),
        ...(category !== undefined && { category }),
        ...(published !== undefined && { published }),
      },
    });

    return NextResponse.json(photo);
  } catch (error) {
    console.error('Update photo error:', error);
    return NextResponse.json({ error: 'Failed to update photo' }, { status: 500 });
  }
}

// DELETE /api/admin/photos - Delete a photo
export async function DELETE(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Photo ID is required' }, { status: 400 });
    }

    await prisma.photo.delete({ where: { id } });

    return NextResponse.json({ message: 'Photo deleted successfully' });
  } catch (error) {
    console.error('Delete photo error:', error);
    return NextResponse.json({ error: 'Failed to delete photo' }, { status: 500 });
  }
}
