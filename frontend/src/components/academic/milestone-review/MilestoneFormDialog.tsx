"use client";

import { useEffect, useId, useRef, type FormEventHandler, type ReactNode } from "react";
import { Loader2, X } from "lucide-react";

interface MilestoneFormDialogProps {
  title: string;
  description: string;
  icon: ReactNode;
  submitLabel: string;
  busyLabel: string;
  busy: boolean;
  submitDisabled?: boolean;
  danger?: boolean;
  onClose: () => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
  children: ReactNode;
}

export function MilestoneFormDialog({
  title,
  description,
  icon,
  submitLabel,
  busyLabel,
  busy,
  submitDisabled,
  danger,
  onClose,
  onSubmit,
  children,
}: MilestoneFormDialogProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const element = dialog.current;
    element?.showModal();
    return () => element?.close();
  }, []);

  return (
    <dialog
      ref={dialog}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onCancel={(event) => { event.preventDefault(); if (!busy) onClose(); }}
      className="m-auto max-h-[min(90dvh,48rem)] w-[calc(100%-2rem)] max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-800 shadow-2xl backdrop:bg-slate-950/55 backdrop:backdrop-blur-xs open:flex open:flex-col"
    >
      <header className="flex shrink-0 items-start justify-between gap-3 bg-[#164E9B] px-4 py-4 text-white sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/15" aria-hidden="true">{icon}</span>
          <div>
            <h2 id={titleId} className="text-base font-bold">{title}</h2>
            <p id={descriptionId} className="mt-0.5 text-xs text-blue-50">{description}</p>
          </div>
        </div>
        <button type="button" onClick={onClose} disabled={busy} aria-label="Đóng"
          className="grid size-8 shrink-0 place-items-center rounded-lg text-white/90 hover:bg-white/20 disabled:opacity-50">
          <X className="size-5" />
        </button>
      </header>

      <form onSubmit={onSubmit} className="flex min-h-0 flex-col">
        <div className="min-h-0 space-y-4 overflow-y-auto px-4 py-5 text-xs sm:px-6">{children}</div>
        <footer className="flex shrink-0 flex-wrap justify-end gap-2 border-t border-slate-200 bg-slate-50 px-4 py-3 sm:px-6">
          <button type="button" disabled={busy} onClick={onClose} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50">Hủy</button>
          <button
            type="submit"
            disabled={busy || submitDisabled}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-50 ${danger ? "bg-rose-700 hover:bg-rose-800" : "bg-[#164E9B] hover:bg-[#123E7C]"}`}
          >
            {busy && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
            {busy ? busyLabel : submitLabel}
          </button>
        </footer>
      </form>
    </dialog>
  );
}
