import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import {
    authService,
    type LoginApiResponse,
    type LoginResponseData,
    type RefreshApiResponse,
    type TokenPairResponse,
} from "@/src/services/auth";
import { withRefreshLock } from "@/src/lib/auth/refresh-lock";
import { getTokenExpire } from "@/src/lib/utils/jwt";
import { UserRole } from "@/src/lib/auth/constants";
import { IUser } from "@/types/next-auth";

/**
 * Bóc tách dữ liệu phản hồi đăng nhập an toàn:
 * Hỗ trợ cả 2 trường hợp:
 * 1. Backend trả về bọc trong envelope: { data: { user, access_token, refresh_token } }
 * 2. Backend trả về trực tiếp: { user, access_token, refresh_token }
 */
function unwrapLoginResponse(res: LoginApiResponse | null | undefined): LoginResponseData | null {
    if (!res || typeof res !== "object") return null;
    if ("data" in res && res.data && typeof res.data === "object" && "access_token" in res.data) {
        return res.data;
    }
    if ("access_token" in res && "user" in res) {
        return res as LoginResponseData;
    }
    return null;
}

/**
 * Bóc tách cặp tokens an toàn khi làm mới token:
 * Hỗ trợ cả 2 trường hợp:
 * 1. Backend trả về bọc: { data: { access_token, refresh_token } }
 * 2. Backend trả về trực tiếp: { access_token, refresh_token }
 */
function unwrapTokenPairResponse(res: RefreshApiResponse | null | undefined): TokenPairResponse | null {
    if (!res || typeof res !== "object") return null;
    if ("data" in res && res.data && typeof res.data === "object" && "access_token" in res.data) {
        return res.data;
    }
    if ("access_token" in res && "refresh_token" in res) {
        return res as TokenPairResponse;
    }
    return null;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    trustHost: true,
    // Bắt buộc sử dụng AUTH_SECRET hoặc NEXTAUTH_SECRET từ biến môi trường.
    // Loại bỏ secret hardcoded cố định trong source code để ngăn ngừa nguy cơ giả mạo JWT.
    secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
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
                // Lỗi (sai pass, chưa active...) sẽ throw Exception và được LoginForm bắt hiển thị
                const rawData = await authService.login(credentials as Record<string, string>);
                const data = unwrapLoginResponse(rawData);

                if (data && data.access_token && data.user) {
                    return {
                        id: data.user.id,
                        user: {
                            id: data.user.id,
                            username: data.user.username,
                            email: data.user.email,
                            fullName: data.user.fullName,
                            role: (data.user.roles?.[0] as UserRole) ?? "NCS",
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
            // Khi user đăng xuất, gọi backend để thu hồi (revoke) refresh token
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
            // Lần đầu đăng nhập: lưu thông tin token và user
            if (account && user) {
                token.access_token = user.access_token;
                token.refresh_token = user.refresh_token;
                token.user = user.user;

                try {
                    token.access_expire = getTokenExpire(user.access_token);
                } catch (err) {
                    console.error("Access token không có trường exp hợp lệ từ backend:", err);
                    token.error = "RefreshTokenError";
                    token.access_token = "";
                    token.access_expire = 0;
                    return token;
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
                        const rawRes = await authService.refreshToken(token.refresh_token as string);
                        const res = unwrapTokenPairResponse(rawRes);
                        if (!res || !res.access_token || !res.refresh_token) {
                            throw new Error("Không thể bóc tách access_token và refresh_token từ API refresh");
                        }
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
                } catch (err) {
                    console.error("Access token mới sau refresh không có exp hợp lệ:", err);
                    throw new Error("Access token nhận được sau khi refresh không có exp hợp lệ");
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
            // Chỉ cung cấp access_token ra session; tuyệt đối KHÔNG đưa refresh_token ra browser
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