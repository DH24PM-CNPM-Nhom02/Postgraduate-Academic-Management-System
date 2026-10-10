import axios from "axios";

// Dùng cho các API KHÔNG cần token: login, refresh...
// Không gắn interceptor Authorization vì lúc gọi, user chưa có token.
export const publicApiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: { "Content-Type": "application/json" },
});