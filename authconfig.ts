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
      const isAdmin = token?.role === "admin";
      const isEditor = token?.role === "editor";
      const currentPath = request.nextUrl.pathname;
      const isLoggedIn = !!auth?.user;
      const adminOnlyPaths = ["/admin"];
      const editorPaths = ["/studio"];
      const protectedPaths = ["/studio", "/getting-started", "/admin"];

      if (isLoggedIn && currentPath === "/sign-in") {
        return Response.redirect(new URL("/", request.nextUrl));
      }

      // Only admins can access admin-only paths
      if (isLoggedIn && !isAdmin && adminOnlyPaths.includes(currentPath)) {
        return Response.redirect(new URL("/", request.nextUrl));
      }
      
      // Both admins and editors can access editor paths
      if (isLoggedIn && !isAdmin && !isEditor && editorPaths.includes(currentPath)) {
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
