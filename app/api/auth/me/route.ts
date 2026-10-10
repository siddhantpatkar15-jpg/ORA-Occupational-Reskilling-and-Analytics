import { NextRequest } from 'next/server';
import { verifySession, getUser } from '../../../../lib/auth/dal';

export async function GET(req: NextRequest) {
  try {
    const session = await verifySession();
    
    const user = await getUser();
    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }
    
    const { passwordHash: _, ...userWithoutPassword } = user;
    return Response.json({ user: userWithoutPassword });
  } catch (error) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
