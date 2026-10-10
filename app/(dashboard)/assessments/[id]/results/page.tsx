'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Award, ArrowRight, BookOpen, Target } from 'lucide-react';

export default function AssessmentResultsPage() {
  const isPassed = true;
  const score = 85;

  return (
    <div className="container mx-auto p-6 space-y-8 max-w-4xl">
      {/* Result Banner */}
      <div className={`p-8 rounded-xl shadow-sm text-center border-2 ${isPassed ? 'bg-teal-50 border-teal-200' : 'bg-red-50 border-red-200'}`}>
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 shadow-sm bg-white">
          {isPassed ? <Award className="w-10 h-10 text-teal-600" /> : <XCircle className="w-10 h-10 text-red-500" />}
        </div>
        <h1 className="text-4xl font-bold text-slate-900 mb-2">{score}% Score</h1>
        <div className="flex justify-center items-center gap-3 mb-6">
          <Badge className={isPassed ? 'bg-teal-600 text-white' : 'bg-red-600 text-white'}>
            {isPassed ? 'Passed' : 'Not Passed'}
          </Badge>
          <span className="text-slate-500 text-sm">Time spent: 24m 10s</span>
        </div>
        
        {isPassed && (
          <div className="bg-white p-4 rounded-lg inline-block text-left shadow-sm border border-slate-100">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-teal-600" /> Competency Updated
            </h3>
            <p className="text-sm text-slate-600 mt-1">Your competency record for <strong>React</strong> has been updated to <strong>Level 3 - Intermediate</strong> (Assessed via Knowledge Test).</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/skills" className="w-full">
          <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2 items-center justify-center">
            <Target className="w-5 h-5 text-slate-700" />
            <span>View Updated Gaps</span>
          </Button>
        </Link>
        <Link href="/roadmap" className="w-full">
          <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2 items-center justify-center border-teal-200 bg-teal-50 hover:bg-teal-100">
            <BookOpen className="w-5 h-5 text-teal-700" />
            <span className="text-teal-900">View Learning Roadmap</span>
          </Button>
        </Link>
        <Link href="/assessments/a1" className="w-full">
          <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2 items-center justify-center">
            <ArrowRight className="w-5 h-5 text-slate-700" />
            <span>Retake Assessment</span>
          </Button>
        </Link>
      </div>

      {/* Question Breakdown */}
      <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">Question Breakdown</h2>
      <div className="space-y-6">
        {/* Q1 - Correct */}
        <Card className="border-l-4 border-l-teal-500 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <CardDescription className="font-mono">Question 1</CardDescription>
              <Badge variant="outline" className="text-teal-700 bg-teal-50 border-teal-200">Correct</Badge>
            </div>
            <CardTitle className="text-lg">Which of the following hooks is used to perform side effects in React?</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 rounded border">
                <span className="text-slate-500 block text-xs uppercase mb-1">Your Answer</span>
                <span className="font-medium text-slate-900">useEffect</span>
              </div>
              <div className="p-3 bg-teal-50 rounded border border-teal-100">
                <span className="text-teal-700 block text-xs uppercase mb-1">Correct Answer</span>
                <span className="font-medium text-teal-900">useEffect</span>
              </div>
            </div>
            <div className="p-4 bg-slate-100 rounded-lg text-slate-700 mt-2">
              <strong>Explanation:</strong> The <code>useEffect</code> Hook lets you perform side effects in function components. Data fetching, setting up a subscription, and manually changing the DOM in React components are all examples of side effects.
            </div>
          </CardContent>
        </Card>

        {/* Q2 - Incorrect */}
        <Card className="border-l-4 border-l-red-500 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <CardDescription className="font-mono">Question 2</CardDescription>
              <Badge variant="outline" className="text-red-700 bg-red-50 border-red-200">Incorrect</Badge>
            </div>
            <CardTitle className="text-lg">What is the purpose of the virtual DOM in React?</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-red-50 rounded border border-red-100">
                <span className="text-red-700 block text-xs uppercase mb-1">Your Answer</span>
                <span className="font-medium text-red-900 strike-through">To directly manipulate the HTML DOM</span>
              </div>
              <div className="p-3 bg-teal-50 rounded border border-teal-100">
                <span className="text-teal-700 block text-xs uppercase mb-1">Correct Answer</span>
                <span className="font-medium text-teal-900">To optimize rendering performance</span>
              </div>
            </div>
            <div className="p-4 bg-slate-100 rounded-lg text-slate-700 mt-2">
              <strong>Explanation:</strong> The virtual DOM (VDOM) is a programming concept where an ideal, or "virtual", representation of a UI is kept in memory and synced with the "real" DOM. This avoids expensive direct DOM manipulation operations, optimizing performance.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
