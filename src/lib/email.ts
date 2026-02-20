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

/* ───────────────── Quotation Email Functions ───────────────── */

/** Send confirmation to parent when they submit a quotation request */
export async function sendQuoteRequestConfirmation(data: {
  parentName: string;
  parentEmail: string;
  childName: string;
  programs: string;
}) {
  const body = `
    <p style="color:#18181b;font-size:15px;line-height:1.6">Dear <strong>${data.parentName}</strong>,</p>
    <p style="color:#18181b;font-size:15px;line-height:1.6">
      Thank you for requesting a quotation for <strong>${data.childName}</strong> at ROBOTIX Institute!
      We have received your request and our team is now preparing a customised quote.
    </p>

    <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:12px;padding:20px;margin:20px 0;text-align:center">
      <div style="font-size:36px;margin-bottom:8px">📝</div>
      <h3 style="margin:0 0 4px;color:#1e40af;font-size:17px">Quotation Request Received</h3>
      <p style="margin:0;color:#1d4ed8;font-size:13px">You'll receive a detailed PDF quotation within 24 hours</p>
    </div>

    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;margin:20px 0">
      <table style="width:100%;font-size:14px;color:#18181b">
        <tr><td style="padding:4px 0;font-weight:600;width:140px">Child&rsquo;s Name:</td><td>${data.childName}</td></tr>
        <tr><td style="padding:4px 0;font-weight:600">Programs:</td><td>${data.programs}</td></tr>
      </table>
    </div>

    <h3 style="color:#18181b;font-size:16px;margin:24px 0 12px">What happens next?</h3>
    <ol style="color:#3f3f46;font-size:14px;line-height:1.8;padding-left:20px">
      <li>Our team reviews your requirements</li>
      <li>We prepare a personalised quotation with pricing details</li>
      <li>You&rsquo;ll receive a professional PDF quotation via email</li>
      <li>We may call to discuss your child&rsquo;s specific needs</li>
    </ol>

    <p style="color:#18181b;font-size:15px;line-height:1.6;margin-top:20px">
      If you have any questions in the meantime, please don&rsquo;t hesitate to
      <a href="${SITE}/contact" style="color:#7c3aed">contact us</a> or call us at <strong>+260 956 355 117</strong>.
    </p>

    <p style="color:#18181b;font-size:15px;margin-top:24px">
      Warm regards,<br>
      <strong>The ROBOTIX Institute Team</strong>
    </p>`;

  await transporter.sendMail({
    from: FROM,
    to: data.parentEmail,
    subject: `📝 Quotation Request Received — ${data.childName} at ROBOTIX Institute`,
    html: baseLayout('Quotation Request Received', body),
  });
}

/** Notify admin when a new quotation request is submitted */
export async function sendAdminNewQuoteNotification(data: {
  requestId: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  childName: string;
  childAge: number;
  programs: string;
  message?: string;
}) {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
  if (!adminEmail) return;

  const body = `
    <p style="color:#18181b;font-size:15px;line-height:1.6">A new quotation request has been submitted and is waiting for your review.</p>
    <div style="background:#fef3c7;border:1px solid #fcd34d;border-radius:8px;padding:16px;margin:20px 0">
      <table style="width:100%;font-size:14px;color:#18181b">
        <tr><td style="padding:4px 0;font-weight:600;width:140px">Parent:</td><td>${data.parentName}</td></tr>
        <tr><td style="padding:4px 0;font-weight:600">Email:</td><td><a href="mailto:${data.parentEmail}" style="color:#7c3aed">${data.parentEmail}</a></td></tr>
        <tr><td style="padding:4px 0;font-weight:600">Phone:</td><td>${data.parentPhone}</td></tr>
        <tr><td style="padding:4px 0;font-weight:600">Child:</td><td>${data.childName} (Age: ${data.childAge})</td></tr>
        <tr><td style="padding:4px 0;font-weight:600">Programs:</td><td>${data.programs}</td></tr>
        ${data.message ? `<tr><td style="padding:4px 0;font-weight:600;vertical-align:top">Message:</td><td>${data.message}</td></tr>` : ''}
      </table>
    </div>
    <div style="text-align:center;margin:24px 0">
      <a href="${SITE}/admin/quotations" style="display:inline-block;background:#7c3aed;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">Review &amp; Create Quotation</a>
    </div>
    <p style="color:#71717a;font-size:13px;margin-top:16px">Request ID: ${data.requestId}</p>`;

  await transporter.sendMail({
    from: FROM,
    to: adminEmail,
    subject: `💰 New Quotation Request: ${data.parentName} — ${data.programs}`,
    html: baseLayout('New Quotation Request', body),
  });
}

