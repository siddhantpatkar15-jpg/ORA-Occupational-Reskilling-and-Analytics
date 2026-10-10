export type Role = 'learner' | 'trainer' | 'admin' | 'super_admin';

const PERMISSIONS = {
  // Learner permissions
  'profile:read': ['learner', 'trainer', 'admin', 'super_admin'],
  'profile:write': ['learner', 'trainer', 'admin', 'super_admin'],
  'assessment:take': ['learner'],
  'course:enroll': ['learner'],
  'roadmap:view': ['learner'],
  
  // Trainer permissions  
  'course:create': ['trainer', 'admin', 'super_admin'],
  'course:edit': ['trainer', 'admin', 'super_admin'],
  'assessment:create': ['trainer', 'admin', 'super_admin'],
  'learner:view': ['trainer', 'admin', 'super_admin'],
  'feedback:give': ['trainer', 'admin', 'super_admin'],
  
  // Admin permissions
  'user:manage': ['admin', 'super_admin'],
  'org:manage': ['admin', 'super_admin'],
  'analytics:view': ['admin', 'super_admin'],
  'taxonomy:manage': ['admin', 'super_admin'],
  'audit:view': ['admin', 'super_admin'],
  
  // Super admin
  'system:manage': ['super_admin'],
} as const;

export function hasPermission(role: Role, permission: keyof typeof PERMISSIONS): boolean {
  return (PERMISSIONS[permission] as readonly string[]).includes(role);
}

export function checkPermission(role: Role, permission: keyof typeof PERMISSIONS): void {
  if (!hasPermission(role, permission)) {
    throw new Error(`Unauthorized: Role '${role}' lacks permission '${permission}'`);
  }
}
