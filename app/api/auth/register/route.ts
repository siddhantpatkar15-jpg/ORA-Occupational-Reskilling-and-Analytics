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
      const firstError = result.error.errors[0]?.message || 'Invalid input';
      return Response.json({ error: firstError, details: result.error.errors }, { status: 400 });
    }
    
    const { name, email, password, role } = result.data;
    
    const pwdStrength = validatePasswordStrength(password);
    if (!pwdStrength.valid) {
      return Response.json({ error: pwdStrength.errors[0] || 'Password does not meet requirements' }, { status: 400 });
    }
    
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email.toLowerCase().trim()),
    });
    
    if (existingUser) {
      return Response.json({ error: 'An account with this email address already exists. Please sign in instead.' }, { status: 409 });
    }
    
    const hashedPassword = await hashPassword(password);
    const userId = uuidv4();
    const nowIso = new Date().toISOString();
    
    // Create user and profile
    await db.insert(users).values({
      id: userId,
      email: email.toLowerCase().trim(),
      name: name.trim(),
      passwordHash: hashedPassword,
      role: role as any,
      createdAt: nowIso,
      updatedAt: nowIso,
    });

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
        targetOccupationId: 'occ-1', // Default to Data Analyst
        profileCompleteness: 20,
        updatedAt: nowIso,
      });
    }
    
    await createSession(userId, role, null, email.toLowerCase().trim());
    
    const newUser = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });
    
    if (!newUser) {
      throw new Error('User creation failed');
    }
    
    const { passwordHash: _, ...userWithoutPassword } = newUser;
    
    return Response.json({ user: userWithoutPassword }, { status: 201 });
  } catch (error: any) {
    console.error('Registration error:', error);
    return Response.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
