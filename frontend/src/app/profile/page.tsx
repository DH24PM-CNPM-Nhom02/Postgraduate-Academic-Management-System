import type { Metadata } from "next";
import { UserProfileContainer } from "@/src/components/profile/user-profile-container";
import { ProfileAppShell } from "@/src/components/profile/profile-app-shell";

export const metadata: Metadata = {
  title: "Hồ sơ cá nhân | Hệ thống Quản trị Đào tạo Sau Đại học",
};

export default function ProfilePage() {
  return (
    <ProfileAppShell>
      <UserProfileContainer />
    </ProfileAppShell>
  );
}
