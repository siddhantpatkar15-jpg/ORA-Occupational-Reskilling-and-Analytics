"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Briefcase, 
  Search, 
  Filter, 
  ArrowRight, 
  TrendingUp, 
  Award, 
  Layers, 
  Target,
  Sparkles,
  Info
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

interface Occupation {
  id: string;
  title: string;
  description: string;
  industry: string;
  seniorityLevel: string;
  averageSalaryRange: string;
  demandLevel: string;
  dataSource: string;
}

export default function OccupationsPage() {
  const [occupations, setOccupations] = useState<Occupation[]>([]);
  const [search, setSearch] = useState("");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [seniorityFilter, setSeniorityFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOccupations() {
      try {
        const res = await fetch("/api/occupations");
        const data = await res.json();
        setOccupations(data.occupations || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadOccupations();
  }, []);

  const industries = Array.from(new Set(occupations.map(o => o.industry).filter(Boolean)));
  const seniorities = Array.from(new Set(occupations.map(o => o.seniorityLevel).filter(Boolean)));

  const filtered = occupations.filter(occ => {
    const matchesSearch = occ.title.toLowerCase().includes(search.toLowerCase()) || 
                          (occ.description && occ.description.toLowerCase().includes(search.toLowerCase()));
    const matchesIndustry = industryFilter === "all" || occ.industry === industryFilter;
    const matchesSeniority = seniorityFilter === "all" || occ.seniorityLevel === seniorityFilter;
    return matchesSearch && matchesIndustry && matchesSeniority;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Career &amp; Occupation Explorer</h1>
          <p className="text-slate-500 text-sm mt-1">
            Discover roles, examine required competencies, and identify transferable skills.
          </p>
        </div>
        <Badge variant="outline" className="bg-slate-100 text-slate-600 border-slate-300 w-fit">
          <Info className="w-3.5 h-3.5 mr-1" />
          Labor market metrics are illustrative sample data
        </Badge>
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search occupations by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div>
          <select
            value={industryFilter}
            onChange={(e) => setIndustryFilter(e.target.value)}
            className="w-full py-2 px-3 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">All Industries</option>
            {industries.map(ind => <option key={ind} value={ind}>{ind}</option>)}
          </select>
        </div>

        <div>
          <select
            value={seniorityFilter}
            onChange={(e) => setSeniorityFilter(e.target.value)}
            className="w-full py-2 px-3 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">All Seniority Levels</option>
            {seniorities.map(sen => <option key={sen} value={sen} className="capitalize">{sen}</option>)}
          </select>
        </div>
      </div>

      {/* Occupations Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px]">
          <Spinner className="w-8 h-8 text-teal-600 mb-2" />
          <p className="text-slate-500 text-sm">Loading occupations catalog...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h2 className="text-base font-semibold text-slate-800">No occupations matched your search</h2>
          <p className="text-xs text-slate-400 mt-1">Try resetting the filters or searching with different keywords.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(occ => (
            <Card key={occ.id} className="border border-slate-200 hover:shadow-md transition-shadow flex flex-col justify-between">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <Badge variant="outline" className="text-teal-700 bg-teal-50 border-teal-200 text-[11px] font-semibold capitalize">
                    {occ.seniorityLevel}
                  </Badge>
                  <span className="text-[11px] font-medium text-slate-500">{occ.industry}</span>
                </div>
                <CardTitle className="text-lg font-bold text-slate-900 mt-2">
                  {occ.title}
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 line-clamp-2 mt-1">
                  {occ.description || "Standard occupational profile including required competencies and learning paths."}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-0 space-y-3">
                {/* Demand & Salary tags */}
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Market Demand (Sample)</span>
                    <span className="font-semibold text-teal-800 capitalize">{occ.demandLevel || "High"}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 block text-[10px]">Est. Salary Band</span>
                    <span className="font-semibold text-slate-700">{occ.averageSalaryRange || "Competitive"}</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <Button asChild className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs">
                    <Link href={`/occupations/${occ.id}`} className="flex items-center justify-center gap-1.5">
                      Explore Competencies
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
