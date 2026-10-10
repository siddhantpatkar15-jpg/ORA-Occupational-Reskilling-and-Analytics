import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { courses, course_modules } from '@/lib/db/schema';
import { verifySession } from '@/lib/auth/dal';
import { eq } from 'drizzle-orm';

export async function GET(req: NextRequest, ctx: any) {
  try {
    const session = await verifySession();
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await ctx.params;
    
    const courseResult = await db.select().from(courses).where(eq(courses.id, id)).execute();
    const course = courseResult[0];

    if (!course) return Response.json({ error: 'Course not found' }, { status: 404 });

    const modules = await db.select().from(course_modules).where(eq(course_modules.courseId, id)).execute();

    return Response.json({ ...course, modules });
  } catch (error) {
    console.error('Error fetching course:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
