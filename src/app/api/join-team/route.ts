import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/adminAuth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      position, fullName, email, phone, location,
      education, experience, skills, hasTeachingExp, yearsExperience,
      linkedIn, portfolio: _portfolio, whyJoin, availability, startDate, hearAbout, additionalInfo,
    } = body;

    // Validate required fields
    if (!position || !fullName || !email || !phone || !location) {
      return NextResponse.json({ error: 'Required fields are missing' }, { status: 400 });
    }

    if (!email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    if (!whyJoin?.trim()) {
      return NextResponse.json({ error: 'You must tell us why you want to join' }, { status: 400 });
    }

    // Store using the proper TeamApplication model
    const application = await prisma.teamApplication.create({
      data: {
        name: fullName,
        email,
        phone: phone || null,
        position,
        experience: [
          experience ? `Experience: ${experience}` : '',
          skills ? `Skills: ${skills}` : '',
          hasTeachingExp ? `Teaching exp: ${hasTeachingExp}, ${yearsExperience || 0} years` : '',
          education ? `Education: ${education}` : '',
          availability ? `Availability: ${availability}` : '',
          startDate ? `Start date: ${startDate}` : '',
          hearAbout ? `Heard about us: ${hearAbout}` : '',
        ].filter(Boolean).join('\n'),
        linkedIn: linkedIn || null,
        coverLetter: [
          whyJoin ? `Why join: ${whyJoin}` : '',
          additionalInfo ? `Additional info: ${additionalInfo}` : '',
        ].filter(Boolean).join('\n'),
        status: 'pending',
      },
    });

    return NextResponse.json(
      { message: 'Application submitted successfully', id: application.id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Join team submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit application' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const applications = await prisma.teamApplication.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(applications);
  } catch (error) {
    console.error('Get applications error:', error);
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
  }
}
