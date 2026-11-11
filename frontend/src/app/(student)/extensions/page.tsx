import { redirect } from "next/navigation";

/**
 * Chuyển hướng route cũ `/extensions` về route chuẩn phân hệ NCS `/student/extensions`.
 */
export default function ExtensionsRedirectPage() {
  redirect("/student/extensions");
}
