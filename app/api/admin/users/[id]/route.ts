import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { users, audit_logs } from '@/lib/db/schema';
import { verifySession } from '@/lib/auth/dal';
import { hasPermission, Role } from '@/lib/auth/permissions';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

const updateUserSchema = z.object({
  role: z.enum(['learner', 'trainer', 'admin']).optional(),
  status: z.enum(['active', 'inactive']).optional()
});

export async function PUT(req: NextRequest, ctx: any) {
  try {
    const session = await verifySession();
    if (!session || !hasPermission(session.role as Role, 'user:manage')) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await ctx.params;
    if (id === session.userId) {
      return Response.json({ error: 'Cannot update own role/status' }, { status: 400 });
    }

    const body = await req.json();
    const parsed = updateUserSchema.safeParse(body);
    if (!parsed.success) return Response.json({ error: 'Invalid input' }, { status: 400 });

    const updates = parsed.data;

    await db.update(users).set(updates as any).where(eq(users.id, id)).execute();
    
    // Audit log
    await db.insert(audit_logs).values({
      id: uuidv4(),
      userId: session.userId,
      action: 'update_user',
      resourceType: 'users',
      resourceId: id,
      details: JSON.stringify(updates),
      createdAt: new Date().toISOString()
    } as any).execute();

    return Response.json({ success: true, updates });
  } catch (error) {
    console.error('Error updating user:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, ctx: any) {
  try {
    const session = await verifySession();
    if (!session || !hasPermission(session.role as Role, 'user:manage')) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await ctx.params;
    if (id === session.userId) {
      return Response.json({ error: 'Cannot deactivate self' }, { status: 400 });
    }

    await db.update(users).set({ status: 'inactive' } as any).where(eq(users.id, id)).execute();

    // Audit log
    await db.insert(audit_logs).values({
      id: uuidv4(),
      userId: session.userId,
      action: 'deactivate_user',
      resourceType: 'users',
      resourceId: id,
      createdAt: new Date().toISOString()
    } as any).execute();

    return Response.json({ success: true, status: 'inactive' });
  } catch (error) {
    console.error('Error deactivating user:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
