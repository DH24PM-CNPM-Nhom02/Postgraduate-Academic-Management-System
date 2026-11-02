"use client";

import React, { useState } from "react";
import {
  X,
  Award,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { useTriggerNotification } from "@/src/hooks/use-notifications";
import { MOCK_STUDENTS } from "@/src/components/academic/mockData";
import type { StudentDossier } from "@/src/types/academic";

export interface DecisionIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedStudent?: StudentDossier | null;
  onSuccess?: (msg: string) => void;
}

type LoaiQuyetDinh =
  | "GIA_HAN"
  | "BAO_LUU"
  | "NGUNG_HOC"
  | "BUOC_THOI_HOC"
  | "HOC_TIEP"
  | "CAN_CU_DUYET_MOC";

const DECISION_TYPES: { id: LoaiQuyetDinh; label: string; desc: string; danger?: boolean }[] = [
  {
    id: "GIA_HAN",
    label: "Gia hạn thời gian đào tạo",
    desc: "Kéo dài hạn đào tạo thêm 6 - 12 tháng, cập nhật hạn học tập mới vào hệ thống.",
  },
  {
    id: "BAO_LUU",
    label: "Bảo lưu kết quả học tập",
    desc: "Tạm dừng tiến độ đào tạo, khóa tài khoản tạm thời theo quy định.",
    danger: true,
  },
  {
    id: "HOC_TIEP",
    label: "Cho phép học tiếp",
    desc: "Hết thời hạn bảo lưu, học viên quay lại học tập và mở lại tài khoản.",
  },
  {
    id: "NGUNG_HOC",
    label: "Ngừng học theo nguyện vọng",
    desc: "Nghiên cứu sinh có đơn xin thôi học / dừng đào tạo.",
    danger: true,
  },
  {
    id: "BUOC_THOI_HOC",
    label: "Buộc thôi học (Hết hạn 72 tháng)",
    desc: "Chấm dứt tiến trình đào tạo do vượt quá thời gian tối đa quy định.",
    danger: true,
  },
  {
    id: "CAN_CU_DUYET_MOC",
    label: "Căn cứ công nhận mốc tiến độ",
    desc: "Quyết định thành lập tiểu ban / công nhận kết quả chuyên đề, luận án.",
  },
];

