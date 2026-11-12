"use client";

import { useEffect, useId, useState } from "react";
import {
  Check,
  Copy,
  GitCompare,
  GraduationCap,
  Info,
  ShieldAlert,
  User,
  X,
} from "lucide-react";
import { SYSTEM_ROLE_META } from "../users/user-meta";
import { AuditBadge } from "./audit-badge";
import { AuditDiffViewer } from "./audit-diff-viewer";
import {
  type AuditLogViewItem,
  formatAuditDateTime,
  formatRelativeAuditTime,
  getAuditClientIp,
  getAuditCorrelationId,
  getAuditNcsName,
  getEntityTypeLabel,
} from "./audit-meta";

export interface AuditDetailDialogProps {
  log: AuditLogViewItem | null;
  isOpen: boolean;
  onClose: () => void;
  initialTab?: "overview" | "diff";
}

export function AuditDetailDialog({
  log,
  isOpen,
  onClose,
  initialTab = "overview",
}: AuditDetailDialogProps) {
  const titleId = useId();
  const overviewTabId = useId();
  const diffTabId = useId();
  const overviewPanelId = useId();
  const diffPanelId = useId();

  const [activeTab, setActiveTab] = useState<"overview" | "diff">(initialTab);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setCopiedField(null);
    }
  }, [isOpen, initialTab, log?.id]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !log) return null;

  const correlationId = getAuditCorrelationId(log);
  const clientIp = getAuditClientIp(log);
  const ncsName = getAuditNcsName(log.ncs);

  const handleCopy = async (field: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 1800);
    } catch {
      setCopiedField(null);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
        className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xl animate-in fade-in zoom-in-95 duration-150 motion-reduce:animate-none"
      >
        {/* Dialog Header */}
        <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-4">
          <div className="min-w-0 space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <AuditBadge action={log.action} showCode />
              <span className="font-mono text-xs text-muted-foreground">
                #{log.id}
              </span>
            </div>
            <h2
              id={titleId}
              className="text-base font-bold text-foreground"
            >
              {log.summary}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng chi tiết bản ghi kiểm toán"
            className="rounded-lg p-1.5 text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/40"
          >
            <X className="size-4.5" />
          </button>
        </div>

        {/* Tabs */}
        <div
          role="tablist"
          aria-label="Chi tiết bản ghi kiểm toán"
          className="flex gap-1 border-b border-border bg-muted/30 px-6 pt-3"
        >
          <button
            id={overviewTabId}
            type="button"
            role="tab"
            aria-selected={activeTab === "overview"}
            aria-controls={overviewPanelId}
            onClick={() => setActiveTab("overview")}
            className={`inline-flex items-center gap-2 border-b-2 px-3 pb-2.5 text-xs font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/40 ${
              activeTab === "overview"
                ? "border-rose-600 text-rose-700 dark:text-rose-300"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Info className="size-3.5" aria-hidden="true" />
            <span>Tổng quan &amp; Ngữ cảnh</span>
          </button>

          <button
            id={diffTabId}
            type="button"
            role="tab"
            aria-selected={activeTab === "diff"}
            aria-controls={diffPanelId}
            onClick={() => setActiveTab("diff")}
            className={`inline-flex items-center gap-2 border-b-2 px-3 pb-2.5 text-xs font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/40 ${
              activeTab === "diff"
                ? "border-rose-600 text-rose-700 dark:text-rose-300"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <GitCompare className="size-3.5" aria-hidden="true" />
            <span>So sánh thay đổi (oldValue vs newValue)</span>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {activeTab === "overview" ? (
            <div
              id={overviewPanelId}
              role="tabpanel"
              aria-labelledby={overviewTabId}
              className="space-y-5"
            >
              {/* Metadata kỹ thuật */}
              <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-border bg-muted/20 p-3.5">
                  <dt className="text-[11px] font-medium text-muted-foreground">
                    ID bản ghi kiểm toán
                  </dt>
                  <dd className="mt-1 flex items-center justify-between gap-2 font-mono text-xs font-semibold text-foreground">
                    <span className="truncate">{log.id}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy("id", log.id)}
                      aria-label="Sao chép ID bản ghi"
                      className="inline-flex h-6 items-center gap-1 rounded border border-border bg-background px-2 text-[11px] font-sans font-medium text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/40"
                    >
                      {copiedField === "id" ? (
                        <>
                          <Check className="size-3 text-emerald-600" />
                          <span>Đã chép</span>
                        </>
                      ) : (
                        <>
                          <Copy className="size-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </dd>
                </div>

                <div className="rounded-xl border border-border bg-muted/20 p-3.5">
                  <dt className="text-[11px] font-medium text-muted-foreground">
                    Thời gian thực hiện
                  </dt>
                  <dd className="mt-1 text-xs font-semibold text-foreground tabular-nums">
                    {formatAuditDateTime(log.createdAt)}{" "}
                    <span className="font-normal text-muted-foreground">
                      ({formatRelativeAuditTime(log.createdAt)})
                    </span>
                  </dd>
                </div>

                <div className="rounded-xl border border-border bg-muted/20 p-3.5">
                  <dt className="text-[11px] font-medium text-muted-foreground">
                    Địa chỉ IP (clientIp)
                  </dt>
                  <dd className="mt-1 font-mono text-xs font-semibold text-foreground tabular-nums">
                    {clientIp}
                  </dd>
                </div>

                <div className="rounded-xl border border-border bg-muted/20 p-3.5">
                  <dt className="text-[11px] font-medium text-muted-foreground">
                    Mã truy vết (correlationId)
                  </dt>
                  <dd className="mt-1 flex items-center justify-between gap-2 font-mono text-xs font-semibold text-foreground">
                    <span className="truncate">{correlationId}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy("correlationId", correlationId)}
                      aria-label="Sao chép mã truy vết correlationId"
                      className="inline-flex h-6 shrink-0 items-center gap-1 rounded border border-border bg-background px-2 text-[11px] font-sans font-medium text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/40"
                    >
                      {copiedField === "correlationId" ? (
                        <>
                          <Check className="size-3 text-emerald-600" />
                          <span>Đã chép</span>
                        </>
                      ) : (
                        <>
                          <Copy className="size-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </dd>
                </div>

                <div className="rounded-xl border border-border bg-muted/20 p-3.5 sm:col-span-2">
                  <dt className="text-[11px] font-medium text-muted-foreground">
                    Đối tượng bị tác động
                  </dt>
                  <dd className="mt-1 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md border border-border bg-background px-2 py-0.5 font-semibold text-foreground">
                        {getEntityTypeLabel(log.entityType)} ({log.entityType})
                      </span>
                      <span className="font-mono text-muted-foreground">
                        ID: {log.entityId}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy("entityId", log.entityId)}
                      aria-label="Sao chép ID đối tượng"
                      className="inline-flex h-6 items-center gap-1 rounded border border-border bg-background px-2 text-[11px] font-medium text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/40"
                    >
                      {copiedField === "entityId" ? (
                        <>
                          <Check className="size-3 text-emerald-600" />
                          <span>Đã chép</span>
                        </>
                      ) : (
                        <>
                          <Copy className="size-3" />
                          <span>Copy ID</span>
                        </>
                      )}
                    </button>
                  </dd>
                </div>
              </dl>

              {/* Ngữ cảnh Người thực hiện & NCS liên quan */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Actor */}
                <div className="rounded-xl border border-border p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                    <User className="size-4 text-muted-foreground" aria-hidden="true" />
                    <span>Người thực hiện (Actor)</span>
                  </div>

                  {log.actor === null ? (
                    <div className="mt-3 space-y-2">
                      <div className="font-mono text-xs text-foreground">
                        actorId: {log.actorId || "Không xác định"}
                      </div>
                      <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50/70 p-2.5 text-xs text-amber-800 dark:border-amber-800/70 dark:bg-amber-950/40 dark:text-amber-200">
                        <ShieldAlert
                          className="mt-0.5 size-3.5 shrink-0"
                          aria-hidden="true"
                        />
                        <span>
                          Tài khoản người dùng này không còn tồn tại trên hệ
                          thống
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3 space-y-2 text-xs">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-foreground">
                          {log.actor.fullName}
                        </span>
                        <span
                          className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${
                            SYSTEM_ROLE_META[log.actor.role].badgeClass
                          }`}
                        >
                          {SYSTEM_ROLE_META[log.actor.role].label}
                        </span>
                      </div>
                      <div className="font-mono text-[11px] text-muted-foreground">
                        @{log.actor.username} • ID: {log.actor.id}
                      </div>
                    </div>
                  )}
                </div>

                {/* NCS */}
                <div className="rounded-xl border border-border p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                    <GraduationCap
                      className="size-4 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <span>Hồ sơ NCS liên quan</span>
                  </div>

                  {log.ncs && ncsName ? (
                    <div className="mt-3 space-y-1.5 text-xs">
                      <div className="font-semibold text-foreground">
                        {ncsName}
                      </div>
                      <div className="font-mono text-[11px] text-muted-foreground">
                        MSHV: {log.ncs.mshv}
                        {log.ncs.cohort ? ` • ${log.ncs.cohort}` : ""}
                      </div>
                    </div>
                  ) : (
                    <p className="mt-3 text-xs text-muted-foreground">
                      Thao tác cấp hệ thống hoặc theo lô, không gắn với một hồ
                      sơ NCS đơn lẻ.
                    </p>
                  )}
                </div>
              </div>

              {log.userAgent && (
                <div className="rounded-xl border border-border bg-muted/15 px-3.5 py-2.5 text-[11px] text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    Trình duyệt / Thiết bị:{" "}
                  </span>
                  <span className="font-mono">{log.userAgent}</span>
                </div>
              )}
            </div>
          ) : (
            <div
              id={diffPanelId}
              role="tabpanel"
              aria-labelledby={diffTabId}
            >
              <AuditDiffViewer
                oldValue={log.oldValue}
                newValue={log.newValue}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border bg-muted/20 px-6 py-3">
          <div className="text-[11px] text-muted-foreground">
            {activeTab === "overview"
              ? "Chuyển sang tab So sánh thay đổi để xem diff chi tiết oldValue vs newValue."
              : "Đỏ gạch ngang: giá trị cũ bị thay thế • Xanh đậm: giá trị mới được ghi nhận."}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 items-center rounded-lg border border-border bg-background px-4 text-xs font-medium text-foreground transition-colors duration-150 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/40"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuditDetailDialog;
