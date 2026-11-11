"use client";

import React, { useState } from "react";
import {
  AlertTriangle,
  Award,
  CheckCircle2,
  ChevronRight,
  Clock,
  FileCheck2,
  Inbox,
  RefreshCw,
  ShieldAlert,
  Sparkles,
  UserCheck,
} from "lucide-react";
import type { NotificationItem } from "@/src/types/notification";

export interface NotificationListProps {
  items: NotificationItem[];
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  onRetry?: () => void;
  onItemClick: (item: NotificationItem) => void;
  emptyTitle?: string;
  emptyDescription?: string;
  nowMs?: number;
}

function formatTimeAgo(dateStr: string, nowMs: number) {
  try {
    const diffMs = nowMs - new Date(dateStr).getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    if (diffMins < 1) return "Vừa xong";
    if (diffMins < 60) return `${diffMins} phút trước`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} giờ trước`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return "Hôm qua";
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return new Date(dateStr).toLocaleDateString("vi-VN");
  } catch {
    return "Gần đây";
  }
}

function renderItemVisual(item: NotificationItem) {
  const loai = item.loai;
  if (loai === "MOC_DUOC_DUYET" || loai === "GVHD_MOC_DUOC_DUYET") {
    return {
      icon: <CheckCircle2 className="size-4.5 text-emerald-600" />,
      badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
      label: "Mốc đã duyệt",
    };
  }
  if (loai === "MOC_BI_TU_CHOI" || loai === "GVHD_MOC_BI_TU_CHOI") {
    return {
      icon: <AlertTriangle className="size-4.5 text-rose-600" />,
      badgeBg: "bg-rose-50 text-rose-700 border-rose-200",
      label: "Cần nộp lại",
    };
  }
  if (loai === "CO_PHIEU_NHAN_XET_MOI") {
    return {
      icon: <FileCheck2 className="size-4.5 text-[#164E9B]" />,
      badgeBg: "bg-[#164E9B]/10 text-[#164E9B] border-[#164E9B]/25",
      label: "Phiếu nhận xét",
    };
  }
  if (
    loai === "NCS_DUOC_PHAN_CONG_GVHD" ||
    loai === "GVHD_NHAN_NCS" ||
    loai === "THAY_DOI_PHAN_CONG_GVHD"
  ) {
    return {
      icon: <UserCheck className="size-4.5 text-blue-600" />,
      badgeBg: "bg-blue-50 text-blue-700 border-blue-200",
      label: "Phân công GVHD",
    };
  }
  if (
    loai === "QUYET_DINH_DOI_TRANG_THAI" ||
    loai === "GVHD_QUYET_DINH_DOI_TRANG_THAI" ||
    loai === "QUYET_DINH_BI_HUY"
  ) {
    return {
      icon: <Award className="size-4.5 text-amber-600" />,
      badgeBg: "bg-amber-50 text-amber-700 border-amber-200",
      label: "Quyết định",
    };
  }
  if (loai === "NHAC_HAN_HOC_TAP" || loai === "CANH_BAO_HET_HAN_DAO_TAO") {
    return {
      icon: <Clock className="size-4.5 text-orange-600" />,
      badgeBg: "bg-orange-50 text-orange-700 border-orange-200",
      label: "Nhắc hạn",
    };
  }
  if (loai === "CANH_BAO_TAI_KHOAN" || loai === "TAI_KHOAN_DOI_MAT_KHAU") {
    return {
      icon: <ShieldAlert className="size-4.5 text-slate-700" />,
      badgeBg: "bg-slate-100 text-slate-700 border-slate-200",
      label: "Bảo mật",
    };
  }
  return {
    icon: <Sparkles className="size-4.5 text-[#164E9B]" />,
    badgeBg: "bg-[#164E9B]/10 text-[#164E9B] border-[#164E9B]/25",
    label: "Học vụ",
  };
}

/**
 * NotificationList
 *
 * Danh sách thông báo với đầy đủ 4 trạng thái: Loading, Error (có nút thử lại), Empty và Data.
 */
export function NotificationList({
  items,
  isLoading = false,
  isError = false,
  errorMessage = "Không thể tải danh sách thông báo. Vui lòng thử lại sau.",
  onRetry,
  onItemClick,
  emptyTitle = "Không có thông báo nào trong mục này",
  emptyDescription = "Các cập nhật mốc đào tạo, quyết định và phân công sẽ hiển thị tại đây.",
  nowMs,
}: NotificationListProps) {
  const [fallbackNow] = useState(() => Date.now());
  const effectiveNow = nowMs ?? fallbackNow;

  if (isLoading) {
    return (
      <div
        role="status"
        aria-label="Đang tải thông báo"
        className="py-12 text-center text-xs text-muted-foreground"
      >
        <div className="mx-auto mb-2 size-6 animate-spin rounded-full border-2 border-[#164E9B] border-t-transparent motion-reduce:animate-none" />
        <span>Đang tải thông báo...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div role="alert" className="px-6 py-10 text-center">
        <div className="mx-auto mb-2.5 flex size-11 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
          <AlertTriangle className="size-5" />
        </div>
        <p className="text-xs font-bold text-foreground">
          Tải thông báo không thành công
        </p>
        <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
          {errorMessage}
        </p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-3 inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg bg-[#164E9B] px-3.5 text-xs font-semibold text-white transition-colors hover:bg-[#113E7D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B]"
          >
            <RefreshCw className="size-3.5" />
            <span>Thử lại</span>
          </button>
        )}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="px-6 py-12 text-center">
        <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
          <Inbox className="size-6" />
        </div>
        <p className="text-xs font-bold text-foreground">{emptyTitle}</p>
        <p className="mt-0.5 text-[11px] text-muted-foreground">
          {emptyDescription}
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border">
      {items.map((item) => {
        const visual = renderItemVisual(item);
        return (
          <button
            type="button"
            key={item.id}
            onClick={() => onItemClick(item)}
            className={`flex w-full cursor-pointer items-start gap-3 p-3.5 text-left transition-colors hover:bg-muted/50 focus-visible:bg-muted/60 focus-visible:outline-none ${
              !item.daDoc ? "bg-[#164E9B]/5" : "bg-card"
            }`}
          >
            <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted/60 text-foreground">
              {visual.icon}
            </div>

            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-1.5">
                  <span
                    className={`rounded-md border px-1.5 py-0.5 text-[10px] font-semibold ${visual.badgeBg}`}
                  >
                    {visual.label}
                  </span>
                  {!item.daDoc && (
                    <span
                      aria-label="Chưa đọc"
                      className="size-2 shrink-0 rounded-full bg-rose-500 ring-2 ring-card"
                    />
                  )}
                </div>
                <span className="whitespace-nowrap text-[10px] font-medium text-muted-foreground">
                  {formatTimeAgo(item.createdAt, effectiveNow)}
                </span>
              </div>

              <h4
                className={`line-clamp-1 text-xs leading-snug ${
                  !item.daDoc
                    ? "font-bold text-[#0F2744]"
                    : "font-semibold text-foreground"
                }`}
              >
                {item.tieuDe}
              </h4>

              <p className="line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
                {item.noiDung}
              </p>
            </div>

            <ChevronRight className="size-4 shrink-0 self-center text-muted-foreground" />
          </button>
        );
      })}
    </div>
  );
}
