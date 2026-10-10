"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Bell, 
  CheckCircle2, 
  BookOpen, 
  Award, 
  ClipboardCheck, 
  AlertTriangle, 
  Info,
  CheckCheck
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

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const loadNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      if (data.notifications && data.notifications.length > 0) {
        setNotifications(data.notifications);
      } else {
        // Fallback sample notifications
        setNotifications([
          {
            id: "notif-1",
            title: "Assessment Evaluated: SQL Fundamentals",
            message: "Your recent assessment attempt scored 85%. Your verified competency level has been updated to Level 4 (Advanced).",
            type: "assessment",
            isRead: false,
            link: "/skills",
            createdAt: "10 minutes ago"
          },
          {
            id: "notif-2",
            title: "Roadmap Milestone Unlocked",
            message: "Step 2: 'Python for Data Analysis' is now available on your learning roadmap.",
            type: "roadmap",
            isRead: false,
            link: "/roadmap",
            createdAt: "2 hours ago"
          },
          {
            id: "notif-3",
            title: "Certificate Issued",
            message: "Your completion certificate for 'SQL Fundamentals & Relational Querying' is ready for download.",
            type: "certificate",
            isRead: true,
            link: "/certificates",
            createdAt: "Yesterday"
          },
          {
            id: "notif-4",
            title: "New Course Available: Machine Learning Primer",
            message: "Priya Patel has published a new 40-hour course targeting your secondary occupational goals.",
            type: "course",
            isRead: true,
            link: "/courses",
            createdAt: "3 days ago"
          }
        ]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await fetch("/api/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ all: true })
      });
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = notifications.filter(n => filter === "all" || !n.isRead);

  const getIcon = (type: string) => {
    switch (type) {
      case "assessment": return <ClipboardCheck className="w-5 h-5 text-blue-600" />;
      case "certificate": return <Award className="w-5 h-5 text-amber-600" />;
      case "course": return <BookOpen className="w-5 h-5 text-teal-600" />;
      default: return <Info className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
          <p className="text-slate-500 text-sm mt-1">
            Real-time milestone updates, assessment results, and curriculum announcements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            onClick={handleMarkAllRead} 
            variant="outline" 
            size="sm" 
            className="text-xs"
          >
            <CheckCheck className="w-3.5 h-3.5 mr-1.5" />
            Mark All as Read
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setFilter("all")}
          className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
            filter === "all" 
              ? "border-teal-600 text-teal-800" 
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
            filter === "unread" 
              ? "border-teal-600 text-teal-800" 
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Unread ({notifications.filter(n => !n.isRead).length})
        </button>
      </div>

      {/* Notifications List */}
      {loading ? (
        <div className="text-center py-12">
          <Spinner className="w-8 h-8 text-teal-600 mx-auto mb-2" />
          <p className="text-sm text-slate-500">Loading notifications...</p>
        </div>
      ) : filtered.length === 0 ? (
        <Card className="p-8 text-center bg-white border border-slate-200">
          <Bell className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">No notifications in this view</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map(notif => (
            <Card 
              key={notif.id} 
              className={`border transition-all ${
                notif.isRead ? "border-slate-200 bg-white" : "border-teal-200 bg-teal-50/20"
              }`}
            >
              <CardContent className="p-4 flex items-start gap-4">
                <div className="p-2.5 bg-slate-100 rounded-lg shrink-0 mt-0.5">
                  {getIcon(notif.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className={`text-sm ${notif.isRead ? "font-semibold text-slate-800" : "font-bold text-slate-900"}`}>
                      {notif.title}
                    </h3>
                    <span className="text-[11px] text-slate-400 shrink-0">{notif.createdAt}</span>
                  </div>

                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {notif.message}
                  </p>

                  {notif.link && (
                    <div className="mt-2">
                      <Link 
                        href={notif.link}
                        className="text-xs font-semibold text-teal-600 hover:text-teal-800 hover:underline"
                      >
                        View Details →
                      </Link>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
