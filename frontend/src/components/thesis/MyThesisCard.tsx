"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  BookOpen,
  Building2,
  Calendar,
  CheckCircle2,
  FileEdit,
  FileText,
  FileX2,
  RefreshCw,
  ScrollText,
  XCircle,
} from "lucide-react";
import type { ThesisItem, ThesisStatus } from "@/src/types/ui/thesis";
import { PdfViewer } from "@/src/components/upload/PdfViewer";
import { DeadlineCountdown } from "@/src/components/shared/DeadlineCountdown";

export interface MyThesisCardProps {
  /** Dữ liệu đề tài luận án hiện tại của NCS */
  thesis: ThesisItem | null;
  /** Thời hạn đào tạo tối đa 72 tháng (ISO string) */
  trainingDeadline?: string;
  /** Trạng thái đang tải dữ liệu */
  isLoading?: boolean;
  /** Thông báo lỗi khi tải dữ liệu thất bại */
  error?: string | null;
  /** Callback thử lại khi gặp lỗi */
  onRetry?: () => void;
  /** Đường dẫn tới màn hình gửi đơn đề nghị điều chỉnh đề tài */
  changeRequestHref?: string;
  /** Callback tùy chọn khi bấm nút đề nghị điều chỉnh đề tài */
  onRequestChange?: () => void;
  /** Class CSS bổ sung */
  className?: string;
}

function formatDateVi(iso?: string): string {
  if (!iso) return "--/--/----";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const day = String(d.getUTCDate()).padStart(2, "0");
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const year = d.getUTCFullYear();
  return `${day}/${month}/${year}`;
}

function getStatusBadge(status: ThesisStatus) {
  switch (status) {
    case "HIEU_LUC":
      return {
        label: "Đang hiệu lực",
        classes: "border-emerald-200 bg-emerald-50 text-emerald-800",
        Icon: CheckCircle2,
      };
    case "DA_THAY_THE":
      return {
        label: "Đã thay thế",
        classes: "border-amber-200 bg-amber-50 text-amber-800",
        Icon: RefreshCw,
      };
    case "DA_HUY":
    default:
      return {
        label: "Đã hủy",
        classes: "border-rose-200 bg-rose-50 text-rose-800",
        Icon: XCircle,
      };
  }
}

/**
 * MyThesisCard
 *
 * Hiển thị thông tin chi tiết đề tài luận án tiến sĩ hiện tại của NCS,
 * thông tin Quyết định giao đề tài và mở trình xem PDF Quyết định (`PdfViewer`).
 * Hỗ trợ đầy đủ trạng thái `isLoading`, `error`, `empty`.
 */
