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
     jwt: async ({ token,user })=>{
      if (user){
        token.userId = user.id;
        token.name = user.name;
        token.email = user.email;
        token.image = user.image;
      }
      return token
    },
    async session({ session,token }: any) {
      if (token?.userId) {
        session.user.id = token.userId as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.image = token.image as string;
      }
      return session;
    },
  }
};