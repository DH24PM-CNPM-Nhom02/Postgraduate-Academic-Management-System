"use client";

import React from "react";
import { Eye, MoreHorizontal, Pencil } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import type { SupervisorQuotaRecord } from "@/src/types/academic";

export interface SupervisorCellActionProps {
  supervisor: SupervisorQuotaRecord;
  onUpdate: (supervisor: SupervisorQuotaRecord) => void;
  onViewDetail: (supervisor: SupervisorQuotaRecord) => void;
}

export function SupervisorCellAction({ supervisor, onUpdate, onViewDetail }: SupervisorCellActionProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="inline-flex size-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-2xs transition-colors hover:bg-slate-50 hover:text-[#164E9B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B]/30"
        title="Thao tác"
      >
        <MoreHorizontal className="size-4" />
        <span className="sr-only">Mở menu thao tác GVHD</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="bottom" sideOffset={6} className="z-50 w-56 min-w-52 rounded-xl border border-slate-200 bg-white p-1.5 text-xs shadow-xl">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {supervisor.name}
          </DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onUpdate(supervisor)} className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-blue-50 hover:text-[#164E9B]">
            <Pencil className="size-4 text-[#164E9B]" />
            <span>Cập nhật thông tin GVHD</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="my-1 border-t border-slate-100" />
          <DropdownMenuItem onClick={() => onViewDetail(supervisor)} className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-[#164E9B]">
            <Eye className="size-4 text-slate-500" />
            <span>Xem hồ sơ chi tiết</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