export function DecisionIssueModal({
  isOpen,
  onClose,
  selectedStudent,
  onSuccess,
}: DecisionIssueModalProps) {
  const triggerNotification = useTriggerNotification();

  const [studentId, setStudentId] = useState<string>(
    selectedStudent?.id || MOCK_STUDENTS[0]?.id || ""
  );
  const [loaiQuyetDinh, setLoaiQuyetDinh] = useState<LoaiQuyetDinh>("GIA_HAN");
  const [soQuyetDinh, setSoQuyetDinh] = useState("168/QĐ-ĐHAG-SĐH");
  const [ngayQuyetDinh, setNgayQuyetDinh] = useState("2026-11-02");
  const [ngayHieuLuc, setNgayHieuLuc] = useState("2026-11-05");
  const [hanMoi, setHanMoi] = useState("2027-11-05");
  const [ghiChu, setGhiChu] = useState("");
  const [fileName, setFileName] = useState("QD_168_DHAG_SDH_Scan.pdf");
  const [formError, setFormError] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentStudent =
    MOCK_STUDENTS.find((s) => s.id === studentId) || selectedStudent || MOCK_STUDENTS[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!soQuyetDinh.trim()) {
      setFormError("Vui lòng nhập Số quyết định pháp lý.");
      return;
    }
    if (loaiQuyetDinh === "GIA_HAN" && !hanMoi) {
      setFormError("Đối với quyết định Gia hạn, bắt buộc phải chọn Hạn học tập mới.");
      return;
    }

    const typeMeta = DECISION_TYPES.find((d) => d.id === loaiQuyetDinh);
    const tenLoaiText = typeMeta?.label.toLowerCase() || "quyết định";

    // 1. Kích hoạt thông báo cho NCS (QUYET_DINH_DOI_TRANG_THAI)
    triggerNotification({
      nhom: "QUYET_DINH",
      loai: "QUYET_DINH_DOI_TRANG_THAI",
      tieuDe: `Quyết định ${tenLoaiText}`,
      noiDung: `Quyết định ${tenLoaiText} số ${soQuyetDinh} ngày ${ngayQuyetDinh} đã được áp dụng cho hồ sơ của bạn.${
        loaiQuyetDinh === "GIA_HAN" ? ` Hạn học tập mới: ${hanMoi}.` : ""
      }${ghiChu ? ` Ghi chú: ${ghiChu}.` : ""}`.replace(/\s+/g, " "),
      duLieu: {
        loaiQuyetDinh,
        soQuyetDinh,
        ngayQuyetDinh,
        hanMoi: loaiQuyetDinh === "GIA_HAN" ? hanMoi : undefined,
        ghiChu,
      },
      targetRole: "student",
      targetUrl: "/student/progress",
    });

    // 2. Kích hoạt thông báo cho GVHD (targetRole = 'supervisor')
    triggerNotification({
      nhom: "QUYET_DINH",
      loai: "GVHD_QUYET_DINH_DOI_TRANG_THAI",
      tieuDe: `Quyết định ${tenLoaiText} của NCS ${currentStudent.name} (${currentStudent.code})`,
      noiDung: `Quyết định ${tenLoaiText} số ${soQuyetDinh} ngày ${ngayQuyetDinh} đã được áp dụng cho NCS ${currentStudent.name} (${currentStudent.code}). Trạng thái học tập của NCS đã chuyển sang ${tenLoaiText}.${
        loaiQuyetDinh === "GIA_HAN" ? ` Hạn học tập mới: ${hanMoi}.` : ""
      }`.replace(/\s+/g, " "),
      duLieu: {
        loaiQuyetDinh,
        soQuyetDinh,
        ngayQuyetDinh,
        tenNcs: currentStudent.name,
        mshv: currentStudent.code,
        hanMoi: loaiQuyetDinh === "GIA_HAN" ? hanMoi : undefined,
      },
      targetRole: "supervisor",
      targetUrl: "/supervisor/dashboard",
    });

    onSuccess?.(
      `Đã ban hành Quyết định số ${soQuyetDinh} (${typeMeta?.label}) cho NCS ${currentStudent.name}. Hệ thống đã gửi thông báo tới NCS và GVHD.`
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-[#164E9B] px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-white/10 text-white shadow-xs">
              <Award className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Ban hành Quyết định Học vụ &amp; Thay đổi Trạng thái NCS
              </h2>
              <p className="text-xs text-white/80">
                Lưu vào cơ sở dữ liệu pháp lý Sau Đại học • Cập nhật tự động hồ sơ NCS
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

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {formError && (
            <div className="rounded-xl border border-rose-300 bg-rose-50 p-3 text-rose-800 flex items-center gap-2">
              <AlertTriangle className="size-4 text-rose-600 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Chọn Nghiên cứu sinh */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Áp dụng cho Nghiên cứu sinh <span className="text-rose-500">*</span>:
            </label>
            <select
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800 focus:border-[#164E9B] focus:ring-1 focus:ring-[#164E9B] outline-none cursor-pointer"
            >
              {MOCK_STUDENTS.map((std) => (
                <option key={std.id} value={std.id}>
                  {std.name} ({std.code}) — {std.department} (Mốc {std.currentMilestoneIndex}/9)
                </option>
              ))}
            </select>
          </div>

          {/* Loại quyết định */}
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">
              Loại quyết định pháp lý <span className="text-rose-500">*</span>:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {DECISION_TYPES.map((d) => (
                <label
                  key={d.id}
                  className={`flex cursor-pointer flex-col rounded-xl border p-3 transition-all ${
                    loaiQuyetDinh === d.id
                      ? d.danger
                        ? "border-rose-500 bg-rose-50/70 text-rose-900 ring-2 ring-rose-500/20"
                        : "border-[#164E9B] bg-blue-50/70 text-[#164E9B] ring-2 ring-[#164E9B]/20"
                      : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <input
                    type="radio"
                    name="loaiQuyetDinh"
                    value={d.id}
                    checked={loaiQuyetDinh === d.id}
                    onChange={() => setLoaiQuyetDinh(d.id)}
                    className="sr-only"
                  />
                  <span className="font-bold text-xs">{d.label}</span>
                  <span className="text-[10px] text-slate-500 mt-0.5 leading-snug">{d.desc}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Số quyết định & Ngày ban hành */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Số quyết định <span className="text-rose-500">*</span>:
              </label>
              <input
                type="text"
                value={soQuyetDinh}
                onChange={(e) => setSoQuyetDinh(e.target.value)}
                placeholder="Ví dụ: 168/QĐ-ĐHAG-SĐH"
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold focus:border-[#164E9B] focus:ring-1 focus:ring-[#164E9B] outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Ngày ký quyết định:</label>
              <input
                type="date"
                value={ngayQuyetDinh}
                onChange={(e) => setNgayQuyetDinh(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs focus:border-[#164E9B] focus:ring-1 focus:ring-[#164E9B] outline-none cursor-pointer"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Ngày có hiệu lực:</label>
              <input
                type="date"
                value={ngayHieuLuc}
                onChange={(e) => setNgayHieuLuc(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs focus:border-[#164E9B] focus:ring-1 focus:ring-[#164E9B] outline-none cursor-pointer"
              />
            </div>
          </div>

          {/* Nếu là Gia hạn: Chọn Hạn mới */}
          {loaiQuyetDinh === "GIA_HAN" && (
            <div className="rounded-xl border border-amber-300 bg-amber-50/70 p-3.5 space-y-1.5 animate-in fade-in duration-150">
              <div className="flex items-center gap-1.5 font-bold text-amber-900 text-xs">
                <Clock className="size-4 text-amber-600" />
                <span>Hạn học tập mới sau gia hạn <span className="text-rose-600">*</span></span>
              </div>
              <p className="text-[11px] text-amber-800">
                Hệ thống sẽ cập nhật ngày hết hạn mới này vào hồ sơ NCS và tự động đặt lịch quét thông báo nhắc hạn.
              </p>
              <input
                type="date"
                value={hanMoi}
                onChange={(e) => setHanMoi(e.target.value)}
                className="rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-bold text-amber-950 focus:outline-none cursor-pointer"
              />
            </div>
          )}

          {/* File đính kèm quyết định scan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Tệp scan Quyết định (PDF):
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-2.5 size-4 text-slate-400" />
                <input
                  type="text"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder="Tên file scan có mộc đỏ..."
                  className="w-full rounded-xl border border-slate-300 bg-white pl-9 pr-3 py-2 text-xs focus:border-[#164E9B] focus:ring-1 focus:ring-[#164E9B] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Ghi chú / Căn cứ văn bản cấp trên:
              </label>
              <input
                type="text"
                value={ghiChu}
                onChange={(e) => setGhiChu(e.target.value)}
                placeholder="Theo đề nghị của Khoa CNTT & Biên bản họp..."
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs focus:border-[#164E9B] focus:ring-1 focus:ring-[#164E9B] outline-none"
              />
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <span className="text-[11px] text-slate-500">
              Cơ quan ban hành: <strong>Trường Đại học An Giang – ĐHQG-HCM</strong>
            </span>
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
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#164E9B] px-5 py-2 text-xs font-bold text-white hover:bg-[#113E7D] transition-colors shadow-xs cursor-pointer"
              >
                <CheckCircle2 className="size-4" />
                <span>Ký ban hành &amp; Gửi thông báo</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DecisionIssueModal;
