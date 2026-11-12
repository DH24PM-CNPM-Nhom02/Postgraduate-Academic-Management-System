"use client";

import React, { useId, useMemo, useState } from "react";
import {
  AlertCircle,
  Ban,
  Eye,
  FilePlus2,
  FileSearch,
  Filter,
  Info,
  RefreshCw,
  ShieldAlert,
} from "lucide-react";
import type {
  ChangeRequestStatus,
  ChangeRequestTableProps,
  ChangeRequestType,
} from "@/src/types/ui/change-request";
import {
  CHANGE_REQUEST_STATUS_META,
  CHANGE_REQUEST_TYPE_META,
  formatDateVi,
  isPendingRequestStatus,
  summarizeChangeRequest,
} from "./helpers";

/**
 * ChangeRequestTable
 *
 * Bảng theo dõi danh sách đơn đề nghị của NCS (Đổi đề tài, Đổi GVHD, Gia hạn).
 * Hỗ trợ bộ lọc theo loại đơn & trạng thái, trạng thái Loading / Error / Empty,
 * khóa tạo mới khi đang có đơn chờ xử lý và thao tác hủy đơn đang chờ.
 */
export function ChangeRequestTable({
  requests,
  hasPendingRequest,
  onCreateNew,
  onSelectDetail,
  onCancelRequest,
  isLoading = false,
  error = null,
  onRetry,
  className = "",
}: ChangeRequestTableProps) {
  const typeFilterId = useId();
  const statusFilterId = useId();
  const pendingNoteId = useId();

  const [typeFilter, setTypeFilter] = useState<ChangeRequestType | "ALL">("ALL");
  const [statusFilter, setStatusFilter] = useState<ChangeRequestStatus | "ALL">("ALL");

  const resolvedHasPending =
    hasPendingRequest ?? requests.some((r) => isPendingRequestStatus(r.trangThai));

  const filteredRequests = useMemo(() => {
    return requests.filter((item) => {
      if (typeFilter !== "ALL" && item.loaiDon !== typeFilter) return false;
      if (statusFilter !== "ALL" && item.trangThai !== statusFilter) return false;
      return true;
    });
  }, [requests, statusFilter, typeFilter]);

  const hasActiveFilters = typeFilter !== "ALL" || statusFilter !== "ALL";

  if (isLoading) {
    return (
      <section
        aria-busy="true"
        aria-label="Đang tải danh sách đơn đề nghị"
        className={`rounded-2xl border border-border bg-card p-5 sm:p-6 animate-pulse motion-reduce:animate-none space-y-4 ${className}`}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="h-6 w-56 rounded-lg bg-muted" />
          <div className="h-9 w-44 rounded-lg bg-muted" />
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="h-9 w-48 rounded-lg bg-muted/70" />
          <div className="h-9 w-48 rounded-lg bg-muted/70" />
        </div>
        <div className="space-y-2.5 pt-2">
          <div className="h-12 rounded-xl bg-muted/60" />
          <div className="h-12 rounded-xl bg-muted/60" />
          <div className="h-12 rounded-xl bg-muted/60" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section
        role="alert"
        className={`rounded-2xl border border-rose-200 bg-rose-50/60 p-6 space-y-3 ${className}`}
      >
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-rose-200 bg-card text-rose-600">
            <AlertCircle className="size-5" aria-hidden="true" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-bold text-rose-950">
              Không thể tải danh sách đơn đề nghị
            </h2>
            <p className="text-sm text-rose-800">{error}</p>
          </div>
        </div>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-rose-300 bg-card px-4 text-xs font-semibold text-rose-800 transition-colors hover:bg-rose-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 cursor-pointer"
          >
            <RefreshCw className="size-3.5" aria-hidden="true" />
            <span>Thử lại</span>
          </button>
        )}
      </section>
    );
  }

  return (
    <section
      className={`overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-xs ${className}`}
    >
      {/* Thanh tiêu đề & Nút tạo đơn mới */}
      <div className="flex flex-col gap-4 border-b border-border px-5 py-4 sm:flex-row sm:items-start sm:justify-between sm:px-6">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base font-bold text-[#0F2744] sm:text-lg">
              Lịch sử đơn đề nghị đã gửi
            </h2>
            <span className="rounded-full border border-border bg-muted px-2.5 py-0.5 font-mono text-xs font-semibold tabular-nums text-foreground">
              {requests.length} đơn
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Theo dõi trạng thái xử lý, ý kiến tập thể GVHD và quyết định ban hành cho từng đơn.
          </p>
        </div>

        {onCreateNew && (
          <div className="flex flex-col items-start gap-1.5 sm:items-end">
            <button
              type="button"
              disabled={resolvedHasPending}
              onClick={onCreateNew}
              aria-describedby={resolvedHasPending ? pendingNoteId : undefined}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#164E9B] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#113E7D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:bg-slate-200 disabled:text-slate-500 cursor-pointer"
            >
              <FilePlus2 className="size-4" aria-hidden="true" />
              <span>Tạo đơn đề nghị mới</span>
            </button>

            {resolvedHasPending && (
              <p
                id={pendingNoteId}
                className="flex items-center gap-1.5 text-xs font-medium text-amber-800"
              >
                <Info className="size-3.5 shrink-0 text-amber-600" aria-hidden="true" />
                <span>Mỗi thời điểm chỉ được có tối đa 01 đơn đề nghị đang xử lý</span>
              </p>
            )}
          </div>
        )}
      </div>

      {/* Bộ lọc */}
      {requests.length > 0 && (
        <div className="flex flex-wrap items-end gap-3 border-b border-border bg-muted/25 px-5 py-3.5 sm:px-6">
          <div className="flex items-center gap-1.5 self-center text-xs font-semibold text-muted-foreground mr-1">
            <Filter className="size-3.5 text-[#164E9B]" aria-hidden="true" />
            <span>Bộ lọc:</span>
          </div>

          <div className="min-w-44 flex-1 sm:flex-initial">
            <label htmlFor={typeFilterId} className="sr-only">
              Lọc theo loại đơn
            </label>
            <select
              id={typeFilterId}
              value={typeFilter}
              onChange={(e) =>
                setTypeFilter(e.target.value as ChangeRequestType | "ALL")
              }
              className="h-9 w-full rounded-lg border border-border bg-card px-3 text-xs font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B]"
            >
              <option value="ALL">Tất cả loại đơn</option>
              <option value="DOI_DE_TAI">Điều chỉnh đề tài</option>
              <option value="DOI_GVHD">Thay đổi GVHD</option>
              <option value="GIA_HAN">Gia hạn học tập</option>
            </select>
          </div>

          <div className="min-w-48 flex-1 sm:flex-initial">
            <label htmlFor={statusFilterId} className="sr-only">
              Lọc theo trạng thái xử lý
            </label>
            <select
              id={statusFilterId}
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as ChangeRequestStatus | "ALL")
              }
              className="h-9 w-full rounded-lg border border-border bg-card px-3 text-xs font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B]"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="CHO_GVHD_XAC_NHAN">Chờ GVHD xác nhận</option>
              <option value="CHO_DUYET">Chờ Phòng ĐT-SĐH duyệt</option>
              <option value="DA_DUYET">Đã phê duyệt</option>
              <option value="TU_CHOI">Từ chối</option>
              <option value="DA_HUY">Đã hủy</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => {
                setTypeFilter("ALL");
                setStatusFilter("ALL");
              }}
              className="inline-flex h-9 items-center rounded-lg border border-border bg-card px-3 text-xs font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] cursor-pointer"
            >
              Xóa bộ lọc
            </button>
          )}
        </div>
      )}

      {/* Trạng thái Empty hoàn toàn */}
      {requests.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
          <div className="flex size-12 items-center justify-center rounded-2xl border border-border bg-muted/40 text-muted-foreground">
            <FileSearch className="size-6" aria-hidden="true" />
          </div>
          <h3 className="mt-4 text-base font-bold text-foreground">
            Chưa có đơn đề nghị nào được gửi
          </h3>
          <p className="mt-1.5 max-w-md text-xs leading-relaxed text-muted-foreground sm:text-sm">
            Khi có nhu cầu điều chỉnh tên đề tài, thay đổi giảng viên hướng dẫn hoặc
            xin gia hạn thời gian học tập, bạn có thể lập đơn trực tuyến và theo dõi tiến độ tại đây.
          </p>
          {onCreateNew && !resolvedHasPending && (
            <button
              type="button"
              onClick={onCreateNew}
              className="mt-4 inline-flex h-9 items-center gap-2 rounded-lg bg-[#164E9B] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#113E7D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] cursor-pointer"
            >
              <FilePlus2 className="size-4" aria-hidden="true" />
              <span>Tạo đơn đề nghị đầu tiên</span>
            </button>
          )}
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-6 py-10 text-center">
          <p className="text-sm font-semibold text-foreground">
            Không có đơn nào khớp với điều kiện lọc hiện tại
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Thử bỏ bộ lọc loại đơn hoặc trạng thái để xem lại toàn bộ danh sách.
          </p>
          <button
            type="button"
            onClick={() => {
              setTypeFilter("ALL");
              setStatusFilter("ALL");
            }}
            className="mt-3 inline-flex h-9 items-center rounded-lg border border-border bg-card px-3.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] cursor-pointer"
          >
            Hiển thị tất cả đơn
          </button>
        </div>
      ) : (
        <>
          {/* Bảng Desktop */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-xs font-semibold text-muted-foreground">
                  <th scope="col" className="px-6 py-3 whitespace-nowrap">
                    Mã đơn &amp; Ngày gửi
                  </th>
                  <th scope="col" className="px-4 py-3 whitespace-nowrap">
                    Loại đơn
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Tóm tắt nội dung
                  </th>
                  <th scope="col" className="px-4 py-3 whitespace-nowrap">
                    Trạng thái
                  </th>
                  <th scope="col" className="px-6 py-3 text-right whitespace-nowrap">
                    Thao tác
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {filteredRequests.map((item) => {
                  const typeMeta = CHANGE_REQUEST_TYPE_META[item.loaiDon];
                  const statusMeta = CHANGE_REQUEST_STATUS_META[item.trangThai];
                  const TypeIcon = typeMeta.Icon;
                  const StatusIcon = statusMeta.Icon;
                  const canCancel = isPendingRequestStatus(item.trangThai);

                  return (
                    <tr
                      key={item.id}
                      className="transition-colors hover:bg-muted/30"
                    >
                      <td className="px-6 py-3.5 align-top whitespace-nowrap">
                        <div className="space-y-0.5">
                          <button
                            type="button"
                            onClick={() => onSelectDetail(item)}
                            className="font-mono text-xs font-bold text-[#164E9B] underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] rounded-xs cursor-pointer"
                          >
                            {item.maDon}
                          </button>
                          <p className="font-mono text-xs tabular-nums text-muted-foreground">
                            {formatDateVi(item.ngayGui)}
                          </p>
                        </div>
                      </td>

                      <td className="px-4 py-3.5 align-top whitespace-nowrap">
                        <div className="flex flex-col items-start gap-1">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${typeMeta.badgeClass}`}
                          >
                            <TypeIcon className="size-3.5" aria-hidden="true" />
                            <span>{typeMeta.shortLabel}</span>
                          </span>
                          {item.batKhaKhang && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800">
                              <ShieldAlert className="size-3" aria-hidden="true" />
                              <span>Bất khả kháng</span>
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="max-w-md px-4 py-3.5 align-top">
                        <p className="line-clamp-2 text-xs font-medium leading-relaxed text-foreground sm:text-[13px]">
                          {summarizeChangeRequest(item)}
                        </p>
                        {item.trangThai === "TU_CHOI" && item.lyDoTuChoi && (
                          <p className="mt-1 line-clamp-1 text-xs font-medium text-rose-700">
                            Lý do: {item.lyDoTuChoi}
                          </p>
                        )}
                      </td>

                      <td className="px-4 py-3.5 align-top whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusMeta.badgeClass}`}
                        >
                          <StatusIcon className="size-3.5" aria-hidden="true" />
                          <span>{statusMeta.label}</span>
                        </span>
                      </td>

                      <td className="px-6 py-3.5 align-top text-right whitespace-nowrap">
                        <div className="inline-flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => onSelectDetail(item)}
                            className="inline-flex h-8 items-center gap-1 rounded-lg border border-border bg-card px-2.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] cursor-pointer"
                          >
                            <Eye className="size-3.5 text-[#164E9B]" aria-hidden="true" />
                            <span>Chi tiết</span>
                          </button>

                          {canCancel && onCancelRequest && (
                            <button
                              type="button"
                              onClick={() => onCancelRequest(item)}
                              className="inline-flex h-8 items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2.5 text-xs font-semibold text-rose-700 transition-colors hover:bg-rose-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 cursor-pointer"
                            >
                              <Ban className="size-3.5" aria-hidden="true" />
                              <span>Hủy đơn</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Danh sách Mobile */}
          <ul className="divide-y divide-border md:hidden">
            {filteredRequests.map((item) => {
              const typeMeta = CHANGE_REQUEST_TYPE_META[item.loaiDon];
              const statusMeta = CHANGE_REQUEST_STATUS_META[item.trangThai];
              const TypeIcon = typeMeta.Icon;
              const StatusIcon = statusMeta.Icon;
              const canCancel = isPendingRequestStatus(item.trangThai);

              return (
                <li key={item.id} className="p-4 space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#0F2744]">
                        {item.maDon}
                      </span>
                      <span className="font-mono text-xs tabular-nums text-muted-foreground">
                        • {formatDateVi(item.ngayGui)}
                      </span>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${statusMeta.badgeClass}`}
                    >
                      <StatusIcon className="size-3" aria-hidden="true" />
                      <span>{statusMeta.label}</span>
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${typeMeta.badgeClass}`}
                    >
                      <TypeIcon className="size-3" aria-hidden="true" />
                      <span>{typeMeta.shortLabel}</span>
                    </span>
                    {item.batKhaKhang && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800">
                        <ShieldAlert className="size-3" aria-hidden="true" />
                        <span>Bất khả kháng</span>
                      </span>
                    )}
                  </div>

                  <p className="text-xs leading-relaxed text-foreground">
                    {summarizeChangeRequest(item)}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => onSelectDetail(item)}
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-xs font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] cursor-pointer"
                    >
                      <Eye className="size-3.5 text-[#164E9B]" aria-hidden="true" />
                      <span>Chi tiết</span>
                    </button>

                    {canCancel && onCancelRequest && (
                      <button
                        type="button"
                        onClick={() => onCancelRequest(item)}
                        className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 text-xs font-semibold text-rose-700 transition-colors hover:bg-rose-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 cursor-pointer"
                      >
                        <Ban className="size-3.5" aria-hidden="true" />
                        <span>Hủy đơn</span>
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </section>
  );
}

export default ChangeRequestTable;
