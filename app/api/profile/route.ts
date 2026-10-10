import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { users, learnerProfiles, trainerProfiles } from '@/lib/db/schema';
import { verifySession } from '@/lib/auth/dal';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const updateProfileSchema = z.object({
  name: z.string().optional(),
  bio: z.string().optional(),
  phone: z.string().optional(),
  targetOccupationId: z.string().optional(),
  highestEducation: z.string().optional(),
  fieldOfStudy: z.string().optional(),
  yearsOfExperience: z.number().optional(),
  currentJobTitle: z.string().optional(),
  specialization: z.string().optional(),
  language: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const session = await verifySession();
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const userResult = await db.select().from(users).where(eq(users.id, session.userId)).execute();
    const user = userResult[0];
    
    if (!user) return Response.json({ error: 'User not found' }, { status: 404 });

    let profile = null;
    const role = (session.role || '').toLowerCase();

    if (role === 'learner') {
      const pRes = await db.select().from(learnerProfiles).where(eq(learnerProfiles.userId, session.userId)).execute();
      profile = pRes[0] || null;
    } else if (role === 'trainer') {
      const pRes = await db.select().from(trainerProfiles).where(eq(trainerProfiles.userId, session.userId)).execute();
      profile = pRes[0] || null;
    }

    return Response.json({ ...user, profile });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await verifySession();
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const parsed = updateProfileSchema.safeParse(body);
    
    if (!parsed.success) return Response.json({ error: 'Invalid input', details: parsed.error.errors }, { status: 400 });

    const { name, bio, phone, language, ...profileData } = parsed.data;
    const nowIso = new Date().toISOString();
    const role = (session.role || '').toLowerCase();

    // Update user base fields
    const userUpdates: any = { updatedAt: nowIso };
    if (name !== undefined) userUpdates.name = name;
    if (bio !== undefined) userUpdates.bio = bio;
    if (phone !== undefined) userUpdates.phone = phone;
    if (language !== undefined) userUpdates.language = language;

    await db.update(users).set(userUpdates).where(eq(users.id, session.userId)).execute();

    // Update extended profile fields
    if (role === 'learner') {
      const learnerUpdates: any = { updatedAt: nowIso, profileCompleteness: 85 };
      if (profileData.targetOccupationId !== undefined) learnerUpdates.targetOccupationId = profileData.targetOccupationId;
      if (profileData.highestEducation !== undefined) learnerUpdates.highestEducation = profileData.highestEducation;
      if (profileData.fieldOfStudy !== undefined) learnerUpdates.fieldOfStudy = profileData.fieldOfStudy;
      if (profileData.yearsOfExperience !== undefined) learnerUpdates.yearsOfExperience = profileData.yearsOfExperience;
      if (profileData.currentJobTitle !== undefined) learnerUpdates.currentJobTitle = profileData.currentJobTitle;

      await db.update(learnerProfiles).set(learnerUpdates).where(eq(learnerProfiles.userId, session.userId)).execute();
    } else if (role === 'trainer') {
      const trainerUpdates: any = { updatedAt: nowIso };
      if (profileData.specialization !== undefined) trainerUpdates.specialization = profileData.specialization;

      await db.update(trainerProfiles).set(trainerUpdates).where(eq(trainerProfiles.userId, session.userId)).execute();
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error updating profile:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
