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
        async (email: string, password: string) => {
            setIsSubmitting(true);
            setError(null);
            try {
                const result = await signIn("credentials", {
                    email,
                    password,
                    redirect: false, // tự điều hướng thay vì để NextAuth redirect
                });

                if (result?.error) {
                    setError("Sai email hoặc mật khẩu");
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