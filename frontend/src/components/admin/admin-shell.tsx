"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "./sidebar";
import { AdminHeader } from "./header";
import { AdminFooter } from "./footer";
import { GlobalSearchModal } from "@/src/components/academic/GlobalSearchModal";

export interface AdminShellProps {
  children: React.ReactNode;
}

export function AdminShell({ children }: AdminShellProps) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  // Keyboard shortcut Ctrl+K / Cmd+K for global search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSelectSearchResult = (item: {
    payload?: { tab?: string; targetPath?: string; searchQuery?: string; studentCode?: string };
  }) => {
    let targetPath = item.payload?.targetPath;
    if (!targetPath && item.payload?.tab) {
      const tab = item.payload.tab;
      const tabMap: Record<string, string> = {
        students: "/students",
        theses: "/theses",
        thesis: "/theses",
        "topic-changes": "/topic-changes",
        supervisors: "/supervisors",
        procedures: "/procedures",
        regulations: "/regulations",
        decisions: "/decisions",
        evidence: "/evidence",
        "milestone-review": "/milestone-review",
        calendar: "/calendar",
        faq: "/faq",
        dashboard: "/overview",
      };
      targetPath = tabMap[tab] || `/${tab}`;
    }
    if (!targetPath) {
      targetPath = "/students";
    }
    const query = item.payload?.searchQuery || item.payload?.studentCode;
    router.push(`/admin${targetPath}${query ? `?search=${encodeURIComponent(query)}` : ""}`);
  };



  return (
    <div className="flex min-h-screen bg-[#F4F6F9] text-slate-800 antialiased font-sans">
      {/* Sidebar (Desktop Collapsible & Mobile Slide-in Drawer) */}
      <React.Suspense fallback={<div className="w-64 border-r border-slate-200 bg-white" />}>
        <AdminSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        />
      </React.Suspense>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Compact Admin Header */}
        <AdminHeader
          onToggleSidebar={() => setSidebarOpen(true)}
          onOpenSearch={() => setSearchModalOpen(true)}
        />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>

        {/* University Standard Footer for Admin */}
        <AdminFooter />
      </div>

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSelect={handleSelectSearchResult}
      />
    </div>
  );
}

export default AdminShell;
