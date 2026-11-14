import type { BackendDeTaiDto, BackendThesisNcsMeResponse } from "@/src/types/api/thesis";
import type { BackendNcsMeResponse } from "@/src/types/api/progress";
import type {
  StudentThesisOverview,
  ThesisItem,
  ThesisStatus,
} from "@/src/types/ui/thesis";

/**
 * Chuyển đổi một bản ghi đề tài từ Backend DTO sang giao diện ThesisItem
 */
function mapDeTaiDtoToItem(
  dto: BackendDeTaiDto,
  ncsProfile?: BackendNcsMeResponse
): ThesisItem {
  const soQd = dto.quyetDinh?.soQuyetDinh || "Chưa có số QĐ";
  const ngayKy = dto.quyetDinh?.ngayQuyetDinh || dto.createdAt;

  return {
    id: dto.id,
    maDeTai: `DT-${dto.id.slice(0, 8).toUpperCase()}`,
    tenDeTaiTiengViet: dto.tenDeTai,
    chuyenNganh: ncsProfile?.nganh?.tenNganh || "Khoa học máy tính",
    maNganh: ncsProfile?.nganh?.maNganh || undefined,
    trangThai: (dto.trangThai as ThesisStatus) || "HIEU_LUC",
    ngayBatDau: ngayKy,
    ngayKetThuc: dto.ngayKetThuc || undefined,
    quyetDinh: {
      soQuyetDinh: soQd,
      ngayKy,
      coQuanBanHanh: "Trường Đại học An Giang - ĐHQG-HCM",
      fileName: `QuyetDinh_${soQd.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`,
      fileUrl: dto.quyetDinhId ? `/api/v1/documents/${dto.quyetDinhId}/download` : "#",
    },
  };
}

/**
 * Tính toán thời hạn đào tạo tối đa 72 tháng (6 năm) dựa trên ngày nhập học hoặc hạn buộc thôi học
 */
function resolveTrainingDeadline(
  ncsProfile?: BackendNcsMeResponse
): string {
  if (ncsProfile?.hanBuocThoiHoc) {
    return ncsProfile.hanBuocThoiHoc;
  }
  if (ncsProfile?.ngayNhapHoc) {
    const d = new Date(ncsProfile.ngayNhapHoc);
    d.setFullYear(d.getFullYear() + 6);
    return d.toISOString();
  }
  return "2030-01-15T08:00:00Z";
}

/**
 * Adapter chuyển đổi dữ liệu từ API `/thesis/ncs/me` và `/ncs/me`
 * thành cấu trúc `StudentThesisOverview` hiển thị trên giao diện Tab Đề tài
 */
export function mapMyThesisToUi(
  apiData: BackendThesisNcsMeResponse,
  ncsProfile?: BackendNcsMeResponse
): StudentThesisOverview {
  const deTaiHienTaiDto =
    apiData.deTaiHienTai ||
    apiData.deTais.find((item) => item.trangThai === "HIEU_LUC") ||
    null;

  const deTaiHienTai = deTaiHienTaiDto
    ? mapDeTaiDtoToItem(deTaiHienTaiDto, ncsProfile)
    : null;

  // Lọc danh sách lịch sử: Các đề tài khác đề tài hiện tại (đã thay thế hoặc đã hủy)
  const lichSuDeTai = apiData.deTais
    .filter((dt) => dt.id !== deTaiHienTaiDto?.id)
    .map((dt) => mapDeTaiDtoToItem(dt, ncsProfile));

  return {
    ncsId: apiData.id,
    hoTenNcs: ncsProfile?.hoTen || apiData.hoTen,
    mshv: ncsProfile?.mshv || apiData.mshv,
    khoaHoc: ncsProfile?.khoaHoc || apiData.khoaHoc || "Khóa 32",
    ngayNhapHoc: ncsProfile?.ngayNhapHoc || "2024-01-15T08:00:00Z",
    hanDaoTao72Thang: resolveTrainingDeadline(ncsProfile),
    deTaiHienTai,
    lichSuDeTai,
  };
}
