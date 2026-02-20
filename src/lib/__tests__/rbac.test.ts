import { describe, it, expect } from 'vitest';
import { hasPermission, canAccess, getPermissionsForRole } from '@/lib/rbac';
import type { UserRole } from '@/types';

describe('RBAC — hasPermission', () => {
  it('grants admin manage_all_users', () => {
    expect(hasPermission('admin', 'manage_all_users')).toBe(true);
  });

  it('denies parent manage_all_users', () => {
    expect(hasPermission('parent', 'manage_all_users')).toBe(false);
  });

  it('grants parent view_child_progress', () => {
    expect(hasPermission('parent', 'view_child_progress')).toBe(true);
  });

  it('grants instructor manage_attendance', () => {
    expect(hasPermission('instructor', 'manage_attendance')).toBe(true);
  });

  it('denies instructor manage_payments', () => {
    expect(hasPermission('instructor', 'manage_payments')).toBe(false);
  });

  it('grants student view_grades', () => {
    expect(hasPermission('student', 'view_grades')).toBe(true);
  });

  it('denies student manage_programs', () => {
    expect(hasPermission('student', 'manage_programs')).toBe(false);
  });

  it('returns false for unknown role', () => {
    expect(hasPermission('unknown' as UserRole, 'anything')).toBe(false);
  });

  it('returns false for unknown permission', () => {
    expect(hasPermission('admin', 'fly_to_moon')).toBe(false);
  });
});

describe('RBAC — canAccess', () => {
  it('mirrors hasPermission for admin', () => {
    expect(canAccess('admin', 'manage_programs')).toBe(true);
    expect(canAccess('admin', 'non_existent')).toBe(false);
  });

  it('mirrors hasPermission for parent', () => {
    expect(canAccess('parent', 'view_own_dashboard')).toBe(true);
    expect(canAccess('parent', 'manage_content')).toBe(false);
  });
});

describe('RBAC — getPermissionsForRole', () => {
  it('returns an array of permissions for admin', () => {
    const perms = getPermissionsForRole('admin');
    expect(Array.isArray(perms)).toBe(true);
    expect(perms.length).toBeGreaterThan(0);
    expect(perms).toContain('manage_all_users');
  });

  it('returns an array of permissions for instructor', () => {
    const perms = getPermissionsForRole('instructor');
    expect(perms).toContain('manage_attendance');
    expect(perms).toContain('submit_grades');
  });

  it('returns empty array for unknown role', () => {
    expect(getPermissionsForRole('hacker' as UserRole)).toEqual([]);
  });

  it('each role has unique permissions set', () => {
    const roles: UserRole[] = ['admin', 'parent', 'instructor', 'student'];
    for (const role of roles) {
      const perms = getPermissionsForRole(role);
      const unique = new Set(perms);
      expect(unique.size).toBe(perms.length);
    }
  });
});
