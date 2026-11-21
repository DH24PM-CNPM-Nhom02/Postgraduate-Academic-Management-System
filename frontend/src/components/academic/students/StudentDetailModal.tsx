"use client";

import { toast } from "sonner";

import React, { useState, useMemo } from "react";
import {
  X,
  User,
  GraduationCap,
  FileCheck,
  Clock,
  BookOpen,
  Calendar,
  FileText,
  Layers,
  Sparkles,
  BookmarkCheck,
  Check,
  Mail,
  Eye,
  Download,
  Award,
} from "lucide-react";
import type { StudentDossier } from "@/src/types/academic";
import { useAcademicStudentDetail } from "@/src/hooks/use-academic";
import { mapBackendNcsToStudentDossier, BackendNcsRaw } from "@/src/services/ncs";
import { DocumentService } from "@/src/services/document";
import { PdfViewer } from "@/src/components/upload/PdfViewer";

export type { StudentDossier };

export interface StudentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentDossier | null;
}

// 9 mốc đào tạo chuẩn tiến sĩ
const MILESTONE_DEFINITIONS = [
  { index: 1, name: "Mốc 1: Tiếp nhận & Quyết định công nhận NCS, Đề tài", defaultDuration: "Đầu khóa" },
  { index: 2, name: "Mốc 2: Tiểu luận tổng quan", defaultDuration: "06 tháng đầu khóa" },
  { index: 3, name: "Mốc 3: Đề cương nghiên cứu", defaultDuration: "06 tháng đầu khóa" },
  { index: 4, name: "Mốc 4: Chuyên đề 1", defaultDuration: "Chậm nhất 3 tháng trước hạn chính quy" },
  { index: 5, name: "Mốc 5: Chuyên đề 2", defaultDuration: "Chậm nhất 3 tháng trước hạn chính quy" },
  { index: 6, name: "Mốc 6: Báo cáo định kỳ", defaultDuration: "Định kỳ tháng 6 & 12 hàng năm" },
  { index: 7, name: "Mốc 7: Seminar cuối khóa", defaultDuration: "Chậm nhất 3 tháng trước hạn chính quy" },
  { index: 8, name: "Mốc 8: Bảo vệ cấp đơn vị chuyên môn", defaultDuration: "Chậm nhất 3 tháng trước hạn chính quy" },
  { index: 9, name: "Mốc 9: Bảo vệ cấp cơ sở đào tạo", defaultDuration: "Trong vòng 12 tháng sau Mốc 8" },
];

