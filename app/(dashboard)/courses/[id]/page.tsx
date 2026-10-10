"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { 
  BookOpen, 
  ArrowLeft, 
  CheckCircle2, 
  Circle, 
  Play, 
  FileText, 
  Download, 
  Clock, 
  Award, 
  ClipboardCheck,
  ChevronRight,
  ExternalLink
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

interface CourseModule {
  id: string;
  title: string;
  description: string;
  contentType: string;
  content: string;
  durationMinutes: number;
  orderIndex: number;
}

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params.id as string;

  const [course, setCourse] = useState<any>(null);
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [completedModuleIds, setCompletedModuleIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    async function loadCourse() {
      try {
        const res = await fetch(`/api/courses/${courseId}`);
        const data = await res.json();
        setCourse(data.course || null);
        const mods = data.modules || [];
        setModules(mods);

        // Fetch user progress
        if (data.enrollment) {
          // If 60% complete, assume first 60% of modules are done
          const countDone = Math.round((data.enrollment.progress / 100) * mods.length);
          const doneSet = new Set<string>(mods.slice(0, countDone).map((m: any) => m.id));
          setCompletedModuleIds(doneSet);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    if (courseId) loadCourse();
  }, [courseId]);

  const handleMarkModuleComplete = async () => {
    if (!modules[activeModuleIndex]) return;
    try {
      setUpdating(true);
      const modId = modules[activeModuleIndex].id;
      const nextDone = new Set(completedModuleIds);
      nextDone.add(modId);
      setCompletedModuleIds(nextDone);

      const newProgress = Math.round((nextDone.size / Math.max(modules.length, 1)) * 100);
      await fetch(`/api/courses/${courseId}/progress`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ progress: newProgress, moduleId: modId })
      });

      // Advance to next module if available
      if (activeModuleIndex < modules.length - 1) {
        setActiveModuleIndex(activeModuleIndex + 1);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Spinner className="w-8 h-8 text-teal-600 mb-2" />
        <p className="text-slate-500 text-sm">Loading course environment...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-slate-200">
        <h2 className="text-lg font-bold text-slate-800">Course not found</h2>
        <Button asChild className="mt-4" variant="outline">
          <Link href="/courses">Back to Catalog</Link>
        </Button>
      </div>
    );
  }

  const activeModule = modules[activeModuleIndex] || {
    id: "m0",
    title: "Introduction",
    contentType: "text",
    content: "Welcome to this course curriculum. Review the structured modules on the left to begin your reskilling path.",
    durationMinutes: 15
  };

  const progressPct = modules.length > 0
    ? Math.round((completedModuleIds.size / modules.length) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb and Course Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link href="/courses" className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Course Catalog
          </Link>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">{course.title}</h1>
            <Badge variant="outline" className="text-teal-700 bg-teal-50 border-teal-200 text-xs font-semibold capitalize">
              {course.level || "Beginner"}
            </Badge>
          </div>
        </div>

        <div className="w-full md:w-64 space-y-1.5 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-600">Curriculum Progress</span>
            <span className="text-teal-700">{progressPct}%</span>
          </div>
          <ProgressBar value={progressPct} color="teal" />
        </div>
      </div>

      {/* Main Learning Classroom Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Module Content Player (2 columns) */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="bg-slate-900 p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-teal-400 font-bold uppercase tracking-wider">
                  Module {activeModuleIndex + 1} of {modules.length}
                </span>
                <span className="text-slate-400 text-xs">•</span>
                <span className="text-xs text-slate-300 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {activeModule.durationMinutes || 20} mins
                </span>
              </div>
              {completedModuleIds.has(activeModule.id) && (
                <Badge variant="success" className="text-[10px]">Completed</Badge>
              )}
            </div>

            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-bold text-slate-900">{activeModule.title}</h2>
              
              {/* Media Player Placeholder */}
              <div className="aspect-video w-full bg-slate-900 rounded-xl flex flex-col items-center justify-center text-white p-6 relative overflow-hidden group">
                <div className="w-16 h-16 rounded-full bg-teal-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform cursor-pointer">
                  <Play className="w-7 h-7 fill-white translate-x-0.5" />
                </div>
                <p className="text-xs text-slate-300 mt-3 font-medium">
                  Instructional Lesson &amp; Guided Walkthrough ({activeModule.durationMinutes || 20}m)
                </p>
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Standard Quality • English / हिन्दी Captions</span>
                  <span>1080p HD</span>
                </div>
              </div>

              {/* Lesson Text Reading Material */}
              <div className="prose prose-slate text-sm text-slate-700 leading-relaxed border-t border-slate-100 pt-4">
                <p>{activeModule.description || activeModule.content}</p>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mt-4">
                  <h3 className="font-bold text-xs uppercase text-slate-700 mb-2">Key Competency Takeaways:</h3>
                  <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600">
                    <li>Core terminology, standards, and practical implementation patterns.</li>
                    <li>Hands-on coding / analysis exercises matching real occupational requirements.</li>
                    <li>Preparation for the verified skill assessment.</li>
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <Button 
                  variant="outline"
                  size="sm"
                  disabled={activeModuleIndex === 0}
                  onClick={() => setActiveModuleIndex(activeModuleIndex - 1)}
                  className="text-xs"
                >
                  Previous Lesson
                </Button>

                <Button 
                  onClick={handleMarkModuleComplete}
                  disabled={updating}
                  className="bg-teal-600 hover:bg-teal-500 text-white text-xs font-medium"
                >
                  {updating ? (
                    <Spinner className="w-3.5 h-3.5 mr-1" />
                  ) : completedModuleIds.has(activeModule.id) ? (
                    "Marked Complete (Next)"
                  ) : (
                    "Complete & Next"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Assessment Link after completion */}
          {progressPct >= 50 && (
            <div className="bg-gradient-to-r from-teal-900 to-slate-900 text-white p-5 rounded-xl flex items-center justify-between gap-4 shadow-sm">
              <div className="space-y-1">
                <Badge variant="outline" className="text-teal-400 border-teal-500/30 text-[10px] uppercase">
                  Skill Assessment Ready
                </Badge>
                <h3 className="font-bold text-base">Verify Your Newly Acquired Competency</h3>
                <p className="text-xs text-slate-300">
                  Take the standardized assessment to turn your learning progress into a verified competency level!
                </p>
              </div>
              <Button asChild className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold shrink-0 text-xs">
                <Link href="/assessments">Take Assessment →</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Modules Sidebar (1 column) */}
        <div className="space-y-4">
          <Card className="border border-slate-200 bg-white shadow-sm">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-900 flex items-center justify-between">
                <span>Course Modules ({modules.length})</span>
                <span className="text-xs text-teal-600 font-normal">{completedModuleIds.size} completed</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-slate-100">
              {modules.map((m, idx) => {
                const isActive = idx === activeModuleIndex;
                const isDone = completedModuleIds.has(m.id);

                return (
                  <button
                    key={m.id}
                    onClick={() => setActiveModuleIndex(idx)}
                    className={`w-full text-left p-3.5 flex items-start gap-3 transition-colors ${
                      isActive 
                        ? "bg-teal-50/70 border-l-4 border-teal-600 font-semibold" 
                        : "hover:bg-slate-50 border-l-4 border-transparent"
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-300" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs ${isActive ? "text-teal-950 font-bold" : "text-slate-800"}`}>
                        {idx + 1}. {m.title}
                      </p>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Clock className="w-2.5 h-2.5" />
                        {m.durationMinutes || 15} mins • {m.contentType || "Video"}
                      </span>
                    </div>
                  </button>
                );
              })}
            </CardContent>
          </Card>

          {/* Resources & PDF Box */}
          <Card className="border border-slate-200 bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Downloadable Materials
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-teal-600" />
                  <span className="font-medium text-slate-700">Course Syllabus &amp; Notes</span>
                </div>
                <button 
                  onClick={() => alert("Downloading ORA Course Notes (PDF)...")}
                  className="text-teal-600 hover:text-teal-800 p-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
