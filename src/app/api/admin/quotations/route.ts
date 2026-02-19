import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import { Quotation} from '@/types';

// Quotations storage
const quotations: Quotation[] = [];

// Generate quotation number
function generateQuotationNumber(): string {
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `ROBOTIX-${year}${month}-${random}`;
}

// GET - Fetch all quotations
export async function GET() {
  return NextResponse.json({
    success: true,
    data: quotations,
    count: quotations.length,
  });
}

// POST - Create a new quotation
export async function POST(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;
  try {
    const body = await request.json();

    const quotation: Quotation = {
      id: `Q-${Date.now()}`,
      quotationNumber: generateQuotationNumber(),
      ...body,
      status: 'sent',
      sentAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    quotations.unshift(quotation);

    // In a real app, you would:
    // 1. Save to database
    // 2. Generate PDF
    // 3. Send email with PDF attachment to parent

    return NextResponse.json({
      success: true,
      data: quotation,
      message: 'Quotation created and sent successfully',
    });

  } catch (error) {
    console.error('Error creating quotation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create quotation' },
      { status: 500 }
    );
  }
}

// PATCH - Update quotation status
export async function PATCH(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: 'Quotation ID and status are required' },
        { status: 400 }
      );
    }

    const quoteIndex = quotations.findIndex(q => q.id === id);
    if (quoteIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Quotation not found' },
        { status: 404 }
      );
    }

    quotations[quoteIndex].status = status;
    quotations[quoteIndex].updatedAt = new Date();

    return NextResponse.json({
      success: true,
      data: quotations[quoteIndex],
      message: 'Quotation updated successfully',
    });

  } catch (error) {
    console.error('Error updating quotation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update quotation' },
      { status: 500 }
    );
  }
}
