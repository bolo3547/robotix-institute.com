import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/adminAuth';

// GET /api/admin/payments - List all payments (admin)
export async function GET(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const userId = searchParams.get('userId');

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (userId) where.userId = userId;

  const payments = await prisma.payment.findMany({
    where,
    include: {
      user: {
        select: { id: true, name: true, email: true, role: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(payments);
}

// POST /api/admin/payments - Create a new payment record
export async function POST(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { userId, description, amount, currency, status, method, reference, dueDate, notes } = body;

    if (!userId || !description || !amount) {
      return NextResponse.json(
        { error: 'User ID, description, and amount are required' },
        { status: 400 }
      );
    }

    // Verify user exists
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Generate receipt number if paid
    let receiptNumber: string | null = null;
    let paidAt: Date | null = null;
    if (status === 'paid') {
      receiptNumber = `RX-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      paidAt = new Date();
    }

    const payment = await prisma.payment.create({
      data: {
        userId,
        description,
        amount: parseFloat(amount),
        currency: currency || 'ZMW',
        status: status || 'pending',
        method: method || null,
        reference: reference || null,
        receiptNumber,
        paidAt,
        dueDate: dueDate ? new Date(dueDate) : null,
        notes: notes || null,
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return NextResponse.json(payment, { status: 201 });
  } catch (error) {
    console.error('Create payment error:', error);
    return NextResponse.json({ error: 'Failed to create payment' }, { status: 500 });
  }
}

// PUT /api/admin/payments - Update a payment (mark as paid, etc.)
export async function PUT(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { id, status, method, reference, notes, amount, description, dueDate } = body;

    if (!id) {
      return NextResponse.json({ error: 'Payment ID is required' }, { status: 400 });
    }

    const existing = await prisma.payment.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    // If changing status to paid, generate receipt number and set paidAt
    let receiptNumber = existing.receiptNumber;
    let paidAt = existing.paidAt;
    if (status === 'paid' && existing.status !== 'paid') {
      receiptNumber = `RX-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      paidAt = new Date();
    }

    const payment = await prisma.payment.update({
      where: { id },
      data: {
        ...(status !== undefined && { status }),
        ...(method !== undefined && { method }),
        ...(reference !== undefined && { reference }),
        ...(notes !== undefined && { notes }),
        ...(amount !== undefined && { amount: parseFloat(amount) }),
        ...(description !== undefined && { description }),
        ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
        receiptNumber,
        paidAt,
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return NextResponse.json(payment);
  } catch (error) {
    console.error('Update payment error:', error);
    return NextResponse.json({ error: 'Failed to update payment' }, { status: 500 });
  }
}

// DELETE /api/admin/payments - Delete a payment
export async function DELETE(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Payment ID is required' }, { status: 400 });
    }

    await prisma.payment.delete({ where: { id } });

    return NextResponse.json({ message: 'Payment deleted successfully' });
  } catch (error) {
    console.error('Delete payment error:', error);
    return NextResponse.json({ error: 'Failed to delete payment' }, { status: 500 });
  }
}
