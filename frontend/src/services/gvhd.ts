import { apiClient, throwApiError } from "@/src/lib/api";
import type { SupervisorQuotaRecord } from "@/src/types/academic";
import type {
  SupervisorAssignmentItem,
  SupervisorRoleType,
} from "@/src/types/ui/thesis";
import type {
  SupervisedStudent,
  SupervisedStudentRejectedInfo,
  SupervisedStudentStatus,
  SupervisorProfile,
  SupervisorQuota,
  SupervisorRole,
} from "@/src/types/ui/supervisor";
import type {
  EvidenceItem,
  EvidenceStatus,
  MilestoneProgressItem,
  MilestoneStatus,
  PhieuNhanXetItem,
} from "@/src/types/ui/progress";

export type VaiTroHuongDan = "HUONG_DAN_CHINH" | "DONG_HUONG_DAN";

/**
 * Cấu trúc bản ghi NCS nhận từ Backend API (GET /gvhd/me/ncs)
 */
export interface BackendSupervisorNcsRaw {
  phanCongId: string;
  vaiTro: "HUONG_DAN_CHINH" | "DONG_HUONG_DAN" | string;
  trongSo: number | string;
  ngayBatDau?: string | null;
  ncs: {
    id: string;
    mshv: string;
    hoTen: string;
    trangThai: string;
    nganh?: {
      id: number;
      maNganh?: string;
      tenNganh?: string;
    } | null;
    khoaHoc?: string | null;
    lop?: string | null;
    hanChinhQuy?: string | null;
    hanBuocThoiHoc?: string | null;
    hanGiaHan?: string | null;
    deTaiHieuLuc?: {
      id: string;
      tenDeTai: string;
      createdAt?: string;
    } | null;
    tienTrinhs?: Array<{
      mocThuTu: number;
      tenMoc: string;
      trangThai: string;
      yeuCauDiem: boolean;
    }>;
  };
}

/**
 * Cấu trúc Đơn vị công tác từ Backend
 */
export interface BackendDonViRaw {
  id?: string;
  ten?: string;
  parent?: {
    id?: string;
    ten?: string;
  } | null;
}

/**
 * Cấu trúc bản ghi Phân công hướng dẫn nhận từ GET /gvhd/assignments
 */
export interface BackendAssignmentRaw {
  id: string;
  ncsId: string;
  gvhdId: string;
  vaiTro: VaiTroHuongDan;
  trongSo: number | string;
  quyetDinhId: string;
  trangThai: "DANG_HIEU_LUC" | "DEACTIVATE";
  ngayBatDau?: string | null;
  ngayKetThuc?: string | null;
  gvhd?: {
    id: string;
    hoTen?: string;
    email?: string | null;
    hocHamHocVi?: string;
    soNcsDangHuongDan?: number | string;
    maxNcsChoPhep?: number;
    donVi?: BackendDonViRaw | null;
  } | null;
  ncs?: {
    id: string;
    mshv?: string;
    hoTen?: string;
    trangThai?: string;
  } | null;
  quyetDinh?: {
    id: string;
    soQuyetDinh?: string;
    ngayQuyetDinh?: string;
    loai?: string;
  } | null;
}

/**
 * Cấu trúc dữ liệu thô GVHD nhận về từ Backend API (GET /gvhd)
 */
export interface BackendGvhdRaw {
  id: string;
  maGv?: string | null;
  hoTen: string;
  gioiTinh?: string | null;
  ngaySinh?: string | null;
  email?: string | null;
  hocHamHocVi?: string;
  maxNcsChoPhep?: number;
  soNcsDangHuongDan?: number | string;
  chuyenNganh?: string | null;
  quocGiaTotNghiep?: string | null;
  trangThai?: boolean;
  donVi?: BackendDonViRaw | null;
  phanCongs?: BackendAssignmentRaw[];
}

/**
 * Cấu trúc bản ghi Giảng viên hướng dẫn của chính NCS nhận từ GET /gvhd/my-supervisors
 */
export interface BackendMySupervisorRaw {
  phanCongId: string;
  vaiTro: "HUONG_DAN_CHINH" | "DONG_HUONG_DAN" | string;
  trongSo: number | string;
  ngayBatDau?: string | null;
  gvhd: {
    id: string;
    maGv?: string | null;
    hoTen: string;
    hocHamHocVi?: string;
    email?: string | null;
    soDienThoai?: string | null;
    donVi?: BackendDonViRaw | string | null;
    chuyenNganh?: string | null;
    linhVucNghienCuu?: string | null;
  };
  quyetDinh?: {
    id?: string;
    soQuyetDinh?: string;
    ngayQuyetDinh?: string;
    fileUrl?: string;
    fileName?: string;
  } | null;
}

/**
 * Cấu trúc Quyết định phân công GVHD lấy từ GET /decisions
 */
export interface BackendAssignmentDecisionRaw {
  id: string;
  soQuyetDinh: string;
  ngayQuyetDinh: string;
  loai: string;
  ncsId?: string | null;
  trangThai: string;
  ghiChu?: string | null;
}

/**
 * Payload gửi lên POST /gvhd/assignments
 */
export interface CreateAssignmentPayload {
  ncsId: string;
  gvhdId: string;
  vaiTro: VaiTroHuongDan;
  quyetDinhId: string;
}

/**
 * Tách mảng an toàn cho cả response mảng thuần T[] và dạng phân trang { data: T[] }
 */
function unwrapArrayResponse<T>(payload: T[] | { data?: T[] } | unknown): T[] {
  if (Array.isArray(payload)) {
    return payload as T[];
  }
  if (
    payload &&
    typeof payload === "object" &&
    "data" in payload &&
    Array.isArray((payload as { data?: unknown }).data)
  ) {
    return (payload as { data: T[] }).data;
  }
  return [];
}

/**
 * Quy đổi enum học hàm/học vị sang nhãn hiển thị tiếng Việt
 */
export function formatDegreeLabel(hocHamHocVi?: string): string {
  switch (hocHamHocVi) {
    case "GIAO_SU":
      return "Giáo sư";
    case "PHO_GIAO_SU":
      return "Phó Giáo sư";
    case "TIEN_SI_KHOA_HOC":
      return "Tiến sĩ Khoa học";
    case "TIEN_SI":
    default:
      return "Tiến sĩ";
  }
}

