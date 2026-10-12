import Link from "next/link";
import { GraduationCap, Phone, Mail, HelpCircle, ShieldCheck } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      {/* Top micro-bar */}
      <div className="bg-primary px-4 py-1.5 text-xs text-primary-foreground">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline font-medium">Trường Đại học An Giang - ĐHQG-HCM</span>
            <span className="hidden sm:inline text-primary-foreground/40">|</span>
            <span className="text-primary-foreground/90">Cổng Quản lý Đào tạo Sau Đại học</span>
          </div>
          <div className="flex items-center gap-4 text-primary-foreground/90">
            <a
              href="tel:02963843110"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Phone className="size-3.5" />
              <span className="hidden md:inline">(0296) 3843110</span>
            </a>
            <span className="text-primary-foreground/40">•</span>
            <a
              href="mailto:sdh@agu.edu.vn"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Mail className="size-3.5" />
              <span className="hidden md:inline">sdh@agu.edu.vn</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-200 shadow-sm">
            <GraduationCap className="size-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-foreground uppercase sm:text-base">
              Hệ thống Quản lý Sau Đại học
            </span>
            <span className="text-xs text-muted-foreground font-medium">
              An Giang University - VNU-HCM
            </span>
          </div>
        </Link>

        {/* Quick action buttons & Links */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs sm:text-sm font-medium text-foreground hover:bg-muted transition-colors shadow-xs"
          >
            <ShieldCheck className="size-4 text-primary" />
            <span>Đăng nhập</span>
          </Link>

          <a
            href="mailto:sdh@agu.edu.vn?subject=Ho%20tro%20he%20thong%20Sau%20Dai%20hoc"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-muted px-3 py-1.5 text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <HelpCircle className="size-4" />
            <span>Trợ giúp</span>
          </a>
        </div>
      </div>
    </header>
  );
}

export default Header;
