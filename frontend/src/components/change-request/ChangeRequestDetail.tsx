"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  Award,
  Building2,
  CheckCircle2,
  FileText,
  Hourglass,
  ShieldAlert,
  UserCheck,
  X,
  XCircle,
} from "lucide-react";
import { PdfViewer } from "@/src/components/upload/PdfViewer";
import type {
  ChangeRequestDetailProps,
  ChangeRequestItem,
} from "@/src/types/ui/change-request";
import {
  CHANGE_REQUEST_STATUS_META,
  CHANGE_REQUEST_TYPE_META,
  formatDateTimeVi,
  formatDateVi,
  formatFileSize,
  isPendingRequestStatus,
} from "./helpers";

interface ActivePdfState {
  fileUrl: string;
  fileName: string;
  title: string;
  subtitle?: string;
}

function ChangeRequestDetailInner({
  request,
  onClose,
  onCancelRequest,
  className = "",
}: {
  request: ChangeRequestItem;
  onClose: () => void;
  onCancelRequest?: (request: ChangeRequestItem) => void;
  className?: string;
}) {
  const titleId = useId();
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const [activePdf, setActivePdf] = useState<ActivePdfState | null>(null);

  useEffect(() => {
    previousFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const timer = window.setTimeout(() => {
      closeBtnRef.current?.focus();
    }, 0);

    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = previousOverflow;
      previousFocusRef.current?.focus();
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !activePdf) {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activePdf, onClose]);

  const typeMeta = CHANGE_REQUEST_TYPE_META[request.loaiDon];
  const statusMeta = CHANGE_REQUEST_STATUS_META[request.trangThai];
  const TypeIcon = typeMeta.Icon;
  const StatusIcon = statusMeta.Icon;
  const canCancel = isPendingRequestStatus(request.trangThai);

  const opinions = request.xacNhanGvhds ?? [];
  const agreedCount = opinions.filter((op) => op.dongY === true).length;

  return (
    <>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={onClose}
        className="fixed inset-0 z-50 flex justify-end bg-slate-950/50 backdrop-blur-xs transition-opacity duration-150"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={`flex h-full w-full max-w-2xl flex-col border-l border-border bg-card text-card-foreground shadow-2xl ${className}`}
        >
          {/* Drawer Header */}
          <div className="flex items-start justify-between gap-4 border-b border-border bg-muted/30 px-5 py-4 sm:px-6">
            <div className="min-w-0 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md border border-border bg-card px-2 py-0.5 font-mono text-xs font-bold text-[#0F2744]">
                  {request.maDon}
                </span>
                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${typeMeta.badgeClass}`}
                >
                  <TypeIcon className="size-3.5" aria-hidden="true" />
                  <span>{typeMeta.shortLabel}</span>
                </span>
                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusMeta.badgeClass}`}
                >
                  <StatusIcon className="size-3.5" aria-hidden="true" />
                  <span>{statusMeta.label}</span>
                </span>
                {request.batKhaKhang && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-900">
                    <ShieldAlert className="size-3.5" aria-hidden="true" />
                    <span>Bất khả kháng</span>
                  </span>
                )}
              </div>

              <h2
                id={titleId}
                className="text-base font-bold leading-snug text-[#0F2744] sm:text-lg"
              >
                {typeMeta.label}
              </h2>

              <p className="text-xs text-muted-foreground">
                Gửi lúc{" "}
                <span className="font-mono font-medium tabular-nums text-foreground">
                  {formatDateTimeVi(request.ngayGui)}
                </span>
                {request.ngayCapNhat && (
                  <>
                    {" "}
                    • Cập nhật{" "}
                    <span className="font-mono font-medium tabular-nums text-foreground">
                      {formatDateTimeVi(request.ngayCapNhat)}
                    </span>
                  </>
                )}
              </p>
            </div>

            <button
              ref={closeBtnRef}
              type="button"
              onClick={onClose}
              aria-label="Đóng chi tiết đơn đề nghị"
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] cursor-pointer"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6 sm:px-6">
            {/* Lý do từ chối nổi bật (khi TU_CHOI) */}
            {request.trangThai === "TU_CHOI" && request.lyDoTuChoi && (
              <section
                role="alert"
                className="rounded-xl border border-rose-200 bg-rose-50/85 p-4 text-rose-950 space-y-1.5"
              >
                <div className="flex items-center gap-2 text-sm font-bold text-rose-800">
                  <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
                  <span>Lý do từ chối xử lý đơn</span>
                </div>
                <p className="text-sm leading-relaxed text-rose-900">
                  {request.lyDoTuChoi}
                </p>
                {(request.nguoiXuLy || request.ngayXuLy) && (
                  <p className="pt-1 text-xs text-rose-800/90">
                    {request.nguoiXuLy ? `Người xử lý: ${request.nguoiXuLy}` : ""}
                    {request.nguoiXuLy && request.ngayXuLy ? " • " : ""}
                    {request.ngayXuLy ? formatDateTimeVi(request.ngayXuLy) : ""}
                  </p>
                )}
              </section>
            )}

            {/* Quyết định phê duyệt (khi DA_DUYET) */}
            {request.trangThai === "DA_DUYET" && request.quyetDinh && (
              <section className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-emerald-900">
                  <Award className="size-4 shrink-0 text-emerald-700" aria-hidden="true" />
                  <span>Quyết định ban hành</span>
                </div>

                <dl className="grid grid-cols-1 gap-2.5 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-xs text-emerald-800/80">Số Quyết định</dt>
                    <dd className="font-mono font-bold text-emerald-950">
                      {request.quyetDinh.soQuyetDinh}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-emerald-800/80">Ngày ký ban hành</dt>
                    <dd className="font-mono font-semibold tabular-nums text-emerald-950">
                      {formatDateVi(request.quyetDinh.ngayKy)}
                    </dd>
                  </div>
                  {request.quyetDinh.coQuanBanHanh && (
                    <div className="sm:col-span-2 flex items-start gap-2 text-xs text-emerald-900">
                      <Building2 className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
                      <span>{request.quyetDinh.coQuanBanHanh}</span>
                    </div>
                  )}
                </dl>

                <button
                  type="button"
                  onClick={() =>
                    setActivePdf({
                      fileUrl: request.quyetDinh!.fileUrl,
                      fileName: request.quyetDinh!.fileName,
                      title: `Quyết định ${request.quyetDinh!.soQuyetDinh}`,
                      subtitle: `Ngày ký ${formatDateVi(request.quyetDinh!.ngayKy)} • ${typeMeta.label}`,
                    })
                  }
                  className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#164E9B] px-3.5 text-xs font-semibold text-white transition-colors hover:bg-[#113E7D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] cursor-pointer"
                >
                  <FileText className="size-4" aria-hidden="true" />
                  <span>Xem PDF Quyết định</span>
                </button>
              </section>
            )}

            {/* Nội dung chi tiết xin điều chỉnh */}
            <section className="space-y-3">
              <h3 className="text-sm font-bold text-[#0F2744]">
                Nội dung đề nghị
              </h3>

              <div className="divide-y divide-border rounded-xl border border-border bg-muted/20">
                {request.loaiDon === "DOI_DE_TAI" && (
                  <>
                    <div className="p-3.5 space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">
                        Tên đề tài hiện tại
                      </p>
                      <p className="text-sm text-foreground">
                        {request.tenDeTaiCu || "—"}
                      </p>
                    </div>
                    <div className="p-3.5 space-y-1 bg-blue-50/40">
                      <p className="text-xs font-semibold text-[#164E9B]">
                        Tên đề tài mới đề xuất
                      </p>
                      <p className="text-sm font-semibold text-[#0F2744]">
                        {request.tenDeTaiMoi || "—"}
                      </p>
                    </div>
                  </>
                )}

                {request.loaiDon === "DOI_GVHD" && (
                  <div className="p-3.5 space-y-3">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
                      <div className="space-y-0.5">
                        <p className="text-xs text-muted-foreground">
                          GVHD hiện tại cần thay
                        </p>
                        <p className="text-sm font-semibold text-foreground">
                          {request.tenGvhdCu || "—"}
                        </p>
                        {request.vaiTroGvhdCu && (
                          <p className="text-xs text-muted-foreground">
                            {request.vaiTroGvhdCu === "HUONG_DAN_CHINH"
                              ? "Hướng dẫn chính"
                              : "Đồng hướng dẫn"}
                          </p>
                        )}
                      </div>

                      <ArrowRight
                        className="hidden size-4 text-muted-foreground sm:block"
                        aria-hidden="true"
                      />

                      <div className="space-y-0.5">
                        <p className="text-xs font-semibold text-[#164E9B]">
                          GVHD mới đề xuất
                        </p>
                        <p className="text-sm font-bold text-[#0F2744]">
                          {request.tenGvhdMoi || "—"}
                        </p>
                        {request.donViGvhdMoi && (
                          <p className="text-xs text-muted-foreground">
                            {request.donViGvhdMoi}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {request.loaiDon === "GIA_HAN" && (
                  <dl className="grid grid-cols-1 divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                    <div className="p-3.5">
                      <dt className="text-xs text-muted-foreground">
                        Thời gian xin gia hạn
                      </dt>
                      <dd className="mt-0.5 font-mono text-base font-bold tabular-nums text-[#164E9B]">
                        +{request.soThangGiaHan ?? 0} tháng
                      </dd>
                    </div>
                    <div className="p-3.5">
                      <dt className="text-xs text-muted-foreground">
                        Hạn trước gia hạn
                      </dt>
                      <dd className="mt-0.5 font-mono text-sm font-semibold tabular-nums text-foreground">
                        {formatDateVi(request.hanHienTaiTaiThoiDiemNop)}
                      </dd>
                    </div>
                    <div className="p-3.5 bg-blue-50/40">
                      <dt className="text-xs font-semibold text-[#164E9B]">
                        Hạn mới dự kiến
                      </dt>
                      <dd className="mt-0.5 font-mono text-sm font-bold tabular-nums text-[#0F2744]">
                        {formatDateVi(request.hanMoiDuKien)}
                      </dd>
                    </div>
                  </dl>
                )}

                <div className="p-3.5 space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    Lý do &amp; giải trình của NCS
                  </p>
                  <p className="text-sm leading-relaxed text-foreground whitespace-pre-line">
                    {request.lyDo}
                  </p>
                </div>
              </div>
            </section>

            {/* Tiến độ xác nhận Tập thể GVHD (dành riêng cho đơn GIA_HAN) */}
            {request.loaiDon === "GIA_HAN" && (
              <section className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="flex items-center gap-2 text-sm font-bold text-[#0F2744]">
                    <UserCheck className="size-4 text-[#164E9B]" aria-hidden="true" />
                    <span>Xác nhận của Tập thể GVHD</span>
                  </h3>
                  {opinions.length > 0 && (
                    <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 font-mono text-xs font-semibold tabular-nums text-[#164E9B]">
                      {agreedCount}/{opinions.length} GVHD đã đồng ý
                    </span>
                  )}
                </div>

                {opinions.length === 0 ? (
                  <p className="rounded-xl border border-dashed border-border bg-muted/20 p-4 text-xs text-muted-foreground">
                    Chưa có danh sách giảng viên hướng dẫn cần lấy ý kiến cho hồ sơ này.
                  </p>
                ) : (
                  <ul className="divide-y divide-border rounded-xl border border-border bg-card">
                    {opinions.map((op) => {
                      const stateMeta =
                        op.dongY === true
                          ? {
                              label: "Đã đồng ý",
                              badgeClass:
                                "border-emerald-200 bg-emerald-50 text-emerald-800",
                              Icon: CheckCircle2,
                            }
                          : op.dongY === false
                          ? {
                              label: "Đã từ chối",
                              badgeClass:
                                "border-rose-200 bg-rose-50 text-rose-800",
                              Icon: XCircle,
                            }
                          : {
                              label: "Chưa phản hồi",
                              badgeClass:
                                "border-amber-200 bg-amber-50 text-amber-800",
                              Icon: Hourglass,
                            };

                      const OpinionIcon = stateMeta.Icon;

                      return (
                        <li key={op.id} className="p-3.5 space-y-2">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div>
                              <p className="text-sm font-semibold text-[#0F2744]">
                                {op.hocHamHocVi ? `${op.hocHamHocVi} ` : ""}
                                {op.tenGvhd}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {op.vaiTro === "HUONG_DAN_CHINH"
                                  ? "Hướng dẫn chính"
                                  : "Đồng hướng dẫn"}
                                {op.thoiGianPhanHoi && (
                                  <>
                                    {" "}
                                    • Phản hồi{" "}
                                    <span className="font-mono tabular-nums">
                                      {formatDateTimeVi(op.thoiGianPhanHoi)}
                                    </span>
                                  </>
                                )}
                              </p>
                            </div>

                            <span
                              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${stateMeta.badgeClass}`}
                            >
                              <OpinionIcon className="size-3.5" aria-hidden="true" />
                              <span>{stateMeta.label}</span>
                            </span>
                          </div>

                          {op.nhanXet && (
                            <p className="rounded-lg bg-muted/50 px-3 py-2 text-xs leading-relaxed text-foreground">
                              &ldquo;{op.nhanXet}&rdquo;
                            </p>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </section>
            )}

            {/* Tài liệu PDF đính kèm */}
            <section className="space-y-2.5">
              <h3 className="text-sm font-bold text-[#0F2744]">
                Tài liệu PDF đính kèm
              </h3>

              {request.tepDinhKem ? (
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-muted/20 p-3.5">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-[#164E9B]">
                      <FileText className="size-4" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {request.tepDinhKem.fileName}
                      </p>
                      <p className="font-mono text-xs tabular-nums text-muted-foreground">
                        {formatFileSize(request.tepDinhKem.fileSize) || "Tài liệu PDF"}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setActivePdf({
                        fileUrl: request.tepDinhKem!.fileUrl,
                        fileName: request.tepDinhKem!.fileName,
                        title: `Tệp đính kèm • ${request.maDon}`,
                        subtitle: typeMeta.label,
                      })
                    }
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-xs font-semibold text-[#164E9B] transition-colors hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] cursor-pointer"
                  >
                    <FileText className="size-3.5" aria-hidden="true" />
                    <span>Xem PDF đính kèm</span>
                  </button>
                </div>
              ) : (
                <p className="rounded-xl border border-dashed border-border bg-muted/20 p-3.5 text-xs text-muted-foreground">
                  Không có tệp PDF đính kèm cho đơn đề nghị này.
                </p>
              )}
            </section>
          </div>

          {/* Drawer Footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-muted/30 px-5 py-3.5 sm:px-6">
            <div>
              {canCancel && onCancelRequest && (
                <button
                  type="button"
                  onClick={() => onCancelRequest(request)}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3.5 text-xs font-semibold text-rose-700 transition-colors hover:bg-rose-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 cursor-pointer"
                >
                  <XCircle className="size-3.5" aria-hidden="true" />
                  <span>Hủy đơn đề nghị</span>
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-9 items-center justify-center rounded-lg border border-border bg-card px-4 text-xs font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] cursor-pointer"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>

      <PdfViewer
        isOpen={Boolean(activePdf)}
        onClose={() => setActivePdf(null)}
        fileUrl={activePdf?.fileUrl}
        fileName={activePdf?.fileName}
        title={activePdf?.title}
        subtitle={activePdf?.subtitle}
        allowDownload={true}
      />
    </>
  );
}

/**
 * ChangeRequestDetail
 *
 * Ngăn kéo (Drawer) xem chi tiết 1 đơn đề nghị (`DOI_DE_TAI`, `DOI_GVHD`, `GIA_HAN`),
 * hiển thị tiến độ xác nhận tập thể GVHD, lý do từ chối, quyết định ban hành và xem PDF.
 */
export function ChangeRequestDetail({
  request,
  isOpen,
  onClose,
  onCancelRequest,
  className = "",
}: ChangeRequestDetailProps) {
  if (!isOpen || !request) return null;

  return (
    <ChangeRequestDetailInner
      request={request}
      onClose={onClose}
      onCancelRequest={onCancelRequest}
      className={className}
    />
  );
}

export default ChangeRequestDetail;
