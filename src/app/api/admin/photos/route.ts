import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/adminAuth';

// GET /api/admin/photos - List all photos (admin)
export async function GET(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  const photos = await prisma.photo.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      url: true,
      category: true,
      published: true,
      mimeType: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(photos);
}

// POST /api/admin/photos - Create a new photo (with base64 image data)
export async function POST(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { title, description, category, published, imageData, mimeType } = body;

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    if (!imageData) {
      return NextResponse.json(
        { error: 'Image data is required' },
        { status: 400 }
      );
    }

    // Validate base64 size (max ~5MB raw = ~6.7MB base64)
    if (imageData.length > 7 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Image too large. Maximum size: 5MB' },
        { status: 400 }
      );
    }

    // Create photo record with placeholder URL first
    const photo = await prisma.photo.create({
      data: {
        title,
        description: description || '',
        url: '', // will update after we have the ID
        imageData,
        mimeType: mimeType || 'image/jpeg',
        category: category || 'general',
        published: published !== false,
      },
    });

    // Update URL to point to the image-serving endpoint
    const updatedPhoto = await prisma.photo.update({
      where: { id: photo.id },
      data: { url: `/api/photos/${photo.id}/image` },
      select: {
        id: true,
        title: true,
        description: true,
        url: true,
        category: true,
        published: true,
        mimeType: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(updatedPhoto, { status: 201 });
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
    const { id, title, description, category, published, imageData, mimeType } = body;

    if (!id) {
      return NextResponse.json({ error: 'Photo ID is required' }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (published !== undefined) updateData.published = published;

    // If new image data is provided, update it and refresh the URL
    if (imageData) {
      if (imageData.length > 7 * 1024 * 1024) {
        return NextResponse.json(
          { error: 'Image too large. Maximum size: 5MB' },
          { status: 400 }
        );
      }
      updateData.imageData = imageData;
      updateData.mimeType = mimeType || 'image/jpeg';
      updateData.url = `/api/photos/${id}/image`;
    }

    const photo = await prisma.photo.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        title: true,
        description: true,
        url: true,
        category: true,
        published: true,
        mimeType: true,
        createdAt: true,
        updatedAt: true,
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
