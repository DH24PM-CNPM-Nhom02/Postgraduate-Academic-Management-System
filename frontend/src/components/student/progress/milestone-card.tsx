"use client";

import React, { useState } from "react";
import {
  Lock,
  Unlock,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  UploadCloud,
  RefreshCw,
  Award,
  Info,
} from "lucide-react";
import type {
  MilestoneProgressItem,
  EvidenceItem,
} from "@/src/types/ui/progress";
import { SubmitEvidenceDialog } from "./submit-evidence-dialog";
import { EvidenceHistory } from "./evidence-history";
import { DocumentViewButton } from "./document-view-button";
import { EvaluationReviewsSection } from "./evaluation-reviews-section";

export interface MilestoneCardProps {
  milestone: MilestoneProgressItem;
  onUpdateMilestone?: (updated: MilestoneProgressItem) => void;
}

export function MilestoneCard({
  milestone,
  onUpdateMilestone,
}: MilestoneCardProps) {
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);

  const formatDateStr = (isoString?: string): string => {
    if (!isoString) return "--/--/----";
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return isoString;
      const day = String(d.getUTCDate()).padStart(2, "0");
      const month = String(d.getUTCMonth() + 1).padStart(2, "0");
      const year = d.getUTCFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return isoString;
    }
  };

  const handleSubmitSuccess = (submission: {
    id?: string;
    fileName: string;
    fileSize: number;
    ghiChuNcs: string;
    lanNop: number;
    fileId?: string;
    ngayNop?: string;
  }) => {
    const fallbackTimestamp = Date.now();
    const resolvedId = submission.id ?? `ev-${fallbackTimestamp}`;
    const resolvedFileId = submission.fileId ?? `file-${fallbackTimestamp}`;
    const resolvedNgayNop = submission.ngayNop ?? new Date().toISOString();

    const newEvidence: EvidenceItem = {
      id: resolvedId,
      lanNop: submission.lanNop,
      fileId: resolvedFileId,
      fileName: submission.fileName,
      fileSize: submission.fileSize,
      ghiChuNcs: submission.ghiChuNcs,
      trangThai: "PENDING_REVIEW",
      ngayNop: resolvedNgayNop,
    };

    const existingHistory = milestone.lichSuMinhChung || [];
    const hasAlready = existingHistory.some((ev) => ev.id === newEvidence.id);

    const updated: MilestoneProgressItem = {
      ...milestone,
      trangThai: "PENDING_REVIEW",
      coTheNop: false,
      minhChungHienTai: newEvidence,
      lichSuMinhChung: hasAlready
        ? existingHistory
        : [...existingHistory, newEvidence],
    };

    onUpdateMilestone?.(updated);
  };

  const isLocked = milestone.trangThai === "LOCKED";
  const isUnlocked = milestone.trangThai === "UNLOCKED";
  const isPending = milestone.trangThai === "PENDING_REVIEW";
  const isRejected = milestone.trangThai === "REJECTED";
  const isPassed = milestone.trangThai === "PASSED";
  const isMilestone1 = milestone.thuTu === 1;
  const isMilestone8 = milestone.thuTu === 8;

  const renderStatusBadge = () => {
    if (isPassed) {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 shadow-2xs">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
          Đã hoàn thành
        </span>
      );
    }
    if (isRejected) {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 shadow-2xs">
          <AlertCircle className="h-3.5 w-3.5 text-rose-600" />
          Yêu cầu hoàn thiện lại
        </span>
      );
    }
    if (isPending) {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 shadow-2xs">
          <Clock className="h-3.5 w-3.5 text-amber-600" />
          Đang chờ duyệt
        </span>
      );
    }
    if (isUnlocked) {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#164E9B]/25 bg-[#164E9B]/10 px-3 py-1 text-xs font-semibold text-[#164E9B] shadow-2xs">
          <Unlock className="h-3.5 w-3.5 text-[#164E9B]" />
          Sẵn sàng nộp minh chứng
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
        <Lock className="h-3.5 w-3.5 text-muted-foreground" />
        Đang khóa theo tiến trình
      </span>
    );
  };

  return (
    <article
      id={`milestone-card-${milestone.thuTu}`}
      className={`relative scroll-mt-24 overflow-hidden rounded-xl border transition-colors duration-200 ${
        isLocked
          ? "border-border bg-muted/35"
          : isRejected
            ? "border-rose-300 bg-card shadow-2xs"
            : isPending
              ? "border-amber-300 bg-card shadow-2xs"
              : isPassed
                ? "border-emerald-200 bg-card shadow-2xs"
                : "border-[#164E9B]/35 bg-card shadow-2xs"
      }`}
    >
      <div className="space-y-4 p-5 sm:p-6">
        {/* Top bar: Thứ tự mốc & Badge trạng thái */}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start gap-3.5">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border font-mono text-sm font-bold tracking-tight ${
                isPassed
                  ? "border-emerald-600 bg-emerald-600 text-white"
                  : isRejected
                    ? "border-rose-600 bg-rose-600 text-white"
                    : isPending
                      ? "border-amber-500 bg-amber-500 text-white"
                      : isUnlocked
                        ? "border-[#164E9B] bg-[#164E9B] text-white"
                        : "border-border bg-muted font-semibold text-muted-foreground"
              }`}
            >
              {String(milestone.thuTu).padStart(2, "0")}
            </div>

            <div className="space-y-1">
              <h3
                className={`text-base font-bold leading-snug tracking-tight sm:text-lg ${
                  isLocked
                    ? "font-semibold text-muted-foreground"
                    : "text-foreground"
                }`}
              >
                {milestone.tenMoc}
              </h3>

              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-[11px] font-semibold text-foreground">
                  Mốc {milestone.thuTu}/9
                </span>
                {milestone.thoiGianDuKien && (
                  <span className="rounded-md bg-muted px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
                    {milestone.thoiGianDuKien}
                  </span>
                )}
                {milestone.yeuCauDiem && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-[#164E9B]/10 px-2 py-0.5 font-mono text-[11px] font-medium text-[#164E9B]">
                    <Award className="h-3 w-3 text-[#164E9B]" />
                    Có chấm điểm
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="shrink-0">{renderStatusBadge()}</div>
        </div>

        {/* Mô tả chi tiết mốc */}
        {milestone.moTa && (
          <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
            {milestone.moTa}
          </p>
        )}

        {/* Thông báo quy định riêng biệt của Mốc 8 */}
        {isMilestone8 && (
          <div className="flex items-start gap-3 rounded-xl bg-[#164E9B]/8 p-4 text-[#0F2744]">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#164E9B]" />
            <div className="space-y-0.5 text-xs">
              <span className="font-bold text-[#164E9B]">
                Lưu ý quan trọng cho Mốc 8:
              </span>
              <p className="font-medium leading-relaxed text-foreground">
                Bạn cần gộp tất cả các bài báo khoa học thành 1 file PDF duy nhất
                trước khi nộp.
              </p>
            </div>
          </div>
        )}

        {/* Mốc 1 (Hoàn thành khi nhập học) */}
        {isMilestone1 && (
          <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-3.5 text-foreground">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div className="text-xs">
              <p className="font-semibold text-foreground">
                {milestone.ghiChuHeThong || "Đã hoàn thành khi nhập học"}
              </p>
              <p className="mt-0.5 text-muted-foreground">
                Mốc này được công nhận tự động theo Quyết định trúng tuyển & tiếp
                nhận nghiên cứu sinh của Trường Đại học An Giang.
              </p>
            </div>
          </div>
        )}

        {/* Mốc bị khóa */}
        {isLocked && !isMilestone1 && (
          <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-3.5 text-muted-foreground">
            <Lock className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="text-xs font-medium">
              Hoàn thành mốc trước để mở khóa mốc này theo quy chế đào tạo tiến sĩ
              (BR-08).
            </span>
          </div>
        )}

        {/* Mốc đã đạt */}
        {isPassed && !isMilestone1 && (
          <div className="space-y-2.5 rounded-xl bg-emerald-50/70 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-emerald-900">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                <span>
                  Đã được Giáo vụ SĐH thẩm định & xác nhận hoàn thành ngày{" "}
                  <strong>{formatDateStr(milestone.ngayHoanThanh)}</strong>.
                </span>
              </div>

              {milestone.yeuCauDiem && milestone.diemTrungBinh !== undefined && (
                <div className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-100 px-3 py-1 font-mono text-xs font-bold text-emerald-950">
                  <Award className="h-3.5 w-3.5 text-emerald-700" />
                  <span>
                    Điểm TB: {Number(milestone.diemTrungBinh).toFixed(1)} / 10.0
                  </span>
                </div>
              )}
            </div>

            {milestone.minhChungHienTai && (
              <div className="flex items-center justify-between gap-2 rounded-lg bg-card p-2.5 text-xs">
                <div className="flex min-w-0 items-center gap-2">
                  <FileText className="h-4 w-4 shrink-0 text-emerald-700" />
                  <span className="truncate font-medium text-foreground">
                    {milestone.minhChungHienTai.fileName}
                  </span>
                </div>
                <DocumentViewButton
                  fileId={milestone.minhChungHienTai.fileId}
                  fileName={milestone.minhChungHienTai.fileName}
                  fileUrl={milestone.minhChungHienTai.fileUrl}
                  size="sm"
                  variant="outline"
                  showLabel={true}
                />
              </div>
            )}
          </div>
        )}

        {/* Bị từ chối */}
        {isRejected && (
          <div className="space-y-3.5">
            <div className="space-y-1.5 rounded-xl bg-rose-50/80 p-4 text-rose-950">
              <div className="flex items-center gap-2 text-xs font-semibold text-rose-800">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                <span>Hồ sơ nộp chưa đạt yêu cầu từ Giáo vụ</span>
              </div>
              <p className="pl-6 text-xs font-medium italic leading-relaxed text-rose-900">
                &ldquo;
                {milestone.lyDoTuChoi ||
                  "Hồ sơ chưa đầy đủ tài liệu theo quy định."}
                &rdquo;
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <p className="text-xs text-muted-foreground">
                {milestone.coTheNop
                  ? "Vui lòng bổ sung chữ ký/tài liệu và nộp lại bản minh chứng đã hoàn thiện."
                  : "Chức năng nộp lại minh chứng tạm thời bị khóa cho đến khi được mở lại."}
              </p>
              <button
                type="button"
                disabled={!milestone.coTheNop}
                onClick={() => setIsSubmitDialogOpen(true)}
                className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg bg-[#164E9B] px-4 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-[#113E7D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Nộp lại minh chứng</span>
              </button>
            </div>
          </div>
        )}

        {/* Đang chờ duyệt */}
        {isPending && (
          <div className="space-y-2.5 rounded-xl bg-amber-50/75 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-amber-950">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 shrink-0 text-amber-600" />
                <span>
                  Đã gửi ngày{" "}
                  <strong>
                    {formatDateStr(milestone.minhChungHienTai?.ngayNop)}
                  </strong>
                  . Hồ sơ đang nằm trong hàng chờ xét duyệt của Giáo vụ SĐH.
                </span>
              </div>
            </div>

            {milestone.minhChungHienTai && (
              <div className="flex items-center justify-between gap-2 rounded-lg bg-card p-2.5 text-xs">
                <div className="flex min-w-0 items-center gap-2.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-amber-100 text-amber-700">
                    <FileText className="h-3.5 w-3.5" />
                  </div>
                  <span className="truncate font-medium text-foreground">
                    {milestone.minhChungHienTai.fileName}
                  </span>
                </div>

                <DocumentViewButton
                  fileId={milestone.minhChungHienTai.fileId}
                  fileName={milestone.minhChungHienTai.fileName}
                  fileUrl={milestone.minhChungHienTai.fileUrl}
                  size="sm"
                  variant="outline"
                  showLabel={true}
                />
              </div>
            )}
          </div>
        )}

        {/* Sẵn sàng nộp */}
        {isUnlocked && (
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <p className="text-xs text-muted-foreground">
              {milestone.coTheNop
                ? "Mốc đã mở khóa theo tiến trình. Vui lòng chuẩn bị và nộp minh chứng bản scan PDF (≤ 15MB)."
                : "Mốc đã mở nhưng hiện chưa được phép nộp minh chứng mới."}
            </p>
            <button
              type="button"
              disabled={!milestone.coTheNop}
              onClick={() => setIsSubmitDialogOpen(true)}
              className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg bg-[#164E9B] px-4 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-[#113E7D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none"
            >
              <UploadCloud className="h-4 w-4" />
              <span>Nộp minh chứng</span>
            </button>
          </div>
        )}

        {/* Kết quả đánh giá / Phiếu nhận xét của Hội đồng */}
        {milestone.yeuCauDiem && (
          <EvaluationReviewsSection
            yeuCauDiem={milestone.yeuCauDiem}
            thuTuMoc={milestone.thuTu}
            diemTrungBinh={milestone.diemTrungBinh}
            phieuNhanXets={milestone.phieuNhanXets}
          />
        )}

        {/* Lịch sử các lần nộp */}
        <EvidenceHistory
          history={milestone.lichSuMinhChung || []}
          defaultOpen={isRejected}
        />
      </div>

      {/* Dialog nộp minh chứng */}
      <SubmitEvidenceDialog
        isOpen={isSubmitDialogOpen}
        onClose={() => setIsSubmitDialogOpen(false)}
        milestone={milestone}
        onSubmitSuccess={handleSubmitSuccess}
      />
    </article>
  );
}
