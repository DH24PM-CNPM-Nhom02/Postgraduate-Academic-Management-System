import { redirect } from "next/navigation";
import React, { Suspense } from "react";
import { AcademicDashboardView } from "@/src/components/academic";

export const metadata = {
  title: "Tổng quan Đào tạo SĐH | Cổng Quản trị Hệ thống",
  description: "Bảng điều khiển tổng quan đào tạo sau đại học và tiến độ nghiên cứu sinh AGU.",
};

const ADMIN_TAB_REDIRECT_MAP: Record<string, string> = {
  students: "/admin/students",
  theses: "/admin/theses",
  thesis: "/admin/theses",
  supervisors: "/admin/supervisors",
  "milestone-review": "/admin/milestone-review",
  decisions: "/admin/decisions",
  evidence: "/admin/evidence",
  evidences: "/admin/evidence",
  "topic-changes": "/admin/topic-changes",
  procedures: "/admin/procedures",
  forms: "/admin/forms",
  calendar: "/admin/calendar",
  regulations: "/admin/regulations",
  faq: "/admin/faq",
  users: "/admin/users",
  "audit-log": "/admin/audit-log",
};

/**
 * Route: /admin/overview
 * Kế thừa trực tiếp AcademicDashboardView từ phân hệ Academic cho Admin.
 * Tương thích ngược: Nếu người dùng truy cập ?tab=... cũ, tự động chuyển tiếp tới /admin/<page>.
 */
export default async function AdminAcademicOverviewPage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = searchParams ? await searchParams : {};
  const tab = typeof resolvedParams.tab === "string" ? resolvedParams.tab : undefined;

  if (tab && ADMIN_TAB_REDIRECT_MAP[tab]) {
    const targetBase = ADMIN_TAB_REDIRECT_MAP[tab];
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
          Đang tải bảng điều khiển Đào tạo SĐH...
        </div>
      }
    >
      <AcademicDashboardView />
    </Suspense>
  );
}
