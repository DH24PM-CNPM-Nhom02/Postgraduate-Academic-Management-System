"use client";

import { useMemo, useState } from "react";
import { GitCompare, MinusCircle, PlusCircle } from "lucide-react";

export interface AuditDiffViewerProps {
  oldValue: Record<string, unknown> | null | undefined;
  newValue: Record<string, unknown> | null | undefined;
  className?: string;
}

type DiffEntryStatus = "unchanged" | "modified" | "added" | "removed";

interface DiffEntry {
  key: string;
  hasOld: boolean;
  hasNew: boolean;
  oldRaw: unknown;
  newRaw: unknown;
  status: DiffEntryStatus;
}

function isEmptyRecord(
  value: Record<string, unknown> | null | undefined
): boolean {
  return !value || Object.keys(value).length === 0;
}

function areValuesEqual(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true;
  if (typeof a !== typeof b || a === null || b === null) return false;
  if (typeof a === "object") {
    try {
      return JSON.stringify(a) === JSON.stringify(b);
    } catch {
      return false;
    }
  }
  return false;
}

function formatDiffValue(value: unknown): string {
  if (value === undefined) return "—";
  if (value === null) return "null";
  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "number") return String(value);
  if (typeof value === "string") return value === "" ? '""' : value;
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

export function AuditDiffViewer({
  oldValue,
  newValue,
  className = "",
}: AuditDiffViewerProps) {
  const [onlyChanged, setOnlyChanged] = useState(false);

  const oldEmpty = isEmptyRecord(oldValue);
  const newEmpty = isEmptyRecord(newValue);

  const entries = useMemo<DiffEntry[]>(() => {
    const safeOld = oldValue ?? {};
    const safeNew = newValue ?? {};

    const orderedKeys: string[] = [];
    const seen = new Set<string>();

    for (const key of Object.keys(safeOld)) {
      seen.add(key);
      orderedKeys.push(key);
    }
    for (const key of Object.keys(safeNew)) {
      if (!seen.has(key)) {
        seen.add(key);
        orderedKeys.push(key);
      }
    }

    return orderedKeys.map((key) => {
      const hasOld = Object.prototype.hasOwnProperty.call(safeOld, key);
      const hasNew = Object.prototype.hasOwnProperty.call(safeNew, key);
      const oldRaw = hasOld ? safeOld[key] : undefined;
      const newRaw = hasNew ? safeNew[key] : undefined;

      let status: DiffEntryStatus = "unchanged";
      if (!hasOld && hasNew) {
        status = "added";
      } else if (hasOld && !hasNew) {
        status = "removed";
      } else if (!areValuesEqual(oldRaw, newRaw)) {
        status = "modified";
      }

      return { key, hasOld, hasNew, oldRaw, newRaw, status };
    });
  }, [oldValue, newValue]);

  const changedEntries = useMemo(
    () => entries.filter((entry) => entry.status !== "unchanged"),
    [entries]
  );

  const visibleEntries = onlyChanged ? changedEntries : entries;

  if (oldEmpty && newEmpty) {
    return (
      <div
        className={`flex flex-col items-center justify-center rounded-xl border border-border bg-muted/20 px-6 py-10 text-center ${className}`}
      >
        <div className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <GitCompare className="size-5" aria-hidden="true" />
        </div>
        <p className="mt-3 text-sm font-semibold text-foreground">
          Không có dữ liệu trước đó / Không có dữ liệu thay đổi
        </p>
        <p className="mt-1 max-w-md text-xs text-muted-foreground">
          Bản ghi kiểm toán này không lưu trữ snapshot thay đổi giữa trạng thái cũ
          và mới.
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Toolbar thống kê diff */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-muted/25 px-3.5 py-2.5">
        <div className="flex flex-wrap items-center gap-3 text-xs tabular-nums">
          <span className="font-medium text-foreground">
            Tổng{" "}
            <strong className="font-bold">{entries.length}</strong> trường
          </span>
          <span className="text-border" aria-hidden="true">
            •
          </span>
          <span className="inline-flex items-center gap-1 font-medium text-rose-700 dark:text-rose-300">
            <MinusCircle className="size-3.5" aria-hidden="true" />
            <span>{changedEntries.length} trường thay đổi</span>
          </span>
        </div>

        <div className="inline-flex rounded-lg border border-border bg-background p-0.5 text-xs">
          <button
            type="button"
            onClick={() => setOnlyChanged(false)}
            aria-pressed={!onlyChanged}
            className={`rounded-md px-2.5 py-1 font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/40 ${
              !onlyChanged
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Hiện tất cả ({entries.length})
          </button>
          <button
            type="button"
            onClick={() => setOnlyChanged(true)}
            aria-pressed={onlyChanged}
            className={`rounded-md px-2.5 py-1 font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/40 ${
              onlyChanged
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Chỉ trường thay đổi ({changedEntries.length})
          </button>
        </div>
      </div>

      {/* Side-by-Side Header + Columns */}
      {visibleEntries.length === 0 ? (
        <div className="rounded-xl border border-border bg-muted/15 px-4 py-8 text-center text-xs text-muted-foreground">
          Không có trường dữ liệu nào bị thay đổi giữa trạng thái cũ và mới.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {/* Cột trái: Giá trị cũ */}
          <div className="overflow-hidden rounded-xl border border-rose-200/80 bg-card dark:border-rose-900/60">
            <div className="flex items-center justify-between border-b border-rose-200/70 bg-rose-50/70 px-3.5 py-2 dark:border-rose-900/60 dark:bg-rose-950/40">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-800 dark:text-rose-200">
                <MinusCircle className="size-3.5" aria-hidden="true" />
                <span>Giá trị cũ (oldValue)</span>
              </span>
              {oldEmpty && (
                <span className="rounded bg-rose-100 px-1.5 py-0.5 text-[10px] font-semibold text-rose-700 dark:bg-rose-900/70 dark:text-rose-200">
                  Trống
                </span>
              )}
            </div>

            {oldEmpty ? (
              <div className="px-4 py-8 text-center text-xs text-muted-foreground">
                Không có dữ liệu trước đó
              </div>
            ) : (
              <div className="divide-y divide-border">
                {visibleEntries.map((entry) => {
                  const isHighlighted =
                    entry.status === "modified" || entry.status === "removed";
                  return (
                    <div
                      key={`old-${entry.key}`}
                      className={`px-3.5 py-2.5 text-xs ${
                        isHighlighted
                          ? "bg-rose-50/60 dark:bg-rose-950/30"
                          : "bg-card"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-[11px] font-semibold text-muted-foreground">
                          {entry.key}
                        </span>
                        {entry.status === "removed" && (
                          <span className="rounded bg-rose-100 px-1.5 py-0.5 text-[10px] font-semibold text-rose-700 dark:bg-rose-900/70 dark:text-rose-200">
                            Đã xóa
                          </span>
                        )}
                        {entry.status === "modified" && (
                          <span className="rounded bg-rose-100 px-1.5 py-0.5 text-[10px] font-semibold text-rose-700 dark:bg-rose-900/70 dark:text-rose-200">
                            Giá trị trước
                          </span>
                        )}
                      </div>

                      <div
                        className={`mt-1 break-words font-mono text-xs tabular-nums ${
                          !entry.hasOld
                            ? "italic text-muted-foreground"
                            : isHighlighted
                            ? "text-rose-700 line-through dark:text-rose-300"
                            : "text-foreground/85"
                        }`}
                      >
                        {entry.hasOld
                          ? formatDiffValue(entry.oldRaw)
                          : "— (Chưa tồn tại)"}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Cột phải: Giá trị mới */}
          <div className="overflow-hidden rounded-xl border border-emerald-200/80 bg-card dark:border-emerald-900/60">
            <div className="flex items-center justify-between border-b border-emerald-200/70 bg-emerald-50/70 px-3.5 py-2 dark:border-emerald-900/60 dark:bg-emerald-950/40">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-200">
                <PlusCircle className="size-3.5" aria-hidden="true" />
                <span>Giá trị mới (newValue)</span>
              </span>
              {newEmpty && (
                <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-900/70 dark:text-emerald-200">
                  Trống
                </span>
              )}
            </div>

            {newEmpty ? (
              <div className="px-4 py-8 text-center text-xs text-muted-foreground">
                Không có dữ liệu thay đổi
              </div>
            ) : (
              <div className="divide-y divide-border">
                {visibleEntries.map((entry) => {
                  const isHighlighted =
                    entry.status === "modified" || entry.status === "added";
                  return (
                    <div
                      key={`new-${entry.key}`}
                      className={`px-3.5 py-2.5 text-xs ${
                        isHighlighted
                          ? "bg-emerald-50/60 dark:bg-emerald-950/30"
                          : "bg-card"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-[11px] font-semibold text-muted-foreground">
                          {entry.key}
                        </span>
                        {entry.status === "added" && (
                          <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-900/70 dark:text-emerald-200">
                            Mới thêm
                          </span>
                        )}
                        {entry.status === "modified" && (
                          <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-900/70 dark:text-emerald-200">
                            Đã cập nhật
                          </span>
                        )}
                      </div>

                      <div
                        className={`mt-1 break-words font-mono text-xs tabular-nums ${
                          !entry.hasNew
                            ? "italic text-muted-foreground"
                            : isHighlighted
                            ? "font-semibold text-emerald-800 dark:text-emerald-200"
                            : "text-foreground/85"
                        }`}
                      >
                        {entry.hasNew
                          ? formatDiffValue(entry.newRaw)
                          : "— (Đã loại bỏ)"}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AuditDiffViewer;
