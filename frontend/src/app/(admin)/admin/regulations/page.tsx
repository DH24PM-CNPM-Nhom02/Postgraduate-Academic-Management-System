import { RegulationsView } from "@/src/components/shared";

export const metadata = {
  title: "Quy chế & Quy định Đào tạo SĐH | Cổng Quản trị Hệ thống",
  description: "Văn bản quy chế đào tạo tiến sĩ và định mức GVHD BR-09 ĐHQG-HCM.",
};

/**
 * Route: /admin/regulations
 * Tái sử dụng RegulationsView từ components/shared cho Admin.
 */
export default function AdminRegulationsPage() {
  return (
    <RegulationsView
      roleContext="academic"
      backHref="/admin/overview"
      backLabel="Tổng quan đào tạo"
    />
  );
}
