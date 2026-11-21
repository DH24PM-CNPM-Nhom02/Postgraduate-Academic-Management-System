"use client";

import { Ban, Eye, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel } from "@/src/components/ui/dropdown-menu";
import type { DecisionItem } from "@/src/types/academic";

interface DecisionCellActionProps {
  decision: DecisionItem;
  onViewDetail: (decision: DecisionItem) => void;
  onDeactivate: (decision: DecisionItem) => void;
}

export function DecisionCellAction({ decision, onViewDetail, onDeactivate }: DecisionCellActionProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex size-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50" aria-label={`Thao tác quyết định ${decision.soQuyetDinh}`}>
        <MoreHorizontal className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Thao tác học vụ
          </DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => onViewDetail(decision)}
            className="flex items-center gap-2 px-2.5 py-2 text-xs font-medium text-slate-700 hover:text-[#164E9B] hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
          >
            <Eye className="size-4" /> Xem chi tiết
          </DropdownMenuItem>
          {decision.trangThai === "HIEU_LUC" && (
            <DropdownMenuItem
              className="flex items-center gap-2 px-2.5 py-2 text-xs font-medium text-red-700 hover:text-red-700 rounded-lg cursor-pointer transition-colors"
              onClick={() => onDeactivate(decision)}
            >
              <Ban className="size-4" /> Vô hiệu hóa
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
