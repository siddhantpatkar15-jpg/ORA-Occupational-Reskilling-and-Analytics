import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { assessment_attempts, assessment_questions } from '@/lib/db/schema';
import { verifySession } from '@/lib/auth/dal';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest, ctx: any) {
  try {
    const session = await verifySession();
    if (!session || session.role !== 'learner') return Response.json({ error: 'Unauthorized' }, { status: 403 });

    const { id } = await ctx.params;

    // Check max attempts logic would go here if defined in schema

    const attemptId = uuidv4();
    const newAttempt = {
      id: attemptId,
      assessmentId: id,
      userId: session.userId,
      startedAt: new Date(),
      status: 'in_progress',
    };

    await db.insert(assessment_attempts).values(newAttempt as any).execute();

    const questions = await db.select().from(assessment_questions).where(eq(assessment_questions.assessmentId, id)).execute();
    
    const sanitizedQuestions = questions.map(q => {
      const { correctAnswer, ...rest } = q;
      return rest;
    });

    return Response.json({ attemptId, questions: sanitizedQuestions });
  } catch (error) {
    console.error('Error starting assessment attempt:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
