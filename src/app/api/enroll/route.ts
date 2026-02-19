import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

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
      // Create parent user with a temporary password (they can use signup/reset later)
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

    // Create student user linked to parent
    const { hash: hashFn } = await import('bcryptjs');
    const studentTempPassword = await hashFn(`student_${Date.now()}`, 10);

    const studentUser = await prisma.user.create({
      data: {
        email: `${studentFirstName.toLowerCase()}.${studentLastName.toLowerCase()}.${Date.now()}@student.robotix`,
        name: `${studentFirstName} ${studentLastName}`,
        password: studentTempPassword,
        role: 'student',
        parentId: parentUser.id,
      },
    });

    // Create enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        userId: studentUser.id,
        program: programName,
        level: ['robotics_foundations', 'coding_basics', 'digital_skills'].includes(program) ? 'beginner' 
          : program === 'python' ? 'intermediate' : 'advanced',
        status: 'active',
        notes: JSON.stringify({
          preferredSchedule,
          studentDOB, studentGender, studentGrade, previousExperience, learningGoals,
          parentRelation, parentAltPhone, parentAddress, parentCity,
          medicalConditions, allergies, medications,
          emergencyName, emergencyPhone, emergencyRelation,
          howHeard, specialNeeds, photoConsent, paymentMethod,
          enrolledAt: new Date().toISOString(),
        }),
      },
    });

    return NextResponse.json(
      { 
        message: 'Enrollment submitted successfully',
        enrollmentId: enrollment.id,
        studentId: studentUser.id,
        parentId: parentUser.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Enrollment error:', error);
    return NextResponse.json(
      { error: 'Failed to process enrollment' },
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
