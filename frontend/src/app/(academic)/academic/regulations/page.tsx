import React, { Suspense } from "react";
import { RegulationsView } from "@/src/components/shared";

export const metadata = {
  title: "Quy chế & Quy định | Cổng Giáo vụ SĐH",
  description: "Văn bản quy chế đào tạo tiến sĩ và định mức GVHD BR-09 ĐHQG-HCM.",
};

export default function AcademicRegulationsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center text-xs text-slate-500">
          Đang tải danh mục quy chế &amp; quy định...
        </div>
      }
    >
      <RegulationsView
        roleContext="academic"
        backHref="/academic"
        backLabel="Tổng quan học vụ"
      />
    </Suspense>
  );
}
