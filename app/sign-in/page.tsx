import type React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import SignInform from "@/components/signInform";

export default function SignInDialog() {
  return (
    <main className="min-h-screen bg-gray-100 px-3 py-2 rounded-md mt-2">
      <h1 className="lg:text-5xl md:text-3xl text-xl text-center mb-4">Confi.dev</h1>

      <Card className="max-w-md mx-auto mt-3 p-8 rounded-lg shadow-lg bg-white">
        <CardTitle>Welcome Back</CardTitle>
        <CardDescription>
          Choose your preferred method to sign in to your account.
        </CardDescription>
        <CardContent>
          <SignInform />
        </CardContent>
      </Card>
    </main>
  );
}
