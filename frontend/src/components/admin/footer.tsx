import { Terminal, Shield, Cpu } from "lucide-react";

export function AdminFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-card/50 px-4 py-4 text-xs text-muted-foreground sm:px-6">
      <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
        <div className="flex items-center gap-2">
          <span className="font-medium text-foreground">AGU Admin Console</span>
          <span>•</span>
          <span>Hệ thống Quản lý Đào tạo Sau Đại học</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
          <span className="flex items-center gap-1">
            <Cpu className="size-3.5 text-rose-600" />
            <span>Node: Active</span>
          </span>
          <span className="text-border">•</span>
          <span className="flex items-center gap-1">
            <Shield className="size-3.5 text-rose-600" />
            <span>RBAC Security: Enabled</span>
          </span>
          <span className="text-border">•</span>
          <span className="flex items-center gap-1">
            <Terminal className="size-3.5" />
            <span>Build: 2026.10</span>
          </span>
        </div>
      </div>
    </footer>
  );
}

export default AdminFooter;
