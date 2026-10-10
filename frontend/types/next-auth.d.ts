import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";
import { UserRole } from "@/src/lib/auth/constants";

export interface IUser {
    id: string;
    fullName: string;
    username: string;
    email?: string;
    role: UserRole;
}

declare module "next-auth" {
    interface Session {
        user: IUser;
        access_token: string;
        access_expire: number;
        error?: string;
    }

    interface User extends DefaultUser {
        user: IUser;
        access_token: string;
        refresh_token: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        access_token: string;
        refresh_token: string;
        user: IUser;
        access_expire: number;
        error?: string;
    }
}
