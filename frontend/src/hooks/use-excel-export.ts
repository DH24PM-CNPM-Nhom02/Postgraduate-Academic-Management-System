"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { parseApiErrorAsync } from "@/src/lib/api";

export function useExcelExport(
  exportFile: (ids?: string[]) => Promise<Blob>,
  filename: string,
  listName: string,
) {
  return useMutation({
    mutationFn: async (ids?: string[]) => {
      const blob = await exportFile(ids);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    },
    onSuccess: () => {
      toast.success(`Đã xuất danh sách ${listName}.`);
    },
    onError: async (error) => {
      const { message } = await parseApiErrorAsync(error);
      toast.error(`Không thể xuất danh sách ${listName}. ${message}`);
    },
  });
}
