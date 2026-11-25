import { FaqContactView } from "@/src/components/shared/FaqContactView";

export const metadata = {
  title: "Hỏi đáp & Liên hệ hỗ trợ | Cổng Quản trị Hệ thống",
  description: "Giải đáp thắc mắc và hỗ trợ kỹ thuật đào tạo sau đại học AGU.",
};

/**
 * Route: /admin/faq
 * Tái sử dụng FaqContactView từ components/shared cho Admin.
 */
export default function AdminFaqPage() {
  return <FaqContactView backHref="/admin/overview" backLabel="Tổng quan đào tạo" />;
}
