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
import {
  useDocumentMetadata,
  useDocumentPreviewUrl,
} from "@/src/hooks/api/use-documents";
import { TablePagination } from "@/src/components/ui/table-pagination";
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
type RequestKindFilter = "ALL" | "GIA_HAN" | "DOI_DE_TAI";

/** Đơn đổi đề tài do NCS tự nộp (cần tập thể GVHD xác nhận); mặc định là đơn gia hạn */
function isTopicChange(request: SupervisorExtensionRequestItem): boolean {
  return request.loaiDon === "DOI_DE_TAI";
}

/** Cụm từ loại đơn dùng trong tiêu đề, nút, hộp xác nhận và thông báo */
function getKindText(request: SupervisorExtensionRequestItem): string {
  return isTopicChange(request) ? "đổi đề tài" : "gia hạn";
}

/** Tên file thật từ document-service (GET /documents/:id → originalName); không tự tạo tên giả */
function AttachmentName({ fileId, fallback }: { fileId?: string; fallback: string }) {
  const metaQuery = useDocumentMetadata(fileId);
  if (metaQuery.data?.originalName) return <>{metaQuery.data.originalName}</>;
  return <>{metaQuery.isLoading ? "Đang tải tên tệp..." : fallback}</>;
}

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
  /** Đã xác định được hồ sơ GVHD đang đăng nhập (GET /gvhd/me) */
  reviewerReady: boolean;
  /** Trạng thái tải chi tiết đơn (hạn hiện tại, số tháng đã gia hạn) */
  detailState?: { isLoading: boolean; error: string | null; onRetry: () => void };
}

