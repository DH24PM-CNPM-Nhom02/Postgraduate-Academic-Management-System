"use client";

import React, { useMemo, useState } from "react";
import {
  X,
  FileEdit,
  CheckCircle2,
  User,
  Calendar,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { DocumentViewButton } from "@/src/components/student/progress/document-view-button";
import { buildChangeRequestCode } from "@/src/adapters/change-request";
import {
  useApproveChangeRequest,
  useChangeRequestApprovalDecisions,
  useRejectChangeRequest,
} from "@/src/hooks/api/use-change-request";
import type {
  ChangeRequestDetailApi,
  ChangeRequestListItemApi,
} from "@/src/types/api/change-request";
import type { TopicChangeItem } from "@/src/types/academic";

export type { TopicChangeItem };

/** Mốc có thể đặt lại khi duyệt đổi đề tài (ApproveDeNghiDto: 2..7) */
const RESET_MILESTONE_OPTIONS = [2, 3, 4, 5, 6, 7];

function formatDateVi(value?: string | null): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
}

export interface TopicChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Đơn DOI_DE_TAI đang chờ duyệt (GET /change-request) */
  request: ChangeRequestListItemApi | null;
  /** Chi tiết (GET /change-request/:id) — có đề tài hiện tại */
  detail?: ChangeRequestDetailApi;
  /** Lỗi tải chi tiết (khi chưa có `detail`) */
  detailError?: string | null;
  onRetryDetail?: () => void;
  /** Gọi sau khi duyệt / từ chối thành công */
  onDone: (message: string) => void;
}

/**
 * Modal thẩm định đơn Đổi đề tài luận án (Giáo vụ / Admin).
 * - Duyệt: PATCH /change-request/:id/approve { quyetDinhId (GIAO_DE_TAI của đúng NCS), resetTuMoc? }
 * - Từ chối: PATCH /change-request/:id/reject { lyDoTuChoi }
 */
