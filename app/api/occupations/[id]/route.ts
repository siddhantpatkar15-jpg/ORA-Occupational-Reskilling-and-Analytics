import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { occupations, occupation_skills, skills } from '@/lib/db/schema';
import { verifySession } from '@/lib/auth/dal';
import { eq } from 'drizzle-orm';
import { RouteContext } from 'next/dist/server/route-modules/route-module';

// Next.js 16 dynamic route pattern
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

    const occupationResult = await db.select().from(occupations).where(eq(occupations.id, id)).execute();
    const occupation = occupationResult[0];

    if (!occupation) {
      return Response.json({ error: 'Occupation not found' }, { status: 404 });
    }

    const requiredSkillsResult = await db.select({
      skill: skills,
      requirement: occupation_skills
    })
    .from(occupation_skills)
    .innerJoin(skills, eq(occupation_skills.skillId, skills.id))
    .where(eq(occupation_skills.occupationId, id))
    .execute();

    return Response.json({
      ...occupation,
      skills: requiredSkillsResult
    });
  } catch (error) {
    console.error('Error fetching occupation:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
