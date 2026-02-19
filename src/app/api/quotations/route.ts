import { NextRequest, NextResponse } from 'next/server';
import { QuotationRequest } from '@/types';

// Quotation requests storage
const quotationRequests: QuotationRequest[] = [];

// GET - Fetch all quotation requests
export async function GET() {
  return NextResponse.json({
    success: true,
    data: quotationRequests,
    count: quotationRequests.length,
  });
}

// POST - Create a new quotation request
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { parentName, parentEmail, parentPhone, childName, childAge, programs, preferredSchedule, message } = body;

    // Validate required fields
    if (!parentName || !parentEmail || !parentPhone || !childName || !childAge || !programs?.length) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create the quotation request
    const newRequest: QuotationRequest = {
      id: `QR-${Date.now()}`,
      parentName,
      parentEmail,
      parentPhone,
      childName,
      childAge,
      programs,
      preferredSchedule: preferredSchedule || undefined,
      message: message || undefined,
      createdAt: new Date(),
      status: 'pending',
    };

    quotationRequests.unshift(newRequest);

    // In a real app, you would:
    // 1. Save to database
    // 2. Send confirmation email to parent
    // 3. Send notification to admin

    return NextResponse.json({
      success: true,
      data: newRequest,
      message: 'Quote request submitted successfully',
    });

  } catch (error) {
    console.error('Error creating quotation request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create quotation request' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a quotation request
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Request ID is required' },
        { status: 400 }
      );
    }

    const index = quotationRequests.findIndex(r => r.id === id);
    if (index === -1) {
      return NextResponse.json(
        { success: false, error: 'Request not found' },
        { status: 404 }
      );
    }

    quotationRequests.splice(index, 1);

    return NextResponse.json({
      success: true,
      message: 'Request deleted successfully',
    });

  } catch (error) {
    console.error('Error deleting quotation request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete request' },
      { status: 500 }
    );
  }
}

// PATCH - Update a quotation request status
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: 'Request ID and status are required' },
        { status: 400 }
      );
    }

    const requestIndex = quotationRequests.findIndex(r => r.id === id);
    if (requestIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Request not found' },
        { status: 404 }
      );
    }

    quotationRequests[requestIndex].status = status;

    return NextResponse.json({
      success: true,
      data: quotationRequests[requestIndex],
      message: 'Request updated successfully',
    });

  } catch (error) {
    console.error('Error updating quotation request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update request' },
      { status: 500 }
    );
  }
}
