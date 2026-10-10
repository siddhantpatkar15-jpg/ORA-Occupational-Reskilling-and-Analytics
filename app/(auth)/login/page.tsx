'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { KeyRound, Mail, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { useEffect, useRef } from 'react';

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
  const searchParams = useSearchParams();
  const isDemo = searchParams.get('demo') === 'true';
  const formRef = useRef<HTMLFormElement>(null);
  
  const [state, formAction, isPending] = useActionState(handleLogin, null);

  useEffect(() => {
    if (state?.success) {
      router.push('/dashboard');
      router.refresh();
    }
  }, [state?.success, router]);

  const fillDemo = (email: string, role: string) => {
    if (formRef.current) {
      const emailInput = formRef.current.querySelector('input[name="email"]') as HTMLInputElement;
      const passInput = formRef.current.querySelector('input[name="password"]') as HTMLInputElement;
      if (emailInput && passInput) {
        emailInput.value = email;
        passInput.value = 'password123';
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
            <label className="text-sm font-medium text-slate-700" htmlFor="email">Email</label>
            <div className="relative">
              <div className="absolute left-3 top-2.5 text-slate-400">
                <Mail className="h-5 w-5" />
              </div>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                placeholder="name@example.com" 
                className="pl-10" 
                required 
                disabled={isPending}
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700" htmlFor="password">Password</label>
              <Link href="/forgot-password" className="text-sm text-teal-600 hover:text-teal-700 font-medium">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <div className="absolute left-3 top-2.5 text-slate-400">
                <KeyRound className="h-5 w-5" />
              </div>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                className="pl-10" 
                required 
                disabled={isPending}
              />
            </div>
          </div>
          <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white h-11" disabled={isPending}>
            {isPending ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...</>
            ) : (
              <>Sign In <ArrowRight className="ml-2 h-4 w-4" /></>
            )}
          </Button>
        </form>

        {isDemo && (
          <div className="mt-8 pt-6 border-t border-slate-100">
            <div className="text-xs uppercase font-bold text-slate-400 mb-4 tracking-wider text-center">Demo Accounts</div>
            <div className="space-y-2">
              <button onClick={() => fillDemo('individual@example.com', 'individual')} className="w-full text-left p-3 rounded-lg border border-slate-200 hover:border-teal-500 hover:bg-teal-50/50 transition-colors flex items-center justify-between group">
                <div>
                  <div className="font-medium text-slate-900 text-sm">Job Seeker</div>
                  <div className="text-xs text-slate-500">individual@example.com</div>
                </div>
                <Badge variant="outline" className="group-hover:bg-teal-100 group-hover:text-teal-700 group-hover:border-teal-200">Use</Badge>
              </button>
              <button onClick={() => fillDemo('org@example.com', 'organization')} className="w-full text-left p-3 rounded-lg border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/50 transition-colors flex items-center justify-between group">
                <div>
                  <div className="font-medium text-slate-900 text-sm">Organization Admin</div>
                  <div className="text-xs text-slate-500">org@example.com</div>
                </div>
                <Badge variant="outline" className="group-hover:bg-indigo-100 group-hover:text-indigo-700 group-hover:border-indigo-200">Use</Badge>
              </button>
              <button onClick={() => fillDemo('trainer@example.com', 'trainer')} className="w-full text-left p-3 rounded-lg border border-slate-200 hover:border-purple-500 hover:bg-purple-50/50 transition-colors flex items-center justify-between group">
                <div>
                  <div className="font-medium text-slate-900 text-sm">Content Trainer</div>
                  <div className="text-xs text-slate-500">trainer@example.com</div>
                </div>
                <Badge variant="outline" className="group-hover:bg-purple-100 group-hover:text-purple-700 group-hover:border-purple-200">Use</Badge>
              </button>
            </div>
          </div>
        )}
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
