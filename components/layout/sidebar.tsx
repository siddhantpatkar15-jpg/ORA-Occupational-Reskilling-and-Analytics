"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  User, 
  Bell, 
  Settings, 
  ClipboardCheck, 
  Zap, 
  Briefcase, 
  BookOpen, 
  Map, 
  Award, 
  Users, 
  BarChart3, 
  UserCog, 
  Building2, 
  Tags, 
  GraduationCap, 
  FileText,
  LogOut,
  X,
  Menu
} from "lucide-react";
import { Avatar } from "@/components/ui";
import { useTranslation } from "@/lib/i18n/client";

interface SidebarProps {
  user: {
    name: string;
    role: string;
    email: string;
    avatarUrl?: string;
  };
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function Sidebar({ user, isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();
  const { t } = useTranslation();

  const allRolesNav = [
    { name: t("nav.dashboard") || "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: t("nav.profile") || "Profile", href: "/profile", icon: User },
    { name: t("nav.notifications") || "Notifications", href: "/notifications", icon: Bell, badge: 3 },
    { name: t("nav.settings") || "Settings", href: "/settings", icon: Settings },
  ];

  const learnerNav = [
    { name: t("nav.assessments") || "Assessments", href: "/assessments", icon: ClipboardCheck },
    { name: t("nav.skills") || "Skills", href: "/skills", icon: Zap },
    { name: t("nav.occupations") || "Occupations", href: "/occupations", icon: Briefcase },
    { name: t("nav.courses") || "Courses", href: "/courses", icon: BookOpen },
    { name: t("nav.roadmap") || "Roadmap", href: "/roadmap", icon: Map },
    { name: t("nav.certificates") || "Certificates", href: "/certificates", icon: Award },
  ];

  const trainerNav = [
    { name: t("nav.learners") || "My Learners", href: "/trainer/learners", icon: Users },
    { name: t("nav.courses") || "My Courses", href: "/trainer/courses", icon: BookOpen },
    { name: t("nav.assessments") || "Assessments", href: "/trainer/assessments", icon: ClipboardCheck },
    { name: t("nav.trainer") || "Trainer Dashboard", href: "/trainer/dashboard", icon: BarChart3 },
  ];

  const adminNav = [
    { name: t("nav.adminUsers") || "User Management", href: "/admin/users", icon: UserCog },
    { name: t("nav.departments") || "Departments", href: "/admin/departments", icon: Building2 },
    { name: t("nav.occupations") || "Occupations", href: "/admin/occupations", icon: Briefcase },
    { name: t("nav.skillsTaxonomy") || "Skills Taxonomy", href: "/admin/skills", icon: Tags },
    { name: t("nav.training") || "Training", href: "/admin/training", icon: GraduationCap },
    { name: t("nav.analytics") || "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { name: t("nav.auditLog") || "Audit Log", href: "/admin/audit", icon: FileText },
  ];

  const role = (user.role || "").toLowerCase();
  let roleNav: typeof allRolesNav = [];
  if (role === "learner") roleNav = learnerNav;
  if (role === "trainer") roleNav = trainerNav;
  if (role === "admin" || role === "super_admin" || role === "superadmin") roleNav = adminNav;

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {
      console.error(e);
    }
    window.location.href = "/login";
  };

  const NavItem = ({ item }: { item: any }) => {
    const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
    const Icon = item.icon;

    return (
      <Link 
        href={item.href}
        className={`flex items-center justify-between px-4 py-3 rounded-md transition-colors ${
          isActive 
            ? "bg-[#ad8075]/20 text-[#e0a89d] border-l-4 border-[#ad8075] font-semibold" 
            : "text-slate-300 hover:bg-[#304250] hover:text-white border-l-4 border-transparent"
        }`}
        onClick={() => setIsOpen(false)}
      >
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5" />
          <span className="font-medium text-sm">{item.name}</span>
        </div>
        {item.badge && (
          <span className="bg-[#ad8075] text-white text-xs font-bold px-2 py-0.5 rounded-full">
            {item.badge}
          </span>
        )}
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-[#22303c]/80 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#22303c] text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto lg:z-auto flex flex-col ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="flex items-center justify-between h-16 px-5 border-b border-[#304250]">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Image
              src="/ora-logo-transparent.png"
              alt="ORA"
              width={140}
              height={45}
              className="brightness-0 invert object-contain"
              priority
            />
          </Link>
          <button 
            className="lg:hidden text-slate-400 hover:text-white"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
          <div className="space-y-1">
            <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              {t("common.main") || "Main"}
            </p>
            {allRolesNav.map(item => <NavItem key={item.href} item={item} />)}
          </div>

          <div className="space-y-1">
            <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              {role === "learner" 
                ? (t("nav.roadmap") ? `${t("nav.roadmap")}` : "Learning & Career") 
                : role === "trainer" 
                ? (t("nav.trainer") || "Trainer Tools") 
                : (t("nav.admin") || "Administration")}
            </p>
            {roleNav.map(item => <NavItem key={item.href} item={item} />)}
          </div>
        </div>

        <div className="border-t border-slate-800 p-4">
          <div className="flex items-center gap-3 mb-4">
            <Avatar src={user.avatarUrl} alt={user.name} fallback={user.name.charAt(0)} className="w-10 h-10 border border-slate-700" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.name}</p>
              <p className="text-xs text-teal-400 capitalize truncate">{role.replace('_', ' ')}</p>
            </div>
          </div>
          <button 
            onClick={handleSignOut}
            className="flex items-center justify-center w-full gap-2 px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            {t("nav.logout") || "Sign Out"}
          </button>
        </div>
      </div>
    </>
  );
}

