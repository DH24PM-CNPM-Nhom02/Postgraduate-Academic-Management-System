import type { ReactNode } from "react";
import { HomeFooter } from "@/src/components/home/HomeFooter";
import { HomeHeader } from "@/src/components/home/HomeHeader";

export default function PublicDocumentsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#F0F5FA]">
      <HomeHeader />
      <main className="flex-1 px-4 py-8 sm:px-6 sm:py-12">{children}</main>
      <HomeFooter />
    </div>
  );
}