/**
 * Tạo tiền tố học hàm/học vị trước tên nếu tên gốc chưa có
 */
export function formatSupervisorDisplayName(hoTen: string, hocHamHocVi?: string): string {
  const trimmed = hoTen.trim();
  if (/^(GS\.|PGS\.|TSKH\.|TS\.)/i.test(trimmed)) {
    return trimmed;
  }
  switch (hocHamHocVi) {
    case "GIAO_SU":
      return `GS.TS. ${trimmed}`;
    case "PHO_GIAO_SU":
      return `PGS.TS. ${trimmed}`;
    case "TIEN_SI_KHOA_HOC":
      return `TSKH. ${trimmed}`;
    case "TIEN_SI":
    default:
      return `TS. ${trimmed}`;
  }
}

/**
 * Chuẩn hóa dữ liệu GVHD từ Backend + danh sách phân công hiệu lực thành SupervisorQuotaRecord
 */
export function mapBackendGvhdToSupervisorQuota(
  raw: BackendGvhdRaw,
  activeAssignments: BackendAssignmentRaw[] = []
): SupervisorQuotaRecord {
  const myAssignments = activeAssignments.filter(
    (a) => a.gvhdId === raw.id && a.trangThai === "DANG_HIEU_LUC"
  );

  const independentCount = myAssignments.filter(
    (a) => a.vaiTro === "HUONG_DAN_CHINH"
  ).length;
  const coCount = myAssignments.filter(
    (a) => a.vaiTro === "DONG_HUONG_DAN"
  ).length;

  const computedUsed = Number((independentCount * 1.0 + coCount * 0.5).toFixed(1));
  const rawCacheUsed =
    raw.soNcsDangHuongDan !== undefined
      ? Number(raw.soNcsDangHuongDan)
      : myAssignments[0]?.gvhd?.soNcsDangHuongDan !== undefined
      ? Number(myAssignments[0].gvhd.soNcsDangHuongDan)
      : undefined;

  const usedQuota =
    myAssignments.length > 0
      ? computedUsed
      : rawCacheUsed !== undefined && !isNaN(rawCacheUsed)
      ? Number(rawCacheUsed.toFixed(1))
      : 0;

  const maxQuota = Number(raw.maxNcsChoPhep ?? 3);
  const remainingQuota = Math.max(0, Number((maxQuota - usedQuota).toFixed(1)));
  const isFull = remainingQuota <= 0;

  const assignedStudents = myAssignments.map((a) => {
    const ncsName = a.ncs?.hoTen || "NCS";
    const mshv = a.ncs?.mshv ? ` (${a.ncs.mshv})` : "";
    const roleLabel = a.vaiTro === "HUONG_DAN_CHINH" ? "Độc lập" : "Đồng HD";
    return `${ncsName}${mshv} — ${roleLabel}`;
  });

  return {
    id: raw.id,
    name: formatSupervisorDisplayName(raw.hoTen, raw.hocHamHocVi),
    code: raw.maGv || "N/A",
    department: raw.donVi?.ten || raw.donVi?.parent?.ten || raw.chuyenNganh || "Chưa cập nhật đơn vị",
    degree: formatDegreeLabel(raw.hocHamHocVi),
    independentCount,
    coCount,
    usedQuota,
    maxQuota,
    remainingQuota,
    statusText: isFull
      ? "Đã đủ định mức"
      : `Còn ${remainingQuota.toFixed(1)} chỉ tiêu`,
    statusColor: isFull
      ? "bg-rose-100 text-rose-800 border-rose-200"
      : "bg-emerald-100 text-emerald-800 border-emerald-200",
    assignedStudents,
  };
}

/**
 * Chuẩn hóa dữ liệu thô từ GET /gvhd/my-supervisors sang SupervisorAssignmentItem dùng cho UI
 */
export function mapBackendMySupervisorToItem(
  raw: BackendMySupervisorRaw
): SupervisorAssignmentItem {
  const gvhd = raw.gvhd || ({} as Partial<BackendMySupervisorRaw["gvhd"]>);
  const vaiTro: SupervisorRoleType =
    raw.vaiTro === "DONG_HUONG_DAN" ? "DONG_HUONG_DAN" : "HUONG_DAN_CHINH";
  const rawWeight = Number(raw.trongSo);
  const trongSo: 1.0 | 0.5 = rawWeight === 0.5 ? 0.5 : 1.0;

  const donViCongTac =
    typeof gvhd.donVi === "string"
      ? gvhd.donVi
      : gvhd.donVi?.ten ||
        gvhd.donVi?.parent?.ten ||
        gvhd.chuyenNganh ||
        "Trường Đại học An Giang";

  return {
    id: raw.phanCongId || gvhd.id || "",
    giangVienId: gvhd.id || "",
    hoTen: gvhd.hoTen || "Chưa cập nhật tên GVHD",
    hocHamHocVi: formatDegreeLabel(gvhd.hocHamHocVi) || gvhd.hocHamHocVi || "TS.",
    vaiTro,
    trongSo,
    email: gvhd.email || "",
    soDienThoai: gvhd.soDienThoai || undefined,
    donViCongTac,
    linhVucNghienCuu: gvhd.linhVucNghienCuu || gvhd.chuyenNganh || undefined,
    trangThai: "DANG_HUONG_DAN",
    soQuyetDinh: raw.quyetDinh?.soQuyetDinh || "Chưa cập nhật số QĐ",
    ngayKyQuyetDinh: raw.quyetDinh?.ngayQuyetDinh || raw.ngayBatDau || "",
    ngayBatDau: raw.ngayBatDau || "",
    fileNameQuyetDinh:
      raw.quyetDinh?.fileName ||
      (raw.quyetDinh?.soQuyetDinh
        ? `Quyet-dinh-${raw.quyetDinh.soQuyetDinh}.pdf`
        : undefined),
    fileUrlQuyetDinh: raw.quyetDinh?.fileUrl || undefined,
  };
}

/**
 * Chuẩn hóa thông tin hồ sơ GVHD từ Backend (GET /gvhd/me) sang SupervisorProfile dùng cho UI
 */
