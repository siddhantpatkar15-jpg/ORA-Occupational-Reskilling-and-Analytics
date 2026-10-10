"use client";

import { useState } from "react";
import { Upload, Download, Users, UserPlus, MoreHorizontal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function AdminUsersPage() {
  const [importOpen, setImportOpen] = useState(false);
  const [csvPreview, setCsvPreview] = useState<any[]>([]);
  const [fileName, setFileName] = useState("");

  const users = [
    { id: "1", name: "Alice Smith", email: "alice@company.com", role: "Admin", department: "IT", status: "Active" },
    { id: "2", name: "Bob Jones", email: "bob@company.com", role: "Trainer", department: "HR", status: "Active" },
    { id: "3", name: "Charlie Brown", email: "charlie@company.com", role: "Learner", department: "Engineering", status: "Active" },
    { id: "4", name: "Diana Prince", email: "diana@company.com", role: "Learner", department: "Marketing", status: "Inactive" },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      // Simulate client-side CSV parsing/validation
      setTimeout(() => {
        setCsvPreview([
          { name: "Eve Davis", email: "eve@company.com", role: "Learner", department: "Sales", valid: true },
          { name: "Frank White", email: "invalid-email", role: "Learner", department: "Engineering", valid: false, error: "Invalid Email" },
          { name: "Grace Lee", email: "grace@company.com", role: "UnknownRole", department: "Design", valid: false, error: "Invalid Role" },
        ]);
      }, 500);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">User Management</h1>
          <p className="text-slate-500">Manage all users, roles, and bulk imports.</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={importOpen} onOpenChange={setImportOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Import Employees (CSV)
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px]">
              <DialogHeader>
                <DialogTitle>Bulk Employee Import</DialogTitle>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div className="flex justify-between items-center bg-slate-50 p-4 rounded-lg border">
                  <div>
                    <h4 className="font-medium">1. Download Template</h4>
                    <p className="text-sm text-slate-500">Use our standard CSV format</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Template
                  </Button>
                </div>
                
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <Input type="file" accept=".csv" className="hidden" id="csv-upload" onChange={handleFileUpload} />
                  <label htmlFor="csv-upload" className="cursor-pointer flex flex-col items-center">
                    <Upload className="h-8 w-8 text-slate-400 mb-2" />
                    <span className="font-medium">Click to upload CSV</span>
                    <span className="text-sm text-slate-500 mt-1">{fileName || "name,email,role,department"}</span>
                  </label>
                </div>

                {csvPreview.length > 0 && (
                  <div className="space-y-2 mt-4">
                    <h4 className="font-medium">Data Preview</h4>
                    <div className="border rounded-md overflow-hidden">
                      <Table>
                        <TableHeader className="bg-slate-50">
                          <TableRow>
                            <TableHead>Status</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Dept</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {csvPreview.map((row, i) => (
                            <TableRow key={i}>
                              <TableCell>
                                {row.valid ? (
                                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-none">Valid</Badge>
                                ) : (
                                  <Badge variant="destructive" title={row.error}>Invalid</Badge>
                                )}
                              </TableCell>
                              <TableCell>{row.name}</TableCell>
                              <TableCell className={row.error === "Invalid Email" ? "text-red-500" : ""}>{row.email}</TableCell>
                              <TableCell className={row.error === "Invalid Role" ? "text-red-500" : ""}>{row.role}</TableCell>
                              <TableCell>{row.department}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setImportOpen(false)}>Cancel</Button>
                <Button disabled={!csvPreview.length || !csvPreview.some(r => r.valid)}>Confirm Import Users</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button className="bg-teal-600 hover:bg-teal-700">
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="p-0 border-b">
          <div className="flex items-center justify-between p-4">
            <div className="relative w-64">
              <Input placeholder="Search users..." />
            </div>
            <div className="text-sm text-slate-500">Total Users: 1,204</div>
          </div>
        </CardHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={
                    user.role === "Admin" ? "bg-purple-50 text-purple-700 border-purple-200" :
                    user.role === "Trainer" ? "bg-teal-50 text-teal-700 border-teal-200" :
                    "bg-slate-50 text-slate-700 border-slate-200"
                  }>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>{user.department}</TableCell>
                <TableCell>
                  <Badge variant={user.status === "Active" ? "default" : "secondary"}>
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Edit Details</DropdownMenuItem>
                      <DropdownMenuItem>Change Role</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        {user.status === "Active" ? "Deactivate User" : "Activate User"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
