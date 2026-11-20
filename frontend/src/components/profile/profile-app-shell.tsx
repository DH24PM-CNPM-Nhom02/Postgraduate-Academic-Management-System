"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/src/hooks/use-auth";
import { AdminShell } from "@/src/components/admin/admin-shell";
import { StudentFooter } from "@/src/components/student/footer";
import { StudentHeader } from "@/src/components/student/header";
import { StudentSidebar } from "@/src/components/student/sidebar";
import {
  AcademicFooter,
  AcademicHeader,
  AcademicSidebar,
  GlobalSearchModal,
} from "@/src/components/academic";
import {
  SupervisorFooter,
  SupervisorHeader,
  SupervisorSidebar,
} from "@/src/components/supervisor";
import { useMySupervisorProfile, useMySupervisedStudents } from "@/src/hooks/use-academic";
import { computeSupervisorQuota } from "@/src/services/gvhd";

function StudentProfileShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F0F5FA] font-sans text-slate-800 antialiased">
      <Suspense fallback={<div className="w-64 border-r bg-white" />}>
        <StudentSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </Suspense>
      <div className="flex min-w-0 flex-1 flex-col">
        <StudentHeader onToggleSidebar={() => setSidebarOpen(true)} />
        <div className="flex-1 p-4 sm:p-6 lg:p-8">{children}</div>
        <StudentFooter />
      </div>
    </div>
  );
}

function AcademicProfileShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen((open) => !open);
      }
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  return (
    <div className="flex min-h-screen bg-[#F0F5FA] font-sans text-slate-800 antialiased">
      <Suspense fallback={<div className="w-64 border-r bg-white" />}>
        <AcademicSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed((collapsed) => !collapsed)}
        />
      </Suspense>
      <div className="flex min-w-0 flex-1 flex-col">
        <AcademicHeader
          onToggleSidebar={() => setSidebarOpen(true)}
          onOpenSearch={() => setSearchOpen(true)}
        />
        <div className="flex-1 p-4 sm:p-6 lg:p-8">{children}</div>
        <AcademicFooter />
      </div>
      <GlobalSearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelect={(item) => {
          if (item.payload?.tab) router.push(`/academic?tab=${item.payload.tab}`);
        }}
      />
    </div>
  );
}

function SupervisorProfileShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: profile } = useMySupervisorProfile();
  const { data: students } = useMySupervisedStudents();
  const quota = useMemo(
    () => profile ? computeSupervisorQuota(students ?? [], profile.hanMucToiDa) : undefined,
    [profile, students],
  );

  return (
    <div className="flex min-h-screen bg-[#F0F5FA] text-foreground">
      <Suspense fallback={<div className="w-64 border-r bg-white" />}>
        <SupervisorSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          profile={profile}
          quota={quota}
        />
      </Suspense>
      <div className="flex min-w-0 flex-1 flex-col">
        <SupervisorHeader onToggleSidebar={() => setSidebarOpen(true)} profile={profile} />
        <div className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </div>
        <SupervisorFooter />
      </div>
    </div>
  );
}

export function ProfileAppShell({ children }: { children: React.ReactNode }) {
  const { role, isLoading } = useAuth();

  if (isLoading || !role) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F0F5FA] text-sm text-muted-foreground">
        <Loader2 className="mr-2 size-4 animate-spin" />Đang mở hồ sơ...
      </div>
    );
  }

  if (role === "ADMIN") return <AdminShell>{children}</AdminShell>;
  if (role === "GIAO_VU") return <AcademicProfileShell>{children}</AcademicProfileShell>;
  if (role === "GVHD") return <SupervisorProfileShell>{children}</SupervisorProfileShell>;
  return <StudentProfileShell>{children}</StudentProfileShell>;
}
