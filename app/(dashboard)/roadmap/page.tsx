"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Map, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  ClipboardCheck, 
  Lock, 
  RefreshCw,
  AlertCircle,
  HelpCircle,
  Sparkles,
  ChevronRight
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

interface RoadmapStep {
  id: string;
  stepOrder: number;
  title: string;
  description: string;
  reason: string;
  estimatedDuration: string;
  status: "locked" | "available" | "in_progress" | "completed" | "skipped";
  skillId: string;
  courseId?: string;
  assessmentId?: string;
}

interface Roadmap {
  id: string;
  title: string;
  description: string;
  totalSteps: number;
  completedSteps: number;
  status: string;
  steps: RoadmapStep[];
}

export default function LearningRoadmapPage() {
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStep, setUpdatingStep] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  const fetchRoadmap = async () => {
    try {
      const res = await fetch("/api/roadmap");
      const data = await res.json();
      if (data.roadmaps && data.roadmaps.length > 0) {
        setRoadmap(data.roadmaps[0]);
      } else {
        setRoadmap(null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmap();
  }, []);

  const handleGenerateRoadmap = async () => {
    try {
      setGenerating(true);
      // Fetch profile to get target occupation
      const profRes = await fetch("/api/profile");
      const profData = await profRes.json();
      const occId = profData.profile?.targetOccupationId || "occ-1"; // fallback to Data Analyst

      const res = await fetch("/api/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ occupationId: occId })
      });
      if (res.ok) {
        await fetchRoadmap();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setGenerating(false);
    }
  };

  const handleToggleStep = async (stepId: string, currentStatus: string) => {
    if (!roadmap) return;
    try {
      setUpdatingStep(stepId);
      const newStatus = currentStatus === "completed" ? "in_progress" : "completed";
      const res = await fetch(`/api/roadmap/${roadmap.id}/steps/${stepId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        await fetchRoadmap();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingStep(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Spinner className="w-8 h-8 text-teal-600 mb-2" />
        <p className="text-slate-500 text-sm">Loading your personalized reskilling roadmap...</p>
      </div>
    );
  }

  const completionPct = roadmap && roadmap.totalSteps > 0
    ? Math.round((roadmap.completedSteps / roadmap.totalSteps) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">Personalized Reskilling Roadmap</h1>
            <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200">
              Adaptive Sequence
            </Badge>
          </div>
          <p className="text-slate-500 text-sm mt-1">
            Prioritized learning roadmap respecting prerequisite relationships and targeted competency gaps.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            onClick={handleGenerateRoadmap} 
            disabled={generating}
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${generating ? "animate-spin" : ""}`} />
            Regenerate Roadmap
          </Button>
        </div>
      </div>

      {!roadmap ? (
        <Card className="text-center p-8 bg-white border border-slate-200">
          <Map className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-slate-800">No active roadmap found</h2>
          <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
            Generate an adaptive learning roadmap tailored to your target occupation and assessed skill gaps.
          </p>
          <Button 
            onClick={handleGenerateRoadmap}
            disabled={generating}
            className="mt-4 bg-teal-600 hover:bg-teal-500 text-white"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Generate My Roadmap Now
          </Button>
        </Card>
      ) : (
        <>
          {/* Progress Overview Card */}
          <Card className="border border-slate-200 bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-700">Active Learning Goal</span>
                  <h2 className="text-xl font-bold text-slate-900">{roadmap.title}</h2>
                  <p className="text-xs text-slate-500">{roadmap.description}</p>
                </div>
                
                <div className="w-full md:w-72 space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-600">Roadmap Progress</span>
                    <span className="text-teal-700">{completionPct}% ({roadmap.completedSteps}/{roadmap.totalSteps} Steps)</span>
                  </div>
                  <ProgressBar value={completionPct} color="teal" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sequential Step By Step Flow */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Sequential Learning Steps</h2>
              <span className="text-xs text-slate-400">Step order optimized by gap severity &amp; prerequisites</span>
            </div>

            <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2.5 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-200">
              {roadmap.steps.map((step, idx) => {
                const isCompleted = step.status === "completed";
                const isInProgress = step.status === "in_progress";
                const isLocked = step.status === "locked";

                return (
                  <div key={step.id || idx} className="relative group">
                    {/* Circle Indicator on the timeline */}
                    <div className={`absolute -left-6 top-5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      isCompleted 
                        ? "bg-emerald-500 border-emerald-500 text-white" 
                        : isInProgress 
                        ? "bg-teal-600 border-teal-600 text-white animate-pulse" 
                        : isLocked
                        ? "bg-slate-200 border-slate-300 text-slate-500"
                        : "bg-white border-slate-300 text-slate-500"
                    }`}>
                      {isCompleted ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : isLocked ? (
                        <Lock className="w-2.5 h-2.5" />
                      ) : (
                        <span className="text-[10px] font-bold">{step.stepOrder || idx + 1}</span>
                      )}
                    </div>

                    <Card className={`border transition-all ${
                      isCompleted 
                        ? "border-emerald-200 bg-emerald-50/20" 
                        : isInProgress 
                        ? "border-teal-300 shadow-sm bg-white" 
                        : "border-slate-200 bg-white"
                    }`}>
                      <CardContent className="p-5">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                          <div className="space-y-1.5 flex-1">
                            <div className="flex items-center gap-2">
                              <Badge 
                                variant={isCompleted ? "success" : isInProgress ? "default" : "outline"}
                                className="text-[10px] font-bold uppercase tracking-wider"
                              >
                                {isCompleted ? "Completed" : isInProgress ? "In Progress" : isLocked ? "Locked" : "Next Milestone"}
                              </Badge>
                              <span className="text-xs text-slate-400 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {step.estimatedDuration || "15-20 hours"}
                              </span>
                            </div>

                            <h3 className="text-base font-bold text-slate-900">{step.title}</h3>
                            <p className="text-xs text-slate-600 leading-relaxed">{step.description}</p>
                            
                            {/* Rationale explanation */}
                            {step.reason && (
                              <div className="mt-2 text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                                <strong className="text-slate-700">Why this matters: </strong>
                                {step.reason}
                              </div>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                            {step.courseId && (
                              <Button asChild size="sm" variant="outline" className="text-xs">
                                <Link href={`/courses/${step.courseId}`} className="flex items-center gap-1">
                                  <BookOpen className="w-3.5 h-3.5 text-teal-600" />
                                  Course Material
                                </Link>
                              </Button>
                            )}

                            {step.assessmentId && (
                              <Button asChild size="sm" variant="outline" className="text-xs">
                                <Link href={`/assessments/${step.assessmentId}`} className="flex items-center gap-1">
                                  <ClipboardCheck className="w-3.5 h-3.5 text-blue-600" />
                                  Assessment
                                </Link>
                              </Button>
                            )}

                            <Button
                              size="sm"
                              variant={isCompleted ? "secondary" : "primary"}
                              disabled={updatingStep === step.id}
                              onClick={() => handleToggleStep(step.id, step.status)}
                              className="text-xs"
                            >
                              {updatingStep === step.id ? (
                                <Spinner className="w-3.5 h-3.5" />
                              ) : isCompleted ? (
                                "Mark Incomplete"
                              ) : (
                                "Mark Completed"
                              )}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Ethical Disclaimer */}
          <div className="p-4 bg-slate-100 text-slate-600 text-xs rounded-lg border border-slate-200 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <span>
              <strong>Ethical Notice:</strong> Completing roadmap steps and courses builds occupational competencies and verified credentials. However, ORA does not guarantee employment, promotion, or placement.
            </span>
          </div>
        </>
      )}
    </div>
  );
}
