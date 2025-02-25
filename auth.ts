import NextAuth from "next-auth";

import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./lib/prisma";

import authConfig from "./auth.config";
import { getUserById } from "./data/user";

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/auth/signin",
  },

  secret: process.env.AUTH_SECRET,

  session: { strategy: "jwt" },

  callbacks: {
    async signIn({ user, account }) {
      return true;
    },

    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },

  adapter: PrismaAdapter(prisma),

  ...authConfig,
});
