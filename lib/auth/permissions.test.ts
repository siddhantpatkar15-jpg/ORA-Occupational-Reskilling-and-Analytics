import { describe, it, expect } from 'vitest';
import { hasPermission } from './permissions';
import { loginSchema, registerSchema } from '../validators/auth';

describe('Role-Based Access Control (RBAC) Permissions', () => {
  it('enforces learner permissions correctly', () => {
    expect(hasPermission('learner', 'profile:read')).toBe(true);
    expect(hasPermission('learner', 'assessment:take')).toBe(true);
    expect(hasPermission('learner', 'course:enroll')).toBe(true);
    expect(hasPermission('learner', 'course:create')).toBe(false);
    expect(hasPermission('learner', 'user:manage')).toBe(false);
    expect(hasPermission('learner', 'analytics:view')).toBe(false);
  });

  it('enforces trainer permissions correctly', () => {
    expect(hasPermission('trainer', 'course:create')).toBe(true);
    expect(hasPermission('trainer', 'assessment:create')).toBe(true);
    expect(hasPermission('trainer', 'learner:view')).toBe(true);
    expect(hasPermission('trainer', 'feedback:give')).toBe(true);
    expect(hasPermission('trainer', 'user:manage')).toBe(false);
  });

  it('enforces admin permissions correctly', () => {
    expect(hasPermission('admin', 'user:manage')).toBe(true);
    expect(hasPermission('admin', 'org:manage')).toBe(true);
    expect(hasPermission('admin', 'analytics:view')).toBe(true);
    expect(hasPermission('admin', 'taxonomy:manage')).toBe(true);
    expect(hasPermission('admin', 'system:manage')).toBe(false); // Only super_admin
  });
});

describe('Auth Input Validation Schemas', () => {
  it('validates correct email and password for login', () => {
    const valid = loginSchema.safeParse({
      email: 'learner@ora-demo.com',
      password: 'OraDemo2024!',
    });
    expect(valid.success).toBe(true);

    const invalidEmail = loginSchema.safeParse({
      email: 'invalid-email',
      password: 'OraDemo2024!',
    });
    expect(invalidEmail.success).toBe(false);

    const shortPassword = loginSchema.safeParse({
      email: 'learner@ora-demo.com',
      password: '123',
    });
    expect(shortPassword.success).toBe(false);
  });

  it('rejects invalid roles during self-registration', () => {
    const registerAsAdmin = registerSchema.safeParse({
      name: 'Hacker',
      email: 'hacker@test.com',
      password: 'Password123!',
      role: 'admin',
    });
    // Admin cannot self-register through public endpoint
    expect(registerAsAdmin.success).toBe(false);

    const registerAsLearner = registerSchema.safeParse({
      name: 'Valid Learner',
      email: 'valid@test.com',
      password: 'Password123!',
      role: 'learner',
    });
    expect(registerAsLearner.success).toBe(true);
  });
});
