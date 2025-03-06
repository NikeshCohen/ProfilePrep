import { getUserWithCompany } from "@/actions/user.actions";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import { Adapter } from "next-auth/adapters";
import Google from "next-auth/providers/google";

import prisma from "./prisma/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [Google({ allowDangerousEmailAccountLinking: true })],
  callbacks: {
    session: async ({ session, user }) => {
      const { success, user: dbUser } = await getUserWithCompany(user.id);

      if (success && dbUser) {
        return {
          ...session,
          user: {
            ...session.user,
            id: user.id,
            company: dbUser.company,
          },
        };
      }

      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/error",
  },
});
