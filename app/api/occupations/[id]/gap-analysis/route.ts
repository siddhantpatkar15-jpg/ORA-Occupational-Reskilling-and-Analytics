import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { occupations, occupationSkills, skills, learnerCompetencies } from '@/lib/db/schema';
import { verifySession } from '@/lib/auth/dal';
import { eq } from 'drizzle-orm';
import { analyzeSkillGaps, SkillRequirement, LearnerCompetency } from '@/lib/ai/gap-engine';

export async function GET(
  req: NextRequest,
  ctx: any
) {
  try {
    const session = await verifySession();
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await ctx.params;

    // Fetch target occupation
    const occRes = await db.select().from(occupations).where(eq(occupations.id, id)).execute();
    const occupation = occRes[0];
    if (!occupation) {
      return Response.json({ error: 'Occupation not found' }, { status: 404 });
    }

    // Fetch occupation required skills
    const rawReqSkills = await db.select({
      skillId: occupationSkills.skillId,
      requiredLevel: occupationSkills.requiredLevel,
      importance: occupationSkills.importance,
      isRequired: occupationSkills.isRequired,
      skillName: skills.name,
      category: skills.category,
    })
    .from(occupationSkills)
    .innerJoin(skills, eq(occupationSkills.skillId, skills.id))
    .where(eq(occupationSkills.occupationId, id))
    .execute();

    const requirements: SkillRequirement[] = rawReqSkills.map(r => ({
      skillId: r.skillId,
      skillName: r.skillName,
      category: r.category,
      requiredLevel: r.requiredLevel,
      importance: (r.importance as any) || 'important',
      isRequired: r.isRequired ?? true,
    }));

    // Fetch user competencies
    const rawComps = await db.select({
      skillId: learnerCompetencies.skillId,
      selfReportedLevel: learnerCompetencies.selfReportedLevel,
      assessedLevel: learnerCompetencies.assessedLevel,
      verifiedLevel: learnerCompetencies.verifiedLevel,
      evidenceType: learnerCompetencies.evidenceType,
      confidenceScore: learnerCompetencies.confidenceScore,
      lastAssessedAt: learnerCompetencies.lastAssessedAt,
      skillName: skills.name,
    })
    .from(learnerCompetencies)
    .innerJoin(skills, eq(learnerCompetencies.skillId, skills.id))
    .where(eq(learnerCompetencies.userId, session.userId))
    .execute();

    const competencies: LearnerCompetency[] = rawComps.map(c => ({
      skillId: c.skillId,
      skillName: c.skillName,
      selfReportedLevel: c.selfReportedLevel,
      assessedLevel: c.assessedLevel,
      verifiedLevel: c.verifiedLevel,
      evidenceType: c.evidenceType,
      confidenceScore: c.confidenceScore,
      lastAssessedAt: c.lastAssessedAt,
    }));

    const gapReport = analyzeSkillGaps(
      session.userId,
      id,
      occupation.title,
      requirements,
      competencies
    );

    return Response.json({ report: gapReport });
  } catch (error: any) {
    console.error('Error running gap analysis:', error);
    return Response.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
