import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { assessments } from '@/lib/db/schema';
import { verifySession } from '@/lib/auth/dal';
import { hasPermission, Role } from '@/lib/auth/permissions';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

const createAssessmentSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  skillId: z.string().min(1),
  type: z.enum(['knowledge', 'practical', 'self_assessment', 'scenario']).default('knowledge'),
  difficultyLevel: z.enum(['beginner', 'intermediate', 'advanced']).default('intermediate'),
  passingScore: z.number().min(0).max(100).default(60),
  timeLimitMinutes: z.number().optional().default(30),
  status: z.enum(['draft', 'published', 'archived']).default('published')
});

export async function GET(req: NextRequest) {
  try {
    const session = await verifySession();
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    let query = db.select().from(assessments);
    if (session.role === 'learner') {
      query = query.where(eq(assessments.status, 'published')) as any;
    } else if (session.role === 'trainer') {
      query = query.where(eq(assessments.createdBy, session.userId)) as any;
    }

    const data = await query.execute();
    return Response.json(data);
  } catch (error) {
    console.error('Error fetching assessments:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await verifySession();
    if (!session || !hasPermission(session.role as Role, 'assessment:create')) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const parsed = createAssessmentSchema.safeParse(body);
    
    if (!parsed.success) {
      return Response.json({ error: 'Invalid input', details: parsed.error }, { status: 400 });
    }

    const newAssessment = {
      id: uuidv4(),
      title: parsed.data.title,
      description: parsed.data.description || null,
      skillId: parsed.data.skillId,
      type: parsed.data.type,
      difficultyLevel: parsed.data.difficultyLevel,
      passingScore: parsed.data.passingScore,
      timeLimitMinutes: parsed.data.timeLimitMinutes,
      status: parsed.data.status,
      createdBy: session.userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await db.insert(assessments).values(newAssessment as any).execute();
    
    return Response.json(newAssessment, { status: 201 });
  } catch (error) {
    console.error('Error creating assessment:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
