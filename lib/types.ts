import { Session } from "next-auth";
import { NextRequest } from "next/server";

export type AuthNextRequest = NextRequest & {
  auth?: Session;
};
