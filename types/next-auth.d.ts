import { UserRole } from "@prisma/client";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: User & DefaultSession["user"];
  }

  interface User {
    id: string;
    createdDocs: number;
    allowedDocs: number;
    company?: {
      id: string;
      name: string;
      allowedDocsPerUsers?: number;
      allowedTemplates?: number;
    } | null;
    role: UserRole;
    candidateProfile?: {
      id: string;
      skills: string[];
      yearsOfExperience?: number;
      industry?: string;
      masterCVUploaded: boolean;
    } | null;
    companyId?: string | null;
  }
}
