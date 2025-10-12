"use client";
import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="bg-red-600 cursor-pointer text-white p-2 rounded-lg hover:bg-red-500"
    >
      Sign Out
    </button>
  );
}
