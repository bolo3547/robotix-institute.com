import nodemailer from 'nodemailer';

/* ───────────────── Transporter ───────────────── */

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const FROM = process.env.EMAIL_FROM || 'ROBOTIX Institute <noreply@robotixinstitute.io>';
const SITE = process.env.NEXT_PUBLIC_APP_URL || 'https://robotix-platform.vercel.app';

/* ───────────────── Helpers ───────────────── */

function baseLayout(title: string, body: string) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Segoe UI',Roboto,sans-serif">
  <div style="max-width:600px;margin:24px auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e4e4e7">
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#7c3aed,#4f46e5);padding:28px 32px;text-align:center">
      <h1 style="margin:0;color:#fff;font-size:22px;letter-spacing:0.5px">🤖 ROBOTIX Institute</h1>
      <p style="margin:6px 0 0;color:rgba(255,255,255,.75);font-size:13px">${title}</p>
    </div>
    <!-- Body -->
    <div style="padding:32px">${body}</div>
    <!-- Footer -->
    <div style="background:#fafafa;border-top:1px solid #e4e4e7;padding:20px 32px;text-align:center;font-size:12px;color:#71717a">
      <p style="margin:0">ROBOTIX Institute &middot; Lusaka, Zambia</p>
      <p style="margin:4px 0 0"><a href="${SITE}" style="color:#7c3aed;text-decoration:none">${SITE.replace('https://','')}</a></p>
    </div>
  </div>
</body>
</html>`;
}

/* ───────────────── Email Functions ───────────────── */

/** Notify admin when a new enrollment application is submitted */
export async function sendAdminNewApplicationNotification(data: {
  applicationId: string;
  studentName: string;
  program: string;
  parentName: string;
  parentEmail: string;
}) {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
  if (!adminEmail) return;

  const body = `
    <p style="color:#18181b;font-size:15px;line-height:1.6">A new enrollment application has been submitted and is waiting for your review.</p>
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;margin:20px 0">
      <table style="width:100%;font-size:14px;color:#18181b">
        <tr><td style="padding:4px 0;font-weight:600;width:120px">Student:</td><td>${data.studentName}</td></tr>
        <tr><td style="padding:4px 0;font-weight:600">Program:</td><td>${data.program}</td></tr>
        <tr><td style="padding:4px 0;font-weight:600">Parent:</td><td>${data.parentName}</td></tr>
        <tr><td style="padding:4px 0;font-weight:600">Email:</td><td>${data.parentEmail}</td></tr>
      </table>
    </div>
    <div style="text-align:center;margin:24px 0">
      <a href="${SITE}/admin/enrollment-applications" style="display:inline-block;background:#7c3aed;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">Review Application</a>
    </div>`;

  await transporter.sendMail({
    from: FROM,
    to: adminEmail,
    subject: `📋 New Enrollment Application: ${data.studentName} — ${data.program}`,
    html: baseLayout('New Enrollment Application', body),
  });
}

/** Send acceptance letter to parent */
export async function sendAcceptanceLetter(data: {
  parentName: string;
  parentEmail: string;
  studentName: string;
  program: string;
  schedule?: string;
  startDate?: string;
  adminMessage?: string;
}) {
  const body = `
    <p style="color:#18181b;font-size:15px;line-height:1.6">Dear <strong>${data.parentName}</strong>,</p>
    <p style="color:#18181b;font-size:15px;line-height:1.6">
      We are delighted to inform you that <strong>${data.studentName}</strong>'s application to 
      <strong>${data.program}</strong> at ROBOTIX Institute has been <span style="color:#16a34a;font-weight:700">accepted</span>! 🎉
    </p>

    <div style="background:linear-gradient(135deg,#f0fdf4,#ecfdf5);border:2px solid #86efac;border-radius:12px;padding:24px;margin:20px 0;text-align:center">
      <div style="font-size:40px;margin-bottom:8px">🎓</div>
      <h2 style="margin:0 0 4px;color:#15803d;font-size:20px">Enrollment Confirmed</h2>
      <p style="margin:0;color:#166534;font-size:14px">${data.program}</p>
    </div>

    <table style="width:100%;font-size:14px;color:#18181b;margin:20px 0">
      <tr><td style="padding:6px 0;font-weight:600;width:140px">Student:</td><td>${data.studentName}</td></tr>
      <tr><td style="padding:6px 0;font-weight:600">Program:</td><td>${data.program}</td></tr>
      ${data.schedule ? `<tr><td style="padding:6px 0;font-weight:600">Schedule:</td><td>${data.schedule}</td></tr>` : ''}
      ${data.startDate ? `<tr><td style="padding:6px 0;font-weight:600">Start Date:</td><td>${new Date(data.startDate).toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' })}</td></tr>` : ''}
    </table>

    ${data.adminMessage ? `
    <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:16px;margin:16px 0">
      <p style="margin:0 0 4px;font-weight:600;color:#1e40af;font-size:13px">Message from Admin:</p>
      <p style="margin:0;color:#1e3a5f;font-size:14px;line-height:1.5">${data.adminMessage}</p>
    </div>` : ''}

    <h3 style="color:#18181b;font-size:16px;margin:24px 0 12px">Next Steps:</h3>
    <ol style="color:#3f3f46;font-size:14px;line-height:1.8;padding-left:20px">
      <li>Log in to your parent dashboard at <a href="${SITE}/auth/login" style="color:#7c3aed">${SITE.replace('https://','')}</a></li>
      <li>Complete any outstanding payment for the selected program</li>
      <li>Ensure your child is ready for the first class as per the schedule above</li>
      <li>Check the <a href="${SITE}/programs" style="color:#7c3aed">Programs page</a> for materials and preparation tips</li>
    </ol>

    <p style="color:#18181b;font-size:15px;line-height:1.6;margin-top:20px">
      We look forward to welcoming <strong>${data.studentName}</strong> to the ROBOTIX family! 
      If you have any questions, please don't hesitate to <a href="${SITE}/contact" style="color:#7c3aed">contact us</a>.
    </p>

    <p style="color:#18181b;font-size:15px;margin-top:24px">
      Warm regards,<br>
      <strong>The ROBOTIX Institute Team</strong>
    </p>`;

  await transporter.sendMail({
    from: FROM,
    to: data.parentEmail,
    subject: `🎉 Acceptance Letter — ${data.studentName} is enrolled in ${data.program}!`,
    html: baseLayout('Acceptance Letter', body),
  });
}

/** Send rejection/waitlist notice to parent */
export async function sendRejectionNotice(data: {
  parentName: string;
  parentEmail: string;
  studentName: string;
  program: string;
  reason?: string;
  waitlisted?: boolean;
}) {
  const status = data.waitlisted ? 'waitlisted' : 'not accepted at this time';
  const body = `
    <p style="color:#18181b;font-size:15px;line-height:1.6">Dear <strong>${data.parentName}</strong>,</p>
    <p style="color:#18181b;font-size:15px;line-height:1.6">
      Thank you for your interest in enrolling <strong>${data.studentName}</strong> in 
      <strong>${data.program}</strong> at ROBOTIX Institute.
    </p>
    <p style="color:#18181b;font-size:15px;line-height:1.6">
      After careful review, we regret to inform you that the application has been <strong>${status}</strong>.
    </p>

    ${data.reason ? `
    <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:16px;margin:16px 0">
      <p style="margin:0 0 4px;font-weight:600;color:#991b1b;font-size:13px">Reason:</p>
      <p style="margin:0;color:#7f1d1d;font-size:14px;line-height:1.5">${data.reason}</p>
    </div>` : ''}

    ${data.waitlisted ? `
    <p style="color:#18181b;font-size:15px;line-height:1.6">
      Your child has been placed on our waiting list and will be contacted if a spot becomes available.
    </p>` : ''}

    <p style="color:#18181b;font-size:15px;line-height:1.6;margin-top:16px">
      We encourage you to explore our other programs or apply again in the next enrollment period.
      Please <a href="${SITE}/contact" style="color:#7c3aed">contact us</a> if you have any questions.
    </p>

    <p style="color:#18181b;font-size:15px;margin-top:24px">
      Kind regards,<br>
      <strong>The ROBOTIX Institute Team</strong>
    </p>`;

  await transporter.sendMail({
    from: FROM,
    to: data.parentEmail,
    subject: data.waitlisted
      ? `⏳ Waitlist Notice — ${data.studentName}'s application for ${data.program}`
      : `Application Update — ${data.studentName}'s application for ${data.program}`,
    html: baseLayout(data.waitlisted ? 'Waitlist Notice' : 'Application Update', body),
  });
}

