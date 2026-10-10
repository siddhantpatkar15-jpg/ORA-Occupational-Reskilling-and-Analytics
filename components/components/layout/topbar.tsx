"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Menu, Search, Bell, Globe, Check, ChevronDown } from "lucide-react";
import { useTranslation } from "@/lib/i18n/client";
import { Locale } from "@/lib/i18n";

interface TopbarProps {
  onMenuClick: () => void;
  title?: string;
}

export function Topbar({ onMenuClick, title = "Dashboard" }: TopbarProps) {
  const { locale, setLocale, t, languages } = useTranslation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectLanguage = (lang: Locale) => {
    setLocale(lang);
    setDropdownOpen(false);
  };

  const currentLang = languages[locale] || languages.en;

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 z-20 sticky top-0">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-md cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>
        <span className="text-sm font-semibold text-slate-800 hidden sm:block">
          ORA — {t("common.appFullName") || "Occupational Reskilling & Analytics"}
        </span>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Language Switcher Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors cursor-pointer"
            title="Change Language"
          >
            <span className="text-sm">{currentLang.flag}</span>
            <span>{currentLang.nativeName}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Select Language / भाषा निवडा
              </div>
              {(Object.keys(languages) as Locale[]).map((langKey) => {
                const item = languages[langKey];
                const isSelected = locale === langKey;
                return (
                  <button
                    key={langKey}
                    onClick={() => handleSelectLanguage(langKey)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs transition-colors cursor-pointer ${
                      isSelected 
                        ? "bg-teal-50 text-teal-800 font-bold" 
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{item.flag}</span>
                      <span>{item.nativeName} ({item.name})</span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-teal-600" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Notifications Icon */}
        <Link 
          href="/notifications"
          className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors relative cursor-pointer"
          title={t("nav.notifications")}
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-teal-500 rounded-full border border-white"></span>
        </Link>
      </div>
    </header>
  );
}
