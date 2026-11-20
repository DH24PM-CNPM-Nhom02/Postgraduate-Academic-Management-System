import React, { Suspense } from "react";
import { ProceduresFormsView } from "@/src/components/shared";

export const metadata = {
  title: "Thủ tục & Biểu mẫu học vụ | Cổng Giáo vụ SĐH",
  description: "Hệ thống thủ tục học vụ và kho biểu mẫu quy chuẩn đào tạo tiến sĩ AGU.",
};

export default function AcademicProceduresPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center text-xs text-slate-500">
          Đang tải danh mục thủ tục &amp; biểu mẫu...
        </div>
      }
    >
      <ProceduresFormsView
        roleContext="academic"
        backHref="/academic"
        backLabel="Tổng quan học vụ"
      />
    </Suspense>
  );
}
