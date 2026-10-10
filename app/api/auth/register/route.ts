import { NextRequest } from 'next/server';
import { db } from '../../../../lib/db';
import { users, learnerProfiles, trainerProfiles } from '../../../../lib/db/schema';
import { eq } from 'drizzle-orm';
import { hashPassword, validatePasswordStrength } from '../../../../lib/auth/password';
import { createSession } from '../../../../lib/auth/session';
import { registerSchema } from '../../../../lib/validators/auth';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = registerSchema.safeParse(body);
    
    if (!result.success) {
      const firstError = result.error.issues[0]?.message || 'Invalid input';
      return Response.json({ error: firstError, details: result.error.issues }, { status: 400 });
    }
    
    const { name, email, password, role } = result.data;
    const normalizedEmail = email.toLowerCase().trim();
    
    const pwdStrength = validatePasswordStrength(password);
    if (!pwdStrength.valid) {
      return Response.json({ error: pwdStrength.errors[0] || 'Password does not meet requirements' }, { status: 400 });
    }
    
    // Check existing user
    let existingUser = null;
    try {
      if (db?.query?.users?.findFirst) {
        existingUser = await db.query.users.findFirst({
          where: eq(users.email, normalizedEmail),
        });
      }
    } catch (e) {
      // In serverless fallback mode, check store
      const list = (db as any)?._store?.users || [];
      existingUser = list.find((u: any) => u.email === normalizedEmail);
    }
    
    if (existingUser) {
      return Response.json({ error: 'An account with this email address already exists. Please sign in instead.' }, { status: 409 });
    }
    
    const hashedPassword = await hashPassword(password);
    const userId = uuidv4();
    const nowIso = new Date().toISOString();
    
    const newUserRecord = {
      id: userId,
      email: normalizedEmail,
      name: name.trim(),
      passwordHash: hashedPassword,
      role: role as any,
      organizationId: null,
      departmentId: null,
      status: 'active' as const,
      language: 'en',
      avatarUrl: null,
      phone: null,
      bio: null,
      onboardingCompleted: false,
      emailVerified: false,
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    // Attempt DB insert
    try {
      await db.insert(users).values(newUserRecord);
      if (role === 'trainer') {
        await db.insert(trainerProfiles).values({
          id: uuidv4(),
          userId,
          specialization: 'General',
          updatedAt: nowIso,
        });
      } else {
        await db.insert(learnerProfiles).values({
          id: uuidv4(),
          userId,
          targetOccupationId: 'occ-data-analyst',
          profileCompleteness: 20,
          updatedAt: nowIso,
        });
      }
    } catch (dbError) {
      console.warn('DB write failed, caching in fallback store:', dbError);
      if ((db as any)?._store?.users) {
        (db as any)._store.users.push(newUserRecord);
      }
    }
    
    // Create session cookie
    await createSession(userId, role, null, normalizedEmail);
    
    return Response.json({ 
      user: {
        id: userId,
        email: normalizedEmail,
        name: name.trim(),
        role,
      } 
    }, { status: 201 });
  } catch (error: any) {
    console.error('Registration error:', error);
    return Response.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
