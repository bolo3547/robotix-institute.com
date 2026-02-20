import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// PUT /api/admin/partners/[id] — update a partner
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, subtitle, logoUrl, websiteUrl, displayOrder, active } = body;

    const partner = await prisma.partner.update({
      where: { id: params.id },
      data: {
        ...(name !== undefined && { name }),
        ...(subtitle !== undefined && { subtitle }),
        ...(logoUrl !== undefined && { logoUrl }),
        ...(websiteUrl !== undefined && { websiteUrl }),
        ...(displayOrder !== undefined && { displayOrder }),
        ...(active !== undefined && { active }),
      },
    });

    return NextResponse.json(partner);
  } catch (error) {
    console.error('Failed to update partner:', error);
    return NextResponse.json({ error: 'Failed to update partner' }, { status: 500 });
  }
}

// DELETE /api/admin/partners/[id] — delete a partner
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.partner.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete partner:', error);
    return NextResponse.json({ error: 'Failed to delete partner' }, { status: 500 });
  }
}
