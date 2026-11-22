import { HomeHeader } from "./HomeHeader";
import { HomeHero } from "./HomeHero";
import { HomeTrainingProcess } from "./HomeTrainingProcess";
import { HomeAnnouncementsTimeline } from "./HomeAnnouncementsTimeline";
import { HomeDocumentSection } from "./HomeDocumentSection";
import { HomeFaqSection } from "./HomeFaqSection";
import { HomeFooter } from "./HomeFooter";

export function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC] antialiased selection:bg-[#164E9B] selection:text-white text-slate-800">
      <HomeHeader />
      <main className="mx-auto w-full max-w-7xl flex-1 space-y-12 px-4 py-4 sm:space-y-16 sm:px-6 lg:px-8">
        {/* 1. Hero Banner Trình chiếu Ảnh Toàn cảnh (Auto-play Visual Carousel) */}
        <HomeHero />

        {/* 2. Khối 1: Khung Đào tạo Tiến sĩ (9 Mốc) dải 3 giai đoạn nằm ngang */}
        <HomeTrainingProcess />

        {/* 3. Khối 2: Bảng tin Thông báo Đào tạo SĐH & Lịch học vụ (2 cột 7/5) */}
        <HomeAnnouncementsTimeline />

        {/* 4. Khối 3: Danh mục Biểu mẫu học vụ & Văn bản Quy định Quy chế (2 cột 6/6) */}
        <HomeDocumentSection />

        {/* 5. Khối 4: Hỏi đáp học vụ & Tiếp nhận hỗ trợ */}
        <HomeFaqSection />
      </main>
      <HomeFooter />
    </div>
  );
}

export default HomePage;
