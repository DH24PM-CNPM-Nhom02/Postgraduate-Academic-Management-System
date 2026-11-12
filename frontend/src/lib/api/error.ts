import axios from "axios";

/**
 * Cấu trúc lỗi chuẩn hóa dùng chung cho toàn bộ tầng Services & Hooks.
 * Bao phủ các mã HTTP phổ biến từ API Gateway (400, 401, 403, 404, 409, 413, 500, 503, 504)
 * và hỗ trợ thông báo ValidationPipe dạng string hoặc string[].
 */
export interface NormalizedApiErrorInfo {
  status: number;
  code?: string;
  message: string;
  messages: string[];
  raw?: unknown;
}

export class ApiClientError extends Error {
  public readonly status: number;
  public readonly code?: string;
  public readonly messages: string[];
  public readonly raw?: unknown;

  constructor(info: NormalizedApiErrorInfo) {
    super(info.message);
    this.name = "ApiClientError";
    this.status = info.status;
    this.code = info.code;
    this.messages = info.messages;
    this.raw = info.raw;
  }
}

function getDefaultMessageByStatus(status: number): string {
  switch (status) {
    case 400:
      return "Dữ liệu gửi lên không hợp lệ. Vui lòng kiểm tra lại.";
    case 401:
      return "Phiên đăng nhập đã hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại.";
    case 403:
      return "Bạn không có quyền thực hiện thao tác này.";
    case 404:
      return "Không tìm thấy dữ liệu hoặc tài nguyên yêu cầu.";
    case 409:
      return "Dữ liệu bị xung đột hoặc đã được xử lý trước đó. Vui lòng tải lại trang.";
    case 413:
      return "Tệp tải lên vượt quá dung lượng cho phép (tối đa 15MB).";
    case 503:
      return "Hệ thống dịch vụ hiện không khả dụng. Vui lòng thử lại sau.";
    case 504:
      return "Máy chủ phản hồi quá chậm. Vui lòng thử lại sau.";
    case 500:
    default:
      return "Đã xảy ra lỗi hệ thống phía máy chủ. Vui lòng thử lại sau.";
  }
}

function extractMessagesFromBody(
  body: unknown,
  status: number
): { message: string; messages: string[]; code?: string } {
  if (!body || typeof body !== "object") {
    const fallback =
      typeof body === "string" && body.trim()
        ? body.trim()
        : getDefaultMessageByStatus(status);
    return { message: fallback, messages: [fallback] };
  }

  const record = body as Record<string, unknown>;
  const code = typeof record.code === "string" ? record.code : undefined;
  const rawMsg = record.message;

  // NestJS ValidationPipe trả message dạng mảng string[]
  if (Array.isArray(rawMsg)) {
    const validList = rawMsg
      .map((item) => (typeof item === "string" ? item.trim() : ""))
      .filter(Boolean);

    if (validList.length > 0) {
      return {
        message: validList.join("; "),
        messages: validList,
        code,
      };
    }
  }

  if (typeof rawMsg === "string" && rawMsg.trim()) {
    const cleanMsg = rawMsg.trim();
    return { message: cleanMsg, messages: [cleanMsg], code };
  }

  // Trường hợp RpcToHttpFilter ném 500 kèm object message lồng bên trong
  if (rawMsg && typeof rawMsg === "object") {
    const nested = (rawMsg as Record<string, unknown>).message;
    if (typeof nested === "string" && nested.trim()) {
      return { message: nested.trim(), messages: [nested.trim()], code };
    }
  }

  if (typeof record.error === "string" && record.error.trim() && status >= 500) {
    const fallback = getDefaultMessageByStatus(status);
    return { message: fallback, messages: [fallback], code };
  }

  const fallback = getDefaultMessageByStatus(status);
  return { message: fallback, messages: [fallback], code };
}

/**
 * Chuẩn hóa đồng bộ mọi lỗi từ Axios / JS Error sang ApiClientError dễ đọc.
 */
export function parseApiError(error: unknown): ApiClientError {
  if (error instanceof ApiClientError) {
    return error;
  }

  if (axios.isAxiosError(error)) {
    // Lỗi kết nối mạng (server chưa bật, rớt mạng, CORS...)
    if (!error.response) {
      const msg =
        error.code === "ECONNABORTED"
          ? "Kết nối quá thời gian chờ. Vui lòng kiểm tra mạng và thử lại."
          : "Không thể kết nối đến máy chủ API. Vui lòng kiểm tra lại kết nối.";
      return new ApiClientError({
        status: 0,
        code: error.code,
        message: msg,
        messages: [msg],
        raw: error,
      });
    }

    const status = error.response.status;
    const { message, messages, code } = extractMessagesFromBody(
      error.response.data,
      status
    );

    return new ApiClientError({
      status,
      code,
      message,
      messages,
      raw: error,
    });
  }

  if (error instanceof Error) {
    return new ApiClientError({
      status: 0,
      message: error.message || "Đã xảy ra lỗi không xác định.",
      messages: [error.message || "Đã xảy ra lỗi không xác định."],
      raw: error,
    });
  }

  const fallback = "Đã xảy ra lỗi không xác định.";
  return new ApiClientError({
    status: 0,
    message: fallback,
    messages: [fallback],
    raw: error,
  });
}

/**
 * Phiên bản async dùng khi request có responseType: "blob" (vd tải PDF).
 * Khi Backend trả lỗi 403/404, Axios gói JSON lỗi vào Blob nên cần đọc text để lấy message thật.
 */
export async function parseApiErrorAsync(error: unknown): Promise<ApiClientError> {
  if (
    axios.isAxiosError(error) &&
    error.response &&
    typeof Blob !== "undefined" &&
    error.response.data instanceof Blob
  ) {
    const status = error.response.status;
    try {
      const text = await error.response.data.text();
      const parsedJson = JSON.parse(text) as unknown;
      const { message, messages, code } = extractMessagesFromBody(
        parsedJson,
        status
      );
      return new ApiClientError({
        status,
        code,
        message,
        messages,
        raw: error,
      });
    } catch {
      // Nếu Blob không phải JSON thì dùng thông báo mặc định theo HTTP status
      const fallback = getDefaultMessageByStatus(status);
      return new ApiClientError({
        status,
        message: fallback,
        messages: [fallback],
        raw: error,
      });
    }
  }

  return parseApiError(error);
}

/**
 * Helper ném ApiClientError đã chuẩn hóa trong catch block của Service.
 */
export function throwApiError(error: unknown): never {
  throw parseApiError(error);
}
