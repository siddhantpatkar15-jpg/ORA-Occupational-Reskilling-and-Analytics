import 'server-only';
import { cache } from 'react';
import { redirect } from 'next/navigation';
import { getSession } from './session';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';

export const verifySession = cache(async () => {
  const session = await getSession();

  if (!session?.userId) {
    redirect('/login');
  }

  return { isAuth: true, userId: session.userId, role: session.role, organizationId: session.organizationId, email: session.email };
});

export const getUser = cache(async () => {
  const session = await verifySession();
  if (!session) return null;

  try {
    if (db?.query?.users?.findFirst) {
      const data = await db.query.users.findFirst({
        where: eq(users.id, session.userId),
      });

      if (data) {
        return data;
      }
    }
  } catch (error) {
    console.warn('Failed to query user from DB, using session profile:', error);
  }

  const demoNames: Record<string, string> = {
    'learner@ora-demo.com': 'Arjun Sharma',
    'trainer@ora-demo.com': 'Priya Patel',
    'admin@ora-demo.com': 'Rajesh Kumar',
  };

  const email = session.email || 'user@example.com';
  const name = demoNames[email] || (email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1));

  return {
    id: session.userId,
    name,
    email,
    role: session.role || 'learner',
    organizationId: session.organizationId || null,
    departmentId: null,
    status: 'active' as const,
    language: 'en',
    avatarUrl: null,
    phone: null,
    bio: null,
    onboardingCompleted: true,
    emailVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
});

export const requireRole = cache(async (allowedRoles: string[]) => {
  const session = await verifySession();

  if (!allowedRoles.includes(session.role)) {
    redirect('/unauthorized');
  }

  return session;
});
