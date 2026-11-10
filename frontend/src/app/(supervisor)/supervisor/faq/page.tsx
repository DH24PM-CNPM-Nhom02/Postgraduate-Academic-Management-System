import { FaqContactView } from "@/src/components/shared";

export const metadata = {
  title: "Hỏi đáp & Liên hệ | Cổng Giảng viên Hướng dẫn",
  description: "Hỏi đáp và liên hệ phòng Đào tạo Sau Đại học dành cho GVHD.",
};

export default function SupervisorFaqPage() {
  return (
    <FaqContactView
      roleContext="supervisor"
      backHref="/supervisor/dashboard"
      backLabel="Bàn làm việc GVHD"
    />
  );
}
