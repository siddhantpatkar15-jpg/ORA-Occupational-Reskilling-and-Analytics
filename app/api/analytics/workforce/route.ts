import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { users, course_enrollments, learner_competencies } from '@/lib/db/schema';
import { verifySession } from '@/lib/auth/dal';
import { hasPermission } from '@/lib/auth/permissions';
import { eq, count } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    const session = await verifySession();
    const role = (session?.role || '').toLowerCase() as any;
    if (!session || !hasPermission(role, 'analytics:view')) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const totalUsersResult = await db.select({ count: count() }).from(users).execute();
    const totalEnrollmentsResult = await db.select({ count: count() }).from(course_enrollments).execute();
    const completedEnrollmentsResult = await db.select({ count: count() }).from(course_enrollments).where(eq(course_enrollments.status, 'completed')).execute();

    // In a full implementation, you'd aggregate role counts, common skill gaps, department breakdowns
    // Returning structured data
    return Response.json({
      workforce: {
        totalUsers: totalUsersResult[0].count,
        totalEnrollments: totalEnrollmentsResult[0].count,
        completedEnrollments: completedEnrollmentsResult[0].count,
        completionRate: totalEnrollmentsResult[0].count > 0 
          ? (completedEnrollmentsResult[0].count / totalEnrollmentsResult[0].count) * 100 
          : 0
      }
    });
  } catch (error) {
    console.error('Error fetching workforce analytics:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
