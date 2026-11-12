"use client";

import { useState } from "react";
import { AdminSidebar } from "./sidebar";
import { AdminHeader } from "./header";
import { AdminFooter } from "./footer";

interface AdminShellProps {
  children: React.ReactNode;
}

export function AdminShell({ children }: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-muted/30 text-foreground selection:bg-rose-500/15 selection:text-rose-900 dark:selection:text-rose-100">
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminHeader onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
        <AdminFooter />
      </div>
    </div>
  );
}

export default AdminShell;
