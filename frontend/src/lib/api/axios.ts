import axios from "axios";
import { getSession } from "next-auth/react";

/**
 * Authenticated API Client (Tự động gắn Bearer Token)
 *
 * Dùng cho các API yêu cầu xác thực: danh sách NCS, hạn ngạch GVHD, minh chứng...
 * - Request Interceptor: Tự động lấy access token từ NextAuth session gắn vào Authorization header.
 * - Response Interceptor: Tự động xử lý khi nhận mã lỗi 401 (đăng xuất và chuyển hướng về /login).
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

export const apiClient = axios.create({
    baseURL: getBaseURL(),
    headers: {
        "Content-Type": "application/json",
    },
});

// Trước mỗi request, tự gắn token vào header
apiClient.interceptors.request.use(async (config) => {
    if (typeof window !== "undefined") {
        const session = await getSession();
        if (session?.access_token) {
            config.headers.Authorization = `Bearer ${session.access_token}`;
        }
    }
    return config;
});

// Nếu backend trả 401 (token hỏng dù đã refresh), tự đăng xuất
apiClient.interceptors.response.use(
    (res) => res,
    async (error) => {
        if (error.response?.status === 401 && typeof window !== "undefined") {
            const { signOut } = await import("next-auth/react");
            await signOut({ callbackUrl: "/login" });
        }
        return Promise.reject(error);
    }
);