"use server";
import { signIn } from "@/auth";

export const handleOauthSignIn = async (
  redirect: string | null,
  provider: string
) => {
  await signIn(provider, {
    redirectTo: redirect ?? "/",
    callbackUrl: redirect ?? "/",
  });
};
