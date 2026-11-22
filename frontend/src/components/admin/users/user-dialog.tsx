"use client";

import type { ReactNode } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { AlertCircle, X } from "lucide-react";

export const userPrimaryButton = "bg-[#164E9B] text-white hover:bg-[#123E7C] focus-visible:ring-[#164E9B]/30";

interface UserDialogProps {
  title: string;
  description: string;
  onClose: () => void;
  children: ReactNode;
  pending?: boolean;
  wide?: boolean;
  preserveResult?: boolean;
}

export function UserDialog({
  title,
  description,
  onClose,
  children,
  pending = false,
  wide = false,
  preserveResult = false,
}: UserDialogProps) {
  return (
    <Dialog.Root
      open
      disablePointerDismissal={preserveResult}
      onOpenChange={(open, event) => {
        if (open) return;
        if (pending || (preserveResult && event.reason === "escape-key")) {
          event.cancel();
          return;
        }
        onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-slate-950/45" />
        <Dialog.Popup
          className={`fixed top-1/2 left-1/2 z-50 flex max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl outline-none ${wide ? "max-w-3xl" : "max-w-lg"}`}
        >
          <header className="flex shrink-0 items-start justify-between gap-3 bg-[#164E9B] px-5 py-4 text-white sm:px-6">
            <div>
              <Dialog.Title className="text-base font-bold">{title}</Dialog.Title>
              <Dialog.Description className="mt-1 text-sm text-blue-100">{description}</Dialog.Description>
            </div>
            {!preserveResult && (
              <Dialog.Close
                disabled={pending}
                aria-label="Đóng hộp thoại"
                className="rounded-lg p-1.5 hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-white disabled:opacity-50"
              >
                <X className="size-4" aria-hidden="true" />
              </Dialog.Close>
            )}
          </header>
          <div className="min-h-0 overflow-y-auto px-5 py-5 sm:px-6">
            {children}
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function UserDialogError({ message }: { message: string }) {
  return (
    <p role="alert" className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
      <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      {message}
    </p>
  );
}
