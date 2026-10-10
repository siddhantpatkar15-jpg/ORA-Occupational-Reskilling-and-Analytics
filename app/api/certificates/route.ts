import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { certificates } from '@/lib/db/schema';
import { verifySession } from '@/lib/auth/dal';
import { eq } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    const session = await verifySession();
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const certs = await db.select().from(certificates).where(eq(certificates.userId, session.userId)).execute();
    return Response.json(certs);
  } catch (error) {
    console.error('Error fetching certificates:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
