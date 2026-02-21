import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/adminAuth';

export async function POST(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // 'logo' | 'favicon' | 'content' | 'hero' | 'partner' | 'gallery' | 'general'

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/webp', 'image/gif', 'image/x-icon'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: PNG, JPG, SVG, WebP, GIF, ICO' },
        { status: 400 }
      );
    }

    // Max file size: 5MB
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size: 5MB' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');

    // For logo/favicon: store as data URL in SiteSetting (backwards compatible)
    if (type === 'logo' || type === 'favicon') {
      const dataUrl = `data:${file.type};base64,${base64}`;

      await prisma.siteSetting.upsert({
        where: { key: type === 'logo' ? 'logoUrl' : 'faviconUrl' },
        update: { value: dataUrl },
        create: { key: type === 'logo' ? 'logoUrl' : 'faviconUrl', value: dataUrl },
      });

      return NextResponse.json({
        success: true,
        url: dataUrl,
        filename: file.name,
        size: file.size,
        type: file.type,
        stored: 'database',
      });
    }

    // For ALL other files: store as base64 in the Upload table (persists on Vercel)
    const upload = await prisma.upload.create({
      data: {
        filename: file.name,
        mimeType: file.type,
        imageData: base64,
        size: file.size,
        type: type || 'general',
      },
    });

    // Return a URL that serves the image from the database
    const publicUrl = `/api/uploads/${upload.id}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      id: upload.id,
      filename: file.name,
      size: file.size,
      type: file.type,
      stored: 'database',
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
