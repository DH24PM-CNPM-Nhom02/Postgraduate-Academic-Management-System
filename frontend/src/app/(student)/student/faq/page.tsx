import Link from "next/link";

export const metadata = {
  title: "Hỏi đáp & Liên hệ | Cổng Nghiên cứu sinh",
  description: "Hỏi đáp và liên hệ phòng Đào tạo Sau Đại học dành cho NCS.",
};

export default function StudentFaqPage() {
  return (
    <section className="space-y-5 pb-8">
      <Link href="/student/progress" className="text-sm font-medium text-[#164E9B] hover:underline">Quay về Tiến độ đào tạo NCS</Link>
      <h1 className="text-2xl font-bold text-[#0F2744]">Hỏi đáp &amp; Liên hệ</h1>
      <p className="rounded-xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
        Chưa có dữ liệu hỏi đáp và hỗ trợ trực tuyến.
      </p>
      <p className="text-sm text-muted-foreground">
        Liên hệ Phòng Đào tạo Sau Đại học qua{" "}
        <a href="mailto:sdh@agu.edu.vn" className="font-medium text-[#164E9B] hover:underline">sdh@agu.edu.vn</a>.
      </p>
    </section>
  );
}
