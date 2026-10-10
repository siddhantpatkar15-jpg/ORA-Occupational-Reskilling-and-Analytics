'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Clock, AlertTriangle, ChevronLeft, ChevronRight, Send } from 'lucide-react';

const MOCK_QUESTIONS = [
  { id: 'q1', text: 'Which of the following hooks is used to perform side effects in React?', options: ['useState', 'useEffect', 'useContext', 'useReducer'] },
  { id: 'q2', text: 'What is the purpose of the virtual DOM in React?', options: ['To directly manipulate the HTML DOM', 'To optimize rendering performance', 'To handle routing', 'To manage state globally'] },
  { id: 'q3', text: 'How do you pass data from a parent component to a child component?', options: ['Using State', 'Using Props', 'Using Redux', 'Using Context'] },
];

export default function AssessmentRunnerPage() {
  const params = useParams();
  const router = useRouter();
  
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 mins
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const question = MOCK_QUESTIONS[currentQIndex];
  const isTimeLow = timeLeft < 300; // < 5 mins

  const handleSelect = (val: string) => {
    setAnswers(prev => ({ ...prev, [question.id]: val }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      router.push(`/assessments/${params.id}/results?attemptId=new-attempt`);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">React Fundamentals Assessment</h1>
            <div className="text-sm text-slate-500 mt-1 flex gap-2 items-center">
              <Badge variant="outline">Intermediate</Badge>
              <span>• {MOCK_QUESTIONS.length} Questions</span>
            </div>
          </div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-lg font-bold border ${isTimeLow ? 'bg-red-50 text-red-600 border-red-200 animate-pulse' : 'bg-slate-100 text-slate-700 border-slate-200'}`}>
            <Clock className="w-5 h-5" />
            {formatTime(timeLeft)}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Question Area */}
          <div className="lg:col-span-3">
            <Card className="min-h-[400px] flex flex-col shadow-sm">
              <CardHeader className="bg-slate-50 border-b">
                <div className="text-sm font-semibold text-teal-600 uppercase tracking-wider mb-2">
                  Question {currentQIndex + 1} of {MOCK_QUESTIONS.length}
                </div>
                <CardTitle className="text-xl leading-relaxed">{question.text}</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 flex-1">
                <RadioGroup value={answers[question.id] || ''} onValueChange={handleSelect} className="space-y-3">
                  {question.options.map((opt, i) => (
                    <div key={i} className={`flex items-center space-x-3 border p-4 rounded-lg cursor-pointer transition-colors ${answers[question.id] === opt ? 'bg-teal-50 border-teal-500' : 'hover:bg-slate-50 border-slate-200'}`}>
                      <RadioGroupItem value={opt} id={`opt-${i}`} />
                      <Label htmlFor={`opt-${i}`} className="flex-1 cursor-pointer text-base font-normal">{opt}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
              <CardFooter className="flex justify-between border-t p-4 bg-slate-50">
                <Button variant="outline" onClick={() => setCurrentQIndex(prev => prev - 1)} disabled={currentQIndex === 0}>
                  <ChevronLeft className="w-4 h-4 mr-2" /> Previous
                </Button>
                {currentQIndex === MOCK_QUESTIONS.length - 1 ? (
                  <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-slate-900 hover:bg-slate-800 text-white">
                    {isSubmitting ? 'Submitting...' : 'Submit Assessment'} <Send className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button onClick={() => setCurrentQIndex(prev => prev + 1)} className="bg-teal-600 hover:bg-teal-700">
                    Next <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>

          {/* Navigation Panel */}
          <div className="lg:col-span-1">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Question Navigator</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-2">
                  {MOCK_QUESTIONS.map((q, i) => {
                    const isAnswered = !!answers[q.id];
                    const isCurrent = i === currentQIndex;
                    return (
                      <button
                        key={q.id}
                        onClick={() => setCurrentQIndex(i)}
                        className={`w-10 h-10 rounded-md text-sm font-medium transition-all ${
                          isCurrent ? 'ring-2 ring-teal-500 ring-offset-2' : ''
                        } ${
                          isAnswered ? 'bg-teal-600 text-white hover:bg-teal-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                        }`}
                      >
                        {i + 1}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-2 pt-0">
                <div className="flex items-center gap-2 text-xs text-slate-500 w-full">
                  <div className="w-3 h-3 bg-teal-600 rounded-sm"></div> Answered
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 w-full">
                  <div className="w-3 h-3 bg-slate-100 border border-slate-200 rounded-sm"></div> Unanswered
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
