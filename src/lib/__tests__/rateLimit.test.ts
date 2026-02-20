import { describe, it, expect } from 'vitest';
import { rateLimit } from '@/lib/rateLimit';
import { NextRequest } from 'next/server';

function createMockRequest(ip = '127.0.0.1'): NextRequest {
  const url = 'http://localhost:3000/api/test';
  const headers = new Headers({
    'x-forwarded-for': ip,
  });
  return new NextRequest(url, { headers });
}

describe('rateLimit', () => {
  it('allows requests under the limit', () => {
    const limiter = rateLimit({ interval: 60_000, limit: 3 });
    const req = createMockRequest('10.0.0.1');

    expect(limiter.check(req, 3)).toBeNull();
    expect(limiter.check(req, 3)).toBeNull();
    expect(limiter.check(req, 3)).toBeNull();
  });

  it('blocks requests exceeding the limit', () => {
    const limiter = rateLimit({ interval: 60_000, limit: 2 });
    const req = createMockRequest('10.0.0.2');

    expect(limiter.check(req, 2)).toBeNull();
    expect(limiter.check(req, 2)).toBeNull();

    const blocked = limiter.check(req, 2);
    expect(blocked).not.toBeNull();
    expect(blocked?.status).toBe(429);
  });

  it('tracks different IPs independently', () => {
    const limiter = rateLimit({ interval: 60_000, limit: 1 });
    const req1 = createMockRequest('10.0.0.3');
    const req2 = createMockRequest('10.0.0.4');

    expect(limiter.check(req1, 1)).toBeNull();
    expect(limiter.check(req2, 1)).toBeNull();

    // First IP is now blocked
    const blocked = limiter.check(req1, 1);
    expect(blocked).not.toBeNull();
    expect(blocked?.status).toBe(429);

    // Second IP is also blocked
    const blocked2 = limiter.check(req2, 1);
    expect(blocked2).not.toBeNull();
  });

  it('resets after the interval window', async () => {
    const limiter = rateLimit({ interval: 50, limit: 1 }); // 50ms window
    const req = createMockRequest('10.0.0.5');

    expect(limiter.check(req, 1)).toBeNull();
    expect(limiter.check(req, 1)).not.toBeNull(); // blocked

    // Wait for window to pass
    await new Promise((resolve) => setTimeout(resolve, 60));

    expect(limiter.check(req, 1)).toBeNull(); // allowed again
  });

  it('returns Retry-After header when rate limited', () => {
    const limiter = rateLimit({ interval: 60_000, limit: 1 });
    const req = createMockRequest('10.0.0.6');

    limiter.check(req, 1);
    const blocked = limiter.check(req, 1);

    expect(blocked).not.toBeNull();
    expect(blocked?.headers.get('Retry-After')).toBeTruthy();
    expect(blocked?.headers.get('X-RateLimit-Limit')).toBe('1');
    expect(blocked?.headers.get('X-RateLimit-Remaining')).toBe('0');
  });
});
