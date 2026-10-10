import { publicApiClient } from "@/src/lib/api/axios-public";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResult {
  id: string;
  email: string;
  role: string;
  accessToken: string;
  refreshToken: string;
  accessTokenExpires: number;
}

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResult | null> {
    try {
      const { data } = await publicApiClient.post<AuthResult>("/auth/login", payload);
      return data;
    } catch {
      // sai mật khẩu, tài khoản bị khóa, lỗi mạng... đều trả null
      // NextAuth sẽ hiểu null = đăng nhập thất bại
      return null;
    }
  },

  async refresh(refreshToken: string): Promise<{ accessToken: string; accessTokenExpires: number }> {
    const { data } = await publicApiClient.post("/auth/refresh", { refreshToken });
    return data;
  },
};