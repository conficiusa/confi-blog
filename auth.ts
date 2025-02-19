import GitHub from "next-auth/providers/github";
import client from "./lib/db";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import NextAuth, { type DefaultSession } from "next-auth";
import User from "@/models/user";
import connectToDatabase from "@/lib/mongoose";

declare module "next-auth" {
  interface User {
    role?: string;
  }

  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }
  interface JWT {
    id: string;
    role: string;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name,
          email: profile.email,
          image: profile.avatar_url,
          role: "reader",
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      await connectToDatabase();
      const existingOauthUser = await User.findOne({ email: user?.email });
      if (user) {
        token.role = user?.role || undefined;
        token.id = user?.id || "";
      }
      if (existingOauthUser) {
        token.id = existingOauthUser._id.toString();
        token.role = existingOauthUser.role;
      }
      return token;
    },
    session: async ({ session, token }) => {
      return session;
    },
  },
  adapter: MongoDBAdapter(client, {
    databaseName: "confidev",
  }),
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
  },
  jwt: {
    maxAge: 7 * 24 * 60 * 60,
  },
  secret: process.env.AUTH_SECRET,
});
