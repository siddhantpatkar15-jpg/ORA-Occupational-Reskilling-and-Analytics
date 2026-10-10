import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { skills } from '@/lib/db/schema';
import { verifySession } from '@/lib/auth/dal';
import { like } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    const session = await verifySession();
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const category = searchParams.get('category');

    let query = db.select().from(skills);

    if (category) {
      // Assuming a category field exists on skills or similar logic
      query = query.where(like(skills.category, `%${category}%`)) as any;
    }

    const data = await query.execute();
    return Response.json(data);
  } catch (error) {
    console.error('Error fetching skills:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
