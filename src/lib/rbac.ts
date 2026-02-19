import { UserRole } from '@/types';

const ROLE_PERMISSIONS = {
  parent: [
    'view_own_dashboard',
    'view_child_progress',
    'view_attendance',
    'view_grades',
    'manage_child_profile',
    'contact_instructor',
    'view_programs',
  ],
  child: [
    'view_own_profile',
    'view_enrolled_programs',
    'submit_assignments',
    'view_grades',
    'view_achievements',
  ],
  instructor: [
    'view_assigned_programs',
    'manage_attendance',
    'submit_grades',
    'communicate_with_parents',
    'upload_materials',
    'view_student_progress',
  ],
  admin: [
    'manage_all_users',
    'manage_programs',
    'manage_enrollments',
    'view_reports',
    'manage_payments',
    'manage_instructors',
    'manage_content',
    'view_analytics',
  ],
};

export function hasPermission(role: UserRole, permission: string): boolean {
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(permission);
}

export function canAccess(role: UserRole, requiredPermission: string): boolean {
  return hasPermission(role, requiredPermission);
}

export function getPermissionsForRole(role: UserRole): string[] {
  return ROLE_PERMISSIONS[role] || [];
}

export const ROLE_LABELS: Record<UserRole, string> = {
  parent: 'Parent',
  child: 'Student',
  instructor: 'Instructor',
  admin: 'Administrator',
};
