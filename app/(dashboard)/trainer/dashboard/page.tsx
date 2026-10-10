"use client";

import { useState } from "react";
import { Users, BookOpen, FileText, AlertCircle, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export default function TrainerDashboardPage() {
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [selectedLearner, setSelectedLearner] = useState<string | null>(null);

  const stats = [
    { name: "Total Assigned Learners", value: "48", icon: Users, trend: "+12% from last month" },
    { name: "Courses Active", value: "12", icon: BookOpen, trend: "3 new this week" },
    { name: "Assessments Created", value: "24", icon: FileText, trend: "2 pending review" },
    { name: "Pending Submissions", value: "18", icon: AlertCircle, trend: "5 need urgent feedback" },
  ];

  const strugglingLearners = [
    { id: "1", name: "Alex Chen", course: "Advanced React", issue: "Stuck on Module 3", lastActive: "2 days ago" },
    { id: "2", name: "Sarah Jenkins", course: "Cloud Architecture", issue: "Low score on Assessment 2", lastActive: "Yesterday" },
    { id: "3", name: "Marcus Johnson", course: "Data Engineering", issue: "No progress in 2 weeks", lastActive: "14 days ago" },
  ];

  const handleFeedbackSubmit = () => {
    // Submit feedback logic
    setFeedbackOpen(false);
    setSelectedLearner(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Trainer Dashboard</h1>
          <p className="text-slate-500">Overview of your learners and course activities.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline">AI Question Assistant</Button>
          <Button variant="outline">Create New Assessment</Button>
          <Button className="bg-teal-600 hover:bg-teal-700">Create New Course</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
              <stat.icon className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-slate-500">{stat.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Learners Needing Support</CardTitle>
          <CardDescription>Learners with stuck progress or low assessment scores.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {strugglingLearners.map((learner) => (
              <div key={learner.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg gap-4">
                <div>
                  <p className="font-medium">{learner.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline">{learner.course}</Badge>
                    <span className="text-sm text-red-600 font-medium">{learner.issue}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Last active: {learner.lastActive}</p>
                </div>
                
                <Dialog open={feedbackOpen && selectedLearner === learner.id} onOpenChange={(open) => {
                  setFeedbackOpen(open);
                  if (open) setSelectedLearner(learner.id);
                  else setSelectedLearner(null);
                }}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Send Feedback
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Send Feedback to {learner.name}</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                      <Textarea placeholder="Write your coaching notes or feedback here..." rows={4} />
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setFeedbackOpen(false)}>Cancel</Button>
                      <Button onClick={handleFeedbackSubmit} className="bg-teal-600 hover:bg-teal-700">Send</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
