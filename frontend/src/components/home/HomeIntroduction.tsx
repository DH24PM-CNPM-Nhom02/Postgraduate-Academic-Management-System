import { GraduationCap, ShieldCheck, UserCheck } from "lucide-react";

export function HomeIntroduction() {
  return (
    <section className="text-center space-y-5 max-w-4xl mx-auto pt-4 sm:pt-6">
      <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 border border-blue-200 px-4 py-1 text-xs font-bold text-[#164E9B]">
        <ShieldCheck className="size-4" />
        <span>Hệ thống Quản lý Đào tạo Sau Đại học • AGU SRS v2.0 (ĐHQG-HCM)</span>
      </div>

      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F2744] tracking-tight leading-tight">
        Cổng Thông tin &amp; Quản trị Đào tạo Sau Đại học
      </h1>

      <p className="max-w-3xl mx-auto text-slate-600 text-sm sm:text-base leading-relaxed">
        Nền tảng số hóa toàn diện quy trình đào tạo Tiến sĩ tại Trường Đại học An Giang: Theo dõi 9 mốc đào tạo, xét duyệt minh chứng 2 cấp, kiểm soát tự động định mức hướng dẫn BR-09 và chuẩn đầu ra công bố khoa học quốc tế.
      </p>

      {/* 3 Portal Entry Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left pt-6">
        {/* Academic Staff Portal */}
        <div
          className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-[#164E9B] hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-blue-50 text-[#164E9B] group-hover:bg-[#164E9B] group-hover:text-white transition-colors">
              <ShieldCheck className="size-6" />
            </div>
            <h2 className="text-base font-bold text-slate-900 group-hover:text-[#164E9B] transition-colors">
              Cổng Cán bộ Giáo vụ
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Quản lý hồ sơ 18 NCS, xét duyệt minh chứng 2 cấp, thẩm định điểm bài báo WoS/Scopus và giám sát hạn ngạch GVHD toàn trường.
            </p>
          </div>
        </div>

        {/* Supervisor Portal */}
        <div
          className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <UserCheck className="size-6" />
            </div>
            <h2 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
              Cổng Giảng viên Hướng dẫn
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Bàn làm việc số của GVHD: Theo dõi danh sách NCS hướng dẫn, nhận xét báo cáo định kỳ 6 tháng và giám sát định mức tải trọng BR-09.
            </p>
          </div>
        </div>

        {/* Student Portal */}
        <div
          className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-indigo-500 hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <GraduationCap className="size-6" />
            </div>
            <h2 className="text-base font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
              Cổng Nghiên cứu sinh
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Tiến trình 9 mốc đào tạo chuẩn hóa: Nộp minh chứng mốc, theo dõi tiến độ phản biện chuyên môn, xem điểm nhận xét và đăng ký bảo vệ.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
