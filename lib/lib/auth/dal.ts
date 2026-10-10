import 'server-only';
import { cache } from 'react';
import { cookies } from 'next/headers';
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

  return { isAuth: true, userId: session.userId, role: session.role, organizationId: session.organizationId };
});

export const getUser = cache(async () => {
  const session = await verifySession();
  if (!session) return null;

  try {
    const data = await db.query.users.findFirst({
      where: eq(users.id, session.userId),
    });

    if (!data) {
      return null;
    }

    return data;
  } catch (error) {
    console.error('Failed to fetch user', error);
    return null;
  }
});

export const requireRole = cache(async (allowedRoles: string[]) => {
  const session = await verifySession();

  if (!allowedRoles.includes(session.role)) {
    redirect('/unauthorized');
  }

  return session;
});
