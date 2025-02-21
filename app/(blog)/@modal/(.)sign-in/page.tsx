import type React from "react";
import Modal from "@/components/modal";
import SignInform from "@/components/signInform";
import { GitHubSignInButton, GoogleSignInButton } from "@/components/buttons";
import { Suspense } from "react";

export default function SignInDialog() {
  return (
    <Modal>
      <div className="flex flex-col gap-4 mt-4">
        <GoogleSignInButton />
        <GitHubSignInButton />
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or</span>
          </div>
        </div>
        <SignInform />
      </div>
    </Modal>
  );
}
