import { publicApiClient } from "@/src/lib/api";
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

export interface AuthUserResponse {
  id: string;
  username: string;
  email?: string;
  fullName: string;
  roles?: string[];
  mustChangePassword?: boolean;
}

export interface TokenPairResponse {
  access_token: string;
  refresh_token: string;
}

export interface LoginResponseData extends TokenPairResponse {
  user: AuthUserResponse;
}

export type LoginApiResponse = LoginResponseData | { data: LoginResponseData };
export type RefreshApiResponse = TokenPairResponse | { data: TokenPairResponse };

export interface UserProfileResponse {
  id: string;
  username: string;
  fullName: string;
  email?: string;
  roles?: string[];
  permissions?: string[];
  mustChangePassword?: boolean;
}

export type GetMeApiResponse = UserProfileResponse | { data: UserProfileResponse };

export const authService = {
  /**
   * Đăng nhập bằng username + password.
   * Backend trả về: { user, access_token, refresh_token } hoặc bọc trong { data: ... }
   */
  login: async (credentials: Record<string, string>): Promise<LoginApiResponse> => {
    try {
      const res = await publicApiClient.post<LoginApiResponse>("/auth/login", {
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
   * Backend trả về: { user } hoặc bọc trong { data: ... }
   */
  getMe: async (accessToken: string): Promise<GetMeApiResponse> => {
    try {
      const res = await publicApiClient.get<GetMeApiResponse>("/auth/me", {
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
   * Backend trả về: { access_token, refresh_token } hoặc bọc trong { data: ... }
   */
  refreshToken: async (refreshToken: string): Promise<RefreshApiResponse> => {
    try {
      const res = await publicApiClient.post<RefreshApiResponse>("/auth/refresh", {
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