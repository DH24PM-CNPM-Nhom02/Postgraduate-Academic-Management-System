"use client";

import React from "react";
import {
  X,
  User,
  GraduationCap,
  Calendar,
  FileCheck,
  Award,
  BookOpen,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";

export interface StudentDossier {
  id: string;
  name: string;
  code: string;
  cohort: string;
  department: string;
  thesisTopic: string;
  supervisorMain: string;
  supervisorCo?: string;
  remainingMonths: number;
  currentMilestoneIndex: number; // 1 to 9
  publicationPoints: number; // threshold 2.0
  status: "active" | "warning" | "overdue";
  email: string;
  phone: string;
}

export interface StudentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentDossier | null;
}

const MILESTONES_LIST = [
  { index: 1, name: "Mốc 1: Nhận quyết định công nhận NCS & Đề tài", defaultDuration: "Tháng 0-3" },
  { index: 2, name: "Mốc 2: Hoàn thành học phần tiến sĩ bổ sung", defaultDuration: "Tháng 3-9" },
  { index: 3, name: "Mốc 3: Báo cáo chuyên đề tiến sĩ 01", defaultDuration: "Tháng 9-15" },
  { index: 4, name: "Mốc 4: Báo cáo chuyên đề tiến sĩ 02", defaultDuration: "Tháng 15-21" },
  { index: 5, name: "Mốc 5: Bảo vệ đề cương chi tiết luận án", defaultDuration: "Tháng 18-24" },
  { index: 6, name: "Mốc 6: Báo cáo chuyên đề tiến sĩ 03", defaultDuration: "Tháng 24-30" },
  { index: 7, name: "Mốc 7: Báo cáo tiến độ 6 tháng tại Bộ môn", defaultDuration: "Định kỳ tháng 6/12" },
  { index: 8, name: "Mốc 8: Thẩm định bài báo khoa học (WoS/Scopus ≥ 2.0đ)", defaultDuration: "Tháng 30-36" },
  { index: 9, name: "Mốc 9: Đăng ký bảo vệ luận án Cấp ĐVCM & Cấp Trường", defaultDuration: "Tháng 36-48" },
];

