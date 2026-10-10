import { verifySession, getUser } from '@/lib/auth/dal';
import { redirect } from 'next/navigation';
import { AppShell } from '@/components/layout/app-shell';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  try {
    const session = await verifySession();
    if (!session) redirect('/login');
    
    const user = await getUser();
    if (!user) redirect('/login');
    
    return (
      <AppShell user={{
        id: user.id,
        name: user.name,
        role: user.role,
        email: user.email,
        avatarUrl: user.avatarUrl || undefined,
        language: user.language || 'en',
      }}>
        {children}
      </AppShell>
    );
  } catch (error) {
    // Fallback if verification throws
    redirect('/login');
  }
}
