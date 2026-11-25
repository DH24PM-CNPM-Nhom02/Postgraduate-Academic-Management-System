import Link from "next/link";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { PostgraduateContactDetails } from "./PostgraduateContactDetails";

export const FAQ_ITEMS = [
  {
    question: "Tôi quên mật khẩu thì làm thế nào?",
    answer: "Nghiên cứu sinh, Giảng viên hướng dẫn và Giáo vụ có thể gửi yêu cầu qua mục Quên mật khẩu trên trang đăng nhập. Giáo vụ xác minh yêu cầu của nghiên cứu sinh và giảng viên, còn Quản trị viên xử lý yêu cầu của Giáo vụ. Nếu quên mật khẩu tài khoản Quản trị viên, hãy liên hệ Phòng Đào tạo Sau Đại học để được hướng dẫn.",
  },
  {
    question: "Tôi tìm biểu mẫu và quy chế đào tạo ở đâu?",
    answer: "Mở Biểu mẫu hoặc Quy chế trên trang chủ, hoặc vào mục tương ứng trong cổng sau khi đăng nhập. Bạn có thể tìm theo tên tài liệu, xem nội dung PDF và tải tệp về.",
  },
  {
    question: "Nghiên cứu sinh xem tiến độ đào tạo và nộp minh chứng ở đâu?",
    answer: "Trong Cổng Nghiên cứu sinh, mở Tiến độ NCS rồi chọn mốc cần xem. Tại mốc đang mở, làm theo yêu cầu của mốc để nộp minh chứng và theo dõi kết quả xử lý.",
  },
  {
    question: "Nghiên cứu sinh gửi đơn gia hạn hoặc đổi đề tài, giảng viên hướng dẫn ở đâu?",
    answer: "Mở Đơn đề nghị & Gia hạn trong Cổng Nghiên cứu sinh, chọn đúng loại đề nghị, điền nội dung và đính kèm hồ sơ theo hướng dẫn. Theo dõi trạng thái xử lý ngay trong danh sách đơn.",
  },
  {
    question: "Giảng viên hướng dẫn theo dõi tiến độ của nghiên cứu sinh ở đâu?",
    answer: "Trong Cổng Giảng viên Hướng dẫn, mở Báo cáo tiến độ và chọn nghiên cứu sinh đang được phân công hướng dẫn để xem các mốc và minh chứng liên quan.",
  },
  {
    question: "Tôi cần cung cấp thông tin gì khi báo lỗi hệ thống?",
    answer: "Khi liên hệ Phòng Đào tạo Sau Đại học, hãy nêu vai trò, trang đang sử dụng, thời điểm xảy ra lỗi, thao tác đã thực hiện và thông báo lỗi. Hãy che thông tin cá nhân trên ảnh chụp và giữ kín mật khẩu, mã xác thực.",
  },
];

export function FaqContactView({ backHref, backLabel }: { backHref: string; backLabel: string }) {
  return (
    <div className="space-y-6 pb-8">
      <header className="space-y-2">
        <Link href={backHref} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#164E9B] hover:underline">
          <ArrowLeft className="size-4" aria-hidden="true" />
          {backLabel}
        </Link>
        <h1 className="text-xl font-black tracking-tight text-[#0F2744] sm:text-2xl">
          Hỏi đáp &amp; Hỗ trợ Kỹ thuật Đào tạo SĐH
        </h1>
      </header>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <section aria-labelledby="portal-faq-heading" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <h2 id="portal-faq-heading" className="mb-3 text-base font-bold text-slate-900">Câu hỏi thường gặp</h2>
          <div className="divide-y divide-slate-200">
            {FAQ_ITEMS.map(({ question, answer }) => (
              <details key={question} className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 py-3 text-sm font-semibold text-slate-900 hover:text-[#164E9B] [&::-webkit-details-marker]:hidden">
                  {question}
                  <ChevronDown className="size-4 shrink-0 text-[#164E9B] transition-transform group-open:rotate-180" aria-hidden="true" />
                </summary>
                <p className="pb-4 text-sm leading-relaxed text-slate-600">{answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section aria-labelledby="portal-contact-heading" className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600 shadow-xs">
          <h2 id="portal-contact-heading" className="border-b border-slate-100 pb-3 text-base font-bold text-slate-900">
            Phòng Đào tạo Sau Đại học
          </h2>
          <PostgraduateContactDetails />
        </section>
      </div>
    </div>
  );
}

export default FaqContactView;
