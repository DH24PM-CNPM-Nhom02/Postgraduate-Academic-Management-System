/**
 * lib/utils — Utility functions
 *
 * formatDate, formatFileSize, etc.
 * Sử dụng date-fns với locale vi cho định dạng ngày giờ.
 */

import { decodeJwt } from "jose";

/**
 * Format ngày theo dd/MM/yyyy (chuẩn hóa theo múi giờ UTC+7 Việt Nam)
 * Backend lưu UTC ISO string, frontend convert hiển thị đúng giờ Việt Nam.
 */
export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "--/--/----";
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return typeof date === "string" ? date : "--/--/----";
  try {
    const formatter = new Intl.DateTimeFormat("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const parts = formatter.formatToParts(d);
    const getPart = (type: string) => parts.find((p) => p.type === type)?.value || "";
    return `${getPart("day")}/${getPart("month")}/${getPart("year")}`;
  } catch {
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }
}

/**
 * Format ngày giờ theo dd/MM/yyyy HH:mm (chuẩn hóa theo múi giờ UTC+7 Việt Nam)
 */
export function formatDateTime(date: Date | string | null | undefined): string {
  if (!date) return "--/--/----";
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return typeof date === "string" ? date : "--/--/----";
  try {
    const formatter = new Intl.DateTimeFormat("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    });
    const parts = formatter.formatToParts(d);
    const getPart = (type: string) => parts.find((p) => p.type === type)?.value || "";
    return `${getPart("day")}/${getPart("month")}/${getPart("year")} ${getPart("hour")}:${getPart("minute")}`;
  } catch {
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }
}

/**
 * Format kích thước file (bytes → KB/MB)
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Validate ISSN format: XXXX-XXXX
 */
export function isValidISSN(issn: string): boolean {
  return /^\d{4}-\d{3}[\dX]$/.test(issn);
}

/**
 * Decode JWT access token và trả về thời điểm hết hạn (milliseconds).
 * Dùng jose library (edge-compatible, không cần secret).
 */
export const getTokenExpire = (accessToken: string) => {
  const payload = decodeJwt(accessToken);

  if (!payload.exp) {
    throw new Error("Access token không có exp");
  }

  return payload.exp * 1000;
};
