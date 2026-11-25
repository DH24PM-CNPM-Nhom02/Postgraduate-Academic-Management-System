import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AuthPageShell } from "@/src/components/auth/auth-page-shell";

export const metadata: Metadata = {
  title: "Chính sách bảo mật | Cổng Thông tin Đào tạo Sau Đại học",
  description: "Cách Cổng Thông tin Đào tạo Sau Đại học sử dụng và bảo vệ thông tin cá nhân.",
};

const privacySections = [
  {
    title: "Thông tin hệ thống xử lý",
    body: "Hệ thống xử lý thông tin tài khoản và liên hệ, hồ sơ nghiên cứu sinh và giảng viên hướng dẫn, đề tài, tiến độ đào tạo, minh chứng và đơn đề nghị. Khi bạn yêu cầu đặt lại mật khẩu, hệ thống ghi nhận thông tin bạn cung cấp để xác minh tài khoản và xử lý yêu cầu.",
  },
  {
    title: "Mục đích sử dụng",
    body: "Thông tin được sử dụng để xác thực người dùng, cấp quyền, quản lý hồ sơ và quá trình đào tạo, xét duyệt minh chứng, xử lý đơn đề nghị, hỗ trợ tài khoản và theo dõi hoạt động quản trị.",
  },
  {
    title: "Quyền truy cập hồ sơ",
    body: "Quyền xem và xử lý hồ sơ phụ thuộc vào vai trò và phạm vi được phân công. Nghiên cứu sinh truy cập hồ sơ của mình, giảng viên hướng dẫn truy cập hồ sơ liên quan đến phân công, còn Giáo vụ và Quản trị viên truy cập theo quyền được cấp để thực hiện nhiệm vụ. Các biểu mẫu và quy chế được công bố có thể xem trước khi đăng nhập.",
  },
  {
    title: "Bảo mật tài khoản và cookie",
    body: "Mật khẩu được lưu dưới dạng giá trị băm. Hệ thống sử dụng cookie để duy trì phiên đăng nhập. Hãy giữ kín thông tin đăng nhập, đăng xuất khi dùng thiết bị chung và liên hệ Phòng Đào tạo Sau Đại học nếu nghi ngờ tài khoản bị truy cập trái phép.",
  },
  {
    title: "Lưu giữ thông tin",
    body: "Thông tin được lưu phục vụ quản lý học vụ, xử lý yêu cầu và lưu trữ hồ sơ đào tạo. Thời gian lưu giữ phụ thuộc vào loại hồ sơ và quy định lưu trữ áp dụng của Nhà trường.",
  },
];

export default function PrivacyPage() {
  return (
    <AuthPageShell contentPage>
      <article className="mx-auto max-w-3xl space-y-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
        <header className="space-y-3 border-b border-slate-100 pb-4">
          <Link href="/login" className="inline-flex items-center gap-2 text-sm font-semibold text-[#164E9B] hover:underline">
            <ArrowLeft className="size-4" aria-hidden="true" />
            Quay về đăng nhập
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-[#0F2744] sm:text-3xl">Chính sách bảo mật</h1>
          <p className="text-sm leading-relaxed text-slate-600">
            Chính sách áp dụng cho Cổng Thông tin Đào tạo Sau Đại học của Trường Đại học An Giang, Đại học Quốc gia TP. Hồ Chí Minh.
          </p>
        </header>
        {privacySections.map(({ title, body }) => (
          <section key={title} className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">{title}</h2>
            <p className="text-sm leading-relaxed text-slate-600">{body}</p>
          </section>
        ))}
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">Kiểm tra, chỉnh sửa và yêu cầu hỗ trợ</h2>
          <p className="text-sm leading-relaxed text-slate-600">
            Bạn có thể kiểm tra và cập nhật các trường được phép chỉnh sửa trong hồ sơ cá nhân. Nếu cần điều chỉnh thông tin học vụ, yêu cầu hỗ trợ về dữ liệu cá nhân hoặc phản ánh sự cố bảo mật, hãy liên hệ Phòng Đào tạo Sau Đại học.
          </p>
          <Link href="/contact" className="inline-block text-sm font-semibold text-[#164E9B] hover:underline">
            Xem thông tin liên hệ
          </Link>
        </section>
      </article>
    </AuthPageShell>
  );
}
