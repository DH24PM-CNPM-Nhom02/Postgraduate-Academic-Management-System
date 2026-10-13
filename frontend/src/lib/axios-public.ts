import axios from "axios";

// Dùng cho các API KHÔNG cần token: login, refresh...
// Không gắn interceptor Authorization vì lúc gọi, user chưa có token.

const baseURL =
  typeof window === "undefined"
    ? process.env.API_INTERNAL_URL
    : process.env.NEXT_PUBLIC_API_URL;

export const publicApiClient = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});
