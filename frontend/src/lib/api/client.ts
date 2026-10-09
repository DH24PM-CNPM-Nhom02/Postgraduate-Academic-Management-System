/**
 * lib/api — API fetch wrappers & TanStack Query hooks
 *
 * Cấu hình:
 * - Base URL từ env NEXT_PUBLIC_API_URL
 * - Auto-attach JWT từ cookie
 * - 401 interceptor → trigger refresh → retry
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

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