/** Send confirmation to parent when application is received */
export async function sendApplicationConfirmation(data: {
  parentName: string;
  parentEmail: string;
  studentName: string;
  program: string;
}) {
  const body = `
    <p style="color:#18181b;font-size:15px;line-height:1.6">Dear <strong>${data.parentName}</strong>,</p>
    <p style="color:#18181b;font-size:15px;line-height:1.6">
      Thank you for submitting an enrollment application for <strong>${data.studentName}</strong> 
      to <strong>${data.program}</strong> at ROBOTIX Institute!
    </p>
    
    <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:12px;padding:20px;margin:20px 0;text-align:center">
      <div style="font-size:36px;margin-bottom:8px">📋</div>
      <h3 style="margin:0 0 4px;color:#1e40af;font-size:17px">Application Received</h3>
      <p style="margin:0;color:#1d4ed8;font-size:13px">Under review — you'll hear back within 3–5 business days</p>
    </div>

    <p style="color:#18181b;font-size:15px;line-height:1.6">
      Our team will review the application and send you an acceptance letter once approved. 
      You can track the status from your parent dashboard.
    </p>

    <p style="color:#18181b;font-size:15px;margin-top:24px">
      Warm regards,<br>
      <strong>The ROBOTIX Institute Team</strong>
    </p>`;

  await transporter.sendMail({
    from: FROM,
    to: data.parentEmail,
    subject: `📋 Application Received — ${data.studentName} for ${data.program}`,
    html: baseLayout('Application Received', body),
  });
}
