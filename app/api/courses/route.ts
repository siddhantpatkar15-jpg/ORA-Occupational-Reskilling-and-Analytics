import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { courses } from '@/lib/db/schema';
import { verifySession } from '@/lib/auth/dal';
import { hasPermission } from '@/lib/auth/permissions';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

const createCourseSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  status: z.enum(['draft', 'published', 'archived']).default('published'),
  estimatedHours: z.number().optional(),
  category: z.string().optional(),
  skillId: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const session = await verifySession();
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const searchParams = req.nextUrl.searchParams;
    const level = searchParams.get('level');

    let query = db.select().from(courses);
    
    if (session.role === 'learner') {
      if (level) {
        query = query.where(and(eq(courses.status, 'published'), eq(courses.level, level as any))) as any;
      } else {
        query = query.where(eq(courses.status, 'published')) as any;
      }
    } else if (level) {
      query = query.where(eq(courses.level, level as any)) as any;
    }

    const data = await query.execute();
    return Response.json(data);
  } catch (error) {
    console.error('Error fetching courses:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await verifySession();
    if (!session || !hasPermission(session.role, 'course:create')) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const parsed = createCourseSchema.safeParse(body);
    
    if (!parsed.success) {
      return Response.json({ error: 'Invalid input', details: parsed.error }, { status: 400 });
    }

    const newCourse = {
      id: uuidv4(),
      title: parsed.data.title,
      description: parsed.data.description || null,
      level: parsed.data.level || 'beginner',
      status: parsed.data.status,
      estimatedHours: parsed.data.estimatedHours || 10,
      category: parsed.data.category || null,
      skillId: parsed.data.skillId || null,
      trainerId: session.userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await db.insert(courses).values(newCourse as any).execute();
    
    return Response.json(newCourse, { status: 201 });
  } catch (error) {
    console.error('Error creating course:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
