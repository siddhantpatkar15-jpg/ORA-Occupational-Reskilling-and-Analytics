"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Briefcase, 
  ArrowLeft, 
  CheckCircle2, 
  Target, 
  Layers, 
  Share2, 
  Zap,
  TrendingUp,
  Bookmark,
  BookOpen
} from "lucide-react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  Badge, 
  Button, 
  Spinner 
} from "@/components/ui";

const PROFICIENCY_LABELS: Record<number, string> = {
  1: "Novice",
  2: "Beginner",
  3: "Intermediate",
  4: "Advanced",
  5: "Expert",
};

export default function OccupationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const occId = params.id as string;

  const [occupation, setOccupation] = useState<any>(null);
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [settingTarget, setSettingTarget] = useState(false);
  const [targetSuccess, setTargetSuccess] = useState(false);

  useEffect(() => {
    async function loadDetail() {
      try {
        const res = await fetch(`/api/occupations/${occId}`);
        const data = await res.json();
        setOccupation(data.occupation || null);
        setSkills(data.requiredSkills || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    if (occId) loadDetail();
  }, [occId]);

  const handleSetTarget = async () => {
    try {
      setSettingTarget(true);
      await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetOccupationId: occId })
      });
      setTargetSuccess(true);
      setTimeout(() => setTargetSuccess(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setSettingTarget(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Spinner className="w-8 h-8 text-teal-600 mb-2" />
        <p className="text-slate-500 text-sm">Loading occupational requirements...</p>
      </div>
    );
  }

  if (!occupation) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-slate-200">
        <h2 className="text-lg font-bold text-slate-800">Occupation not found</h2>
        <Button asChild className="mt-4" variant="outline">
          <Link href="/occupations">Back to Explorer</Link>
        </Button>
      </div>
    );
  }

  const criticalSkills = skills.filter(s => s.importance === "critical");
  const importantSkills = skills.filter(s => s.importance === "important");
  const niceToHaveSkills = skills.filter(s => s.importance === "nice_to_have");

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb and Actions */}
      <div className="flex items-center justify-between">
        <Link href="/occupations" className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Occupations
        </Link>
        <div className="flex items-center gap-2">
          <Button 
            onClick={handleSetTarget} 
            disabled={settingTarget}
            className="bg-teal-600 hover:bg-teal-500 text-white text-xs font-medium"
          >
            <Bookmark className="w-3.5 h-3.5 mr-1.5" />
            {targetSuccess ? "Set as Target!" : "Set as Target Occupation"}
          </Button>
          <Button asChild variant="outline" className="text-xs">
            <Link href={`/skills`}>
              Run Skill-Gap Analysis
            </Link>
          </Button>
        </div>
      </div>

      {/* Occupation Hero Card */}
      <Card className="border border-slate-200 bg-white shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge variant="outline" className="text-teal-700 bg-teal-50 border-teal-200 text-xs font-semibold capitalize">
                  {occupation.seniorityLevel}
                </Badge>
                <Badge variant="outline" className="text-slate-600 border-slate-300 text-xs">
                  {occupation.industry}
                </Badge>
                <span className="text-xs text-slate-400">Taxonomy ID: {occupation.id}</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">{occupation.title}</h1>
              <p className="text-slate-600 text-sm mt-2 max-w-3xl leading-relaxed">
                {occupation.description}
              </p>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shrink-0 w-full md:w-64 space-y-2 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Illustrative Salary Range</span>
                <span className="font-bold text-slate-800 text-sm">{occupation.averageSalaryRange || "₹6,00,000 - ₹12,00,000"}</span>
              </div>
              <div className="pt-1 border-t border-slate-200">
                <span className="text-slate-400 block text-[11px]">Hiring Demand Indicator</span>
                <span className="font-bold text-teal-700 capitalize">{occupation.demandLevel || "High"}</span>
              </div>
              <div className="pt-1 border-t border-slate-200">
                <span className="text-slate-400 block text-[11px]">Required Competencies</span>
                <span className="font-bold text-slate-800">{skills.length} Tracked Skills</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Competency Framework Requirements Breakdown */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Layers className="w-5 h-5 text-teal-600" />
          Required Competencies Framework
        </h2>

        {/* Critical Skills */}
        {criticalSkills.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-red-700 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-600" />
              Critical Requirements (Must Have)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {criticalSkills.map(skill => (
                <Card key={skill.id} className="border-red-200 bg-red-50/20">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-slate-900 text-sm">{skill.name}</h4>
                      <Badge variant="destructive" className="text-[10px]">Critical</Badge>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 capitalize">Category: {skill.category}</p>
                    <div className="mt-3 pt-2 border-t border-red-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500">Benchmark:</span>
                      <span className="font-bold text-red-900">Level {skill.requiredLevel}/5 ({PROFICIENCY_LABELS[skill.requiredLevel]})</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Important Skills */}
        {importantSkills.length > 0 && (
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold text-amber-700 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-600" />
              Important Competencies
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {importantSkills.map(skill => (
                <Card key={skill.id} className="border-amber-200 bg-amber-50/20">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-slate-900 text-sm">{skill.name}</h4>
                      <Badge variant="warning" className="text-[10px]">Important</Badge>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 capitalize">Category: {skill.category}</p>
                    <div className="mt-3 pt-2 border-t border-amber-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500">Benchmark:</span>
                      <span className="font-bold text-amber-900">Level {skill.requiredLevel}/5 ({PROFICIENCY_LABELS[skill.requiredLevel]})</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Nice to Have */}
        {niceToHaveSkills.length > 0 && (
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-slate-400" />
              Preferred / Nice-to-Have
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {niceToHaveSkills.map(skill => (
                <Card key={skill.id} className="border-slate-200">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-slate-900 text-sm">{skill.name}</h4>
                      <Badge variant="outline" className="text-[10px]">Preferred</Badge>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 capitalize">Category: {skill.category}</p>
                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500">Benchmark:</span>
                      <span className="font-bold text-slate-700">Level {skill.requiredLevel}/5 ({PROFICIENCY_LABELS[skill.requiredLevel]})</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
