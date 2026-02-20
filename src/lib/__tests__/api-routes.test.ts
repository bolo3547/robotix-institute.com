import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';

/* ------------------------------------------------------------------
   Mock Prisma — we mock at the module level so every route that does
   `import prisma from '@/lib/prisma'` gets the mocked singleton.
   ------------------------------------------------------------------ */
const mockPrisma = {
  contactSubmission: {
    create: vi.fn(),
    findMany: vi.fn(),
  },
  event: { findMany: vi.fn() },
  schedule: { findMany: vi.fn(), create: vi.fn() },
  blogPost: { findMany: vi.fn() },
  certificate: { findMany: vi.fn() },
  enrollment: { create: vi.fn(), findMany: vi.fn(), count: vi.fn() },
  user: { findUnique: vi.fn(), findMany: vi.fn(), create: vi.fn() },
};

vi.mock('@/lib/prisma', () => ({
  default: mockPrisma,
  prisma: mockPrisma,
}));

/* Mock adminAuth — default: allow access (returns null) */
vi.mock('@/lib/adminAuth', () => ({
  requireAdmin: vi.fn().mockResolvedValue(null),
}));

/* Mock rate-limit — always allow */
vi.mock('@/lib/rateLimit', () => ({
  formLimiter: { check: vi.fn().mockReturnValue(null) },
  rateLimit: () => ({ check: vi.fn().mockReturnValue(null) }),
}));

/* Mock email — no-op */
vi.mock('@/lib/email', () => ({
  sendApplicationConfirmation: vi.fn().mockResolvedValue(undefined),
  sendAdminNewApplicationNotification: vi.fn().mockResolvedValue(undefined),
}));

/* Mock next-auth/jwt for adminAuth */
vi.mock('next-auth/jwt', () => ({
  getToken: vi.fn().mockResolvedValue({ role: 'admin', sub: 'admin-1' }),
}));

function jsonReq(url: string, body?: unknown, method = 'POST'): NextRequest {
  const init: RequestInit = { method, headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '127.0.0.1' } };
  if (body) init.body = JSON.stringify(body);
  return new NextRequest(new URL(url, 'http://localhost:3000'), init);
}

/* ================================================================
   CONTACT ROUTE
   ================================================================ */
describe('POST /api/contact', () => {
  let POST: (req: NextRequest) => Promise<NextResponse>;

  beforeEach(async () => {
    vi.clearAllMocks();
    const mod = await import('@/app/api/contact/route');
    POST = mod.POST;
  });

  it('returns 400 when name is missing', async () => {
    const req = jsonReq('/api/contact', { email: 'a@b.com', message: 'hi' });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/name/i);
  });

  it('returns 400 when email is missing', async () => {
    const req = jsonReq('/api/contact', { name: 'Alice', message: 'hi' });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('returns 400 when message is missing', async () => {
    const req = jsonReq('/api/contact', { name: 'Alice', email: 'a@b.com' });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('returns 201 on valid submission', async () => {
    mockPrisma.contactSubmission.create.mockResolvedValue({ id: 'c1' });
    const req = jsonReq('/api/contact', { name: 'Alice', email: 'a@b.com', message: 'Hello!' });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.id).toBe('c1');
    expect(mockPrisma.contactSubmission.create).toHaveBeenCalledTimes(1);
  });

  it('returns 500 on database error', async () => {
    mockPrisma.contactSubmission.create.mockRejectedValue(new Error('DB down'));
    const req = jsonReq('/api/contact', { name: 'Bob', email: 'b@c.com', message: 'Help' });
    const res = await POST(req);
    expect(res.status).toBe(500);
  });
});

/* ================================================================
   EVENTS ROUTE
   ================================================================ */
describe('GET /api/events', () => {
  let GET: () => Promise<NextResponse>;

  beforeEach(async () => {
    vi.clearAllMocks();
    const mod = await import('@/app/api/events/route');
    GET = mod.GET;
  });

  it('returns published events as JSON array', async () => {
    const fakeEvents = [
      { id: '1', title: 'Workshop', published: true, date: '2025-03-01' },
    ];
    mockPrisma.event.findMany.mockResolvedValue(fakeEvents);
    const res = await GET();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toHaveLength(1);
    expect(data[0].title).toBe('Workshop');
  });

  it('includes cache-control header', async () => {
    mockPrisma.event.findMany.mockResolvedValue([]);
    const res = await GET();
    expect(res.headers.get('Cache-Control')).toContain('s-maxage');
  });
});

/* ================================================================
   BLOG ROUTE
   ================================================================ */
describe('GET /api/blog', () => {
  let GET: () => Promise<NextResponse>;

  beforeEach(async () => {
    vi.clearAllMocks();
    const mod = await import('@/app/api/blog/route');
    GET = mod.GET;
  });

  it('returns published blog posts', async () => {
    const posts = [{ id: '1', title: 'First Post', published: true }];
    mockPrisma.blogPost.findMany.mockResolvedValue(posts);
    const res = await GET();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toHaveLength(1);
  });

  it('returns 500 on database error', async () => {
    mockPrisma.blogPost.findMany.mockRejectedValue(new Error('DB error'));
    const res = await GET();
    expect(res.status).toBe(500);
  });
});

/* ================================================================
   SCHEDULE ROUTE
   ================================================================ */
describe('GET /api/schedule', () => {
  let GET: () => Promise<NextResponse>;

  beforeEach(async () => {
    vi.clearAllMocks();
    const mod = await import('@/app/api/schedule/route');
    GET = mod.GET;
  });

  it('returns active schedules', async () => {
    mockPrisma.schedule.findMany.mockResolvedValue([
      { id: '1', title: 'Monday class', active: true, dayOfWeek: 'monday' },
    ]);
    const res = await GET();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toHaveLength(1);
  });

  it('returns 500 on DB failure', async () => {
    mockPrisma.schedule.findMany.mockRejectedValue(new Error('fail'));
    const res = await GET();
    expect(res.status).toBe(500);
  });
});

/* ================================================================
   CERTIFICATES ROUTE (public)
   ================================================================ */
describe('GET /api/certificates', () => {
  let GET: (req: NextRequest) => Promise<NextResponse>;

  beforeEach(async () => {
    vi.clearAllMocks();
    const mod = await import('@/app/api/certificates/route');
    GET = mod.GET;
  });

  it('returns published certificates', async () => {
    mockPrisma.certificate.findMany.mockResolvedValue([
      { id: '1', certNumber: 'CERT-001', status: 'published' },
    ]);
    const req = new NextRequest('http://localhost:3000/api/certificates');
    const res = await GET(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toHaveLength(1);
    expect(data[0].certNumber).toBe('CERT-001');
  });

  it('filters by userId when provided', async () => {
    mockPrisma.certificate.findMany.mockResolvedValue([]);
    const req = new NextRequest('http://localhost:3000/api/certificates?userId=u1');
    await GET(req);
    expect(mockPrisma.certificate.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ userId: 'u1', status: 'published' }),
      })
    );
  });

  it('filters by certNumber when provided', async () => {
    mockPrisma.certificate.findMany.mockResolvedValue([]);
    const req = new NextRequest('http://localhost:3000/api/certificates?certNumber=CERT-001');
    await GET(req);
    expect(mockPrisma.certificate.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ certNumber: 'CERT-001' }),
      })
    );
  });

  it('returns 500 on error', async () => {
    mockPrisma.certificate.findMany.mockRejectedValue(new Error('fail'));
    const req = new NextRequest('http://localhost:3000/api/certificates');
    const res = await GET(req);
    expect(res.status).toBe(500);
  });
});
