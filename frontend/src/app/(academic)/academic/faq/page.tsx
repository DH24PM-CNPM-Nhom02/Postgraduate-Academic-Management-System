import { FaqContactView } from "@/src/components/shared";

export const metadata = {
  title: "Hỏi đáp & Liên hệ | Cổng Giáo vụ SĐH",
  description: "Giải đáp thắc mắc và hỗ trợ kỹ thuật đào tạo sau đại học AGU.",
};

export default function AcademicFaqPage() {
  return (
    <FaqContactView
      roleContext="academic"
      backHref="/academic"
      backLabel="Tổng quan học vụ"
    />
  );
}
