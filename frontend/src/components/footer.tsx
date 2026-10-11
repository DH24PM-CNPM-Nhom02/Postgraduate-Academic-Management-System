import Link from "next/link";
import { MapPin, Phone, Mail, Globe, Shield, ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-card text-card-foreground">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Cột 1: Thông tin cơ quan */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
              Trường Đại học An Giang
            </h3>
            <p className="text-xs font-medium text-muted-foreground">
              Đại học Quốc gia TP. Hồ Chí Minh
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Phòng Đào tạo - Bộ phận Quản lý Sau đại học. Hệ thống theo dõi tiến trình học tập, quản lý luận án, đề cương và công bố khoa học cho Nghiên cứu sinh & Giảng viên hướng dẫn.
            </p>
          </div>

          {/* Cột 2: Thông tin liên hệ */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
              Thông tin liên hệ
            </h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li className="flex items-start gap-2">
                <MapPin className="size-4 shrink-0 text-primary mt-0.5" />
                <span>Số 18 Ung Văn Khiêm, P. Đông Xuyên, TP. Long Xuyên, Tỉnh An Giang</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="size-4 shrink-0 text-primary" />
                <span>Hotline: (0296) 3843110 (Ext: 110)</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="size-4 shrink-0 text-primary" />
                <span>Email: sdh@agu.edu.vn</span>
              </li>
              <li className="flex items-center gap-2">
                <Globe className="size-4 shrink-0 text-primary" />
                <a
                  href="https://www.agu.edu.vn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline flex items-center gap-1"
                >
                  www.agu.edu.vn
                  <ExternalLink className="size-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Cột 3: Liên kết nhanh & Văn bản quy chế */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
              Quy chế & Hướng dẫn
            </h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <a
                  href="#"
                  className="hover:text-foreground transition-colors hover:underline"
                >
                  Quy chế Đào tạo Trình độ Tiến sĩ hiện hành
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-foreground transition-colors hover:underline"
                >
                  Quy định công bố bài báo khoa học quốc tế (Scopus/WoS)
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-foreground transition-colors hover:underline"
                >
                  Biểu mẫu đề cương, báo cáo 6 tháng & phản biện độc bản
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-foreground transition-colors hover:underline"
                >
                  Hồ sơ đăng ký bảo vệ cấp đơn vị chuyên môn & cấp trường
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Dòng bản quyền dưới cùng */}
        <div className="mt-8 border-t border-border/60 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Trường Đại học An Giang - ĐHQG-HCM. Bảo lưu mọi quyền.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-foreground transition-colors">Điều khoản sử dụng</a>
            <span>•</span>
            <a href="#" className="hover:text-foreground transition-colors">Chính sách bảo mật</a>
            <span>•</span>
            <span className="flex items-center gap-1 text-primary">
              <Shield className="size-3.5" />
              Bảo mật SSL
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
