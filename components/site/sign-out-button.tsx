// components/site/sign-out-button.tsx
"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { signOut } from "@/lib/auth-client";

export function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.push("/sign-in");
    router.refresh();
  }

  return (
    <button
      onClick={handleSignOut}
      className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:border-[#A6402B]/30 hover:text-[#A6402B]"
    >
      <LogOut className="h-4 w-4" />
      Se déconnecter
    </button>
  );
}
