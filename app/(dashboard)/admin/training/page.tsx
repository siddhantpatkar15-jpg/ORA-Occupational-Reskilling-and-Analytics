"use client";

import { Plus, BookOpen, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AdminTrainingPage() {
  const initiatives = [
    { 
      id: "1", 
      title: "Cloud Migration Readiness", 
      departments: ["Engineering", "IT"], 
      trainers: ["Alice Smith", "Bob Jones"],
      progress: 65,
      status: "Active"
    },
    { 
      id: "2", 
      title: "Data Literacy for Product Managers", 
      departments: ["Product", "Design"], 
      trainers: ["Charlie Brown"],
      progress: 20,
      status: "Active"
    },
    { 
      id: "3", 
      title: "New Manager Onboarding", 
      departments: ["All"], 
      trainers: ["HR Team"],
      progress: 100,
      status: "Completed"
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Training Initiatives</h1>
          <p className="text-slate-500">Manage organization-wide training programs and trainer assignments.</p>
        </div>
        <Button className="bg-teal-600 hover:bg-teal-700">
          <Plus className="h-4 w-4 mr-2" />
          New Initiative
        </Button>
      </div>

      <div className="grid gap-6">
        {initiatives.map((initiative) => (
          <Card key={initiative.id}>
            <CardHeader className="flex flex-row items-start justify-between pb-2">
              <div>
                <CardTitle className="text-xl">{initiative.title}</CardTitle>
                <CardDescription className="flex items-center gap-2 mt-2">
                  <BookOpen className="h-4 w-4" /> Target: {initiative.departments.join(", ")}
                </CardDescription>
              </div>
              <Badge variant={initiative.status === "Active" ? "default" : "secondary"}>
                {initiative.status}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6 mt-4">
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-slate-700">Overall Progress</span>
                    <span>{initiative.progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-teal-600" 
                      style={{ width: `${initiative.progress}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Users className="h-4 w-4" />
                  <span className="font-medium">Assigned Trainers:</span>
                  <span>{initiative.trainers.join(", ")}</span>
                  <Button variant="link" size="sm" className="ml-2 h-auto p-0">Manage</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
