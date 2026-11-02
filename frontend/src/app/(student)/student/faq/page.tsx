import { FaqContactView } from "@/src/components/shared";

export const metadata = {
  title: "Hỏi đáp & Liên hệ | Cổng Nghiên cứu sinh",
  description: "Hỏi đáp và liên hệ phòng Đào tạo Sau Đại học dành cho NCS.",
};

export default function StudentFaqPage() {
  return (
    <FaqContactView
      roleContext="student"
      backHref="/student/progress"
      backLabel="Tiến độ đào tạo NCS"
    />
  );
}
