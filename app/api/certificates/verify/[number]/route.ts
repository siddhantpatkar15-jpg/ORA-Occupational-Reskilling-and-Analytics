import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { certificates, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(req: NextRequest, ctx: any) {
  try {
    const { number } = await ctx.params;
    
    const certResult = await db.select({
      certificate: certificates,
      user: {
        name: users.name
      }
    })
    .from(certificates)
    .innerJoin(users, eq(certificates.userId, users.id))
    .where(eq(certificates.certificateNumber, number))
    .execute();

    const certData = certResult[0];

    if (!certData) {
      return Response.json({ error: 'Certificate not found or invalid' }, { status: 404 });
    }

    return Response.json(certData);
  } catch (error) {
    console.error('Error verifying certificate:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
