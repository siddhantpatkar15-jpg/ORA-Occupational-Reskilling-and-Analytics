"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  BookOpen, 
  Search, 
  Clock, 
  GraduationCap, 
  Star, 
  ArrowRight, 
  CheckCircle2, 
  PlayCircle,
  Filter
} from "lucide-react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  Badge, 
  Button, 
  ProgressBar,
  Spinner 
} from "@/components/ui";

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  estimatedHours: number;
  rating: number;
  enrollmentCount: number;
  skillId?: string;
  skillName?: string;
  isEnrolled?: boolean;
  progress?: number;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [enrollingId, setEnrollingId] = useState<string | null>(null);

  const fetchCourses = async () => {
    try {
      const res = await fetch("/api/courses");
      const data = await res.json();
      setCourses(data.courses || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleEnroll = async (courseId: string) => {
    try {
      setEnrollingId(courseId);
      const res = await fetch(`/api/courses/${courseId}/enroll`, {
        method: "POST"
      });
      if (res.ok) {
        await fetchCourses();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setEnrollingId(null);
    }
  };

  const filteredCourses = courses.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) || 
                          (c.description && c.description.toLowerCase().includes(search.toLowerCase()));
    const matchesLevel = selectedLevel === "all" || c.level === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Training &amp; Courses</h1>
          <p className="text-slate-500 text-sm mt-1">
            Build verified competencies through structured modules, practical projects, and assessments.
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative sm:col-span-2">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search courses by keyword or skill..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div>
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="w-full py-2 px-3 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">All Difficulty Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px]">
          <Spinner className="w-8 h-8 text-teal-600 mb-2" />
          <p className="text-slate-500 text-sm">Loading training catalog...</p>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h2 className="text-base font-semibold text-slate-800">No courses found</h2>
          <p className="text-xs text-slate-400 mt-1">Try searching for other skills or resetting the filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCourses.map(course => {
            const isEnrolled = course.isEnrolled || false;
            const progress = course.progress || 0;

            return (
              <Card key={course.id} className="border border-slate-200 hover:shadow-md transition-shadow flex flex-col justify-between">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <Badge variant="outline" className="text-teal-700 bg-teal-50 border-teal-200 text-[10px] font-semibold capitalize">
                      {course.level || "Beginner"}
                    </Badge>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {course.estimatedHours || 20} hrs
                    </span>
                  </div>

                  <CardTitle className="text-base font-bold text-slate-900 mt-2 line-clamp-1">
                    {course.title}
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500 line-clamp-2 mt-1">
                    {course.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-0 space-y-3">
                  {/* Rating & Enrollment Info */}
                  <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <strong>{course.rating || 4.8}</strong> ({course.enrollmentCount || 24} learners)
                    </span>
                    <span className="capitalize">{course.category || "Technology"}</span>
                  </div>

                  {/* Enrollment / Progress section */}
                  {isEnrolled ? (
                    <div className="space-y-1.5 pt-1">
                      <div className="flex justify-between text-[11px] font-semibold">
                        <span className="text-slate-600">Course Progress</span>
                        <span className="text-teal-700">{progress}%</span>
                      </div>
                      <ProgressBar value={progress} color="teal" />
                      <Button asChild className="w-full mt-2 bg-teal-600 hover:bg-teal-500 text-white text-xs">
                        <Link href={`/courses/${course.id}`} className="flex items-center justify-center gap-1.5">
                          <PlayCircle className="w-3.5 h-3.5" />
                          Continue Course
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="pt-1">
                      <Button 
                        onClick={() => handleEnroll(course.id)}
                        disabled={enrollingId === course.id}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs"
                      >
                        {enrollingId === course.id ? (
                          <Spinner className="w-3.5 h-3.5 mr-1" />
                        ) : (
                          "Enroll in Course"
                        )}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
