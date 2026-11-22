import { HomeDocumentSection } from "./HomeDocumentSection";
import { HomeFaqSection } from "./HomeFaqSection";
import { HomeFooter } from "./HomeFooter";
import { HomeHeader } from "./HomeHeader";
import { HomeIntroduction } from "./HomeIntroduction";

export function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F0F5FA] antialiased selection:bg-[#164E9B] selection:text-white">
      <HomeHeader />
      <main className="mx-auto w-full max-w-7xl flex-1 space-y-12 px-4 py-8 sm:space-y-16 sm:px-6 lg:px-8">
        <HomeIntroduction />
        <div className="grid items-start gap-8 lg:grid-cols-2">
          <HomeDocumentSection
            id="procedures"
            documentType="BIEU_MAU"
            title="Biểu mẫu học vụ"
            href="/forms"
            emptyMessage="Chưa có biểu mẫu học vụ."
          />
          <HomeDocumentSection
            id="regulations"
            documentType="QUY_DINH"
            title="Quy định & Quy chế"
            href="/regulations"
            emptyMessage="Chưa có văn bản quy định hoặc quy chế."
          />
        </div>
        <HomeFaqSection />
      </main>
      <HomeFooter />
    </div>
  );
}
