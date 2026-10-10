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

    const data = await res.json();

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
    <Card className="border-none shadow-xl shadow-slate-200/50 bg-white">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">Welcome back</CardTitle>
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
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">Password</label>
              <Link
                href="/forgot-password"
                className="text-xs text-teal-600 hover:text-teal-700 font-medium"
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
                className="pl-9"
              />
            </div>
          </div>

          <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700" disabled={isPending}>
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

        <div className="mt-6 pt-6 border-t border-slate-100">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 text-center">
            One-Click Demo Profiles (Password: OraDemo2024!)
          </p>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => fillDemo('learner@ora-demo.com')}
              className="w-full text-left p-2.5 rounded-lg border border-slate-200 hover:border-teal-500 hover:bg-teal-50/50 transition-colors flex items-center justify-between group cursor-pointer"
            >
              <div>
                <div className="font-semibold text-slate-900 text-xs">Arjun Sharma (Learner)</div>
                <div className="text-[11px] text-slate-500">learner@ora-demo.com</div>
              </div>
              <Badge variant="default" className="text-[10px] bg-teal-600">Quick Fill</Badge>
            </button>

            <button
              type="button"
              onClick={() => fillDemo('trainer@ora-demo.com')}
              className="w-full text-left p-2.5 rounded-lg border border-slate-200 hover:border-purple-500 hover:bg-purple-50/50 transition-colors flex items-center justify-between group cursor-pointer"
            >
              <div>
                <div className="font-semibold text-slate-900 text-xs">Priya Patel (Trainer)</div>
                <div className="text-[11px] text-slate-500">trainer@ora-demo.com</div>
              </div>
              <Badge variant="outline" className="text-[10px]">Quick Fill</Badge>
            </button>

            <button
              type="button"
              onClick={() => fillDemo('admin@ora-demo.com')}
              className="w-full text-left p-2.5 rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition-colors flex items-center justify-between group cursor-pointer"
            >
              <div>
                <div className="font-semibold text-slate-900 text-xs">Rajesh Kumar (Admin)</div>
                <div className="text-[11px] text-slate-500">admin@ora-demo.com</div>
              </div>
              <Badge variant="outline" className="text-[10px]">Quick Fill</Badge>
            </button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center border-t border-slate-100 pt-6">
        <p className="text-sm text-slate-600">
          Don't have an account?{' '}
          <Link href="/register" className="font-semibold text-teal-600 hover:text-teal-700">
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