export function mapBackendGvhdToSupervisorProfile(
  raw: BackendGvhdRaw
): SupervisorProfile {
  const donViTen =
    raw.donVi?.ten ||
    raw.donVi?.parent?.ten ||
    "Trường Đại học An Giang";

  const degreeText = formatDegreeLabel(raw.hocHamHocVi);

  return {
    id: raw.id,
    hoTen: raw.hoTen || "Giảng viên Hướng dẫn",
    hocHamHocVi: degreeText || raw.hocHamHocVi || "TS.",
    maCanBo: raw.maGv || "N/A",
    donVi: donViTen,
    chuyenMon: raw.chuyenNganh || "Chuyên ngành Sau Đại học",
    email: raw.email || "Chưa cập nhật email",
    soDienThoai: "Chưa cập nhật",
    hanMucToiDa: raw.maxNcsChoPhep ? Number(raw.maxNcsChoPhep) : 3.0,
  };
}

/**
 * Thông tin thời hạn đào tạo chuẩn hóa
 */
export interface NcsDeadlineInfo {
  soThangConLai: number | null;
  soNgayConLai: number | null;
  daHetHan: boolean | null;
  hanDaoTao: string | null;
}

/**
 * Tính toán thời hạn đào tạo của NCS dựa trên múi giờ Việt Nam (Asia/Ho_Chi_Minh).
 * Quy tắc nghiệp vụ:
 * - null/undefined hoặc chuỗi ngày không hợp lệ: { soThangConLai: null, soNgayConLai: null, daHetHan: null, hanDaoTao: null }
 * - diffDays < 0 (đã quá hạn): { soThangConLai: 0, soNgayConLai: 0, daHetHan: true }
 * - diffDays === 0 (hôm nay là hạn chót, còn hiệu lực trong ngày): { soThangConLai: 0, soNgayConLai: 0, daHetHan: false }
 * - 1 <= diffDays <= 30: { soThangConLai: 1, soNgayConLai: diffDays, daHetHan: false }
 * - diffDays > 30: { soThangConLai: Math.max(1, Math.round(diffDays / 30.4375)), soNgayConLai: diffDays, daHetHan: false }
 */
export function computeNcsDeadline(
  targetDateStr?: string | null,
  nowInput?: Date | string
): NcsDeadlineInfo {
  if (!targetDateStr || typeof targetDateStr !== "string") {
    return {
      soThangConLai: null,
      soNgayConLai: null,
      daHetHan: null,
      hanDaoTao: null,
    };
  }

  const match = targetDateStr.trim().match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) {
    return {
      soThangConLai: null,
      soNgayConLai: null,
      daHetHan: null,
      hanDaoTao: null,
    };
  }

  const targetYear = parseInt(match[1], 10);
  const targetMonth = parseInt(match[2], 10);
  const targetDay = parseInt(match[3], 10);
  if (
    isNaN(targetYear) ||
    isNaN(targetMonth) ||
    isNaN(targetDay) ||
    targetMonth < 1 ||
    targetMonth > 12 ||
    targetDay < 1 ||
    targetDay > 31
  ) {
    return {
      soThangConLai: null,
      soNgayConLai: null,
      daHetHan: null,
      hanDaoTao: null,
    };
  }

  let nowYear: number;
  let nowMonth: number;
  let nowDay: number;

  if (typeof nowInput === "string") {
    const nowMatch = nowInput.trim().match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (nowMatch) {
      nowYear = parseInt(nowMatch[1], 10);
      nowMonth = parseInt(nowMatch[2], 10);
      nowDay = parseInt(nowMatch[3], 10);
    } else {
      const nowDate = new Date(nowInput);
      const d = isNaN(nowDate.getTime()) ? new Date() : nowDate;
      const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Ho_Chi_Minh",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).formatToParts(d);
      nowYear = parseInt(parts.find((p) => p.type === "year")?.value || "2026", 10);
      nowMonth = parseInt(parts.find((p) => p.type === "month")?.value || "11", 10);
      nowDay = parseInt(parts.find((p) => p.type === "day")?.value || "13", 10);
    }
  } else {
    const nowDate = nowInput instanceof Date ? nowInput : new Date();
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Ho_Chi_Minh",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(nowDate);
    nowYear = parseInt(parts.find((p) => p.type === "year")?.value || "2026", 10);
    nowMonth = parseInt(parts.find((p) => p.type === "month")?.value || "11", 10);
    nowDay = parseInt(parts.find((p) => p.type === "day")?.value || "13", 10);
  }

  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  const nowUtc = Date.UTC(nowYear, nowMonth - 1, nowDay);
  const targetUtc = Date.UTC(targetYear, targetMonth - 1, targetDay);
  const diffDays = Math.round((targetUtc - nowUtc) / MS_PER_DAY);

  const hanDaoTao = `${String(targetDay).padStart(2, "0")}/${String(targetMonth).padStart(2, "0")}/${targetYear}`;

  if (diffDays < 0) {
    return {
      soThangConLai: 0,
      soNgayConLai: 0,
      daHetHan: true,
      hanDaoTao,
    };
  }

  if (diffDays === 0) {
    return {
      soThangConLai: 0,
      soNgayConLai: 0,
      daHetHan: false,
      hanDaoTao,
    };
  }

  const soThangConLai = Math.max(1, Math.round(diffDays / 30.4375));
  return {
    soThangConLai,
    soNgayConLai: diffDays,
    daHetHan: false,
    hanDaoTao,
  };
}

/**
 * Chuẩn hóa bản ghi NCS từ GET /gvhd/me/ncs sang SupervisedStudent dùng cho UI Cổng GVHD
 */
