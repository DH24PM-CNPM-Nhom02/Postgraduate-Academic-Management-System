"use client";

import React, { useState } from "react";
import { AlertCircle, GraduationCap, RefreshCw } from "lucide-react";
import { PdfViewer } from "@/src/components/upload/PdfViewer";
import type {
  GraduationConditionAttachment,
  GraduationWorkspaceProps,
} from "@/src/types/ui/graduation";
import { GraduationConditions } from "./GraduationConditions";
import { GraduationOverviewCard } from "./GraduationOverviewCard";

interface PreviewPdfState {
  fileUrl: string;
  fileName: string;
  title: string;
  subtitle?: string;
}

/**
 * GraduationWorkspace
 *
 * Container kết nối màn hình Xét tốt nghiệp cá nhân: hỗ trợ đầy đủ
 * trạng thái `isLoading`, `error`, `empty`, chuyển đổi kịch bản kiểm thử UI
 * và xem trước tệp chứng chỉ/xác nhận qua `PdfViewer`.
 */
export function GraduationWorkspace({
  overview,
  scenarios,
  isLoading = false,
  error = null,
  onRetry,
  className = "",
}: GraduationWorkspaceProps) {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(
    () => (scenarios && scenarios.length > 0 ? scenarios[0].id : null)
  );
  const [activePdf, setActivePdf] = useState<PreviewPdfState | null>(null);

  const activeOverview =
    scenarios && scenarios.length > 0
      ? scenarios.find((s) => s.id === selectedScenarioId)?.data ?? overview
      : overview;

  const handlePreviewDocument = (
    attachment: GraduationConditionAttachment,
    conditionTitle: string
  ) => {
    setActivePdf({
      fileUrl: attachment.fileUrl,
      fileName: attachment.fileName,
      title: conditionTitle,
      subtitle: attachment.subtitle,
    });
  };

  return (
    <div className={`mx-auto max-w-7xl space-y-6 pb-12 ${className}`}>
      {/* Header trang */}
      <header className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#0F2744] sm:text-2xl">
            Xét tốt nghiệp cá nhân
          </h1>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            Kiểm tra đối soát 06 điều kiện công nhận trình độ và cấp bằng Tiến sĩ
            {activeOverview ? (
              <>
                {" "}
                cho NCS{" "}
                <strong className="font-semibold text-foreground">
                  {activeOverview.hoTenNcs}
                </strong>{" "}
                (<span className="font-mono">{activeOverview.mshv}</span>).
              </>
            ) : (
              "."
            )}
          </p>
        </div>

        {/* Bộ chuyển kịch bản mẫu khi có nhiều hơn 1 scenario */}
        {scenarios && scenarios.length > 1 && !isLoading && !error && (
          <div
            role="group"
            aria-label="Chọn kịch bản dữ liệu mẫu"
            className="inline-flex flex-wrap items-center gap-1 rounded-xl border border-border bg-muted/40 p-1"
          >
            {scenarios.map((sc) => {
              const isSelected =
                (selectedScenarioId ?? scenarios[0].id) === sc.id;
              return (
                <button
                  key={sc.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setSelectedScenarioId(sc.id)}
                  className={`inline-flex h-9 items-center rounded-lg px-3 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] cursor-pointer ${
                    isSelected
                      ? "bg-[#164E9B] text-white shadow-2xs"
                      : "text-muted-foreground hover:bg-card hover:text-foreground"
                  }`}
                >
                  {sc.label}
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* Loading State */}
      {isLoading ? (
        <div
          aria-busy="true"
          aria-label="Đang tải dữ liệu xét tốt nghiệp"
          className="space-y-6 animate-pulse motion-reduce:animate-none"
        >
          <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <div className="h-6 w-72 rounded-lg bg-muted" />
            <div className="h-4 w-full max-w-2xl rounded-md bg-muted/70" />
            <div className="h-3 w-48 rounded-md bg-muted/60" />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="h-56 rounded-2xl border border-border bg-card p-5 space-y-3"
              >
                <div className="flex justify-between">
                  <div className="h-9 w-28 rounded-xl bg-muted" />
                  <div className="h-6 w-20 rounded-full bg-muted" />
                </div>
                <div className="h-5 w-4/5 rounded-md bg-muted" />
                <div className="h-12 rounded-xl bg-muted/70" />
              </div>
            ))}
          </div>
        </div>
      ) : error ? (
        /* Error State */
        <section
          role="alert"
          className="rounded-2xl border border-rose-200 bg-rose-50/60 p-6 space-y-3"
        >
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-rose-200 bg-card text-rose-600">
              <AlertCircle className="size-5" aria-hidden="true" />
            </div>
            <div className="space-y-1">
              <h2 className="text-base font-bold text-rose-950">
                Không thể tải kết quả kiểm tra điều kiện tốt nghiệp
              </h2>
              <p className="text-sm text-rose-800">{error}</p>
            </div>
          </div>

          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-rose-300 bg-card px-4 text-xs font-semibold text-rose-800 transition-colors hover:bg-rose-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 cursor-pointer"
            >
              <RefreshCw className="size-3.5" aria-hidden="true" />
              <span>Thử lại</span>
            </button>
          )}
        </section>
      ) : !activeOverview || activeOverview.dieuKienList.length === 0 ? (
        /* Empty State */
        <section className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center">
          <div className="flex size-12 items-center justify-center rounded-2xl border border-border bg-muted/40 text-muted-foreground">
            <GraduationCap className="size-6" aria-hidden="true" />
          </div>
          <h2 className="mt-4 text-base font-bold text-foreground">
            Chưa có dữ liệu đối soát điều kiện tốt nghiệp
          </h2>
          <p className="mt-1.5 max-w-md text-xs leading-relaxed text-muted-foreground sm:text-sm">
            Hệ thống sẽ cập nhật bảng đối soát 06 điều kiện công nhận học vị Tiến sĩ
            sau khi hồ sơ đào tạo của bạn được Phòng Đào tạo Sau Đại học đồng bộ.
          </p>
        </section>
      ) : (
        <>
          <GraduationOverviewCard overview={activeOverview} />
          <GraduationConditions
            conditions={activeOverview.dieuKienList}
            onPreviewDocument={handlePreviewDocument}
          />
        </>
      )}

      <PdfViewer
        isOpen={Boolean(activePdf)}
        onClose={() => setActivePdf(null)}
        fileUrl={activePdf?.fileUrl}
        fileName={activePdf?.fileName}
        title={activePdf?.title}
        subtitle={activePdf?.subtitle}
        allowDownload={true}
      />
    </div>
  );
}

export default GraduationWorkspace;
