"use client";

import { Activity, Search, Download } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function AdminAuditPage() {
  const auditLogs = [
    { id: "1", timestamp: "2023-10-25 14:32:01", user: "admin@company.com", action: "USER_IMPORT", ip: "192.168.1.100", details: "Imported 45 new users via CSV" },
    { id: "2", timestamp: "2023-10-25 11:15:22", user: "trainer@company.com", action: "ASSESSMENT_PUBLISH", ip: "10.0.0.55", details: "Published assessment 'React Fundamentals'" },
    { id: "3", timestamp: "2023-10-24 16:45:10", user: "admin@company.com", action: "ROLE_CHANGE", ip: "192.168.1.100", details: "Changed user david@company.com from LEARNER to TRAINER" },
    { id: "4", timestamp: "2023-10-24 09:12:33", user: "admin@company.com", action: "TAXONOMY_UPDATE", ip: "192.168.1.100", details: "Added new skill 'GraphQL' to Technical category" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Audit Logs</h1>
          <p className="text-slate-500">System activity and security audit trail.</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Logs
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
            <Input placeholder="Search logs..." className="pl-9" />
          </div>
        </CardHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {auditLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="text-sm font-medium text-slate-600 whitespace-nowrap">{log.timestamp}</TableCell>
                <TableCell>{log.user}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-mono text-xs">
                    {log.action}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-slate-500">{log.ip}</TableCell>
                <TableCell className="text-sm max-w-md truncate" title={log.details}>
                  {log.details}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
