import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      position, fullName, email, phone, location, dateOfBirth, gender,
      education, experience, skills, hasTeachingExp, yearsExperience,
      linkedIn, portfolio, whyJoin, availability, startDate, hearAbout, additionalInfo,
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

    // Store as a PageContent entry with pageId "join-team-applications"
    // We'll append to existing content or create new
    const key = `join_team_${Date.now()}`;
    
    await prisma.siteSetting.create({
      data: {
        key,
        value: JSON.stringify({
          type: 'join_team_application',
          position,
          fullName,
          email,
          phone,
          location,
          dateOfBirth,
          gender,
          education,
          experience,
          skills,
          hasTeachingExp,
          yearsExperience,
          linkedIn,
          portfolio,
          whyJoin,
          availability,
          startDate,
          hearAbout,
          additionalInfo,
          submittedAt: new Date().toISOString(),
          status: 'pending',
        }),
      },
    });

    return NextResponse.json(
      { message: 'Application submitted successfully' },
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

export async function GET() {
  try {
    const applications = await prisma.siteSetting.findMany({
      where: { key: { startsWith: 'join_team_' } },
      orderBy: { id: 'desc' },
    });

    const parsed = applications.map(a => ({
      id: a.id,
      key: a.key,
      ...JSON.parse(a.value),
    }));

    return NextResponse.json(parsed);
  } catch (error) {
    console.error('Get applications error:', error);
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
  }
}
