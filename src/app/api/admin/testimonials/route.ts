import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';

// In-memory database for testimonials (starts empty — admin adds via dashboard)
let testimonials: { id: number; [key: string]: unknown }[] = [];

export async function GET() {
  try {
    return NextResponse.json(testimonials, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;
  try {
    const body = await request.json();

    const newTestimonial = {
      id: Math.max(...testimonials.map((t) => t.id), 0) + 1,
      ...body,
    };

    testimonials.push(newTestimonial);
    return NextResponse.json(newTestimonial, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    const index = testimonials.findIndex((t) => t.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 });
    }

    testimonials[index] = { ...testimonials[index], ...updateData };
    return NextResponse.json(testimonials[index], { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update testimonial' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') || '0');

    testimonials = testimonials.filter((t) => t.id !== id);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete testimonial' }, { status: 500 });
  }
}
