import type { UserAccount } from "./user";

export type PasswordRequestStatus = "CHO_XU_LY" | "DA_XU_LY" | "TU_CHOI";

export interface PasswordRequest {
  id: string;
  userId: string;
  trangThai: PasswordRequestStatus;
  ghiChuLienHe: string | null;
  lyDoTuChoi: string | null;
  nguoiXuLyId: string | null;
  ngayXuLy: string | null;
  createdAt: string;
  user: Pick<UserAccount, "id" | "username" | "fullName" | "email" | "roles">;
}
