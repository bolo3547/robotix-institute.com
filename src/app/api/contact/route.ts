import { NextRequest, NextResponse } from 'next/server';

// In-memory store for contact submissions (replace with real DB in production)
const contactSubmissions: any[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, program, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    const submission = {
      id: `contact-${Date.now()}`,
      name,
      email,
      phone: phone || '',
      program: program || '',
      message,
      createdAt: new Date().toISOString(),
      read: false,
    };

    contactSubmissions.push(submission);

    return NextResponse.json(
      { message: 'Message received! We will get back to you soon.' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to submit message' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Return all contact submissions (for admin use)
  return NextResponse.json(contactSubmissions, { status: 200 });
}
