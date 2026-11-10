"use client";

import React, { useState } from "react";
import axios from "axios";
import {
  X,
  UserCheck,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Scale,
  Loader2,
} from "lucide-react";
import { useTriggerNotification } from "@/src/hooks/use-notifications";
import {
  useAcademicAssignments,
  useAssignmentDecisions,
  useCreateAssignment,
  useDeactivateAssignment,
} from "@/src/hooks/use-academic";
import type { VaiTroHuongDan } from "@/src/services/gvhd";
import { MOCK_SUPERVISORS, MOCK_STUDENTS } from "@/src/components/academic/mockData";
import type { StudentDossier, SupervisorQuotaRecord } from "@/src/types/academic";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function extractApiErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const data: unknown = err.response?.data;
    if (data && typeof data === "object" && "message" in data) {
      const msg = (data as { message?: unknown }).message;
      if (Array.isArray(msg)) {
        return msg.map((item) => String(item)).join("; ");
      }
      if (typeof msg === "string" && msg.trim().length > 0) {
        return msg;
      }
    }
    if (typeof err.message === "string" && err.message.trim().length > 0) {
      return err.message;
    }
  }
  if (err instanceof Error && err.message.trim().length > 0) {
    return err.message;
  }
  return "Có lỗi xảy ra khi kết nối máy chủ. Vui lòng thử lại.";
}

function formatDecisionDate(value: string): string {
  const date = new Date(value);
  if (isNaN(date.getTime())) return value;
  return date.toLocaleDateString("vi-VN");
}

export interface SupervisorAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedStudent?: StudentDossier | null;
  selectedSupervisor?: SupervisorQuotaRecord | null;
  students?: StudentDossier[];
  supervisors?: SupervisorQuotaRecord[];
  onSuccess?: (msg: string) => void;
}