export function mapBackendNcsToSupervisedStudent(
  raw: BackendSupervisorNcsRaw
): SupervisedStudent {
  const ncs = raw.ncs || ({} as Partial<BackendSupervisorNcsRaw["ncs"]>);
  const tienTrinhs = ncs.tienTrinhs || [];

  // Xác định vai trò: KHÔNG tự mặc định thành HUONG_DAN_CHINH nếu không xác định
  let vaiTro: SupervisorRole = "CHUA_XAC_DINH";
  if (raw.vaiTro === "HUONG_DAN_CHINH") {
    vaiTro = "HUONG_DAN_CHINH";
  } else if (raw.vaiTro === "DONG_HUONG_DAN") {
    vaiTro = "DONG_HUONG_DAN";
  }

  // Sử dụng trọng số thực tế từ dữ liệu phân công (raw.trongSo) đối chiếu quy chuẩn BR-09
  // HUONG_DAN_CHINH = 1.0, DONG_HUONG_DAN = 0.5
  const rawWeight = Number(raw.trongSo);
  let trongSo: number;
  if (!isNaN(rawWeight) && (rawWeight === 1.0 || rawWeight === 0.5)) {
    trongSo = rawWeight;
  } else if (vaiTro === "HUONG_DAN_CHINH") {
    trongSo = 1.0;
  } else if (vaiTro === "DONG_HUONG_DAN") {
    trongSo = 0.5;
  } else {
    trongSo = 0;
  }

  // Tính số mốc hoàn thành và tổng số mốc: KHÔNG tự mặc định là 9 khi không có tienTrinhs
  const soMocHoanThanh = tienTrinhs.filter((t) => t.trangThai === "PASSED").length;
  const tongSoMoc = tienTrinhs.length;
  const tienDoPhanTram = tongSoMoc > 0 ? Math.round((soMocHoanThanh / tongSoMoc) * 100) : 0;

  // Xác định mốc hiện tại
  let mocHienTai = 0;
  let tenMocHienTai = "Chưa có tiến trình mốc";
  if (tongSoMoc > 0) {
    const currentTienTrinh =
      tienTrinhs.find((t) => t.trangThai !== "PASSED") || tienTrinhs[tienTrinhs.length - 1];
    mocHienTai = currentTienTrinh?.mocThuTu ?? 1;
    tenMocHienTai = currentTienTrinh?.tenMoc ?? `Mốc ${mocHienTai}`;
  }

  // Kiểm tra mốc bị từ chối cần hoàn thiện lại
  // Chỉ lấy thông tin số mốc và tên mốc có thật từ API, KHÔNG tạo lý do/người duyệt/ngày duyệt giả định
  const rejectedTienTrinh = tienTrinhs.find((t) => t.trangThai === "REJECTED");
  const coMocCanHoanThien = Boolean(rejectedTienTrinh);
  const thongTinMocTuChoi: SupervisedStudentRejectedInfo | undefined = rejectedTienTrinh
    ? {
        mocSo: rejectedTienTrinh.mocThuTu,
        tenMoc: rejectedTienTrinh.tenMoc,
      }
    : undefined;

  // Ánh xạ trạng thái học tập từ Backend TrangThaiHocTap:
  // - DA_TOT_NGHIEP -> TOT_NGHIEP
  // - BAO_LUU / NGUNG_HOC / BUOC_THOI_HOC -> TAM_DUNG (tài khoản khóa / dừng học tập, không tính định mức)
  // - GIA_HAN / DANG_HOC -> DANG_THUC_HIEN (hoặc CAN_HOAN_THIEN / CHO_DUYET dựa trên tiến trình mốc)
  let trangThaiHocTap: SupervisedStudentStatus = "DANG_THUC_HIEN";
  if (ncs.trangThai === "DA_TOT_NGHIEP") {
    trangThaiHocTap = "TOT_NGHIEP";
  } else if (
    ncs.trangThai === "BAO_LUU" ||
    ncs.trangThai === "NGUNG_HOC" ||
    ncs.trangThai === "BUOC_THOI_HOC"
  ) {
    trangThaiHocTap = "TAM_DUNG";
  } else if (coMocCanHoanThien) {
    trangThaiHocTap = "CAN_HOAN_THIEN";
  } else if (tienTrinhs.some((t) => t.trangThai === "PENDING_REVIEW")) {
    trangThaiHocTap = "CHO_DUYET";
  } else {
    trangThaiHocTap = "DANG_THUC_HIEN";
  }

  // Xác định hạn học tập có hiệu lực:
  // - Chỉ sử dụng hanGiaHan khi trạng thái là GIA_HAN và có hanGiaHan (đã được duyệt)
  // - Ngược lại, nếu có hanChinhQuy thì sử dụng hanChinhQuy
  // - KHÔNG sử dụng hanBuocThoiHoc (hạn 72 tháng kỷ luật/thôi học) làm hạn hoàn thành chương trình
  let targetDateStr: string | null = null;
  if (ncs.trangThai === "GIA_HAN" && ncs.hanGiaHan) {
    targetDateStr = ncs.hanGiaHan;
  } else if (ncs.hanChinhQuy) {
    targetDateStr = ncs.hanChinhQuy;
  }

  // Tính toán thời hạn chuẩn xác theo múi giờ Việt Nam
  const deadlineInfo = computeNcsDeadline(targetDateStr);

  // Khởi tạo danh sách mốc cơ bản từ tienTrinhs
  const milestones: MilestoneProgressItem[] = tienTrinhs.map((tt) => ({
    id: `tt-${tt.mocThuTu}`,
    thuTu: tt.mocThuTu,
    tenMoc: tt.tenMoc,
    trangThai: (tt.trangThai as MilestoneStatus) || "LOCKED",
    yeuCauDiem: Boolean(tt.yeuCauDiem),
    coTheNop: false,
    lichSuMinhChung: [],
  }));

  return {
    id: ncs.id || raw.phanCongId,
    mshv: ncs.mshv || "N/A",
    hoTen: ncs.hoTen || "Chưa cập nhật tên NCS",
    lop: ncs.lop || "Chưa xếp lớp",
    nganh: ncs.nganh?.tenNganh || "Chưa cập nhật ngành",
    chuyenNganh: ncs.nganh?.tenNganh || "Sau Đại học",
    khoaDaoTao: ncs.khoaHoc || "Chưa cập nhật khóa",
    tenDeTai: ncs.deTaiHieuLuc?.tenDeTai || "Chưa giao đề tài chính thức",
    trangThaiHocTap,
    mocHienTai,
    tenMocHienTai,
    soMocHoanThanh,
    tongSoMoc,
    tienDoPhanTram,
    vaiTro,
    trongSo,
    soQuyetDinhPhanCong: "Theo QĐ phân công",
    ngayPhanCong: raw.ngayBatDau || "",
    ngayNhapHoc: "",
    soThangConLai: deadlineInfo.soThangConLai,
    soNgayConLai: deadlineInfo.soNgayConLai,
    daHetHan: deadlineInfo.daHetHan,
    hanDaoTao: deadlineInfo.hanDaoTao,
    coMocCanHoanThien,
    thongTinMocTuChoi,
    milestones,
  };
}

