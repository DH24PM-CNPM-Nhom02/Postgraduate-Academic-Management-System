"use client";

import { getStudyStatus, canAssignSupervisor } from "@/src/lib/study-status";
import React from "react";
import { MoreHorizontal, UserPlus, Scale, Eye, Pencil } from "lucide-react";
import type { StudentDossier } from "@/src/types/academic";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/src/components/ui/dropdown-menu";

export interface StudentCellActionProps {
  student: StudentDossier;
  onAssignSupervisor: (student: StudentDossier) => void;
  onIssueDecision: (student: StudentDossier) => void;
  onViewDetail: (student: StudentDossier) => void;
  onUpdateInfo: (student: StudentDossier) => void;
}

export function StudentCellAction({
  student,
  onAssignSupervisor,
  onIssueDecision,
  onViewDetail,
  onUpdateInfo,
}: StudentCellActionProps) {
  if (getStudyStatus(student) === "DA_TOT_NGHIEP") {
    return (
      <button
        type="button"
        onClick={() => onViewDetail(student)}
        className="inline-flex size-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-[#164E9B] hover:bg-blue-50"
        title="Xem chi tiết hồ sơ"
        aria-label="Xem chi tiết hồ sơ"
      >
        <Eye className="size-4" aria-hidden="true" />
      </button>
    );
  }

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
        className="w-52 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl text-xs z-50 min-w-48"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Thao tác học vụ
          </DropdownMenuLabel>

          <DropdownMenuItem
            onClick={() => onUpdateInfo(student)}
            className="flex items-center gap-2 px-2.5 py-2 text-xs font-medium text-slate-700 hover:text-[#164E9B] hover:bg-blue-50/70 rounded-lg cursor-pointer transition-colors"
          >
            <Pencil className="size-4 text-[#164E9B] shrink-0" />
            <span>Cập nhật thông tin NCS</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            disabled={!canAssignSupervisor(student)}
            onClick={() => onAssignSupervisor(student)}
            className="flex items-center gap-2 px-2.5 py-2 text-xs font-medium text-slate-700 hover:text-[#164E9B] hover:bg-blue-50/70 rounded-lg cursor-pointer transition-colors"
          >
            <UserPlus className="size-4 text-[#164E9B] shrink-0" />
            <span>Thêm / Đổi GVHD</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => onIssueDecision(student)}
            className="flex items-center gap-2 px-2.5 py-2 text-xs font-medium text-slate-700 hover:text-amber-700 hover:bg-amber-50/70 rounded-lg cursor-pointer transition-colors"
          >
            <Scale className="size-4 text-amber-600 shrink-0" />
            <span>Ban hành QĐ trạng thái</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="my-1 border-t border-slate-100" />

          <DropdownMenuItem
            onClick={() => onViewDetail(student)}
            className="flex items-center gap-2 px-2.5 py-2 text-xs font-medium text-slate-700 hover:text-[#164E9B] hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
          >
            <Eye className="size-4 text-slate-500 shrink-0" />
            <span>Xem chi tiết hồ sơ</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default StudentCellAction;