function formatDate(value?: string | Date | null): string {
  if (!value) return "—";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

// Tính hạn quy định dự phòng cho từng mốc (nếu backend chưa gán)
function calculateFallbackMilestoneRule(
  index: number,
  ngayNhapHocStr?: string | Date | null,
  hanChinhQuyStr?: string | Date | null,
  moc8PassedAtStr?: string | Date | null
) {
  const ngayNhapHoc = ngayNhapHocStr ? new Date(ngayNhapHocStr) : null;
  const hanChinhQuy = hanChinhQuyStr ? new Date(hanChinhQuyStr) : null;
  const moc8PassedAt = moc8PassedAtStr ? new Date(moc8PassedAtStr) : null;

  let hanQuyDinh: string | null = null;
  let moTaHan = "";

  if (index === 1) {
    moTaHan = "Hoàn thành khi ban hành QĐ công nhận NCS và đề tài";
  } else if (index === 2) {
    // Mốc 2: 6 tháng kể từ ngày nhập học (06 tháng đầu khóa)
    if (ngayNhapHoc && !isNaN(ngayNhapHoc.getTime())) {
      hanQuyDinh = addMonths(ngayNhapHoc, 6).toISOString().slice(0, 10);
    }
    moTaHan = "Thực hiện trong 06 tháng đầu khóa";
  } else if (index === 3) {
    // Mốc 3: 6 tháng kể từ ngày nhập học (06 tháng đầu khóa)
    if (ngayNhapHoc && !isNaN(ngayNhapHoc.getTime())) {
      hanQuyDinh = addMonths(ngayNhapHoc, 6).toISOString().slice(0, 10);
    }
    moTaHan = "Thực hiện trong 06 tháng đầu khóa";
  } else if (index === 4) {
    // Mốc 4: hoàn thành trước hạn CQ 3 tháng
    const dHoanThanh = hanChinhQuy && !isNaN(hanChinhQuy.getTime()) ? addMonths(hanChinhQuy, -3) : null;
    if (dHoanThanh) hanQuyDinh = dHoanThanh.toISOString().slice(0, 10);
    moTaHan = "Phải xong trước khi đăng ký bảo vệ mốc 8; hồ sơ mốc 8 nộp chậm nhất 3 tháng trước khi hết hạn chính quy";

  } else if (index === 5) {
    // Mốc 5: Hoàn thành 3 tháng trước hạn chính quy
    if (hanChinhQuy && !isNaN(hanChinhQuy.getTime())) {
      hanQuyDinh = addMonths(hanChinhQuy, -3).toISOString().slice(0, 10);
    }
    moTaHan = "Phải xong trước khi đăng ký bảo vệ mốc 8; hồ sơ mốc 8 nộp chậm nhất 3 tháng trước khi hết hạn chính quy";
  } else if (index === 6) {
    // Mốc 6: Báo cáo định kỳ: không có hạn cố định
    moTaHan = "Định kỳ tháng 6 và tháng 12 hàng năm (không có hạn cố định)";
  } else if (index === 7) {
    // Mốc 7: Hoàn thành 3 tháng trước hạn chính quy
    if (hanChinhQuy && !isNaN(hanChinhQuy.getTime())) {
      hanQuyDinh = addMonths(hanChinhQuy, -3).toISOString().slice(0, 10);
    }
    moTaHan = "Phải xong trước khi đăng ký bảo vệ mốc 8; hồ sơ mốc 8 nộp chậm nhất 3 tháng trước khi hết hạn chính quy";
  } else if (index === 8) {
    // Mốc 8: Nộp hồ sơ đăng ký bảo vệ chậm nhất 3 tháng trước khi hết hạn chính quy
    if (hanChinhQuy && !isNaN(hanChinhQuy.getTime())) {
      hanQuyDinh = addMonths(hanChinhQuy, -3).toISOString().slice(0, 10);
    }
    moTaHan = "Chậm nhất 03 tháng trước khi hết thời hạn chính quy";
  } else if (index === 9) {
    // Mốc 9: Gửi phản biện tối đa 60 ngày làm việc sau mốc 8; bảo vệ trong vòng 12 tháng sau mốc 8
    if (moc8PassedAt && !isNaN(moc8PassedAt.getTime())) {
      const dBaoVe = addMonths(moc8PassedAt, 12);
      hanQuyDinh = dBaoVe.toISOString().slice(0, 10);
      moTaHan = "Nhà trường tổ chức trong vòng 12 tháng kể từ ngày mốc 8 được thông qua";
    } else {
      moTaHan = "Tối đa 60 ngày làm việc sau Mốc 8 (gửi phản biện); Bảo vệ cơ sở trong vòng 12 tháng";
    }
  }

  return { hanQuyDinh, moTaHan };
}

export function StudentDetailModal({
  isOpen,
  onClose,
  student,
}: StudentDetailModalProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "milestones">("overview");

  // State quản lý xem trước & tải tệp PDF
  const [pdfModal, setPdfModal] = useState<{
    isOpen: boolean;
    fileUrl: string | null;
    fileName: string;
    title: string;
    subtitle?: string;
    isLoading: boolean;
    error: string | null;
  }>({
    isOpen: false,
    fileUrl: null,
    fileName: "",
    title: "",
    isLoading: false,
    error: null,
  });

  const activeObjectUrlRef = React.useRef<string | null>(null);

  const closePdfModal = () => {
    if (activeObjectUrlRef.current) {
      URL.revokeObjectURL(activeObjectUrlRef.current);
      activeObjectUrlRef.current = null;
    }
    setPdfModal((prev) => ({ ...prev, isOpen: false, fileUrl: null, error: null }));
  };

  const handleViewDocument = async (
    fileId: string,
    fileName: string,
    title: string,
    subtitle?: string
  ) => {
    if (activeObjectUrlRef.current) {
      URL.revokeObjectURL(activeObjectUrlRef.current);
      activeObjectUrlRef.current = null;
    }
    setPdfModal({
      isOpen: true,
      fileUrl: null,
      fileName,
      title,
      subtitle,
      isLoading: true,
      error: null,
    });
    try {
      const blob = await DocumentService.downloadBlob(fileId);
      const url = URL.createObjectURL(blob);
      activeObjectUrlRef.current = url;
      setPdfModal((prev) => ({
        ...prev,
        fileUrl: url,
        isLoading: false,
      }));
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Không thể tải tài liệu PDF từ máy chủ";
      setPdfModal((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
    }
  };

  const handleDownloadDocument = async (fileId: string, fileName: string) => {
    try {
      const blob = await DocumentService.downloadBlob(fileId);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName.endsWith(".pdf") ? fileName : `${fileName}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1500);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Không thể tải file PDF");
    }
  };


  // Fetch chi tiết đầy đủ từ API GET /ncs/:id
  const studentId = isOpen && student?.id ? student.id : null;
  const { data: detailRaw, isLoading } = useAcademicStudentDetail(studentId);

  // Hợp nhất dữ liệu chi tiết
  const fullStudent: StudentDossier | null = useMemo(() => {
    if (!student) return null;
    if (detailRaw) {
      return mapBackendNcsToStudentDossier(detailRaw);
    }
    return student;
  }, [detailRaw, student]);

  // Lấy dữ liệu raw gốc từ backend
  const rawData = useMemo(() => {
    return (detailRaw || fullStudent?.rawDetails || {}) as BackendNcsRaw;
  }, [detailRaw, fullStudent]);

  // Danh sách tiến trình 9 mốc đào tạo đã được làm giàu
  const enrichedMilestones = useMemo(() => {
    if (!fullStudent) return [];

    const rawTienTrinhs = rawData.tienTrinhs || [];
    const moc8TienTrinh = rawTienTrinhs.find(
      (t) => t.moc?.thuTu === 8 || t.mocId === 8
    );
    const moc8PassedAt = moc8TienTrinh?.passedAt;

    return MILESTONE_DEFINITIONS.map((def) => {
      const existing = rawTienTrinhs.find(
        (t) => t.moc?.thuTu === def.index || t.mocId === def.index
      );

      const isPassed =
        existing?.trangThai === "PASSED" ||
        def.index < fullStudent.currentMilestoneIndex;
      const isCurrent =
        existing?.trangThai === "IN_PROGRESS" ||
        def.index === fullStudent.currentMilestoneIndex;

      // Ưu tiên hạn kế hoạch của backend hoặc đã có
      const hanKeHoach = existing?.hanKeHoach
        ? typeof existing.hanKeHoach === "string"
          ? existing.hanKeHoach.slice(0, 10)
          : new Date(existing.hanKeHoach).toISOString().slice(0, 10)
        : null;

      // Hạn quy định: Lấy từ backend nếu có, nếu không thì tính dự phòng
      const fallback = calculateFallbackMilestoneRule(
        def.index,
        fullStudent.ngayNhapHoc,
        fullStudent.hanChinhQuy,
        moc8PassedAt
      );

      const hanQuyDinh = existing?.hanQuyDinh || fallback.hanQuyDinh;
      const moTaHan = existing?.moTaHan || fallback.moTaHan;

      // Quy tắc: có hạn kế hoạch thì lấy hạn kế hoạch, không có thì lấy hạn quy định
      const hanApDung = hanKeHoach || existing?.hanApDung || hanQuyDinh;
      const loaiHan: "KE_HOACH" | "QUY_DINH" | "KHONG_CO" = hanKeHoach
        ? "KE_HOACH"
        : hanQuyDinh
          ? "QUY_DINH"
          : "KHONG_CO";

      return {
        ...def,
        existing,
        minhChungs: existing?.minhChungs || [],
        isPassed,
        isCurrent,
        trangThai: existing?.trangThai || (isPassed ? "PASSED" : isCurrent ? "IN_PROGRESS" : "CHUA_MO"),
        hanKeHoach,
        hanQuyDinh,
        moTaHan,
        hanApDung,
        loaiHan,
        passedAt: existing?.passedAt,
        submittedAt: existing?.submittedAt,
      };
    });
  }, [fullStudent, rawData]);

  if (!isOpen || !fullStudent) return null;

  const quyetDinhsList = rawData.quyetDinhs || [];

  // Lấy chi tiết GVHD từ phanCongs (nếu có)
  const gvhdChinhPhanCong = rawData.phanCongs?.find((p) => p.vaiTro === "HUONG_DAN_CHINH");
  const dongGvhdPhanCong = rawData.phanCongs?.find((p) => p.vaiTro === "DONG_HUONG_DAN");

  // Format các trường đào tạo
  const trinhDoText =
    fullStudent.trinhDoDauVao === "DAI_HOC"
      ? "Đại học (Thời gian: 48 tháng)"
      : "Thạc sĩ (Thời gian: 36 tháng)";

  const phuongThucText = (() => {
    const pt = fullStudent.phuongThucDaoTao;
    if (pt === "PHUONG_THUC_1" || pt === "1" || pt === "Phương thức 1") {
      return "Nghiên cứu chuyên sâu toàn thời gian";
    }
    if (pt === "PHUONG_THUC_2" || pt === "2" || pt === "Phương thức 2") {
      return "Nghiên cứu kết hợp các học phần chuyên môn";
    }
    if (pt === "TAP_TRUNG") return "Nghiên cứu chuyên sâu toàn thời gian";
    if (pt === "KHONG_TAP_TRUNG") return "Nghiên cứu kết hợp các học phần chuyên môn";
    return fullStudent.phuongThucDaoTaoText || pt || "—";
  })();

  const gioiTinhText =
    fullStudent.gioiTinh === "NAM"
      ? "Nam"
      : fullStudent.gioiTinh === "NU"
        ? "Nữ"
        : fullStudent.gioiTinh || "—";

  const statusBadge = (() => {
    switch (rawData.trangThai) {
      case "DANG_HOC":
        return <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">Đang học</span>;
      case "BAO_LUU":
        return <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">Bảo lưu</span>;
      case "BUOC_THOI_HOC":
        return <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-800">Buộc thôi học</span>;
      case "NGUNG_HOC":
        return <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-bold text-slate-700">Ngừng học</span>;
      case "DA_TOT_NGHIEP":
        return <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-800">Đã tốt nghiệp</span>;
      default:
        return <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">Đang học</span>;
    }
  })();

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 md:p-4 animate-in fade-in duration-150">
        <div className="relative w-full max-w-5xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden max-h-[94vh] flex flex-col">
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
                  <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-semibold text-white tracking-wide">
                    {fullStudent.code}
                  </span>
                  {isLoading && (
                    <span className="text-[10px] bg-white/15 px-2 py-0.5 rounded-full text-white/90 animate-pulse">
                      Đang đồng bộ chi tiết...
                    </span>
                  )}
                </div>
                <p className="text-xs text-white/80">
                  {fullStudent.name} • {fullStudent.department} • Khóa {fullStudent.cohort} ({fullStudent.admissionYear})
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

          {/* Tab Navigation */}
          <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50/80 px-6 pt-2">
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-colors ${activeTab === "overview"
                ? "border-[#164E9B] text-[#164E9B]"
                : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
            >
              <User className="size-4" />
              <span>Hồ sơ & Đào tạo</span>
            </button>

            <button
              onClick={() => setActiveTab("milestones")}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-colors ${activeTab === "milestones"
                ? "border-[#164E9B] text-[#164E9B]"
                : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
            >
              <FileCheck className="size-4" />
              <span>Tiến trình 9 mốc</span>
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-[#164E9B]">
                Mốc {fullStudent.currentMilestoneIndex}/9
              </span>
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* TAB 1: OVERVIEW & PERSONAL INFO */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Summary Status Bar */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Trạng thái học vụ</p>
                      <div className="mt-1 flex items-center gap-2">
                        {statusBadge}
                      </div>
                    </div>
                    <BookmarkCheck className="size-7 text-[#164E9B]/40" />
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Thời gian đào tạo còn lại</p>
                      <div className="mt-1 flex items-baseline gap-1.5">
                        <span className="text-2xl font-black text-[#0F2744]">
                          {fullStudent.remainingMonths}
                        </span>
                        <span className="text-xs text-slate-500">tháng</span>
                      </div>
                    </div>
                    <Clock className="size-7 text-[#164E9B]/40" />
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Tiến trình đào tạo</p>
                      <div className="mt-1 flex items-baseline gap-1.5">
                        <span className="text-2xl font-black text-[#164E9B]">
                          {fullStudent.currentMilestoneIndex}
                        </span>
                        <span className="text-xs text-slate-500">/ 9 mốc quy định</span>
                      </div>
                    </div>
                    <Layers className="size-7 text-[#164E9B]/40" />
                  </div>
                </div>

                {/* 1. Personal & Identification Information */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#164E9B] pb-3 border-b border-slate-100">
                    <User className="size-4" />
                    <span>1. Thông tin Cá nhân & Định danh Nghiên cứu sinh</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-4 text-xs">
                    <div>
                      <span className="text-slate-500 block">Họ và tên NCS:</span>
                      <strong className="text-slate-900 text-sm font-bold">{fullStudent.name}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Mã số học viên:</span>
                      <strong className="text-slate-900 font-mono font-bold text-sm text-[#164E9B]">{fullStudent.code}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Ngày sinh:</span>
                      <strong className="text-slate-800">{formatDate(fullStudent.ngaySinh)}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Giới tính:</span>
                      <strong className="text-slate-800">{gioiTinhText}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Số CCCD / CMND:</span>
                      <strong className="text-slate-800 font-mono">{fullStudent.cccd || "—"}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Email NCS:</span>
                      <strong className="text-slate-800 truncate block">{fullStudent.email || "—"}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Số điện thoại NCS:</span>
                      <strong className="text-slate-800">{fullStudent.phone || "—"}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Lớp sinh hoạt:</span>
                      <strong className="text-slate-800">{fullStudent.lop || "—"}</strong>
                    </div>
                  </div>
                </div>

                {/* 2. Academic Training & Milestones */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#164E9B] pb-3 border-b border-slate-100">
                    <GraduationCap className="size-4" />
                    <span>2. Thông tin Quản lý Đào tạo & Thời hạn</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4 text-xs">
                    <div>
                      <span className="text-slate-500 block">Chuyên ngành đào tạo:</span>
                      <strong className="text-slate-900 font-semibold">{fullStudent.department}</strong>
                      {rawData.nganh?.maNganh && (
                        <span className="text-[11px] text-slate-400 block">Mã ngành: {rawData.nganh.maNganh}</span>
                      )}
                    </div>
                    <div>
                      <span className="text-slate-500 block">Khóa học / Niên khóa:</span>
                      <strong className="text-slate-800">{fullStudent.cohort}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Năm tuyển sinh:</span>
                      <strong className="text-slate-800">{fullStudent.admissionYear || "—"}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Trình độ đầu vào:</span>
                      <strong className="text-slate-800">{trinhDoText}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Phương thức đào tạo:</span>
                      <strong className="text-slate-800">{phuongThucText}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Ngày nhập học:</span>
                      <strong className="text-slate-800">{formatDate(fullStudent.ngayNhapHoc)}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Hạn chính quy:</span>
                      <strong className="text-slate-900 font-semibold text-[#164E9B]">
                        {formatDate(fullStudent.hanChinhQuy)}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Hạn gia hạn đào tạo:</span>
                      <strong className="text-slate-800">
                        {fullStudent.hanGiaHan ? formatDate(fullStudent.hanGiaHan) : "Chưa gia hạn"}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Hạn buộc thôi học (Tối đa 72 tháng):</span>
                      <strong className="text-rose-700 font-semibold">
                        {formatDate(fullStudent.hanBuocThoiHoc)}
                      </strong>
                    </div>
                  </div>

                  {/* Status Change Reason if any */}
                  {(fullStudent.ngayChuyenTrangThai || fullStudent.lyDoChuyenTrangThai) && (
                    <div className="mt-4 p-3 rounded-lg bg-amber-50/80 border border-amber-200 text-xs text-amber-900">
                      <span className="font-bold">Ghi chú biến động trạng thái:</span>{" "}
                      Ngày chuyển: {formatDate(fullStudent.ngayChuyenTrangThai)} • Lý do: {fullStudent.lyDoChuyenTrangThai || "Không ghi"}
                    </div>
                  )}
                </div>

                {/* 3. Thesis Topic & Supervisors */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#164E9B] pb-3 border-b border-slate-100">
                    <BookOpen className="size-4" />
                    <span>3. Đề tài Luận án & Cán bộ Hướng dẫn</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-100">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#164E9B] block mb-1">
                      Đề tài nghiên cứu chính thức:
                    </span>
                    <p className="text-sm font-bold text-[#0F2744] italic">
                      “{fullStudent.thesisTopic}”
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    {/* GVHD chính */}
                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                          Cán bộ Hướng dẫn chính
                        </span>
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                          HD Chính
                        </span>
                      </div>

                      <strong className="text-slate-900 font-bold text-sm block">
                        {fullStudent.supervisorMain}
                      </strong>

                      <div className="space-y-1 text-slate-600 text-[11px] pt-1">
                        {gvhdChinhPhanCong?.gvhd?.email && (
                          <div className="flex items-center gap-1.5 text-slate-600">
                            <Mail className="size-3 text-slate-400" />
                            <span>{gvhdChinhPhanCong.gvhd.email}</span>
                          </div>
                        )}
                        {gvhdChinhPhanCong?.gvhd?.chuyenNganh && (
                          <p className="text-slate-500">
                            Chuyên ngành: {gvhdChinhPhanCong.gvhd.chuyenNganh}
                          </p>
                        )}
                        {(() => {
                          const qd = gvhdChinhPhanCong?.quyetDinh;
                          const fileId = qd?.fileId;
                          if (!qd?.soQuyetDinh || !fileId) return null;
                          return (
                            <div className="flex flex-wrap items-center gap-2 pt-0.5">
                              <p className="text-[#164E9B] font-medium">
                                QĐ phân công: {qd.soQuyetDinh} ({formatDate(qd.ngayQuyetDinh)})
                              </p>
                              {fileId && (
                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleViewDocument(
                                        fileId,
                                        `QD_Phan_cong_${(qd.soQuyetDinh || "gvhd").replace(/[\/\\]/g, "_")}.pdf`,
                                        `Quyết định phân công GVHD chính: ${qd.soQuyetDinh}`,
                                        `NCS: ${fullStudent.name}`
                                      )
                                    }
                                    title="Xem file quyết định (PDF)"
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 text-[11px] font-semibold text-[#164E9B] border border-blue-200 hover:bg-blue-100 cursor-pointer"
                                  >
                                    <Eye className="size-3" />
                                    <span>Xem</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleDownloadDocument(
                                        fileId,
                                        `QD_Phan_cong_${(qd.soQuyetDinh || "gvhd").replace(/[\/\\]/g, "_")}.pdf`
                                      )
                                    }
                                    title="Tải file quyết định (PDF)"
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white text-[11px] font-semibold text-slate-700 border border-slate-200 hover:bg-slate-50 cursor-pointer"
                                  >
                                    <Download className="size-3" />
                                    <span>Tải</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    </div>

                    {/* Đồng GVHD */}
                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                          Cán bộ Đồng hướng dẫn
                        </span>
                        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-[#164E9B]">
                          Đồng HD
                        </span>
                      </div>

                      <strong className="text-slate-900 font-bold text-sm block">
                        {fullStudent.supervisorCo || "Không có (Hướng dẫn độc lập)"}
                      </strong>

                      <div className="space-y-1 text-slate-600 text-[11px] pt-1">
                        {dongGvhdPhanCong?.gvhd?.email && (
                          <div className="flex items-center gap-1.5 text-slate-600">
                            <Mail className="size-3 text-slate-400" />
                            <span>{dongGvhdPhanCong.gvhd.email}</span>
                          </div>
                        )}
                        {dongGvhdPhanCong?.gvhd?.chuyenNganh && (
                          <p className="text-slate-500">
                            Chuyên ngành: {dongGvhdPhanCong.gvhd.chuyenNganh}
                          </p>
                        )}
                        {(() => {
                          const qd = dongGvhdPhanCong?.quyetDinh;
                          const fileId = qd?.fileId;
                          if (!qd?.soQuyetDinh || !fileId) return null;
                          return (
                            <div className="flex flex-wrap items-center gap-2 pt-0.5">
                              <p className="text-[#164E9B] font-medium">
                                QĐ phân công: {qd.soQuyetDinh} ({formatDate(qd.ngayQuyetDinh)})
                              </p>
                              {fileId && (
                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleViewDocument(
                                        fileId,
                                        `QD_Phan_cong_${(qd.soQuyetDinh || "dong_gvhd").replace(/[\/\\]/g, "_")}.pdf`,
                                        `Quyết định phân công Đồng GVHD: ${qd.soQuyetDinh}`,
                                        `NCS: ${fullStudent.name}`
                                      )
                                    }
                                    title="Xem file quyết định (PDF)"
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 text-[11px] font-semibold text-[#164E9B] border border-blue-200 hover:bg-blue-100 cursor-pointer"
                                  >
                                    <Eye className="size-3" />
                                    <span>Xem</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleDownloadDocument(
                                        fileId,
                                        `QD_Phan_cong_${(qd.soQuyetDinh || "dong_gvhd").replace(/[\/\\]/g, "_")}.pdf`
                                      )
                                    }
                                    title="Tải file quyết định (PDF)"
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white text-[11px] font-semibold text-slate-700 border border-slate-200 hover:bg-slate-50 cursor-pointer"
                                  >
                                    <Download className="size-3" />
                                    <span>Tải</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Legal Decisions List */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#164E9B] pb-3 border-b border-slate-100">
                    <FileText className="size-4" />
                    <span>4. Quyết định Học vụ Ban hành ({quyetDinhsList.length})</span>
                  </div>

                  {quyetDinhsList.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-slate-200 p-6 text-center text-xs text-slate-500">
                      Chưa có quyết định học vụ nào được lưu trong hệ thống cho NCS này.
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {quyetDinhsList.map((qd, idx) => {
                        const fileId = qd.fileId;
                        return (
                        <div key={qd.id || idx} className="py-2.5 flex items-center justify-between text-xs gap-3">
                          <div className="space-y-0.5 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-mono font-bold text-[#164E9B]">
                                {qd.soQuyetDinh || "QĐ chưa số"}
                              </span>
                              <span className="text-[11px] text-slate-400">
                                Ngày: {formatDate(qd.ngayQuyetDinh)}
                              </span>
                              {qd.loai && (
                                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                                  {qd.loai}
                                </span>
                              )}
                            </div>
                            <p className="text-slate-700">{qd.ghiChu || "Quyết định học vụ"}</p>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            {fileId ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleViewDocument(
                                      fileId,
                                      `Quyet_dinh_${(qd.soQuyetDinh || "hoc_vu").replace(/[\/\\]/g, "_")}.pdf`,
                                      `Quyết định: ${qd.soQuyetDinh || "Học vụ"}`,
                                      `${qd.loai || "Quyết định"} • Ngày: ${formatDate(qd.ngayQuyetDinh)}`
                                    )
                                  }
                                  title="Xem file quyết định (PDF)"
                                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-blue-200 bg-blue-50 text-xs font-semibold text-[#164E9B] hover:bg-blue-100 transition-colors cursor-pointer"
                                >
                                  <Eye className="size-3.5" />
                                  <span>Xem QĐ</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleDownloadDocument(
                                      fileId,
                                      `Quyet_dinh_${(qd.soQuyetDinh || "hoc_vu").replace(/[\/\\]/g, "_")}.pdf`
                                    )
                                  }
                                  title="Tải file quyết định (PDF)"
                                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                                >
                                  <Download className="size-3.5" />
                                  <span>Tải về</span>
                                </button>
                              </>
                            ) : (
                              <span className="text-[11px] text-slate-400 italic">
                                Chưa có tệp PDF
                              </span>
                            )}
                          </div>
                        </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: 9 MILESTONES PROGRESSION */}
            {activeTab === "milestones" && (
              <div className="space-y-4">
                {/* Top Banner Guide */}
                <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">
                      Quy định Thời hạn 9 Mốc Đào tạo Nghiên cứu sinh
                    </h4>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      Hệ thống ưu tiên hiển thị <strong className="text-purple-700">Hạn kế hoạch</strong> (nếu NCS đã lập kế hoạch). Nếu chưa có, áp dụng chuẩn <strong className="text-[#164E9B]">Hạn quy định</strong> theo quy chế.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 text-[11px] font-bold">
                      <Sparkles className="size-3" /> Hạn kế hoạch
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-100 text-[#164E9B] text-[11px] font-bold">
                      <Calendar className="size-3" /> Hạn quy định
                    </span>
                  </div>
                </div>

                {/* Milestones List */}
                <div className="space-y-3">
                  {enrichedMilestones.map((m) => {
                    return (
                      <div
                        key={m.index}
                        className={`rounded-xl border p-4 text-xs transition-all ${m.isCurrent
                          ? "border-[#164E9B] bg-blue-50/50 ring-1 ring-[#164E9B]/30 shadow-xs"
                          : m.isPassed
                            ? "border-emerald-200 bg-emerald-50/30"
                            : "border-slate-200 bg-white"
                          }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          {/* Title & Step info */}
                          <div className="flex items-start gap-3">
                            <span
                              className={`flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${m.isPassed
                                ? "bg-emerald-600 text-white"
                                : m.isCurrent
                                  ? "bg-[#164E9B] text-white"
                                  : "bg-slate-200 text-slate-600"
                                }`}
                            >
                              {m.isPassed ? <Check className="size-4 stroke-[3]" /> : m.index}
                            </span>

                            <div className="space-y-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span
                                  className={`text-sm font-bold ${m.isCurrent
                                    ? "text-[#164E9B]"
                                    : m.isPassed
                                      ? "text-emerald-950"
                                      : "text-slate-800"
                                    }`}
                                >
                                  {m.name}
                                </span>

                                {/* Badge loại hạn */}
                                {m.loaiHan === "KE_HOACH" ? (
                                  <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-bold text-purple-800">
                                    Hạn kế hoạch
                                  </span>
                                ) : m.loaiHan === "QUY_DINH" ? (
                                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-[#164E9B]">
                                    Hạn quy định
                                  </span>
                                ) : (
                                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                                    Định kỳ
                                  </span>
                                )}
                              </div>

                              {/* Căn cứ & Quy định */}
                              <p className="text-[11px] text-slate-500 font-medium">
                                Căn cứ quy chế: {m.moTaHan}
                              </p>

                              {/* Ngày hoàn thành / nghiệm thu nếu có */}
                              {m.passedAt && (
                                <div className="text-[11px] text-emerald-800 font-semibold flex items-center gap-1 pt-1">
                                  <Check className="size-3.5 text-emerald-600" />
                                  <span>Đã nghiệm thu / thông qua ngày: {formatDate(m.passedAt)}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Deadline Box & Status Badge */}
                          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 shrink-0">
                            {/* Trạng thái mốc */}
                            <div>
                              {m.isPassed ? (
                                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
                                  Đã đạt (Passed)
                                </span>
                              ) : m.isCurrent ? (
                                <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-[11px] font-bold text-[#164E9B] animate-pulse">
                                  Đang thực hiện
                                </span>
                              ) : m.trangThai === "SUBMITTED" ? (
                                <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold text-amber-800">
                                  Chờ duyệt hồ sơ
                                </span>
                              ) : (
                                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-500">
                                  Chưa mở
                                </span>
                              )}
                            </div>

                            {/* Ngày hạn áp dụng */}
                            <div className="text-right">
                              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                                Hạn áp dụng
                              </span>
                              <span className={`text-xs font-bold font-mono ${m.loaiHan === "KE_HOACH"
                                ? "text-purple-700 font-black"
                                : m.loaiHan === "QUY_DINH"
                                  ? "text-[#164E9B] font-bold"
                                  : "text-slate-500"
                                }`}>
                                {m.hanApDung ? formatDate(m.hanApDung) : "Theo định kỳ"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* KHỐI MINH CHỨNG & PHIẾU ĐIỂM CỦA MỐC */}
                        {m.minhChungs && m.minhChungs.length > 0 && (
                          <div className="mt-3.5 pt-3 border-t border-slate-200/80 space-y-2.5">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-800 flex items-center gap-1.5 text-[11px] uppercase tracking-wide">
                                <FileText className="size-3.5 text-[#164E9B]" />
                                Hồ sơ minh chứng ({m.minhChungs.length} lần nộp)
                              </span>
                              {m.minhChungs.some((mc) => mc.diemTrungBinh != null) && (
                                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-2 py-0.5 font-mono text-[11px] font-bold text-emerald-800">
                                  <Award className="size-3 text-emerald-700" />
                                  Điểm TB: {Number(m.minhChungs.find((mc) => mc.diemTrungBinh != null)?.diemTrungBinh).toFixed(1)} / 10.0
                                </span>
                              )}
                            </div>

                            <div className="space-y-2">
                              {m.minhChungs.map((mc, mcIdx) => {
                                const fileId = mc.fileId;
                                const mcStatusBadge =
                                  mc.trangThai === "PASSED" ? (
                                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                                      Đã duyệt (Passed)
                                    </span>
                                  ) : mc.trangThai === "REJECTED" ? (
                                    <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-800">
                                      Từ chối (Rejected)
                                    </span>
                                  ) : (
                                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                                      Chờ duyệt (Pending)
                                    </span>
                                  );

                                return (
                                  <div
                                    key={mc.id || mcIdx}
                                    className="rounded-lg border border-slate-200 bg-white p-3 space-y-2 shadow-2xs"
                                  >
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                      <div className="flex items-center gap-2">
                                        <span className="font-bold text-slate-900">
                                          Lần nộp #{mc.lanNop}
                                        </span>
                                        <span className="text-[11px] text-slate-400">
                                          ({formatDate(mc.ngayNop)})
                                        </span>
                                        {mcStatusBadge}
                                      </div>

                                      {/* Nút Xem và Tải file minh chứng */}
                                      <div className="flex items-center gap-1.5">
                                        {fileId ? (
                                          <>
                                            <button
                                              type="button"
                                              onClick={() =>
                                                handleViewDocument(
                                                  fileId,
                                                  `Minh_chung_Moc_${m.index}_Lan_${mc.lanNop}.pdf`,
                                                  `Minh chứng ${m.name} (Lần ${mc.lanNop})`,
                                                  `NCS: ${fullStudent.name} (${fullStudent.code}) • Nộp: ${formatDate(mc.ngayNop)}`
                                                )
                                              }
                                              title="Xem tệp PDF minh chứng"
                                              className="inline-flex items-center gap-1 rounded-md border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-[#164E9B] hover:bg-blue-100 transition-colors cursor-pointer"
                                            >
                                              <Eye className="size-3" />
                                              <span>Xem file minh chứng</span>
                                            </button>
                                            <button
                                              type="button"
                                              onClick={() =>
                                                handleDownloadDocument(
                                                  fileId,
                                                  `Minh_chung_Moc_${m.index}_Lan_${mc.lanNop}.pdf`
                                                )
                                              }
                                              title="Tải tệp PDF minh chứng"
                                              className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                                            >
                                              <Download className="size-3" />
                                              <span>Tải về</span>
                                            </button>
                                          </>
                                        ) : (
                                          <span className="text-[11px] text-slate-400 italic">
                                            Chưa đính kèm tệp PDF
                                          </span>
                                        )}
                                      </div>
                                    </div>

                                    {mc.ghiChuNcs && (
                                      <p className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded border border-slate-100">
                                        <strong className="text-slate-700">Ghi chú NCS:</strong> {mc.ghiChuNcs}
                                      </p>
                                    )}

                                    {mc.lyDoTuChoi && (
                                      <p className="text-[11px] text-rose-700 bg-rose-50 p-2 rounded border border-rose-100">
                                        <strong className="text-rose-800">Lý do từ chối:</strong> {mc.lyDoTuChoi}
                                      </p>
                                    )}

                                    {/* Bảng phiếu điểm / phiếu nhận xét (nếu có) */}
                                    {mc.phieuNhanXets && mc.phieuNhanXets.length > 0 && (
                                      <div className="mt-2 space-y-1.5 border-t border-slate-100 pt-2">
                                        <div className="flex items-center justify-between text-[11px]">
                                          <span className="font-bold text-slate-700 flex items-center gap-1">
                                            <Award className="size-3.5 text-amber-600" />
                                            Phiếu điểm / phiếu nhận xét của Hội đồng ({mc.phieuNhanXets.length} phiếu):
                                          </span>
                                        </div>
                                        <div className="divide-y divide-slate-100 rounded-lg border border-slate-200 overflow-hidden text-[11px]">
                                          {mc.phieuNhanXets.map((pnx, pIdx) => (
                                            <div
                                              key={pnx.id || pIdx}
                                              className="flex flex-wrap items-center justify-between gap-2 bg-slate-50/60 p-2 hover:bg-slate-50"
                                            >
                                              <div className="space-y-0.5">
                                                <div className="flex items-center gap-2">
                                                  <span className="font-bold text-slate-800">
                                                    {pIdx + 1}. {pnx.tenNguoiCham}
                                                  </span>
                                                  <span className="text-slate-500 text-[10px]">
                                                    ({pnx.donViNguoiCham || "Hội đồng chuyên môn"})
                                                  </span>
                                                </div>
                                                {pnx.nhanXet && (
                                                  <p className="text-slate-600 text-[11px] italic">
                                                    &ldquo;{pnx.nhanXet}&rdquo;
                                                  </p>
                                                )}
                                              </div>
                                              <div className="flex items-center gap-2 shrink-0">
                                                <span className="font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded text-xs">
                                                  {Number(pnx.diem).toFixed(1)} / 10.0
                                                </span>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-3.5">
            <button
              onClick={onClose}
              className="rounded-lg bg-[#164E9B] px-5 py-2 text-xs font-bold text-white hover:bg-[#113E7D] transition-colors shadow-xs cursor-pointer"
            >
              Đóng hồ sơ
            </button>
          </div>
        </div>
      </div>

      {/* PDF Preview & Download Modal */}
      <PdfViewer
        isOpen={pdfModal.isOpen}
        onClose={closePdfModal}
        fileUrl={pdfModal.fileUrl}
        fileName={pdfModal.fileName}
        title={pdfModal.title}
        subtitle={pdfModal.subtitle}
        isLoading={pdfModal.isLoading}
        error={pdfModal.error}
        allowDownload={true}
      />
    </>
  );
}

export default StudentDetailModal;
