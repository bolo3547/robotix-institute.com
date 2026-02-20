import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET — List all certificates (admin sees all, including drafts)
export async function GET() {
  try {
    const certificates = await prisma.certificate.findMany({
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { id: true, name: true, email: true } } },
    });
    return NextResponse.json(certificates);
  } catch (error) {
    console.error('Failed to fetch certificates:', error);
    return NextResponse.json({ error: 'Failed to fetch certificates' }, { status: 500 });
  }
}

// POST — Create a new certificate
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      userId, childName, courseName, grade, issueDate, certNumber,
      skills, instructorName, directorName, cohort, completionHours, description,
    } = body;

    if (!userId || !childName || !courseName || !grade || !certNumber) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, childName, courseName, grade, certNumber' },
        { status: 400 }
      );
    }

    // Check for duplicate certNumber
    const existing = await prisma.certificate.findUnique({ where: { certNumber } });
    if (existing) {
      return NextResponse.json({ error: 'Certificate number already exists' }, { status: 409 });
    }

    const certificate = await prisma.certificate.create({
      data: {
        userId,
        childName,
        courseName,
        grade,
        issueDate: new Date(issueDate || Date.now()),
        certNumber,
        skills: skills ? JSON.stringify(skills) : null,
        instructorName: instructorName || null,
        directorName: directorName || 'Dr. Chileshe Mwale',
        cohort: cohort || null,
        completionHours: completionHours || 0,
        description: description || null,
        status: 'draft',
      },
    });

    return NextResponse.json(certificate, { status: 201 });
  } catch (error) {
    console.error('Failed to create certificate:', error);
    return NextResponse.json({ error: 'Failed to create certificate' }, { status: 500 });
  }
}
