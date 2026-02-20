/**
 * In-memory rate limiter for API routes.
 * Uses a sliding window approach based on IP address.
 *
 * Usage:
 *   import { rateLimit } from '@/lib/rateLimit';
 *   const limiter = rateLimit({ interval: 60_000, uniqueTokenPerInterval: 500, limit: 10 });
 *
 *   // In your route handler:
 *   const rateLimitResult = limiter.check(request, 10); // 10 requests per interval
 *   if (rateLimitResult) return rateLimitResult; // returns 429 response if exceeded
 */

import { NextRequest, NextResponse } from 'next/server';

interface RateLimitOptions {
  /** Time window in milliseconds (default: 60_000 = 1 minute) */
  interval?: number;
  /** Max unique tokens to track (default: 500) */
  uniqueTokenPerInterval?: number;
  /** Default max requests per interval per IP */
  limit?: number;
}

interface TokenBucket {
  count: number;
  lastReset: number;
}

export function rateLimit(options: RateLimitOptions = {}) {
  const {
    interval = 60_000,
    uniqueTokenPerInterval = 500,
    limit: defaultLimit = 10,
  } = options;

  const tokenCache = new Map<string, TokenBucket>();

  // Periodic cleanup to prevent memory leaks
  const cleanup = () => {
    const now = Date.now();
    if (tokenCache.size > uniqueTokenPerInterval) {
      const entries = Array.from(tokenCache.entries());
      // Remove oldest entries that have expired
      for (const [key, bucket] of entries) {
        if (now - bucket.lastReset > interval) {
          tokenCache.delete(key);
        }
      }
      // If still too large, remove oldest half
      if (tokenCache.size > uniqueTokenPerInterval) {
        const sorted = entries.sort((a, b) => a[1].lastReset - b[1].lastReset);
        const removeCount = Math.floor(sorted.length / 2);
        for (let i = 0; i < removeCount; i++) {
          tokenCache.delete(sorted[i][0]);
        }
      }
    }
  };

  return {
    /**
     * Check if request exceeds rate limit.
     * Returns null if OK, or a 429 NextResponse if rate limited.
     */
    check(request: NextRequest, limit?: number): NextResponse | null {
      const maxRequests = limit ?? defaultLimit;
      const ip =
        request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
        request.headers.get('x-real-ip') ||
        'anonymous';
      const now = Date.now();

      cleanup();

      const bucket = tokenCache.get(ip);

      if (!bucket || now - bucket.lastReset > interval) {
        // New window
        tokenCache.set(ip, { count: 1, lastReset: now });
        return null;
      }

      if (bucket.count >= maxRequests) {
        const retryAfter = Math.ceil((bucket.lastReset + interval - now) / 1000);
        return NextResponse.json(
          { error: 'Too many requests. Please try again later.' },
          {
            status: 429,
            headers: {
              'Retry-After': String(retryAfter),
              'X-RateLimit-Limit': String(maxRequests),
              'X-RateLimit-Remaining': '0',
              'X-RateLimit-Reset': String(bucket.lastReset + interval),
            },
          }
        );
      }

      bucket.count++;
      return null;
    },
  };
}

// Pre-configured limiters for common use cases
/** Strict limiter for auth endpoints: 5 requests per minute */
export const authLimiter = rateLimit({ interval: 60_000, limit: 5 });

/** Standard limiter for form submissions: 10 requests per minute */
export const formLimiter = rateLimit({ interval: 60_000, limit: 10 });

/** Relaxed limiter for public reads: 60 requests per minute */
export const readLimiter = rateLimit({ interval: 60_000, limit: 60 });
