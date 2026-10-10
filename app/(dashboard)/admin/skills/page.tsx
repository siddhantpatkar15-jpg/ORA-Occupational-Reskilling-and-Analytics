"use client";

import { Plus, Archive } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AdminSkillsPage() {
  const skills = [
    { id: "1", name: "React JS", category: "Technical", scale: "Standard 1-5", status: "Active" },
    { id: "2", name: "Machine Learning", category: "Technical", scale: "Standard 1-5", status: "Active" },
    { id: "3", name: "Agile Methodology", category: "Operational", scale: "Standard 1-5", status: "Active" },
    { id: "4", name: "Legacy System Fortran", category: "Technical", scale: "Standard 1-5", status: "Archived" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Skills Taxonomy</h1>
          <p className="text-slate-500">Manage the organization's library of skills and competencies.</p>
        </div>
        <Button className="bg-teal-600 hover:bg-teal-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Skill
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between pb-4 border-b">
          <Input placeholder="Search skills..." className="w-full sm:w-[300px]" />
          <Select defaultValue="all">
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="technical">Technical</SelectItem>
              <SelectItem value="digital">Digital</SelectItem>
              <SelectItem value="analytical">Analytical</SelectItem>
              <SelectItem value="communication">Communication</SelectItem>
              <SelectItem value="leadership">Leadership</SelectItem>
              <SelectItem value="operational">Operational</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Skill Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Proficiency Scale</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {skills.map((skill) => (
              <TableRow key={skill.id}>
                <TableCell className="font-medium">{skill.name}</TableCell>
                <TableCell>{skill.category}</TableCell>
                <TableCell>{skill.scale}</TableCell>
                <TableCell>
                  <Badge variant={skill.status === "Active" ? "default" : "secondary"}>
                    {skill.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="text-slate-500 hover:text-red-600">
                    <Archive className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
