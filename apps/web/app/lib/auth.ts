import GoogleProvider from "next-auth/providers/google";
import { AuthOptions } from "next-auth";
import { prismaClient } from "@repo/db/client";
import { PrismaAdapter } from "@auth/prisma-adapter";

export const NEXT_AUTH:AuthOptions = {
  adapter: PrismaAdapter(prismaClient),
  providers: [
    GoogleProvider({
      clientId:process.env.GOOGLE_ID||"",
      clientSecret:process.env.GOOGLE_SECRET||""
    })
  ],
  secret:process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async session({ session , user }: any) {
      if (session.user) {
        session.user.id = user.id;
        session.user.name = user.name;
        session.user.email = user.email;
      }
      return session;
    },
  }
};