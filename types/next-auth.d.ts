import { UserRole, UserType } from "@prisma/client";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: User & DefaultSession["user"];
  }

  interface User {
    createdDocs: number;
    allowedDocs: number;
    company?: {
      id: string;
      name: string;
    } | null;
    role: UserRole;
    userType: UserType;
    isTestAccount: boolean;
  }
}