/**
 * Tính toán định mức hướng dẫn thực tế của GVHD theo Quy chế BR-09
 * Sử dụng trọng số thực tế từ dữ liệu phân công và khử trùng NCS để tránh sai lệch Quota.
 */
export function computeSupervisorQuota(
  students: SupervisedStudent[],
  maxQuota: number = 3.0
): SupervisorQuota {
  // Khử trùng NCS theo ID / MSHV để tránh sai lệch khi danh sách có bản ghi trùng
  const seenIds = new Set<string>();
  const uniqueStudents: SupervisedStudent[] = [];
  for (const s of students) {
    const key = s.id || s.mshv;
    if (key && !seenIds.has(key)) {
      seenIds.add(key);
      uniqueStudents.push(s);
    }
  }

  // Chỉ tính các NCS đang học tập thực tế (loại trừ đã tốt nghiệp hoặc tạm dừng / thôi học)
  const activeStudents = uniqueStudents.filter(
    (s) => s.trangThaiHocTap !== "TOT_NGHIEP" && s.trangThaiHocTap !== "TAM_DUNG"
  );

  const mainStudents = activeStudents.filter((s) => s.vaiTro === "HUONG_DAN_CHINH");
  const coStudents = activeStudents.filter((s) => s.vaiTro === "DONG_HUONG_DAN");
  const otherStudents = activeStudents.filter(
    (s) => s.vaiTro !== "HUONG_DAN_CHINH" && s.vaiTro !== "DONG_HUONG_DAN"
  );

  const soLuongHuongDanChinh = mainStudents.length;
  const soLuongDongHuongDan = coStudents.length;

  // Sử dụng trọng số thực tế từ dữ liệu phân công thay vì tự nhân cứng theo vai trò
  const trongSoChinh = Number(
    mainStudents.reduce((sum, s) => sum + (Number(s.trongSo) || 0), 0).toFixed(1)
  );
  const trongSoPhu = Number(
    coStudents.reduce((sum, s) => sum + (Number(s.trongSo) || 0), 0).toFixed(1)
  );
  const trongSoKhac = Number(
    otherStudents.reduce((sum, s) => sum + (Number(s.trongSo) || 0), 0).toFixed(1)
  );

  const tongTrongSo = Number((trongSoChinh + trongSoPhu + trongSoKhac).toFixed(1));
  const hanMucToiDa = Number(maxQuota > 0 ? maxQuota : 3.0);
  const trongSoConLai = Math.max(0, Number((hanMucToiDa - tongTrongSo).toFixed(1)));
  const tyLeSuDungPhanTram =
    hanMucToiDa > 0 ? Math.round((tongTrongSo / hanMucToiDa) * 100) : 0;

  let mucCanhBao: SupervisorQuota["mucCanhBao"] = "SAFE";
  let ghiChuCanhBao: string | undefined;

  if (tongTrongSo > hanMucToiDa) {
    mucCanhBao = "EXCEEDED";
    ghiChuCanhBao = "Đã vượt quá hạn mức hướng dẫn cho phép theo Quy chế BR-09.";
  } else if (tongTrongSo === hanMucToiDa) {
    mucCanhBao = "FULL";
    ghiChuCanhBao = "Đã chạm định mức tối đa, không thể nhận thêm NCS mới.";
  } else if (tyLeSuDungPhanTram >= 75) {
    mucCanhBao = "WARNING";
    ghiChuCanhBao = "Tải hướng dẫn đã đạt mức cảnh báo (≥ 75%).";
  }

  return {
    hanMucToiDa,
    soLuongHuongDanChinh,
    soLuongDongHuongDan,
    trongSoChinh,
    trongSoPhu,
    tongTrongSo,
    trongSoConLai,
    tyLeSuDungPhanTram,
    mucCanhBao,
    ghiChuCanhBao,
  };
}

/**
 * Cấu trúc chi tiết Nghiên cứu sinh nhận từ Backend API (GET /gvhd/me/ncs/:ncsId)
 */
export interface BackendNcsDetailRaw {
  id: string;
  userId?: string | null;
  mshv: string;
  hoTen: string;
  gioiTinh?: string | null;
  ngaySinh?: string | null;
  email?: string | null;
  soDienThoai?: string | null;
  diaChi?: string | null;
  trangThai: string;
  lop?: string | null;
  khoaHoc?: string | null;
  ngayNhapHoc?: string | null;
  hanChinhQuy?: string | null;
  hanBuocThoiHoc?: string | null;
  hanGiaHan?: string | null;
  nganh?: {
    id: number;
    maNganh?: string;
    tenNganh?: string;
  } | null;
  khoaHocNcs?: {
    id: number;
    maKhoaHoc?: string;
    tenKhoaHoc?: string;
  } | null;
  deTais?: Array<{
    id: string;
    ncsId: string;
    tenDeTai: string;
    tiengAnh?: string | null;
    moTa?: string | null;
    trangThai: string;
    ngayDangKy?: string | null;
    ngayDuyet?: string | null;
    createdAt?: string;
  }>;
  phanCongs?: Array<{
    id: string;
    ncsId: string;
    gvhdId: string;
    vaiTro: "HUONG_DAN_CHINH" | "DONG_HUONG_DAN" | string;
    trongSo: number | string;
    ngayBatDau?: string | null;
    ngayKetThuc?: string | null;
    trangThai: string;
    gvhd?: {
      id: string;
      hoTen: string;
      email?: string | null;
      hocHamHocVi?: string | null;
      chuyenNganh?: string | null;
      donVi?: { id: number; ten: string } | null;
    } | null;
    quyetDinh?: {
      id: string;
      soQuyetDinh: string;
      ngayQuyetDinh: string;
      loai: string;
    } | null;
  }>;
  tienTrinhs?: Array<{
    id: string;
    ncsId: string;
    mocId: number;
    trangThai: string;
    openedAt?: string | null;
    submittedAt?: string | null;
    passedAt?: string | null;
    hanKeHoach?: string | null;
    moc?: {
      id: number;
      thuTu: number;
      tenMoc: string;
      moTa?: string | null;
      yeuCauDiem: boolean;
    } | null;
    minhChungs?: Array<{
      id: string;
      tienTrinhId: string;
      lanNop: number;
      fileId: string;
      ghiChuNcs?: string | null;
      trangThai: string;
      diemTrungBinh?: number | string | null;
      lyDoTuChoi?: string | null;
      nguoiDuyetId?: string | null;
      ngayNop: string;
      ngayDuyet?: string | null;
      createdAt: string;
      quyetDinh?: {
        id: string;
        soQuyetDinh: string;
        ngayQuyetDinh: string;
      } | null;
      phieuNhanXets?: Array<{
        id: string;
        minhChungId: string;
        tenNguoiCham: string;
        donViNguoiCham?: string | null;
        diem: number | string;
        nhanXet?: string | null;
        createdAt: string;
      }>;
    }>;
  }>;
  quyetDinhs?: Array<{
    id: string;
    soQuyetDinh: string;
    ngayQuyetDinh: string;
    loai: string;
  }>;
}

