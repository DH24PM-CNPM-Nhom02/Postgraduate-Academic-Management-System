/**
 * Refresh Token Lock
 *
 * Đảm bảo chỉ có 1 request refresh token tại một thời điểm cho mỗi user.
 * Nếu nhiều request đồng thời cần refresh, chỉ request đầu tiên thực sự gọi API,
 * các request còn lại sẽ chờ và dùng chung kết quả.
 */

type RefreshResult = {
    access_token: string;
    refresh_token: string;
};

const refreshLocks = new Map<string, Promise<RefreshResult>>();

export async function withRefreshLock(
    key: string,
    refreshFn: () => Promise<RefreshResult>,
): Promise<RefreshResult> {
    const existingRefresh = refreshLocks.get(key);

    // Đã có request khác đang refresh → chờ kết quả
    if (existingRefresh) {
        return existingRefresh;
    }

    // Tạo refresh request mới
    const refreshPromise = refreshFn();

    refreshLocks.set(key, refreshPromise);

    try {
        return await refreshPromise;
    } finally {
        refreshLocks.delete(key);
    }
}
