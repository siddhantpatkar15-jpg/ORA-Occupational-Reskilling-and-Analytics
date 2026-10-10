import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { verifySession } from '@/lib/auth/dal';
import { hasPermission } from '@/lib/auth/permissions';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  role: z.enum(['learner', 'trainer', 'admin']),
  password: z.string().min(8)
});

export async function GET(req: NextRequest) {
  try {
    const session = await verifySession();
    if (!session || !hasPermission(session.role, 'user:manage')) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const searchParams = req.nextUrl.searchParams;
    const role = searchParams.get('role');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = (page - 1) * limit;

    let query = db.select().from(users).limit(limit).offset(offset);
    
    if (role) {
      query = query.where(eq(users.role, role as any)) as any;
    }

    const data = await query.execute();
    return Response.json(data);
  } catch (error) {
    console.error('Error fetching users:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await verifySession();
    if (!session || !hasPermission(session.role, 'user:manage')) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const parsed = createUserSchema.safeParse(body);
    
    if (!parsed.success) return Response.json({ error: 'Invalid input' }, { status: 400 });

    const { email, name, role, password } = parsed.data;
    
    // Check if exists
    const existing = await db.select().from(users).where(eq(users.email, email)).execute();
    if (existing.length > 0) return Response.json({ error: 'Email already in use' }, { status: 400 });

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = {
      id: uuidv4(),
      email,
      name,
      role,
      passwordHash,
      status: 'active' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await db.insert(users).values(newUser as any).execute();
    
    const { passwordHash: _, ...userWithoutPassword } = newUser;
    return Response.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