export function SupervisorAssignmentModal({
  isOpen,
  onClose,
  selectedStudent,
  selectedSupervisor,
  students,
  supervisors,
  onSuccess,
}: SupervisorAssignmentModalProps) {
  const triggerNotification = useTriggerNotification();
  const createAssignmentMutation = useCreateAssignment();
  const deactivateAssignmentMutation = useDeactivateAssignment();

  const studentsList = students && students.length > 0 ? students : MOCK_STUDENTS;
  const supervisorsList = supervisors && supervisors.length > 0 ? supervisors : MOCK_SUPERVISORS;

  const [studentId, setStudentId] = useState<string>(
    selectedStudent?.id || studentsList[0]?.id || ""
  );
  const [supervisorId, setSupervisorId] = useState<string>(
    selectedSupervisor?.id || supervisorsList[0]?.id || ""
  );
  const [role, setRole] = useState<VaiTroHuongDan>("HUONG_DAN_CHINH");
  const [quyetDinhId, setQuyetDinhId] = useState<string>("");
  const [decisionCode, setDecisionCode] = useState("89/QĐ-ĐHAG-SĐH");
  const [deactivateReason, setDeactivateReason] = useState("");
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const currentStudent =
    studentsList.find((s) => s.id === studentId) || selectedStudent || studentsList[0];
  const currentSupervisor =
    supervisorsList.find((s) => s.id === supervisorId) ||
    selectedSupervisor ||
    supervisorsList[0];

  const effectiveStudentId = currentStudent?.id || "";
  const effectiveSupervisorId = currentSupervisor?.id || "";
  const isRealStudent = UUID_REGEX.test(effectiveStudentId);
  const isRealSupervisor = UUID_REGEX.test(effectiveSupervisorId);
  const isRealBackendPair = isRealStudent && isRealSupervisor;

  const { data: activeAssignments = [], isFetching: loadingAssignments } =
    useAcademicAssignments(
      { ncsId: isRealStudent ? effectiveStudentId : undefined, trangThai: "DANG_HIEU_LUC" },
      isOpen && isRealBackendPair
    );

  const { data: decisions = [], isFetching: loadingDecisions } = useAssignmentDecisions(
    isRealStudent ? effectiveStudentId : undefined,
    isOpen && isRealBackendPair
  );

  if (!isOpen || !currentStudent || !currentSupervisor) return null;

  const addedWeight = role === "HUONG_DAN_CHINH" ? 1.0 : 0.5;
  const projectedUsed = Number((currentSupervisor.usedQuota + addedWeight).toFixed(1));
  const wouldExceedQuota = projectedUsed > currentSupervisor.maxQuota;
  const isFullQuota = currentSupervisor.remainingQuota <= 0;

  const matchingActiveAssignment =
    activeAssignments.find((a) => a.gvhdId === effectiveSupervisorId) ?? null;
  const existingMainAssignment =
    activeAssignments.find((a) => a.vaiTro === "HUONG_DAN_CHINH") ?? null;

  const effectiveDecisionId = decisions.some((d) => d.id === quyetDinhId)
    ? quyetDinhId
    : decisions[0]?.id || "";
  const selectedDecision = decisions.find((d) => d.id === effectiveDecisionId) ?? null;

  const isSubmitting =
    createAssignmentMutation.isPending || deactivateAssignmentMutation.isPending;

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (wouldExceedQuota) {
      setErrorMsg(
        `Giảng viên ${currentSupervisor.name} sẽ vượt định mức tối đa (${currentSupervisor.usedQuota} + ${addedWeight} = ${projectedUsed} / ${currentSupervisor.maxQuota} NCS).`
      );
      return;
    }

    if (isRealBackendPair) {
      if (!effectiveDecisionId) {
        setErrorMsg(
          "NCS này chưa có Quyết định phân công GVHD (loại PHAN_CONG_GVHD, hiệu lực). Vui lòng tạo Quyết định trước."
        );
        return;
      }

      try {
        await createAssignmentMutation.mutateAsync({
          ncsId: effectiveStudentId,
          gvhdId: effectiveSupervisorId,
          vaiTro: role,
          quyetDinhId: effectiveDecisionId,
        });

        const soQuyetDinh = selectedDecision?.soQuyetDinh || "theo QĐ hệ thống";

        triggerNotification({
          nhom: "TIEN_DO",
          loai: "NCS_DUOC_PHAN_CONG_GVHD",
          tieuDe: "Bạn đã được phân công giảng viên hướng dẫn",
          noiDung: `Giảng viên hướng dẫn của bạn: ${currentSupervisor.name} (${
            role === "HUONG_DAN_CHINH" ? "GVHD Chính" : "Đồng Hướng dẫn"
          }) theo Quyết định số ${soQuyetDinh}.`,
          duLieu: {
            tenGvhd: currentSupervisor.name,
            vaiTro: role,
            soQuyetDinh,
          },
          targetRole: "student",
          targetUrl: "/student/progress",
        });

        triggerNotification({
          nhom: "TIEN_DO",
          loai: "GVHD_NHAN_NCS",
          tieuDe: "Bạn được phân công hướng dẫn nghiên cứu sinh mới",
          noiDung: `Nghiên cứu sinh ${currentStudent.name} (${currentStudent.code}) đã được phân công cho bạn theo QĐ số ${soQuyetDinh}.`,
          duLieu: {
            tenNcs: currentStudent.name,
            mshv: currentStudent.code,
            soQuyetDinh,
          },
          targetRole: "supervisor",
          targetUrl: "/supervisor/dashboard",
        });

        onSuccess?.(
          `Đã phân công ${currentSupervisor.name} hướng dẫn NCS ${currentStudent.name} theo QĐ số ${soQuyetDinh}.`
        );
        onClose();
      } catch (err: unknown) {
        setErrorMsg(extractApiErrorMessage(err));
      }
      return;
    }

    // Fallback offline mock mode
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
        role === "HUONG_DAN_CHINH" ? "GVHD Chính" : "Đồng Hướng dẫn"
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

  const handleDeactivate = async () => {
    setErrorMsg(null);
    if (!deactivateReason.trim()) {
      setErrorMsg("Bắt buộc phải nhập lý do khi hủy phân công hướng dẫn.");
      return;
    }

    if (isRealBackendPair) {
      if (!matchingActiveAssignment) {
        setErrorMsg(
          "Không tìm thấy phân công đang hiệu lực giữa NCS và GVHD đã chọn để hủy."
        );
        return;
      }

      try {
        await deactivateAssignmentMutation.mutateAsync({
          id: matchingActiveAssignment.id,
          lyDo: deactivateReason.trim(),
        });

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
      } catch (err: unknown) {
        setErrorMsg(extractApiErrorMessage(err));
      }
      return;
    }

    // Fallback offline mock mode
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
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-lg p-1.5 text-white/80 hover:bg-white/20 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
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
                value={effectiveStudentId}
                onChange={(e) => {
                  setStudentId(e.target.value);
                  setQuyetDinhId("");
                  setErrorMsg(null);
                }}
                disabled={isSubmitting}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800 focus:border-[#164E9B] focus:ring-1 focus:ring-[#164E9B] outline-none cursor-pointer disabled:opacity-60"
              >
                {studentsList.map((std) => (
                  <option key={std.id} value={std.id}>
                    {std.name} ({std.code}) — {std.department}
                  </option>
                ))}
              </select>

              {isRealBackendPair && activeAssignments.length > 0 && (
                <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-600">
                  <span className="font-semibold text-slate-500">Đang hướng dẫn:</span>
                  {activeAssignments.map((a) => (
                    <span
                      key={a.id}
                      className="inline-flex items-center gap-1 rounded-full bg-slate-100 border border-slate-200 px-2 py-0.5 text-[10px] font-semibold text-slate-700"
                    >
                      {a.gvhd?.hoTen || "GVHD"} (
                      {a.vaiTro === "HUONG_DAN_CHINH" ? "Chính" : "Đồng HD"})
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Chọn Giảng viên Hướng dẫn */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Giảng viên Hướng dẫn tiếp nhận <span className="text-rose-500">*</span>:
              </label>
              <select
                value={effectiveSupervisorId}
                onChange={(e) => {
                  setSupervisorId(e.target.value);
                  setErrorMsg(null);
                }}
                disabled={isSubmitting}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800 focus:border-[#164E9B] focus:ring-1 focus:ring-[#164E9B] outline-none cursor-pointer disabled:opacity-60"
              >
                {supervisorsList.map((sv) => (
                  <option key={sv.id} value={sv.id}>
                    {sv.name} ({sv.code}) — {sv.department} (Đang HD: {sv.usedQuota}/
                    {sv.maxQuota} NCS)
                  </option>
                ))}
              </select>

              {matchingActiveAssignment && (
                <p className="mt-1 text-[11px] font-semibold text-[#164E9B]">
                  Đang có phân công hiệu lực:{" "}
                  {matchingActiveAssignment.vaiTro === "HUONG_DAN_CHINH"
                    ? "GVHD Chính"
                    : "Đồng Hướng dẫn"}{" "}
                  (QĐ {matchingActiveAssignment.quyetDinh?.soQuyetDinh || "hệ thống"}).
                </p>
              )}
            </div>

            {/* Quota Check Banner */}
            <div
              className={`rounded-xl border p-3 flex items-center justify-between ${
                wouldExceedQuota || isFullQuota
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
                    wouldExceedQuota || isFullQuota ? "text-rose-600" : "text-[#164E9B]"
                  }`}
                >
                  {currentSupervisor.usedQuota} / {currentSupervisor.maxQuota} NCS
                </span>
                <span className="text-[10px] block font-semibold">
                  {wouldExceedQuota
                    ? `Vượt trần nếu +${addedWeight} (${projectedUsed}/${currentSupervisor.maxQuota})`
                    : `Sau phân công: ${projectedUsed} / ${currentSupervisor.maxQuota} NCS`}
                </span>
              </div>
            </div>

            {/* Vai trò hướng dẫn */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Vai trò hướng dẫn <span className="text-rose-500">*</span>:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label
                  className={`flex cursor-pointer items-center gap-2 rounded-xl border p-3 transition-all ${
                    role === "HUONG_DAN_CHINH"
                      ? "border-[#164E9B] bg-blue-50/70 text-[#164E9B] font-bold"
                      : "border-slate-200 bg-white text-slate-700"
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="HUONG_DAN_CHINH"
                    checked={role === "HUONG_DAN_CHINH"}
                    onChange={() => {
                      setRole("HUONG_DAN_CHINH");
                      setErrorMsg(null);
                    }}
                    className="sr-only"
                  />
                  <div className="size-2.5 rounded-full bg-[#164E9B]" />
                  <div>
                    <span className="block">GVHD Chính (Độc lập)</span>
                    <span className="text-[10px] text-slate-500 font-normal">
                      Tính 1.0 định mức
                    </span>
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
                    onChange={() => {
                      setRole("DONG_HUONG_DAN");
                      setErrorMsg(null);
                    }}
                    className="sr-only"
                  />
                  <div className="size-2.5 rounded-full bg-[#164E9B]" />
                  <div>
                    <span className="block">Đồng Hướng dẫn</span>
                    <span className="text-[10px] text-slate-500 font-normal">
                      Tính 0.5 định mức
                    </span>
                  </div>
                </label>
              </div>

              {isRealBackendPair &&
                role === "HUONG_DAN_CHINH" &&
                existingMainAssignment &&
                existingMainAssignment.gvhdId !== effectiveSupervisorId && (
                  <p className="mt-1.5 text-[11px] font-medium text-amber-700">
                    Lưu ý: NCS đã có GVHD Chính ({existingMainAssignment.gvhd?.hoTen || "GVHD"}). Hãy hủy phân công cũ trước hoặc chọn vai trò Đồng Hướng dẫn.
                  </p>
                )}
            </div>

            {/* Quyết định phân công */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Căn cứ Quyết định phân công (Số QĐ) <span className="text-rose-500">*</span>:
              </label>

              {isRealBackendPair ? (
                loadingDecisions ? (
                  <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500">
                    <Loader2 className="size-3.5 animate-spin text-[#164E9B]" />
                    <span>Đang tải danh sách quyết định phân công...</span>
                  </div>
                ) : decisions.length > 0 ? (
                  <div className="relative">
                    <Scale className="absolute left-3 top-2.5 size-4 text-slate-400 pointer-events-none" />
                    <select
                      value={effectiveDecisionId}
                      onChange={(e) => {
                        setQuyetDinhId(e.target.value);
                        setErrorMsg(null);
                      }}
                      disabled={isSubmitting}
                      className="w-full rounded-xl border border-slate-300 bg-white pl-9 pr-3 py-2 text-xs font-semibold text-slate-900 focus:border-[#164E9B] focus:ring-1 focus:ring-[#164E9B] outline-none cursor-pointer disabled:opacity-60"
                    >
                      {decisions.map((dec) => (
                        <option key={dec.id} value={dec.id}>
                          {dec.soQuyetDinh} (Ngày ký: {formatDecisionDate(dec.ngayQuyetDinh)})
                          {dec.ghiChu ? ` — ${dec.ghiChu}` : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-[11px] text-amber-900 flex items-start gap-2">
                    <AlertTriangle className="size-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      NCS <strong>{currentStudent.name}</strong> chưa có Quyết định phân công GVHD (loại{" "}
                      <code>PHAN_CONG_GVHD</code>, đang hiệu lực) trong hệ thống. Vui lòng tạo Quyết định cho NCS này trước tại mục Quản lý Quyết định.
                    </span>
                  </div>
                )
              ) : (
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
              )}
            </div>

            {/* Actions Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => {
                  setErrorMsg(null);
                  setShowDeactivateConfirm(true);
                }}
                disabled={
                  isSubmitting ||
                  (isRealBackendPair && (loadingAssignments || !matchingActiveAssignment))
                }
                title={
                  isRealBackendPair && !matchingActiveAssignment
                    ? "Cặp NCS và GVHD này chưa có phân công hiệu lực để hủy"
                    : "Hủy phân công hiện tại giữa NCS và GVHD đã chọn"
                }
                className="inline-flex items-center gap-1 text-rose-600 hover:text-rose-800 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Trash2 className="size-3.5" />
                <span>Hủy phân công hiện tại</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer disabled:opacity-50"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={
                    wouldExceedQuota ||
                    isSubmitting ||
                    (isRealBackendPair && !effectiveDecisionId)
                  }
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#164E9B] px-5 py-2 text-xs font-bold text-white hover:bg-[#113E7D] transition-colors shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {createAssignmentMutation.isPending ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      <span>Đang lưu...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="size-4" />
                      <span>Ban hành &amp; Gửi thông báo</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        ) : (
          /* Deactivate Confirm View */
          <div className="p-6 space-y-4 text-xs animate-in fade-in duration-150">
            {errorMsg && (
              <div className="rounded-xl border border-rose-300 bg-rose-50 p-3 text-rose-800 flex items-start gap-2">
                <AlertTriangle className="size-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-900 space-y-2">
              <h4 className="font-bold text-sm text-rose-950 flex items-center gap-2">
                <AlertTriangle className="size-4.5 text-rose-600" />
                <span>Xác nhận Hủy phân công Hướng dẫn NCS</span>
              </h4>
              <p>
                Hành động này sẽ chấm dứt vai trò hướng dẫn của{" "}
                <strong>{currentSupervisor.name}</strong> đối với NCS{" "}
                <strong>{currentStudent.name}</strong>
                {matchingActiveAssignment?.quyetDinh?.soQuyetDinh
                  ? ` (theo QĐ ${matchingActiveAssignment.quyetDinh.soQuyetDinh})`
                  : ""}
                .
              </p>
              <div>
                <label className="block font-bold text-rose-950 mb-1">
                  Lý do chấm dứt phân công <span className="text-rose-600">*</span>:
                </label>
                <textarea
                  rows={2}
                  value={deactivateReason}
                  onChange={(e) => {
                    setDeactivateReason(e.target.value);
                    setErrorMsg(null);
                  }}
                  placeholder="Ví dụ: Giảng viên đi công tác nước ngoài dài hạn / Nhập nhầm phân công..."
                  className="w-full rounded-lg border border-rose-300 bg-white p-2.5 text-xs text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => {
                  setShowDeactivateConfirm(false);
                  setErrorMsg(null);
                }}
                disabled={isSubmitting}
                className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer disabled:opacity-50"
              >
                Quay lại
              </button>
              <button
                type="button"
                onClick={handleDeactivate}
                disabled={isSubmitting}
                className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-5 py-2 text-xs font-bold text-white hover:bg-rose-700 transition-colors shadow-xs cursor-pointer disabled:opacity-50"
              >
                {deactivateAssignmentMutation.isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span>Đang hủy...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="size-4" />
                    <span>Xác nhận Hủy &amp; Gửi thông báo</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SupervisorAssignmentModal;
