"use client";
import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="w-fit py-4 px-6 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-xl transition-all duration-300 border border-red-300 hover:border-red-400 cursor-pointer"
    >
      Sign Out
    </button>
  );
}
