"use client";

import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  Clock,
  Eye,
  FilePlus2,
  FileText,
  Info,
  RefreshCw,
  Search,
  Send,
  Trash2,
  UserCog,
  Users,
  X,
} from "lucide-react";
import { ConfirmDialog } from "@/src/components/shared/ConfirmDialog";
import { PdfViewer } from "@/src/components/upload/PdfViewer";
import type {
  SupervisorProxyRequestFormValues,
  SupervisorProxyRequestItem,
  SupervisorProxyRequestType,
  SupervisorRequestsWorkspaceProps,
} from "@/src/types/ui/supervisor";
import { SupervisorRequestForm } from "./SupervisorRequestForm";
import {
  formatFileSizeBytes,
  formatSupervisorDateUtc,
  getRoleShortLabel,
  getSupervisorRequestStatusMeta,
  PROXY_REQUEST_TYPE_META,
} from "./supervisor-ui-helpers";

export type { SupervisorRequestsWorkspaceProps };

interface ActivePdfState {
  fileUrl?: string;
  fileName: string;
  title: string;
  subtitle?: string;
}

interface DetailDrawerInnerProps {
  item: SupervisorProxyRequestItem;
  onClose: () => void;
  onOpenPdf: (pdf: ActivePdfState) => void;
  onWithdraw?: () => void;
  isSubDialogOpen: boolean;
}

