/**
 * lib/api/client.ts — Experimental Native Fetch Wrapper (Chưa sử dụng)
 *
 * GHI CHÚ KIẾN TRÚC:
 * - Dự án hiện tại chuẩn hóa toàn bộ HTTP clients qua Axios (publicApiClient và apiClient trong lib/api/).
 * - File này được giữ lại dưới dạng prototype cho trường hợp tương lai cần dùng native Fetch API
 *   trong Edge Runtime / Server Actions (nếu có nhu cầu).
 * - Hiện tại không export qua index.ts để tránh gây nhầm lẫn cho lập trình viên.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

/**
 * Fetch wrapper với auto-auth headers
 */
export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    credentials: "include", // Gửi HttpOnly cookie
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    // TODO: Handle 401 → refresh token → retry
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
