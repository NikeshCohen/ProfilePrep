import { getUserWithCompany } from "@/actions/user.actions";
import prisma from "@/prisma/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import { Adapter } from "next-auth/adapters";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import LinkedIn from "next-auth/providers/linkedin";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  adapter: PrismaAdapter(prisma) as Adapter,
  session: {
    strategy: "jwt",
  },
  providers: [
    Google({ allowDangerousEmailAccountLinking: true }),
    LinkedIn({ allowDangerousEmailAccountLinking: true }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        // Define demo accounts with their credentials
        const demoAccounts = {
          "demo@profileprep.com": {
            password: "Demo2024!",
            name: "Demo User",
            role: "USER" as const,
            userType: "RECRUITER" as const,
          },
          "admin.demo@profileprep.com": {
            password: "Admin2024!",
            name: "Demo Admin",
            role: "ADMIN" as const,
            userType: "RECRUITER" as const,
          },
          "superadmin.demo@profileprep.com": {
            password: "SuperAdmin2024!",
            name: "Super Admin",
            role: "SUPERADMIN" as const,
            userType: "RECRUITER" as const,
          },
          "candidate.demo@profileprep.com": {
            password: "Candidate2024!",
            name: "Demo Candidate",
            role: "USER" as const,
            userType: "CANDIDATE" as const,
          },
        };

        // Check if this is a valid demo account
        const demoAccount = demoAccounts[email as keyof typeof demoAccounts];
        if (demoAccount && password === demoAccount.password) {
          // Get or create test user
          let testUser = await prisma.user.findUnique({
            where: { email },
            include: {
              company: true,
            },
          });

          if (!testUser) {
            // First check if demo company exists (for recruiter accounts)
            let demoCompany = null;
            if (demoAccount.userType === "RECRUITER") {
              demoCompany = await prisma.company.findFirst({
                where: { name: "Demo Company" },
              });

              if (!demoCompany) {
                demoCompany = await prisma.company.create({
                  data: {
                    name: "Demo Company",
                    allowedDocsPerUsers: 1000,
                    allowedTemplates: 10,
                  },
                });
              }
            }

            testUser = await prisma.user.create({
              data: {
                email,
                name: demoAccount.name,
                isTestAccount: true,
                role: demoAccount.role,
                userType: demoAccount.userType,
                allowedDocs: 1000, // Unlimited for demo
                companyId: demoCompany?.id,
              },
              include: {
                company: true,
              },
            });
          }

          return {
            id: testUser.id,
            email: testUser.email!,
            name: testUser.name,
            createdDocs: testUser.createdDocs || 0,
            allowedDocs: testUser.allowedDocs || 5,
            role: testUser.role,
            userType: testUser.userType,
            isTestAccount: testUser.isTestAccount || false,
            company: testUser.companyId
              ? {
                  id: testUser.companyId,
                  name: testUser.company?.name || "Unknown Company",
                }
              : null,
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async signIn({ account }) {
      // For credentials provider, we need to handle the session differently
      if (account?.provider === "credentials") {
        return true;
      }
      return true;
    },
    session: async ({ session, token }) => {
      // Handle both JWT (credentials) and database sessions
      const userId = token?.id || token?.sub;
      if (!userId) return session;

      const { success, user: dbUser } = await getUserWithCompany(
        userId as string,
      );

      if (success && dbUser) {
        return {
          ...session,
          user: {
            ...session.user,
            id: dbUser.id,
            company: dbUser.company,
            role: dbUser.role,
            userType: dbUser.userType,
            isTestAccount: dbUser.isTestAccount,
            createdDocs: dbUser.createdDocs,
            allowedDocs: dbUser.allowedDocs,
          },
        };
      }

      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/error",
    newUser: "/app/onboarding",
  },
});