/**
 * Ánh xạ danh sách tiến trình từ BackendNcsDetailRaw sang MilestoneProgressItem[] đầy đủ dữ liệu thực tế
 */
export function mapBackendNcsDetailToMilestones(
  raw: BackendNcsDetailRaw
): MilestoneProgressItem[] {
  const tienTrinhs = raw.tienTrinhs || [];
  const sortedTienTrinhs = [...tienTrinhs].sort((a, b) => {
    const thuTuA = a.moc?.thuTu ?? a.mocId ?? 0;
    const thuTuB = b.moc?.thuTu ?? b.mocId ?? 0;
    return thuTuA - thuTuB;
  });

  return sortedTienTrinhs.map((tt) => {
    const thuTu = tt.moc?.thuTu ?? tt.mocId;
    const tenMoc = tt.moc?.tenMoc ?? `Mốc ${thuTu}`;
    const rawMinhChungs = tt.minhChungs || [];

    // Sắp xếp tăng dần theo lần nộp để theo dõi lịch sử
    const sortedMinhChungs = [...rawMinhChungs].sort((a, b) => a.lanNop - b.lanNop);

    const lichSuMinhChung: EvidenceItem[] = sortedMinhChungs.map((mc) => {
      const diemTrungBinh =
        mc.diemTrungBinh !== null && mc.diemTrungBinh !== undefined
          ? Number(mc.diemTrungBinh)
          : undefined;

      return {
        id: mc.id,
        lanNop: mc.lanNop,
        fileId: mc.fileId,
        fileName: `Minh_chung_moc_${thuTu}_lan_${mc.lanNop}.pdf`,
        fileUrl: mc.fileId ? `/api/v1/documents/${mc.fileId}/download` : undefined,
        ghiChuNcs: mc.ghiChuNcs ?? undefined,
        trangThai: (mc.trangThai as EvidenceStatus) || "PENDING_REVIEW",
        ngayNop: mc.ngayNop,
        ngayDuyet: mc.ngayDuyet ?? undefined,
        nguoiDuyet: mc.nguoiDuyetId ?? undefined,
        diemTrungBinh,
        lyDoTuChoi: mc.lyDoTuChoi ?? undefined,
      };
    });

    // Lần nộp mới nhất
    const minhChungHienTai =
      lichSuMinhChung.length > 0 ? lichSuMinhChung[lichSuMinhChung.length - 1] : undefined;

    // Lần nộp gần nhất có điểm chấm
    const latestScored = [...lichSuMinhChung]
      .reverse()
      .find((mc) => mc.diemTrungBinh !== undefined);

    // Phiếu nhận xét lấy từ lần nộp có phiếu nhận xét
    const mcWithReviews = [...rawMinhChungs]
      .sort((a, b) => b.lanNop - a.lanNop)
      .find((mc) => mc.phieuNhanXets && mc.phieuNhanXets.length > 0);

    const phieuNhanXets: PhieuNhanXetItem[] = (mcWithReviews?.phieuNhanXets || []).map((pnx) => ({
      id: pnx.id,
      tenNguoiCham: pnx.tenNguoiCham,
      chucDanh: pnx.donViNguoiCham || "Thành viên Hội đồng",
      diem: Number(pnx.diem),
      fileName: `Phieu_nhan_xet_${pnx.tenNguoiCham.replace(/\s+/g, "_")}.pdf`,
      ngayDanhGia: pnx.createdAt,
      nhanXet: pnx.nhanXet ?? undefined,
    }));

    // Lý do từ chối nếu có lần nộp bị từ chối
    const rejectedMc = [...lichSuMinhChung]
      .reverse()
      .find((mc) => mc.trangThai === "REJECTED" && mc.lyDoTuChoi);
    const lyDoTuChoi = rejectedMc?.lyDoTuChoi;

    return {
      id: tt.id,
      thuTu,
      tenMoc,
      moTa: tt.moc?.moTa ?? undefined,
      yeuCauDiem: Boolean(tt.moc?.yeuCauDiem),
      diemTrungBinh: latestScored?.diemTrungBinh ?? minhChungHienTai?.diemTrungBinh,
      trangThai: (tt.trangThai as MilestoneStatus) || "LOCKED",
      coTheNop: false,
      ngayMoKhoa: tt.openedAt ?? undefined,
      ngayHoanThanh: tt.passedAt ?? undefined,
      lyDoTuChoi,
      minhChungHienTai,
      lichSuMinhChung,
      phieuNhanXets: phieuNhanXets.length > 0 ? phieuNhanXets : undefined,
    };
  });
}

/**
 * Hợp nhất thông tin chi tiết từ GET /gvhd/me/ncs/:ncsId vào SupervisedStudent
 */
