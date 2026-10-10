import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { learning_roadmaps, roadmap_steps, occupation_skills, skills, learner_competencies } from '@/lib/db/schema';
import { verifySession } from '@/lib/auth/dal';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { analyzeSkillGaps, generateRoadmap } from '@/lib/ai/gap-engine';

const createRoadmapSchema = z.object({
  occupationId: z.string()
});

export async function GET(req: NextRequest) {
  try {
    const session = await verifySession();
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const roadmaps = await db.select().from(learning_roadmaps).where(eq(learning_roadmaps.userId, session.userId)).execute();
    return Response.json(roadmaps);
  } catch (error) {
    console.error('Error fetching roadmaps:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await verifySession();
    if (!session || session.role !== 'learner') return Response.json({ error: 'Unauthorized' }, { status: 403 });

    const body = await req.json();
    const parsed = createRoadmapSchema.safeParse(body);
    if (!parsed.success) return Response.json({ error: 'Invalid input' }, { status: 400 });

    const { occupationId } = parsed.data;

    const reqSkills = await db.select({
      skillId: occupation_skills.skillId,
      requiredLevel: occupation_skills.requiredLevel,
      importance: occupation_skills.importance,
      skillName: skills.name
    })
    .from(occupation_skills)
    .innerJoin(skills, eq(occupation_skills.skillId, skills.id))
    .where(eq(occupation_skills.occupationId, occupationId))
    .execute();

    const comps = await db.select({
      skillId: learner_competencies.skillId,
      currentLevel: learner_competencies.proficiencyLevel
    })
    .from(learner_competencies)
    .where(eq(learner_competencies.userId, session.userId))
    .execute();

    const gapReport = await analyzeSkillGaps({
      occupationId,
      requiredSkills: reqSkills,
      learnerCompetencies: comps
    });

    const roadmapData = await generateRoadmap(gapReport);
    const roadmapId = uuidv4();

    await db.insert(learning_roadmaps).values({
      id: roadmapId,
      userId: session.userId,
      occupationId,
      title: roadmapData.title || 'Learning Roadmap',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    } as any).execute();

    for (const step of roadmapData.steps || []) {
      await db.insert(roadmap_steps).values({
        id: uuidv4(),
        roadmapId,
        title: step.title,
        description: step.description,
        type: step.type || 'course',
        resourceId: step.resourceId,
        status: 'pending',
        order: step.order || 0
      } as any).execute();
    }

    return Response.json({ id: roadmapId, status: 'created' }, { status: 201 });
  } catch (error) {
    console.error('Error creating roadmap:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
