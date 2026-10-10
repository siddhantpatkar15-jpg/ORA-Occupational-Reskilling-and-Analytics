"use client";

import { useState } from "react";
import { Plus, Settings, MoreVertical } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function TrainerCoursesPage() {
  const courses = [
    { id: "1", title: "React Performance Tuning", targetSkill: "Frontend Engineering", hours: 15, difficulty: "Advanced", status: "Published", learners: 24 },
    { id: "2", title: "GraphQL Fundamentals", targetSkill: "API Development", hours: 10, difficulty: "Intermediate", status: "Draft", learners: 0 },
    { id: "3", title: "Legacy Code Refactoring", targetSkill: "Software Engineering", hours: 20, difficulty: "Advanced", status: "Archived", learners: 156 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Course Management</h1>
          <p className="text-slate-500">Create and manage your training courses.</p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-teal-600 hover:bg-teal-700">
              <Plus className="h-4 w-4 mr-2" />
              Create New Course
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Course</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Course Title</label>
                <Input placeholder="e.g. Advanced System Design" />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea placeholder="Course description..." rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Target Skill</label>
                  <Input placeholder="e.g. Architecture" />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Estimated Hours</label>
                  <Input type="number" placeholder="10" />
                </div>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Difficulty Level</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline">Cancel</Button>
              <Button className="bg-teal-600 hover:bg-teal-700">Create Course</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <Card key={course.id} className="flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start">
                <Badge variant={course.status === "Published" ? "default" : course.status === "Draft" ? "secondary" : "outline"}>
                  {course.status}
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="-mr-2">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit Details</DropdownMenuItem>
                    <DropdownMenuItem>Manage Modules</DropdownMenuItem>
                    {course.status === "Published" ? (
                      <DropdownMenuItem>Unpublish</DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem>Publish</DropdownMenuItem>
                    )}
                    <DropdownMenuItem className="text-red-600">Archive</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <CardTitle className="mt-2 line-clamp-1">{course.title}</CardTitle>
              <CardDescription>{course.targetSkill}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-500">Duration</p>
                  <p className="font-medium">{course.hours} hours</p>
                </div>
                <div>
                  <p className="text-slate-500">Difficulty</p>
                  <p className="font-medium">{course.difficulty}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 bg-slate-50/50">
              <div className="flex justify-between items-center w-full text-sm">
                <span className="text-slate-500">{course.learners} Active Learners</span>
                <Button variant="ghost" size="sm" className="h-8">Manage</Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
