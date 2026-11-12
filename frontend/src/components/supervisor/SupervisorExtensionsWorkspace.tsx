"use client";

import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Eye,
  FileText,
  Info,
  RefreshCw,
  ThumbsDown,
  ThumbsUp,
  Users,
  X,
} from "lucide-react";
import { ConfirmDialog } from "@/src/components/shared/ConfirmDialog";
import { PdfViewer } from "@/src/components/upload/PdfViewer";
import type {
  SupervisorExtensionDecisionAction,
  SupervisorExtensionRequestItem,
  SupervisorExtensionsWorkspaceProps,
} from "@/src/types/ui/supervisor";
import {
  formatFileSizeBytes,
  formatSupervisorDateUtc,
  getRoleShortLabel,
  getSupervisorRequestStatusMeta,
} from "./supervisor-ui-helpers";

export type { SupervisorExtensionsWorkspaceProps };

type ExtensionFilterTab = "CHO_GVHD_XAC_NHAN" | "CHO_DUYET" | "DA_XU_LY" | "ALL";

interface PendingConfirmState {
  action: SupervisorExtensionDecisionAction;
  comment: string;
}

interface ReviewDrawerInnerProps {
  request: SupervisorExtensionRequestItem;
  onClose: () => void;
  onOpenPdf: () => void;
  onSubmitReview: (
    requestId: string,
    action: SupervisorExtensionDecisionAction,
    comment: string
  ) => void | Promise<void>;
  isPdfOpen: boolean;
}

