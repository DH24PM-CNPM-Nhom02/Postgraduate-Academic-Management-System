import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { authService } from "@/src/services/auth";
import { withRefreshLock } from "@/src/lib/auth/refresh-lock";
import { getTokenExpire } from "@/src/lib/utils/jwt";
import { UserRole } from "./lib/auth/constants";
import { IUser } from "@/types/next-auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
    session: { strategy: "jwt" },
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password) return null;

                // Gọi API backend để đăng nhập
                // Lỗi (VD: sai pass, chưa active) sẽ throw Exception và được bắt ở LoginForm
                const data = await authService.login(credentials as Record<string, string>);
                if (data && data.access_token) {
                    return {
                        id: data.user.id,
                        user: {
                            id: data.user.id,
                            username: data.user.username,
                            email: data.user.email,
                            fullName: data.user.fullName,
                            role: data.user.roles?.[0] as UserRole,
                        },
                        access_token: data.access_token,
                        refresh_token: data.refresh_token,
                    };
                }
                return null;
            },
        }),
    ],
    pages: {
        signIn: "/login",
    },
    events: {
        async signOut(message) {
            if ("token" in message && message.token?.refresh_token) {
                try {
                    await authService.logout(message.token.refresh_token as string);
                } catch (error) {
                    console.error("Lỗi khi revoke refresh token trên backend:", error);
                }
            }
        },
    },
    callbacks: {
        async jwt({ token, user, account }) {
            // Lần đầu đăng nhập: lưu thông tin token
            if (account && user) {
                token.access_token = user.access_token;
                token.refresh_token = user.refresh_token;
                token.user = user.user;
                
                try {
                    token.access_expire = getTokenExpire(user.access_token);
                } catch {
                    // Nếu decode lỗi (do token backend trả về không phải JWT chuẩn, fallback lấy từ db)
                    token.access_expire = Date.now() + 15 * 60 * 1000;
                }
                token.error = "";
                return token;
            }

            if (!token.access_token) return token;

            // Thêm 60 giây buffer time
            const now = Date.now();
            const bufferTime = 60 * 1000;
            
            // Nếu token chưa hết hạn
            if (now + bufferTime < (token.access_expire as number)) {
                return token;
            }

            // Nếu không có refresh token -> bắt buộc đăng nhập lại
            if (!token.refresh_token) {
                token.error = "RefreshTokenError";
                token.access_token = "";
                token.access_expire = 0;
                return token;
            }

            // Token hết hạn -> gọi refresh qua lock mechanism
            try {
                const userId = (token.user as IUser)?.id || "unknown";

                const data = await withRefreshLock(
                    userId,
                    async () => {
                        const res = await authService.refreshToken(token.refresh_token as string);
                        return {
                            access_token: res.access_token,
                            refresh_token: res.refresh_token,
                        };
                    }
                );

                token.access_token = data.access_token;
                token.refresh_token = data.refresh_token;
                try {
                    token.access_expire = getTokenExpire(data.access_token);
                } catch {
                    token.access_expire = Date.now() + 15 * 60 * 1000;
                }
                token.error = "";
            } catch (error) {
                console.error("Refresh token thất bại:", error);
                token.error = "RefreshTokenError";
                token.access_token = "";
                token.refresh_token = "";
                token.access_expire = 0;
            }

            return token;
        },
        async session({ session, token }) {
            if (token.error === "RefreshTokenError") {
                session.access_token = "";
                session.access_expire = 0;
                session.error = token.error;
                return session;
            }
            if (token && session.user) {
                session.user = token.user as unknown as typeof session.user;
            }
            session.access_token = token.access_token;
            session.access_expire = token.access_expire;
            session.error = token.error;
            return session;
        },
        authorized: async ({ auth }) => {
            return !!auth;
        },
    },
});