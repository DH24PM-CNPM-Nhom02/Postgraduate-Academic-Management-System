import React from "react";
import type { Metadata } from "next";
import { MyThesisCard, ThesisHistory } from "@/src/components/thesis";
import { mockStudentThesisOverview } from "@/src/mocks/thesis";

export const metadata: Metadata = {
  title: "Đề tài luận án của tôi | Cổng thông tin Nghiên cứu sinh AGU",
  description:
    "Theo dõi đề tài luận án tiến sĩ hiện tại, quyết định giao đề tài và lịch sử điều chỉnh đề tài của Nghiên cứu sinh.",
};

/**
 * Thin Page cho màn hình Đề tài luận án của tôi (/student/thesis).
 * Chỉ định nghĩa Metadata và truyền dữ liệu từ mock vào các Component hiển thị.
 */
export default function StudentThesisPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-12">
      <header className="border-b border-border pb-4">
        <h1 className="text-xl font-bold tracking-tight text-[#0F2744] sm:text-2xl">
          Đề tài luận án của tôi
        </h1>
        <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
          Thông tin đề tài luận án tiến sĩ chính thức và lịch sử các quyết định điều chỉnh
          của NCS{" "}
          <strong className="font-semibold text-foreground">
            {mockStudentThesisOverview.hoTenNcs}
          </strong>{" "}
          (<span className="font-mono">{mockStudentThesisOverview.mshv}</span>).
        </p>
      </header>

      <MyThesisCard
        thesis={mockStudentThesisOverview.deTaiHienTai}
        trainingDeadline={mockStudentThesisOverview.hanDaoTao72Thang}
      />

      <ThesisHistory items={mockStudentThesisOverview.lichSuDeTai} />
    </div>
  );
}
