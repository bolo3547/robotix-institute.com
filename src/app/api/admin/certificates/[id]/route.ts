import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET — Single certificate
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cert = await prisma.certificate.findUnique({
      where: { id: params.id },
      include: { user: { select: { id: true, name: true, email: true } } },
    });
    if (!cert) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(cert);
  } catch (error) {
    console.error('Fetch certificate failed:', error);
    return NextResponse.json({ error: 'Failed to fetch certificate' }, { status: 500 });
  }
}

// PATCH — Update certificate fields or publish/unpublish
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const {
      childName, courseName, grade, issueDate, certNumber,
      skills, instructorName, directorName, cohort, completionHours, description,
      status,
    } = body;

    // Build update data
    const data: Record<string, unknown> = {};
    if (childName !== undefined) data.childName = childName;
    if (courseName !== undefined) data.courseName = courseName;
    if (grade !== undefined) data.grade = grade;
    if (issueDate !== undefined) data.issueDate = new Date(issueDate);
    if (certNumber !== undefined) data.certNumber = certNumber;
    if (skills !== undefined) data.skills = JSON.stringify(skills);
    if (instructorName !== undefined) data.instructorName = instructorName;
    if (directorName !== undefined) data.directorName = directorName;
    if (cohort !== undefined) data.cohort = cohort;
    if (completionHours !== undefined) data.completionHours = completionHours;
    if (description !== undefined) data.description = description;

    // Publish / Unpublish
    if (status === 'published') {
      data.status = 'published';
      data.publishedAt = new Date();
    } else if (status === 'draft') {
      data.status = 'draft';
      data.publishedAt = null;
    }

    const updated = await prisma.certificate.update({
      where: { id: params.id },
      data,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Update certificate failed:', error);
    return NextResponse.json({ error: 'Failed to update certificate' }, { status: 500 });
  }
}

// DELETE
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.certificate.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete certificate failed:', error);
    return NextResponse.json({ error: 'Failed to delete certificate' }, { status: 500 });
  }
}
