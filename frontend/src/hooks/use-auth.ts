"use client";

import { getSession, signIn, signOut, useSession } from "next-auth/react";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/src/services/auth";
import type { UserRole } from "@/src/lib/auth/constants";

/** Mapping vai trò → trang chủ tương ứng */
const ROLE_HOME: Record<UserRole, string> = {
    ADMIN: "/admin",
    GIAO_VU: "/academic",
    GVHD: "/supervisor",
    NCS: "/student/progress",
};

export function useAuth() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const login = useCallback(
        async (username: string, password: string) => {
            setIsSubmitting(true);
            setError(null);
            try {
                const result = await signIn("credentials", {
                    username,
                    password,
                    redirect: false, // tự điều hướng thay vì để NextAuth redirect
                });

                if (result?.error) {
                    let errorMessage = "Đăng nhập thất bại. Vui lòng thử lại.";
                    switch (result.code) {
                        case "UNAUTHORIZED":
                            errorMessage = "Tên đăng nhập hoặc mật khẩu không chính xác.";
                            break;
                        case "INACTIVE_ACCOUNT":
                            errorMessage = "Tài khoản của bạn chưa được kích hoạt hoặc đã bị khóa.";
                            break;
                        case "BAD_REQUEST":
                            errorMessage = "Thông tin đăng nhập không hợp lệ.";
                            break;
                        case "ACCOUNT_CONFLICT":
                            errorMessage = "Tài khoản đang bị xung đột trạng thái.";
                            break;
                        default:
                            if (result.error !== "CredentialsSignin") {
                                errorMessage = result.error;
                            }
                    }
                    setError(errorMessage);
                    return { success: false, mustChangePassword: false };
                }

                // signIn() đã kích hoạt tải session nền. useSession().update()
                // có thể trả undefined khi provider vẫn đang loading, vì vậy
                // đọc session đã được ký bằng cookie sau khi signIn hoàn tất.
                const signedInSession = await getSession();
                if (!signedInSession) {
                    setError("Không thể tải phiên đăng nhập. Vui lòng thử lại.");
                    return { success: false, mustChangePassword: false };
                }

                let mustChangePassword = signedInSession.user.mustChangePassword === true;
                try {
                    const profileResponse = await authService.getMe(signedInSession.access_token);
                    const profile = "data" in profileResponse ? profileResponse.data : profileResponse;
                    mustChangePassword = profile.mustChangePassword === true || mustChangePassword;
                } catch {
                    // Giữ cờ từ phản hồi login nếu /auth/me tạm thời không khả dụng.
                }

                if (mustChangePassword) {
                    return { success: true, mustChangePassword: true };
                }

                // Chuyển hướng đến dashboard tương ứng vai trò
                const userRole = signedInSession.user?.role as UserRole | undefined;
                const targetPath = userRole ? ROLE_HOME[userRole] : "/";
                router.push(targetPath);
                return { success: true, mustChangePassword: false };
            } catch {
                setError("Không thể kết nối để đăng nhập. Vui lòng thử lại.");
                return { success: false, mustChangePassword: false };
            } finally {
                setIsSubmitting(false);
            }
        },
        [router]
    );

    const logout = useCallback(async () => {
        await signOut({ callbackUrl: "/login" });
    }, []);

    return {
        user: session?.user,
        role: session?.user?.role,
        isAuthenticated: status === "authenticated",
        isLoading: status === "loading" || isSubmitting,
        error,
        login,
        logout,
    };
}
