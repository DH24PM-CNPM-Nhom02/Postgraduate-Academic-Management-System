import type {
  ChangeRequestApiItem,
  ChangeRequestDetail as ChangeRequestDetailDto,
  ChangeRequestItem as ChangeRequestListItemDto,
} from "@/src/types/api/change-request";
import type {
  SupervisedStudent,
  SupervisorExtensionRequestItem,
  SupervisorRole,
} from "@/src/types/ui/supervisor";
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

/**
 * Chuyển đổi 1 đơn đề nghị từ Backend API sang UI ChangeRequestItem
 */
export function mapChangeRequestApiToUi(
  item: ChangeRequestApiItem
): ChangeRequestItem {
  const maDon = buildSupervisorRequestCode(item.id, item.createdAt);

  const xacNhanGvhds: SupervisorOpinionItem[] = (item.xacNhanGvhds || []).map(
    (op) => ({
      id: op.id,
      giangVienId: op.gvhdId,
      tenGvhd: op.gvhd?.hoTen || "Giảng viên hướng dẫn",
      hocHamHocVi: op.gvhd?.hocHamHocVi || undefined,
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
        }
      : null,
    quyetDinh: item.quyetDinh
      ? {
          fileId: item.quyetDinh.fileId || null,
          soQuyetDinh: item.quyetDinh.soQuyetDinh,
          ngayKy: item.quyetDinh.ngayQuyetDinh,
          coQuanBanHanh: item.quyetDinh.coQuanBanHanh ?? undefined,
          fileName: `Quyet_dinh_${item.quyetDinh.soQuyetDinh.replace(/\//g, "_")}.pdf`,
        }
      : null,
  };
}

/**
 * Tổng hợp toàn bộ dữ liệu Đơn đề nghị & Gia hạn học tập từ API
 */
export function buildStudentChangeRequestsOverview(
  apiItems: ChangeRequestApiItem[],
  profile: BackendNcsMeResponse,
  progress?: MyProgressResponse | null,
  candidates: CandidateSupervisorOption[] = []
): StudentChangeRequestsOverview {
  const { id: ncsId, hoTen: hoTenNcs, mshv } = profile;

  // Đề tài hiện tại
  const tenDeTaiHienTai =
    profile.deTais?.find((d) => d.trangThai === "HIEU_LUC")?.tenDeTai ||
    "Chưa đăng ký đề tài";

  // GVHD hiện tại
  const danhSachGvhdHienTai: SupervisorAssignmentItem[] = (
    profile?.phanCongs || []
  ).map((pc) => ({
    id: pc.id,
    giangVienId: pc.gvhd?.id || pc.id,
    hoTen: pc.gvhd?.hoTen || "Chưa rõ",
    hocHamHocVi: pc.gvhd?.hocHamHocVi || "",
    email: pc.gvhd?.email || "",
    vaiTro: (pc.vaiTro as SupervisorRoleType) || "HUONG_DAN_CHINH",
    trongSo: Number(pc.trongSo) === 0.5 ? 0.5 : 1.0,
    trangThai: "DANG_HUONG_DAN",
    donViCongTac: "Chưa cập nhật",
    soQuyetDinh: pc.quyetDinh?.soQuyetDinh || "Chưa có QĐ",
    ngayKyQuyetDinh: pc.quyetDinh?.ngayQuyetDinh || "",
    ngayBatDau: pc.ngayBatDau || "",
  }));

  // Kiểm tra hoàn thành Mốc 2 và Mốc 8
  const tienTrinhs = progress?.tienTrinhs || [];
  const moc2 = tienTrinhs.find((tt) => tt.moc.thuTu === 2);
  const moc8 = tienTrinhs.find((tt) => tt.moc.thuTu === 8);
  const daDatMoc2 = moc2?.trangThai === "PASSED";
  const daDatMoc8 = moc8?.trangThai === "PASSED";

  // Tính toán thời hạn đào tạo
  const hanChinhQuy =
    profile.hanChinhQuy || progress?.hanCuaNcs?.hanChinhQuy || "";
  const hanGiaHan = profile?.hanGiaHan || null;
  const hanHienTai = hanGiaHan || hanChinhQuy;
  const hanBuocThoiHoc =
    profile?.hanBuocThoiHoc ||
    progress?.hanCuaNcs?.hanBuocThoiHoc || "";

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

  return {
    ncsId,
    hoTenNcs,
    mshv,
    tenDeTaiHienTai,
    danhSachGvhdHienTai,
    danhSachGvhdDeXuat: candidates,
    thongTinThoiGian,
    danhSachDon,
  };
}

/* =========================================================================
   GVHD: ĐƠN CẦN TẬP THỂ GVHD XÁC NHẬN (/supervisor/extensions)
   ========================================================================= */

/** Cùng quy ước mã đơn với `mapChangeRequestApiToUi` để NCS và GVHD thấy cùng một mã */
function buildSupervisorRequestCode(id: string, createdAt: string): string {
  const created = new Date(createdAt);
  const year = Number.isNaN(created.getTime()) ? "----" : created.getUTCFullYear();
  return `DN-${year}-${id.slice(0, 4).toUpperCase()}`;
}

/**
 * Chuyển các đơn cần tập thể GVHD xác nhận sang item của `SupervisorExtensionsWorkspace`.
 *
 * Theo backend (`change-request.service.ts`):
 * - `xacNhanGvhd` chỉ nhận GIA_HAN và DOI_DE_TAI;
 * - DOI_DE_TAI chỉ có `xacNhanGvhds` khi NCS tự nộp (`canGvhdXacNhan`); đơn GVHD nộp thay và
 *   DOI_GVHD không có bước này nên bị loại.
 *
 * Không tạo dữ liệu giả:
 * - `vaiTro` trong `xacNhanGvhds` không có ở backend → chỉ gán cho chính GVHD đang đăng nhập
 *   (lấy từ `GET /gvhd/me/ncs`), các GVHD khác để `undefined`.
 * - Hạn hiện tại, số tháng đã gia hạn, đề tài hiện tại, quyết định: chỉ lấy từ `GET /change-request/:id`
 *   (`detailById`); chưa tải thì để trống.
 * - Backend không trả tên file → `fileName` rỗng, UI lấy tên thật qua `GET /documents/:id`.
 */
export function mapSupervisorExtensionRequests(params: {
  requests: ChangeRequestListItemDto[];
  students: SupervisedStudent[];
  myGvhdId?: string;
  detailById?: Map<string, ChangeRequestDetailDto>;
}): SupervisorExtensionRequestItem[] {
  const { requests, students, myGvhdId, detailById } = params;
  const studentById = new Map(students.map((s) => [s.id, s]));

  return requests
    .filter(
      (r) =>
        r.loai === "GIA_HAN" ||
        (r.loai === "DOI_DE_TAI" && r.xacNhanGvhds.length > 0)
    )
    .map((r) => {
      const student = studentById.get(r.ncsId);
      const detail = detailById?.get(r.id);
      const myRole: SupervisorRoleType | undefined =
        student && student.vaiTro !== "CHUA_XAC_DINH" ? student.vaiTro : undefined;

      const xacNhanGvhds: SupervisorOpinionItem[] = r.xacNhanGvhds.map((op) => ({
        id: op.id,
        giangVienId: op.gvhdId,
        tenGvhd: op.gvhd.hoTen,
        hocHamHocVi: op.gvhd.hocHamHocVi ?? undefined,
        vaiTro: op.gvhdId === myGvhdId ? myRole : undefined,
        dongY: op.dongY,
        nhanXet: op.nhanXet,
        thoiGianPhanHoi: op.ngayXacNhan,
      }));

      const myOpinion = myGvhdId
        ? xacNhanGvhds.find((op) => op.giangVienId === myGvhdId) ?? null
        : null;

      return {
        id: r.id,
        maDon: buildSupervisorRequestCode(r.id, r.createdAt),
        loaiDon: r.loai as "GIA_HAN" | "DOI_DE_TAI",
        tenDeTaiMoi: r.tenDeTaiMoi,
        studentId: r.ncsId,
        mshv: r.ncs.mshv,
        hoTenNcs: r.ncs.hoTen,
        // NCS không còn trong /gvhd/me/ncs (vd. phân công đã hết hiệu lực) → hiển thị "—"
        khoaDaoTao: student?.khoaDaoTao ?? "—",
        // Đơn đổi đề tài: ưu tiên `deTaiHienTai` của API chi tiết (backend trả riêng cho DOI_DE_TAI)
        tenDeTai:
          (r.loai === "DOI_DE_TAI" ? detail?.deTaiHienTai?.tenDeTai : undefined) ??
          student?.tenDeTai ??
          "—",
        vaiTroCuaToi: (student?.vaiTro ?? "CHUA_XAC_DINH") as SupervisorRole,
        trangThai: r.trangThai,
        ngayGui: r.createdAt,
        soThangGiaHan: r.soThangGiaHan ?? 0,
        hanHienTai: detail?.hanHienTai ?? "",
        hanMoiDuKien: r.hanMoiDeNghi ?? "",
        tongThangDaGiaHanTruocDo: detail?.tongThangDaGiaHanTruoc ?? null,
        mocHienTai: student?.mocHienTai ?? 0,
        tenMocHienTai: student?.tenMocHienTai ?? "Chưa có dữ liệu tiến độ",
        tienDoPhanTram: student?.tienDoPhanTram ?? 0,
        lyDo: r.lyDo,
        tepDinhKem: r.fileId ? { fileId: r.fileId, fileName: "", fileUrl: "" } : null,
        xacNhanGvhds,
        yKienCuaToi: myOpinion,
        nhanXetGvhd: myOpinion?.nhanXet ?? null,
        thoiGianPhanHoiCuaToi: myOpinion?.thoiGianPhanHoi ?? null,
        quyetDinh: detail?.quyetDinh
          ? {
              fileId: detail.quyetDinh.fileId ?? null,
              soQuyetDinh: detail.quyetDinh.soQuyetDinh,
              ngayKy: detail.quyetDinh.ngayQuyetDinh,
              fileName: "",
              fileUrl: "",
            }
          : null,
        lyDoTuChoi: r.lyDoTuChoi,
      };
    });
}
