/**
 * Audit logging utility for admin actions.
 * Logs important operations with user context for security compliance.
 *
 * Usage:
 *   import { auditLog } from '@/lib/auditLog';
 *   await auditLog({ action: 'DELETE_USER', userId: token.id, details: { targetUserId: '...' } });
 */

import prisma from '@/lib/prisma';

export type AuditAction =
  | 'LOGIN_SUCCESS'
  | 'LOGIN_FAILED'
  | 'SIGNUP'
  | 'UPDATE_SETTINGS'
  | 'UPLOAD_FILE'
  | 'REVIEW_APPLICATION'
  | 'UPDATE_ENROLLMENT'
  | 'DELETE_QUOTE_REQUEST'
  | 'UPDATE_QUOTE_STATUS'
  | 'SEED_ADMIN'
  | 'VIEW_CONTACT_SUBMISSIONS'
  | 'VIEW_ENROLLMENTS'
  | 'VIEW_APPLICATIONS'
  | 'ADMIN_ACTION';

interface AuditLogEntry {
  action: AuditAction;
  userId?: string | null;
  email?: string | null;
  ip?: string | null;
  details?: Record<string, unknown>;
}

/**
 * Log an audit event. Uses the Notification model as a lightweight audit store.
 * Falls back to console.log if DB is unavailable.
 */
export async function auditLog(entry: AuditLogEntry): Promise<void> {
  const timestamp = new Date().toISOString();
  const logLine = `[AUDIT] ${timestamp} | ${entry.action} | user=${entry.userId || 'anonymous'} | ip=${entry.ip || 'unknown'} | ${JSON.stringify(entry.details || {})}`;

  // Always log to stdout (picked up by Vercel/CloudWatch/etc.)
  console.log(logLine);

  // Optionally persist to DB via a lightweight table
  // Using SiteSetting as a quick audit store (key = audit_<timestamp>)
  try {
    await prisma.siteSetting.create({
      data: {
        key: `audit_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        value: JSON.stringify({
          action: entry.action,
          userId: entry.userId,
          email: entry.email,
          ip: entry.ip,
          details: entry.details,
          timestamp,
        }),
      },
    });
  } catch (err) {
    // DB audit is best-effort; don't break the request
    console.error('[AUDIT] Failed to persist audit log:', err);
  }
}

/**
 * Extract client IP from a request.
 */
export function getClientIp(headers: Headers): string {
  return (
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headers.get('x-real-ip') ||
    'unknown'
  );
}