function ProxyRequestDetailDrawerInner({
  item,
  onClose,
  onOpenPdf,
  onWithdraw,
  isSubDialogOpen,
}: DetailDrawerInnerProps) {
  const titleId = useId();
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const typeMeta = PROXY_REQUEST_TYPE_META[item.loaiDon];
  const statusMeta = getSupervisorRequestStatusMeta(item.trangThai);

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

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSubDialogOpen) {
        event.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocusRef.current?.focus();
    };
  }, [isSubDialogOpen, onClose]);

  return (
    <>
      <div
        aria-hidden="true"
        onClick={() => {
          if (!isSubDialogOpen) onClose();
        }}
        className="fixed inset-0 z-40 bg-[#0F2744]/45 backdrop-blur-[1px]"
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xl flex-col border-l border-border bg-card shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-[#164E9B]/10 px-2.5 py-0.5 text-xs font-bold tabular-nums text-[#164E9B]">
                {item.maDon}
              </span>
              <span
                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${typeMeta.badgeClass}`}
              >
                {typeMeta.label}
              </span>
              <span
                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusMeta.badgeClass}`}
              >
                {statusMeta.label}
              </span>
            </div>
            <h2 id={titleId} className="mt-1.5 text-lg font-bold text-[#0F2744]">
              Đề xuất thay NCS {item.hoTenNcs}
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {item.mshv} • {item.khoaDaoTao} • Gửi ngày{" "}
              {formatSupervisorDateUtc(item.ngayGui)}
            </p>
          </div>

          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label="Đóng chi tiết đề xuất"
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-[#0F2744] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] motion-reduce:transition-none"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5 text-sm">
          {item.loaiDon === "DOI_DE_TAI" ? (
            <div className="space-y-3 rounded-xl bg-[#F0F5FA] p-4">
              <div>
                <p className="text-xs font-semibold text-muted-foreground">
                  Tên đề tài trước điều chỉnh
                </p>
                <p className="mt-1 text-xs leading-relaxed text-foreground">
                  {item.tenDeTaiCu}
                </p>
              </div>
              <div className="border-t border-border/70 pt-3">
                <p className="text-xs font-semibold text-[#164E9B]">
                  Tên đề tài đề xuất mới
                </p>
                <p className="mt-1 text-sm font-semibold leading-relaxed text-[#0F2744]">
                  {item.tenDeTaiMoi}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3 rounded-xl bg-[#F0F5FA] p-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-lg bg-card p-3">
                  <p className="text-xs font-medium text-muted-foreground">
                    GVHD hiện tại / thay thế
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[#0F2744]">
                    {item.tenGvhdCu || "Chưa có"}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {item.vaiTroGvhdCanThay
                      ? getRoleShortLabel(item.vaiTroGvhdCanThay)
                      : ""}
                  </p>
                </div>

                <div className="rounded-lg bg-card p-3">
                  <p className="text-xs font-medium text-[#164E9B]">
                    GVHD mới đề xuất
                  </p>
                  <p className="mt-1 text-sm font-bold text-[#0F2744]">
                    {item.tenGvhdMoi}
                  </p>
                  {item.donViGvhdMoi && (
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {item.donViGvhdMoi}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div>
            <h3 className="text-xs font-bold text-[#0F2744]">
              Lý do & cơ sở đề xuất của GVHD ({item.nguoiDeXuat})
            </h3>
            <p className="mt-1.5 rounded-lg bg-muted/40 p-3.5 text-sm leading-relaxed text-foreground">
              {item.lyDo}
            </p>
          </div>

          {item.tepDinhKem && (
            <div className="flex flex-col gap-3 rounded-xl border border-border bg-background p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#164E9B]/10 text-[#164E9B]">
                  <FileText className="size-5" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-[#0F2744]">
                    {item.tepDinhKem.fileName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Tờ trình / Tài liệu đính kèm
                    {formatFileSizeBytes(item.tepDinhKem.fileSize)
                      ? ` • ${formatFileSizeBytes(item.tepDinhKem.fileSize)}`
                      : ""}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  onOpenPdf({
                    fileUrl: item.tepDinhKem?.fileUrl,
                    fileName: item.tepDinhKem?.fileName || "ToTrinh.pdf",
                    title: `${item.maDon} — Tờ trình đề xuất thay NCS ${item.hoTenNcs}`,
                    subtitle: `Người đề xuất: ${item.nguoiDeXuat}`,
                  })
                }
                className="inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-lg bg-[#164E9B] px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#0F2744] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] motion-reduce:transition-none"
              >
                <Eye className="size-3.5" aria-hidden="true" />
                <span>Xem PDF</span>
              </button>
            </div>
          )}

          {item.quyetDinh && (
            <div className="flex flex-col gap-3 rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-xs font-bold text-emerald-900">
                  Quyết định phê duyệt: {item.quyetDinh.soQuyetDinh}
                </p>
                <p className="mt-0.5 text-xs text-emerald-800">
                  Ngày ký {formatSupervisorDateUtc(item.quyetDinh.ngayKy)} •{" "}
                  {item.quyetDinh.coQuanBanHanh}
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  onOpenPdf({
                    fileUrl: item.quyetDinh?.fileUrl,
                    fileName: item.quyetDinh?.fileName || "QuyetDinh.pdf",
                    title: `Quyết định ${item.quyetDinh?.soQuyetDinh}`,
                    subtitle: `${item.hoTenNcs} (${item.mshv})`,
                  })
                }
                className="inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-lg border border-emerald-300 bg-white px-3.5 py-2 text-xs font-semibold text-emerald-800 transition-colors hover:bg-emerald-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 motion-reduce:transition-none"
              >
                <Eye className="size-3.5" aria-hidden="true" />
                <span>Xem Quyết định</span>
              </button>
            </div>
          )}

          {item.lyDoTuChoi && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-900">
              <p className="font-bold">Lý do Phòng ĐT-SĐH từ chối:</p>
              <p className="mt-1 leading-relaxed">{item.lyDoTuChoi}</p>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-muted/20 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-10 items-center rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] motion-reduce:transition-none"
          >
            Đóng
          </button>

          {item.trangThai === "CHO_DUYET" && onWithdraw && (
            <button
              type="button"
              onClick={onWithdraw}
              className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-rose-300 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition-colors hover:bg-rose-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 motion-reduce:transition-none"
            >
              <Trash2 className="size-4" aria-hidden="true" />
              <span>Thu hồi đề xuất</span>
            </button>
          )}
        </div>
      </section>
    </>
  );
}

export function SupervisorRequestsWorkspace({
  requests: initialRequests,
  students,
  candidateSupervisors,
  supervisorProfile,
  isLoading = false,
  error = null,
  onRetry,
  onCreateRequest,
  onWithdrawRequest,
}: SupervisorRequestsWorkspaceProps) {
  const [requestsState, setRequestsState] =
    useState<SupervisorProxyRequestItem[]>(initialRequests);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<SupervisorProxyRequestType | "ALL">(
    "ALL"
  );
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [withdrawTarget, setWithdrawTarget] =
    useState<SupervisorProxyRequestItem | null>(null);
  const [activePdf, setActivePdf] = useState<ActivePdfState | null>(null);
  const [feedbackBanner, setFeedbackBanner] = useState<string | null>(null);

  const selectedRequest = useMemo(
    () => requestsState.find((item) => item.id === selectedRequestId) ?? null,
    [requestsState, selectedRequestId]
  );

  const counts = useMemo(() => {
    const topicCount = requestsState.filter((r) => r.loaiDon === "DOI_DE_TAI").length;
    const supervisorCount = requestsState.filter(
      (r) => r.loaiDon === "DOI_GVHD"
    ).length;
    const pendingCount = requestsState.filter(
      (r) => r.trangThai === "CHO_DUYET"
    ).length;
    return {
      total: requestsState.length,
      topicCount,
      supervisorCount,
      pendingCount,
    };
  }, [requestsState]);

  const filteredRequests = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase();
    return requestsState.filter((item) => {
      if (typeFilter !== "ALL" && item.loaiDon !== typeFilter) {
        return false;
      }
      if (!keyword) return true;
      return (
        item.maDon.toLowerCase().includes(keyword) ||
        item.hoTenNcs.toLowerCase().includes(keyword) ||
        item.mshv.toLowerCase().includes(keyword) ||
        (item.tenDeTaiMoi ?? "").toLowerCase().includes(keyword) ||
        (item.tenGvhdMoi ?? "").toLowerCase().includes(keyword)
      );
    });
  }, [requestsState, searchQuery, typeFilter]);

  const handleCreateSubmit = async (values: SupervisorProxyRequestFormValues) => {
    if (onCreateRequest) {
      await onCreateRequest(values);
    }

    const student = students.find((st) => st.id === values.studentId);
    const candidate = candidateSupervisors.find(
      (cand) => cand.giangVienId === values.gvhdMoiId
    );
    const nowIso = new Date().toISOString();
    const newCode = `DX-GV-2026-${String(requestsState.length + 10).padStart(
      3,
      "0"
    )}`;

    const newItem: SupervisorProxyRequestItem = {
      id: `prx-gv-${Date.now()}`,
      maDon: newCode,
      loaiDon: values.loaiDon,
      trangThai: "CHO_DUYET",
      studentId: values.studentId,
      mshv: student?.mshv || "NCS",
      hoTenNcs: student?.hoTen || "Nghiên cứu sinh",
      khoaDaoTao: student?.khoaDaoTao || "",
      nguoiDeXuat: supervisorProfile?.hoTen || "PGS.TS. Trần Quốc Tuấn",
      vaiTroCuaToi: student?.vaiTro || "HUONG_DAN_CHINH",
      ngayGui: nowIso,
      ngayCapNhat: nowIso,
      lyDo: values.lyDo,
      batKhaKhang: values.batKhaKhang,
      tenDeTaiCu: values.loaiDon === "DOI_DE_TAI" ? student?.tenDeTai : undefined,
      tenDeTaiMoi: values.tenDeTaiMoi,
      vaiTroGvhdCanThay: values.vaiTroGvhdCanThay,
      tenGvhdCu: values.tenGvhdCu,
      gvhdMoiId: values.gvhdMoiId,
      tenGvhdMoi: candidate
        ? `${candidate.hocHamHocVi} ${candidate.hoTen}`
        : undefined,
      donViGvhdMoi: candidate?.donViCongTac,
      tepDinhKem: values.tepDinhKemFile
        ? {
            fileName: values.tepDinhKemFile.name,
            fileUrl: `mock://${values.tepDinhKemFile.name}`,
            fileSize: values.tepDinhKemFile.size,
          }
        : null,
      quyetDinh: null,
      lyDoTuChoi: null,
    };

    setRequestsState((prev) => [newItem, ...prev]);
    setShowCreateForm(false);
    setFeedbackBanner(
      `Đã gửi đơn đề xuất ${newCode} thay cho NCS ${newItem.hoTenNcs} (${newItem.mshv}) tới Phòng Đào tạo Sau đại học.`
    );
  };

  const handleConfirmWithdraw = async () => {
    if (!withdrawTarget) return;
    if (onWithdrawRequest) {
      await onWithdrawRequest(withdrawTarget.id);
    }

    const withdrawnCode = withdrawTarget.maDon;
    setRequestsState((prev) =>
      prev.map((item) =>
        item.id === withdrawTarget.id
          ? {
              ...item,
              trangThai: "DA_HUY",
              ngayCapNhat: new Date().toISOString(),
            }
          : item
      )
    );
    setWithdrawTarget(null);
    setSelectedRequestId(null);
    setFeedbackBanner(`Đã thu hồi đơn đề xuất ${withdrawnCode}.`);
  };

  return (
    <div className="space-y-6 pb-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0F2744]">
            Đề xuất thay đổi thay Nghiên cứu sinh
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Khởi tạo và theo dõi các đơn đề xuất đổi tên đề tài luận án hoặc thay đổi Giảng viên hướng dẫn thay cho NCS đang phụ trách.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/supervisor/students"
            className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-[#0F2744] transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] motion-reduce:transition-none"
          >
            <Users className="size-4 text-[#164E9B]" aria-hidden="true" />
            <span>Danh sách NCS</span>
          </Link>

          <button
            type="button"
            onClick={() => setShowCreateForm((prev) => !prev)}
            className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#164E9B] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#0F2744] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] focus-visible:ring-offset-2 motion-reduce:transition-none"
          >
            <FilePlus2 className="size-4" aria-hidden="true" />
            <span>
              {showCreateForm ? "Đóng biểu mẫu tạo mới" : "Tạo đơn đề xuất mới"}
            </span>
          </button>
        </div>
      </header>

      <div className="flex items-start gap-3 rounded-xl bg-[#F0F5FA] px-5 py-3.5 text-xs text-[#0F2744]">
        <Info className="mt-0.5 size-4 shrink-0 text-[#164E9B]" aria-hidden="true" />
        <p className="leading-relaxed">
          <strong>Phân tách quyền hạn học vụ:</strong> Các đơn do GVHD tạo thay NCS tại đây sẽ tự động chuyển về{" "}
          <strong>Phòng Đào tạo Sau đại học</strong> (cổng Giáo vụ) thẩm định điều kiện, kiểm tra định mức BR-09 và trình ký Quyết định.
        </p>
      </div>

      {feedbackBanner && (
        <div
          role="status"
          className="flex items-start justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-900"
        >
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600" aria-hidden="true" />
            <p className="font-medium">{feedbackBanner}</p>
          </div>
          <button
            type="button"
            onClick={() => setFeedbackBanner(null)}
            aria-label="Đóng thông báo đề xuất"
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg text-emerald-800 transition-colors hover:bg-emerald-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 motion-reduce:transition-none"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
      )}

      {error && !isLoading && (
        <div
          role="alert"
          className="flex flex-col gap-3 rounded-xl border border-rose-200 bg-rose-50 px-5 py-4 text-rose-900 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 size-5 shrink-0 text-rose-600" aria-hidden="true" />
            <div className="text-sm">
              <p className="font-semibold">Không thể tải danh sách đề xuất thay NCS</p>
              <p className="mt-0.5 text-rose-800">{error}</p>
            </div>
          </div>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-lg border border-rose-300 bg-white px-4 py-2 text-sm font-semibold text-rose-800 transition-colors hover:bg-rose-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 motion-reduce:transition-none"
            >
              <RefreshCw className="size-4" aria-hidden="true" />
              <span>Thử lại</span>
            </button>
          )}
        </div>
      )}

      {showCreateForm && (
        <SupervisorRequestForm
          students={students}
          candidateSupervisors={candidateSupervisors}
          supervisorProfile={supervisorProfile}
          onSubmit={handleCreateSubmit}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      {!isLoading && (
        <section
          aria-label="Số liệu đơn đề xuất thay NCS"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
              <span>Tổng đơn đã đề xuất</span>
              <Send className="size-4 text-[#164E9B]" aria-hidden="true" />
            </div>
            <p className="mt-2 text-2xl font-bold tabular-nums text-[#0F2744]">
              {counts.total}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Đề xuất thay cho NCS phụ trách
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
              <span>Đổi tên đề tài</span>
              <BookOpen className="size-4 text-[#164E9B]" aria-hidden="true" />
            </div>
            <p className="mt-2 text-2xl font-bold tabular-nums text-[#0F2744]">
              {counts.topicCount}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Cập nhật định hướng luận án
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
              <span>Đổi / Bổ sung GVHD</span>
              <UserCog className="size-4 text-sky-700" aria-hidden="true" />
            </div>
            <p className="mt-2 text-2xl font-bold tabular-nums text-[#0F2744]">
              {counts.supervisorCount}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Điều chỉnh phân công hướng dẫn
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
              <span>Đang chờ Giáo vụ duyệt</span>
              <Clock className="size-4 text-amber-600" aria-hidden="true" />
            </div>
            <p className="mt-2 text-2xl font-bold tabular-nums text-[#164E9B]">
              {counts.pendingCount}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Có thể thu hồi trước khi duyệt
            </p>
          </div>
        </section>
      )}

      <section
        aria-label="Danh sách đơn đề xuất thay NCS"
        className="overflow-hidden rounded-xl border border-border bg-card"
      >
        <div className="flex flex-col gap-3 border-b border-border p-5 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Lọc loại đề xuất">
            {(
              [
                { id: "ALL", label: "Tất cả đơn" },
                { id: "DOI_DE_TAI", label: "Đổi đề tài" },
                { id: "DOI_GVHD", label: "Đổi GVHD" },
              ] as const
            ).map((opt) => {
              const active = typeFilter === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setTypeFilter(opt.id)}
                  className={`inline-flex min-h-10 items-center rounded-lg border px-3.5 py-2 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] motion-reduce:transition-none ${
                    active
                      ? "border-[#164E9B] bg-[#164E9B] text-white"
                      : "border-border bg-background text-[#0F2744] hover:bg-muted"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          <div className="relative w-full md:w-72">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              type="search"
              aria-label="Tìm theo mã đơn, tên NCS hoặc đề tài"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm mã đơn, tên NCS, nội dung..."
              className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B]"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-3 p-5 animate-pulse motion-reduce:animate-none">
            {[1, 2, 3].map((idx) => (
              <div key={idx} className="h-14 rounded-lg bg-muted" />
            ))}
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <FileText
              className="mx-auto size-10 text-muted-foreground/60"
              aria-hidden="true"
            />
            <p className="mt-3 text-sm font-semibold text-[#0F2744]">
              Không có đơn đề xuất nào phù hợp
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Bạn có thể bấm “Tạo đơn đề xuất mới” để lập đề xuất đổi đề tài hoặc đổi GVHD cho Nghiên cứu sinh.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[840px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-xs font-semibold text-muted-foreground">
                  <th className="px-5 py-3">Mã đơn / Ngày gửi</th>
                  <th className="px-5 py-3">Nghiên cứu sinh</th>
                  <th className="px-5 py-3">Loại đề xuất</th>
                  <th className="px-5 py-3">Nội dung đề xuất chính</th>
                  <th className="px-5 py-3">Trạng thái</th>
                  <th className="px-5 py-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredRequests.map((item) => {
                  const typeMeta = PROXY_REQUEST_TYPE_META[item.loaiDon];
                  const statusMeta = getSupervisorRequestStatusMeta(item.trangThai);
                  return (
                    <tr key={item.id} className="hover:bg-muted/25">
                      <td className="whitespace-nowrap px-5 py-4 align-top">
                        <span className="font-bold tabular-nums text-[#164E9B]">
                          {item.maDon}
                        </span>
                        <p className="mt-0.5 text-xs text-muted-foreground tabular-nums">
                          {formatSupervisorDateUtc(item.ngayGui)}
                        </p>
                      </td>

                      <td className="px-5 py-4 align-top">
                        <p className="font-semibold text-[#0F2744]">{item.hoTenNcs}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {item.mshv} • {getRoleShortLabel(item.vaiTroCuaToi)}
                        </p>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 align-top">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${typeMeta.badgeClass}`}
                        >
                          {typeMeta.label}
                        </span>
                      </td>

                      <td className="max-w-sm px-5 py-4 align-top text-xs leading-relaxed text-foreground">
                        {item.loaiDon === "DOI_DE_TAI" ? (
                          <p className="line-clamp-2">
                            <strong className="text-[#0F2744]">Đề tài mới:</strong>{" "}
                            {item.tenDeTaiMoi}
                          </p>
                        ) : (
                          <p className="line-clamp-2">
                            <strong className="text-[#0F2744]">Đề xuất GVHD mới:</strong>{" "}
                            {item.tenGvhdMoi} (thay {item.tenGvhdCu || "chưa phân công"})
                          </p>
                        )}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 align-top">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${statusMeta.badgeClass}`}
                        >
                          {statusMeta.label}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 align-top text-right">
                        <div className="inline-flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedRequestId(item.id)}
                            className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-border bg-background px-3.5 py-2 text-xs font-semibold text-[#0F2744] transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] motion-reduce:transition-none"
                          >
                            <Eye className="size-3.5 text-[#164E9B]" aria-hidden="true" />
                            <span>Xem chi tiết</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {selectedRequest && (
        <ProxyRequestDetailDrawerInner
          key={selectedRequest.id}
          item={selectedRequest}
          onClose={() => setSelectedRequestId(null)}
          onOpenPdf={(pdf) => setActivePdf(pdf)}
          onWithdraw={
            selectedRequest.trangThai === "CHO_DUYET"
              ? () => setWithdrawTarget(selectedRequest)
              : undefined
          }
          isSubDialogOpen={withdrawTarget !== null || activePdf !== null}
        />
      )}

      <ConfirmDialog
        isOpen={withdrawTarget !== null}
        onClose={() => setWithdrawTarget(null)}
        onConfirm={() => void handleConfirmWithdraw()}
        variant="warning"
        title={`Thu hồi đơn đề xuất ${withdrawTarget?.maDon ?? ""}`}
        description={
          withdrawTarget
            ? `Đơn đề xuất ${
                withdrawTarget.loaiDon === "DOI_DE_TAI" ? "Đổi đề tài" : "Đổi GVHD"
              } thay NCS ${withdrawTarget.hoTenNcs} sẽ được rút khỏi hàng chờ của Phòng Đào tạo Sau đại học.`
            : ""
        }
        confirmLabel="Xác nhận thu hồi"
      />

      <PdfViewer
        isOpen={activePdf !== null}
        onClose={() => setActivePdf(null)}
        fileUrl={activePdf?.fileUrl}
        fileName={activePdf?.fileName}
        title={activePdf?.title}
        subtitle={activePdf?.subtitle}
        allowDownload
      />
    </div>
  );
}

export default SupervisorRequestsWorkspace;
