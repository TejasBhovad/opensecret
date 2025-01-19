"use client";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
export default function SignIn() {
  return (
    <Button
      variant="outline"
      className="w-full"
      onClick={() => signIn("google")}
    >
      Sign in with Google
    </Button>
  );
}
