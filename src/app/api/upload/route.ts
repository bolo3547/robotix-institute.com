import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/adminAuth';

// Vercel serverless body limit is 4.5MB; keep file limit safely under that
const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB
const ALLOWED_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/svg+xml',
  'image/webp',
  'image/gif',
  'image/x-icon',
];

export async function GET() {
  return NextResponse.json(
    { error: 'Upload endpoint requires POST with multipart/form-data' },
    { status: 405 }
  );
}

export async function POST(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    let formData: FormData;
    try {
      formData = await request.formData();
    } catch (parseError) {
      console.error('FormData parse error:', parseError);
      const contentType = request.headers.get('content-type') || 'missing';
      return NextResponse.json(
        { error: 'Failed to parse upload. Ensure the request is multipart/form-data with a file under 4MB.', contentType },
        { status: 400 }
      );
    }

    const file = formData.get('file');
    const type = formData.get('type') as string;

    // Debug: log what we received
    const keys = Array.from(formData.keys());
    console.log('Upload request - keys:', keys, 'type:', type, 'file type:', typeof file, 'file:', file ? 'present' : 'null');

    if (!file || !(file instanceof File) || file.size === 0) {
      return NextResponse.json(
        {
          error: 'No valid file uploaded',
          debug: {
            hasFile: !!file,
            fileType: file ? typeof file : 'null',
            isFile: file instanceof File,
            fileSize: file instanceof File ? file.size : 0,
            formKeys: keys,
          },
        },
        { status: 400 }
      );
    }

    // Validate MIME type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type "${file.type}". Allowed: PNG, JPG, SVG, WebP, GIF, ICO` },
        { status: 400 }
      );
    }

    // Validate size (4MB to stay under Vercel's 4.5MB body limit)
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum: 4MB` },
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
      { error: 'Failed to upload file', detail: String(error) },
      { status: 500 }
    );
  }
}
