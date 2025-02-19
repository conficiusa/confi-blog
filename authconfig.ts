import type { NextAuthConfig } from "next-auth";
import { getToken } from "next-auth/jwt";

export const authConfig: NextAuthConfig = {
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
      const protectedPaths = ["/studio"];

      const isProtectedPath = protectedPaths.some((path) =>
        currentPath.startsWith(path)
      );

      // Redirect logic for doctors in "verifying" state
      if (!is_admin && isProtectedPath) {
        return Response.redirect(new URL("/sign-in", request.nextUrl));
      }

      return true; // Allow other paths
    },
  },
  providers: [],
};
