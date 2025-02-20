import GoogleProvider from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";
import { getUserByEmail } from "./data/user";
import bcrypt from "bcryptjs";

interface Credentials {
  email: string;
  password: string;
}

export default {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,

      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          responseType: "code",
        },
      },
    }),
    Credentials({
      async authorize(credentials) {
        const { email, password } = credentials;

        if (
          !credentials ||
          typeof email !== "string" ||
          typeof password !== "string"
        ) {
          return null;
        }

        const user = await getUserByEmail(email);

        if (!user || !user.password) {
          return null;
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
          return user;
        }

        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
