import { publicApiClient } from "@/src/lib/axios-public";
import {
  InvalidParameters,
  UnauthorizedError,
  InActiveAccountError,
  ConflictAccountError,
} from "@/types/errors";


export interface LoginPayload {
  username: string;
  password: string;
}

export const authService = {
  /**
   * Đăng nhập bằng username + password.
   * Backend trả về: { data: { user, access_token, refresh_token } }
   */
  login: async (credentials: Record<string, string>) => {
    try {
      const res = await publicApiClient.post("/auth/login", {
        username: credentials.username,
        password: credentials.password,
      });

      return res.data;
    } catch (error) {
      const err = error as { response?: { data?: { statusCode?: number, message?: string }, status?: number }, message?: string };
      if (err.response) {
        const status = err.response.data?.statusCode ?? err.response.status;

        if (status === 400) {
          throw new InvalidParameters();
        }
        if (status === 401) {
          throw new UnauthorizedError();
        }
        if (status === 403) {
          throw new InActiveAccountError();
        }
        if (status === 409) {
          throw new ConflictAccountError();
        }
      }
      throw error;
    }
  },

  /**
   * Lấy thông tin user hiện tại từ access_token.
   * Backend trả về: { data: { id, fullName, username, email, role, ... } }
   */
  getMe: async (accessToken: string) => {
    try {
      const res = await publicApiClient.get("/auth/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return res.data;
    } catch (error) {
      const err = error as { response?: { data?: { statusCode?: number, message?: string }, status?: number }, message?: string };
      throw new Error(
        err?.response?.data?.message || "Lấy thông tin người dùng thất bại"
      );
    }
  },

  /**
   * Refresh access token bằng refresh token.
   * Backend trả về: { data: { access_token, refresh_token } }
   */
  refreshToken: async (refreshToken: string) => {
    try {
      const res = await publicApiClient.post("/auth/refresh", {
        refreshToken,
      });
      return res.data;
    } catch (error) {
      const err = error as { response?: { data?: { statusCode?: number, message?: string }, status?: number }, message?: string };
      throw new Error(
        err?.response?.data?.message || "Refresh token thất bại"
      );
    }
  },

  /**
   * Logout — revoke refresh token trên backend.
   * Không throw error nếu thất bại (best-effort).
   */
  logout: async (refreshToken?: string) => {
    try {
      const res = await publicApiClient.post("/auth/logout", {
        refreshToken,
      });
      return res.data;
    } catch (error) {
      const err = error as { response?: { data?: { statusCode?: number, message?: string }, status?: number }, message?: string };
      console.error(
        "Lỗi khi gọi logout API:",
        err?.response?.data || err.message
      );
      return null;
    }
  },
};