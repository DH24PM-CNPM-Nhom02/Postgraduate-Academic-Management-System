"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  SupervisorHeader,
  SupervisorSidebar,
  SupervisorFooter,
  GlobalSearchModal,
} from "@/src/components/supervisor";

export default function SupervisorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

  const handleSelectSearchResult = (item: { payload?: { tab?: string } }) => {
    if (item.payload?.tab) {
      router.push(`/supervisor?tab=${item.payload.tab}`);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F0F5FA] text-slate-800 antialiased font-sans">
      {/* Sidebar (Desktop Collapsible & Mobile Slide-in Drawer) */}
      <React.Suspense fallback={<div className="w-64 border-r bg-white" />}>
        <SupervisorSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        />
      </React.Suspense>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Compact Header */}
        <SupervisorHeader
          onToggleSidebar={() => setSidebarOpen(true)}
          onOpenSearch={() => setSearchModalOpen(true)}
          onSelectNotification={(notif) => {
            if (notif.type === "evidence") {
              router.push("/supervisor?tab=evidence");
            } else if (notif.type === "topic") {
              router.push("/supervisor?tab=topic-changes");
            } else if (notif.type === "deadline") {
              router.push("/supervisor?tab=calendar");
            }
          }}
        />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>

        {/* Standard University Footer */}
        <SupervisorFooter />
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
