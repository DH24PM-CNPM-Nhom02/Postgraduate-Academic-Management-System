import { apiClient, throwApiError } from "@/src/lib/api";
import { DocumentService } from "@/src/services/document";
import { formatSupervisorDisplayName } from "@/src/services/gvhd";
import type { DocumentMetadataResponse } from "@/src/types/api/document";
import type {
  BackendNcsMeResponse,
  MilestoneEvidenceApi,
  MilestoneItemApi,
  MyProgressResponse,
  PendingReviewMilestone,
  EvaluationPayload,
  ReviewEvaluations,
  SubmitMilestoneRequest,
  SubmitMilestoneResponse,
  SubmitMilestoneWithFileVariables,
} from "@/src/types/api/progress";
import type {
  EvidenceItem,
  MilestoneProgressItem,
  PhieuNhanXetItem,
  StudentProgressData,
} from "@/src/types/ui/progress";

import { formatDate } from "@/src/lib/utils";

/** Định dạng chuỗi ngày YYYY-MM-DD hoặc ISO sang DD/MM/YYYY chuẩn giờ Việt Nam */
function formatDateShortVi(dateStr?: string | null): string | undefined {
  if (!dateStr) return undefined;
  const res = formatDate(dateStr);
  return res === "--/--/----" ? undefined : res;
}

