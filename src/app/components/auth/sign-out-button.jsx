"use client";
import { signOut } from "next-auth/react";

export default function SignOut() {
  return (
    <button
      onClick={() => signOut()}
      className="rounded-md bg-red-500/25 px-4 py-2 text-white transition-colors hover:bg-red-600/25"
    >
      Sign Out
    </button>
  );
}
