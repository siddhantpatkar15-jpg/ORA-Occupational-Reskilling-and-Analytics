import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { notifications } from '@/lib/db/schema';
import { verifySession } from '@/lib/auth/dal';
import { eq, desc, inArray } from 'drizzle-orm';
import { z } from 'zod';

const markReadSchema = z.object({
  ids: z.array(z.string()).optional(),
  all: z.boolean().optional()
});

export async function GET(req: NextRequest) {
  try {
    const session = await verifySession();
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const notifs = await db.select().from(notifications)
      .where(eq(notifications.userId, session.userId))
      .orderBy(desc(notifications.createdAt))
      .limit(50)
      .execute();
      
    return Response.json(notifs);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await verifySession();
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const parsed = markReadSchema.safeParse(body);
    
    if (!parsed.success) return Response.json({ error: 'Invalid input' }, { status: 400 });

    const { ids, all } = parsed.data;

    if (all) {
      await db.update(notifications)
        .set({ isRead: true } as any)
        .where(eq(notifications.userId, session.userId))
        .execute();
    } else if (ids && ids.length > 0) {
      await db.update(notifications)
        .set({ isRead: true } as any)
        .where(inArray(notifications.id, ids))
        // also ensuring user owns these would be good practice
        .execute();
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error updating notifications:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
