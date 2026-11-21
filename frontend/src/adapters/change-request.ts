import type {
  ChangeRequestApiItem,
} from "@/src/types/api/change-request";
import type { BackendNcsMeResponse, MyProgressResponse } from "@/src/types/api/progress";
import type {
  CandidateSupervisorOption,
  ChangeRequestItem,
  StudentChangeRequestsOverview,
  SupervisorOpinionItem,
  TrainingTimeSummary,
} from "@/src/types/ui/change-request";
import type {
  SupervisorAssignmentItem,
  SupervisorRoleType,
} from "@/src/types/ui/thesis";
import { mockCandidateSupervisors } from "@/src/mocks/change-request";

/**
 * Chuyển đổi 1 đơn đề nghị từ Backend API sang UI ChangeRequestItem
 */
export function mapChangeRequestApiToUi(
  item: ChangeRequestApiItem
): ChangeRequestItem {
  const year = item.createdAt ? new Date(item.createdAt).getFullYear() : 2026;
  const seq = item.id ? item.id.slice(0, 4).toUpperCase() : "001";
  const maDon = `DN-${year}-${seq}`;

  const xacNhanGvhds: SupervisorOpinionItem[] = (item.xacNhanGvhds || []).map(
    (op) => ({
      id: op.id,
      giangVienId: op.gvhdId,
      tenGvhd: op.gvhd?.hoTen || "Giảng viên hướng dẫn",
      hocHamHocVi: op.gvhd?.hocHamHocVi || undefined,
      vaiTro: "HUONG_DAN_CHINH",
      dongY: op.dongY,
      nhanXet: op.nhanXet,
      thoiGianPhanHoi: op.ngayXacNhan,
    })
  );

  return {
    id: item.id,
    maDon,
    loaiDon: item.loai,
    trangThai: item.trangThai,
    ngayGui: item.createdAt,
    ngayCapNhat: item.updatedAt,
    lyDo: item.lyDo,
    batKhaKhang: item.batKhaKhang,
    lyDoTuChoi: item.lyDoTuChoi,
    nguoiXuLy: item.nguoiDuyetId || undefined,
    ngayXuLy: item.ngayDuyet || undefined,
    tenDeTaiCu: item.tenDeTaiCu || undefined,
    tenDeTaiMoi: item.tenDeTaiMoi || undefined,
    phanCongCuId: item.phanCongCuId || undefined,
    tenGvhdCu: item.phanCongCu?.gvhd?.hoTen,
    vaiTroGvhdCu: (item.phanCongCu?.vaiTro as SupervisorRoleType) || undefined,
    gvhdMoiId: item.gvhdMoiId || undefined,
    tenGvhdMoi: item.gvhdMoi?.hoTen,
    donViGvhdMoi: item.gvhdMoi?.donViCongTac || undefined,
    soThangGiaHan: item.soThangGiaHan || undefined,
    hanMoiDuKien: item.hanMoiDeNghi || undefined,
    xacNhanGvhds: xacNhanGvhds.length > 0 ? xacNhanGvhds : undefined,
    tepDinhKem: item.fileId
      ? {
          fileId: item.fileId,
          fileName: `Minh_chung_don_${maDon}.pdf`,
          fileUrl: `mock://minh-chung-don-tu/${item.fileId}`,
        }
      : null,
    quyetDinh: item.quyetDinh
      ? {
          fileId: item.quyetDinh.fileId || null,
          soQuyetDinh: item.quyetDinh.soQuyetDinh,
          ngayKy: item.quyetDinh.ngayQuyetDinh,
          coQuanBanHanh:
            item.quyetDinh.coQuanBanHanh || "Trường Đại học An Giang - ĐHQG-HCM",
          fileName: `Quyet_dinh_${item.quyetDinh.soQuyetDinh.replace(/\//g, "_")}.pdf`,
          fileUrl: `mock://quyet-dinh/${item.quyetDinh.soQuyetDinh}`,
        }
      : null,
  };
}

/**
 * Tổng hợp toàn bộ dữ liệu Đơn đề nghị & Gia hạn học tập từ API
 */
