import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/adminAuth';

// GET - Fetch all quotation requests (admin only)
export async function GET(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const requests = await prisma.quoteRequest.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({
      success: true,
      data: requests,
      count: requests.length,
    });
  } catch (error) {
    console.error('Error fetching quotation requests:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch quotation requests' },
      { status: 500 }
    );
  }
}

// POST - Create a new quotation request (public)
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

    // Create the quotation request in the database
    const newRequest = await prisma.quoteRequest.create({
      data: {
        name: parentName,
        email: parentEmail,
        phone: parentPhone,
        organization: childName, // store child info in organization field
        programInterest: Array.isArray(programs) ? programs.join(', ') : programs,
        numberOfStudents: childAge ? parseInt(String(childAge), 10) : null,
        message: [
          preferredSchedule ? `Preferred schedule: ${preferredSchedule}` : '',
          message || '',
        ].filter(Boolean).join('\n'),
        status: 'pending',
      },
    });

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

// DELETE - Delete a quotation request (admin only)
export async function DELETE(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Request ID is required' },
        { status: 400 }
      );
    }

    await prisma.quoteRequest.delete({ where: { id } });

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

// PATCH - Update a quotation request status (admin only)
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
