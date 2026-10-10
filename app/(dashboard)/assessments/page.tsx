'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Clock, HelpCircle, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const AVAILABLE_ASSESSMENTS = [
  { id: 'a1', title: 'React Fundamentals', skill: 'React', difficulty: 'Intermediate', questions: 20, timeLimit: 30, passScore: 70 },
  { id: 'a2', title: 'Advanced SQL Queries', skill: 'SQL', difficulty: 'Advanced', questions: 15, timeLimit: 45, passScore: 75 },
  { id: 'a3', title: 'Python Basics', skill: 'Python', difficulty: 'Beginner', questions: 10, timeLimit: 15, passScore: 60 },
];

const COMPLETED_ASSESSMENTS = [
  { id: 'c1', attemptId: 'att1', title: 'HTML/CSS Mastery', skill: 'HTML/CSS', score: 85, passed: true, level: 4, date: '2023-10-01' },
  { id: 'c2', attemptId: 'att2', title: 'Node.js Basics', skill: 'Node.js', score: 50, passed: false, level: 2, date: '2023-09-28' },
];

export default function AssessmentsPage() {
  return (
    <div className="container mx-auto p-6 space-y-8 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Assessments Hub</h1>
          <p className="text-slate-500 mt-1">Validate your skills and update your competency profile.</p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-blue-900">
          <p><strong>Understanding Skill Levels:</strong> ORA tracks your skills in three ways:</p>
          <ul className="list-disc ml-5 mt-1 space-y-1">
            <li><strong>Self-Reported:</strong> Levels you set in your profile.</li>
            <li><strong>Assessed (Knowledge):</strong> Levels verified through the timed multiple-choice assessments below.</li>
            <li><strong>Verified (Applied):</strong> Levels confirmed by trainers or project evidence submission.</li>
          </ul>
        </div>
      </div>

      <Tabs defaultValue="available" className="w-full">
        <TabsList className="bg-slate-100 p-1 rounded-md mb-6 inline-flex">
          <TabsTrigger value="available" className="data-[state=active]:bg-white data-[state=active]:shadow-sm px-4 py-2 rounded">Available Assessments</TabsTrigger>
          <TabsTrigger value="completed" className="data-[state=active]:bg-white data-[state=active]:shadow-sm px-4 py-2 rounded">Completed History</TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {AVAILABLE_ASSESSMENTS.map(assessment => (
              <Card key={assessment.id} className="flex flex-col hover:border-teal-500 transition-colors">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className="bg-slate-50 text-slate-700">{assessment.skill}</Badge>
                    <Badge className={
                      assessment.difficulty === 'Beginner' ? 'bg-green-100 text-green-800 hover:bg-green-100' :
                      assessment.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' :
                      'bg-red-100 text-red-800 hover:bg-red-100'
                    }>{assessment.difficulty}</Badge>
                  </div>
                  <CardTitle className="text-xl">{assessment.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="space-y-3 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-slate-400" />
                      <span>{assessment.questions} Questions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span>{assessment.timeLimit} Minutes Time Limit</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-slate-400" />
                      <span>{assessment.passScore}% Passing Score</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-4 border-t bg-slate-50">
                  <Link href={`/assessments/${assessment.id}`} className="w-full">
                    <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white">Start Assessment</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {COMPLETED_ASSESSMENTS.map(attempt => (
              <Card key={attempt.attemptId} className="flex flex-col">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline">{attempt.skill}</Badge>
                    {attempt.passed ? (
                      <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-100 border-teal-200 flex gap-1 items-center">
                        <CheckCircle className="w-3 h-3" /> Passed
                      </Badge>
                    ) : (
                      <Badge className="bg-red-50 text-red-700 hover:bg-red-50 border-red-200 flex gap-1 items-center">
                        <XCircle className="w-3 h-3" /> Failed
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl">{attempt.title}</CardTitle>
                  <CardDescription>Completed on {attempt.date}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="bg-slate-50 p-4 rounded-lg flex justify-between items-center border">
                    <div className="text-center">
                      <div className="text-sm text-slate-500 mb-1">Score</div>
                      <div className={`text-2xl font-bold ${attempt.passed ? 'text-teal-600' : 'text-red-600'}`}>{attempt.score}%</div>
                    </div>
                    <div className="w-px h-10 bg-slate-200"></div>
                    <div className="text-center">
                      <div className="text-sm text-slate-500 mb-1">Assessed Level</div>
                      <div className="text-xl font-bold text-slate-700">Lvl {attempt.level}</div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-4 border-t bg-slate-50">
                  <Link href={`/assessments/${attempt.id}/results?attemptId=${attempt.attemptId}`} className="w-full">
                    <Button variant="outline" className="w-full">View Results Breakdown</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
