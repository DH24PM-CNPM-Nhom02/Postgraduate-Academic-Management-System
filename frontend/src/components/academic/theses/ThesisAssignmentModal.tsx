"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  X,
  BookOpen,
  AlertTriangle,
  AlertCircle,
  Clock,
  CheckCircle2,
  PlusCircle,
  ExternalLink,
} from "lucide-react";
import type { AcademicThesisNcsItem } from "@/src/types/api/thesis";
import { useThesisDecisions, useAssignThesisMutation } from "@/src/hooks/use-theses";
import { formatDate } from "@/src/lib/utils";
import { parseApiError } from "@/src/lib/api";

export interface ThesisAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  student?: AcademicThesisNcsItem | null;
  students?: AcademicThesisNcsItem[];
  onSuccess?: (msg: string) => void;
}

export function ThesisAssignmentModal({
  isOpen,
  onClose,
  student,
  students = [],
  onSuccess,
}: ThesisAssignmentModalProps) {
  // Lọc danh sách NCS chưa có đề tài hiệu lực để chọn (khi mở từ nút chung)
  const eligibleStudents = useMemo(() => {
    return students.filter(
      (s) =>
        s.trangThaiDeTai === "CHUA_GIAO" &&
        (!s.trangThaiHocTap ||
          s.trangThaiHocTap === "DANG_HOC" ||
          s.trangThaiHocTap === "GIA_HAN")
    );
  }, [students]);

  // Form State
  const [selectedNcsId, setSelectedNcsId] = useState<string>(
    student?.id || eligibleStudents[0]?.id || ""
  );
  const [tenDeTai, setTenDeTai] = useState("");
  const [quyetDinhId, setQuyetDinhId] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Đối tượng NCS đang được thao tác
  const targetNcs = useMemo(() => {
    if (student) return student;
    return students.find((s) => s.id === selectedNcsId) || null;
  }, [student, students, selectedNcsId]);

  // Lấy danh sách quyết định giao đề tài hiệu lực của NCS
  const { data: decisions = [], isLoading: loadingDecisions } =
    useThesisDecisions(targetNcs?.id);

  // Mutation giao đề tài
  const assignMutation = useAssignThesisMutation();

  // Kiểm tra các ràng buộc nghiệp vụ (Edge Cases)
  const validation = useMemo(() => {
    if (!targetNcs) {
      return {
        isBlocked: true,
        type: "error" as const,
        message: "Chưa chọn nghiên cứu sinh để giao đề tài.",
      };
    }

    if (targetNcs.hasPendingChangeRequest) {
      return {
        isBlocked: true,
        type: "warning" as const,
        message:
          "Nghiên cứu sinh này đang có Đơn xin điều chỉnh đề tài chờ duyệt tại Hội đồng / Giáo vụ. Không thể giao đề tài mới trực tiếp lúc này.",
      };
    }

    if (targetNcs.trangThaiDeTai === "HIEU_LUC" && targetNcs.deTaiHienTai) {
      return {
        isBlocked: true,
        type: "warning" as const,
        message:
          "Nghiên cứu sinh đã có đề tài chính thức đang hiệu lực. Nếu cần điều chỉnh hoặc đổi tên đề tài, vui lòng thực hiện qua luồng 'Duyệt đề nghị đổi đề tài'.",
      };
    }

    if (
      targetNcs.trangThaiHocTap &&
      targetNcs.trangThaiHocTap !== "DANG_HOC" &&
      targetNcs.trangThaiHocTap !== "GIA_HAN"
    ) {
      return {
        isBlocked: true,
        type: "error" as const,
        message: `Nghiên cứu sinh đang ở trạng thái '${targetNcs.trangThaiHocTap}'. Chỉ NCS đang học hoặc gia hạn mới đủ điều kiện giao đề tài.`,
      };
    }

    return { isBlocked: false, type: null, message: null };
  }, [targetNcs]);

  // Bộ đếm ký tự
  const trimmedLength = tenDeTai.trim().length;
  const isLengthValid = trimmedLength >= 5 && trimmedLength <= 500;

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!targetNcs) {
      setErrorMessage("Vui lòng chọn một nghiên cứu sinh.");
      return;
    }

    if (validation.isBlocked) {
      setErrorMessage(validation.message);
      return;
    }

    if (!isLengthValid) {
      setErrorMessage("Tên đề tài luận án phải có độ dài từ 5 đến 500 ký tự.");
      return;
    }

    if (!quyetDinhId) {
      setErrorMessage("Vui lòng chọn Quyết định giao đề tài đính kèm.");
      return;
    }

    try {
      await assignMutation.mutateAsync({
        ncsId: targetNcs.id,
        quyetDinhId,
        tenDeTai: tenDeTai.trim(),
      });

      onSuccess?.(
        `Đã giao thành công đề tài luận án cho NCS ${targetNcs.hoTen} (${targetNcs.mshv}).`
      );
      onClose();
    } catch (err) {
      const parsed = parseApiError(err);
      setErrorMessage(
        parsed.message || "Giao đề tài thất bại. Vui lòng thử lại sau."
      );
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="assign-thesis-title"
    >
      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-150">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-[#164E9B] px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-white/10 text-white shadow-xs">
              <BookOpen className="size-5" />
            </div>
            <div>
              <h2
                id="assign-thesis-title"
                className="text-base font-bold text-white tracking-tight"
              >
                Giao Đề tài Luận án Tiến sĩ
              </h2>
              <p className="text-xs text-white/80">
                Phê duyệt đề tài chính thức gắn với Quyết định ban hành
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-white/80 hover:bg-white/20 hover:text-white transition-colors cursor-pointer"
            title="Đóng hộp thoại (Esc)"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* BODY */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {/* THÔNG BÁO LỖI NẾU CÓ */}
            {errorMessage && (
              <div className="flex items-start gap-3 rounded-xl border border-rose-300 bg-rose-50 px-4 py-3 text-xs text-rose-800">
                <AlertCircle className="size-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold">Không thể giao đề tài</p>
                  <p>{errorMessage}</p>
                </div>
              </div>
            )}

            {/* CẢNH BÁO RÀNG BUỘC NGHIỆP VỤ */}
            {validation.isBlocked && validation.message && (
              <div
                className={`flex items-start gap-3 rounded-xl border p-4 text-xs ${
                  validation.type === "warning"
                    ? "border-amber-300 bg-amber-50 text-amber-900"
                    : "border-rose-300 bg-rose-50 text-rose-900"
                }`}
              >
                {validation.type === "warning" ? (
                  <AlertTriangle className="size-4 text-amber-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="size-4 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className="font-bold mb-0.5">Quy tắc nghiệp vụ chặn thao tác</h4>
                  <p>{validation.message}</p>
                </div>
              </div>
            )}

            {/* CHỌN HOẶC HIỂN THỊ THÔNG TIN NCS */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                Nghiên cứu sinh được giao đề tài <span className="text-rose-500">*</span>
              </label>

              {student ? (
                // Chế độ 1: Mở từ dòng NCS (Hiển thị Card thông tin tĩnh)
                <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">
                        {student.hoTen}
                      </span>
                      <span className="font-mono text-xs font-bold text-[#164E9B] bg-blue-100 px-2 py-0.5 rounded">
                        {student.mshv}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      {student.khoaHoc} • Trạng thái đào tạo:{" "}
                      <strong className="text-slate-700">
                        {student.trangThaiHocTap || "Đang học"}
                      </strong>
                    </p>
                  </div>
                </div>
              ) : (
                // Chế độ 2: Mở từ nút chung (Dropdown tìm chọn NCS)
                <div className="space-y-2">
                  <select
                    value={selectedNcsId}
                    onChange={(e) => {
                      setSelectedNcsId(e.target.value);
                      setQuyetDinhId("");
                      setErrorMessage(null);
                    }}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-[#164E9B] focus:ring-1 focus:ring-[#164E9B] outline-none cursor-pointer"
                  >
                    <option value="">-- Chọn Nghiên cứu sinh chưa giao đề tài --</option>
                    {eligibleStudents.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.mshv} - {s.hoTen} ({s.khoaHoc})
                      </option>
                    ))}
                  </select>

                  {targetNcs && (
                    <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-3 text-xs text-slate-700">
                      <p>
                        Khóa đào tạo: <strong>{targetNcs.khoaHoc}</strong> • Trạng thái:{" "}
                        <strong>{targetNcs.trangThaiHocTap || "Đang học"}</strong>
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* NHẬP TÊN ĐỀ TÀI LUẬN ÁN */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="thesis-name-input"
                  className="text-xs font-bold text-slate-700"
                >
                  Tên Đề tài Luận án Tiến sĩ <span className="text-rose-500">*</span>
                </label>
                <span
                  className={`text-[11px] font-mono ${
                    trimmedLength > 500
                      ? "text-rose-600 font-bold"
                      : trimmedLength >= 5
                      ? "text-emerald-600 font-semibold"
                      : "text-slate-400"
                  }`}
                >
                  {trimmedLength} / 500 ký tự
                </span>
              </div>
              <textarea
                id="thesis-name-input"
                rows={3}
                value={tenDeTai}
                onChange={(e) => {
                  setTenDeTai(e.target.value);
                  setErrorMessage(null);
                }}
                disabled={validation.isBlocked}
                placeholder="Ví dụ: Nghiên cứu mô hình học sâu kết hợp đồ thị tri thức trong phân tích hồ sơ y tế tiếng Việt..."
                className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-900 focus:border-[#164E9B] focus:ring-1 focus:ring-[#164E9B] outline-none transition-colors disabled:bg-slate-100 disabled:cursor-not-allowed resize-none"
              />
              <p className="text-[11px] text-slate-500">
                Tên đề tài phải được viết hoa chữ cái đầu, đúng ngữ pháp và sát với Quyết định phê duyệt.
              </p>
            </div>

            {/* CHỌN QUYẾT ĐỊNH PHÁP LÝ GIAO ĐỀ TÀI */}
            <div className="space-y-2">
              <label
                htmlFor="decision-select"
                className="text-xs font-bold text-slate-700 block"
              >
                Căn cứ Quyết định Giao đề tài <span className="text-rose-500">*</span>
              </label>

              {loadingDecisions ? (
                <div className="flex items-center gap-2 p-3 text-xs text-slate-500 bg-slate-50 rounded-xl border border-slate-200">
                  <Clock className="size-4 animate-spin text-[#164E9B]" />
                  <span>Đang tải danh sách Quyết định hợp lệ của NCS...</span>
                </div>
              ) : decisions.length > 0 ? (
                <select
                  id="decision-select"
                  value={quyetDinhId}
                  onChange={(e) => {
                    setQuyetDinhId(e.target.value);
                    setErrorMessage(null);
                  }}
                  disabled={validation.isBlocked}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-[#164E9B] focus:ring-1 focus:ring-[#164E9B] outline-none cursor-pointer disabled:bg-slate-100 disabled:cursor-not-allowed"
                >
                  <option value="">-- Chọn Quyết định Giao đề tài hiệu lực --</option>
                  {decisions.map((dec) => (
                    <option key={dec.id} value={dec.id}>
                      QĐ số {dec.soQuyetDinh} - Ngày ký: {formatDate(dec.ngayQuyetDinh)}
                      {dec.ghiChu ? ` (${dec.ghiChu})` : ""}
                    </option>
                  ))}
                </select>
              ) : (
                // Nếu chưa có quyết định giao đề tài
                <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-amber-800 text-xs font-bold">
                    <AlertTriangle className="size-4 text-amber-600 shrink-0" />
                    <span>NCS chưa có Quyết định giao đề tài hiệu lực</span>
                  </div>
                  <p className="text-[11px] text-amber-700">
                    Cần ban hành Quyết định phê duyệt đề tài trước khi hoàn tất bước giao đề tài.
                  </p>
                  <Link
                    href="/academic/decisions"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-amber-300 px-3 py-1.5 text-xs font-bold text-amber-900 hover:bg-amber-100 transition-colors shadow-2xs"
                  >
                    <PlusCircle className="size-3.5 text-amber-700" />
                    <span>+ Tạo Quyết định mới tại Quản lý Quyết định</span>
                    <ExternalLink className="size-3 text-amber-600 ml-0.5" />
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* FOOTER ACTIONS */}
          <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4">
            <div className="text-[11px] text-slate-500">
              * Bắt buộc hoàn tất các trường thông tin
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={
                  validation.isBlocked ||
                  !isLengthValid ||
                  !quyetDinhId ||
                  assignMutation.isPending
                }
                className="inline-flex items-center gap-2 rounded-xl bg-[#164E9B] px-5 py-2 text-xs font-bold text-white hover:bg-[#123E7C] shadow-xs transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {assignMutation.isPending ? (
                  <>
                    <Clock className="size-4 animate-spin" />
                    <span>Đang lưu đề tài...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="size-4" />
                    <span>Lưu &amp; Phê duyệt Đề tài</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ThesisAssignmentModal;