/** Send a completed quotation to the parent (with optional PDF attachment) */
export async function sendQuotationToParent(data: {
  parentName: string;
  parentEmail: string;
  childName: string;
  quotationNumber: string;
  items: { programName: string; pricePerMonth: number; duration: string }[];
  subtotal: number;
  discount?: number;
  discountReason?: string;
  total: number;
  currency: string;
  validUntil: Date;
  notes?: string;
  pdfBuffer?: Buffer;
}) {
  const itemRows = data.items.map(item => `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #e4e4e7;font-size:14px;color:#18181b">${item.programName}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e4e4e7;font-size:14px;color:#18181b">${item.duration}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e4e4e7;font-size:14px;color:#18181b;text-align:right">${data.currency} ${item.pricePerMonth.toLocaleString()}</td>
    </tr>`).join('');

  const body = `
    <p style="color:#18181b;font-size:15px;line-height:1.6">Dear <strong>${data.parentName}</strong>,</p>
    <p style="color:#18181b;font-size:15px;line-height:1.6">
      Thank you for your interest in ROBOTIX Institute! Please find below the quotation 
      for <strong>${data.childName}</strong>&rsquo;s programs.
    </p>

    <div style="background:linear-gradient(135deg,#ede9fe,#e0e7ff);border:1px solid #c4b5fd;border-radius:12px;padding:20px;margin:20px 0;text-align:center">
      <div style="font-size:36px;margin-bottom:8px">📄</div>
      <h3 style="margin:0 0 4px;color:#5b21b6;font-size:17px">Quotation ${data.quotationNumber}</h3>
      <p style="margin:0;color:#6d28d9;font-size:13px">Valid until ${new Date(data.validUntil).toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
    </div>

    <!-- Pricing Table -->
    <table style="width:100%;border-collapse:collapse;margin:20px 0;border:1px solid #e4e4e7;border-radius:8px;overflow:hidden">
      <thead>
        <tr style="background:#f4f4f5">
          <th style="padding:10px 12px;text-align:left;font-size:13px;font-weight:600;color:#71717a;border-bottom:1px solid #e4e4e7">Program</th>
          <th style="padding:10px 12px;text-align:left;font-size:13px;font-weight:600;color:#71717a;border-bottom:1px solid #e4e4e7">Duration</th>
          <th style="padding:10px 12px;text-align:right;font-size:13px;font-weight:600;color:#71717a;border-bottom:1px solid #e4e4e7">Price/Month</th>
        </tr>
      </thead>
      <tbody>
        ${itemRows}
      </tbody>
      <tfoot>
        <tr>
          <td colspan="2" style="padding:8px 12px;font-size:14px;font-weight:600;color:#18181b;border-bottom:1px solid #e4e4e7">Subtotal</td>
          <td style="padding:8px 12px;text-align:right;font-size:14px;font-weight:600;color:#18181b;border-bottom:1px solid #e4e4e7">${data.currency} ${data.subtotal.toLocaleString()}</td>
        </tr>
        ${data.discount ? `
        <tr>
          <td colspan="2" style="padding:8px 12px;font-size:14px;color:#16a34a;border-bottom:1px solid #e4e4e7">Discount${data.discountReason ? ` (${data.discountReason})` : ''}</td>
          <td style="padding:8px 12px;text-align:right;font-size:14px;color:#16a34a;border-bottom:1px solid #e4e4e7">-${data.currency} ${data.discount.toLocaleString()}</td>
        </tr>` : ''}
        <tr style="background:#f0fdf4">
          <td colspan="2" style="padding:10px 12px;font-size:16px;font-weight:700;color:#15803d">Total/Month</td>
          <td style="padding:10px 12px;text-align:right;font-size:16px;font-weight:700;color:#15803d">${data.currency} ${data.total.toLocaleString()}</td>
        </tr>
      </tfoot>
    </table>

    ${data.notes ? `
    <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px;padding:16px;margin:16px 0">
      <p style="margin:0 0 4px;font-weight:600;color:#0369a1;font-size:13px">Notes:</p>
      <p style="margin:0;color:#0c4a6e;font-size:14px;line-height:1.5">${data.notes}</p>
    </div>` : ''}

    <h3 style="color:#18181b;font-size:16px;margin:24px 0 12px">Next Steps:</h3>
    <ol style="color:#3f3f46;font-size:14px;line-height:1.8;padding-left:20px">
      <li>Review the quotation details above</li>
      <li>Reply to this email or call us at <strong>+260 956 355 117</strong> to confirm</li>
      <li>Complete enrollment at <a href="${SITE}/enroll" style="color:#7c3aed">${SITE.replace('https://', '')}/enroll</a></li>
    </ol>

    <div style="text-align:center;margin:24px 0">
      <a href="${SITE}/enroll" style="display:inline-block;background:#7c3aed;color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px">Enroll Now</a>
    </div>

    <p style="color:#18181b;font-size:15px;line-height:1.6;margin-top:20px">
      This quotation is valid until <strong>${new Date(data.validUntil).toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' })}</strong>.
      If you have any questions, please don&rsquo;t hesitate to contact us.
    </p>

    <p style="color:#18181b;font-size:15px;margin-top:24px">
      Warm regards,<br>
      <strong>The ROBOTIX Institute Team</strong>
    </p>`;

  const mailOptions: nodemailer.SendMailOptions = {
    from: FROM,
    to: data.parentEmail,
    subject: `📄 Your Quotation ${data.quotationNumber} — ROBOTIX Institute`,
    html: baseLayout(`Quotation ${data.quotationNumber}`, body),
  };

  // Attach PDF if provided
  if (data.pdfBuffer) {
    mailOptions.attachments = [
      {
        filename: `${data.quotationNumber}.pdf`,
        content: data.pdfBuffer,
        contentType: 'application/pdf',
      },
    ];
  }

  await transporter.sendMail(mailOptions);
}
