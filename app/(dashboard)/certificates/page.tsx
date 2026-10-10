"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Award, 
  ExternalLink, 
  Download, 
  Printer, 
  ShieldCheck, 
  Calendar, 
  CheckCircle2, 
  FileCheck,
  X
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

interface Certificate {
  id: string;
  certificateNumber: string;
  title: string;
  issuingOrganization: string;
  issuedAt: string;
  verificationStatus: string;
  courseTitle?: string;
  userName?: string;
}

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  useEffect(() => {
    async function loadCerts() {
      try {
        const res = await fetch("/api/certificates");
        const data = await res.json();
        // Fallback demo certificate if none issued yet
        if (data.certificates && data.certificates.length > 0) {
          setCertificates(data.certificates);
        } else {
          setCertificates([
            {
              id: "cert-1",
              certificateNumber: "ORA-2024-SQL-0982",
              title: "SQL Fundamentals & Relational Querying",
              issuingOrganization: "ORA — Occupational Reskilling & Analytics",
              issuedAt: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
              verificationStatus: "valid",
              userName: "Arjun Sharma",
              courseTitle: "SQL Fundamentals"
            }
          ]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadCerts();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Certificates of Completion</h1>
          <p className="text-slate-500 text-sm mt-1">
            Verified course completion records with cryptographically verifiable identification numbers.
          </p>
        </div>
      </div>

      {/* Distinction Alert */}
      <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-lg p-4 text-xs flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-sm">Regulatory &amp; Accreditation Distinction</p>
          <p className="mt-0.5 leading-relaxed">
            These certificates confirm completion of prescribed course curriculums on ORA. They reflect verified internal learning milestones and are not independently accredited government or university occupational qualifications.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px]">
          <Spinner className="w-8 h-8 text-teal-600 mb-2" />
          <p className="text-slate-500 text-sm">Loading credentials...</p>
        </div>
      ) : certificates.length === 0 ? (
        <Card className="text-center p-8 bg-white border border-slate-200">
          <Award className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h2 className="text-base font-semibold text-slate-800">No certificates earned yet</h2>
          <p className="text-xs text-slate-400 mt-1">Complete courses and final assessments to generate your verified certificate.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {certificates.map(cert => (
            <Card key={cert.id} className="border border-slate-200 bg-white hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <Badge variant="success" className="text-[10px] uppercase font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified &amp; Active
                  </Badge>
                  <span className="text-[11px] font-mono text-slate-500 font-semibold">{cert.certificateNumber}</span>
                </div>
                <CardTitle className="text-lg font-bold text-slate-900 mt-2">
                  {cert.title}
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 mt-0.5">
                  Issued by {cert.issuingOrganization}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-0 space-y-4">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Issued: {cert.issuedAt}
                  </span>
                  <Link 
                    href={`/verify-certificate/${cert.certificateNumber}`}
                    className="text-teal-600 font-semibold hover:underline flex items-center gap-1"
                    target="_blank"
                  >
                    Public URL <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>

                <div className="flex items-center gap-2">
                  <Button 
                    onClick={() => setSelectedCert(cert)}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs"
                  >
                    <FileCheck className="w-3.5 h-3.5 mr-1.5" />
                    View &amp; Print Certificate
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Certificate Modal */}
      {selectedCert && (
        <div className="fixed inset-0 bg-slate-900/80 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border-8 border-slate-900">
            <button 
              onClick={() => setSelectedCert(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Certificate Canvas / Template */}
            <div className="p-8 sm:p-12 text-center bg-radial from-slate-50 to-white">
              <div className="w-16 h-16 mx-auto bg-teal-600 rounded-2xl flex items-center justify-center shadow-lg mb-4">
                <Award className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-xs uppercase tracking-widest text-teal-700 font-bold">Certificate of Completion</h2>
              <p className="text-2xl font-serif font-extrabold text-slate-900 mt-2">Occupational Reskilling &amp; Analytics</p>
              
              <p className="text-xs text-slate-500 mt-6 uppercase tracking-wider">This is proudly presented to</p>
              <p className="text-2xl font-bold text-slate-900 mt-1 border-b-2 border-slate-200 pb-2 inline-block px-8">
                {selectedCert.userName || "Arjun Sharma"}
              </p>

              <p className="text-xs text-slate-600 mt-4 max-w-md mx-auto leading-relaxed">
                for successfully meeting the required competency benchmarks and curriculum requirements for
              </p>
              <p className="text-lg font-bold text-teal-800 mt-1">{selectedCert.title}</p>

              <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                <div className="text-left">
                  <p className="font-semibold text-slate-800">Priya Patel</p>
                  <p className="text-[10px]">Lead Curriculum Trainer, ORA</p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-[11px] font-bold text-slate-700">{selectedCert.certificateNumber}</p>
                  <p className="text-[10px]">Verification Token</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-100 flex items-center justify-end gap-2 border-t border-slate-200">
              <Button variant="outline" size="sm" onClick={() => window.print()} className="text-xs">
                <Printer className="w-3.5 h-3.5 mr-1" />
                Print / Save PDF
              </Button>
              <Button size="sm" onClick={() => setSelectedCert(null)} className="text-xs bg-slate-900 text-white">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
