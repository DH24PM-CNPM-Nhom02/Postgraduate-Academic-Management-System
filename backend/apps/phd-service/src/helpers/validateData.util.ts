// "2026-02-31" khớp định dạng nhưng không phải ngày thật, nên phải kiểm tra thêm
export function isRealDate(s: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const d = new Date(s);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@<>(),;:\\[\]".]+(?:\.[^\s@<>(),;:\\[\]".]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

export function validatePhoneNumber(phone: string): boolean {
  const phoneRegex = /^(0[1-9]{2})[0-9]{7}$/;
  return phoneRegex.test(phone);
}

/**
 * Chuẩn hóa chữ để so sánh mã/tên:
 * - không phân biệt chữ hoa và chữ thường
 * - bỏ dấu tiếng Việt
 * - bỏ khoảng trắng ở đầu và cuối
 */
export function chuanHoaChuoi(chuoi: string): string {
  return chuoi
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .trim();
}