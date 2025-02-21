"use client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Button } from "./ui/button";
import { GoogleIcon } from "./icons";
import { handleOauthSignIn } from "@/lib/actions";
import { Github } from "lucide-react";

export const SignInButton = () => {
  const pathname = usePathname();
  return (
    <Link href={`/sign-in?redirect=${encodeURIComponent(pathname)}`}>
      <button className="mx-3 border border-black bg-black py-3 px-12 font-bold text-white transition-colors duration-200 hover:bg-white hover:text-black lg:mb-0 lg:px-8">
        Sign in
      </button>
    </Link>
  );
};

export const GoogleSignInButton = () => {
  const redirect = useSearchParams().get("redirect");

  return (
    <Button
      variant="outline"
      className="w-full mb-4 "
      onClick={async () => handleOauthSignIn(redirect, "google")}
    >
      <GoogleIcon />
      Sign in with Google
    </Button>
  );
};

export const GitHubSignInButton = () => {
  const redirect = useSearchParams().get("redirect");
  return (
    <Button
      variant="outline"
      className="w-full mb-4 "
      onClick={async () => handleOauthSignIn(redirect, "github")}
    >
      <Github className="mr-2 h-4 w-4" />
      Sign in with Google
    </Button>
  );
};
