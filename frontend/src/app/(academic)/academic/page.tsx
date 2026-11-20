import { redirect } from "next/navigation";
import React, { Suspense } from "react";
import { AcademicDashboardView } from "@/src/components/academic";

const TAB_REDIRECT_MAP: Record<string, string> = {
  students: "/academic/students",
  theses: "/academic/theses",
  thesis: "/academic/theses",
  supervisors: "/academic/supervisors",
  "milestone-review": "/academic/milestone-review",
  decisions: "/academic/decisions",
  evidence: "/academic/evidence",
  evidences: "/academic/evidence",
  "topic-changes": "/academic/topic-changes",
  procedures: "/academic/procedures",
  forms: "/academic/forms",
  calendar: "/academic/calendar",
  regulations: "/academic/regulations",
  faq: "/academic/faq",
};

/**
 * Route: /academic
 * Thin Route Page theo chuẩn Clean Architecture Next.js App Router.
 * Tương thích ngược: Nếu người dùng truy cập /academic?tab=... cũ, tự động redirect sang route thật.
 */
export default async function AcademicDashboardPage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = searchParams ? await searchParams : {};
  const tab = typeof resolvedParams.tab === "string" ? resolvedParams.tab : undefined;

  if (tab && TAB_REDIRECT_MAP[tab]) {
    const targetBase = TAB_REDIRECT_MAP[tab];
    const urlParams = new URLSearchParams();
    for (const [key, val] of Object.entries(resolvedParams)) {
      if (key !== "tab" && typeof val === "string") {
        urlParams.set(key, val);
      }
    }
    const queryString = urlParams.toString();
    redirect(queryString ? `${targetBase}?${queryString}` : targetBase);
  }

  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center text-xs text-slate-500">
          Đang tải bảng điều khiển Giáo vụ SĐH...
        </div>
      }
    >
      <AcademicDashboardView />
    </Suspense>
  );
}
