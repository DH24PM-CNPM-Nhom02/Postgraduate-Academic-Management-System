"use client";

import { EditableProfileFields } from "@/src/components/profile/editable-profile-fields";
import { formatProfileDate, formatProfileGender, ProfileDetails } from "@/src/components/profile/profile-details";
import { useUpdateMyNcsProfile } from "@/src/hooks/api/use-ncs";
import type { BackendNcsMeResponse } from "@/src/types/api/progress";

export type StudentProfileData = BackendNcsMeResponse;

const STATUS_LABELS: Record<string, string> = {
  DANG_HOC: "Đang học",
  DA_TOT_NGHIEP: "Đã tốt nghiệp",
  GIA_HAN: "Gia hạn",
  BAO_LUU: "Bảo lưu",
  NGUNG_HOC: "Ngừng học",
  BUOC_THOI_HOC: "Buộc thôi học",
};

const DEGREE_LABELS: Record<string, string> = { THAC_SI: "Thạc sĩ", DAI_HOC: "Đại học" };
const TRAINING_LABELS: Record<string, string> = {
  PHUONG_THUC_1: "Phương thức 1",
  PHUONG_THUC_2: "Phương thức 2",
};

export function GeneralInfoForm({ initialData: profile }: { initialData: StudentProfileData }) {
  const updateProfile = useUpdateMyNcsProfile();
  const readOnly = profile.trangThai === "DA_TOT_NGHIEP";

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-border bg-card p-6">
        <h3 className="mb-4 text-sm font-semibold text-foreground">Thông tin học tịch</h3>
        <ProfileDetails items={[
          { label: "Họ và tên", value: profile.hoTen },
          { label: "Mã nghiên cứu sinh", value: profile.mshv },
          { label: "Ngày sinh", value: formatProfileDate(profile.ngaySinh) },
          { label: "Giới tính", value: formatProfileGender(profile.gioiTinh) },
          { label: "CCCD / CMND", value: profile.cccd },
          { label: "Ngành đào tạo", value: profile.nganh?.tenNganh },
          { label: "Mã ngành", value: profile.nganh?.maNganh },
          { label: "Khóa tuyển sinh", value: profile.khoaHocNcs?.maKhoaHoc ?? profile.khoaHoc },
          { label: "Lớp", value: profile.lop },
          { label: "Ngày nhập học", value: formatProfileDate(profile.ngayNhapHoc) },
          { label: "Trình độ đầu vào", value: DEGREE_LABELS[profile.trinhDoDauVao] ?? profile.trinhDoDauVao },
          { label: "Phương thức đào tạo", value: TRAINING_LABELS[profile.phuongThucDaoTao] ?? profile.phuongThucDaoTao },
          { label: "Hạn đào tạo chính quy", value: formatProfileDate(profile.hanChinhQuy) },
          { label: "Hạn sau gia hạn", value: formatProfileDate(profile.hanGiaHan) },
          { label: "Hạn buộc thôi học", value: formatProfileDate(profile.hanBuocThoiHoc) },
          { label: "Trạng thái học tập", value: STATUS_LABELS[profile.trangThai] ?? profile.trangThai },
          ...(profile.ngayChuyenTrangThai ? [{ label: "Ngày hiệu lực trạng thái", value: formatProfileDate(profile.ngayChuyenTrangThai) }] : []),
          ...(profile.lyDoChuyenTrangThai ? [{ label: "Lý do thay đổi trạng thái", value: profile.lyDoChuyenTrangThai }] : []),
          { label: "Đề tài hiện hành", value: profile.thesisTopic },
          { label: "Người hướng dẫn chính", value: profile.supervisorMain },
          { label: "Người đồng hướng dẫn", value: profile.supervisorCo },
        ]} />
      </section>
      <section className="rounded-2xl border border-border bg-card p-6">
        <EditableProfileFields
          key={profile.id}
          variant="contact"
          values={profile}
          onSave={readOnly ? undefined : updateProfile.mutateAsync}
        />
        {readOnly && <p className="mt-3 text-sm text-muted-foreground">Hồ sơ NCS đã tốt nghiệp chỉ được xem.</p>}
      </section>
    </div>
  );
}
