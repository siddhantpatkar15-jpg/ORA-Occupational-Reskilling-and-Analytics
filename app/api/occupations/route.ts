import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { occupations } from '@/lib/db/schema';
import { verifySession } from '@/lib/auth/dal';
import { eq, and } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    const session = await verifySession();
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const industry = searchParams.get('industry');
    const level = searchParams.get('level');

    let conditions = [];
    if (industry) conditions.push(eq(occupations.industry, industry));
    if (level) conditions.push(eq(occupations.level, level));

    let query = db.select().from(occupations);
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    const data = await query.execute();
    return Response.json(data);
  } catch (error) {
    console.error('Error fetching occupations:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
