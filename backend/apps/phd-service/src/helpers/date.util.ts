// Các hàm tính ngày dùng chung. Tất cả tính theo UTC vì cột DB là kiểu @db.Date.

/**
 * Cộng số tháng vào một ngày (soThang âm = lùi).
 * Ví dụ: 31/01 cộng 1 tháng sẽ thành ngày cuối tháng 2.
 */
export function congThang(ngay: Date, soThang: number): Date {
  const nam = ngay.getUTCFullYear();
  const thang = ngay.getUTCMonth() + soThang;
  const ngayTrongThang = ngay.getUTCDate();

  const ngayCuoiThangDich = new Date(Date.UTC(nam, thang + 1, 0)).getUTCDate();
  const ngayKetQua = Math.min(ngayTrongThang, ngayCuoiThangDich);

  return new Date(Date.UTC(nam, thang, ngayKetQua));
}

/** Cộng số ngày (lịch) vào một ngày. */
export function congNgay(ngay: Date, soNgay: number): Date {
  return new Date(Date.UTC(ngay.getUTCFullYear(), ngay.getUTCMonth(), ngay.getUTCDate() + soNgay));
}

/**
 * Cộng số ngày làm việc (bỏ thứ 7, chủ nhật; chưa tính ngày lễ cho đơn giản).
 */
export function congNgayLamViec(ngay: Date, soNgay: number): Date {
  let ketQua = new Date(Date.UTC(ngay.getUTCFullYear(), ngay.getUTCMonth(), ngay.getUTCDate()));
  let daCong = 0;
  while (daCong < soNgay) {
    ketQua = congNgay(ketQua, 1);
    const thu = ketQua.getUTCDay(); // 0 = chủ nhật, 6 = thứ 7
    if (thu !== 0 && thu !== 6) {
      daCong++;
    }
  }
  return ketQua;
}

/** Bỏ phần giờ, chỉ giữ ngày (UTC) để so sánh hạn với "hôm nay". */
export function layNgay(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

/** Số ngày từ a đến b (b sau a thì dương). */
export function soNgayGiua(a: Date, b: Date): number {
  return Math.round((layNgay(b).getTime() - layNgay(a).getTime()) / 86400000);
}

/**
 * Ngày cuối của kỳ báo cáo định kỳ gần nhất từ hôm nay trở đi.
 * thangs là các tháng (1-12) có kỳ báo cáo, vd [6, 12] -> 30/06 và 31/12 hằng năm.
 * Hôm nay đúng ngày cuối kỳ thì kỳ đó vẫn còn tính.
 */
export function kyBaoCaoTiepTheo(homNay: Date, thangs: number[]): Date {
  const ngayHomNay = layNgay(homNay);
  const sapXep = [...thangs].sort((a, b) => a - b);
  for (let nam = ngayHomNay.getUTCFullYear(); ; nam++) {
    for (const thang of sapXep) {
      const cuoiThang = new Date(Date.UTC(nam, thang, 0)); // ngày 0 của tháng sau = ngày cuối tháng này
      if (cuoiThang >= ngayHomNay) {
        return cuoiThang;
      }
    }
  }
}