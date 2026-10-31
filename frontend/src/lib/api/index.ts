/**
 * lib/api — Barrel Export cho API Clients
 *
 * Cung cấp 2 client chuẩn hóa:
 * - publicApiClient: Dùng cho các API công khai (login, refresh token, public metadata...)
 * - apiClient: Dùng cho các API cần xác thực (tự động gắn Bearer Token và xử lý 401 signOut)
 */

export { publicApiClient } from "./axios-public";
export { apiClient } from "./axios";
