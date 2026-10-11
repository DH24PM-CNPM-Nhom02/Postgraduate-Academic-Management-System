import Link from "next/link";
import { Mail, Phone, HelpCircle } from "lucide-react";

export function StudentFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-card/50 px-4 py-4 text-xs text-muted-foreground sm:px-6">
      <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
        <div className="flex items-center gap-2">
          <span className="font-medium text-foreground">AGU - Cổng Nghiên cứu sinh</span>
          <span>•</span>
          <span>Bộ phận Quản lý Sau đại học</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
          <a
            href="mailto:sdh@agu.edu.vn"
            className="flex items-center gap-1 hover:text-foreground transition-colors"
          >
            <Mail className="size-3.5 text-blue-600" />
            <span>sdh@agu.edu.vn</span>
          </a>
          <span className="text-border">•</span>
          <a
            href="tel:02963843110"
            className="flex items-center gap-1 hover:text-foreground transition-colors"
          >
            <Phone className="size-3.5 text-blue-600" />
            <span>(0296) 3843110</span>
          </a>
          <span className="text-border">•</span>
          <a
            href="#"
            className="flex items-center gap-1 hover:text-foreground transition-colors"
          >
            <HelpCircle className="size-3.5" />
            <span>Trợ giúp học vụ</span>
          </a>
        </div>
      </div>
    </footer>
  );
}

export default StudentFooter;
