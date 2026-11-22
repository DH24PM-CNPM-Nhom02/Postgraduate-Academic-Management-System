"use client";

import { useState } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { toast } from "sonner";
import { Button } from "@/src/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/src/components/ui/select";
import { PdfUploader } from "@/src/components/upload/PdfUploader";
import { useUploadDocument } from "@/src/hooks/api/use-documents";

const uploadTypes = { BIEU_MAU: "Biểu mẫu", QUY_DINH: "Quy định" };

export function UploadDocumentModal({ onClose }: { onClose: () => void }) {
  const [type, setType] = useState<keyof typeof uploadTypes>("BIEU_MAU");
  const [file, setFile] = useState<File | null>(null);
  const upload = useUploadDocument();

  function submit() {
    if (!file || upload.isPending) return;
    upload.mutate(
      { file, documentType: type },
      {
        onSuccess: () => {
          toast.success("Đã tải lên " + file.name);
          onClose();
        },
      },
    );
  }

  return (
    <Dialog.Root
      open
      onOpenChange={(open) => {
        if (!open && !upload.isPending) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-slate-950/45" />
        <Dialog.Popup className="fixed left-1/2 top-1/2 z-50 max-h-[90dvh] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 space-y-5 overflow-auto rounded-2xl border bg-white p-6 shadow-xl">
          
          <Dialog.Title className="text-lg font-bold text-[#0F2744]">
            Tải lên tài liệu
          </Dialog.Title>
          <label id="upload-type" className="block text-sm font-medium">
            Loại tài liệu
          </label>
          <Select
            items={uploadTypes}
            value={type}
            disabled={upload.isPending}
            onValueChange={(v) => {
              if (v) setType(v);
            }}
          >
            <SelectTrigger aria-labelledby="upload-type" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(uploadTypes).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <PdfUploader
            selectedFile={file}
            onFileSelect={(f) => {
              setFile(f);
              upload.reset();
            }}
            disabled={upload.isPending}
            required
          />
          {upload.error && (
            <p role="alert" className="text-sm text-rose-700">
              {upload.error.message}
            </p>
          )}
          <div className="flex justify-end gap-2 border-t pt-4">
            <Button
              variant="outline"
              disabled={upload.isPending}
              onClick={onClose}
            >
              Hủy
            </Button>
            <Button disabled={!file || upload.isPending} onClick={submit} className="inline-flex items-center gap-1.5 border border-blue-200 bg-blue-50/80 px-3 py-2 text-xs font-bold text-[#164E9B] hover:bg-blue-100 shadow-2xs transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-50" >
              {upload.isPending ? "Đang tải lên…" : "Tải lên"}
            </Button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
