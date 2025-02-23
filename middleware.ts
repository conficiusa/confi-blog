import NextAuth from "next-auth";
import { authConfig } from "./authconfig";

export const { auth: middleware } = NextAuth(authConfig);
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|images|favicon.ico|sitemap.xml|robots.txt|sitemap.ts).*)",
  ],
};
