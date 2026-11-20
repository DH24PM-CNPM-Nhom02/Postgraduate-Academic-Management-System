import type {
  ChangeRequestDetailApi,
  ChangeRequestGvhdRef,
  ChangeRequestListItemApi,
  ChangeRequestSupervisorOpinionApi,
} from "@/src/types/api/change-request";
import type { BackendNcsMeResponse } from "@/src/types/api/progress";
import type { BackendThesisNcsMeResponse } from "@/src/types/api/thesis";
import type {
  ChangeRequestItem,
  StudentChangeRequestsOverview,
  SupervisorOpinionItem,
  TrainingTimeSummary,
} from "@/src/types/ui/change-request";
import type {
  SupervisedStudent,
  SupervisorExtensionRequestItem,
  SupervisorRole,
} from "@/src/types/ui/supervisor";
import type {
  SupervisorAssignmentItem,
  SupervisorRoleType,
} from "@/src/types/ui/thesis";

/** Trần gia hạn tích lũy theo backend (kiemTraGiaHan) */
const MAX_THANG_GIA_HAN = 24;

function addMonths(date: Date, months: number): Date {
  const d = new Date(date.getTime());
  d.setMonth(d.getMonth() + months);
  return d;
}

function monthsBetween(from: Date, to: Date): number {
  return (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth());
}

function gvhdDisplayName(gv?: ChangeRequestGvhdRef | null): string | undefined {
  if (!gv) return undefined;
  return gv.hocHamHocVi ? `${gv.hocHamHocVi} ${gv.hoTen}` : gv.hoTen;
}

/** Mã đơn hiển thị: backend không có mã riêng → dùng 8 ký tự đầu của UUID */
export function buildChangeRequestCode(id: string): string {
  return `DN-${id.slice(0, 8).toUpperCase()}`;
}

function mapOpinion(
  op: ChangeRequestSupervisorOpinionApi,
  roleByGvhdId: Record<string, SupervisorRoleType>
): SupervisorOpinionItem {
  return {
    id: op.id,
    giangVienId: op.gvhdId,
    tenGvhd: op.gvhd.hoTen,
    hocHamHocVi: op.gvhd.hocHamHocVi ?? undefined,
    vaiTro: roleByGvhdId[op.gvhdId],
    dongY: op.dongY,
    nhanXet: op.nhanXet,
    thoiGianPhanHoi: op.ngayXacNhan,
  };
}

/**
 * Chuyển 1 đơn từ `GET /change-request` hoặc `GET /change-request/:id` sang UI `ChangeRequestItem`.
 * `roleByGvhdId` (tùy chọn) để hiển thị vai trò GVHD trong bảng ý kiến (backend không trả vai trò ở đây).
 */
export function mapChangeRequestToUi(
  item: ChangeRequestListItemApi | ChangeRequestDetailApi,
  roleByGvhdId: Record<string, SupervisorRoleType> = {}
): ChangeRequestItem {
  const detail = item as Partial<ChangeRequestDetailApi>;

  return {
    id: item.id,
    maDon: buildChangeRequestCode(item.id),
    loaiDon: item.loai,
    trangThai: item.trangThai,
    ngayGui: item.createdAt,
    ngayCapNhat: item.updatedAt,
    lyDo: item.lyDo,
    batKhaKhang: item.batKhaKhang,
    lyDoTuChoi: item.lyDoTuChoi,
    ngayXuLy: item.ngayDuyet ?? undefined,

    tenDeTaiCu: detail.deTaiHienTai?.tenDeTai ?? undefined,
    tenDeTaiMoi: item.tenDeTaiMoi ?? undefined,

    phanCongCuId: item.phanCongCuId ?? undefined,
    tenGvhdCu: gvhdDisplayName(detail.phanCongCu?.gvhd),
    vaiTroGvhdCu: detail.phanCongCu?.vaiTro,
    gvhdMoiId: item.gvhdMoiId ?? undefined,
    tenGvhdMoi: gvhdDisplayName(item.gvhdMoi),

    soThangGiaHan: item.soThangGiaHan ?? undefined,
    hanHienTaiTaiThoiDiemNop: detail.hanHienTai ?? undefined,
    hanMoiDuKien: item.hanMoiDeNghi ?? undefined,
    xacNhanGvhds: item.xacNhanGvhds.map((op) => mapOpinion(op, roleByGvhdId)),

    // Backend /change-request không trả tên file → để trống; UI lấy tên thật qua GET /documents/:id
    tepDinhKem: item.fileId
      ? { fileId: item.fileId, fileName: "", fileUrl: "" }
      : null,
    quyetDinh: detail.quyetDinh
      ? {
          soQuyetDinh: detail.quyetDinh.soQuyetDinh,
          ngayKy: detail.quyetDinh.ngayQuyetDinh,
          fileId: detail.quyetDinh.fileId ?? undefined,
          fileName: "",
          fileUrl: "",
        }
      : null,
  };
}

/**
 * Tính tóm tắt thời gian đào tạo & các cờ điều kiện theo đúng quy tắc của backend
 * (`kiemTraGiaHan`, `kiemTraDoiGvhd`, `kiemTraDoiDeTai`) — chỉ để pre-validate ở client,
 * server luôn kiểm tra lại.
 */
