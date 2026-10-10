"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Zap, 
  Target, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  Download, 
  RefreshCw, 
  BookOpen, 
  ClipboardCheck,
  TrendingUp,
  ShieldCheck,
  HelpCircle
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

interface SkillGapItem {
  skillId: string;
  skillName: string;
  category: string;
  requiredLevel: number;
  currentLevel: number;
  effectiveLevel: number;
  gapSize: number;
  importance: "critical" | "important" | "nice_to_have";
  importanceWeight: number;
  priorityScore: number;
  isRequired: boolean;
  evidenceType: string;
  evidenceQuality: "high" | "medium" | "low" | "none";
  recommendation: string;
  reasoningMethod: string;
}

interface GapReport {
  userId: string;
  occupationId: string;
  occupationTitle: string;
  analyzedAt: string;
  totalRequiredSkills: number;
  totalGaps: number;
  overallReadiness: number;
  gaps: SkillGapItem[];
  strengths: SkillGapItem[];
  summary: string;
  methodology: string;
}

interface OccupationOption {
  id: string;
  title: string;
  industry: string;
}

const PROFICIENCY_LABELS: Record<number, string> = {
  0: "Not Assessed",
  1: "Novice",
  2: "Beginner",
  3: "Intermediate",
  4: "Advanced",
  5: "Expert",
};

