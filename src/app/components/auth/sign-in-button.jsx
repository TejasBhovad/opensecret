"use client";
import { signIn } from "next-auth/react";

export default function SignIn() {
  return (
    <button 
      onClick={() => signIn("google")}
      className="px-4 py-2 bg-white text-[#023838] rounded-md hover:bg-gray-100 transition-colors"
    >
      Sign in with Google
    </button>
  );
}