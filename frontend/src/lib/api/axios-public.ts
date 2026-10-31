import axios from "axios";

/**
 * Public API Client (Không gắn Access Token)
 *
 * Dùng cho các API công khai: login, refresh token, public metadata...
 * Không có interceptor Authorization vì lúc gọi những API này, user chưa có hoặc không cần token.
 *
 * Xử lý linh hoạt base URL:
 * - Môi trường SSR / Docker container: dùng API_INTERNAL_URL (VD: http://api-gateway:8080/api/v1)
 * - Môi trường Browser Client: dùng NEXT_PUBLIC_API_URL (VD: http://localhost:8080/api/v1)
 */
const getBaseURL = (): string => {
    if (typeof window === "undefined") {
        return process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
    }
    return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
};

export const publicApiClient = axios.create({
    baseURL: getBaseURL(),
    headers: {
        "Content-Type": "application/json",
    },
});