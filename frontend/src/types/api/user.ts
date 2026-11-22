export interface UserAccount {
  id: string;
  username: string;
  fullName: string;
  email: string | null;
  roles: string[];
  isActive: boolean;
  mustChangePassword: boolean;
  createdAt: string;
}

export interface CreateUserInput {
  username: string;
  fullName: string;
  role: "ADMIN" | "GIAO_VU";
  email?: string;
}

export interface InitialUserCredential {
  username: string;
  initialPassword: string;
}
