import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

// Mock prisma
vi.mock('@/lib/prisma', () => ({
  default: {
    user: {
      findUnique: vi.fn(),
      count: vi.fn(),
    },
  },
}));

// Mock getToken for adminAuth tests
vi.mock('next-auth/jwt', () => ({
  getToken: vi.fn(),
}));

import { requireAdmin } from '@/lib/adminAuth';
import { getToken } from 'next-auth/jwt';

function createMockRequest(): NextRequest {
  return new NextRequest('http://localhost:3000/api/admin/test', {
    headers: new Headers({ 'Content-Type': 'application/json' }),
  });
}

describe('requireAdmin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 when no token present', async () => {
    vi.mocked(getToken).mockResolvedValue(null);
    const req = createMockRequest();
    const result = await requireAdmin(req);

    expect(result).not.toBeNull();
    expect(result?.status).toBe(401);

    const body = await result!.json();
    expect(body.error).toBe('Authentication required');
  });

  it('returns 403 when user is not admin', async () => {
    vi.mocked(getToken).mockResolvedValue({
      role: 'parent',
      id: 'user-1',
      email: 'parent@test.com',
      sub: 'user-1',
      iat: 0,
      exp: 0,
      jti: '',
    });
    const req = createMockRequest();
    const result = await requireAdmin(req);

    expect(result).not.toBeNull();
    expect(result?.status).toBe(403);

    const body = await result!.json();
    expect(body.error).toBe('Admin access required');
  });

  it('returns null (authorized) for admin user', async () => {
    vi.mocked(getToken).mockResolvedValue({
      role: 'admin',
      id: 'admin-1',
      email: 'admin@test.com',
      sub: 'admin-1',
      iat: 0,
      exp: 0,
      jti: '',
    });
    const req = createMockRequest();
    const result = await requireAdmin(req);

    expect(result).toBeNull();
  });
});
