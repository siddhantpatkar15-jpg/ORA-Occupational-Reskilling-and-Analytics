import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { courses, course_enrollments } from '@/lib/db/schema';
import { verifySession } from '@/lib/auth/dal';
import { eq, and, sql } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest, ctx: any) {
  try {
    const session = await verifySession();
    if (!session || session.role !== 'learner') return Response.json({ error: 'Unauthorized' }, { status: 403 });

    const { id } = await ctx.params;
    
    const existing = await db.select().from(course_enrollments).where(and(eq(course_enrollments.courseId, id), eq(course_enrollments.userId, session.userId))).execute();
    if (existing.length > 0) return Response.json({ error: 'Already enrolled' }, { status: 400 });

    const newEnrollment = {
      id: uuidv4(),
      courseId: id,
      userId: session.userId,
      progress: 0,
      enrolledAt: new Date()
    };

    await db.insert(course_enrollments).values(newEnrollment as any).execute();
    await db.update(courses).set({ enrollmentCount: sql`${courses.enrollmentCount} + 1` } as any).where(eq(courses.id, id)).execute();
    
    return Response.json(newEnrollment, { status: 201 });
  } catch (error) {
    console.error('Error enrolling in course:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
