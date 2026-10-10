"use client";

import { useState } from "react";
import { Wand2, Plus, FileText, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TrainerAssessmentsPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<any[]>([]);

  const handleGenerate = () => {
    setIsGenerating(true);
    // Mock API delay
    setTimeout(() => {
      setGeneratedQuestions([
        {
          id: 1,
          question: "Which pattern is most appropriate for a complex object creation involving multiple steps?",
          options: ["Singleton", "Factory Method", "Builder", "Adapter"],
          correctAnswer: 2,
          difficulty: "Medium",
          explanation: "The Builder pattern separates the construction of a complex object from its representation, allowing the same construction process to create various representations."
        },
        {
          id: 2,
          question: "What is the primary benefit of using a Reverse Proxy?",
          options: ["Database scaling", "Load balancing and security", "Frontend state management", "CI/CD automation"],
          correctAnswer: 1,
          difficulty: "Easy",
          explanation: "A reverse proxy acts as an intermediary for requests from clients seeking resources from servers, providing load balancing, web acceleration, and security."
        }
      ]);
      setIsGenerating(false);
    }, 2000);
  };

  const assessments = [
    { id: "1", title: "React Hooks Mastery", questions: 15, status: "Published", course: "Advanced React" },
    { id: "2", title: "System Design Basics", questions: 10, status: "Draft", course: "Architecture 101" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Assessments</h1>
          <p className="text-slate-500">Create and manage course assessments.</p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-teal-600 hover:bg-teal-700">
              <Plus className="h-4 w-4 mr-2" />
              Create Assessment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Assessment</DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="ai" className="mt-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="ai">AI Content Assistant</TabsTrigger>
                <TabsTrigger value="manual">Manual Builder</TabsTrigger>
              </TabsList>
              
              <TabsContent value="ai" className="space-y-4 pt-4">
                <div className="bg-slate-50 p-4 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <Wand2 className="h-5 w-5 text-teal-600" />
                    <h3 className="font-medium">AI Assessment Content Assistant</h3>
                  </div>
                  <p className="text-sm text-slate-500 mb-4">Paste your course material, lecture notes, or syllabus below, and our AI will generate draft multiple-choice questions.</p>
                  <Textarea placeholder="Paste source material here..." className="min-h-[150px] mb-4" />
                  <Button 
                    onClick={handleGenerate} 
                    disabled={isGenerating}
                    className="w-full bg-teal-600 hover:bg-teal-700"
                  >
                    {isGenerating ? "Generating Questions..." : "Generate Assessment Questions"}
                  </Button>
                </div>

                {generatedQuestions.length > 0 && (
                  <div className="space-y-4 mt-6">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold flex items-center">
                        <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                        Generated Draft Questions
                      </h4>
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">
                        Trainer review required before publication
                      </Badge>
                    </div>
                    
                    {generatedQuestions.map((q, idx) => (
                      <Card key={q.id}>
                        <CardHeader className="py-3 bg-slate-50 border-b">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-base">Question {idx + 1}</CardTitle>
                            <Badge variant="outline">{q.difficulty}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-3">
                          <p className="font-medium">{q.question}</p>
                          <div className="space-y-2">
                            {q.options.map((opt: string, i: number) => (
                              <div key={i} className={`p-2 rounded border text-sm ${i === q.correctAnswer ? 'bg-green-50 border-green-200 font-medium' : 'bg-white'}`}>
                                {String.fromCharCode(65 + i)}. {opt}
                              </div>
                            ))}
                          </div>
                          <div className="mt-4 p-3 bg-blue-50 text-blue-800 text-sm rounded border border-blue-100">
                            <strong>Explanation:</strong> {q.explanation}
                          </div>
                          <div className="flex justify-end gap-2 mt-4 pt-2 border-t">
                            <Button variant="outline" size="sm">Edit</Button>
                            <Button size="sm">Approve & Add</Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="manual" className="pt-4">
                <div className="text-center py-8 text-slate-500">
                  Manual builder interface...
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {assessments.map((assessment) => (
          <Card key={assessment.id}>
            <div className="flex flex-col md:flex-row md:items-center justify-between p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-slate-100 rounded-lg hidden md:block">
                  <FileText className="h-6 w-6 text-slate-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{assessment.title}</h3>
                  <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                    <span>Course: {assessment.course}</span>
                    <span>•</span>
                    <span>{assessment.questions} Questions</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-4 md:mt-0">
                <Badge variant={assessment.status === "Published" ? "default" : "secondary"}>
                  {assessment.status}
                </Badge>
                <Button variant="outline" size="sm">Edit</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
