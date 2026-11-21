import { useCallback } from "react";
import { Eye, MoreHorizontal, Trash2 } from "lucide-react";
import { DocumentViewButton } from "@/src/components/student/progress/document-view-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import type { DocumentListItem } from "@/src/types/api/document";

interface DocumentCellActionProps {
  document: DocumentListItem;
  onDelete: (document: DocumentListItem) => void;
}

export function DocumentCellAction({
  document,
  onDelete,
}: DocumentCellActionProps) {
  const MenuTrigger = useCallback(
    ({ openPreview }: { openPreview: () => void }) => (
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label={`Thao tác với ${document.originalName}`}
          className="inline-flex size-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B]/30"
        >
          <MoreHorizontal className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-40">
          <DropdownMenuItem onClick={openPreview}>
            <Eye /> Xem PDF
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => onDelete(document)}
          >
            <Trash2 /> Xóa tài liệu
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    [document, onDelete],
  );

  return (
    <DocumentViewButton
      fileId={document.id}
      fileName={document.originalName}
      Trigger={MenuTrigger}
    />
  );
}