export function mapBackendNcsDetailToSupervisedStudent(
  raw: BackendNcsDetailRaw,
  baseStudent?: SupervisedStudent | null
): SupervisedStudent {
  const milestones = mapBackendNcsDetailToMilestones(raw);
  const tongSoMoc = milestones.length;
  const soMocHoanThanh = milestones.filter((m) => m.trangThai === "PASSED").length;
  const tienDoPhanTram = tongSoMoc > 0 ? Math.round((soMocHoanThanh / tongSoMoc) * 100) : 0;

  let mocHienTai = 0;
  let tenMocHienTai = "Chưa có tiến trình mốc";
  if (tongSoMoc > 0) {
    const currentMilestone =
      milestones.find((m) => m.trangThai !== "PASSED") || milestones[milestones.length - 1];
    mocHienTai = currentMilestone?.thuTu ?? 1;
    tenMocHienTai = currentMilestone?.tenMoc ?? `Mốc ${mocHienTai}`;
  }

  const rejectedMilestone = milestones.find((m) => m.trangThai === "REJECTED");
  const coMocCanHoanThien = Boolean(rejectedMilestone);
  const thongTinMocTuChoi: SupervisedStudentRejectedInfo | undefined = rejectedMilestone
    ? {
        mocSo: rejectedMilestone.thuTu,
        tenMoc: rejectedMilestone.tenMoc,
        lyDoTuChoi: rejectedMilestone.lyDoTuChoi,
      }
    : undefined;

  let trangThaiHocTap: SupervisedStudentStatus = baseStudent?.trangThaiHocTap || "DANG_THUC_HIEN";
  if (raw.trangThai === "DA_TOT_NGHIEP") {
    trangThaiHocTap = "TOT_NGHIEP";
  } else if (
    raw.trangThai === "BAO_LUU" ||
    raw.trangThai === "NGUNG_HOC" ||
    raw.trangThai === "BUOC_THOI_HOC"
  ) {
    trangThaiHocTap = "TAM_DUNG";
  } else if (coMocCanHoanThien) {
    trangThaiHocTap = "CAN_HOAN_THIEN";
  } else if (milestones.some((m) => m.trangThai === "PENDING_REVIEW")) {
    trangThaiHocTap = "CHO_DUYET";
  } else {
    trangThaiHocTap = "DANG_THUC_HIEN";
  }

  let targetDateStr: string | null = null;
  if (raw.trangThai === "GIA_HAN" && raw.hanGiaHan) {
    targetDateStr = raw.hanGiaHan;
  } else if (raw.hanChinhQuy) {
    targetDateStr = raw.hanChinhQuy;
  }
  const deadlineInfo = computeNcsDeadline(targetDateStr);

  const activeTopic = raw.deTais?.find((d) => d.trangThai === "DANG_THUC_HIEN") || raw.deTais?.[0];
  const tenDeTai = activeTopic?.tenDeTai || baseStudent?.tenDeTai || "Chưa giao đề tài chính thức";

  const coAssign = raw.phanCongs?.find(
    (p) => p.vaiTro === "DONG_HUONG_DAN" && p.trangThai === "DANG_HIEU_LUC"
  );
  const gvhdDongHuongDan = coAssign?.gvhd?.hoTen
    ? formatSupervisorDisplayName(coAssign.gvhd.hoTen, coAssign.gvhd.hocHamHocVi || undefined)
    : baseStudent?.gvhdDongHuongDan;

  const myAssign = raw.phanCongs?.find((p) => p.trangThai === "DANG_HIEU_LUC");
  const soQuyetDinhPhanCong =
    myAssign?.quyetDinh?.soQuyetDinh || baseStudent?.soQuyetDinhPhanCong || "Theo QĐ phân công";
  const ngayPhanCong =
    myAssign?.quyetDinh?.ngayQuyetDinh || myAssign?.ngayBatDau || baseStudent?.ngayPhanCong || "";

  return {
    id: raw.id,
    mshv: raw.mshv || baseStudent?.mshv || "N/A",
    hoTen: raw.hoTen || baseStudent?.hoTen || "Chưa cập nhật tên NCS",
    lop: raw.lop || baseStudent?.lop || "Chưa xếp lớp",
    nganh: raw.nganh?.tenNganh || baseStudent?.nganh || "Chưa cập nhật ngành",
    chuyenNganh: raw.nganh?.tenNganh || baseStudent?.chuyenNganh || "Sau Đại học",
    khoaDaoTao: raw.khoaHoc || baseStudent?.khoaDaoTao || "Chưa cập nhật khóa",
    tenDeTai,
    trangThaiHocTap,
    mocHienTai,
    tenMocHienTai,
    soMocHoanThanh,
    tongSoMoc,
    tienDoPhanTram,
    vaiTro:
      baseStudent?.vaiTro ||
      (myAssign?.vaiTro === "DONG_HUONG_DAN" ? "DONG_HUONG_DAN" : "HUONG_DAN_CHINH"),
    trongSo: baseStudent?.trongSo ?? (myAssign?.vaiTro === "DONG_HUONG_DAN" ? 0.5 : 1.0),
    gvhdDongHuongDan,
    soQuyetDinhPhanCong,
    ngayPhanCong,
    ngayNhapHoc: raw.ngayNhapHoc || baseStudent?.ngayNhapHoc || "",
    soThangConLai: deadlineInfo.soThangConLai,
    soNgayConLai: deadlineInfo.soNgayConLai,
    daHetHan: deadlineInfo.daHetHan,
    hanDaoTao: deadlineInfo.hanDaoTao,
    coMocCanHoanThien,
    thongTinMocTuChoi,
    milestones,
  };
}

/**
 * Service kết nối API Phân hệ Quản lý Giảng viên Hướng dẫn & Hạn ngạch (BR-09).
 * Gọi qua apiClient (tự động đính kèm Bearer Token từ NextAuth session).
 */