/** Tính số tháng còn lại tính đến hạn tối đa (72 tháng) */
function computeRemainingMonths(deadlineStr?: string | null): number | undefined {
  if (!deadlineStr) return undefined;
  const target = new Date(deadlineStr);
  if (Number.isNaN(target.getTime())) return undefined;
  const diffDays = (target.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
  return Math.max(0, Math.round(diffDays / 30.44));
}

/** Chuyển đổi 1 lần nộp minh chứng Backend -> UI EvidenceItem */
function mapEvidenceApiToUi(
  ev: MilestoneEvidenceApi,
  docMeta?: DocumentMetadataResponse
): EvidenceItem {
  return {
    id: ev.id,
    lanNop: ev.lanNop,
    fileId: ev.fileId,
    fileName: docMeta?.originalName ?? `Minh_chung_lan_${ev.lanNop}.pdf`,
    fileSize: docMeta?.size,
    ghiChuNcs: ev.ghiChuNcs ?? undefined,
    trangThai: ev.trangThai,
    ngayNop: ev.ngayNop,
    ngayDuyet: ev.ngayDuyet ?? undefined,
    diemTrungBinh:
      ev.diemTrungBinh !== null && ev.diemTrungBinh !== undefined
        ? Number(ev.diemTrungBinh)
        : undefined,
    lyDoTuChoi: ev.lyDoTuChoi ?? undefined,
  };
}

/** Tạo nhãn thời hạn hiển thị cho thẻ mốc từ dữ liệu DeadlineService */
function buildMilestoneDeadlineLabel(item: MilestoneItemApi): string | undefined {
  const formatted = formatDateShortVi(item.han?.hanHieuLuc);
  if (formatted) {
    return `Hạn: ${formatted}`;
  }
  if (item.moc.thuTu === 6) {
    return "Định kỳ tháng 6 & 12";
  }
  return undefined;
}

/** Tạo ghi chú hệ thống dễ hiểu cho từng mốc dựa trên trạng thái thật từ Backend */
function buildMilestoneSystemNote(item: MilestoneItemApi): string | undefined {
  if (item.moc.thuTu === 1 && item.trangThai === "PASSED") {
    return "Đã hoàn thành khi nhập học";
  }
  if (
    item.trangThai !== "PASSED" &&
    item.han?.tinhTrang === "QUA_HAN" &&
    typeof item.han.soNgayConLai === "number"
  ) {
    return `Đã quá hạn mốc ${Math.abs(item.han.soNgayConLai)} ngày (vẫn có thể nộp trong khung tối đa 72 tháng)`;
  }
  return undefined;
}

/**
 * Hàm thuần (pure mapper): ghép payload từ `GET /progress/me` + `GET /ncs/me` + metadata tài liệu
 * thành đúng cấu trúc `StudentProgressData` mà giao diện Tiến độ 9 mốc đang sử dụng.
 */
export function mapMyProgressToUi(
  progress: MyProgressResponse,
  ncsProfile?: BackendNcsMeResponse | null,
  documentMetaMap: Record<string, DocumentMetadataResponse> = {}
): StudentProgressData {
  const milestones: MilestoneProgressItem[] = [...progress.tienTrinhs]
    .sort((a, b) => a.moc.thuTu - b.moc.thuTu)
    .map((item) => {
      const history: EvidenceItem[] = [...item.minhChungs]
        .sort((a, b) => a.lanNop - b.lanNop)
        .map((ev) => mapEvidenceApiToUi(ev, documentMetaMap[ev.fileId]));

      const latestEvidence =
        history.length > 0 ? history[history.length - 1] : undefined;

      const latestScored = [...history]
        .reverse()
        .find((ev) => ev.diemTrungBinh !== undefined);

      const mcWithReviews = [...item.minhChungs]
        .sort((a, b) => b.lanNop - a.lanNop)
        .find((mc) => mc.phieuNhanXets?.length);

      const phieuNhanXets: PhieuNhanXetItem[] = (mcWithReviews?.phieuNhanXets ?? []).map((pnx) => ({
        id: pnx.id,
        tenNguoiCham: pnx.tenNguoiCham,
        chucDanh: pnx.donViNguoiCham || "Thành viên Hội đồng",
        diem: Number(pnx.diem),
        fileId: pnx.fileId ?? null,
        fileName: `Phieu_nhan_xet_${pnx.tenNguoiCham?.replace(/\s+/g, "_") || "nguoi_cham"}.pdf`,
        ngayDanhGia: formatDateShortVi(pnx.createdAt),
        nhanXet: pnx.nhanXet ?? undefined,
      }));

      return {
        id: item.id,
        thuTu: item.moc.thuTu,
        tenMoc: item.moc.tenMoc,
        moTa: item.moc.moTa ?? undefined,
        thoiGianDuKien: buildMilestoneDeadlineLabel(item),
        yeuCauDiem: item.moc.yeuCauDiem,
        diemTrungBinh: latestScored?.diemTrungBinh,
        trangThai: item.trangThai,
        coTheNop: item.coTheNop,
        ngayMoKhoa: item.openedAt ?? undefined,
        ngayHoanThanh: item.passedAt ?? undefined,
        lyDoTuChoi:
          item.trangThai === "REJECTED"
            ? latestEvidence?.lyDoTuChoi
            : undefined,
        ghiChuHeThong: buildMilestoneSystemNote(item),
        minhChungHienTai: latestEvidence,
        lichSuMinhChung: history,
        phieuNhanXets,
      };
    });

  // Trích thông tin GVHD chính & Đồng hướng dẫn từ hồ sơ NCS
  const phanCongs = ncsProfile?.phanCongs ?? [];
  const mainSupervisor = phanCongs.find(
    (pc) => pc.vaiTro === "HUONG_DAN_CHINH"
  );
  const coSupervisors = phanCongs.filter(
    (pc) => pc.vaiTro === "DONG_HUONG_DAN"
  );

  const gvhdMainName = mainSupervisor?.gvhd
    ? formatSupervisorDisplayName(
        mainSupervisor.gvhd.hoTen,
        mainSupervisor.gvhd.hocHamHocVi
      )
    : "Chưa phân công GVHD";

  const gvhdCoNames =
    coSupervisors.length > 0
      ? coSupervisors
          .map((pc) =>
            formatSupervisorDisplayName(pc.gvhd.hoTen, pc.gvhd.hocHamHocVi)
          )
          .join(", ")
      : undefined;

  const thoiHanToiDa =
    progress.hanCuaNcs?.hanBuocThoiHoc ?? ncsProfile?.hanBuocThoiHoc ?? "";

  const tongSoMoc = milestones.length;
  const soMocHoanThanh = milestones.filter(
    (m) => m.trangThai === "PASSED"
  ).length;
  const activeMilestone =
    milestones.find((m) => m.trangThai === "REJECTED") ??
    milestones.find((m) => m.trangThai === "PENDING_REVIEW") ??
    milestones.find((m) => m.trangThai === "UNLOCKED") ??
    milestones[milestones.length - 1];

  const maKhoaHoc =
    ncsProfile?.khoaHocNcs?.maKhoaHoc ?? ncsProfile?.khoaHoc ?? undefined;
  const namTuyenSinh =
    ncsProfile?.khoaHocNcs?.namTuyenSinh ?? undefined;

  // Chuỗi hiển thị niên khóa: e.g. "Niên khóa: NCS01 - 2025"
  const nienKhoa =
    maKhoaHoc && namTuyenSinh
      ? `Niên khóa: ${maKhoaHoc} - ${namTuyenSinh}`
      : maKhoaHoc
        ? `Niên khóa: ${maKhoaHoc}`
        : undefined;

  return {
    ncs: {
      id: progress.ncs.id,
      mshv: progress.ncs.mshv,
      hoTen: progress.ncs.hoTen,
      lop: progress.ncs.lop ?? ncsProfile?.lop ?? "Chưa cập nhật",
      trangThaiHocTap: progress.ncs.trangThai ?? ncsProfile?.trangThai,
      khoaHoc: maKhoaHoc,
      maKhoaHoc,
      namTuyenSinh,
      nienKhoa,
      nganh: ncsProfile?.nganh?.tenNganh ?? "Đang cập nhật",
      khoaVi: "Đào tạo Sau đại học - AGU",
      gvhd: gvhdMainName,
      gvhdDongHuongDan: gvhdCoNames,
      ngayNhapHoc: ncsProfile?.ngayNhapHoc ?? "",
      thoiHanToiDa,
      soThangConLai: computeRemainingMonths(thoiHanToiDa),
    },
    tongSoMoc,
    soMocHoanThanh,
    mocHienTai: activeMilestone?.thuTu ?? 1,
    milestones,
  };
}

async function progressRequest<T>(request: Promise<{ data: T }>): Promise<T> {
  try {
    return (await request).data;
  } catch (error) {
    throwApiError(error);
  }
}

/**
 * ProgressService
 *
 * Service gọi Backend cho phân hệ Tiến trình 9 mốc của NCS (`ProgressController`).
 */
export const ProgressService = {
  listPendingReviews: (signal: AbortSignal, thuTu?: number) =>
    progressRequest(apiClient.get<PendingReviewMilestone[]>("/progress/pending", {
      params: { thuTu },
      signal,
      timeout: 15_000,
    })),

  getNcsProgress: (ncsId: string, signal: AbortSignal) =>
    progressRequest(apiClient.get<MyProgressResponse>(`/progress/ncs/${ncsId}`, { signal, timeout: 15_000 })),

  listEvaluations: (evidenceId: string, signal: AbortSignal) =>
    progressRequest(apiClient.get<ReviewEvaluations>(`/progress/evidences/${evidenceId}/evaluations`, { signal, timeout: 15_000 })),

  saveEvaluation: (evidenceId: string, payload: EvaluationPayload, evaluationId?: string) => {
    const endpoint = `/progress/evidences/${evidenceId}/evaluations`;
    return progressRequest(evaluationId
      ? apiClient.patch(`${endpoint}/${evaluationId}`, payload)
      : apiClient.post(endpoint, payload));
  },

  deleteEvaluation: (evidenceId: string, evaluationId: string) =>
    progressRequest(apiClient.delete(`/progress/evidences/${evidenceId}/evaluations/${evaluationId}`)),

  reviewMilestone: (id: string, review: { quyetDinhId: string } | { lyDo: string }) => {
    const action = "quyetDinhId" in review ? "approve" : "reject";
    return progressRequest(apiClient.post(`/progress/reviews/${id}/${action}`, review));
  },


  /**
   * 1. Lấy lộ trình 9 mốc, thời hạn hiệu lực và lịch sử minh chứng của NCS đang đăng nhập
   * Endpoint: GET /progress/me
   */
  getMyProgress: async (): Promise<MyProgressResponse> => {
    try {
      const response = await apiClient.get<MyProgressResponse>("/progress/me");
      return response.data;
    } catch (error) {
      throwApiError(error);
    }
  },

  /**
   * 2. Nộp minh chứng cho mốc thứ `thuTu` bằng `fileId` đã upload trước đó
   * Endpoint: POST /progress/milestones/:thuTu/submit
   */
  submitMilestone: async (
    thuTu: number,
    payload: SubmitMilestoneRequest
  ): Promise<SubmitMilestoneResponse> => {
    try {
      const trimmedNote = payload.ghiChu?.trim();
      const body: SubmitMilestoneRequest = {
        fileId: payload.fileId,
        ...(trimmedNote ? { ghiChu: trimmedNote } : {}),
      };

      const response = await apiClient.post<SubmitMilestoneResponse>(
        `/progress/milestones/${thuTu}/submit`,
        body
      );
      return response.data;
    } catch (error) {
      throwApiError(error);
    }
  },

  /**
   * 3. Quy trình 2 bước trọn gói dành cho màn hình nộp minh chứng:
   *    Bước 1: Upload file PDF (`MINH_CHUNG_MOC`) -> lấy `fileId`
   *    Bước 2: Gọi nộp mốc `POST /progress/milestones/:thuTu/submit`
   */
  submitMilestoneWithFile: async ({
    thuTu,
    file,
    ghiChu,
    onUploadProgress,
  }: SubmitMilestoneWithFileVariables): Promise<SubmitMilestoneResponse> => {
    const uploadedDoc = await DocumentService.uploadPdf({
      file,
      documentType: "MINH_CHUNG_MOC",
      onUploadProgress,
    });

    return ProgressService.submitMilestone(thuTu, {
      fileId: uploadedDoc.id,
      ghiChu,
    });
  },
};
