import { NextRequest } from 'next/server';
import { deleteSession } from '../../../../lib/auth/session';

export async function POST(req: NextRequest) {
  await deleteSession();
  return Response.json({ success: true });
}