export function buildTrainingSummary(
  profile: BackendNcsMeResponse,
  requests: ChangeRequestListItemApi[]
): TrainingTimeSummary {
  const hanChinhQuy = profile.hanChinhQuy;
  const hanHienTai = profile.hanGiaHan ?? profile.hanChinhQuy;
  const now = new Date();
  const hanHienTaiDate = new Date(hanHienTai);
  const hanBuocDate = new Date(profile.hanBuocThoiHoc);

  let tongThangDaGiaHan = requests
    .filter((r) => r.loai === "GIA_HAN" && r.trangThai === "DA_DUYET")
    .reduce((sum, r) => sum + (r.soThangGiaHan ?? 0), 0);
  // Giống backend: nếu chưa có đơn duyệt nhưng đã có hanGiaHan thì suy từ chênh lệch hạn
  if (tongThangDaGiaHan === 0 && profile.hanGiaHan) {
    tongThangDaGiaHan = Math.max(
      0,
      monthsBetween(new Date(profile.hanChinhQuy), new Date(profile.hanGiaHan))
    );
  }

  const conLaiDen72Thang = Number.isNaN(hanBuocDate.getTime())
    ? 0
    : Math.max(0, monthsBetween(hanHienTaiDate, hanBuocDate));

  const moc = (thuTu: number) => profile.tienTrinhs.find((t) => t.moc.thuTu === thuTu);

  return {
    hanChinhQuy,
    hanGiaHan: profile.hanGiaHan,
    hanHienTai,
    hanBuocThoiHoc: profile.hanBuocThoiHoc,
    tongThangDaGiaHan,
    toiDaThangTichLuy: MAX_THANG_GIA_HAN,
    soThangToiDaConDuocXin: Math.max(
      0,
      Math.min(MAX_THANG_GIA_HAN - tongThangDaGiaHan, conLaiDen72Thang)
    ),
    daDatMoc2: moc(2)?.trangThai === "PASSED",
    conTruocHanToiThieu2Thang: now <= addMonths(hanHienTaiDate, -2),
    daDatMoc8: moc(8)?.trangThai === "PASSED",
    conDuoi12ThangKhoaHoc: now > addMonths(hanHienTaiDate, -12),
  };
}

/** Ghép dữ liệu thật thành overview cho `ChangeRequestWorkspace` của NCS */
export function buildStudentChangeRequestsOverview(params: {
  profile: BackendNcsMeResponse;
  thesis?: BackendThesisNcsMeResponse | null;
  supervisors: SupervisorAssignmentItem[];
  requests: ChangeRequestListItemApi[];
}): StudentChangeRequestsOverview {
  const { profile, thesis, supervisors, requests } = params;
  const roleByGvhdId: Record<string, SupervisorRoleType> = {};
  for (const s of supervisors) roleByGvhdId[s.giangVienId] = s.vaiTro;

  return {
    ncsId: profile.id,
    hoTenNcs: profile.hoTen,
    mshv: profile.mshv,
    tenDeTaiHienTai: thesis?.deTaiHienTai?.tenDeTai ?? "Chưa được giao đề tài",
    danhSachGvhdHienTai: supervisors,
    // BLOCKED: `GET /gvhd` yêu cầu quyền `gvhd.read` mà vai trò NCS không có → chưa lấy được danh sách GVHD đề xuất
    danhSachGvhdDeXuat: [],
    thongTinThoiGian: buildTrainingSummary(profile, requests),
    danhSachDon: requests.map((r) => mapChangeRequestToUi(r, roleByGvhdId)),
  };
}

/**
 * GVHD: chuyển các đơn cần tập thể GVHD xác nhận sang item của `SupervisorExtensionsWorkspace`.
 * Theo backend `xacNhanGvhd` (change-request.service.ts:350) chỉ có 2 loại:
 * - GIA_HAN
 * - DOI_DE_TAI do NCS tự nộp (create(): `canGvhdXacNhan = DOI_DE_TAI && laNcsTao` → có `xacNhanGvhds`)
 * Đơn DOI_DE_TAI do GVHD nộp thay và DOI_GVHD không có `xacNhanGvhds` nên bị loại.
 * Thông tin NCS bổ sung lấy từ `GET /gvhd/me/ncs`.
 */
export function mapSupervisorExtensionRequests(params: {
  requests: ChangeRequestListItemApi[];
  students: SupervisedStudent[];
  myGvhdId?: string;
  /** Chi tiết đã tải (GET /change-request/:id) — nguồn chính xác cho hạn hiện tại & số tháng đã gia hạn */
  detailById?: Map<string, ChangeRequestDetailApi>;
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
      const roleByGvhdId: Record<string, SupervisorRoleType> = {};
      if (myGvhdId && student && student.vaiTro !== "CHUA_XAC_DINH") {
        roleByGvhdId[myGvhdId] = student.vaiTro;
      }
      const ui = mapChangeRequestToUi(r, roleByGvhdId);
      const myOpinion = myGvhdId
        ? ui.xacNhanGvhds?.find((op) => op.giangVienId === myGvhdId) ?? null
        : null;

      // Hạn hiện tại & tổng tháng đã gia hạn: chỉ lấy từ API chi tiết (backend tính
      // `hanGiaHan ?? hanChinhQuy` và cộng các đơn GIA_HAN DA_DUYET). Chưa tải → để trống, không tự suy.
      const detail = detailById?.get(r.id);

      return {
        id: r.id,
        maDon: ui.maDon,
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
        tepDinhKem: ui.tepDinhKem ?? null,
        xacNhanGvhds: ui.xacNhanGvhds ?? [],
        yKienCuaToi: myOpinion,
        nhanXetGvhd: myOpinion?.nhanXet ?? null,
        thoiGianPhanHoiCuaToi: myOpinion?.thoiGianPhanHoi ?? null,
        quyetDinh: null,
        lyDoTuChoi: r.lyDoTuChoi,
      };
    });
}
