'use client';

import { useActionState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Badge, Spinner } from '@/components/ui';
import { KeyRound, Mail, ArrowRight, AlertCircle } from 'lucide-react';

// Form action handler
async function handleLogin(prevState: any, formData: FormData) {
  try {
    const email = formData.get('email');
    const password = formData.get('password');

    if (!email || !password) {
      return { error: 'Please enter both email and password.' };
    }

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    let data: any = {};
    try {
      data = await res.json();
    } catch {
      return { error: 'Server connection error. Please try again.' };
    }

    if (!res.ok) {
      return { error: data.error || 'Invalid credentials' };
    }

    return { success: true };
  } catch (error) {
    return { error: 'An unexpected error occurred. Please try again.' };
  }
}

export default function LoginPage() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(handleLogin, null);

  useEffect(() => {
    if (state?.success) {
      router.push('/dashboard');
      router.refresh();
    }
  }, [state?.success, router]);

  const fillDemo = (email: string) => {
    if (formRef.current) {
      const emailInput = formRef.current.querySelector('input[name="email"]') as HTMLInputElement;
      const passInput = formRef.current.querySelector('input[name="password"]') as HTMLInputElement;
      if (emailInput && passInput) {
        emailInput.value = email;
        passInput.value = 'OraDemo2024!';
      }
    }
  };

  return (
    <Card className="border border-[#e8e4dc] shadow-xl shadow-slate-900/5 bg-white rounded-2xl">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold tracking-tight text-[#304250]">Welcome back</CardTitle>
        <CardDescription className="text-slate-500">
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        {state?.error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm flex items-start gap-2 border border-red-100">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{state.error}</span>
          </div>
        )}

        <form ref={formRef} action={formAction} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                name="email"
                type="email"
                placeholder="name@example.com"
                required
                className="pl-9 focus:border-[#ad8075] focus:ring-[#ad8075]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">Password</label>
              <Link
                href="/forgot-password"
                className="text-xs text-[#ad8075] hover:text-[#916358] font-medium"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <KeyRound className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                name="password"
                type="password"
                placeholder="••••••••"
                required
                className="pl-9 focus:border-[#ad8075] focus:ring-[#ad8075]"
              />
            </div>
          </div>

          <Button type="submit" className="w-full bg-[#ad8075] hover:bg-[#916358] text-white h-11 transition-colors" disabled={isPending}>
            {isPending ? (
              <>
                <Spinner className="mr-2 h-4 w-4" />
                Signing in...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-[#f1ede4]">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 text-center">
            One-Click Demo Profiles (Password: OraDemo2024!)
          </p>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => fillDemo('learner@ora-demo.com')}
              className="w-full text-left p-2.5 rounded-lg border border-slate-200 hover:border-[#ad8075] hover:bg-[#ad8075]/5 transition-colors flex items-center justify-between group cursor-pointer"
            >
              <div>
                <div className="font-semibold text-slate-900 text-xs">Arjun Sharma (Learner)</div>
                <div className="text-[11px] text-slate-500">learner@ora-demo.com</div>
              </div>
              <Badge variant="default" className="text-[10px] bg-[#ad8075] text-white">Quick Fill</Badge>
            </button>

            <button
              type="button"
              onClick={() => fillDemo('trainer@ora-demo.com')}
              className="w-full text-left p-2.5 rounded-lg border border-slate-200 hover:border-[#304250] hover:bg-[#304250]/5 transition-colors flex items-center justify-between group cursor-pointer"
            >
              <div>
                <div className="font-semibold text-slate-900 text-xs">Priya Patel (Trainer)</div>
                <div className="text-[11px] text-slate-500">trainer@ora-demo.com</div>
              </div>
              <Badge variant="outline" className="text-[10px] border-[#304250]/30 text-[#304250]">Quick Fill</Badge>
            </button>

            <button
              type="button"
              onClick={() => fillDemo('admin@ora-demo.com')}
              className="w-full text-left p-2.5 rounded-lg border border-slate-200 hover:border-[#304250] hover:bg-[#304250]/5 transition-colors flex items-center justify-between group cursor-pointer"
            >
              <div>
                <div className="font-semibold text-slate-900 text-xs">Rajesh Kumar (Admin)</div>
                <div className="text-[11px] text-slate-500">admin@ora-demo.com</div>
              </div>
              <Badge variant="outline" className="text-[10px] border-[#304250]/30 text-[#304250]">Quick Fill</Badge>
            </button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center border-t border-[#f1ede4] pt-6">
        <p className="text-sm text-slate-600">
          Don't have an account?{' '}
          <Link href="/register" className="font-semibold text-[#ad8075] hover:text-[#916358]">
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
