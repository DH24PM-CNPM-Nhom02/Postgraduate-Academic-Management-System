"use client";

import React, { useState } from "react";
import {
  X,
  AlertTriangle,
  Ban,
  Clock,
  Info,
} from "lucide-react";
import type { AcademicThesisNcsItem } from "@/src/types/api/thesis";
import { useDeactivateThesisMutation } from "@/src/hooks/use-theses";
import { formatDate } from "@/src/lib/utils";
import { parseApiError } from "@/src/lib/api";

export interface ThesisDeactivateModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: AcademicThesisNcsItem | null;
  onSuccess?: (msg: string) => void;
}

export function ThesisDeactivateModal({
  isOpen,
  onClose,
  item,
  onSuccess,
}: ThesisDeactivateModalProps) {
  const [lyDo, setLyDo] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const deactivateMutation = useDeactivateThesisMutation();

  if (!isOpen || !item || !item.deTaiHienTai) return null;

  const deTai = item.deTaiHienTai;
  const trimmedLength = lyDo.trim().length;
  const isReasonValid = trimmedLength >= 10;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!isReasonValid) {
      setErrorMessage("Vui lòng nhập lý do hủy tối thiểu 10 ký tự.");
      return;
    }

    try {
      await deactivateMutation.mutateAsync({
        id: deTai.id,
        payload: { lyDo: lyDo.trim() },
      });

      onSuccess?.(
        `Đã hủy đề tài "${deTai.tenDeTai}" của NCS ${item.hoTen} (${item.mshv}) thành công.`
      );
      onClose();
    } catch (err) {
      const parsed = parseApiError(err);
      setErrorMessage(
        parsed.message || "Hủy đề tài thất bại. Vui lòng thử lại sau."
      );
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="deactivate-thesis-title"
    >
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-rose-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-rose-200 bg-rose-600 px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-white/20 text-white shadow-xs">
              <AlertTriangle className="size-5" />
            </div>
            <div>
              <h2
                id="deactivate-thesis-title"
                className="text-base font-bold text-white tracking-tight"
              >
                Hủy Quyết Định Giao Đề Tài
              </h2>
              <p className="text-xs text-rose-100">
                Thao tác thu hồi / vô hiệu hóa đề tài giao sai
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-white/80 hover:bg-white/20 hover:text-white transition-colors cursor-pointer"
            title="Đóng (Esc)"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* BODY */}
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="p-6 space-y-4">
            {/* THÔNG BÁO LỖI NẾU CÓ */}
            {errorMessage && (
              <div className="flex items-start gap-2.5 rounded-xl border border-rose-300 bg-rose-50 p-3 text-xs text-rose-800">
                <AlertTriangle className="size-4 text-rose-600 shrink-0 mt-0.5" />
                <p>{errorMessage}</p>
              </div>
            )}

            {/* THÔNG TIN ĐỀ TÀI BỊ HỦY */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-2 text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                  Tên đề tài hiện tại bị hủy:
                </span>
                <p className="font-bold text-slate-900 leading-snug">
                  “{deTai.tenDeTai}”
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 text-slate-600">
                <div>
                  <span className="text-[10px] text-slate-400 block">NCS:</span>
                  <span className="font-semibold text-slate-800">
                    {item.hoTen} ({item.mshv})
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">
                    Căn cứ QĐ:
                  </span>
                  <span className="font-semibold text-slate-800">
                    {deTai.quyetDinh?.soQuyetDinh || "Chưa có số QĐ"}
                    {deTai.quyetDinh?.ngayQuyetDinh
                      ? ` (${formatDate(deTai.quyetDinh.ngayQuyetDinh)})`
                      : ""}
                  </span>
                </div>
              </div>
            </div>

            {/* CALLOUT LƯU Ý QUAN TRỌNG */}
            <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-900">
              <Info className="size-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold">Lưu ý quan trọng</p>
                <p className="text-[11px] leading-relaxed text-amber-800">
                  Thao tác này chỉ áp dụng khi phân công nhầm hoặc giao sai quyết
                  định. Nếu NCS đổi hướng nghiên cứu trong quá trình làm luận án,
                  vui lòng yêu cầu NCS nộp đơn <strong>Đổi đề tài</strong> thay
                  vì hủy trực tiếp để bảo lưu lịch sử nghiên cứu.
                </p>
              </div>
            </div>

            {/* NHẬP LÝ DO HỦY */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="deactivate-reason-input"
                  className="text-xs font-bold text-slate-700"
                >
                  Lý do hủy đề tài <span className="text-rose-500">*</span>
                </label>
                <span
                  className={`text-[11px] font-mono ${
                    isReasonValid ? "text-emerald-600 font-semibold" : "text-slate-400"
                  }`}
                >
                  {trimmedLength} / 10 ký tự tối thiểu
                </span>
              </div>
              <textarea
                id="deactivate-reason-input"
                rows={3}
                value={lyDo}
                onChange={(e) => {
                  setLyDo(e.target.value);
                  setErrorMessage(null);
                }}
                placeholder="Nhập lý do cụ thể vì sao hủy quyết định giao đề tài này (ví dụ: giao nhầm quyết định, sai thông tin chuyên ngành...)..."
                className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-900 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none transition-colors resize-none"
              />
            </div>
          </div>

          {/* FOOTER ACTIONS */}
          <div className="flex items-center justify-end gap-2 border-t border-slate-200 bg-slate-50 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              disabled={deactivateMutation.isPending}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={!isReasonValid || deactivateMutation.isPending}
              className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2 text-xs font-bold text-white hover:bg-rose-700 shadow-xs transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {deactivateMutation.isPending ? (
                <>
                  <Clock className="size-4 animate-spin" />
                  <span>Đang hủy đề tài...</span>
                </>
              ) : (
                <>
                  <Ban className="size-4" />
                  <span>Xác nhận Hủy Đề tài</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ThesisDeactivateModal;
