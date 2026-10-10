"use client";

import { useState } from "react";
import { Download, AlertTriangle, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  AreaChart, Area
} from "recharts";

export default function AdminAnalyticsPage() {
  const readinessData = [
    { name: "Frontend Engineer", current: 3.2, target: 4.0 },
    { name: "Backend Engineer", current: 3.8, target: 4.0 },
    { name: "Data Scientist", current: 2.9, target: 4.5 },
    { name: "Product Manager", current: 4.1, target: 4.0 },
  ];

  const coverageData = [
    { subject: 'Technical', Engineering: 80, Data: 90, Product: 40, HR: 20 },
    { subject: 'Analytical', Engineering: 70, Data: 95, Product: 80, HR: 50 },
    { subject: 'Communication', Engineering: 60, Data: 50, Product: 95, HR: 90 },
    { subject: 'Leadership', Engineering: 50, Data: 40, Product: 85, HR: 80 },
    { subject: 'Problem Solving', Engineering: 90, Data: 85, Product: 75, HR: 60 },
  ];

  const gapData = [
    { skill: "Cloud Architecture", gap: 35 },
    { skill: "Machine Learning", gap: 28 },
    { skill: "Agile Leadership", gap: 22 },
    { skill: "Data Governance", gap: 18 },
    { skill: "System Design", gap: 15 },
  ];

  const participationData = [
    { month: "Jan", completions: 45 },
    { month: "Feb", completions: 52 },
    { month: "Mar", completions: 78 },
    { month: "Apr", completions: 65 },
    { month: "May", completions: 90 },
    { month: "Jun", completions: 110 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Enterprise Workforce Analytics</h1>
          <p className="text-slate-500">Monitor skill gaps, workforce readiness, and training effectiveness.</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Workforce Analytics (CSV)
        </Button>
      </div>

      <Alert className="bg-amber-50 border-amber-200">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertTitle className="text-amber-800">Competencies with Insufficient Evidence</AlertTitle>
        <AlertDescription className="text-amber-700">
          "Cloud Architecture" and "Machine Learning" currently have high target requirements but very low assessed evidence across the organization.
        </AlertDescription>
      </Alert>

      <div className="flex gap-4 p-4 bg-slate-50 rounded-lg border items-center">
        <Filter className="h-4 w-4 text-slate-500" />
        <span className="text-sm font-medium mr-2">Filters:</span>
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px] bg-white">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            <SelectItem value="engineering">Engineering</SelectItem>
            <SelectItem value="data">Data Science</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="6m">
          <SelectTrigger className="w-[150px] bg-white">
            <SelectValue placeholder="Date Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3m">Last 3 Months</SelectItem>
            <SelectItem value="6m">Last 6 Months</SelectItem>
            <SelectItem value="1y">Last Year</SelectItem>
          </SelectContent>
        </Select>
        <div className="ml-auto text-xs text-slate-400">
          Data freshness: Just now | <span className="italic">Sample Data Disclaimer</span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Workforce Readiness by Role</CardTitle>
            <CardDescription>Current vs Target average competency levels</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={readinessData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{fontSize: 12}} />
                <YAxis domain={[0, 5]} tick={{fontSize: 12}} />
                <RechartsTooltip />
                <Legend />
                <Bar dataKey="current" name="Current Level" fill="#0d9488" radius={[4, 4, 0, 0]} />
                <Bar dataKey="target" name="Target Level" fill="#94a3b8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Competency Coverage by Department</CardTitle>
            <CardDescription>Relative skill strengths across organizational units</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={coverageData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" tick={{fontSize: 12}} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar name="Engineering" dataKey="Engineering" stroke="#0d9488" fill="#0d9488" fillOpacity={0.3} />
                <Radar name="Product" dataKey="Product" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
                <Legend />
                <RechartsTooltip />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Organizational Skill Gaps</CardTitle>
            <CardDescription>Skills with largest discrepancy between target and current levels</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gapData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" />
                <YAxis dataKey="skill" type="category" width={120} tick={{fontSize: 12}} />
                <RechartsTooltip />
                <Bar dataKey="gap" name="Gap Size" fill="#f43f5e" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Training Participation Trends</CardTitle>
            <CardDescription>Monthly course and assessment completions</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={participationData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <RechartsTooltip />
                <Area type="monotone" dataKey="completions" stroke="#0d9488" fill="#ccfbf1" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
