import { decodeJwt } from "jose";

/**
 * Decode JWT access token và trả về thời điểm hết hạn (milliseconds).
 * Dùng jose library — edge-compatible, không cần secret.
 *
 * @param accessToken - JWT access token string
 * @returns Unix timestamp in milliseconds khi token hết hạn
 * @throws Error nếu token không có trường `exp`
 */
export const getTokenExpire = (accessToken: string): number => {
    const payload = decodeJwt(accessToken);

    if (!payload.exp) {
        throw new Error("Access token không có trường exp");
    }

    return payload.exp * 1000; // convert seconds → milliseconds
};