export function MyThesisCard({
  thesis,
  trainingDeadline,
  isLoading = false,
  error = null,
  onRetry,
  changeRequestHref = "/student/extensions",
  onRequestChange,
  className = "",
}: MyThesisCardProps) {
  const [viewerOpen, setViewerOpen] = useState(false);

  if (isLoading) {
    return (
      <section
        aria-busy="true"
        aria-label="Đang tải thông tin đề tài luận án"
        className={`rounded-2xl border border-border bg-card p-6 sm:p-7 animate-pulse motion-reduce:animate-none space-y-5 ${className}`}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="h-6 w-48 rounded-lg bg-muted" />
          <div className="h-6 w-28 rounded-full bg-muted" />
        </div>
        <div className="space-y-2.5">
          <div className="h-6 w-11/12 rounded-md bg-muted" />
          <div className="h-4 w-4/5 rounded-md bg-muted/70" />
        </div>
        <div className="grid grid-cols-1 gap-3 border-t border-border pt-4 sm:grid-cols-3">
          <div className="h-12 rounded-lg bg-muted/70" />
          <div className="h-12 rounded-lg bg-muted/70" />
          <div className="h-12 rounded-lg bg-muted/70" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section
        role="alert"
        className={`rounded-2xl border border-rose-200 bg-card p-6 sm:p-7 ${className}`}
      >
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-rose-200 bg-rose-50 text-rose-700">
              <AlertCircle className="size-5" aria-hidden="true" />
            </div>
            <div className="space-y-1">
              <h2 className="text-base font-bold text-foreground">
                Không thể tải thông tin đề tài luận án
              </h2>
              <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
                {error}
              </p>
            </div>
          </div>

          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg bg-[#164E9B] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#113E7D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] cursor-pointer"
            >
              <RefreshCw className="size-3.5" aria-hidden="true" />
              <span>Thử lại</span>
            </button>
          )}
        </div>
      </section>
    );
  }

  if (!thesis) {
    return (
      <section
        className={`rounded-2xl border border-dashed border-border bg-card p-8 text-center ${className}`}
      >
        <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-muted text-muted-foreground">
          <FileX2 className="size-6" aria-hidden="true" />
        </div>
        <h2 className="mt-3 text-base font-bold text-foreground">
          Chưa có đề tài luận án được phê duyệt
        </h2>
        <p className="mx-auto mt-1.5 max-w-md text-xs leading-relaxed text-muted-foreground sm:text-sm">
          Hồ sơ của bạn hiện chưa ghi nhận Quyết định giao đề tài chính thức. Sau khi Phòng
          Đào tạo Sau Đại học ban hành quyết định ở Mốc 1, thông tin đề tài sẽ hiển thị tại đây.
        </p>
      </section>
    );
  }

  const badge = getStatusBadge(thesis.trangThai);
  const BadgeIcon = badge.Icon;

  return (
    <>
      <section
        aria-label="Đề tài luận án hiện tại"
        className={`overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-xs ${className}`}
      >
        <div className="h-1 w-full bg-[#164E9B]" />

        <div className="space-y-5 p-6 sm:p-7">
          {/* Header card: tên mục & trạng thái hiệu lực */}
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 text-[#164E9B]">
                <BookOpen className="size-5" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#0F2744] sm:text-lg">
                  Đề tài luận án chính thức
                </h2>
                <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  {thesis.maDeTai && (
                    <span className="font-mono font-semibold text-foreground">
                      {thesis.maDeTai}
                    </span>
                  )}
                  {thesis.maDeTai && <span aria-hidden="true">•</span>}
                  <span>
                    Chuyên ngành:{" "}
                    <strong className="font-semibold text-foreground">
                      {thesis.chuyenNganh}
                    </strong>
                    {thesis.maNganh ? ` (${thesis.maNganh})` : ""}
                  </span>
                </div>
              </div>
            </div>

            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${badge.classes}`}
            >
              <BadgeIcon className="size-3.5" aria-hidden="true" />
              <span>{badge.label}</span>
            </span>
          </div>

          {/* Tên đề tài tiếng Việt & tiếng Anh */}
          <div className="space-y-2 border-t border-border pt-4">
            <h3 className="text-lg font-bold leading-snug text-foreground sm:text-xl">
              {thesis.tenDeTaiTiengViet}
            </h3>
            {thesis.tenDeTaiTiengAnh && (
              <p className="text-sm italic leading-relaxed text-muted-foreground">
                {thesis.tenDeTaiTiengAnh}
              </p>
            )}
            {thesis.moTaNgan && (
              <p className="pt-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                {thesis.moTaNgan}
              </p>
            )}
          </div>

          {/* Thông tin Quyết định giao đề tài */}
          <dl className="grid grid-cols-1 gap-4 border-t border-border pt-4 text-xs sm:grid-cols-3 sm:text-sm">
            <div className="flex items-start gap-2.5">
              <ScrollText
                className="mt-0.5 size-4 shrink-0 text-[#164E9B]"
                aria-hidden="true"
              />
              <div>
                <dt className="text-xs text-muted-foreground">
                  Số Quyết định giao
                </dt>
                <dd className="mt-0.5 font-mono font-bold text-foreground">
                  {thesis.quyetDinh.soQuyetDinh}
                </dd>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Calendar
                className="mt-0.5 size-4 shrink-0 text-[#164E9B]"
                aria-hidden="true"
              />
              <div>
                <dt className="text-xs text-muted-foreground">Ngày ký / Hiệu lực</dt>
                <dd className="mt-0.5 font-mono font-semibold tabular-nums text-foreground">
                  {formatDateVi(thesis.quyetDinh.ngayKy)}
                </dd>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Building2
                className="mt-0.5 size-4 shrink-0 text-[#164E9B]"
                aria-hidden="true"
              />
              <div>
                <dt className="text-xs text-muted-foreground">Đơn vị ban hành</dt>
                <dd className="mt-0.5 font-medium text-foreground">
                  {thesis.quyetDinh.coQuanBanHanh ||
                    "Trường Đại học An Giang - ĐHQG-HCM"}
                </dd>
              </div>
            </div>
          </dl>

          {/* Thanh hành động & thời hạn 72 tháng */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => setViewerOpen(true)}
                className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#164E9B] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#113E7D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] focus-visible:ring-offset-2 cursor-pointer"
              >
                <FileText className="size-4" aria-hidden="true" />
                <span>Xem PDF Quyết định</span>
              </button>

              {onRequestChange ? (
                <button
                  type="button"
                  onClick={onRequestChange}
                  className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-4 text-xs font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] cursor-pointer"
                >
                  <FileEdit className="size-4 text-[#164E9B]" aria-hidden="true" />
                  <span>Đề nghị điều chỉnh đề tài</span>
                </button>
              ) : (
                <Link
                  href={changeRequestHref}
                  className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-4 text-xs font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B]"
                >
                  <FileEdit className="size-4 text-[#164E9B]" aria-hidden="true" />
                  <span>Đề nghị điều chỉnh đề tài</span>
                </Link>
              )}
            </div>

            {trainingDeadline && (
              <DeadlineCountdown
                targetDate={trainingDeadline}
                label="Hạn 72 tháng"
                variant="badge"
              />
            )}
          </div>
        </div>
      </section>

      <PdfViewer
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
        fileUrl={thesis.quyetDinh.fileUrl}
        fileName={thesis.quyetDinh.fileName}
        title={`Quyết định ${thesis.quyetDinh.soQuyetDinh}`}
        subtitle={`Ngày ký ${formatDateVi(thesis.quyetDinh.ngayKy)} • Đề tài luận án Tiến sĩ`}
        allowDownload={true}
      />
    </>
  );
}

export default MyThesisCard;
