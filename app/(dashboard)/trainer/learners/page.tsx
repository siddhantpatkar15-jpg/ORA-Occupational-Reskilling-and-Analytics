"use client";

import { useState } from "react";
import { Search, Filter, CheckCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

export default function TrainerLearnersPage() {
  const [reviewOpen, setReviewOpen] = useState(false);
  const [selectedLearner, setSelectedLearner] = useState<any>(null);
  
  const learners = [
    { 
      id: "1", 
      name: "David Kim", 
      department: "Engineering",
      targetOccupation: "Senior Frontend Engineer", 
      enrollmentProgress: 75,
      completedAssessments: 3,
      submittedEvidence: "React Performance Optimization Project",
      status: "On Track"
    },
    { 
      id: "2", 
      name: "Elena Rodriguez", 
      department: "Data Science",
      targetOccupation: "Data Architect", 
      enrollmentProgress: 40,
      completedAssessments: 1,
      submittedEvidence: "Data Pipeline Design Doc",
      status: "Needs Review"
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Learner Management</h1>
          <p className="text-slate-500">Manage your assigned learners and review their progress.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
          <Input placeholder="Search learners..." className="pl-9" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            <SelectItem value="engineering">Engineering</SelectItem>
            <SelectItem value="data">Data Science</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {learners.map((learner) => (
          <Card key={learner.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{learner.name}</CardTitle>
                  <CardDescription>{learner.department} • Target: {learner.targetOccupation}</CardDescription>
                </div>
                <Badge variant={learner.status === "On Track" ? "default" : "destructive"}>
                  {learner.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-500">Program Progress</span>
                  <span className="font-medium">{learner.enrollmentProgress}%</span>
                </div>
                <Progress value={learner.enrollmentProgress} className="h-2" />
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <span className="flex items-center text-slate-500">
                  <CheckCircle className="h-4 w-4 mr-1 text-teal-600" />
                  {learner.completedAssessments} Assessments Completed
                </span>
              </div>
              
              <div className="pt-4 border-t">
                <p className="text-sm font-medium mb-2">Latest Evidence Submission</p>
                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-md">
                  <span className="text-sm flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-slate-500" />
                    {learner.submittedEvidence}
                  </span>
                  
                  <Dialog open={reviewOpen && selectedLearner?.id === learner.id} onOpenChange={(open) => {
                    setReviewOpen(open);
                    if (open) setSelectedLearner(learner);
                    else setSelectedLearner(null);
                  }}>
                    <DialogTrigger asChild>
                      <Button size="sm">Review Evidence</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Review Evidence: {learner.name}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div>
                          <h4 className="text-sm font-medium mb-1">Submitted Item</h4>
                          <p className="text-sm text-slate-500 bg-slate-50 p-2 rounded">{learner.submittedEvidence}</p>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium mb-2">Verified Competency Level (1-5)</h4>
                          <Select defaultValue="3">
                            <SelectTrigger>
                              <SelectValue placeholder="Select level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1 - Novice</SelectItem>
                              <SelectItem value="2">2 - Advanced Beginner</SelectItem>
                              <SelectItem value="3">3 - Competent</SelectItem>
                              <SelectItem value="4">4 - Proficient</SelectItem>
                              <SelectItem value="5">5 - Expert</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium mb-2">Coaching Notes</h4>
                          <Textarea placeholder="Provide feedback to the learner..." rows={4} />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setReviewOpen(false)}>Cancel</Button>
                        <Button className="bg-teal-600 hover:bg-teal-700" onClick={() => setReviewOpen(false)}>Submit Review</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
