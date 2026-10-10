import type { DefaultSession, DefaultUser } from "next-auth";
import type { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Mở rộng kiểu User trả về từ authorize().
   */
  interface User extends DefaultUser {
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
    role: string;
  }

  /**
   * Mở rộng kiểu Session để client (useSession) thấy được các trường tuỳ chỉnh.
   */
  interface Session extends DefaultSession {
    accessToken: string;
    error?: string;
    user: DefaultSession["user"] & {
      role: string;
    };
  }
}

declare module "next-auth/jwt" {
  /**
   * Mở rộng kiểu JWT token.
   */
  interface JWT extends DefaultJWT {
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
    role: string;
    error?: string;
  }
}
