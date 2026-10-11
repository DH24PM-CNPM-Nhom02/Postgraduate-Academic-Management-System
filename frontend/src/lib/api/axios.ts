import axios from "axios";
import { getSession } from "next-auth/react";

export const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Trước mỗi request, tự gắn token vào header
apiClient.interceptors.request.use(async (config) => {
    const session = await getSession();
    if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
    }
    return config;
});

// Nếu backend trả 401 (token hỏng dù đã refresh), tự đăng xuất
apiClient.interceptors.response.use(
    (res) => res,
    async (error) => {
        if (error.response?.status === 401) {
            const { signOut } = await import("next-auth/react");
            await signOut({ callbackUrl: "/login" });
        }
        return Promise.reject(error);
    }
);