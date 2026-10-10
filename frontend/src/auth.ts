import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { authService } from "@/src/services/auth";

export const authOptions: NextAuthOptions = {
    session: { strategy: "jwt" }, // dùng JWT thay vì lưu session trong DB
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                // Gọi API backend để đăng nhập, thông qua authService
                const user = await authService.login({
                    email: credentials.email,
                    password: credentials.password,
                });

                return user; // null -> NextAuth tự báo lỗi
            },
        }),
    ],
    callbacks: {
        // callback này chạy mỗi khi tạo/đọc JWT — nơi để nhét accessToken vào
        async jwt({ token, user }) {
            if (user) {
                // lần đầu đăng nhập: user là kết quả từ authorize() ở trên
                return {
                    ...token,
                    accessToken: user.accessToken,
                    refreshToken: user.refreshToken,
                    accessTokenExpires: user.accessTokenExpires,
                    role: user.role,
                };
            }

            // những lần sau: kiểm tra token còn hạn không
            if (Date.now() < (token.accessTokenExpires as number)) {
                return token;
            }

            // hết hạn -> gọi API refresh thông qua authService
            try {
                const refreshed = await authService.refresh(token.refreshToken as string);
                return { ...token, ...refreshed, error: undefined };
            } catch {
                return { ...token, error: "RefreshAccessTokenError" };
            }
        },
        // callback này quyết định client (useSession) nhìn thấy gì
        async session({ session, token }) {
            session.accessToken = token.accessToken as string;
            session.user.role = token.role as string;
            session.error = token.error as string | undefined;
            return session;
        },
    },
};