export function TopicChangeModal({
  isOpen,
  onClose,
  request,
  detail,
  detailError = null,
  onRetryDetail,
  onDone,
}: TopicChangeModalProps) {
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [quyetDinhId, setQuyetDinhId] = useState("");
  const [resetTuMoc, setResetTuMoc] = useState<string>("");
  const [localError, setLocalError] = useState<string | null>(null);

  const decisionsQuery = useChangeRequestApprovalDecisions(
    request?.ncsId,
    "GIAO_DE_TAI",
    isOpen
  );
  const approveMutation = useApproveChangeRequest();
  const rejectMutation = useRejectChangeRequest();

  // Backend từ chối quyết định có ngày trước ngày gửi đơn → lọc sẵn ở client
  const validDecisions = useMemo(() => {
    if (!request) return [];
    const ngayGui = request.createdAt.slice(0, 10);
    return (decisionsQuery.data ?? []).filter(
      (d) => d.ncsId === request.ncsId && d.ngayQuyetDinh.slice(0, 10) >= ngayGui
    );
  }, [decisionsQuery.data, request]);

  if (!isOpen || !request) return null;

  const isPending = approveMutation.isPending || rejectMutation.isPending;
  const apiError = approveMutation.error ?? rejectMutation.error;

  const handleClose = () => {
    if (isPending) return;
    approveMutation.reset();
    rejectMutation.reset();
    onClose();
  };

  const handleApprove = () => {
    setLocalError(null);
    if (!quyetDinhId) {
      setLocalError("Vui lòng chọn quyết định giao đề tài (GIAO_DE_TAI) làm căn cứ.");
      return;
    }
    approveMutation.mutate(
      {
        id: request.id,
        payload: {
          quyetDinhId,
          ...(resetTuMoc ? { resetTuMoc: Number(resetTuMoc) } : {}),
        },
      },
      {
        onSuccess: () => {
          onDone(`Đã phê duyệt đơn đổi đề tài của NCS ${request.ncs.hoTen}.`);
          onClose();
        },
      }
    );
  };

  const handleReject = () => {
    setLocalError(null);
    const text = rejectReason.trim();
    if (!text || text.length > 2000) {
      setLocalError("Lý do từ chối bắt buộc, tối đa 2000 ký tự.");
      return;
    }
    rejectMutation.mutate(
      { id: request.id, lyDoTuChoi: text },
      {
        onSuccess: () => {
          onDone(`Đã từ chối đơn đổi đề tài của NCS ${request.ncs.hoTen}.`);
          onClose();
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-[#164E9B] px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-white/10 text-white shadow-xs">
              <FileEdit className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Thẩm định Đề nghị Điều chỉnh Tên Đề tài Luận án
              </h2>
              <p className="text-xs text-white/80">
                Mã yêu cầu: <strong className="text-white">{buildChangeRequestCode(request.id)}</strong> • Nộp ngày: {formatDateVi(request.createdAt)}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="rounded-lg p-1.5 text-white/80 hover:bg-white/10 hover:text-white cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
          {/* Thông tin NCS */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-2">
              <User className="size-4 text-[#164E9B]" />
              <div>
                <span className="block text-slate-400">Nghiên cứu sinh</span>
                <strong className="text-slate-800">{request.ncs.hoTen}</strong>
              </div>
            </div>
            <div>
              <span className="block text-slate-400">MSHV</span>
              <strong className="font-mono text-slate-800">{request.ncs.mshv}</strong>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="size-4 text-[#164E9B]" />
              <div>
                <span className="block text-slate-400">Bất khả kháng</span>
                <strong className={request.batKhaKhang ? "text-amber-700" : "text-slate-800"}>
                  {request.batKhaKhang ? "Có (đã đạt mốc 8)" : "Không"}
                </strong>
              </div>
            </div>
          </div>

          {/* So sánh đề tài */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 p-4">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Đề tài hiện tại</span>
              {detail ? (
                <p className="font-semibold text-slate-700 italic">
                  {detail.deTaiHienTai?.tenDeTai
                    ? `“${detail.deTaiHienTai.tenDeTai}”`
                    : "NCS chưa có đề tài hiệu lực"}
                </p>
              ) : detailError ? (
                <div role="alert" className="space-y-1 text-rose-700">
                  <p className="font-semibold">Không tải được đề tài hiện tại: {detailError}</p>
                  {onRetryDetail && (
                    <button
                      type="button"
                      onClick={onRetryDetail}
                      className="font-bold hover:underline cursor-pointer"
                    >
                      Thử lại
                    </button>
                  )}
                </div>
              ) : (
                <p className="italic text-slate-400">Đang tải...</p>
              )}
            </div>
            <div className="rounded-xl border border-blue-200 bg-blue-50/40 p-4">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-[#164E9B] mb-1">Đề tài đề xuất</span>
              <p className="font-bold text-[#0F2744] italic">“{request.tenDeTaiMoi}”</p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 p-4">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Lý do đề nghị</span>
            <p className="text-slate-700 whitespace-pre-line">{request.lyDo}</p>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-slate-200 p-4">
            <span className="font-semibold text-slate-700">Tệp đơn đề nghị / minh chứng</span>
            {request.fileId ? (
              <DocumentViewButton fileId={request.fileId} fileName="Don_doi_de_tai.pdf" />
            ) : (
              <span className="text-slate-400 italic">Không đính kèm</span>
            )}
          </div>

          {/* Khối duyệt */}
          {!showRejectInput && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-emerald-600" />
                <span>Căn cứ phê duyệt</span>
              </h4>
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Quyết định giao đề tài (GIAO_DE_TAI) của NCS <span className="text-rose-600">*</span>
                </label>
                {decisionsQuery.isError ? (
                  <div className="flex items-center justify-between rounded-lg border border-rose-200 bg-rose-50 p-2 text-rose-700">
                    <span>{decisionsQuery.error.message}</span>
                    <button onClick={() => decisionsQuery.refetch()} className="font-bold hover:underline cursor-pointer">Thử lại</button>
                  </div>
                ) : (
                  <select
                    value={quyetDinhId}
                    onChange={(e) => setQuyetDinhId(e.target.value)}
                    disabled={decisionsQuery.isLoading || isPending}
                    className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs"
                  >
                    <option value="">
                      {decisionsQuery.isLoading
                        ? "Đang tải quyết định..."
                        : validDecisions.length === 0
                          ? "-- Chưa có quyết định GIAO_DE_TAI hợp lệ (ngày QĐ ≥ ngày gửi đơn) --"
                          : "-- Chọn quyết định --"}
                    </option>
                    {validDecisions.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.soQuyetDinh} ({formatDateVi(d.ngayQuyetDinh)})
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Đặt lại tiến trình từ mốc</label>
                <select
                  value={resetTuMoc}
                  onChange={(e) => setResetTuMoc(e.target.value)}
                  disabled={isPending}
                  className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs"
                >
                  <option value="">Không đặt lại mốc</option>
                  {RESET_MILESTONE_OPTIONS.map((m) => (
                    <option key={m} value={m}>
                      Mốc {m} (các mốc từ {m} trở đi về chưa mở)
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Từ chối */}
          {showRejectInput && (
            <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-4 space-y-2 animate-in fade-in duration-100">
              <label className="block text-xs font-bold text-rose-800">
                Lý do từ chối (NCS sẽ nhận được nội dung này): <span className="text-rose-600">*</span>
              </label>
              <textarea
                rows={3}
                maxLength={2000}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Ví dụ: Đề tài mới mở rộng phạm vi quá lớn so với đề cương ban đầu..."
                className="w-full rounded-lg border border-rose-300 p-2.5 text-xs focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
              />
              <div className="text-right text-[11px] text-slate-400">{rejectReason.length}/2000</div>
            </div>
          )}

          {(localError || apiError) && (
            <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-rose-700 font-semibold">
              <AlertCircle className="size-4 shrink-0 mt-0.5" />
              <span>{localError ?? apiError?.message}</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4">
          <button
            type="button"
            onClick={handleClose}
            disabled={isPending}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors disabled:opacity-60"
          >
            Đóng
          </button>

          <div className="flex items-center gap-2">
            {showRejectInput ? (
              <>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => {
                    setShowRejectInput(false);
                    setLocalError(null);
                    rejectMutation.reset();
                  }}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700 disabled:opacity-60"
                >
                  Quay lại
                </button>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={handleReject}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700 disabled:opacity-60"
                >
                  {rejectMutation.isPending && <Loader2 className="size-3.5 animate-spin" />}
                  Xác nhận Từ chối
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => {
                    setShowRejectInput(true);
                    setLocalError(null);
                    approveMutation.reset();
                  }}
                  className="rounded-lg border border-rose-300 bg-white px-3.5 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 transition-colors disabled:opacity-60"
                >
                  Từ chối đơn
                </button>
                <button
                  type="button"
                  disabled={isPending || !quyetDinhId}
                  onClick={handleApprove}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-xs disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {approveMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}
                  <span>Phê duyệt đơn</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TopicChangeModal;
