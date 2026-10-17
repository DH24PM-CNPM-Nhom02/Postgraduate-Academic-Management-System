import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "./providers";

const plusJakartaSans = localFont({
  src: [
    {
      path: "../../public/fonts/PlusJakartaSans-VariableFont_wght.ttf",
      style: "normal",
    },
    {
      path: "../../public/fonts/PlusJakartaSans-Italic-VariableFont_wght.ttf",
      style: "italic",
    },
  ],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cổng Quản lý Đào tạo Sau Đại học - AGU",
  description: "Trường Đại học An Giang - Đại học Quốc gia TP. Hồ Chí Minh",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={plusJakartaSans.variable}>
      <body className="font-sans antialiased text-slate-900 bg-background">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}