"use client";

import React from "react";
import {
  MoreHorizontal,
  Eye,
  PlusCircle,
  Ban,
  FileText,
  Clock,
} from "lucide-react";
import type { AcademicThesisNcsItem } from "@/src/types/api/thesis";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/src/components/ui/dropdown-menu";

export interface ThesisRowActionProps {
  item: AcademicThesisNcsItem;
  onViewDetail: (item: AcademicThesisNcsItem) => void;
  onAssignThesis: (item: AcademicThesisNcsItem) => void;
  onDeactivateThesis: (item: AcademicThesisNcsItem) => void;
  onViewDecision?: (item: AcademicThesisNcsItem) => void;
}

export function ThesisRowAction({
  item,
  onViewDetail,
  onAssignThesis,
  onDeactivateThesis,
  onViewDecision,
}: ThesisRowActionProps) {
  // Điều kiện được phép Giao đề tài mới:
  // Chưa có đề tài hiệu lực, không có đơn chờ duyệt, và tình trạng học tập là DANG_HOC hoặc GIA_HAN
  const isEnrolledOrExtended =
    !item.trangThaiHocTap ||
    item.trangThaiHocTap === "DANG_HOC" ||
    item.trangThaiHocTap === "GIA_HAN";

  const canAssignThesis =
    item.trangThaiDeTai === "CHUA_GIAO" &&
    !item.hasPendingChangeRequest &&
    isEnrolledOrExtended;

  // Điều kiện được phép Hủy đề tài (Giao sai / vô hiệu hóa):
  // Đang có đề tài HIEU_LUC và không có đơn xin điều chỉnh chờ duyệt
  const canDeactivateThesis =
    item.trangThaiDeTai === "HIEU_LUC" &&
    Boolean(item.deTaiHienTai) &&
    !item.hasPendingChangeRequest;

  // Có quyết định phê duyệt kèm file/số hiệu
  const hasDecision = Boolean(
    item.deTaiHienTai?.quyetDinh?.fileId ||
      item.deTaiHienTai?.quyetDinh?.soQuyetDinh ||
      item.deTaiHienTai?.quyetDinhId
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="inline-flex size-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-[#164E9B] hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B]/30"
        title="Thao tác"
      >
        <MoreHorizontal className="size-4" />
        <span className="sr-only">Mở menu thao tác</span>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        side="bottom"
        sideOffset={6}
        className="w-56 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl text-xs z-50 min-w-52"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Quản lý đề tài
          </DropdownMenuLabel>

          {/* 1. XEM CHI TIẾT & LỊCH SỬ ĐỀ TÀI */}
          <DropdownMenuItem
            onClick={() => onViewDetail(item)}
            className="flex items-center gap-2 px-2.5 py-2 text-xs font-medium text-slate-700 hover:text-[#164E9B] hover:bg-blue-50/70 rounded-lg cursor-pointer transition-colors"
          >
            <Eye className="size-4 text-[#164E9B] shrink-0" />
            <span>Xem chi tiết &amp; Lịch sử đề tài</span>
          </DropdownMenuItem>

          {/* 2. GIAO ĐỀ TÀI MỚI */}
          {canAssignThesis ? (
            <DropdownMenuItem
              onClick={() => onAssignThesis(item)}
              className="flex items-center gap-2 px-2.5 py-2 text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50/70 rounded-lg cursor-pointer transition-colors"
            >
              <PlusCircle className="size-4 text-emerald-600 shrink-0" />
              <span>Giao đề tài mới</span>
            </DropdownMenuItem>
          ) : item.hasPendingChangeRequest ? (
            <div
              className="flex items-center gap-2 px-2.5 py-1.5 text-[11px] text-amber-700 bg-amber-50/60 rounded-md my-0.5"
              title="Đang có hồ sơ xin điều chỉnh chờ phê duyệt"
            >
              <Clock className="size-3.5 shrink-0 text-amber-600" />
              <span>Đang có đơn chờ duyệt</span>
            </div>
          ) : null}

          {/* 3. XEM QUYẾT ĐỊNH GIAO ĐỀ TÀI */}
          {hasDecision && (
            <DropdownMenuItem
              onClick={() => onViewDecision?.(item)}
              className="flex items-center gap-2 px-2.5 py-2 text-xs font-medium text-slate-700 hover:text-[#164E9B] hover:bg-blue-50/70 rounded-lg cursor-pointer transition-colors"
            >
              <FileText className="size-4 text-slate-500 shrink-0" />
              <span>Xem Quyết định giao đề tài</span>
            </DropdownMenuItem>
          )}

          {/* 4. HỦY ĐỀ TÀI (GIAO SAI) */}
          {canDeactivateThesis && (
            <>
              <DropdownMenuSeparator className="my-1 border-t border-slate-100" />
              <DropdownMenuItem
                onClick={() => onDeactivateThesis(item)}
                className="flex items-center gap-2 px-2.5 py-2 text-xs font-medium text-rose-700 hover:text-rose-800 hover:bg-rose-50/70 rounded-lg cursor-pointer transition-colors"
              >
                <Ban className="size-4 text-rose-600 shrink-0" />
                <span>Hủy đề tài (Giao sai)</span>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ThesisRowAction;
