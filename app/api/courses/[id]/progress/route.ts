import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { course_enrollments } from '@/lib/db/schema';
import { verifySession } from '@/lib/auth/dal';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';

const updateProgressSchema = z.object({
  progress: z.number().min(0).max(100),
  moduleId: z.string().optional()
});

export async function PUT(req: NextRequest, ctx: any) {
  try {
    const session = await verifySession();
    if (!session || session.role !== 'learner') return Response.json({ error: 'Unauthorized' }, { status: 403 });

    const { id } = await ctx.params;
    const body = await req.json();
    const parsed = updateProgressSchema.safeParse(body);
    
    if (!parsed.success) return Response.json({ error: 'Invalid input' }, { status: 400 });

    const { progress } = parsed.data;

    const existingResult = await db.select().from(course_enrollments).where(and(eq(course_enrollments.courseId, id), eq(course_enrollments.userId, session.userId))).execute();
    if (existingResult.length === 0) return Response.json({ error: 'Not enrolled' }, { status: 404 });

    const enrollment = existingResult[0];
    
    const updateData: any = { progress };
    if (progress === 100) {
      updateData.completedAt = new Date();
      updateData.status = 'completed';
    }

    await db.update(course_enrollments).set(updateData).where(eq(course_enrollments.id, enrollment.id)).execute();
    
    return Response.json({ success: true, progress });
  } catch (error) {
    console.error('Error updating progress:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
