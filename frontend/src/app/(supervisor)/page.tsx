import { redirect } from "next/navigation";

/**
 * Route: / (trong Route group (supervisor))
 * Tự động chuyển hướng về trang làm việc của Giảng viên Hướng dẫn: /supervisor
 */
export default function SupervisorRootPage() {
  redirect("/supervisor");
}