function ExtensionReviewDrawerInner({
  request,
  onClose,
  onOpenPdf,
  onSubmitReview,
  isPdfOpen,
  reviewerReady,
  detailState,
}: ReviewDrawerInnerProps) {
  const titleId = useId();
  const commentId = useId();
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const [comment, setComment] = useState(request.nhanXetGvhd ?? "");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [confirmState, setConfirmState] = useState<PendingConfirmState | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Chỉ thẩm định khi đơn đang chờ GVHD và chính GVHD này chưa phản hồi (dongY === null)
  // Không xác định được GVHD hiện tại thì không biết đã phản hồi hay chưa → khóa thao tác
  const awaitingReviewer = request.trangThai === "CHO_GVHD_XAC_NHAN" && !reviewerReady;
  // Backend chỉ cho GVHD có dòng trong xacNhanGvhds xác nhận (403 nếu không) và chỉ 1 lần (400 nếu dongY !== null)
  const notInReviewList =
    request.trangThai === "CHO_GVHD_XAC_NHAN" && reviewerReady && !request.yKienCuaToi;
  const canReview =
    request.trangThai === "CHO_GVHD_XAC_NHAN" &&
    reviewerReady &&
    Boolean(request.yKienCuaToi) &&
    request.yKienCuaToi?.dongY === null;
  const topicChange = isTopicChange(request);
  const kindText = getKindText(request);
  const statusMeta = getSupervisorRequestStatusMeta(request.trangThai);
  const attachmentSize = formatFileSizeBytes(request.tepDinhKem?.fileSize);

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
    setSubmitError(null);
    // Nhận xét là tùy chọn khi đồng ý: không tự điền nội dung thay GVHD
    setConfirmState({ action, comment: trimmed });
  };

  const handleConfirmDecision = async () => {
    if (!confirmState) return;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await onSubmitReview(request.id, confirmState.action, confirmState.comment);
      setConfirmState(null);
      onClose();
    } catch (err) {
      setConfirmState(null);
      setSubmitError(
        err instanceof Error && err.message
          ? err.message
          : "Không gửi được ý kiến thẩm định. Vui lòng thử lại."
      );
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
              Thẩm định đơn {kindText} — {request.hoTenNcs}
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {request.mshv} • {request.khoaDaoTao} • {getRoleShortLabel(request.vaiTroCuaToi)}
            </p>
          </div>

          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label={`Đóng bảng thẩm định đơn ${kindText}`}
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-[#0F2744] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] motion-reduce:transition-none"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
          <div className="rounded-xl bg-[#F0F5FA] p-4">
            <p className="text-xs font-semibold text-muted-foreground">
              {topicChange ? "Đề tài luận án hiện tại" : "Đề tài luận án"}
            </p>
            <p className="mt-1 text-sm font-semibold leading-relaxed text-[#0F2744]">
              {request.tenDeTai}
            </p>

            {topicChange && (
              <div className="mt-3 rounded-lg border border-blue-200 bg-card p-3">
                <p className="text-[11px] font-semibold text-[#164E9B]">
                  Tên đề tài mới đề xuất
                </p>
                <p className="mt-1 text-sm font-bold leading-relaxed text-[#0F2744]">
                  {request.tenDeTaiMoi || "—"}
                </p>
              </div>
            )}

            <div className={`mt-4 grid grid-cols-1 gap-3 ${topicChange ? "" : "sm:grid-cols-3"}`}>
              {!topicChange && (
              <>
              <div className="rounded-lg bg-card p-3">
                <p className="text-[11px] font-medium text-muted-foreground">
                  Thời gian xin gia hạn
                </p>
                <p className="mt-1 text-base font-bold tabular-nums text-[#164E9B]">
                  +{request.soThangGiaHan} tháng
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Đã gia hạn trước:{" "}
                  {request.tongThangDaGiaHanTruocDo !== null
                    ? `${request.tongThangDaGiaHanTruocDo} tháng`
                    : detailState?.isLoading
                      ? "đang tải..."
                      : "—"}
                </p>
              </div>

              <div className="rounded-lg bg-card p-3">
                <p className="text-[11px] font-medium text-muted-foreground">
                  Hạn đào tạo hiện tại
                </p>
                <p className="mt-1 text-sm font-bold tabular-nums text-[#0F2744]">
                  {request.hanHienTai
                    ? formatSupervisorDateUtc(request.hanHienTai)
                    : detailState?.isLoading
                      ? "Đang tải..."
                      : "—"}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Dự kiến mới: {formatSupervisorDateUtc(request.hanMoiDuKien)}
                </p>
                {detailState?.error && (
                  <div
                    role="alert"
                    className="mt-1.5 flex items-center justify-between gap-2 text-[11px] text-rose-700"
                  >
                    <span>Không tải được chi tiết đơn: {detailState.error}</span>
                    <button
                      type="button"
                      onClick={detailState.onRetry}
                      className="shrink-0 font-semibold underline-offset-2 hover:underline cursor-pointer"
                    >
                      Thử lại
                    </button>
                  </div>
                )}
              </div>
              </>
              )}

              <div className="rounded-lg bg-card p-3">
                <p className="text-[11px] font-medium text-muted-foreground">
                  Tiến độ 9 mốc hiện nay
                </p>
                <p className="mt-1 text-sm font-bold tabular-nums text-[#0F2744]">
                  {request.mocHienTai > 0
                    ? `Mốc ${request.mocHienTai}/9 (${request.tienDoPhanTram}%)`
                    : "—"}
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
            {request.tepDinhKem ? (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#164E9B]/10 text-[#164E9B]">
                  <FileText className="size-5" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[#0F2744]">
                    {request.tepDinhKem.fileName || (
                      <AttachmentName
                        fileId={request.tepDinhKem.fileId}
                        fallback="Tệp PDF đính kèm (chưa có tên tệp)"
                      />
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {topicChange
                      ? "Đơn đề nghị / minh chứng kèm đơn đổi đề tài"
                      : "Báo cáo tiến độ kèm đơn gia hạn"}
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
                <span>{topicChange ? "Xem tệp PDF" : "Đọc báo cáo PDF"}</span>
              </button>
            </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                Đơn này không đính kèm tệp PDF.
              </p>
            )}
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
                        {op.tenGvhd}
                        {op.vaiTro ? ` • ${getRoleShortLabel(op.vaiTro)}` : ""}
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
                {topicChange
                  ? "Đánh giá sự phù hợp của đề tài mới đề xuất. Bắt buộc nhập tối thiểu 10 ký tự nếu chọn Từ chối đổi đề tài."
                  : "Đánh giá mức độ hoàn thành nghiên cứu của NCS. Bắt buộc nhập tối thiểu 10 ký tự nếu chọn Từ chối gia hạn."}
              </p>

              <textarea
                id={commentId}
                rows={4}
                value={comment}
                onChange={(e) => {
                  setComment(e.target.value);
                  if (validationError) setValidationError(null);
                }}
                placeholder={
                  topicChange
                    ? "Nhập nhận xét chuyên môn về đề tài mới đề xuất của NCS..."
                    : "Nhập nhận xét chuyên môn về tiến độ nghiên cứu và khả năng hoàn thành luận án của NCS..."
                }
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

              {submitError && (
                <p
                  role="alert"
                  className="mt-2 flex items-start gap-1.5 rounded-lg border border-rose-200 bg-rose-50 p-2 text-xs font-medium text-rose-700"
                >
                  <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  <span>{submitError}</span>
                </p>
              )}
            </div>
          ) : (
            <div className="rounded-lg bg-[#F0F5FA] p-4 text-xs text-[#0F2744]">
              <div className="flex items-center gap-2 font-semibold">
                <Info className="size-4 text-[#164E9B]" aria-hidden="true" />
                <span>
                  {awaitingReviewer
                    ? "Chưa xác định được hồ sơ Giảng viên hướng dẫn của bạn nên tạm khóa thẩm định. Vui lòng tải lại trang."
                    : notInReviewList
                      ? "Bạn không thuộc danh sách GVHD cần xác nhận đơn này (chỉ xem)."
                      : request.trangThai === "CHO_GVHD_XAC_NHAN"
                      ? "Bạn đã gửi ý kiến thẩm định, đang chờ các GVHD khác"
                      : "Đơn này đã qua bước GVHD thẩm định"}
                </span>
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
                <span>Từ chối {kindText}</span>
              </button>

              <button
                type="button"
                onClick={() => handleRequestAction("DONG_Y")}
                className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#164E9B] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#0F2744] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] focus-visible:ring-offset-2 motion-reduce:transition-none"
              >
                <ThumbsUp className="size-4" aria-hidden="true" />
                <span>Đồng ý {kindText}</span>
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
            ? `Xác nhận từ chối đơn ${kindText} ${request.maDon}`
            : `Xác nhận đồng ý đơn ${kindText} ${request.maDon}`
        }
        description={
          topicChange
            ? confirmState?.action === "TU_CHOI"
              ? `Đơn đổi đề tài của NCS ${request.hoTenNcs} sẽ chuyển sang trạng thái Từ chối ngay (chỉ cần một GVHD từ chối), kèm nhận xét chuyên môn của Giảng viên.`
              : `Ý kiến đồng ý đổi đề tài của NCS ${request.hoTenNcs} sang "${request.tenDeTaiMoi ?? ""}" sẽ được ghi nhận. Đơn chỉ chuyển Phòng Đào tạo Sau đại học khi tất cả GVHD đều đồng ý.`
            : confirmState?.action === "TU_CHOI"
              ? `Đơn xin gia hạn +${request.soThangGiaHan} tháng của NCS ${request.hoTenNcs} sẽ chuyển sang trạng thái Từ chối ngay (chỉ cần một GVHD từ chối), kèm nhận xét chuyên môn của Giảng viên.`
              : `Ý kiến đồng ý gia hạn +${request.soThangGiaHan} tháng (đến ${formatSupervisorDateUtc(
                  request.hanMoiDuKien
                )}) cho NCS ${request.hoTenNcs} sẽ được ghi nhận. Đơn chỉ chuyển Phòng Đào tạo Sau đại học khi tất cả GVHD đều đồng ý.`
        }
        confirmLabel={
          confirmState?.action === "TU_CHOI"
            ? "Xác nhận từ chối"
            : "Xác nhận đồng ý"
        }
        requireAcknowledgement
        acknowledgementLabel={
          topicChange
            ? "Tôi xác nhận đã xem xét đề tài đề xuất và chịu trách nhiệm về ý kiến thẩm định chuyên môn này."
            : "Tôi xác nhận đã đọc báo cáo tiến độ và chịu trách nhiệm về ý kiến thẩm định chuyên môn này."
        }
        isLoading={isSubmitting}
      />
    </>
  );
}

export function SupervisorExtensionsWorkspace({
  requests: initialRequests,
  currentSupervisorId,
  onSelectedRequestChange,
  selectedRequestDetail,
  isLoading = false,
  error = null,
  onRetry,
  onReviewExtension,
}: SupervisorExtensionsWorkspaceProps) {
  // Dữ liệu luôn lấy từ props (React Query) để phản ánh trạng thái thật sau khi refetch
  const previewMutation = useDocumentPreviewUrl();
  const [previewObjectUrl, setPreviewObjectUrl] = useState<string | null>(null);
  // Vòng đời blob URL: URL đang hiển thị + mã lượt xem để bỏ (và thu hồi) kết quả về muộn
  const previewUrlRef = useRef<string | null>(null);
  const previewRequestIdRef = useRef(0);
  const [activeTab, setActiveTab] =
    useState<ExtensionFilterTab>("CHO_GVHD_XAC_NHAN");
  const [kindFilter, setKindFilter] = useState<RequestKindFilter>("ALL");

  // Lọc theo loại đơn trước, mọi số đếm / tab bên dưới tính trên tập đã lọc
  const requestsState = useMemo(
    () =>
      kindFilter === "ALL"
        ? initialRequests
        : initialRequests.filter((r) => (r.loaiDon ?? "GIA_HAN") === kindFilter),
    [initialRequests, kindFilter]
  );

  // Thu hồi blob URL còn lại khi rời trang; tăng requestId để kết quả về muộn tự thu hồi
  useEffect(() => {
    return () => {
      previewRequestIdRef.current += 1;
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
        previewUrlRef.current = null;
      }
    };
  }, []);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [previewPdfRequest, setPreviewPdfRequest] =
    useState<SupervisorExtensionRequestItem | null>(null);
  const [feedbackBanner, setFeedbackBanner] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 8;

  // Tìm trên toàn bộ danh sách (không theo bộ lọc) để đổi bộ lọc không làm đóng drawer
  const selectedRequest = useMemo(
    () => initialRequests.find((item) => item.id === selectedRequestId) ?? null,
    [initialRequests, selectedRequestId]
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

  const paginatedRequests = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredRequests.slice(start, start + PAGE_SIZE);
  }, [filteredRequests, currentPage]);

  const handleSubmitReview = async (
    requestId: string,
    action: SupervisorExtensionDecisionAction,
    comment: string
  ) => {
    const item = initialRequests.find((r) => r.id === requestId);
    if (onReviewExtension) {
      // Lỗi được ném lại để drawer hiển thị; danh sách tự làm mới qua invalidate query
      await onReviewExtension(requestId, action, comment);
    }

    const kindText = item ? getKindText(item) : "";
    setFeedbackBanner(
      action === "DONG_Y"
        ? `Đã ghi nhận ý kiến ĐỒNG Ý cho đơn ${kindText} ${item?.maDon ?? ""} (${item?.hoTenNcs ?? ""}). Đơn chỉ chuyển Giáo vụ khi tất cả GVHD đồng ý.`
        : `Đã ghi nhận TỪ CHỐI đơn ${kindText} ${item?.maDon ?? ""} (${item?.hoTenNcs ?? ""}) kèm nhận xét chuyên môn.`
    );
  };

  /** Thu hồi blob URL đang hiển thị (nếu có) */
  const revokeCurrentPreviewUrl = () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    setPreviewObjectUrl(null);
  };

  const openPdfPreview = (item: SupervisorExtensionRequestItem) => {
    const fileId = item.tepDinhKem?.fileId;
    if (!fileId) return;
    // Mở tệp khác: bỏ URL cũ trước, đánh dấu lượt xem mới
    revokeCurrentPreviewUrl();
    const requestId = ++previewRequestIdRef.current;
    setPreviewPdfRequest(item);
    // mutateAsync vẫn resolve kể cả khi observer đã reset → tự kiểm tra lượt xem để thu hồi URL thừa
    previewMutation
      .mutateAsync(fileId)
      .then((result) => {
        if (requestId !== previewRequestIdRef.current) {
          URL.revokeObjectURL(result.objectUrl);
          return;
        }
        previewUrlRef.current = result.objectUrl;
        setPreviewObjectUrl(result.objectUrl);
      })
      .catch(() => {
        // Lỗi hiển thị qua previewMutation.error trong PdfViewer; không có URL nào cần thu hồi
      });
  };

  const closePdfPreview = () => {
    // Đóng viewer: vô hiệu lượt xem đang chạy rồi mới thu hồi URL (viewer đã đóng nên không còn dùng)
    previewRequestIdRef.current += 1;
    revokeCurrentPreviewUrl();
    previewMutation.reset();
    setPreviewPdfRequest(null);
  };

  return (
    <div className="space-y-6 pb-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0F2744]">
            Thẩm định đơn của Nghiên cứu sinh
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Xem hồ sơ đính kèm và xác nhận Đồng ý hoặc Từ chối đơn xin gia hạn thời gian đào tạo và đơn đổi đề tài luận án do Nghiên cứu sinh nộp.
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
              <p className="font-semibold">Không thể tải dữ liệu đơn cần thẩm định</p>
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
          aria-label="Số liệu xử lý đơn cần thẩm định"
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
              Cần xem hồ sơ & xác nhận
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
              <span>Tổng số đơn</span>
              <FileText className="size-4 text-[#0F2744]" aria-hidden="true" />
            </div>
            <p className="mt-2 text-2xl font-bold tabular-nums text-[#0F2744]">
              {counts.total}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Đơn gia hạn / đổi đề tài thuộc phụ trách
            </p>
          </div>
        </section>
      )}

      <section
        aria-label="Danh sách đơn cần thẩm định theo trạng thái"
        className="overflow-hidden rounded-xl border border-border bg-card"
      >
        <div className="flex flex-col gap-3 border-b border-border px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div
            role="tablist"
            aria-label="Lọc trạng thái đơn"
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
                  onClick={() => {
                    setActiveTab(tab.id);
                    setCurrentPage(1);
                  }}
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

          <label className="flex items-center gap-2 text-xs font-semibold text-[#0F2744]">
            <span>Loại đơn</span>
            <select
              value={kindFilter}
              onChange={(e) => {
                setKindFilter(e.target.value as RequestKindFilter);
                setCurrentPage(1);
              }}
              className="min-h-10 rounded-lg border border-border bg-background px-3 text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B]"
            >
              <option value="ALL">Tất cả loại đơn</option>
              <option value="GIA_HAN">Gia hạn học tập</option>
              <option value="DOI_DE_TAI">Đổi đề tài luận án</option>
            </select>
          </label>
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
              Không có đơn nào trong mục này
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Bạn có thể chuyển sang tab Tất cả để xem lịch sử các đơn đã xử lý trước đó.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {paginatedRequests.map((item) => {
              const statusMeta = getSupervisorRequestStatusMeta(item.trangThai);
              // Chỉ nhấn mạnh "Thẩm định" khi chính GVHD này còn chưa phản hồi
              const isPendingMe =
                item.trangThai === "CHO_GVHD_XAC_NHAN" &&
                item.yKienCuaToi?.dongY === null;
              const itemIsTopic = isTopicChange(item);

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
                      <span
                        className={`rounded-md px-2 py-0.5 text-[11px] font-semibold ${
                          itemIsTopic
                            ? "bg-violet-50 text-violet-700"
                            : "bg-sky-50 text-sky-700"
                        }`}
                      >
                        {itemIsTopic ? "Đổi đề tài" : "Gia hạn"}
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
                      {itemIsTopic ? (
                        <span className="line-clamp-1">
                          Đề tài mới:{" "}
                          <strong className="font-semibold text-[#164E9B]">
                            {item.tenDeTaiMoi || "—"}
                          </strong>
                        </span>
                      ) : (
                        <span>
                          Xin gia hạn:{" "}
                          <strong className="font-semibold text-[#164E9B]">
                            +{item.soThangGiaHan} tháng
                          </strong>{" "}
                          ({item.hanHienTai
                            ? `${formatSupervisorDateUtc(item.hanHienTai)} → `
                            : "hạn mới dự kiến "}
                          {formatSupervisorDateUtc(item.hanMoiDuKien)})
                        </span>
                      )}
                      <span>
                        {item.mocHienTai > 0
                          ? `Tiến độ hiện tại: Mốc ${item.mocHienTai}/9 (${item.tienDoPhanTram}%)`
                          : `Tiến độ hiện tại: ${item.tenMocHienTai}`}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[#0F2744]">
                        <FileText className="size-3.5 text-[#164E9B]" aria-hidden="true" />
                        <span>{item.tepDinhKem ? "Có tệp PDF đính kèm" : "Không có tệp đính kèm"}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 lg:shrink-0">
                    {item.tepDinhKem?.fileId && (
                      <button
                        type="button"
                        onClick={() => openPdfPreview(item)}
                        className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-border bg-background px-3.5 py-2 text-xs font-semibold text-[#0F2744] transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] motion-reduce:transition-none"
                      >
                        <Eye className="size-3.5 text-[#164E9B]" aria-hidden="true" />
                        <span>{itemIsTopic ? "Xem tệp PDF" : "Xem báo cáo PDF"}</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedRequestId(item.id);
                        onSelectedRequestChange?.(item.id);
                      }}
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

        <div className="border-t border-border px-5 py-3">
          <TablePagination
            currentPage={currentPage}
            totalItems={filteredRequests.length}
            pageSize={PAGE_SIZE}
            onPageChange={setCurrentPage}
            itemLabel="đơn"
          />
        </div>
      </section>

      {selectedRequest && (
        <ExtensionReviewDrawerInner
          key={selectedRequest.id}
          request={selectedRequest}
          onClose={() => {
            setSelectedRequestId(null);
            onSelectedRequestChange?.(null);
          }}
          onOpenPdf={() => openPdfPreview(selectedRequest)}
          onSubmitReview={handleSubmitReview}
          isPdfOpen={previewPdfRequest !== null}
          reviewerReady={Boolean(currentSupervisorId)}
          detailState={selectedRequestDetail}
        />
      )}

      <PdfViewer
        isOpen={previewPdfRequest !== null}
        onClose={closePdfPreview}
        fileUrl={previewObjectUrl ?? undefined}
        isLoading={previewMutation.isPending}
        error={previewMutation.error?.message ?? null}
        fileName={previewPdfRequest?.tepDinhKem?.fileName || `${previewPdfRequest?.maDon ?? "tep-dinh-kem"}.pdf`}
        title={
          previewPdfRequest
            ? `${isTopicChange(previewPdfRequest) ? "Tệp đính kèm đơn đổi đề tài" : "Báo cáo tiến độ gia hạn"} — ${previewPdfRequest.hoTenNcs} (${previewPdfRequest.maDon})`
            : undefined
        }
        subtitle={
          previewPdfRequest
            ? `${
                isTopicChange(previewPdfRequest)
                  ? "Đề nghị đổi đề tài"
                  : `Xin gia hạn +${previewPdfRequest.soThangGiaHan} tháng`
              } • Nộp ngày ${formatSupervisorDateUtc(previewPdfRequest.ngayGui)}`
            : undefined
        }
        allowDownload
      />
    </div>
  );
}

export default SupervisorExtensionsWorkspace;
