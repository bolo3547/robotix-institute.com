export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/portfolio/certificate/[id] — download certificate as formatted text file
export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cert = await prisma.certificate.findUnique({
      where: { id: params.id },
      include: {
        user: { select: { name: true } },
      },
    });

    if (!cert) {
      return NextResponse.json({ error: 'Certificate not found' }, { status: 404 });
    }

    const skills = (() => {
      try { return JSON.parse(cert.skills || '[]'); }
      catch { return []; }
    })() as string[];

    const gradeLabel = cert.grade === 'distinction' ? 'DISTINCTION' : cert.grade === 'merit' ? 'MERIT' : 'PASS';
    const issueDate = new Date(cert.issueDate).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'long', year: 'numeric',
    });

    // Generate a professional certificate document
    const border = '═'.repeat(60);
    const certText = `
╔${border}╗
║                                                            ║
║              🏆  ROBOTIX INSTITUTE ZAMBIA  🏆               ║
║                                                            ║
║                  CERTIFICATE OF COMPLETION                 ║
║                                                            ║
╠${border}╣
║                                                            ║
║    This is to certify that                                 ║
║                                                            ║
║    ${(cert.user.name || 'Student').padEnd(52)}  ║
║                                                            ║
║    has successfully completed the course                   ║
║                                                            ║
║    ${cert.courseName.padEnd(52)}  ║
║                                                            ║
║    with grade: ${gradeLabel.padEnd(41)}  ║
║                                                            ║
╠${border}╣
║                                                            ║
║    ${cert.description?.substring(0, 54).padEnd(54) || ''.padEnd(54)}  ║
║    ${(cert.description?.substring(54, 108) || '').padEnd(54)}  ║
║                                                            ║
║    Skills Acquired:                                        ║
${skills.map(s => `║      • ${s.padEnd(50)}  ║`).join('\n')}
║                                                            ║
╠${border}╣
║                                                            ║
║    Certificate No: ${cert.certNumber.padEnd(37)}  ║
║    Date of Issue:  ${issueDate.padEnd(37)}  ║
║    Instructor:     ${(cert.instructorName || 'N/A').padEnd(37)}  ║
║                                                            ║
║                                                            ║
║    _________________________    _________________________  ║
║    Instructor Signature          Director, Robotix Institute║
║                                                            ║
╚${border}╝

    This certificate was issued by Robotix Institute, Zambia.
    Verify at: https://robotix-platform.vercel.app/certificates/${cert.certNumber}
`.trim();

    const filename = `Robotix_Certificate_${cert.courseName.replace(/[^a-zA-Z0-9]/g, '_')}_${cert.user.name?.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;

    return new Response(certText, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Certificate download error:', error);
    return NextResponse.json({ error: 'Certificate download failed' }, { status: 500 });
  }
}
