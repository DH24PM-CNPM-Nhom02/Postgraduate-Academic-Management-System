"use client";

import { Dialog } from "@base-ui/react/dialog";
import { GraduationCap, X } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/src/components/ui/button";

export const graduationPrimaryButton = "bg-[#164E9B] text-white hover:bg-[#113E7D]";

export function GraduationDialog({
  title,
  description,
  children,
  onClose,
  busy = false,
}: {
  title: string;
  description: string;
  children: ReactNode;
  onClose: () => void;
  busy?: boolean;
}) {
  return (
    <Dialog.Root open onOpenChange={(open) => { if (!open && !busy) onClose(); }}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-[60] bg-slate-950/60 backdrop-blur-xs" />
        <Dialog.Popup className="fixed left-1/2 top-1/2 z-[60] flex max-h-[92dvh] w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl data-[nested-dialog-open]:hidden">
          <header className="flex items-center justify-between gap-3 bg-[#164E9B] px-5 py-4 text-white sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                <GraduationCap className="size-5" aria-hidden="true" />
              </div>
              <div>
                <Dialog.Title className="text-base font-bold">{title}</Dialog.Title>
                <Dialog.Description className="mt-0.5 text-xs text-white/85">{description}</Dialog.Description>
              </div>
            </div>
            <Dialog.Close
              aria-label="Đóng"
              disabled={busy}
              className="shrink-0 rounded-lg p-1.5 text-white/80 hover:bg-white/20 hover:text-white disabled:opacity-50"
            >
              <X className="size-5" />
            </Dialog.Close>
          </header>
          {children}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function GraduationDialogFooter({ children }: { children: ReactNode }) {
  return (
    <footer className="flex shrink-0 flex-wrap justify-end gap-2 border-t border-slate-200 bg-slate-50 px-5 py-3 sm:px-6">
      {children}
    </footer>
  );
}

export function GraduationLoadError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
      <p role="alert">{message}</p>
      <Button type="button" variant="outline" size="sm" onClick={onRetry}>Thử lại</Button>
    </div>
  );
}
