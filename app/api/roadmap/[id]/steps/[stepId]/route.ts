import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { roadmap_steps, learning_roadmaps } from '@/lib/db/schema';
import { verifySession } from '@/lib/auth/dal';
import { eq, sql } from 'drizzle-orm';
import { z } from 'zod';

const updateStepSchema = z.object({
  status: z.enum(['completed', 'skipped', 'in_progress'])
});

export async function PUT(req: NextRequest, ctx: any) {
  try {
    const session = await verifySession();
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { id, stepId } = await ctx.params;
    const body = await req.json();
    const parsed = updateStepSchema.safeParse(body);
    
    if (!parsed.success) return Response.json({ error: 'Invalid input' }, { status: 400 });
    const { status } = parsed.data;

    // Verify roadmap ownership
    const rmResult = await db.select().from(learning_roadmaps).where(eq(learning_roadmaps.id, id)).execute();
    if (rmResult.length === 0 || rmResult[0].userId !== session.userId) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    await db.update(roadmap_steps).set({ status } as any).where(eq(roadmap_steps.id, stepId)).execute();

    if (status === 'completed') {
       // simplistic increment of completed count
       await db.update(learning_roadmaps).set({
         completedSteps: sql`${learning_roadmaps.completedSteps || 0} + 1`
       } as any).where(eq(learning_roadmaps.id, id)).execute();
    }

    return Response.json({ success: true, status });
  } catch (error) {
    console.error('Error updating roadmap step:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
