import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/adminAuth';

// GET /api/admin/settings - Get all site settings
export async function GET(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  const settings = await prisma.siteSetting.findMany();
  const settingsMap: Record<string, string> = {};
  for (const item of settings) {
    settingsMap[item.key] = item.value;
  }

  return NextResponse.json(settingsMap);
}

// PUT /api/admin/settings - Update a site setting
export async function PUT(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { key, value } = body;

    if (!key || value === undefined) {
      return NextResponse.json({ error: 'Key and value are required' }, { status: 400 });
    }

    const setting = await prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });

    return NextResponse.json(setting);
  } catch (error) {
    console.error('Update setting error:', error);
    return NextResponse.json({ error: 'Failed to update setting' }, { status: 500 });
  }
}
