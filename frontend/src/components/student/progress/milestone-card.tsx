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
import { MilestoneProgressItem, EvidenceItem } from "@/src/types/progress";
import { SubmitEvidenceDialog } from "./submit-evidence-dialog";
import { EvidenceHistory } from "./evidence-history";
import { DocumentViewButton } from "./document-view-button";

interface MilestoneCardProps {
  milestone: MilestoneProgressItem;
  onUpdateMilestone?: (updated: MilestoneProgressItem) => void;
}

export function MilestoneCard({
  milestone: initialMilestone,
  onUpdateMilestone,
}: MilestoneCardProps) {
  const [milestone, setMilestone] = useState<MilestoneProgressItem>(initialMilestone);
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);

  // Format ngày dd/MM/yyyy
  const formatDateStr = (isoString?: string): string => {
    if (!isoString) return "--/--/----";
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return isoString;
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return isoString;
    }
  };

  // Callback khi submit thành công từ dialog
  const handleSubmitSuccess = (submission: {
    fileName: string;
    fileSize: number;
    ghiChuNcs: string;
    lanNop: number;
  }) => {
    const newEvidence: EvidenceItem = {
      id: `ev-${Date.now()}`,
      lanNop: submission.lanNop,
      fileId: `file-${Date.now()}`,
      fileName: submission.fileName,
      fileSize: submission.fileSize,
      ghiChuNcs: submission.ghiChuNcs,
      trangThai: "PENDING_REVIEW",
      ngayNop: new Date().toISOString(),
    };

    const updated: MilestoneProgressItem = {
      ...milestone,
      trangThai: "PENDING_REVIEW",
      coTheNop: false,
      minhChungHienTai: newEvidence,
      lichSuMinhChung: [newEvidence, ...(milestone.lichSuMinhChung || [])],
    };

    setMilestone(updated);
    if (onUpdateMilestone) {
      onUpdateMilestone(updated);
    }
  };

  const isLocked = milestone.trangThai === "LOCKED";
  const isUnlocked = milestone.trangThai === "UNLOCKED";
  const isPending = milestone.trangThai === "PENDING_REVIEW";
  const isRejected = milestone.trangThai === "REJECTED";
  const isPassed = milestone.trangThai === "PASSED";
  const isMilestone1 = milestone.thuTu === 1;
  const isMilestone8 = milestone.thuTu === 8;

  // Header status badge
  const renderStatusBadge = () => {
    if (isPassed) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          Đã hoàn thành
        </span>
      );
    }
    if (isRejected) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 shadow-2xs">
          <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
          Yêu cầu hoàn thiện lại
        </span>
      );
    }
    if (isPending) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 shadow-2xs">
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          Đang chờ duyệt
        </span>
      );
    }
    if (isUnlocked) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs">
          <Unlock className="w-3.5 h-3.5 text-blue-600" />
          Sẵn sàng nộp minh chứng
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-500 border border-slate-200">
        <Lock className="w-3.5 h-3.5 text-slate-400" />
        Đang khóa theo tiến trình
      </span>
    );
  };

  return (
    <article
      id={`milestone-card-${milestone.thuTu}`}
      className={`relative rounded-2xl border transition-all duration-200 scroll-mt-24 overflow-hidden ${
        isLocked
          ? "bg-slate-50/70 border-slate-200/80 shadow-2xs"
          : isRejected
          ? "bg-white border-rose-300 shadow-xs hover:border-rose-400"
          : isPending
          ? "bg-white border-amber-300 shadow-xs hover:border-amber-400"
          : isPassed
          ? "bg-white border-emerald-200/90 shadow-xs hover:border-emerald-300"
          : "bg-white border-blue-300 shadow-xs hover:border-blue-400"
      }`}
    >
      {/* Accent strip trên đầu thẻ */}
      <div
        className={`h-1 w-full ${
          isPassed
            ? "bg-emerald-600"
            : isRejected
            ? "bg-rose-500"
            : isPending
            ? "bg-amber-500"
            : isUnlocked
            ? "bg-blue-600"
            : "bg-slate-200"
        }`}
      />

      <div className="p-6 sm:p-7 space-y-4">
        {/* Top bar: Thứ tự mốc & Badge trạng thái */}
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3.5">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm tracking-tight border shadow-2xs shrink-0 font-mono ${
                isPassed
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : isRejected
                  ? "bg-rose-600 text-white border-rose-600 ring-2 ring-rose-400/20"
                  : isPending
                  ? "bg-amber-500 text-white border-amber-500 ring-2 ring-amber-400/20"
                  : isUnlocked
                  ? "bg-blue-600 text-white border-blue-600 ring-2 ring-blue-400/20"
                  : "bg-slate-100 text-slate-400 border-slate-200 font-semibold"
              }`}
            >
              0{milestone.thuTu}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Mốc {milestone.thuTu} / 9
                </span>
                {milestone.thoiGianDuKien && (
                  <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/50">
                    {milestone.thoiGianDuKien}
                  </span>
                )}
                {milestone.yeuCauDiem && (
                  <span className="text-[11px] font-medium text-indigo-700 bg-indigo-50 border border-indigo-200/60 px-2 py-0.5 rounded-md flex items-center gap-1 font-mono">
                    <Award className="w-3 h-3 text-indigo-600" />
                    Có chấm điểm
                  </span>
                )}
              </div>
              <h3
                className={`text-base sm:text-lg font-bold tracking-tight leading-snug mt-0.5 ${
                  isLocked ? "text-slate-700 font-semibold" : "text-slate-900"
                }`}
              >
                {milestone.tenMoc}
              </h3>
            </div>
          </div>

          <div className="shrink-0">{renderStatusBadge()}</div>
        </div>

        {/* Mô tả chi tiết mốc */}
        {milestone.moTa && (
          <p
            className={`text-xs leading-relaxed ${
              isLocked ? "text-slate-500" : "text-slate-600"
            }`}
          >
            {milestone.moTa}
          </p>
        )}

        {/* Thông báo quy định riêng biệt của Mốc 8 */}
        {isMilestone8 && (
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3 text-amber-950">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs space-y-0.5">
              <span className="font-semibold text-amber-950">
                Lưu ý quan trọng cho Mốc 8:{" "}
              </span>
              <span className="text-amber-800 leading-relaxed font-normal">
                Mốc này chỉ nộp duy nhất 01 file PDF gộp toàn bộ bài báo công bố và
                tài liệu minh chứng chỉ số WoS/Scopus tương ứng theo danh mục phê duyệt.
              </span>
            </div>
          </div>
        )}

        {/* Trường hợp đặc thù 1: MỐC 1 (Đã hoàn thành khi nhập học) */}
        {isMilestone1 && (
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-3 text-slate-700">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="text-xs">
              <p className="font-semibold text-slate-900">
                {milestone.ghiChuHeThong || "Đã hoàn thành khi nhập học"}
              </p>
              <p className="text-slate-500 mt-0.5">
                Mốc này được công nhận tự động theo Quyết định trúng tuyển & tiếp nhận
                nghiên cứu sinh của Trường Đại học An Giang.
              </p>
            </div>
          </div>
        )}

        {/* Trường hợp đặc thù 2: MỐC BỊ KHÓA (LOCKED) */}
        {isLocked && !isMilestone1 && (
          <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 flex items-center gap-3 text-slate-600 shadow-2xs">
            <Lock className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="text-xs font-medium">
              Hoàn thành mốc trước để mở khóa mốc này theo quy chế đào tạo tiến sĩ (BR-08).
            </span>
          </div>
        )}

        {/* Trường hợp đặc thù 3: MỐC ĐÃ ĐẠT (PASSED) */}
        {isPassed && !isMilestone1 && (
          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200/80 space-y-2.5">
            <div className="flex items-center justify-between flex-wrap gap-2 text-xs text-emerald-900">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Đã được Giáo vụ SĐH thẩm định & xác nhận hoàn thành ngày{" "}
                  <strong>{formatDateStr(milestone.ngayHoanThanh || "2024-04-15")}</strong>.
                </span>
              </div>

              {/* Nếu mốc yêu cầu điểm (mốc 2, 4, 5) -> Hiển thị Điểm trung bình format 1 chữ số thập phân */}
              {milestone.yeuCauDiem && milestone.diemTrungBinh && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-100/90 text-emerald-950 font-bold text-xs shadow-2xs border border-emerald-200/80 font-mono">
                  <Award className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Điểm TB: {Number(milestone.diemTrungBinh).toFixed(1)} / 10.0</span>
                </div>
              )}
            </div>

            {/* Minh chứng đã duyệt của mốc PASSED */}
            {milestone.minhChungHienTai && (
              <div className="mt-2 flex items-center justify-between gap-2 p-2.5 bg-white/95 rounded-lg border border-emerald-200/80 text-xs shadow-2xs">
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span className="truncate font-medium text-slate-800">
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

        {/* Trường hợp đặc thù 4: BỊ TỪ CHỐI (REJECTED) */}
        {isRejected && (
          <div className="space-y-3.5">
            {/* Alert box màu rose hiển thị nổi bật lyDoTuChoi */}
            <div className="p-4 rounded-xl bg-rose-50/80 border border-rose-200 text-rose-950 space-y-1.5">
              <div className="flex items-center gap-2 text-rose-800 font-semibold text-xs">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Hồ sơ nộp chưa đạt yêu cầu từ Giáo vụ</span>
              </div>
              <p className="text-xs text-rose-900 leading-relaxed pl-6 font-medium italic">
                &ldquo;{milestone.lyDoTuChoi || "Hồ sơ chưa đầy đủ tài liệu theo quy định."}&rdquo;
              </p>
            </div>

            {/* Nút nộp lại khi coTheNop === true */}
            {milestone.coTheNop && (
              <div className="flex items-center justify-between gap-3 pt-1 flex-wrap">
                <p className="text-xs text-slate-500">
                  Vui lòng bổ sung chữ ký/tài liệu và nộp lại bản minh chứng đã hoàn thiện.
                </p>
                <button
                  type="button"
                  onClick={() => setIsSubmitDialogOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-[0.98] text-white text-xs font-semibold shadow-xs shadow-rose-900/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-rose-500 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Nộp lại minh chứng</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Trường hợp đặc thù 5: ĐANG CHỜ DUYỆT (PENDING_REVIEW) */}
        {isPending && (
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-2.5">
            <div className="flex items-center justify-between flex-wrap gap-2 text-xs text-amber-900">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  Đã gửi lúc{" "}
                  <strong>
                    {formatDateStr(milestone.minhChungHienTai?.ngayNop || new Date().toISOString())}
                  </strong>
                  . Hồ sơ đang nằm trong hàng chờ xét duyệt của Giáo vụ SĐH.
                </span>
              </div>
            </div>

            {/* Hiển thị file đã nộp và nút xem */}
            {milestone.minhChungHienTai && (
              <div className="flex items-center justify-between gap-2 p-2.5 bg-white rounded-lg border border-amber-200/80 text-xs shadow-2xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-md bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200/60">
                    <FileText className="w-3.5 h-3.5" />
                  </div>
                  <span className="truncate font-medium text-slate-800">
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

        {/* Trường hợp đặc thù 6: SẴN SÀNG NỘP (UNLOCKED) */}
        {isUnlocked && (
          <div className="flex items-center justify-between gap-3 pt-1 flex-wrap">
            <p className="text-xs text-slate-600">
              Mốc đã mở khóa theo tiến trình. Vui lòng chuẩn bị và nộp minh chứng bản scan PDF (≤ 15MB).
            </p>
            {milestone.coTheNop && (
              <button
                type="button"
                onClick={() => setIsSubmitDialogOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] text-white text-xs font-semibold shadow-xs shadow-emerald-900/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-500 transition-all flex items-center gap-2 cursor-pointer"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Nộp minh chứng</span>
              </button>
            )}
          </div>
        )}

        {/* Lịch sử các lần nộp (EvidenceHistory) */}
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
