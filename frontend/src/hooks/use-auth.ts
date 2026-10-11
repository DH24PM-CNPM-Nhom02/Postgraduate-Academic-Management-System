"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

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
                    return false;
                }

                router.push("/dashboard");
                return true;
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