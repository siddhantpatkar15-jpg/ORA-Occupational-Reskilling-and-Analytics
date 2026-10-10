import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { assessments, assessment_questions } from '@/lib/db/schema';
import { verifySession } from '@/lib/auth/dal';
import { eq } from 'drizzle-orm';

export async function GET(req: NextRequest, ctx: any) {
  try {
    const session = await verifySession();
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await ctx.params;
    
    const assessmentResult = await db.select().from(assessments).where(eq(assessments.id, id)).execute();
    const assessment = assessmentResult[0];

    if (!assessment) return Response.json({ error: 'Assessment not found' }, { status: 404 });

    const questions = await db.select().from(assessment_questions).where(eq(assessment_questions.assessmentId, id)).execute();

    if (session.role === 'learner') {
      const sanitizedQuestions = questions.map(q => {
        const { correctAnswer, ...rest } = q;
        return rest;
      });
      return Response.json({ ...assessment, questions: sanitizedQuestions });
    }

    return Response.json({ ...assessment, questions });
  } catch (error) {
    console.error('Error fetching assessment:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
