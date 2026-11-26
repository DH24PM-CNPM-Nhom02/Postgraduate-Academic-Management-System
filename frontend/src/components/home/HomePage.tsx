import { HomeHeader } from "./HomeHeader";
import { HomeHero } from "./HomeHero";
import { HomeTrainingProcess } from "./HomeTrainingProcess";
import { HomeDocumentSection } from "./HomeDocumentSection";
import { HomeFaqSection } from "./HomeFaqSection";
import { HomeFooter } from "./HomeFooter";

export function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC] antialiased selection:bg-[#164E9B] selection:text-white text-slate-800">
      <HomeHeader />
      <main className="mx-auto w-full max-w-7xl flex-1 space-y-12 px-4 py-4 sm:space-y-16 sm:px-6 lg:px-8">
        <HomeHero />
        <HomeTrainingProcess />
        <HomeDocumentSection />
        <HomeFaqSection />
      </main>
      <HomeFooter />
    </div>
  );
}
