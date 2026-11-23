"use client";

import { useBodyScrollLock } from "@/src/hooks/use-body-scroll-lock";

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
import { DocumentViewButton } from "@/src/components/student/progress/document-view-button";
import { toast } from "sonner";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { SupervisorSelect } from "./supervisor-select";
import type { ColumnDef } from "@tanstack/react-table";
import { ManagementDataTable, useManagementDataTable } from "@/src/components/ui/management-data-table";
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

interface DetailDrawerInnerProps {
  item: SupervisorProxyRequestItem;
  onClose: () => void;
  onWithdraw?: () => void;
  isSubDialogOpen: boolean;
}

function ProxyRequestDetailDrawerInner({
  item,
  onClose,
  onWithdraw,
  isSubDialogOpen,
}: DetailDrawerInnerProps) {
  const titleId = useId();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const typeMeta = PROXY_REQUEST_TYPE_META[item.loaiDon];
  const statusMeta = getSupervisorRequestStatusMeta(item.trangThai);

  useBodyScrollLock();

  useEffect(() => {
    previousFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const timer = window.setTimeout(() => {
      closeBtnRef.current?.focus();
    }, 0);

    return () => {
      window.clearTimeout(timer);
      previousFocusRef.current?.focus();
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSubDialogOpen && !isPreviewOpen) {
        event.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPreviewOpen, isSubDialogOpen, onClose]);

  return (
    <>
      <div
        aria-hidden="true"
        onClick={() => {
          if (!isSubDialogOpen && !isPreviewOpen) onClose();
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
              {item.mshv}{item.khoaDaoTao && ` · ${item.khoaDaoTao}`} · Gửi ngày{" "}
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

              {item.tepDinhKem.fileId && (
                <DocumentViewButton fileId={item.tepDinhKem.fileId} fileName={item.tepDinhKem.fileName} variant="default" onPreviewChange={setIsPreviewOpen} />
              )}
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
              {item.quyetDinh.fileId ? (
                <DocumentViewButton fileId={item.quyetDinh.fileId} fileName={item.quyetDinh.fileName} variant="default" onPreviewChange={setIsPreviewOpen} />
              ) : <span className="text-xs text-muted-foreground">Chưa có tệp PDF</span>}
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
  requests,
  students,
  isLoading = false,
  error = null,
  onRetry,
  onCreateRequest,
  onWithdrawRequest,
}: SupervisorRequestsWorkspaceProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<SupervisorProxyRequestType | "ALL">(
    "ALL"
  );
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [withdrawTarget, setWithdrawTarget] =
    useState<SupervisorProxyRequestItem | null>(null);
  const [feedbackBanner, setFeedbackBanner] = useState<string | null>(null);
  const eligibleStudents = useMemo(() => students.filter(
    (student) => student.trangThaiHocTap !== "TOT_NGHIEP" && student.trangThaiHocTap !== "TAM_DUNG",
  ), [students]);

  const selectedRequest = useMemo(
    () => requests.find((item) => item.id === selectedRequestId) ?? null,
    [requests, selectedRequestId]
  );

  const counts = useMemo(() => {
    const topicCount = requests.filter((r) => r.loaiDon === "DOI_DE_TAI").length;
    const supervisorCount = requests.filter(
      (r) => r.loaiDon === "DOI_GVHD"
    ).length;
    const pendingCount = requests.filter(
      (r) => r.trangThai === "CHO_DUYET"
    ).length;
    return {
      total: requests.length,
      topicCount,
      supervisorCount,
      pendingCount,
    };
  }, [requests]);

  const filteredRequests = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase();
    return requests.filter((item) => {
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
  }, [requests, searchQuery, typeFilter]);

  const columns = useMemo<ColumnDef<SupervisorProxyRequestItem>[]>(() => [
    {
      id: "request",
      header: "Mã đơn / Ngày gửi",
      cell: ({ row: { original: item } }) => {
        return (
          <>
            <span className="font-bold tabular-nums text-[#164E9B]">
              {item.maDon}
            </span>
            <p className="mt-0.5 text-xs text-muted-foreground tabular-nums">
              {formatSupervisorDateUtc(item.ngayGui)}
            </p>
          </>
        );
      },
    },
    {
      id: "student",
      header: "Nghiên cứu sinh",
      cell: ({ row: { original: item } }) => {
        return (
          <>
            <p className="font-semibold text-[#0F2744]">{item.hoTenNcs}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {item.mshv}{item.vaiTroCuaToi && ` · ${getRoleShortLabel(item.vaiTroCuaToi)}`}
            </p>
          </>
        );
      },
    },
    {
      id: "type",
      header: "Loại đề xuất",
      cell: ({ row: { original: item } }) => {
        const typeMeta = PROXY_REQUEST_TYPE_META[item.loaiDon];
        return (
          <>
            <span
              className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${typeMeta.badgeClass}`}
            >
              {typeMeta.label}
            </span>
          </>
        );
      },
    },
    {
      id: "description",
      header: "Nội dung đề xuất chính",
      cell: ({ row: { original: item } }) => {
        return (
          item.loaiDon === "DOI_DE_TAI" ? (
            <p className="line-clamp-2">
              <strong className="text-[#0F2744]">Đề tài mới:</strong>{" "}
              {item.tenDeTaiMoi}
            </p>
          ) : (
            <p className="line-clamp-2">
              <strong className="text-[#0F2744]">Đề xuất GVHD mới:</strong>{" "}
              {item.tenGvhdMoi} (thay {item.tenGvhdCu || "chưa phân công"})
            </p>
          )
        );
      },
    },
    {
      id: "status",
      header: "Trạng thái",
      cell: ({ row: { original: item } }) => {
        const statusMeta = getSupervisorRequestStatusMeta(item.trangThai);
        return (
          <>
            <span
              className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${statusMeta.badgeClass}`}
            >
              {statusMeta.label}
            </span>
          </>
        );
      },
    },
    {
      id: "actions",
      header: "Thao tác",
      cell: ({ row: { original: item } }) => {
        return (
          <>
            <div className="inline-flex items-center justify-end gap-2">
              <Button variant="outline" size="sm"
                type="button"
                onClick={() => setSelectedRequestId(item.id)}
              >
                <Eye className="size-3.5 text-[#164E9B]" aria-hidden="true" />
                <span>Xem chi tiết</span>
              </Button>
            </div>
          </>
        );
      },
    },
  ], []);

  const table = useManagementDataTable({
    data: filteredRequests,
    columns,
    getRowId: (item) => item.id,
  });

  const handleCreateSubmit = async (values: SupervisorProxyRequestFormValues) => {
    setIsCreating(true);
    try {
      await onCreateRequest(values);
      setShowCreateForm(false);
      setFeedbackBanner("Đã gửi đơn đề xuất thay NCS.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleConfirmWithdraw = async () => {
    if (!withdrawTarget || isWithdrawing) return;
    setIsWithdrawing(true);
    try {
      await onWithdrawRequest(withdrawTarget.id);
      setFeedbackBanner(`Đã thu hồi đơn đề xuất ${withdrawTarget.maDon}.`);
      setWithdrawTarget(null);
      setSelectedRequestId(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể thu hồi đơn đề xuất.");
    } finally {
      setIsWithdrawing(false);
    }
  };

  return (
    <div className="space-y-6 pb-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0F2744]">
            Đề xuất thay Nghiên cứu sinh
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
            disabled={isCreating || (!showCreateForm && (isLoading || eligibleStudents.length === 0))}
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
          students={eligibleStudents}
          isSubmitting={isCreating}
          onSubmit={handleCreateSubmit}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      {!isLoading && !error && (
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
          <div className="w-full md:w-56">
            <SupervisorSelect
              label="Lọc loại đề xuất"
              value={typeFilter}
              onValueChange={setTypeFilter}
              options={[
                { value: "ALL", label: "Tất cả đơn" },
                { value: "DOI_DE_TAI", label: "Đổi đề tài" },
                { value: "DOI_GVHD", label: "Đổi GVHD" },
              ]}
            />
          </div>

          <div className="relative w-full md:w-72">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              type="search"
              aria-label="Tìm theo mã đơn, tên NCS hoặc đề tài"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
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
        ) : error ? null : filteredRequests.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <FileText
              className="mx-auto size-10 text-muted-foreground/60"
              aria-hidden="true"
            />
            <p className="mt-3 text-sm font-semibold text-[#0F2744]">
              {requests.length ? "Không có đơn đề xuất phù hợp với bộ lọc" : "Chưa có đơn đề xuất thay NCS"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {eligibleStudents.length ? "Bạn có thể lập đề xuất đổi đề tài hoặc đổi GVHD cho NCS đang hướng dẫn." : "Chưa có NCS đang học hoặc đang gia hạn để lập đề xuất."}
            </p>
          </div>
        ) : (
          <div className="space-y-3 p-4">
            <ManagementDataTable
              table={table}
              minWidth="min-w-[840px]"
              itemLabel="đơn đề xuất"
              cellStyles={{ description: "max-w-64 whitespace-normal px-3 py-3.5" }}
              emptyState="Chưa có đơn đề xuất"
            />
          </div>
        )}
      </section>

      {selectedRequest && (
        <ProxyRequestDetailDrawerInner
          key={selectedRequest.id}
          item={selectedRequest}
          onClose={() => setSelectedRequestId(null)}
          onWithdraw={
            selectedRequest.trangThai === "CHO_DUYET"
              ? () => setWithdrawTarget(selectedRequest)
              : undefined
          }
          isSubDialogOpen={withdrawTarget !== null}
        />
      )}

      <ConfirmDialog
        isOpen={withdrawTarget !== null}
        onClose={() => { if (!isWithdrawing) setWithdrawTarget(null); }}
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
        isLoading={isWithdrawing}
      />

    </div>
  );
}

export default SupervisorRequestsWorkspace;
