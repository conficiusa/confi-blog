import GitHub from "next-auth/providers/github";
import client from "./lib/db";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import NextAuth, { type DefaultSession } from "next-auth";
import User from "@/models/user";
import connectToDatabase from "@/lib/mongoose";
import Google from "next-auth/providers/google";
import { authConfig } from "./authconfig";

declare module "next-auth" {
  interface User {
    role?: "admin" | "editor" | "reader" | undefined;
  }

  interface Session {
    user: {
      id: string;
      role?: "admin" | "editor" | "reader";
    } & DefaultSession["user"];
  }
  interface JWT {
    id: string;
    role?: "admin" | "editor" | "reader";
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Google,
    GitHub({
      profile(profile) {
        return {
          name: profile.name,
          email: profile.email,
          image: profile.avatar_url,
          role: "reader",
        };
      },
    }),
  ],
  events: {
    signIn: async ({ isNewUser, user, account }) => {
      if (isNewUser) {
        if (account?.provider === "google") {
          await User.findOneAndUpdate(
            { email: user?.email },
            { role: "reader" }
          );
        }
      }
    },
  },
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
      if (token) {
        session.user.role = token.role as "admin" | "editor" | "reader" | undefined;
        session.user.id = token.id as string;
      }
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