export default function SkillsGapPage() {
  const [occupations, setOccupations] = useState<OccupationOption[]>([]);
  const [selectedOccupationId, setSelectedOccupationId] = useState<string>("");
  const [report, setReport] = useState<GapReport | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load available occupations and user's profile
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        // Fetch occupations
        const occRes = await fetch("/api/occupations");
        const occData = await occRes.json();
        setOccupations(occData.occupations || []);

        // Fetch profile to see if user has target occupation
        const profRes = await fetch("/api/profile");
        const profData = await profRes.json();
        const targetId = profData.profile?.targetOccupationId || occData.occupations?.[0]?.id || "";
        
        setSelectedOccupationId(targetId);
        if (targetId) {
          await runGapAnalysis(targetId);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load skill data");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const runGapAnalysis = async (occId: string) => {
    try {
      setAnalyzing(true);
      setError(null);
      const res = await fetch(`/api/occupations/${occId}/gap-analysis`);
      if (!res.ok) {
        throw new Error("Failed to compute skill gap analysis");
      }
      const data = await res.json();
      setReport(data.report || null);
    } catch (err: any) {
      setError(err.message || "Error running gap analysis");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleOccupationChange = (newId: string) => {
    setSelectedOccupationId(newId);
    runGapAnalysis(newId);
  };

  const exportCSV = () => {
    if (!report) return;
    const headers = ["Skill Name", "Category", "Required Level", "Current Level", "Gap Size", "Importance", "Evidence Type", "Recommendation"];
    const rows = report.gaps.concat(report.strengths).map(item => [
      `"${item.skillName}"`,
      `"${item.category}"`,
      item.requiredLevel,
      item.currentLevel,
      item.gapSize,
      item.importance,
      item.evidenceType,
      `"${item.recommendation.replace(/"/g, '""')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ORA_Skill_Gap_Report_${report.occupationTitle.replace(/\s+/g, "_")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Spinner className="w-8 h-8 text-teal-600 mb-4" />
        <p className="text-slate-500">Loading skill gap analysis engine...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">Skill Gap Analysis</h1>
            <Badge variant="outline" className="text-teal-600 border-teal-200 bg-teal-50">
              Deterministic Engine
            </Badge>
          </div>
          <p className="text-slate-500 text-sm mt-1">
            Compare assessed competencies against occupational requirements with transparent scoring.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Target Occupation Dropdown */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-600 uppercase">Target Role:</label>
            <select
              value={selectedOccupationId}
              onChange={(e) => handleOccupationChange(e.target.value)}
              className="bg-white border border-slate-300 text-slate-800 text-sm rounded-lg px-3 py-2 font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
            >
              {occupations.map((occ) => (
                <option key={occ.id} value={occ.id}>
                  {occ.title} ({occ.industry})
                </option>
              ))}
            </select>
          </div>

          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => runGapAnalysis(selectedOccupationId)}
            disabled={analyzing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${analyzing ? "animate-spin" : ""}`} />
            Refresh
          </Button>

          {report && (
            <Button variant="outline" size="sm" onClick={exportCSV}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {report && (
        <>
          {/* Readiness Score Card */}
          <Card className="border-teal-500/20 bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-md">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-center">
                {/* Score Circular Metric */}
                <div className="flex items-center gap-4 border-b lg:border-b-0 lg:border-r border-slate-700 pb-4 lg:pb-0 lg:pr-6">
                  <div className="relative w-20 h-20 rounded-full bg-slate-800 border-4 border-teal-500 flex items-center justify-center shrink-0">
                    <span className="text-2xl font-extrabold text-white">{report.overallReadiness}%</span>
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-teal-400">Occupation Readiness</h2>
                    <p className="text-lg font-bold text-white leading-tight mt-0.5">{report.occupationTitle}</p>
                    <p className="text-xs text-slate-400 mt-1">Based on verified & assessed scores</p>
                  </div>
                </div>

                {/* Key Summary Metrics */}
                <div className="lg:col-span-2 grid grid-cols-3 gap-3 text-center">
                  <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700">
                    <p className="text-2xl font-bold text-white">{report.totalRequiredSkills}</p>
                    <p className="text-xs text-slate-400 mt-1">Total Competencies</p>
                  </div>
                  <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700">
                    <p className="text-2xl font-bold text-amber-400">{report.totalGaps}</p>
                    <p className="text-xs text-slate-400 mt-1">Identified Gaps</p>
                  </div>
                  <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700">
                    <p className="text-2xl font-bold text-emerald-400">{report.strengths.length}</p>
                    <p className="text-xs text-slate-400 mt-1">Competencies Met</p>
                  </div>
                </div>

                {/* Action CTA */}
                <div className="flex flex-col gap-2">
                  <Button asChild className="bg-teal-600 hover:bg-teal-500 text-white font-medium shadow">
                    <Link href="/roadmap" className="flex items-center justify-center gap-2">
                      View Reskilling Roadmap
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="border-slate-700 bg-slate-800/50 hover:bg-slate-700 text-slate-300">
                    <Link href="/assessments">Take Skill Assessments</Link>
                  </Button>
                </div>
              </div>

              {/* Methodology & AI Explanation */}
              <div className="mt-4 pt-4 border-t border-slate-700/80 flex items-start gap-2 text-xs text-slate-300">
                <Info className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">Transparent Gap Algorithm: </span>
                  <span>{report.methodology}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Evidence Quality Notice */}
          <div className="bg-blue-50/70 border border-blue-200/80 rounded-lg p-3 text-xs text-blue-900 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
              <span>
                <strong>Evidence Quality Hierarchy:</strong> Trainer-Verified (High) &gt; Knowledge Assessment (Medium) &gt; Self-Reported (Low). Self-reported proficiency is not treated as verified expertise.
              </span>
            </div>
            <Link href="/profile" className="text-blue-700 font-semibold hover:underline shrink-0">
              Update Evidence →
            </Link>
          </div>

          {/* Critical & Important Skill Gaps */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span>Missing Competencies ({report.gaps.length})</span>
                <span className="text-xs text-slate-500 font-normal">Prioritized by occupational importance &amp; gap size</span>
              </h2>
            </div>

            {report.gaps.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-slate-500">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                  <p className="text-base font-semibold text-slate-800">No skill gaps found!</p>
                  <p className="text-sm mt-1">You meet all competency requirements for {report.occupationTitle}.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {report.gaps.map((item) => (
                  <Card key={item.skillId} className="border border-slate-200 shadow-sm hover:border-slate-300 transition-colors">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                            {item.skillName}
                            <Badge 
                              variant={item.importance === "critical" ? "destructive" : item.importance === "important" ? "warning" : "default"}
                              className="text-[10px] uppercase font-semibold"
                            >
                              {item.importance.replace("_", " ")}
                            </Badge>
                          </CardTitle>
                          <CardDescription className="text-xs text-slate-500 capitalize mt-0.5">
                            Category: {item.category} • Priority Score: {item.priorityScore}
                          </CardDescription>
                        </div>
                        <Badge variant="outline" className="text-xs font-bold text-amber-700 bg-amber-50 border-amber-200">
                          Gap: -{item.gapSize} {item.gapSize === 1 ? "Level" : "Levels"}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-3 pt-0">
                      {/* Proficiency Progress Bars Comparison */}
                      <div className="space-y-1.5 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-600 font-medium">
                            Current: <strong>{PROFICIENCY_LABELS[item.currentLevel]} ({item.currentLevel}/5)</strong>
                          </span>
                          <span className="text-teal-700 font-semibold">
                            Target: <strong>{PROFICIENCY_LABELS[item.requiredLevel]} ({item.requiredLevel}/5)</strong>
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden flex">
                          <div 
                            className="bg-slate-400 h-full" 
                            style={{ width: `${(item.currentLevel / 5) * 100}%` }}
                            title="Current Level"
                          />
                          <div 
                            className="bg-amber-400 h-full" 
                            style={{ width: `${(item.gapSize / 5) * 100}%` }}
                            title="Gap to Reach"
                          />
                        </div>
                        <div className="flex justify-between text-[11px] text-slate-400 pt-0.5">
                          <span>Evidence: {item.evidenceType.replace("_", " ")} ({item.evidenceQuality})</span>
                          <span>Weight: {item.importanceWeight}x</span>
                        </div>
                      </div>

                      {/* Recommendation Note */}
                      <div className="text-xs text-slate-600 bg-teal-50/50 p-2.5 rounded border border-teal-100">
                        <p className="font-semibold text-teal-900 mb-0.5">Recommended Next Action:</p>
                        <p>{item.recommendation}</p>
                      </div>

                      {/* Action Links */}
                      <div className="flex items-center justify-end gap-2 pt-1 text-xs">
                        <Link 
                          href={`/courses?skill=${encodeURIComponent(item.skillName)}`}
                          className="text-teal-600 font-semibold hover:underline flex items-center gap-1"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          View Relevant Courses
                        </Link>
                        <span className="text-slate-300">•</span>
                        <Link 
                          href={`/assessments`}
                          className="text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-1"
                        >
                          <ClipboardCheck className="w-3.5 h-3.5" />
                          Assess Skill
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Current Strengths / Met Requirements */}
          {report.strengths.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Met Competencies &amp; Strengths ({report.strengths.length})</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {report.strengths.map((item) => (
                  <Card key={item.skillId} className="border-emerald-200 bg-emerald-50/30">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <h3 className="font-bold text-slate-900 text-sm">{item.skillName}</h3>
                        <Badge variant="success" className="text-[10px]">Benchmark Met</Badge>
                      </div>
                      <div className="mt-2 text-xs text-slate-600">
                        <p>Current: <strong>{PROFICIENCY_LABELS[item.currentLevel]}</strong> (Req: {PROFICIENCY_LABELS[item.requiredLevel]})</p>
                        <p className="text-[11px] text-slate-400 mt-1 capitalize">Evidence: {item.evidenceType.replace("_", " ")}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
