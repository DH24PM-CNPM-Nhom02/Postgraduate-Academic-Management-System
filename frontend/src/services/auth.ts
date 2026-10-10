import { publicApiClient } from "@/src/lib/axios-public";

export interface LoginPayload {
  email: string;
  password: string;
}

// user phải có dạng: { id, email, role, accessToken, refreshToken, accessTokenExpires }
export interface AuthResult {
  id: string;
  email: string;
  role: string;
  accessToken: string;
  refreshToken: string;
  accessTokenExpires: number;
}

export interface RefreshResult {
  accessToken: string;
  accessTokenExpires: number;
}

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResult | null> {
    try {
      const { data } = await publicApiClient.post<AuthResult>("/auth/login", payload);
      return data;
    } catch {
      // sai email/password, tài khoản bị khóa, lỗi mạng... đều trả null
      // NextAuth hiểu null = đăng nhập thất bại
      return null;
    }
  },

  async refresh(refreshToken: string): Promise<RefreshResult> {
    // không bắt try/catch ở đây -> để lỗi "ném" ra ngoài,
    // vì auth.ts cần biết refresh thất bại để set token.error
    const { data } = await publicApiClient.post<RefreshResult>("/auth/refresh", {
      refreshToken,
    });
    return data;
  },
};