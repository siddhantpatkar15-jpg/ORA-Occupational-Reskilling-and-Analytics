"use client";

import { useState } from "react";
import { Plus, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function AdminOccupationsPage() {
  const occupations = [
    { id: "1", title: "Senior Frontend Engineer", family: "Engineering", competencies: 12, level: "Senior" },
    { id: "2", title: "Data Scientist II", family: "Data", competencies: 8, level: "Mid" },
    { id: "3", title: "Product Manager", family: "Product", competencies: 15, level: "Mid" },
    { id: "4", title: "DevOps Architect", family: "Engineering", competencies: 14, level: "Principal" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Occupations Taxonomy</h1>
          <p className="text-slate-500">Define job roles, job families, and their required competencies.</p>
        </div>
        <Button className="bg-teal-600 hover:bg-teal-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Occupation
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
          <div className="flex gap-4 items-center">
            <Input placeholder="Search occupations..." className="w-[300px]" />
          </div>
        </CardHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Occupation Title</TableHead>
              <TableHead>Job Family</TableHead>
              <TableHead>Level</TableHead>
              <TableHead className="text-right">Req. Competencies</TableHead>
              <TableHead className="w-[150px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {occupations.map((job) => (
              <TableRow key={job.id}>
                <TableCell className="font-medium">{job.title}</TableCell>
                <TableCell>{job.family}</TableCell>
                <TableCell>
                  <Badge variant="outline">{job.level}</Badge>
                </TableCell>
                <TableCell className="text-right">{job.competencies}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Edit Profile
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
