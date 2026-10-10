import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100),
  role: z.string().transform((val) => {
    const lower = (val || '').toLowerCase();
    if (lower === 'trainer') return 'trainer';
    return 'learner'; // default all individual/learner/job_seeker to 'learner'
  }),
});
