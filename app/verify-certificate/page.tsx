"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Award, CheckCircle2, XCircle, Search, ArrowLeft, ShieldCheck } from "lucide-react";
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent, Badge, Spinner } from "@/components/ui";

export default function VerifyCertificatePage() {
  const [certNumber, setCertNumber] = useState("ORA-2024-SQL-RNER");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!certNumber.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`/api/certificates/verify/${encodeURIComponent(certNumber.trim())}`);
      if (res.ok) {
        const data = await res.json();
        setResult(data);
      } else {
        const errData = await res.json().catch(() => ({}));
        setError(errData.error || "Certificate not found or revoked.");
      }
    } catch (err: any) {
      setError("Network error while verifying certificate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 py-4 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-teal-600 rounded-md flex items-center justify-center">
              <span className="font-bold text-white text-xl">O</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight text-slate-900 leading-none">ORA</span>
              <span className="text-[10px] text-teal-600 font-medium">Occupational Reskilling &amp; Analytics</span>
            </div>
          </Link>

          <Link href="/login">
            <Button variant="outline" size="sm" className="text-xs">
              Portal Sign In
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-2xl w-full mx-auto p-4 sm:p-6 my-8">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-teal-100/60 text-teal-700 rounded-2xl mb-3">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Public Credential Verification
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            Verify the authenticity of certifications and competency records issued by ORA.
          </p>
        </div>

        <Card className="border border-slate-200 bg-white shadow-sm mb-6">
          <CardContent className="p-6">
            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Certificate Serial / Verification Number
                </label>
                <div className="flex gap-2">
                  <Input
                    value={certNumber}
                    onChange={(e) => setCertNumber(e.target.value)}
                    placeholder="e.g. ORA-2024-SQL-RNER"
                    className="font-mono text-sm uppercase"
                    required
                  />
                  <Button type="submit" disabled={loading} className="bg-teal-600 hover:bg-teal-700 text-white px-5">
                    {loading ? <Spinner className="w-4 h-4 mr-1.5" /> : <Search className="w-4 h-4 mr-1.5" />}
                    Verify
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>Demo Serial:</span>
                <button
                  type="button"
                  onClick={() => { setCertNumber("ORA-2024-SQL-RNER"); }}
                  className="text-teal-600 underline font-mono hover:text-teal-700 cursor-pointer"
                >
                  ORA-2024-SQL-RNER
                </button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Verification Result Display */}
        {result && (
          <div className="bg-white border-2 border-emerald-500/30 rounded-2xl p-6 sm:p-8 shadow-md animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Verified Authentic Credential</h3>
                  <p className="text-xs text-slate-500">Record confirmed in ORA decentralized registry</p>
                </div>
              </div>
              <Badge variant="default" className="bg-emerald-600 text-white font-semibold">
                VALID
              </Badge>
            </div>

            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-slate-400 block uppercase font-medium">Recipient</span>
                  <span className="font-bold text-slate-900 text-base">{result.user?.name}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block uppercase font-medium">Certificate ID</span>
                  <span className="font-mono text-slate-800 font-semibold">{result.certificate?.certificateNumber}</span>
                </div>
              </div>

              <div>
                <span className="text-xs text-slate-400 block uppercase font-medium">Competency / Course</span>
                <span className="font-semibold text-teal-700 text-base">{result.certificate?.title}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                <div>
                  <span className="text-xs text-slate-400 block uppercase font-medium">Issuing Authority</span>
                  <span className="text-slate-700">{result.certificate?.issuingOrganization || "ORA Platform"}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block uppercase font-medium">Issue Date</span>
                  <span className="text-slate-700">{new Date(result.certificate?.issuedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center text-red-700 animate-in fade-in">
            <XCircle className="w-8 h-8 mx-auto mb-2 text-red-500" />
            <h3 className="font-bold text-base mb-1">Credential Verification Failed</h3>
            <p className="text-xs text-red-600">{error}</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-500 bg-white">
        © 2024 ORA — Occupational Reskilling &amp; Analytics Platform. Smart India Hackathon Submission.
      </footer>
    </div>
  );
}
