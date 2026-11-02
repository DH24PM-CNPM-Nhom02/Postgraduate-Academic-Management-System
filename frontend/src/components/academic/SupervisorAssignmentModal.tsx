"use client";

import React, { useState } from "react";
import {
  X,
  UserCheck,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Scale,
} from "lucide-react";
import { useTriggerNotification } from "@/src/hooks/use-notifications";
import { MOCK_SUPERVISORS, MOCK_STUDENTS } from "@/src/components/academic/mockData";
import type { StudentDossier, SupervisorQuotaRecord } from "@/src/types/academic";

export interface SupervisorAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedStudent?: StudentDossier | null;
  selectedSupervisor?: SupervisorQuotaRecord | null;
  onSuccess?: (msg: string) => void;
}

export function SupervisorAssignmentModal({
  isOpen,
  onClose,
  selectedStudent,
  selectedSupervisor,
  onSuccess,
}: SupervisorAssignmentModalProps) {
  const triggerNotification = useTriggerNotification();

  const [studentId, setStudentId] = useState<string>(
    selectedStudent?.id || MOCK_STUDENTS[0]?.id || ""
  );
  const [supervisorId, setSupervisorId] = useState<string>(
    selectedSupervisor?.id || MOCK_SUPERVISORS[0]?.id || ""
  );
  const [role, setRole] = useState<"CHINH" | "DONG_HUONG_DAN">("CHINH");
  const [decisionCode, setDecisionCode] = useState("89/QĐ-ĐHAG-SĐH");
  const [deactivateReason, setDeactivateReason] = useState("");
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentStudent =
    MOCK_STUDENTS.find((s) => s.id === studentId) || selectedStudent || MOCK_STUDENTS[0];
  const currentSupervisor =
    MOCK_SUPERVISORS.find((s) => s.id === supervisorId) || selectedSupervisor || MOCK_SUPERVISORS[0];

  // Kiểm tra quota của giảng viên
  const isFullQuota = currentSupervisor ? currentSupervisor.remainingQuota <= 0 : false;

  const handleAssign = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFullQuota) {
      setErrorMsg(
        `Giảng viên ${currentSupervisor.name} đã đủ hạn ngạch tối đa (${currentSupervisor.usedQuota}/${currentSupervisor.maxQuota} NCS), không thể phân công thêm.`
      );
      return;
    }
    if (!decisionCode.trim()) {
      setErrorMsg("Vui lòng nhập số quyết định phân công hướng dẫn làm căn cứ pháp lý.");
      return;
    }

    // 1. Kích hoạt thông báo cho NCS (targetRole = 'student')
    triggerNotification({
      nhom: "TIEN_DO",
      loai: "NCS_DUOC_PHAN_CONG_GVHD",
      tieuDe: "Bạn đã được phân công giảng viên hướng dẫn",
      noiDung: `Giảng viên hướng dẫn của bạn: ${currentSupervisor.name} (${
        role === "CHINH" ? "GVHD Chính" : "Đồng Hướng dẫn"
      }) theo Quyết định số ${decisionCode}.`,
      duLieu: {
        tenGvhd: currentSupervisor.name,
        vaiTro: role,
        soQuyetDinh: decisionCode,
      },
      targetRole: "student",
      targetUrl: "/student/progress",
    });

    // 2. Kích hoạt thông báo cho GVHD (targetRole = 'supervisor')
    triggerNotification({
      nhom: "TIEN_DO",
      loai: "GVHD_NHAN_NCS",
      tieuDe: "Bạn được phân công hướng dẫn nghiên cứu sinh mới",
      noiDung: `Nghiên cứu sinh ${currentStudent.name} (${currentStudent.code}) đã được phân công cho bạn theo QĐ số ${decisionCode}.`,
      duLieu: {
        tenNcs: currentStudent.name,
        mshv: currentStudent.code,
        soQuyetDinh: decisionCode,
      },
      targetRole: "supervisor",
      targetUrl: "/supervisor/dashboard",
    });

    onSuccess?.(
      `Đã phân công ${currentSupervisor.name} hướng dẫn NCS ${currentStudent.name} theo QĐ số ${decisionCode}.`
    );
    onClose();
  };

  const handleDeactivate = () => {
    if (!deactivateReason.trim()) {
      setErrorMsg("Bắt buộc phải nhập lý do khi hủy phân công hướng dẫn.");
      return;
    }

    // 1. Kích hoạt thông báo cho NCS (targetRole = 'student')
    triggerNotification({
      nhom: "TIEN_DO",
      loai: "THAY_DOI_PHAN_CONG_GVHD",
      tieuDe: "Thay đổi phân công giảng viên hướng dẫn",
      noiDung: `Phân công hướng dẫn với GV ${currentSupervisor.name} đã kết thúc. Lý do: ${deactivateReason}.`,
      duLieu: {
        tenGvhd: currentSupervisor.name,
        lyDo: deactivateReason,
      },
      targetRole: "student",
      targetUrl: "/student/progress",
    });

    // 2. Kích hoạt thông báo cho GVHD (targetRole = 'supervisor')
    triggerNotification({
      nhom: "TIEN_DO",
      loai: "THAY_DOI_PHAN_CONG_GVHD",
      tieuDe: `Kết thúc phân công hướng dẫn NCS ${currentStudent.name}`,
      noiDung: `Phân công hướng dẫn giữa bạn và NCS ${currentStudent.name} (${currentStudent.code}) đã kết thúc. Lý do: ${deactivateReason}.`,
      duLieu: {
        tenNcs: currentStudent.name,
        mshv: currentStudent.code,
        lyDo: deactivateReason,
      },
      targetRole: "supervisor",
      targetUrl: "/supervisor/dashboard",
    });

    onSuccess?.(
      `Đã hủy phân công hướng dẫn giữa NCS ${currentStudent.name} và GV ${currentSupervisor.name}.`
    );
    setShowDeactivateConfirm(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-[#164E9B] px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-white/10 text-white shadow-xs">
              <UserCheck className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Phân công &amp; Điều chỉnh Giảng viên Hướng dẫn
              </h2>
              <p className="text-xs text-white/80">
                Quản lý phân công hướng dẫn NCS • Kiểm soát định mức hạn ngạch BR-09
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-white/80 hover:bg-white/20 hover:text-white transition-colors cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Body Form */}
        {!showDeactivateConfirm ? (
          <form onSubmit={handleAssign} className="p-6 space-y-4.5 text-xs">
            {errorMsg && (
              <div className="rounded-xl border border-rose-300 bg-rose-50 p-3 text-rose-800 flex items-start gap-2">
                <AlertTriangle className="size-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Chọn Nghiên cứu sinh */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Nghiên cứu sinh <span className="text-rose-500">*</span>:
              </label>
              <select
                value={studentId}
                onChange={(e) => {
                  setStudentId(e.target.value);
                  setErrorMsg(null);
                }}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800 focus:border-[#164E9B] focus:ring-1 focus:ring-[#164E9B] outline-none cursor-pointer"
              >
                {MOCK_STUDENTS.map((std) => (
                  <option key={std.id} value={std.id}>
                    {std.name} ({std.code}) — {std.department}
                  </option>
                ))}
              </select>
            </div>

            {/* Chọn Giảng viên Hướng dẫn */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Giảng viên Hướng dẫn tiếp nhận <span className="text-rose-500">*</span>:
              </label>
              <select
                value={supervisorId}
                onChange={(e) => {
                  setSupervisorId(e.target.value);
                  setErrorMsg(null);
                }}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800 focus:border-[#164E9B] focus:ring-1 focus:ring-[#164E9B] outline-none cursor-pointer"
              >
                {MOCK_SUPERVISORS.map((sv) => (
                  <option key={sv.id} value={sv.id}>
                    {sv.name} ({sv.code}) — {sv.department} (Đang HD: {sv.usedQuota}/{sv.maxQuota} NCS)
                  </option>
                ))}
              </select>
            </div>

            {/* Quota Check Banner */}
            {currentSupervisor && (
              <div
                className={`rounded-xl border p-3 flex items-center justify-between ${
                  isFullQuota
                    ? "bg-rose-50 border-rose-200 text-rose-900"
                    : "bg-blue-50/60 border-blue-200 text-[#0F2744]"
                }`}
              >
                <div className="space-y-0.5">
                  <span className="font-bold block">
                    Định mức của {currentSupervisor.name}:
                  </span>
                  <span className="text-[11px] text-slate-600">
                    Đang hướng dẫn độc lập: {currentSupervisor.independentCount} NCS • Đồng hướng dẫn:{" "}
                    {currentSupervisor.coCount} NCS
                  </span>
                </div>
                <div className="text-right">
                  <span
                    className={`text-sm font-black ${
                      isFullQuota ? "text-rose-600" : "text-[#164E9B]"
                    }`}
                  >
                    {currentSupervisor.usedQuota} / {currentSupervisor.maxQuota} NCS
                  </span>
                  <span className="text-[10px] block font-semibold">
                    {isFullQuota ? "ĐÃ HẾT CHỈ TIÊU" : `Còn nhận được ${currentSupervisor.remainingQuota} NCS`}
                  </span>
                </div>
              </div>
            )}

            {/* Vai trò hướng dẫn */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Vai trò hướng dẫn <span className="text-rose-500">*</span>:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label
                  className={`flex cursor-pointer items-center gap-2 rounded-xl border p-3 transition-all ${
                    role === "CHINH"
                      ? "border-[#164E9B] bg-blue-50/70 text-[#164E9B] font-bold"
                      : "border-slate-200 bg-white text-slate-700"
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="CHINH"
                    checked={role === "CHINH"}
                    onChange={() => setRole("CHINH")}
                    className="sr-only"
                  />
                  <div className="size-2.5 rounded-full bg-[#164E9B]" />
                  <div>
                    <span className="block">GVHD Chính (Độc lập)</span>
                    <span className="text-[10px] text-slate-500 font-normal">Tính 1.0 định mức</span>
                  </div>
                </label>

                <label
                  className={`flex cursor-pointer items-center gap-2 rounded-xl border p-3 transition-all ${
                    role === "DONG_HUONG_DAN"
                      ? "border-[#164E9B] bg-blue-50/70 text-[#164E9B] font-bold"
                      : "border-slate-200 bg-white text-slate-700"
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="DONG_HUONG_DAN"
                    checked={role === "DONG_HUONG_DAN"}
                    onChange={() => setRole("DONG_HUONG_DAN")}
                    className="sr-only"
                  />
                  <div className="size-2.5 rounded-full bg-[#164E9B]" />
                  <div>
                    <span className="block">Đồng Hướng dẫn</span>
                    <span className="text-[10px] text-slate-500 font-normal">Tính 0.5 định mức</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Số quyết định */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Căn cứ Quyết định phân công (Số QĐ) <span className="text-rose-500">*</span>:
              </label>
              <div className="relative">
                <Scale className="absolute left-3 top-2.5 size-4 text-slate-400" />
                <input
                  type="text"
                  value={decisionCode}
                  onChange={(e) => setDecisionCode(e.target.value)}
                  placeholder="Ví dụ: 89/QĐ-ĐHAG-SĐH"
                  className="w-full rounded-xl border border-slate-300 bg-white pl-9 pr-3 py-2 text-xs font-semibold text-slate-900 focus:border-[#164E9B] focus:ring-1 focus:ring-[#164E9B] outline-none"
                />
              </div>
            </div>

            {/* Actions Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setShowDeactivateConfirm(true)}
                className="inline-flex items-center gap-1 text-rose-600 hover:text-rose-800 text-xs font-semibold transition-colors cursor-pointer"
              >
                <Trash2 className="size-3.5" />
                <span>Hủy phân công hiện tại</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isFullQuota}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#164E9B] px-5 py-2 text-xs font-bold text-white hover:bg-[#113E7D] transition-colors shadow-xs cursor-pointer disabled:opacity-50"
                >
                  <CheckCircle2 className="size-4" />
                  <span>Ban hành &amp; Gửi thông báo</span>
                </button>
              </div>
            </div>
          </form>
        ) : (
          /* Deactivate Confirm View */
          <div className="p-6 space-y-4 text-xs animate-in fade-in duration-150">
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-900 space-y-2">
              <h4 className="font-bold text-sm text-rose-950 flex items-center gap-2">
                <AlertTriangle className="size-4.5 text-rose-600" />
                <span>Xác nhận Hủy phân công Hướng dẫn NCS</span>
              </h4>
              <p>
                Hành động này sẽ chấm dứt vai trò hướng dẫn của{" "}
                <strong>{currentSupervisor.name}</strong> đối với NCS{" "}
                <strong>{currentStudent.name}</strong>.
              </p>
              <div>
                <label className="block font-bold text-rose-950 mb-1">
                  Lý do chấm dứt phân công <span className="text-rose-600">*</span>:
                </label>
                <textarea
                  rows={2}
                  value={deactivateReason}
                  onChange={(e) => setDeactivateReason(e.target.value)}
                  placeholder="Ví dụ: Giảng viên đi công tác nước ngoài dài hạn / NCS đề nghị thay đổi GVHD..."
                  className="w-full rounded-lg border border-rose-300 bg-white p-2.5 text-xs text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setShowDeactivateConfirm(false)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Quay lại
              </button>
              <button
                type="button"
                onClick={handleDeactivate}
                className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-5 py-2 text-xs font-bold text-white hover:bg-rose-700 transition-colors shadow-xs cursor-pointer"
              >
                <Trash2 className="size-4" />
                <span>Xác nhận Hủy &amp; Gửi thông báo</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SupervisorAssignmentModal;
