import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import prisma from '@/lib/prisma';
import { sendQuotationToParent } from '@/lib/email';
import { Quotation } from '@/types';

// Generate quotation number
function generateQuotationNumber(): string {
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `ROBOTIX-${year}${month}-${random}`;
}

// GET - Fetch all sent quotations (reads QuoteRequests with status != 'pending')
export async function GET(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const quotedRequests = await prisma.quoteRequest.findMany({
      where: { status: { not: 'pending' } },
      orderBy: { quotedAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      data: quotedRequests,
      count: quotedRequests.length,
    });
  } catch (error) {
    console.error('Error fetching quotations:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch quotations' },
      { status: 500 }
    );
  }
}

// POST - Create & send a quotation to the parent
export async function POST(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const body: Quotation = await request.json();

    const quotationNumber = body.quotationNumber || generateQuotationNumber();

    // Update the QuoteRequest in the database to mark it as quoted
    if (body.requestId) {
      await prisma.quoteRequest.update({
        where: { id: body.requestId },
        data: {
          status: 'quoted',
          quotedAmount: body.total,
          quotedAt: new Date(),
          adminNotes: body.notes || null,
        },
      });
    }

    // Send quotation email to the parent
    await sendQuotationToParent({
      parentName: body.parentName,
      parentEmail: body.parentEmail,
      childName: body.childName,
      quotationNumber,
      items: body.items.map((item) => ({
        programName: item.programName,
        pricePerMonth: item.pricePerMonth,
        duration: item.duration,
      })),
      subtotal: body.subtotal,
      discount: body.discount,
      discountReason: body.discountReason,
      total: body.total,
      currency: body.currency || 'ZMW',
      validUntil: body.validUntil,
      notes: body.notes,
    });

    return NextResponse.json({
      success: true,
      data: { ...body, quotationNumber, status: 'sent', sentAt: new Date() },
      message: 'Quotation sent to parent successfully',
    });
  } catch (error) {
    console.error('Error creating/sending quotation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create and send quotation' },
      { status: 500 }
    );
  }
}

// PATCH - Update quotation request status
export async function PATCH(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: 'Request ID and status are required' },
        { status: 400 }
      );
    }

    const updated = await prisma.quoteRequest.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({
      success: true,
      data: updated,
      message: 'Quotation status updated successfully',
    });
  } catch (error) {
    console.error('Error updating quotation status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update quotation status' },
      { status: 500 }
    );
  }
}