export function StudentDetailModal({
  isOpen,
  onClose,
  student,
}: StudentDetailModalProps) {
  if (!isOpen || !student) return null;

  const pointsPassed = student.publicationPoints >= 2.0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-[#164E9B] px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-white/10 text-white shadow-xs">
              <GraduationCap className="size-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">
                  Hồ sơ Quản lý Học tập Nghiên cứu sinh
                </h2>
                <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-semibold text-white">
                  {student.code}
                </span>
              </div>
              <p className="text-xs text-white/80">
                {student.name} • {student.department} ({student.cohort})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Top Banner Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Student info */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#164E9B]">
                <User className="size-4" />
                <span>Thông tin cá nhân</span>
              </div>
              <div className="text-xs space-y-1 text-slate-700">
                <p><strong>Họ tên:</strong> {student.name}</p>
                <p><strong>MSSV:</strong> {student.code}</p>
                <p><strong>Email:</strong> {student.email}</p>
                <p><strong>SĐT:</strong> {student.phone}</p>
              </div>
            </div>

            {/* Time / Duration status */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#164E9B]">
                <Clock className="size-4" />
                <span>Thời hạn đào tạo (72 tháng)</span>
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-black text-[#0F2744]">
                    {student.remainingMonths}
                  </span>
                  <span className="text-slate-500">tháng còn lại</span>
                </div>
                <div className="mt-1">
                  {student.remainingMonths > 12 ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                      <CheckCircle2 className="size-3" /> Đúng tiến độ
                    </span>
                  ) : student.remainingMonths > 3 ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                      <AlertCircle className="size-3" /> Cảnh báo &lt;12 tháng
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-800">
                      <ShieldAlert className="size-3" /> Cảnh báo quá hạn
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Publication Points Tracker */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#164E9B]">
                <span className="flex items-center gap-1.5">
                  <Award className="size-4" />
                  <span>Điểm bài báo (WoS/Scopus)</span>
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${pointsPassed ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                  {pointsPassed ? "Đạt chuẩn" : "Chưa đủ 2.0đ"}
                </span>
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-black text-[#0F2744]">
                    {student.publicationPoints.toFixed(2)}
                  </span>
                  <span className="text-slate-500">/ 2.00 điểm tối thiểu</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 mt-2">
                  <div
                    className={`h-full rounded-full transition-all ${pointsPassed ? "bg-emerald-500" : "bg-amber-500"}`}
                    style={{ width: `${Math.min(100, (student.publicationPoints / 2.0) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Thesis topic & Supervisors */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Đề tài luận án tiến sĩ được phê duyệt
            </h3>
            <p className="text-sm font-semibold text-[#0F2744] italic bg-blue-50/60 p-3 rounded-lg border border-blue-100">
              “{student.thesisTopic}”
            </p>
            <div className="grid grid-cols-2 gap-4 text-xs pt-1">
              <div>
                <span className="text-slate-500">GVHD chính:</span>{" "}
                <strong className="text-slate-900">{student.supervisorMain}</strong>
              </div>
              <div>
                <span className="text-slate-500">Đồng GVHD:</span>{" "}
                <strong className="text-slate-900">{student.supervisorCo || "Không có (HD Độc lập)"}</strong>
              </div>
            </div>
          </div>

          {/* 9-Milestone Progress Map */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <FileCheck className="size-4 text-[#164E9B]" />
                <span>Tiến trình 9 mốc đào tạo tiến sĩ</span>
              </h3>
              <span className="text-xs font-semibold text-slate-500">
                Đã hoàn thành: {student.currentMilestoneIndex - 1} / 9 mốc
              </span>
            </div>

            <div className="space-y-2">
              {MILESTONES_LIST.map((m) => {
                const isPassed = m.index < student.currentMilestoneIndex;
                const isCurrent = m.index === student.currentMilestoneIndex;
                const isLocked = m.index > student.currentMilestoneIndex;

                return (
                  <div
                    key={m.index}
                    className={`flex items-center justify-between rounded-xl border p-3 text-xs transition-colors ${
                      isCurrent
                        ? "border-[#164E9B] bg-blue-50/60 ring-1 ring-[#164E9B]/30"
                        : isPassed
                        ? "border-emerald-200 bg-emerald-50/40"
                        : "border-slate-200 bg-slate-50/40 opacity-70"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex size-6 items-center justify-center rounded-full text-xs font-bold ${
                          isPassed
                            ? "bg-emerald-600 text-white"
                            : isCurrent
                            ? "bg-[#164E9B] text-white"
                            : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {isPassed ? "✓" : m.index}
                      </span>
                      <div>
                        <span
                          className={`font-semibold block ${
                            isCurrent
                              ? "text-[#164E9B] font-bold"
                              : isPassed
                              ? "text-emerald-900"
                              : "text-slate-700"
                          }`}
                        >
                          {m.name}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          Khung thời gian quy định: {m.defaultDuration}
                        </span>
                      </div>
                    </div>

                    <div>
                      {isPassed ? (
                        <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
                          Đã đạt (Passed)
                        </span>
                      ) : isCurrent ? (
                        <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-[11px] font-bold text-[#164E9B] animate-pulse">
                          Đang thực hiện
                        </span>
                      ) : (
                        <span className="rounded-full bg-slate-200 px-2.5 py-0.5 text-[11px] font-medium text-slate-600">
                          Chưa mở
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-3.5">
          <p className="text-xs text-slate-500">
            Dữ liệu đồng bộ trực tiếp từ CSDL Đào tạo Sau Đại học AGU.
          </p>
          <button
            onClick={onClose}
            className="rounded-lg bg-[#164E9B] px-5 py-2 text-xs font-bold text-white hover:bg-[#113E7D] transition-colors shadow-xs"
          >
            Đóng hồ sơ
          </button>
        </div>
      </div>
    </div>
  );
}

export default StudentDetailModal;
