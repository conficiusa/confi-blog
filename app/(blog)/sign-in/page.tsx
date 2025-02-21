import type React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SignInform from "@/components/signInform";

import { GitHubSignInButton, GoogleSignInButton } from "@/components/buttons";
import { Suspense } from "react";

export default function SignInDialog() {
  return (
    <main className="min-h-screen bg-gray-50 px-3 py-2 rounded-md mt-2">
      <h1 className="lg:text-5xl md:text-3xl text-xl text-center mb-4">
        Confi.dev
      </h1>

      <Card className="max-w-md mx-auto mt-3 rounded-lg shadow-lg bg-white">
        <CardHeader>
          <CardTitle>Welcome Back</CardTitle>
          <CardDescription>
            Choose your preferred method to sign in to your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 mt-4">
            <Suspense>
              <GoogleSignInButton />
              <GitHubSignInButton />
            </Suspense>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or
                </span>
              </div>
            </div>
            <SignInform />
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
