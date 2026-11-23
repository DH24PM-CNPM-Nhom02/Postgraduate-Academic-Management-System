"use client";

import React, { useMemo, useState } from "react";
import {
  SupervisorFooter,
  SupervisorHeader,
  SupervisorSidebar,
} from "@/src/components/supervisor";
import {
  useMySupervisorProfile,
  useMySupervisedStudents,
} from "@/src/hooks/use-academic";
import { computeSupervisorQuota } from "@/src/services/gvhd";

export default function SupervisorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: profile } = useMySupervisorProfile();
  const { data: students } = useMySupervisedStudents();

  const maxQuota = profile?.hanMucToiDa;
  const quota = useMemo(() => (
    students && maxQuota !== undefined ? computeSupervisorQuota(students, maxQuota) : undefined
  ), [students, maxQuota]);

  return (
    <div className="flex min-h-screen bg-[#F0F5FA] text-foreground">
      <a
        href="#supervisor-main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-[#164E9B] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:outline-none"
      >
        Chuyển đến nội dung chính
      </a>

      <SupervisorSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        profile={profile}
        quota={quota}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <SupervisorHeader
          onToggleSidebar={() => setSidebarOpen(true)}
          profile={profile}
        />

        <main
          id="supervisor-main-content"
          className="flex-1 px-4 py-6 sm:px-6 lg:px-8"
        >
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>

        <SupervisorFooter />
      </div>
    </div>
  );
}
