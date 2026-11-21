import type { ChangeRequestApiItem } from "@/src/types/api/change-request";
import type { GraduationCheckApiResponse } from "@/src/types/api/graduation";
import type { BackendNcsMeResponse, MyProgressResponse } from "@/src/types/api/progress";
import type {
  GraduationConditionCode,
  GraduationConditionItem,
  StudentGraduationOverview,
} from "@/src/types/ui/graduation";

interface ProfileWithGraduationCheck extends BackendNcsMeResponse {
  xetTotNghiep?: {
    datNgoaiNgu?: boolean;
    chuanDauRaNgoaiNgu?: string | null;
    khongConCongNo?: boolean;
  } | null;
}

/**
 * Tổng hợp thông tin 6 điều kiện xét tốt nghiệp cá nhân cho NCS
 */
export function buildStudentGraduationOverview(
  profile?: BackendNcsMeResponse | null,
  progress?: MyProgressResponse | null,
  changeRequests?: ChangeRequestApiItem[] | null,
  apiAssessment?: GraduationCheckApiResponse | null
): StudentGraduationOverview {
  const ncsId = profile?.id || progress?.ncs?.id || "ncs-unknown";
  const hoTenNcs = profile?.hoTen || progress?.ncs?.hoTen || "Nghiên cứu sinh";
  const mshv = profile?.mshv || progress?.ncs?.mshv || "NCS";
  const chuyenNganh =
    profile?.nganh?.tenNganh ||
    profile?.khoaHocNcs?.tenKhoaHoc ||
    "Tiến sĩ chuyên ngành";
  const khoaHoc = profile?.khoaHocNcs?.maKhoaHoc || "Khóa NCS";

  // Nếu API backend trả về kết quả kiểm tra chính thức:
  if (apiAssessment) {
    const dieuKienList: GraduationConditionItem[] = apiAssessment.dieuKien.map(
      (dk, idx) => ({
        maDieuKien: dk.ma as GraduationConditionCode,
        thuTu: idx + 1,
        tenHienThi: dk.ten,
        moTaYeuCau: dk.ghiChu,
        dat: dk.dat,
        giaTriThucTe: dk.dat ? "Đạt yêu cầu" : "Chưa đạt",
        mucDo: dk.dat ? undefined : "warning",
        ghiChu: dk.ghiChu,
      })
    );

    const daDatCount = dieuKienList.filter((k) => k.dat).length;
    return {
      ncsId: apiAssessment.ncsId || ncsId,
      hoTenNcs: apiAssessment.hoTen || hoTenNcs,
      mshv: apiAssessment.mshv || mshv,
      chuyenNganh,
      khoaHoc,
      duDieuKien: apiAssessment.duDieuKien,
      daDatCount,
      tongDieuKien: dieuKienList.length,
      ngayKiemTraGanNhat: new Date().toISOString(),
      ghiChuHoiDong: apiAssessment.duDieuKien
        ? "NCS đã đáp ứng toàn bộ các điều kiện cần thiết theo quy chế đào tạo tiến sĩ."
        : "NCS cần hoàn thiện các điều kiện còn thiếu để được công nhận tốt nghiệp.",
      dieuKienList,
    };
  }

  // Fallback tính toán tự động dựa trên hồ sơ và tiến trình thật:
  const tienTrinhs = progress?.tienTrinhs || [];
  const tongMoc = tienTrinhs.length || 9;
  const soMocPassed = tienTrinhs.filter((tt) => tt.trangThai === "PASSED").length;
  const daXongMoc = tongMoc > 0 && soMocPassed === tongMoc;

  const trangThai = profile?.trangThai || "DANG_HOC";
  const hopLeTrangThai = ["DANG_HOC", "GIA_HAN"].includes(trangThai);

  const hanBuocThoiHoc = profile?.hanBuocThoiHoc;
  const conHanDaoTao = hanBuocThoiHoc
    ? new Date(hanBuocThoiHoc).getTime() >= Date.now()
    : true;

  const xet = (profile as ProfileWithGraduationCheck | null | undefined)?.xetTotNghiep;
  const datNgoaiNgu = Boolean(xet?.datNgoaiNgu);
  const khongConCongNo = Boolean(xet?.khongConCongNo);

  const pendingRequests = (changeRequests || []).filter((cr) =>
    ["CHO_DUYET", "CHO_GVHD_XAC_NHAN"].includes(cr.trangThai)
  );
  const soDeNghiCho = pendingRequests.length;
  const khongCoDonCho = soDeNghiCho === 0;

  const dieuKienList: GraduationConditionItem[] = [
    {
      maDieuKien: "HOAN_THANH_MOC",
      thuTu: 1,
      tenHienThi: "Hoàn thành tất cả các mốc đào tạo",
      moTaYeuCau:
        "Hoàn thành đầy đủ 9/9 mốc tiến trình theo Quy chế Đào tạo Tiến sĩ BR-08.",
      dat: daXongMoc,
      giaTriThucTe: `${soMocPassed}/${tongMoc} mốc`,
      mucDo: daXongMoc ? undefined : "warning",
      ghiChu: daXongMoc
        ? "Đã hoàn thành toàn bộ các mốc tiến trình"
        : `Còn ${tongMoc - soMocPassed} mốc chưa hoàn thành`,
      actionHref: "/student/progress",
      actionLabel: "Xem tiến độ",
    },
    {
      maDieuKien: "TRANG_THAI_HOC_TAP",
      thuTu: 2,
      tenHienThi: "Tình trạng học tập hợp lệ",
      moTaYeuCau:
        "Nghiên cứu sinh ở trạng thái Đang học hoặc Gia hạn, không bị bảo lưu, ngừng học hoặc buộc thôi học.",
      dat: hopLeTrangThai,
      giaTriThucTe: hopLeTrangThai ? "Đang học tập" : `Trạng thái: ${trangThai}`,
      mucDo: hopLeTrangThai ? undefined : "error",
      ghiChu: hopLeTrangThai
        ? "Hồ sơ đào tạo hợp lệ"
        : "Trạng thái học tập không đủ điều kiện xét tốt nghiệp",
    },
    {
      maDieuKien: "THOI_HAN",
      thuTu: 3,
      tenHienThi: "Thời gian đào tạo trong hạn định mức",
      moTaYeuCau:
        "Chưa quá thời gian đào tạo tối đa 72 tháng tính từ ngày có quyết định công nhận NCS.",
      dat: conHanDaoTao,
      giaTriThucTe: conHanDaoTao ? "Trong thời hạn tối đa" : "Đã quá hạn đào tạo",
      mucDo: conHanDaoTao ? undefined : "error",
      ghiChu: conHanDaoTao
        ? "Thời gian học tập còn trong khung 72 tháng"
        : "Đã vượt quá khung đào tạo tối đa theo quy định",
      actionHref: "/student/extensions",
      actionLabel: "Lập đơn gia hạn",
    },
    {
      maDieuKien: "NGOAI_NGU",
      thuTu: 4,
      tenHienThi: "Chuẩn đầu ra ngoại ngữ",
      moTaYeuCau:
        "Đạt chứng chỉ ngoại ngữ theo quy chế (TOEIC 750, Vstep B2 trở lên hoặc văn bằng tương đương).",
      dat: datNgoaiNgu,
      giaTriThucTe: xet?.chuanDauRaNgoaiNgu || (datNgoaiNgu ? "Đạt chuẩn" : "Chờ xác nhận"),
      mucDo: datNgoaiNgu ? undefined : "warning",
      ghiChu: datNgoaiNgu
        ? `Đã xác nhận: ${xet?.chuanDauRaNgoaiNgu || "Hợp lệ"}`
        : "Giáo vụ chưa xác nhận chuẩn ngoại ngữ",
    },
    {
      maDieuKien: "CONG_NO",
      thuTu: 5,
      tenHienThi: "Nghĩa vụ tài chính & Học phí",
      moTaYeuCau:
        "Hoàn thành đầy đủ nghĩa vụ học phí và các khoản lệ phí đào tạo, không còn công nợ với nhà trường.",
      dat: khongConCongNo,
      giaTriThucTe: khongConCongNo ? "Đã hoàn thành" : "Chờ xác nhận",
      mucDo: khongConCongNo ? undefined : "warning",
      ghiChu: khongConCongNo
        ? "Không còn công nợ tài chính"
        : "Giáo vụ / Phòng Kế hoạch - Tài chính chưa xác nhận công nợ",
    },
    {
      maDieuKien: "DE_NGHI_CHO_DUYET",
      thuTu: 6,
      tenHienThi: "Tình trạng hồ sơ đề nghị điều chỉnh",
      moTaYeuCau:
        "Không còn đơn đề nghị đổi đề tài, đổi GVHD hoặc gia hạn học tập đang trong trạng thái chờ duyệt.",
      dat: khongCoDonCho,
      giaTriThucTe: khongCoDonCho ? "0 đơn chờ" : `${soDeNghiCho} đơn đang chờ duyệt`,
      mucDo: khongCoDonCho ? undefined : "warning",
      ghiChu: khongCoDonCho
        ? "Không có đơn đề nghị nào đang chờ xử lý"
        : `Đang có ${soDeNghiCho} đơn đề nghị cần hoàn tất xử lý trước`,
      actionHref: "/student/extensions",
      actionLabel: "Xem đơn đề nghị",
    },
  ];

  const daDatCount = dieuKienList.filter((k) => k.dat).length;
  const duDieuKien = daDatCount === dieuKienList.length;

  return {
    ncsId,
    hoTenNcs,
    mshv,
    chuyenNganh,
    khoaHoc,
    duDieuKien,
    daDatCount,
    tongDieuKien: dieuKienList.length,
    ngayKiemTraGanNhat: new Date().toISOString(),
    ghiChuHoiDong: duDieuKien
      ? "NCS đã đáp ứng toàn bộ các điều kiện cần thiết theo quy chế đào tạo tiến sĩ."
      : "NCS cần hoàn thiện các điều kiện còn thiếu để được công nhận tốt nghiệp.",
    dieuKienList,
  };
}
