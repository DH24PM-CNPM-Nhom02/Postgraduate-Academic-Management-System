"use client";

import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  Award,
  CheckCircle2,
  Clock,
  Eye,
  FileText,
  GraduationCap,
  Info,
  Lock,
  RefreshCw,
  Unlock,
  X,
} from "lucide-react";
import type {
  EvidenceItem,
  MilestoneProgressItem,
} from "@/src/types/ui/progress";
import type {
  SupervisedStudent,
  StudentProgressDrawerProps,
} from "@/src/types/ui/supervisor";
import { useMyNcsDetail } from "@/src/hooks/use-academic";
import { mapBackendNcsDetailToSupervisedStudent } from "@/src/services/gvhd";
import { DocumentService } from "@/src/services/document";
import { PdfViewer } from "@/src/components/upload/PdfViewer";

interface PreviewPdfState {
  fileUrl?: string;
  fileName: string;
  title: string;
  subtitle?: string;
}

function formatDateUtc(isoString?: string): string {
  if (!isoString) return "--/--/----";
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return isoString;
  const day = String(d.getUTCDate()).padStart(2, "0");
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const year = d.getUTCFullYear();
  return `${day}/${month}/${year}`;
}

function StudentProgressDrawerInner({
  student,
  onClose,
}: {
  student: SupervisedStudent;
  onClose: () => void;
}) {
  const titleId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Tích hợp API GET /gvhd/me/ncs/:ncsId lấy toàn bộ tiến trình & lịch sử đào tạo
  const {
    data: ncsDetailRaw,
    isLoading: isDetailLoading,
    isError: isDetailError,
    error: detailError,
    refetch: refetchDetail,
  } = useMyNcsDetail(student.id, true);

  const currentStudent = useMemo(() => {
    if (!ncsDetailRaw) return student;
    return mapBackendNcsDetailToSupervisedStudent(ncsDetailRaw, student);
  }, [ncsDetailRaw, student]);

  // Trạng thái mở modal PDF Viewer với Blob URL an toàn
  const [previewPdf, setPreviewPdf] = useState<PreviewPdfState | null>(null);
  const [previewBlobUrl, setPreviewBlobUrl] = useState<string | null>(null);
  const [isLoadingPdf, setIsLoadingPdf] = useState<boolean>(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  const handleOpenPdf = async (
    fileId?: string,
    fileUrl?: string,
    fileName?: string,
    title?: string,
    subtitle?: string
  ) => {
    const safeFileName = fileName || "tai-lieu.pdf";
    const safeTitle = title || "Xem trước tài liệu PDF";
    setPreviewPdf({
      fileUrl,
      fileName: safeFileName,
      title: safeTitle,
      subtitle,
    });
    setPdfError(null);

    if (fileId) {
      setIsLoadingPdf(true);
      try {
        const { objectUrl } = await DocumentService.createPreviewUrl(fileId);
        setPreviewBlobUrl(objectUrl);
      } catch (err) {
        console.warn("Không thể tải PDF qua DocumentService:", err);
        if (fileUrl) {
          setPreviewBlobUrl(null);
        } else {
          setPdfError(
            err instanceof Error ? err.message : "Không thể tải tệp PDF minh chứng."
          );
        }
      } finally {
        setIsLoadingPdf(false);
      }
    } else {
      setPreviewBlobUrl(null);
      setIsLoadingPdf(false);
    }
  };

  const handleClosePdf = () => {
    if (previewBlobUrl) {
      URL.revokeObjectURL(previewBlobUrl);
      setPreviewBlobUrl(null);
    }
    setPreviewPdf(null);
    setPdfError(null);
    setIsLoadingPdf(false);
  };

  useEffect(() => {
    return () => {
      if (previewBlobUrl) {
        URL.revokeObjectURL(previewBlobUrl);
      }
    };
  }, [previewBlobUrl]);

  useEffect(() => {
    previousFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const timer = window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 0);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !previewPdf) {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
      previousFocusRef.current?.focus?.();
    };
  }, [onClose, previewPdf]);

  return (
    <>
      <div
        className="fixed inset-0 z-50 overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div
          onClick={onClose}
          className="fixed inset-0 bg-[#0F2744]/50 backdrop-blur-xs transition-opacity"
          aria-hidden="true"
        />

        <div className="fixed inset-y-0 right-0 flex max-w-full pl-6 sm:pl-10">
          <div className="flex w-screen max-w-3xl flex-col border-l border-border bg-[#F0F5FA] shadow-2xl lg:max-w-4xl">
            {/* Header Drawer */}
            <div className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-border bg-card px-5 py-4 sm:px-6">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#0F2744] text-white">
                  <GraduationCap className="size-6" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2
                      id={titleId}
                      className="text-base font-bold tracking-tight text-foreground sm:text-lg"
                    >
                      {currentStudent.hoTen}
                    </h2>
                    <span className="rounded-md bg-muted px-2 py-0.5 font-mono text-xs font-bold text-foreground">
                      {currentStudent.mshv}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                        currentStudent.vaiTro === "HUONG_DAN_CHINH"
                          ? "bg-[#164E9B]/10 text-[#164E9B]"
                          : currentStudent.vaiTro === "DONG_HUONG_DAN"
                          ? "bg-slate-100 text-slate-700"
                          : "bg-amber-50 text-amber-800"
                      }`}
                    >
                      {currentStudent.vaiTro === "HUONG_DAN_CHINH"
                        ? `GVHD Chính (${currentStudent.trongSo})`
                        : currentStudent.vaiTro === "DONG_HUONG_DAN"
                        ? `Đồng hướng dẫn (${currentStudent.trongSo})`
                        : `Chưa xác định vai trò (${currentStudent.trongSo})`}
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    Lớp: <strong className="text-foreground">{currentStudent.lop}</strong>{" "}
                    • {currentStudent.khoaDaoTao} • Chuyên ngành:{" "}
                    <strong className="text-foreground">
                      {currentStudent.chuyenNganh}
                    </strong>
                  </p>
                </div>
              </div>

              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                className="inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B]"
                aria-label="Đóng bảng chi tiết tiến độ"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Thanh thông báo trạng thái đồng bộ API */}
            {isDetailLoading && (
              <div
                role="status"
                className="flex items-center gap-2 border-b border-border bg-blue-50/80 px-5 py-2 text-xs font-medium text-[#164E9B]"
              >
                <RefreshCw className="size-3.5 animate-spin" aria-hidden="true" />
                <span>Đang đồng bộ dữ liệu tiến trình & lịch sử đào tạo từ máy chủ...</span>
              </div>
            )}

            {isDetailError && (
              <div
                role="alert"
                className="flex flex-wrap items-center justify-between gap-2 border-b border-rose-200 bg-rose-50 px-5 py-2.5 text-xs text-rose-900"
              >
                <div className="flex items-center gap-2">
                  <AlertCircle className="size-4 shrink-0 text-rose-600" aria-hidden="true" />
                  <span>
                    Không thể tải dữ liệu tiến trình từ máy chủ:{" "}
                    {detailError instanceof Error ? detailError.message : "Lỗi kết nối"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => refetchDetail()}
                  className="inline-flex cursor-pointer items-center gap-1 font-semibold text-rose-800 underline hover:text-rose-950"
                >
                  <RefreshCw className="size-3" aria-hidden="true" />
                  <span>Thử lại</span>
                </button>
              </div>
            )}

            {/* Nội dung cuộn */}
            <div className="flex-1 space-y-5 overflow-y-auto p-4 sm:p-6">
              {/* Khối Đề tài Luận án */}
              <section
                aria-label="Thông tin đề tài và tiến độ tổng hợp"
                className="space-y-3.5 rounded-xl border border-border bg-card p-5 shadow-2xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-2.5">
                  <h3 className="text-sm font-bold text-[#0F2744]">
                    Đề tài Luận án Tiến sĩ
                  </h3>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold ${
                      currentStudent.daHetHan
                        ? "bg-rose-50 text-rose-800"
                        : currentStudent.soNgayConLai !== null &&
                          currentStudent.soNgayConLai !== undefined &&
                          currentStudent.soNgayConLai <= 30
                          ? "bg-amber-50 text-amber-800"
                          : "bg-slate-100 text-slate-800"
                    }`}
                  >
                    <Clock
                      className={`size-3.5 ${
                        currentStudent.daHetHan
                          ? "text-rose-600"
                          : currentStudent.soNgayConLai !== null &&
                            currentStudent.soNgayConLai !== undefined &&
                            currentStudent.soNgayConLai <= 30
                            ? "text-amber-600"
                            : "text-slate-600"
                      }`}
                      aria-hidden="true"
                    />
                    <span>
                      {currentStudent.daHetHan === null ||
                      currentStudent.daHetHan === undefined ||
                      currentStudent.soThangConLai === null
                        ? "Chưa cập nhật hạn đào tạo"
                        : currentStudent.daHetHan
                          ? "Đã hết hạn đào tạo"
                          : currentStudent.soNgayConLai === 0
                            ? "Hôm nay là hạn chót đào tạo"
                            : currentStudent.soNgayConLai !== null &&
                              currentStudent.soNgayConLai !== undefined &&
                              currentStudent.soNgayConLai <= 30
                              ? `Còn ${currentStudent.soNgayConLai} ngày đào tạo`
                              : `Còn ${currentStudent.soThangConLai} tháng đào tạo`}
                    </span>
                  </span>
                </div>

                <p className="text-sm font-semibold leading-relaxed text-foreground sm:text-base">
                  {currentStudent.tenDeTai}
                </p>

                {currentStudent.coMocCanHoanThien && currentStudent.thongTinMocTuChoi && (
                  <div className="space-y-2 rounded-xl bg-rose-50/85 p-4 text-rose-950">
                    <div className="flex items-center gap-2 text-xs font-bold text-rose-800">
                      <AlertTriangle
                        className="size-4 shrink-0 text-rose-600"
                        aria-hidden="true"
                      />
                      <span>
                        Mốc {currentStudent.thongTinMocTuChoi.mocSo} (
                        {currentStudent.thongTinMocTuChoi.tenMoc}) cần hoàn thiện
                      </span>
                    </div>
                    {currentStudent.thongTinMocTuChoi.lyDoTuChoi && (
                      <p className="pl-6 text-xs font-medium italic leading-relaxed text-rose-900">
                        &ldquo;{currentStudent.thongTinMocTuChoi.lyDoTuChoi}&rdquo;
                      </p>
                    )}
                    {(currentStudent.thongTinMocTuChoi.nguoiDuyet ||
                      currentStudent.thongTinMocTuChoi.ngayDuyet) && (
                      <div className="flex flex-wrap items-center gap-2 pl-6 text-[11px] font-medium text-rose-800">
                        {currentStudent.thongTinMocTuChoi.nguoiDuyet && (
                          <span>
                            Người duyệt:{" "}
                            <strong>{currentStudent.thongTinMocTuChoi.nguoiDuyet}</strong>
                          </span>
                        )}
                        {currentStudent.thongTinMocTuChoi.nguoiDuyet &&
                          currentStudent.thongTinMocTuChoi.ngayDuyet && (
                            <span aria-hidden="true">•</span>
                          )}
                        {currentStudent.thongTinMocTuChoi.ngayDuyet && (
                          <span>
                            Ngày: {formatDateUtc(currentStudent.thongTinMocTuChoi.ngayDuyet)}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-1.5 pt-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-muted-foreground">
                      Tiến độ tổng thể:{" "}
                      <strong className="font-mono text-[#164E9B] tabular-nums">
                        {currentStudent.soMocHoanThanh}/{currentStudent.tongSoMoc} mốc (
                        {currentStudent.tienDoPhanTram}%)
                      </strong>
                    </span>
                    <span className="font-semibold text-foreground">
                      Hiện tại: Mốc {currentStudent.mocHienTai}
                    </span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full transition-all duration-300 motion-reduce:transition-none ${
                        currentStudent.coMocCanHoanThien ? "bg-rose-500" : "bg-[#164E9B]"
                      }`}
                      style={{
                        width: `${Math.min(
                          Math.max(currentStudent.tienDoPhanTram, 0),
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </section>

              {/* Stepper ngang 9 mốc */}
              <section
                aria-label="Lộ trình 9 mốc"
                className="rounded-xl border border-border bg-card p-5 shadow-2xs"
              >
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-border pb-2.5">
                  <h3 className="text-sm font-bold text-[#0F2744]">
                    Lộ trình 9 mốc đào tạo (Chế độ xem GVHD)
                  </h3>
                  <span className="rounded-full bg-[#164E9B]/10 px-2.5 py-0.5 text-xs font-semibold text-[#164E9B]">
                    NCS đang ở Mốc {currentStudent.mocHienTai}
                  </span>
                </div>

                <div className="overflow-x-auto pb-2 pt-1">
                  <div className="relative flex min-w-[720px] items-start justify-between">
                    {currentStudent.milestones.map((m, index) => {
                      const isPassed = m.trangThai === "PASSED";
                      const isRejected = m.trangThai === "REJECTED";
                      const isPending = m.trangThai === "PENDING_REVIEW";
                      const isUnlocked = m.trangThai === "UNLOCKED";
                      const isCurrent = m.thuTu === currentStudent.mocHienTai;
                      const isLast = index === currentStudent.milestones.length - 1;

                      return (
                        <div
                          key={m.id || m.thuTu}
                          className="relative flex flex-1 flex-col items-center p-1 text-center"
                        >
                          {!isLast && (
                            <div
                              aria-hidden="true"
                              className={`absolute left-1/2 top-4 z-0 h-[2px] w-full ${
                                isPassed ? "bg-[#164E9B]" : "bg-border"
                              }`}
                            />
                          )}

                          <div
                            className={`relative z-10 flex size-8 items-center justify-center rounded-full border-2 text-xs font-bold ${
                              isPassed
                                ? "border-emerald-600 bg-emerald-600 text-white"
                                : isRejected
                                  ? "border-rose-600 bg-rose-600 text-white"
                                  : isPending
                                    ? "border-amber-500 bg-amber-500 text-white"
                                    : isUnlocked
                                      ? "border-[#164E9B] bg-[#164E9B] text-white"
                                      : "border-border bg-muted text-muted-foreground"
                            } ${
                              isCurrent ? "ring-2 ring-[#164E9B] ring-offset-2" : ""
                            }`}
                            title={`Mốc ${m.thuTu}: ${m.tenMoc}`}
                          >
                            {isPassed ? (
                              <CheckCircle2 className="size-4" />
                            ) : isRejected ? (
                              <AlertCircle className="size-4" />
                            ) : isPending ? (
                              <Clock className="size-4" />
                            ) : isUnlocked ? (
                              <Unlock className="size-3.5" />
                            ) : (
                              <Lock className="size-3.5" />
                            )}
                          </div>

                          <div className="mt-2 max-w-[85px] space-y-0.5">
                            <p
                              className={`text-[11px] font-bold leading-tight ${
                                isCurrent
                                  ? "text-[#164E9B]"
                                  : isRejected
                                    ? "text-rose-700"
                                    : isPassed
                                      ? "text-emerald-700"
                                      : "text-muted-foreground"
                              }`}
                            >
                              Mốc {m.thuTu}
                            </p>
                            <span
                              className={`inline-block rounded-full border px-1.5 py-0.5 text-[10px] font-medium ${
                                isPassed
                                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                  : isRejected
                                    ? "border-rose-200 bg-rose-50 text-rose-700"
                                    : isPending
                                      ? "border-amber-200 bg-amber-50 text-amber-800"
                                      : "border-border bg-muted text-muted-foreground"
                              }`}
                            >
                              {isPassed
                                ? "Đạt"
                                : isRejected
                                  ? "Cần sửa"
                                  : isPending
                                    ? "Chờ duyệt"
                                    : isUnlocked
                                      ? "Đang mở"
                                      : "Khóa"}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>

              {/* Danh sách chi tiết 9 thẻ mốc */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-sm font-bold text-foreground">
                    {currentStudent.tongSoMoc > 0
                      ? `Chi tiết hồ sơ ${currentStudent.tongSoMoc} mốc đào tạo`
                      : "Chi tiết hồ sơ mốc đào tạo"}
                  </h3>
                  <span className="font-mono text-xs text-muted-foreground">
                    {currentStudent.tongSoMoc > 0
                      ? `${currentStudent.soMocHoanThanh}/${currentStudent.tongSoMoc} đã đạt`
                      : "Chưa có mốc"}
                  </span>
                </div>

                {currentStudent.milestones.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-border bg-card p-6 text-center text-sm text-muted-foreground">
                    Chưa có dữ liệu tiến trình mốc đào tạo được gán cho NCS này.
                  </div>
                ) : (
                  currentStudent.milestones.map((m: MilestoneProgressItem) => {
                    const isPassed = m.trangThai === "PASSED";
                    const isRejected = m.trangThai === "REJECTED";
                    const isPending = m.trangThai === "PENDING_REVIEW";
                    const isUnlocked = m.trangThai === "UNLOCKED";
                    const isCurrent = m.thuTu === currentStudent.mocHienTai;

                    return (
                      <article
                        key={m.id || m.thuTu}
                        className={`overflow-hidden rounded-xl border bg-card transition-colors ${
                          isRejected
                            ? "border-rose-300"
                            : isPending
                              ? "border-amber-300"
                              : isPassed
                                ? "border-emerald-200"
                                : isCurrent
                                  ? "border-[#164E9B]/40"
                                  : "border-border bg-muted/25"
                        }`}
                      >
                        <div className="space-y-3 p-4 sm:p-5">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="flex items-start gap-3">
                              <div
                                className={`flex size-9 shrink-0 items-center justify-center rounded-xl font-mono text-xs font-bold ${
                                  isPassed
                                    ? "bg-emerald-600 text-white"
                                    : isRejected
                                      ? "bg-rose-600 text-white"
                                      : isPending
                                        ? "bg-amber-500 text-white"
                                        : isUnlocked
                                          ? "bg-[#164E9B] text-white"
                                          : "bg-muted text-muted-foreground"
                                }`}
                              >
                                {String(m.thuTu).padStart(2, "0")}
                              </div>

                              <div className="space-y-1">
                                <h4 className="text-sm font-bold text-foreground sm:text-base">
                                  {m.tenMoc}
                                </h4>
                                <div className="flex flex-wrap items-center gap-1.5">
                                  <span className="rounded bg-muted px-2 py-0.5 text-[11px] font-semibold text-foreground">
                                    Mốc {m.thuTu}/9
                                  </span>
                                  {m.thoiGianDuKien && (
                                    <span className="rounded bg-muted px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
                                      {m.thoiGianDuKien}
                                    </span>
                                  )}
                                  {m.yeuCauDiem && (
                                    <span className="inline-flex items-center gap-1 rounded bg-[#164E9B]/10 px-2 py-0.5 font-mono text-[11px] font-medium text-[#164E9B]">
                                      <Award className="size-3" aria-hidden="true" />
                                      Có chấm điểm
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="shrink-0">
                              {isPassed ? (
                                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                                  <CheckCircle2 className="size-3.5" aria-hidden="true" />
                                  Đã hoàn thành
                                </span>
                              ) : isRejected ? (
                                <span className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700">
                                  <AlertCircle className="size-3.5" aria-hidden="true" />
                                  Cần nộp lại
                                </span>
                              ) : isPending ? (
                                <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                                  <Clock className="size-3.5" aria-hidden="true" />
                                  Đang chờ duyệt
                                </span>
                              ) : isUnlocked ? (
                                <span className="inline-flex items-center gap-1 rounded-full border border-[#164E9B]/25 bg-[#164E9B]/10 px-2.5 py-0.5 text-xs font-semibold text-[#164E9B]">
                                  <Unlock className="size-3.5" aria-hidden="true" />
                                  Đang thực hiện
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                                  <Lock className="size-3.5" aria-hidden="true" />
                                  Đang khóa
                                </span>
                              )}
                            </div>
                          </div>

                          {m.moTa && (
                            <p className="text-xs leading-relaxed text-muted-foreground">
                              {m.moTa}
                            </p>
                          )}

                          {m.thuTu === 8 && (
                            <div className="flex items-start gap-2.5 rounded-xl bg-[#164E9B]/8 p-3.5 text-xs text-foreground">
                              <Info
                                className="mt-0.5 size-4 shrink-0 text-[#164E9B]"
                                aria-hidden="true"
                              />
                              <p className="leading-relaxed">
                                <strong className="text-[#164E9B]">Lưu ý Mốc 8:</strong>{" "}
                                NCS cần gộp các bài báo khoa học thành 1 file PDF duy nhất.
                              </p>
                            </div>
                          )}

                          {isRejected && (
                            <div className="space-y-2 rounded-xl bg-rose-50/85 p-3.5 text-xs text-rose-950">
                              <p className="font-semibold text-rose-800">
                                Lý do chưa đạt yêu cầu:
                              </p>
                              <p className="font-medium italic leading-relaxed text-rose-900">
                                &ldquo;{m.lyDoTuChoi || "Hồ sơ chưa đạt yêu cầu quy chế."}&rdquo;
                              </p>
                            </div>
                          )}

                          {/* Minh chứng hiện tại (lần nộp mới nhất) */}
                          {m.minhChungHienTai && (
                            <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-muted/55 p-3 text-xs">
                              <div className="flex min-w-0 items-center gap-2">
                                <FileText
                                  className="size-4 shrink-0 text-[#164E9B]"
                                  aria-hidden="true"
                                />
                                <div className="min-w-0">
                                  <p className="truncate font-semibold text-foreground">
                                    {m.minhChungHienTai.fileName}
                                  </p>
                                  <p className="text-[11px] text-muted-foreground">
                                    Minh chứng mới nhất: Lần nộp {m.minhChungHienTai.lanNop} •{" "}
                                    {formatDateUtc(m.minhChungHienTai.ngayNop)}
                                  </p>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() =>
                                  handleOpenPdf(
                                    m.minhChungHienTai?.fileId,
                                    m.minhChungHienTai?.fileUrl,
                                    m.minhChungHienTai!.fileName,
                                    `Minh chứng ${m.tenMoc}`,
                                    `${currentStudent.hoTen} (${currentStudent.mshv}) • Lần nộp ${m.minhChungHienTai?.lanNop}`
                                  )
                                }
                                className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-xs font-semibold text-[#164E9B] transition-colors hover:bg-[#164E9B]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B]"
                              >
                                <Eye className="size-3.5" aria-hidden="true" />
                                <span>Xem PDF</span>
                              </button>
                            </div>
                          )}

                          {/* Lịch sử các lần nộp minh chứng */}
                          {m.lichSuMinhChung && m.lichSuMinhChung.length > 1 && (
                            <div className="space-y-2 rounded-xl bg-muted/40 p-3.5 text-xs">
                              <p className="font-semibold text-[#0F2744]">
                                Lịch sử nộp minh chứng ({m.lichSuMinhChung.length} lần nộp)
                              </p>
                              <div className="divide-y divide-border">
                                {m.lichSuMinhChung.map((item: EvidenceItem) => (
                                  <div
                                    key={item.id || item.lanNop}
                                    className="flex flex-wrap items-center justify-between gap-2 py-2 first:pt-1 last:pb-0"
                                  >
                                    <div className="flex min-w-0 items-center gap-2">
                                      <FileText className="size-3.5 shrink-0 text-[#164E9B]" aria-hidden="true" />
                                      <div className="min-w-0">
                                        <p className="truncate font-semibold text-foreground">
                                          Lần {item.lanNop}: {item.fileName}
                                        </p>
                                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                                          <span>Ngày nộp: {formatDateUtc(item.ngayNop)}</span>
                                          {item.ngayDuyet && (
                                            <>
                                              <span aria-hidden="true">•</span>
                                              <span>Ngày duyệt: {formatDateUtc(item.ngayDuyet)}</span>
                                            </>
                                          )}
                                          {item.lyDoTuChoi && (
                                            <span className="text-rose-700 italic">
                                              (Từ chối: {item.lyDoTuChoi})
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                      <span
                                        className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${
                                          item.trangThai === "PASSED"
                                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                            : item.trangThai === "REJECTED"
                                              ? "border-rose-200 bg-rose-50 text-rose-700"
                                              : "border-amber-200 bg-amber-50 text-amber-800"
                                        }`}
                                      >
                                        {item.trangThai === "PASSED"
                                          ? "Đạt"
                                          : item.trangThai === "REJECTED"
                                            ? "Từ chối"
                                            : "Chờ duyệt"}
                                      </span>

                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleOpenPdf(
                                            item.fileId,
                                            item.fileUrl,
                                            item.fileName,
                                            `Minh chứng ${m.tenMoc} (Lần ${item.lanNop})`,
                                            `${currentStudent.hoTen} (${currentStudent.mshv})`
                                          )
                                        }
                                        className="inline-flex h-7 cursor-pointer items-center gap-1 rounded-md border border-border bg-card px-2 text-[11px] font-semibold text-[#164E9B] transition-colors hover:bg-[#164E9B]/10"
                                      >
                                        <Eye className="size-3" aria-hidden="true" />
                                        <span>Xem</span>
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Phiếu nhận xét Hội đồng */}
                          {m.yeuCauDiem && m.phieuNhanXets && m.phieuNhanXets.length > 0 && (
                            <div className="space-y-2 rounded-xl bg-muted/45 p-3.5 text-xs">
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-[#0F2744]">
                                  Phiếu nhận xét của Hội đồng ({m.phieuNhanXets.length})
                                </span>
                                {m.diemTrungBinh !== undefined && (
                                  <span className="rounded bg-emerald-100 px-2 py-0.5 font-mono font-bold text-emerald-900">
                                    Điểm TB: {Number(m.diemTrungBinh).toFixed(1)}/10
                                  </span>
                                )}
                              </div>

                              <div className="divide-y divide-border">
                                {m.phieuNhanXets.map((review) => (
                                  <div
                                    key={review.id}
                                    className="flex flex-wrap items-center justify-between gap-2 py-2 first:pt-1 last:pb-0"
                                  >
                                    <div className="min-w-0">
                                      <p className="font-semibold text-foreground">
                                        {review.tenNguoiCham}{" "}
                                        <span className="font-normal text-muted-foreground">
                                          ({review.chucDanh})
                                        </span>
                                      </p>
                                      {review.nhanXet && (
                                        <p className="line-clamp-1 text-[11px] text-muted-foreground">
                                          {review.nhanXet}
                                        </p>
                                      )}
                                      {review.ngayDanhGia && (
                                        <p className="text-[10px] text-muted-foreground">
                                          Ngày đánh giá: {formatDateUtc(review.ngayDanhGia)}
                                        </p>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="font-mono font-bold text-[#164E9B]">
                                        {review.diem.toFixed(1)}/10
                                      </span>
                                      {review.fileUrl && (
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleOpenPdf(
                                              undefined,
                                              review.fileUrl,
                                              review.fileName,
                                              `Phiếu nhận xét - ${review.tenNguoiCham}`,
                                              `${m.tenMoc} • Điểm ${review.diem.toFixed(1)}/10`
                                            )
                                          }
                                          className="inline-flex h-8 cursor-pointer items-center gap-1 rounded-md border border-border bg-card px-2.5 text-[11px] font-semibold text-[#164E9B] transition-colors hover:bg-[#164E9B]/10"
                                        >
                                          <Eye className="size-3" aria-hidden="true" />
                                          <span>Xem phiếu</span>
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </article>
                    );
                  })
                )}
              </div>
            </div>

            {/* Footer Drawer */}
            <div className="sticky bottom-0 z-20 flex items-center justify-between border-t border-border bg-card px-5 py-3.5 sm:px-6">
              <p className="text-xs text-muted-foreground">
                Chế độ giám sát Luồng 9 mốc dành cho Giảng viên Hướng dẫn
              </p>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-10 cursor-pointer items-center rounded-lg bg-[#164E9B] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#113E7D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] focus-visible:ring-offset-2"
              >
                Đóng bảng chi tiết
              </button>
            </div>
          </div>
        </div>
      </div>

      <PdfViewer
        isOpen={Boolean(previewPdf)}
        onClose={handleClosePdf}
        fileUrl={previewBlobUrl || previewPdf?.fileUrl}
        fileName={previewPdf?.fileName}
        title={previewPdf?.title}
        subtitle={previewPdf?.subtitle}
        isLoading={isLoadingPdf}
        error={pdfError}
        allowDownload={true}
      />
    </>
  );
}

/**
 * StudentProgressDrawer
 *
 * Slide-over Drawer xem chi tiết tiến độ 9 mốc của Nghiên cứu sinh.
 * Tái sử dụng `PdfViewer` dùng chung, đóng bằng phím `Escape` và quản lý focus chuẩn A11y.
 */
export function StudentProgressDrawer({
  student,
  isOpen,
  onClose,
}: StudentProgressDrawerProps) {
  if (!isOpen || !student) return null;
  return <StudentProgressDrawerInner student={student} onClose={onClose} />;
}

export default StudentProgressDrawer;