export const GvhdService = {
  /**
   * 1. Lấy danh sách toàn bộ GVHD kèm định mức & danh sách NCS đang hướng dẫn
   * Kết hợp GET /gvhd và GET /gvhd/assignments?trangThai=DANG_HIEU_LUC
   */
  getAllSupervisors: async (): Promise<SupervisorQuotaRecord[]> => {
    const [gvhdRes, assignmentsRes] = await Promise.all([
      apiClient.get<BackendGvhdRaw[]>("/gvhd"),
      apiClient
        .get<BackendAssignmentRaw[]>("/gvhd/assignments", {
          params: { trangThai: "DANG_HIEU_LUC" },
        })
        .catch(() => ({ data: [] as BackendAssignmentRaw[] })),
    ]);

    const gvhdList = unwrapArrayResponse<BackendGvhdRaw>(gvhdRes.data);
    const assignments = unwrapArrayResponse<BackendAssignmentRaw>(assignmentsRes.data);

    return gvhdList.map((raw) => mapBackendGvhdToSupervisorQuota(raw, assignments));
  },

  /**
   * 2. Lấy chi tiết 1 GVHD (bao gồm danh sách phân công hiệu lực)
   * Endpoint: GET /gvhd/:id
   */
  getSupervisorById: async (id: string): Promise<BackendGvhdRaw> => {
    try {
      const response = await apiClient.get<BackendGvhdRaw>(`/gvhd/${id}`);
      return response.data;
    } catch (error) {
      throwApiError(error);
    }
  },

  /**
   * 3. Lấy danh sách phân công GVHD (lọc theo NCS, GVHD, trạng thái)
   * Endpoint: GET /gvhd/assignments
   */
  getAssignments: async (params?: {
    ncsId?: string;
    gvhdId?: string;
    trangThai?: string;
  }): Promise<BackendAssignmentRaw[]> => {
    const response = await apiClient.get<BackendAssignmentRaw[]>("/gvhd/assignments", {
      params,
    });
    return unwrapArrayResponse<BackendAssignmentRaw>(response.data);
  },

  /**
   * 4. Tạo phân công GVHD mới cho NCS
   * Endpoint: POST /gvhd/assignments
   */
  createAssignment: async (
    payload: CreateAssignmentPayload
  ): Promise<BackendAssignmentRaw> => {
    const response = await apiClient.post<BackendAssignmentRaw>(
      "/gvhd/assignments",
      payload
    );
    return response.data;
  },

  /**
   * 5. Hủy phân công GVHD (hoàn trả định mức cho GVHD)
   * Endpoint: PATCH /gvhd/assignments/:id/deactivate
   */
  deactivateAssignment: async (
    id: string,
    lyDo: string
  ): Promise<BackendAssignmentRaw> => {
    const response = await apiClient.patch<BackendAssignmentRaw>(
      `/gvhd/assignments/${id}/deactivate`,
      { lyDo }
    );
    return response.data;
  },

  /**
   * 6. Lấy danh sách Quyết định phân công GVHD đang hiệu lực (loai = PHAN_CONG_GVHD)
   * Endpoint: GET /decisions
   */
  getAssignmentDecisions: async (
    ncsId?: string
  ): Promise<BackendAssignmentDecisionRaw[]> => {
    const response = await apiClient.get<BackendAssignmentDecisionRaw[]>("/decisions", {
      params: {
        loai: "PHAN_CONG_GVHD",
        trangThai: "HIEU_LUC",
        ...(ncsId ? { ncsId } : {}),
      },
    });
    return unwrapArrayResponse<BackendAssignmentDecisionRaw>(response.data);
  },

  /**
   * 7. Tải file Excel mẫu import GVHD
   * Endpoint: GET /gvhd/import/template
   */
  downloadImportTemplate: async (): Promise<Blob> => {
    const response = await apiClient.get("/gvhd/import/template", {
      responseType: "blob",
    });
    return response.data;
  },

  /**
   * 8. Upload file Excel xem trước dữ liệu GVHD
   * Endpoint: POST /gvhd/import/preview
   */
  previewImportExcel: async (file: File): Promise<Record<string, unknown>> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await apiClient.post<Record<string, unknown>>(
      "/gvhd/import/preview",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  },

  /**
   * 9. Xác nhận nạp file Excel GVHD vào cơ sở dữ liệu
   * Endpoint: POST /gvhd/import/confirm
   */
  confirmImportExcel: async (file: File): Promise<Record<string, unknown>> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await apiClient.post<Record<string, unknown>>(
      "/gvhd/import/confirm",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  },

  /**
   * 10. NCS xem danh sách GVHD đang hướng dẫn mình
   * Endpoint: GET /gvhd/my-supervisors
   */
  getMySupervisors: async (): Promise<BackendMySupervisorRaw[]> => {
    try {
      const response = await apiClient.get<BackendMySupervisorRaw[]>(
        "/gvhd/my-supervisors"
      );
      return unwrapArrayResponse<BackendMySupervisorRaw>(response.data);
    } catch (error) {
      throwApiError(error);
    }
  },

  /**
   * 11. GVHD xem thông tin hồ sơ của chính mình
   * Endpoint: GET /gvhd/me
   */
  getMyProfile: async (): Promise<BackendGvhdRaw> => {
    try {
      const response = await apiClient.get<BackendGvhdRaw>("/gvhd/me");
      return response.data;
    } catch (error) {
      throwApiError(error);
    }
  },

  /**
   * 12. GVHD xem danh sách NCS đang hướng dẫn của chính mình
   * Endpoint: GET /gvhd/me/ncs
   */
  getMyNcsList: async (): Promise<BackendSupervisorNcsRaw[]> => {
    try {
      const response = await apiClient.get<BackendSupervisorNcsRaw[]>("/gvhd/me/ncs");
      return unwrapArrayResponse<BackendSupervisorNcsRaw>(response.data);
    } catch (error) {
      throwApiError(error);
    }
  },

  /**
   * 13. GVHD xem chi tiết tiến trình 9 mốc & lịch sử đào tạo của NCS
   * Endpoint: GET /gvhd/me/ncs/:ncsId
   */
  getMyNcsDetail: async (ncsId: string): Promise<BackendNcsDetailRaw> => {
    try {
      const response = await apiClient.get<BackendNcsDetailRaw>(
        `/gvhd/me/ncs/${encodeURIComponent(ncsId)}`
      );
      return response.data;
    } catch (error) {
      throwApiError(error);
    }
  },
};
