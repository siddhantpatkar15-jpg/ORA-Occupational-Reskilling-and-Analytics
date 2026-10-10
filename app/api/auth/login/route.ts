import { NextRequest } from 'next/server';
import { db } from '../../../../lib/db';
import { users } from '../../../../lib/db/schema';
import { eq } from 'drizzle-orm';
import { verifyPassword } from '../../../../lib/auth/password';
import { createSession } from '../../../../lib/auth/session';
import { loginSchema } from '../../../../lib/validators/auth';

const rateLimit = new Map<string, { count: number; lastAttempt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') ?? 'unknown';
    
    // Rate Limiting
    const now = Date.now();
    const attempts = rateLimit.get(ip);
    if (attempts && now - attempts.lastAttempt < WINDOW_MS) {
      if (attempts.count >= MAX_ATTEMPTS) {
        return Response.json({ error: 'Too many login attempts. Please try again later.' }, { status: 429 });
      }
    }
    
    const body = await req.json();
    const result = loginSchema.safeParse(body);
    
    if (!result.success) {
      return Response.json({ error: 'Invalid input' }, { status: 400 });
    }
    
    const { email, password } = result.data;
    
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    
    if (!user || !user.passwordHash) {
      const currentCount = attempts ? attempts.count + 1 : 1;
      rateLimit.set(ip, { count: currentCount, lastAttempt: now });
      return Response.json({ error: 'Invalid email or password' }, { status: 401 });
    }
    
    const isValid = await verifyPassword(password, user.passwordHash);
    
    if (!isValid) {
      const currentCount = attempts ? attempts.count + 1 : 1;
      rateLimit.set(ip, { count: currentCount, lastAttempt: now });
      return Response.json({ error: 'Invalid email or password' }, { status: 401 });
    }
    
    rateLimit.delete(ip);
    
    await createSession(user.id, user.role, user.organizationId, user.email);
    
    const { passwordHash: _, ...userWithoutPassword } = user;
    
    return Response.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Login error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
