import { redirect } from "next/navigation";

/**
 * Thin Page cho route gốc /student (trong Route Group (student)).
 * Tự động chuyển hướng ngay lập tức vào trang tiến trình 9 mốc (/student/progress).
 */
export default function StudentRootPage() {
  redirect("/student/progress");
}
