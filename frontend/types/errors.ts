import { AuthError, CredentialsSignin } from "next-auth";

/**
 * Custom Auth Errors
 *
 * Kế thừa CredentialsSignin của next-auth v5 để trả error code cụ thể
 * thay vì message chung chung. Client nhận được qua result.code khi
 * gọi signIn({ redirect: false }).
 */

export class CustomAuthError extends AuthError {
    static type: string;

    constructor(message?: any) {
        super();
        this.type = message;
    }
}

/** 401 - Sai username/password */
export class UnauthorizedError extends CredentialsSignin {
    code = "UNAUTHORIZED";
}

/** 403 - Tài khoản chưa kích hoạt */
export class InActiveAccountError extends CredentialsSignin {
    code: string;

    constructor() {
        super();
        this.code = "INACTIVE_ACCOUNT";
    }
}

/** 400 - Thiếu hoặc sai tham số */
export class InvalidParameters extends CredentialsSignin {
    code = "BAD_REQUEST";
}

/** 409 - Xung đột tài khoản (trùng username/email) */
export class ConflictAccountError extends CredentialsSignin {
    code = "ACCOUNT_CONFLICT";
}

/** Generic API error với status code */
export class ApiError extends Error {
    constructor(message: string, public status?: number) {
        super(message);
        this.name = "ApiError";
    }
}
