import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import {
  sendApplicationConfirmation,
  sendAdminNewApplicationNotification,
} from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      program, preferredSchedule,
      studentFirstName, studentLastName, studentDOB, studentGender, studentGrade, previousExperience, learningGoals,
      parentFirstName, parentLastName, parentEmail, parentPhone, parentAltPhone, parentRelation, parentAddress, parentCity,
      medicalConditions, allergies, medications,
      emergencyName, emergencyPhone, emergencyRelation,
      howHeard, specialNeeds, photoConsent, termsAccepted, paymentMethod,
    } = body;

    // Validate required fields
    if (!program || !studentFirstName || !studentLastName || !studentDOB) {
      return NextResponse.json({ error: 'Student information is incomplete' }, { status: 400 });
    }

    if (!parentFirstName || !parentLastName || !parentEmail || !parentPhone || !parentRelation) {
      return NextResponse.json({ error: 'Parent/guardian information is incomplete' }, { status: 400 });
    }

    if (!parentEmail.includes('@')) {
      return NextResponse.json({ error: 'Valid parent email is required' }, { status: 400 });
    }

    if (!emergencyName || !emergencyPhone) {
      return NextResponse.json({ error: 'Emergency contact information is required' }, { status: 400 });
    }

    if (!termsAccepted) {
      return NextResponse.json({ error: 'You must accept the terms and conditions' }, { status: 400 });
    }

    // Map program ID to name
    const programNames: Record<string, string> = {
      'robotics_foundations': 'Robotics Foundations',
      'coding_basics': 'Coding Basics',
      'python': 'Python Programming',
      'advanced_robotics': 'Advanced Robotics',
      'ai_ml': 'AI & Machine Learning',
      'digital_skills': 'Digital Skills',
    };

    const programName = programNames[program] || program;

    // Check if parent exists, or create
    let parentUser = await prisma.user.findUnique({ where: { email: parentEmail } });

    if (!parentUser) {
      const { hash } = await import('bcryptjs');
      const tempPassword = await hash(`robotix_${Date.now()}`, 10);
      
      parentUser = await prisma.user.create({
        data: {
          email: parentEmail,
          name: `${parentFirstName} ${parentLastName}`,
          phone: parentPhone,
          password: tempPassword,
          role: 'parent',
        },
      });
    }

    // Create a PENDING application (admin will review & accept/reject)
    const application = await prisma.application.create({
      data: {
        parentId: parentUser.id,
        parentPhone: parentPhone,
        parentRelation: parentRelation,
        parentAddress: parentAddress || null,
        parentCity: parentCity || null,
        parentAltPhone: parentAltPhone || null,

        studentFirstName,
        studentLastName,
        studentDOB,
        studentGender: studentGender || null,
        studentGrade: studentGrade || null,
        previousExperience: previousExperience || null,
        learningGoals: learningGoals || null,

        program: programName,
        preferredSchedule: preferredSchedule || null,

        medicalConditions: medicalConditions || null,
        allergies: allergies || null,
        medications: medications || null,
        emergencyName,
        emergencyPhone,
        emergencyRelation: emergencyRelation || null,

        howHeard: howHeard || null,
        specialNeeds: specialNeeds || null,
        photoConsent: !!photoConsent,
        paymentMethod: paymentMethod || null,

        status: 'pending',
      },
    });

    // Send confirmation email to parent & notify admin
    try {
      await sendApplicationConfirmation({
        parentName: parentUser.name || `${parentFirstName} ${parentLastName}`,
        parentEmail: parentUser.email,
        studentName: `${studentFirstName} ${studentLastName}`,
        program: programName,
      });
    } catch (e) {
      console.error('Confirmation email error:', e);
    }

    try {
      await sendAdminNewApplicationNotification({
        applicationId: application.id,
        studentName: `${studentFirstName} ${studentLastName}`,
        program: programName,
        parentName: parentUser.name || `${parentFirstName} ${parentLastName}`,
        parentEmail: parentUser.email,
      });
    } catch (e) {
      console.error('Admin notification email error:', e);
    }

    return NextResponse.json(
      { 
        message: 'Application submitted successfully! You will receive an acceptance letter once reviewed.',
        applicationId: application.id,
        parentId: parentUser.id,
        status: 'pending',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Enrollment application error:', error);
    return NextResponse.json(
      { error: 'Failed to submit application' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const enrollments = await prisma.enrollment.findMany({
      include: {
        user: {
          select: { id: true, name: true, email: true, parent: { select: { name: true, email: true, phone: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(enrollments);
  } catch (error) {
    console.error('Get enrollments error:', error);
    return NextResponse.json({ error: 'Failed to fetch enrollments' }, { status: 500 });
  }
}
