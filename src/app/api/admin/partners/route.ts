import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/admin/partners — list all partners (public + admin)
export async function GET() {
  try {
    const partners = await prisma.partner.findMany({
      orderBy: { displayOrder: 'asc' },
    });
    return NextResponse.json(partners);
  } catch (error) {
    console.error('Failed to fetch partners:', error);
    return NextResponse.json({ error: 'Failed to fetch partners' }, { status: 500 });
  }
}

// POST /api/admin/partners — create a partner
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, subtitle, logoUrl, websiteUrl, displayOrder, active } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    // Get max display order if not provided
    let order = displayOrder;
    if (order === undefined || order === null) {
      const last = await prisma.partner.findFirst({ orderBy: { displayOrder: 'desc' } });
      order = (last?.displayOrder ?? 0) + 1;
    }

    const partner = await prisma.partner.create({
      data: {
        name,
        subtitle: subtitle || null,
        logoUrl: logoUrl || null,
        websiteUrl: websiteUrl || null,
        displayOrder: order,
        active: active !== false,
      },
    });

    return NextResponse.json(partner, { status: 201 });
  } catch (error) {
    console.error('Failed to create partner:', error);
    return NextResponse.json({ error: 'Failed to create partner' }, { status: 500 });
  }
}
