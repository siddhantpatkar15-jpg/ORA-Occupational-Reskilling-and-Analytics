"use client";

import React, { useState, useEffect } from "react";
import { 
  Settings, 
  Globe, 
  Bell, 
  Shield, 
  Download, 
  User, 
  CheckCircle2, 
  Save, 
  AlertCircle,
  Check
} from "lucide-react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  Badge, 
  Button, 
  Input, 
  Spinner 
} from "@/components/ui";
import { useTranslation } from "@/lib/i18n/client";
import { Locale } from "@/lib/i18n";

export default function SettingsPage() {
  const { locale, setLocale, t, languages } = useTranslation();
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [assessmentAlerts, setAssessmentAlerts] = useState(true);
  const [saved, setSaved] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleExportData = () => {
    setExporting(true);
    setTimeout(() => {
      const dummyData = {
        platform: "ORA - Occupational Reskilling & Analytics",
        exportDate: new Date().toISOString(),
        user: {
          name: "Arjun Sharma",
          email: "learner@ora-demo.com",
          role: "learner",
          targetOccupation: "Data Analyst"
        },
        competencies: [
          { skill: "SQL", selfReported: 3, assessed: 4, verified: 4 },
          { skill: "Python", selfReported: 2, assessed: 1, verified: null },
          { skill: "Statistics", selfReported: 2, assessed: 1, verified: null }
        ],
        enrollments: [
          { course: "SQL Fundamentals", progress: 100, completed: true }
        ]
      };

      const blob = new Blob([JSON.stringify(dummyData, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ORA_Personal_Data_${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setExporting(false);
    }, 800);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          {t("settings.title") || "Account & Platform Settings"}
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          {t("settings.subtitle") || "Manage localization, notification preferences, and privacy controls."}
        </p>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {t("common.success") || "Settings successfully updated!"}
        </div>
      )}

      {/* Language / Localization */}
      <Card className="border border-slate-200 bg-white">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-teal-600" />
            <CardTitle className="text-base font-bold text-slate-900">
              {t("settings.language") || "Language & Localization"}
            </CardTitle>
          </div>
          <CardDescription className="text-xs text-slate-500">
            {t("settings.selectLanguage") || "Select your preferred display language for the ORA interface (English, Hindi, Marathi)."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* English */}
            <button
              type="button"
              onClick={() => setLocale("en")}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                locale === "en" 
                  ? "border-teal-600 bg-teal-50/50 ring-2 ring-teal-500/20 shadow-sm" 
                  : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🇬🇧</span>
                  <span className="font-bold text-sm text-slate-900">English</span>
                </div>
                {locale === "en" && (
                  <Badge variant="default" className="text-[10px] bg-teal-600 text-white flex items-center gap-1">
                    <Check className="w-3 h-3" /> Active
                  </Badge>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-2">Default global English interface</p>
            </button>

            {/* Hindi */}
            <button
              type="button"
              onClick={() => setLocale("hi")}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                locale === "hi" 
                  ? "border-teal-600 bg-teal-50/50 ring-2 ring-teal-500/20 shadow-sm" 
                  : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🇮🇳</span>
                  <span className="font-bold text-sm text-slate-900">हिन्दी (Hindi)</span>
                </div>
                {locale === "hi" && (
                  <Badge variant="default" className="text-[10px] bg-teal-600 text-white flex items-center gap-1">
                    <Check className="w-3 h-3" /> सक्रिय
                  </Badge>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-2">व्यावसायिक पुनर्कौशल और विश्लेषिकी</p>
            </button>

            {/* Marathi */}
            <button
              type="button"
              onClick={() => setLocale("mr")}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                locale === "mr" 
                  ? "border-teal-600 bg-teal-50/50 ring-2 ring-teal-500/20 shadow-sm" 
                  : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🚩</span>
                  <span className="font-bold text-sm text-slate-900">मराठी (Marathi)</span>
                </div>
                {locale === "mr" && (
                  <Badge variant="default" className="text-[10px] bg-teal-600 text-white flex items-center gap-1">
                    <Check className="w-3 h-3" /> सक्रिय
                  </Badge>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-2">व्यावसायिक पुनर्कौशल्य आणि विश्लेषण</p>
            </button>
          </div>

          <p className="text-[11px] text-slate-400">
            * Note: Language preference is persisted to your session and browser storage. Navigation, headers, controls, and system dialogues update in real-time.
          </p>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card className="border border-slate-200 bg-white">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-teal-600" />
            <CardTitle className="text-base font-bold text-slate-900">
              {t("settings.notifications") || "Notification Preferences"}
            </CardTitle>
          </div>
          <CardDescription className="text-xs text-slate-500">
            Choose what alerts and progress reminders you receive.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
            <div>
              <p className="text-sm font-semibold text-slate-800">Assessment &amp; Grading Results</p>
              <p className="text-xs text-slate-500">Notify me as soon as knowledge tests are scored.</p>
            </div>
            <input 
              type="checkbox" 
              checked={assessmentAlerts} 
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500 cursor-pointer" 
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
            <div>
              <p className="text-sm font-semibold text-slate-800">Curriculum &amp; Course Milestones</p>
              <p className="text-xs text-slate-500">Send reminders when roadmap learning steps unlock.</p>
            </div>
            <input 
              type="checkbox" 
              checked={emailAlerts} 
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500 cursor-pointer" 
            />
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Data Ownership */}
      <Card className="border border-slate-200 bg-white">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-teal-600" />
            <CardTitle className="text-base font-bold text-slate-900">
              {t("settings.privacy") || "Privacy & Data Portability"}
            </CardTitle>
          </div>
          <CardDescription className="text-xs text-slate-500">
            {t("settings.exportData") || "Export your complete learning history, assessments, and verified competencies."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-slate-600 leading-relaxed">
            In compliance with open workforce standards, you have the right to download all personal skill profile records, assessment logs, and credentials stored on this instance.
          </p>

          <Button 
            onClick={handleExportData}
            disabled={exporting}
            variant="outline" 
            size="sm"
            className="text-xs"
          >
            {exporting ? (
              <Spinner className="w-3.5 h-3.5 mr-1.5" />
            ) : (
              <Download className="w-3.5 h-3.5 mr-1.5" />
            )}
            Download Personal Profile (JSON)
          </Button>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="bg-teal-600 hover:bg-teal-500 text-white text-xs">
          <Save className="w-3.5 h-3.5 mr-1.5" />
          {t("common.save") || "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
