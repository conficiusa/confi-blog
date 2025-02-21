import type { NextAuthConfig } from "next-auth";
import { getToken } from "next-auth/jwt";
export const authConfig: NextAuthConfig = {
  pages: {
    newUser: "/getting-started",
  },

  // Refer to https://github.com/nextauthjs/next-auth/discussions/9133 in production
  callbacks: {
    async authorized({ auth, request }) {
      const token = await getToken({
        req: request,
        secret: process.env.AUTH_SECRET as string,
        secureCookie: process.env.NODE_ENV === "production",
      });
      const is_admin = token?.role === "admin";
      const currentPath = request.nextUrl.pathname;
      const isLoggedIn = !!auth?.user;
      const adminPaths = ["/studio"];
      const protectedPaths = ["/studio", "/getting-started"];

      if (isLoggedIn && currentPath === "/sign-in") {
        return Response.redirect(new URL("/", request.nextUrl));
      }

      if (isLoggedIn && !is_admin && adminPaths.includes(currentPath)) {
        return Response.redirect(new URL("/", request.nextUrl));
      }
      if (!isLoggedIn && protectedPaths.includes(currentPath)) {
        return Response.redirect(new URL("/sign-in", request.nextUrl));
      }
      return true;
    },
  },
  providers: [],
};
