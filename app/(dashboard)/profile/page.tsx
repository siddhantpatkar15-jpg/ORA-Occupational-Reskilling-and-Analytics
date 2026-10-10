'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { UploadCloud, CheckCircle2, User, Target, Award, BookOpen } from 'lucide-react';

export default function ProfilePage() {
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setToastMessage('Profile updated successfully!');
      setTimeout(() => setToastMessage(''), 3000);
    }, 1000);
  };

  return (
    <div className="container mx-auto p-6 space-y-8 max-w-5xl">
      {toastMessage && (
        <div className="fixed top-4 right-4 bg-teal-600 text-white px-4 py-2 rounded shadow-lg flex items-center gap-2 z-50">
          <CheckCircle2 className="w-4 h-4" /> {toastMessage}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row items-center gap-6 bg-slate-900 text-white p-8 rounded-xl shadow-md">
        <div className="relative">
          <div className="w-24 h-24 bg-teal-600 rounded-full flex items-center justify-center text-3xl font-bold border-4 border-slate-800">
            JD
          </div>
          <div className="absolute -bottom-2 -right-2 bg-slate-800 rounded-full p-1 border-2 border-slate-900">
            <div className="text-xs font-bold text-teal-400 px-2">85%</div>
          </div>
        </div>
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-bold">John Doe</h1>
          <p className="text-slate-400 text-lg">Junior Developer • john.doe@example.com</p>
        </div>
        <div>
          <Button onClick={handleSave} disabled={isSaving} className="bg-teal-600 hover:bg-teal-700">
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-slate-100 rounded-lg p-1">
          <TabsTrigger value="personal" className="data-[state=active]:bg-white data-[state=active]:text-teal-600 data-[state=active]:shadow-sm rounded-md py-2"><User className="w-4 h-4 mr-2"/> Personal Info</TabsTrigger>
          <TabsTrigger value="education" className="data-[state=active]:bg-white data-[state=active]:text-teal-600 data-[state=active]:shadow-sm rounded-md py-2"><BookOpen className="w-4 h-4 mr-2"/> Experience & Ed</TabsTrigger>
          <TabsTrigger value="career" className="data-[state=active]:bg-white data-[state=active]:text-teal-600 data-[state=active]:shadow-sm rounded-md py-2"><Target className="w-4 h-4 mr-2"/> Target Career</TabsTrigger>
          <TabsTrigger value="skills" className="data-[state=active]:bg-white data-[state=active]:text-teal-600 data-[state=active]:shadow-sm rounded-md py-2"><Award className="w-4 h-4 mr-2"/> Skills & Evidence</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your contact and basic profile details.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" defaultValue="John" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" defaultValue="Doe" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="john.doe@example.com" disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" type="tel" defaultValue="+1 234 567 8900" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="education">
            <Card>
              <CardHeader>
                <CardTitle>Experience & Education</CardTitle>
                <CardDescription>Your background and formal training.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="highestEd">Highest Education</Label>
                    <Select defaultValue="bachelors">
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                        <SelectItem value="masters">Master's Degree</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="field">Field of Study</Label>
                    <Input id="field" defaultValue="Computer Science" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="yoe">Years of Experience</Label>
                    <Select defaultValue="2-3">
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-1">0-1 years</SelectItem>
                        <SelectItem value="2-3">2-3 years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="career">
            <Card>
              <CardHeader>
                <CardTitle>Target Career</CardTitle>
                <CardDescription>Define your goals to get a tailored roadmap.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="targetRole">Target Occupation</Label>
                  <Select defaultValue="full-stack">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-stack">Full Stack Developer</SelectItem>
                      <SelectItem value="data-analyst">Data Analyst</SelectItem>
                      <SelectItem value="ml-engineer">ML Engineer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="p-4 bg-teal-50 text-teal-900 rounded-md text-sm border border-teal-100">
                  Based on your target of <strong>Full Stack Developer</strong>, we recommend focusing on advanced React, Node.js, and CI/CD pipelines.
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="skills">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Skills Inventory</CardTitle>
                  <CardDescription>Track your proficiency across different competencies.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-slate-50 text-slate-700">
                        <tr>
                          <th className="px-4 py-3 rounded-tl-md">Skill</th>
                          <th className="px-4 py-3">Category</th>
                          <th className="px-4 py-3">Self-Reported</th>
                          <th className="px-4 py-3">Assessed</th>
                          <th className="px-4 py-3 rounded-tr-md">Verified</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="px-4 py-3 font-medium">React</td>
                          <td className="px-4 py-3 text-slate-500">Frontend</td>
                          <td className="px-4 py-3"><Badge variant="outline">Level 3</Badge></td>
                          <td className="px-4 py-3"><Badge className="bg-teal-100 text-teal-800 hover:bg-teal-100 border-teal-200">Level 4</Badge></td>
                          <td className="px-4 py-3"><span className="text-slate-400">-</span></td>
                        </tr>
                        <tr className="border-b">
                          <td className="px-4 py-3 font-medium">SQL</td>
                          <td className="px-4 py-3 text-slate-500">Database</td>
                          <td className="px-4 py-3"><Badge variant="outline">Level 2</Badge></td>
                          <td className="px-4 py-3"><span className="text-slate-400">-</span></td>
                          <td className="px-4 py-3"><span className="text-slate-400">-</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Upload Evidence</CardTitle>
                  <CardDescription>Submit projects, certifications, or reviews to verify your skills.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="evidenceTitle">Evidence Title</Label>
                      <Input id="evidenceTitle" placeholder="e.g. AWS Solutions Architect Cert" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="evidenceType">Evidence Type</Label>
                      <Select>
                        <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="project">Project Portfolio</SelectItem>
                          <SelectItem value="certification">Certification</SelectItem>
                          <SelectItem value="review">Trainer Review</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer">
                    <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-slate-700">Click to upload or drag and drop</p>
                    <p className="text-xs text-slate-500">PDF, JPG, PNG up to 10MB</p>
                  </div>
                  <Button variant="outline" className="w-full">Submit Evidence</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
