import { apiClient } from "../lib/api/axios";
import type { StudentDossier } from "@/src/types/academic";

/**
 * Hàm chuyển đổi dữ liệu thô từ Backend sang cấu trúc hiển thị giao diện Frontend (StudentDossier).
 * Giúp giao diện luôn hiển thị mượt mà kể cả khi cấu trúc database dùng tiếng Việt (hoTen, mshv...).
 */
export function mapBackendNcsToStudentDossier(raw: any): StudentDossier {
  // Nếu dữ liệu đã chuẩn cấu trúc StudentDossier sẵn
  if (raw.name && raw.code) {
    return raw as StudentDossier;
  }

  // 1. Tính số tháng đào tạo còn lại dựa vào hạn chính quy hoặc hạn gia hạn
  const targetDeadline = raw.hanGiaHan
    ? new Date(raw.hanGiaHan)
    : raw.hanChinhQuy
    ? new Date(raw.hanChinhQuy)
    : null;

  let remainingMonths = 36;
  if (targetDeadline && !isNaN(targetDeadline.getTime())) {
    const diffMs = targetDeadline.getTime() - Date.now();
    remainingMonths = Math.max(0, Math.round(diffMs / (1000 * 60 * 60 * 24 * 30.44)));
  }

  // 2. Chuyển đổi trạng thái từ Backend sang StudentStatus ("active" | "warning" | "overdue")
  let status: StudentDossier["status"] = "active";
  if (raw.trangThai === "BUOC_THOI_HOC" || raw.trangThai === "NGUNG_HOC" || remainingMonths < 3) {
    status = "overdue";
  } else if (raw.trangThai === "BAO_LUU" || remainingMonths < 12) {
    status = "warning";
  } else {
    status = "active";
  }

  // 3. Tính mốc tiến trình hiện tại (dựa vào danh sách tiến trình đã hoàn thành)
  let currentMilestoneIndex = 1;
  if (Array.isArray(raw.tienTrinhs) && raw.tienTrinhs.length > 0) {
    const passedCount = raw.tienTrinhs.filter((t: any) => t.trangThai === "PASSED").length;
    currentMilestoneIndex = Math.min(9, Math.max(1, passedCount + 1));
  }

  return {
    id: raw.id || `std-${raw.mshv || Date.now()}`,
    name: raw.hoTen || raw.name || "Chưa cập nhật tên",
    code: raw.mshv || raw.code || "N/A",
    cohort: raw.khoaHocNcs?.maKhoaHoc || raw.lop || "Khóa 2023",
    department: raw.nganh?.tenNganh || "Kỹ thuật phần mềm",
    thesisTopic:
      raw.deTai ||
      raw.thesisTopic ||
      "Nghiên cứu kiến trúc vi dịch vụ trong quản lý đào tạo sau đại học",
    supervisorMain: raw.gvhd || raw.supervisorMain || "PGS.TS. Trần Văn Hùng",
    supervisorCo: raw.dongGvhd || raw.supervisorCo || undefined,
    remainingMonths,
    currentMilestoneIndex,
    publicationPoints: raw.diemBaiBao ?? raw.publicationPoints ?? 2.5,
    status,
    email: raw.email || `${raw.mshv?.toLowerCase() || "ncs"}@agu.edu.vn`,
    phone: raw.sdt || raw.phone || "0912345678",
  };
}

/**
 * Service kết nối toàn bộ API của Phân hệ Quản lý Nghiên cứu sinh (NCS).
 * Gọi qua apiClient (tự động đính kèm Token đăng nhập của Giáo vụ).
 */
export const NcsService = {
  /**
   * 1. Lấy danh sách toàn bộ Nghiên cứu sinh
   * Endpoint: GET /ncs
   */
  getAllStudents: async (): Promise<StudentDossier[]> => {
    const response = await apiClient.get("/ncs");
    const data = response.data;
    if (Array.isArray(data)) {
      return data.map(mapBackendNcsToStudentDossier);
    }
    return [];
  },

  /**
   * Hàm tương thích với code cũ đã gọi trước đây
   */
  getAllStudentsWithPagination: async (): Promise<StudentDossier[]> => {
    return NcsService.getAllStudents();
  },

  /**
   * 2. Lấy thông tin chi tiết của 1 NCS (kèm 9 mốc tiến trình & ngành học)
   * Endpoint: GET /ncs/:id
   */
  getStudentById: async (id: string): Promise<any> => {
    const response = await apiClient.get(`/ncs/${id}`);
    return response.data;
  },

  /**
   * 3. Cập nhật thông tin lý lịch NCS
   * Endpoint: PATCH /ncs/:id
   */
  updateStudent: async (id: string, data: any): Promise<any> => {
    const response = await apiClient.patch(`/ncs/${id}`, data);
    return response.data;
  },

  /**
   * 4. Cập nhật trạng thái học vụ (DANG_HOC, BAO_LUU, GIA_HAN, BUOC_THOI_HOC...)
   * Endpoint: PATCH /ncs/:id/status
   */
  updateStudentStatus: async (
    id: string,
    trangThai: string,
    lyDo?: string
  ): Promise<any> => {
    const response = await apiClient.patch(`/ncs/${id}/status`, { trangThai, lyDo });
    return response.data;
  },

  /**
   * 5. Tải file Excel mẫu import NCS
   * Endpoint: GET /ncs/import/template
   */
  downloadImportTemplate: async (): Promise<Blob> => {
    const response = await apiClient.get("/ncs/import/template", {
      responseType: "blob",
    });
    return response.data;
  },

  /**
   * 6. Upload file Excel để xem trước dữ liệu hợp lệ/lỗi (chưa lưu)
   * Endpoint: POST /ncs/import/preview
   */
  previewImportExcel: async (file: File): Promise<any> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await apiClient.post("/ncs/import/preview", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  /**
   * 7. Xác nhận nạp file Excel vào cơ sở dữ liệu thật
   * Endpoint: POST /ncs/import/confirm
   */
  confirmImportExcel: async (file: File): Promise<any> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await apiClient.post("/ncs/import/confirm", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
};
