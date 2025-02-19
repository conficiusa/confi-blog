import React from "react";
import { Github, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const SignInform = () => {
  return (
    <form>
      <div className="grid gap-2">
        <Label htmlFor="email" className="text-sm font-medium">
          Email
        </Label>
        <Input
          id="email"
          placeholder="name@example.com"
          type="email"
          autoCapitalize="none"
          autoComplete="email"
          autoCorrect="off"
          className="rounded-md"
        />
      </div>
      <Button
        className="mt-4 w-full bg-primary text-primary-foreground hover:bg-primary/90"
        type="submit"
      >
        <Mail className="mr-2 h-4 w-4" />
        Sign in with Email
      </Button>
    </form>
  );
};

export default SignInform;
