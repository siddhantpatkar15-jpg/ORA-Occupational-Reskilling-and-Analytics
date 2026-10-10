import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { assessments, assessment_questions, assessment_attempts, learner_competencies } from '@/lib/db/schema';
import { verifySession } from '@/lib/auth/dal';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';

const submitSchema = z.object({
  attemptId: z.string(),
  answers: z.record(z.string(), z.string()), // questionId -> answer
});

function mapScoreToLevel(percentage: number) {
  if (percentage <= 20) return 1;
  if (percentage <= 40) return 2;
  if (percentage <= 60) return 3;
  if (percentage <= 80) return 4;
  return 5;
}

export async function POST(req: NextRequest, ctx: any) {
  try {
    const session = await verifySession();
    if (!session || session.role !== 'learner') return Response.json({ error: 'Unauthorized' }, { status: 403 });

    const { id } = await ctx.params;
    const body = await req.json();
    const parsed = submitSchema.safeParse(body);

    if (!parsed.success) return Response.json({ error: 'Invalid input' }, { status: 400 });
    const { attemptId, answers } = parsed.data;

    const assessmentResult = await db.select().from(assessments).where(eq(assessments.id, id)).execute();
    const assessment = assessmentResult[0];
    if (!assessment) return Response.json({ error: 'Assessment not found' }, { status: 404 });

    const questions = await db.select().from(assessment_questions).where(eq(assessment_questions.assessmentId, id)).execute();

    let totalScore = 0;
    let maxScore = 0;
    const results = [];

    for (const question of questions) {
      maxScore += question.points || 1;
      const userAnswer = answers[question.id];
      const isCorrect = userAnswer === question.correctAnswer;
      const pointsEarned = isCorrect ? (question.points || 1) : 0;
      
      totalScore += pointsEarned;
      results.push({
        questionId: question.id,
        isCorrect,
        pointsEarned,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation
      });
    }

    const percentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;
    const passed = percentage >= (assessment.passingScore || 0);
    const assessedLevel = mapScoreToLevel(percentage);

    await db.update(assessment_attempts).set({
      status: 'completed',
      score: totalScore,
      percentage,
      passed,
      completedAt: new Date()
    } as any).where(eq(assessment_attempts.id, attemptId)).execute();

    // In a real scenario, we'd also link assessment to a skill and update learner_competencies
    
    return Response.json({
      score: totalScore,
      maxScore,
      percentage,
      passed,
      assessedLevel,
      results
    });
  } catch (error) {
    console.error('Error submitting assessment:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
