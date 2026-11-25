import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FAQ_ITEMS } from "@/src/components/shared/FaqContactView";
import { PostgraduateContactDetails } from "@/src/components/shared/PostgraduateContactDetails";

export function HomeFaqSection() {
  return (
    <section id="faq" aria-labelledby="home-faq-heading" className="scroll-mt-24 space-y-6 pt-4">
      <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-slate-200 pb-4">
        <h2 id="home-faq-heading" className="text-xl font-black tracking-tight text-[#0F2744] sm:text-2xl">
          Hỏi đáp &amp; Thông tin liên hệ
        </h2>
        <Link href="/contact" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#164E9B] hover:underline">
          Trang liên hệ
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="space-y-3">
          {FAQ_ITEMS.slice(0, 3).map(({ question, answer }) => (
            <div key={question} className="space-y-1.5 rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
              <h3 className="text-sm font-bold text-slate-900">{question}</h3>
              <p className="text-sm leading-relaxed text-slate-600">{answer}</p>
            </div>
          ))}
        </div>

        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600 shadow-xs">
          <h3 className="border-b border-slate-100 pb-3 text-sm font-bold text-slate-900">
            Phòng Đào tạo Sau Đại học
          </h3>
          <PostgraduateContactDetails />
        </div>
      </div>
    </section>
  );
}