function ExtensionReviewDrawerInner({
  request,
  onClose,
  onOpenPdf,
  onSubmitReview,
  isPdfOpen,
}: ReviewDrawerInnerProps) {
  const titleId = useId();
  const commentId = useId();
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const [comment, setComment] = useState(request.nhanXetGvhd ?? "");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [confirmState, setConfirmState] = useState<PendingConfirmState | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canReview = request.trangThai === "CHO_GVHD_XAC_NHAN";
  const statusMeta = getSupervisorRequestStatusMeta(request.trangThai);
  const attachmentSize = formatFileSizeBytes(request.tepDinhKem.fileSize);

  useEffect(() => {
    previousFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(() => {
      closeBtnRef.current?.focus();
    }, 0);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !confirmState && !isPdfOpen && !isSubmitting) {
        event.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocusRef.current?.focus();
    };
  }, [confirmState, isPdfOpen, isSubmitting, onClose]);

  const handleRequestAction = (action: SupervisorExtensionDecisionAction) => {
    const trimmed = comment.trim();
    if (action === "TU_CHOI" && trimmed.length < 10) {
      setValidationError(
        "Vui lòng nhập nhận xét lý do từ chối tối thiểu 10 ký tự để NCS và Giáo vụ nắm thông tin khắc phục."
      );
      return;
    }
    setValidationError(null);
    setConfirmState({
      action,
      comment:
        trimmed ||
        "Đồng ý với lý do gia hạn và kế hoạch hoàn thành luận án trong thời gian đề nghị.",
    });
  };

  const handleConfirmDecision = async () => {
    if (!confirmState) return;
    setIsSubmitting(true);
    try {
      await onSubmitReview(request.id, confirmState.action, confirmState.comment);
      setConfirmState(null);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div
        aria-hidden="true"
        onClick={() => {
          if (!confirmState && !isPdfOpen && !isSubmitting) {
            onClose();
          }
        }}
        className="fixed inset-0 z-40 bg-[#0F2744]/45 backdrop-blur-[1px]"
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-2xl flex-col border-l border-border bg-card shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-[#164E9B]/10 px-2.5 py-0.5 text-xs font-bold tabular-nums text-[#164E9B]">
                {request.maDon}
              </span>
              <span
                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusMeta.badgeClass}`}
              >
                {statusMeta.label}
              </span>
            </div>
            <h2
              id={titleId}
              className="mt-1.5 text-lg font-bold text-[#0F2744]"
            >
              Thẩm định đơn xin gia hạn — {request.hoTenNcs}
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {request.mshv} • {request.khoaDaoTao} • {getRoleShortLabel(request.vaiTroCuaToi)}
            </p>
          </div>

          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label="Đóng bảng thẩm định đơn gia hạn"
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-[#0F2744] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] motion-reduce:transition-none"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
          <div className="rounded-xl bg-[#F0F5FA] p-4">
            <p className="text-xs font-semibold text-muted-foreground">
              Đề tài luận án
            </p>
            <p className="mt-1 text-sm font-semibold leading-relaxed text-[#0F2744]">
              {request.tenDeTai}
            </p>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-lg bg-card p-3">
                <p className="text-[11px] font-medium text-muted-foreground">
                  Thời gian xin gia hạn
                </p>
                <p className="mt-1 text-base font-bold tabular-nums text-[#164E9B]">
                  +{request.soThangGiaHan} tháng
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Đã gia hạn trước: {request.tongThangDaGiaHanTruocDo} tháng
                </p>
              </div>

              <div className="rounded-lg bg-card p-3">
                <p className="text-[11px] font-medium text-muted-foreground">
                  Hạn đào tạo hiện tại
                </p>
                <p className="mt-1 text-sm font-bold tabular-nums text-[#0F2744]">
                  {formatSupervisorDateUtc(request.hanHienTai)}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Dự kiến mới: {formatSupervisorDateUtc(request.hanMoiDuKien)}
                </p>
              </div>

              <div className="rounded-lg bg-card p-3">
                <p className="text-[11px] font-medium text-muted-foreground">
                  Tiến độ 9 mốc hiện nay
                </p>
                <p className="mt-1 text-sm font-bold tabular-nums text-[#0F2744]">
                  Mốc {request.mocHienTai}/9 ({request.tienDoPhanTram}%)
                </p>
                <p className="truncate text-[11px] text-muted-foreground">
                  {request.tenMocHienTai.replace(/^Mốc \d+:\s*/, "")}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-[#0F2744]">
              Lý do & Kế hoạch giải trình của Nghiên cứu sinh
            </h3>
            <p className="mt-1.5 rounded-lg bg-muted/40 p-3.5 text-sm leading-relaxed text-foreground">
              {request.lyDo}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-background p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#164E9B]/10 text-[#164E9B]">
                  <FileText className="size-5" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[#0F2744]">
                    {request.tepDinhKem.fileName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Báo cáo tiến độ kèm đơn gia hạn
                    {attachmentSize ? ` • ${attachmentSize}` : ""}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onOpenPdf}
                className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-lg bg-[#164E9B] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#0F2744] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] motion-reduce:transition-none"
              >
                <Eye className="size-4" aria-hidden="true" />
                <span>Đọc báo cáo PDF</span>
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-[#0F2744]">
              Ý kiến xác nhận của Tập thể GVHD ({request.xacNhanGvhds.length})
            </h3>
            <ul className="mt-2 space-y-2">
              {request.xacNhanGvhds.map((op) => {
                const statusBadge =
                  op.dongY === true
                    ? "bg-emerald-50 text-emerald-700"
                    : op.dongY === false
                    ? "bg-rose-50 text-rose-700"
                    : "bg-amber-50 text-amber-800";
                const statusText =
                  op.dongY === true
                    ? "Đồng ý"
                    : op.dongY === false
                    ? "Không đồng ý"
                    : "Chờ xác nhận";
                return (
                  <li
                    key={op.id}
                    className="rounded-lg bg-muted/40 p-3 text-xs"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-semibold text-[#0F2744]">
                        {op.hocHamHocVi ? `${op.hocHamHocVi} ` : ""}
                        {op.tenGvhd} • {getRoleShortLabel(op.vaiTro)}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 font-semibold ${statusBadge}`}
                      >
                        {statusText}
                      </span>
                    </div>
                    {op.nhanXet && (
                      <p className="mt-1.5 leading-relaxed text-foreground">
                        “{op.nhanXet}”
                      </p>
                    )}
                    {op.thoiGianPhanHoi && (
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        Phản hồi ngày {formatSupervisorDateUtc(op.thoiGianPhanHoi, true)}
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {canReview ? (
            <div className="rounded-xl border border-border bg-card p-4">
              <label
                htmlFor={commentId}
                className="block text-sm font-bold text-[#0F2744]"
              >
                Nhận xét thẩm định của Giảng viên hướng dẫn
              </label>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Đánh giá mức độ hoàn thành nghiên cứu của NCS. Bắt buộc nhập tối thiểu 10 ký tự nếu chọn Từ chối gia hạn.
              </p>

              <textarea
                id={commentId}
                rows={4}
                value={comment}
                onChange={(e) => {
                  setComment(e.target.value);
                  if (validationError) setValidationError(null);
                }}
                placeholder="Nhập nhận xét chuyên môn về tiến độ nghiên cứu và khả năng hoàn thành luận án của NCS..."
                className="mt-2.5 w-full rounded-lg border border-border bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B]"
              />

              {validationError && (
                <p
                  role="alert"
                  className="mt-2 flex items-start gap-1.5 text-xs font-medium text-rose-700"
                >
                  <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  <span>{validationError}</span>
                </p>
              )}
            </div>
          ) : (
            <div className="rounded-lg bg-[#F0F5FA] p-4 text-xs text-[#0F2744]">
              <div className="flex items-center gap-2 font-semibold">
                <Info className="size-4 text-[#164E9B]" aria-hidden="true" />
                <span>Đơn này đã qua bước GVHD thẩm định</span>
              </div>
              {request.nhanXetGvhd && (
                <p className="mt-1.5 leading-relaxed">
                  Nhận xét đã ghi nhận: “{request.nhanXetGvhd}”
                </p>
              )}
              {request.quyetDinh && (
                <p className="mt-1.5 font-semibold text-emerald-700">
                  Quyết định ban hành: {request.quyetDinh.soQuyetDinh} (Ngày{" "}
                  {formatSupervisorDateUtc(request.quyetDinh.ngayKy)})
                </p>
              )}
              {request.lyDoTuChoi && (
                <p className="mt-1.5 font-medium text-rose-700">
                  Lý do từ chối: {request.lyDoTuChoi}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-muted/20 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-10 items-center rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] motion-reduce:transition-none"
          >
            Đóng
          </button>

          {canReview && (
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => handleRequestAction("TU_CHOI")}
                className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-rose-300 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition-colors hover:bg-rose-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 motion-reduce:transition-none"
              >
                <ThumbsDown className="size-4" aria-hidden="true" />
                <span>Từ chối gia hạn</span>
              </button>

              <button
                type="button"
                onClick={() => handleRequestAction("DONG_Y")}
                className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#164E9B] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#0F2744] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] focus-visible:ring-offset-2 motion-reduce:transition-none"
              >
                <ThumbsUp className="size-4" aria-hidden="true" />
                <span>Đồng ý gia hạn</span>
              </button>
            </div>
          )}
        </div>
      </section>

      <ConfirmDialog
        isOpen={confirmState !== null}
        onClose={() => !isSubmitting && setConfirmState(null)}
        onConfirm={() => void handleConfirmDecision()}
        variant={confirmState?.action === "TU_CHOI" ? "destructive" : "info"}
        title={
          confirmState?.action === "TU_CHOI"
            ? `Xác nhận từ chối đơn gia hạn ${request.maDon}`
            : `Xác nhận đồng ý gia hạn ${request.maDon}`
        }
        description={
          confirmState?.action === "TU_CHOI"
            ? `Đơn xin gia hạn +${request.soThangGiaHan} tháng của NCS ${request.hoTenNcs} sẽ được trả về trạng thái Từ chối kèm nhận xét chuyên môn của Giảng viên.`
            : `Ý kiến đồng ý gia hạn +${request.soThangGiaHan} tháng (đến ${formatSupervisorDateUtc(
                request.hanMoiDuKien
              )}) cho NCS ${request.hoTenNcs} sẽ được ghi nhận và chuyển Phòng Đào tạo Sau đại học xem xét phê duyệt.`
        }
        confirmLabel={
          confirmState?.action === "TU_CHOI"
            ? "Xác nhận từ chối"
            : "Xác nhận đồng ý"
        }
        requireAcknowledgement
        acknowledgementLabel="Tôi xác nhận đã đọc báo cáo tiến độ và chịu trách nhiệm về ý kiến thẩm định chuyên môn này."
        isLoading={isSubmitting}
      />
    </>
  );
}

export function SupervisorExtensionsWorkspace({
  requests: initialRequests,
  currentSupervisorId = "gvhd-001",
  isLoading = false,
  error = null,
  onRetry,
  onReviewExtension,
}: SupervisorExtensionsWorkspaceProps) {
  const [requestsState, setRequestsState] =
    useState<SupervisorExtensionRequestItem[]>(initialRequests);
  const [activeTab, setActiveTab] =
    useState<ExtensionFilterTab>("CHO_GVHD_XAC_NHAN");
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [previewPdfRequest, setPreviewPdfRequest] =
    useState<SupervisorExtensionRequestItem | null>(null);
  const [feedbackBanner, setFeedbackBanner] = useState<string | null>(null);

  const selectedRequest = useMemo(
    () => requestsState.find((item) => item.id === selectedRequestId) ?? null,
    [requestsState, selectedRequestId]
  );

  const counts = useMemo(() => {
    const pendingReview = requestsState.filter(
      (r) => r.trangThai === "CHO_GVHD_XAC_NHAN"
    ).length;
    const waitingAcademic = requestsState.filter(
      (r) => r.trangThai === "CHO_DUYET"
    ).length;
    const completed = requestsState.filter(
      (r) => r.trangThai === "DA_DUYET" || r.trangThai === "TU_CHOI"
    ).length;
    return {
      total: requestsState.length,
      pendingReview,
      waitingAcademic,
      completed,
    };
  }, [requestsState]);

  const filteredRequests = useMemo(() => {
    return requestsState.filter((item) => {
      if (activeTab === "CHO_GVHD_XAC_NHAN") {
        return item.trangThai === "CHO_GVHD_XAC_NHAN";
      }
      if (activeTab === "CHO_DUYET") {
        return item.trangThai === "CHO_DUYET";
      }
      if (activeTab === "DA_XU_LY") {
        return item.trangThai === "DA_DUYET" || item.trangThai === "TU_CHOI";
      }
      return true;
    });
  }, [requestsState, activeTab]);

  const handleSubmitReview = async (
    requestId: string,
    action: SupervisorExtensionDecisionAction,
    comment: string
  ) => {
    if (onReviewExtension) {
      await onReviewExtension(requestId, action, comment);
    }

    const nowIso = new Date().toISOString();
    let reviewedCode = "";
    let studentName = "";

    setRequestsState((prev) =>
      prev.map((item) => {
        if (item.id !== requestId) return item;
        reviewedCode = item.maDon;
        studentName = item.hoTenNcs;
        const nextStatus = action === "DONG_Y" ? "CHO_DUYET" : "TU_CHOI";
        const updatedOpinions = item.xacNhanGvhds.map((op) =>
          op.giangVienId === currentSupervisorId || op.vaiTro === item.vaiTroCuaToi
            ? {
                ...op,
                dongY: action === "DONG_Y",
                nhanXet: comment,
                thoiGianPhanHoi: nowIso,
              }
            : op
        );
        return {
          ...item,
          trangThai: nextStatus,
          nhanXetGvhd: comment,
          thoiGianPhanHoiCuaToi: nowIso,
          lyDoTuChoi: action === "TU_CHOI" ? comment : item.lyDoTuChoi,
          xacNhanGvhds: updatedOpinions,
        };
      })
    );

    setFeedbackBanner(
      action === "DONG_Y"
        ? `Đã xác nhận ĐỒNG Ý gia hạn cho đơn ${reviewedCode} (${studentName}) và chuyển Giáo vụ SĐH xem xét.`
        : `Đã ghi nhận TỪ CHỐI đơn gia hạn ${reviewedCode} (${studentName}) kèm nhận xét chuyên môn.`
    );
  };

  return (
    <div className="space-y-6 pb-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0F2744]">
            Thẩm định đơn gia hạn học tập
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Kiểm tra báo cáo tiến độ đính kèm và xác nhận Đồng ý hoặc Từ chối đơn xin gia hạn thời gian đào tạo của Nghiên cứu sinh.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/supervisor/progress-reports"
            className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-[#0F2744] transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] motion-reduce:transition-none"
          >
            <ClipboardCheck className="size-4 text-[#164E9B]" aria-hidden="true" />
            <span>Báo cáo tiến độ</span>
          </Link>
          <Link
            href="/supervisor/students"
            className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#164E9B] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#0F2744] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] focus-visible:ring-offset-2 motion-reduce:transition-none"
          >
            <Users className="size-4" aria-hidden="true" />
            <span>Danh sách NCS</span>
          </Link>
        </div>
      </header>

      {feedbackBanner && (
        <div
          role="status"
          className="flex items-start justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-900"
        >
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600" aria-hidden="true" />
            <p className="font-medium">{feedbackBanner}</p>
          </div>
          <button
            type="button"
            onClick={() => setFeedbackBanner(null)}
            aria-label="Đóng thông báo kết quả thẩm định"
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg text-emerald-800 transition-colors hover:bg-emerald-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 motion-reduce:transition-none"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
      )}

      {error && !isLoading && (
        <div
          role="alert"
          className="flex flex-col gap-3 rounded-xl border border-rose-200 bg-rose-50 px-5 py-4 text-rose-900 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 size-5 shrink-0 text-rose-600" aria-hidden="true" />
            <div className="text-sm">
              <p className="font-semibold">Không thể tải danh sách đơn gia hạn</p>
              <p className="mt-0.5 text-rose-800">{error}</p>
            </div>
          </div>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-lg border border-rose-300 bg-white px-4 py-2 text-sm font-semibold text-rose-800 transition-colors hover:bg-rose-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 motion-reduce:transition-none"
            >
              <RefreshCw className="size-4" aria-hidden="true" />
              <span>Thử lại</span>
            </button>
          )}
        </div>
      )}

      {!isLoading && (
        <section
          aria-label="Số liệu xử lý đơn gia hạn"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
              <span>Đang chờ GVHD thẩm định</span>
              <Clock className="size-4 text-amber-600" aria-hidden="true" />
            </div>
            <p className="mt-2 text-2xl font-bold tabular-nums text-amber-700">
              {counts.pendingReview}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Cần xem báo cáo & xác nhận
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
              <span>Đã chuyển Giáo vụ duyệt</span>
              <CalendarClock className="size-4 text-[#164E9B]" aria-hidden="true" />
            </div>
            <p className="mt-2 text-2xl font-bold tabular-nums text-[#164E9B]">
              {counts.waitingAcademic}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Đang chờ quyết định SĐH
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
              <span>Đã có kết quả cuối cùng</span>
              <CheckCircle2 className="size-4 text-emerald-600" aria-hidden="true" />
            </div>
            <p className="mt-2 text-2xl font-bold tabular-nums text-emerald-700">
              {counts.completed}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Đã duyệt hoặc từ chối
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
              <span>Tổng đơn gia hạn</span>
              <FileText className="size-4 text-[#0F2744]" aria-hidden="true" />
            </div>
            <p className="mt-2 text-2xl font-bold tabular-nums text-[#0F2744]">
              {counts.total}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Toàn bộ hồ sơ gia hạn thuộc phụ trách
            </p>
          </div>
        </section>
      )}

      <section
        aria-label="Danh sách đơn gia hạn theo trạng thái"
        className="overflow-hidden rounded-xl border border-border bg-card"
      >
        <div className="border-b border-border px-5 py-4">
          <div
            role="tablist"
            aria-label="Lọc trạng thái đơn gia hạn"
            className="flex flex-wrap gap-2"
          >
            {(
              [
                {
                  id: "CHO_GVHD_XAC_NHAN",
                  label: `Chờ tôi thẩm định (${counts.pendingReview})`,
                },
                {
                  id: "CHO_DUYET",
                  label: `Chờ Giáo vụ duyệt (${counts.waitingAcademic})`,
                },
                {
                  id: "DA_XU_LY",
                  label: `Đã hoàn tất / Từ chối (${counts.completed})`,
                },
                {
                  id: "ALL",
                  label: `Tất cả (${counts.total})`,
                },
              ] as const
            ).map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex min-h-10 items-center rounded-lg border px-3.5 py-2 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] motion-reduce:transition-none ${
                    isActive
                      ? "border-[#164E9B] bg-[#164E9B] text-white"
                      : "border-border bg-background text-[#0F2744] hover:bg-muted"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-3 p-5 animate-pulse motion-reduce:animate-none">
            {[1, 2, 3].map((idx) => (
              <div key={idx} className="h-24 rounded-lg bg-muted" />
            ))}
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <CalendarClock
              className="mx-auto size-10 text-muted-foreground/60"
              aria-hidden="true"
            />
            <p className="mt-3 text-sm font-semibold text-[#0F2744]">
              Không có đơn gia hạn nào trong mục này
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Bạn có thể chuyển sang tab Tất cả để xem lịch sử các đơn đã xử lý trước đó.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredRequests.map((item) => {
              const statusMeta = getSupervisorRequestStatusMeta(item.trangThai);
              const isPendingMe = item.trangThai === "CHO_GVHD_XAC_NHAN";

              return (
                <article
                  key={item.id}
                  className="flex flex-col gap-4 p-5 transition-colors hover:bg-muted/20 lg:flex-row lg:items-center lg:justify-between motion-reduce:transition-none"
                >
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-[#164E9B]/10 px-2.5 py-0.5 text-xs font-bold tabular-nums text-[#164E9B]">
                        {item.maDon}
                      </span>
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusMeta.badgeClass}`}
                      >
                        {statusMeta.label}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Gửi ngày {formatSupervisorDateUtc(item.ngayGui)}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-[#0F2744]">
                        {item.hoTenNcs}{" "}
                        <span className="text-xs font-medium text-muted-foreground">
                          ({item.mshv} • {getRoleShortLabel(item.vaiTroCuaToi)})
                        </span>
                      </h3>
                      <p className="mt-1 line-clamp-2 text-xs text-foreground">
                        {item.lyDo}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-muted-foreground">
                      <span>
                        Xin gia hạn:{" "}
                        <strong className="font-semibold text-[#164E9B]">
                          +{item.soThangGiaHan} tháng
                        </strong>{" "}
                        ({formatSupervisorDateUtc(item.hanHienTai)} →{" "}
                        {formatSupervisorDateUtc(item.hanMoiDuKien)})
                      </span>
                      <span>
                        Tiến độ hiện tại: Mốc {item.mocHienTai}/9 ({item.tienDoPhanTram}%)
                      </span>
                      <span className="inline-flex items-center gap-1 text-[#0F2744]">
                        <FileText className="size-3.5 text-[#164E9B]" aria-hidden="true" />
                        <span>{item.tepDinhKem.fileName}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 lg:shrink-0">
                    <button
                      type="button"
                      onClick={() => setPreviewPdfRequest(item)}
                      className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-border bg-background px-3.5 py-2 text-xs font-semibold text-[#0F2744] transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] motion-reduce:transition-none"
                    >
                      <Eye className="size-3.5 text-[#164E9B]" aria-hidden="true" />
                      <span>Xem báo cáo PDF</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedRequestId(item.id)}
                      className={`inline-flex min-h-10 items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] motion-reduce:transition-none ${
                        isPendingMe
                          ? "bg-[#164E9B] text-white hover:bg-[#0F2744]"
                          : "border border-border bg-card text-[#0F2744] hover:bg-muted"
                      }`}
                    >
                      <span>{isPendingMe ? "Thẩm định đơn" : "Xem chi tiết"}</span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {selectedRequest && (
        <ExtensionReviewDrawerInner
          key={selectedRequest.id}
          request={selectedRequest}
          onClose={() => setSelectedRequestId(null)}
          onOpenPdf={() => setPreviewPdfRequest(selectedRequest)}
          onSubmitReview={handleSubmitReview}
          isPdfOpen={previewPdfRequest !== null}
        />
      )}

      <PdfViewer
        isOpen={previewPdfRequest !== null}
        onClose={() => setPreviewPdfRequest(null)}
        fileUrl={previewPdfRequest?.tepDinhKem.fileUrl}
        fileName={previewPdfRequest?.tepDinhKem.fileName}
        title={
          previewPdfRequest
            ? `Báo cáo tiến độ gia hạn — ${previewPdfRequest.hoTenNcs} (${previewPdfRequest.maDon})`
            : undefined
        }
        subtitle={
          previewPdfRequest
            ? `Xin gia hạn +${previewPdfRequest.soThangGiaHan} tháng • Nộp ngày ${formatSupervisorDateUtc(
                previewPdfRequest.ngayGui
              )}`
            : undefined
        }
        allowDownload
      />
    </div>
  );
}

export default SupervisorExtensionsWorkspace;
