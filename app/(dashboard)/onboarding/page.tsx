'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, CheckCircle2, Briefcase, GraduationCap, Target, Brain, LineChart } from 'lucide-react';

const STEPS = 6;

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    jobTitle: '',
    experience: '',
    bio: '',
    phone: '',
    education: '',
    fieldOfStudy: '',
    skills: [] as { name: string; level: number }[],
    targetOccupation: '',
  });

  const progress = (currentStep / STEPS) * 100;

  const handleNext = () => {
    if (currentStep < STEPS) setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const handleFinish = async () => {
    setIsSubmitting(true);
    try {
      await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      router.push('/dashboard');
    } catch (error) {
      console.error('Failed to save profile:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="jobTitle">Current Job Title</Label>
              <Input id="jobTitle" value={formData.jobTitle} onChange={e => setFormData({ ...formData, jobTitle: e.target.value })} placeholder="e.g. Junior Developer" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="experience">Years of Experience</Label>
              <Select value={formData.experience} onValueChange={v => setFormData({ ...formData, experience: v })}>
                <SelectTrigger id="experience"><SelectValue placeholder="Select years" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-1">0-1 years</SelectItem>
                  <SelectItem value="2-3">2-3 years</SelectItem>
                  <SelectItem value="4-5">4-5 years</SelectItem>
                  <SelectItem value="5+">5+ years</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bio">Professional Bio</Label>
              <Textarea id="bio" value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })} placeholder="Tell us a bit about yourself..." />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="education">Highest Education Level</Label>
              <Select value={formData.education} onValueChange={v => setFormData({ ...formData, education: v })}>
                <SelectTrigger id="education"><SelectValue placeholder="Select education" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="high-school">High School</SelectItem>
                  <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                  <SelectItem value="masters">Master's Degree</SelectItem>
                  <SelectItem value="phd">Ph.D.</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="fieldOfStudy">Field of Study</Label>
              <Input id="fieldOfStudy" value={formData.fieldOfStudy} onChange={e => setFormData({ ...formData, fieldOfStudy: e.target.value })} placeholder="e.g. Computer Science" />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <div className="text-sm text-slate-500 mb-4">Rate your proficiency in key skills (1 - Novice to 5 - Expert)</div>
            {['JavaScript', 'React', 'SQL', 'Python'].map(skill => (
              <div key={skill} className="flex items-center justify-between gap-4">
                <Label className="w-32">{skill}</Label>
                <Select
                  onValueChange={v => {
                    const existing = formData.skills.filter(s => s.name !== skill);
                    setFormData({ ...formData, skills: [...existing, { name: skill, level: parseInt(v) }] });
                  }}
                >
                  <SelectTrigger className="w-[180px]"><SelectValue placeholder="Select level" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 - Novice</SelectItem>
                    <SelectItem value="2">2 - Beginner</SelectItem>
                    <SelectItem value="3">3 - Intermediate</SelectItem>
                    <SelectItem value="4">4 - Advanced</SelectItem>
                    <SelectItem value="5">5 - Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="targetOccupation">Target Occupation</Label>
              <Select value={formData.targetOccupation} onValueChange={v => setFormData({ ...formData, targetOccupation: v })}>
                <SelectTrigger id="targetOccupation"><SelectValue placeholder="Select target role" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="data-analyst">Data Analyst</SelectItem>
                  <SelectItem value="full-stack">Full Stack Developer</SelectItem>
                  <SelectItem value="ml-engineer">ML Engineer</SelectItem>
                  <SelectItem value="product-manager">Product Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="bg-slate-50 p-4 rounded-md border text-sm text-slate-700">
              <p>Choosing a target occupation helps us personalize your skill gap analysis and generate a learning roadmap tailored to your career goals.</p>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-4 text-center py-6">
            <Brain className="w-12 h-12 text-teal-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold">Initial Competency Assessment</h3>
            <p className="text-slate-600 mb-6">Take a quick diagnostic test to benchmark your current skills against industry standards. This helps calibrate your starting point.</p>
            <Button variant="outline" className="w-full" onClick={() => {}}>Take Diagnostic Now</Button>
            <Button variant="ghost" className="w-full text-slate-500 mt-2" onClick={handleNext}>Skip for later</Button>
          </div>
        );
      case 6:
        return (
          <div className="space-y-6 text-center py-6">
            <CheckCircle2 className="w-16 h-16 text-teal-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-slate-900">You're All Set!</h3>
            <p className="text-slate-600">We've generated your personalized development plan based on your profile and target goals.</p>
            <div className="grid grid-cols-2 gap-4 mt-6 text-left">
              <div className="p-4 border rounded-lg bg-slate-50">
                <div className="font-semibold text-slate-900">Profile Completeness</div>
                <div className="text-2xl font-bold text-teal-600">85%</div>
              </div>
              <div className="p-4 border rounded-lg bg-slate-50">
                <div className="font-semibold text-slate-900">Target Role</div>
                <div className="text-lg font-medium text-slate-700 capitalize">{formData.targetOccupation.replace('-', ' ') || 'Not set'}</div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const getStepIcon = () => {
    switch (currentStep) {
      case 1: return <Briefcase className="w-5 h-5 text-teal-600" />;
      case 2: return <GraduationCap className="w-5 h-5 text-teal-600" />;
      case 3: return <Brain className="w-5 h-5 text-teal-600" />;
      case 4: return <Target className="w-5 h-5 text-teal-600" />;
      case 5: return <LineChart className="w-5 h-5 text-teal-600" />;
      case 6: return <CheckCircle2 className="w-5 h-5 text-teal-600" />;
      default: return null;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Personal & Professional Profile';
      case 2: return 'Education & Experience';
      case 3: return 'Current Skills';
      case 4: return 'Career Goals';
      case 5: return 'Competency Benchmark';
      case 6: return 'Personalized Plan';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-2xl shadow-lg border-slate-200">
        <CardHeader className="bg-slate-900 text-white rounded-t-lg pb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="bg-teal-600 p-2 rounded-md">
                {getStepIcon()}
              </div>
              <div>
                <CardTitle className="text-xl">Step {currentStep} of {STEPS}</CardTitle>
                <CardDescription className="text-slate-300">{getStepTitle()}</CardDescription>
              </div>
            </div>
            <div className="text-sm font-medium bg-slate-800 px-3 py-1 rounded-full text-teal-400">
              {Math.round(progress)}%
            </div>
          </div>
          <Progress value={progress} className="h-2 bg-slate-800 [&>div]:bg-teal-500" />
        </CardHeader>
        <CardContent className="pt-8 min-h-[300px]">
          {renderStep()}
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6 bg-slate-50 rounded-b-lg">
          <Button variant="outline" onClick={handleBack} disabled={currentStep === 1 || currentStep === 6}>
            <ChevronLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          {currentStep < STEPS ? (
            <Button onClick={handleNext} className="bg-teal-600 hover:bg-teal-700">
              Next <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleFinish} disabled={isSubmitting} className="bg-teal-600 hover:bg-teal-700">
              {isSubmitting ? 'Saving...' : 'View Dashboard'} <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