export function buildStudentChangeRequestsOverview(
  apiItems: ChangeRequestApiItem[],
  profile?: BackendNcsMeResponse | null,
  progress?: MyProgressResponse | null
): StudentChangeRequestsOverview {
  const ncsId = profile?.id || progress?.ncs?.id || "ncs-unknown";
  const hoTenNcs = profile?.hoTen || progress?.ncs?.hoTen || "Nghiên cứu sinh";
  const mshv = profile?.mshv || progress?.ncs?.mshv || "NCS";

  // Đề tài hiện tại
  const tenDeTaiHienTai =
    profile?.deTais?.find((d) => d.trangThai === "HIEU_LUC")?.tenDeTai ||
    profile?.deTais?.[0]?.tenDeTai ||
    "Chưa đăng ký đề tài";

  // GVHD hiện tại
  const danhSachGvhdHienTai: SupervisorAssignmentItem[] = (
    profile?.phanCongs || []
  ).map((pc) => ({
    id: pc.id,
    giangVienId: pc.gvhd?.id || pc.id,
    hoTen: pc.gvhd?.hoTen || "Chưa rõ",
    hocHamHocVi: pc.gvhd?.hocHamHocVi || "",
    email: pc.gvhd?.email,
    vaiTro: (pc.vaiTro as SupervisorRoleType) || "HUONG_DAN_CHINH",
    trongSo: 1.0,
    trangThai: "DANG_HUONG_DAN",
    donViCongTac: "Trường Đại học An Giang",
  }));

  // Kiểm tra hoàn thành Mốc 2 và Mốc 8
  const tienTrinhs = progress?.tienTrinhs || [];
  const moc2 = tienTrinhs.find((tt) => tt.moc.thuTu === 2);
  const moc8 = tienTrinhs.find((tt) => tt.moc.thuTu === 8);
  const daDatMoc2 = moc2?.trangThai === "PASSED";
  const daDatMoc8 = moc8?.trangThai === "PASSED";

  // Tính toán thời hạn đào tạo
  const hanChinhQuy =
    profile?.hanChinhQuy || progress?.hanCuaNcs?.hanChinhQuy || new Date().toISOString();
  const hanGiaHan = profile?.hanGiaHan || null;
  const hanHienTai = hanGiaHan || hanChinhQuy;
  const hanBuocThoiHoc =
    profile?.hanBuocThoiHoc ||
    new Date(Date.now() + 72 * 30.44 * 24 * 3600 * 1000).toISOString();

  // Tính số tháng đã gia hạn từ các đơn gia hạn đã duyệt
  const danhSachDon = apiItems.map(mapChangeRequestApiToUi);
  const tongThangDaGiaHan = apiItems
    .filter((d) => d.loai === "GIA_HAN" && d.trangThai === "DA_DUYET")
    .reduce((sum, d) => sum + (d.soThangGiaHan || 0), 0);

  const toiDaThangTichLuy = 24;
  const soThangToiDaConDuocXin = Math.max(0, toiDaThangTichLuy - tongThangDaGiaHan);

  // Ràng buộc thời gian
  const now = new Date();
  const targetCur = new Date(hanHienTai);
  const diffDaysCur = (targetCur.getTime() - now.getTime()) / (1000 * 3600 * 24);
  const conTruocHanToiThieu2Thang = diffDaysCur >= 60;

  const targetMax = new Date(hanBuocThoiHoc);
  const diffDaysMax = (targetMax.getTime() - now.getTime()) / (1000 * 3600 * 24);
  const conDuoi12ThangKhoaHoc = diffDaysMax < 365;

  const thongTinThoiGian: TrainingTimeSummary = {
    hanChinhQuy,
    hanGiaHan,
    hanHienTai,
    hanBuocThoiHoc,
    tongThangDaGiaHan,
    toiDaThangTichLuy,
    soThangToiDaConDuocXin,
    daDatMoc2,
    conTruocHanToiThieu2Thang,
    daDatMoc8,
    conDuoi12ThangKhoaHoc,
  };

  const danhSachGvhdDeXuat: CandidateSupervisorOption[] = mockCandidateSupervisors;

  return {
    ncsId,
    hoTenNcs,
    mshv,
    tenDeTaiHienTai,
    danhSachGvhdHienTai,
    danhSachGvhdDeXuat,
    thongTinThoiGian,
    danhSachDon,
  };
}
