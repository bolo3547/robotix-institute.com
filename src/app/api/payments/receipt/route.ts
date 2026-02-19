import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getToken } from 'next-auth/jwt';

// GET /api/payments/receipt?id=xxx - Get receipt data for a specific payment
export async function GET(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  if (!token || !token.id) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Payment ID is required' }, { status: 400 });
  }

  const payment = await prisma.payment.findUnique({
    where: { id },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  if (!payment) {
    return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
  }

  // Parents can only see their own receipts; admins can see all
  if (payment.userId !== token.id && token.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  if (payment.status !== 'paid') {
    return NextResponse.json({ error: 'Receipt only available for paid payments' }, { status: 400 });
  }

  // Return receipt data
  const receipt = {
    receiptNumber: payment.receiptNumber,
    date: payment.paidAt,
    payer: {
      name: payment.user.name,
      email: payment.user.email,
    },
    description: payment.description,
    amount: payment.amount,
    currency: payment.currency,
    method: payment.method,
    reference: payment.reference,
    notes: payment.notes,
    organization: {
      name: 'ROBOTIX Institute',
      address: 'No. 7 Mistry Court, Great East Road, Lusaka',
      phone: '+260 956 355 117',
      email: 'info@robotixinstitute.io',
    },
  };

  return NextResponse.json(receipt);
}
