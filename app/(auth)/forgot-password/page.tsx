'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Mail, ArrowLeft, Send, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsPending(false);
    setIsSubmitted(true);
  };

  return (
    <Card className="border-none shadow-xl shadow-slate-200/50 bg-white">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">Reset password</CardTitle>
        <CardDescription className="text-slate-500">
          Enter your email address and we'll send you a link to reset your password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isSubmitted ? (
          <div className="text-center py-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center mb-4">
              <CheckCircle2 className="h-6 w-6 text-teal-600" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">Check your email</h3>
            <p className="text-sm text-slate-500 mb-6">
              If an account exists with that email address, we've sent password reset instructions.
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/login">Return to login</Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
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

            <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white h-11" disabled={isPending}>
              {isPending ? (
                <span className="flex items-center gap-2">Sending...</span>
              ) : (
                <span className="flex items-center gap-2">Send reset link <Send className="h-4 w-4" /></span>
              )}
            </Button>
          </form>
        )}
      </CardContent>
      {!isSubmitted && (
        <CardFooter className="flex justify-center border-t border-slate-100 pt-6">
          <Link href="/login" className="flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to login
          </Link>
        </CardFooter>
      )}
    </Card>
  );
}
