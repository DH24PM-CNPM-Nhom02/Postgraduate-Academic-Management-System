"use client";

import React, { useState } from "react";
import { StudentSidebar } from "@/src/components/student/sidebar";
import { StudentHeader } from "@/src/components/student/header";
import { StudentFooter } from "@/src/components/student/footer";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F0F5FA] text-slate-800 antialiased font-sans">
      {/* Sidebar điều hướng NCS */}
      <React.Suspense fallback={<div className="w-64 border-r bg-white" />}>
        <StudentSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      </React.Suspense>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        <StudentHeader onToggleSidebar={() => setSidebarOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>

        <StudentFooter />
      </div>
    </div>
  );
}
