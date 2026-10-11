/**
 * lib/utils — Utility functions
 *
 * formatDate, formatFileSize, etc.
 * Sử dụng date-fns với locale vi cho định dạng ngày giờ.
 */

import { decodeJwt } from "jose";

/**
 * Format ngày theo dd/MM/yyyy
 * Backend lưu UTC, frontend convert sang UTC+7.
 */
export function formatDate(date: Date | string): string {
  // TODO: Implement with date-fns + locale vi
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Format ngày giờ theo dd/MM/yyyy HH:mm
 */
export function formatDateTime(date: Date | string): string {
  const d = new Date(date);
  const dateStr = formatDate(d);
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${dateStr} ${hours}:${minutes}`;
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
