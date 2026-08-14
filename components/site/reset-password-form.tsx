"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import StampStatus, { type StampState } from "@/components/site/stamp-status";

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [error, setError] = useState<string | null>(null);
  const [statut, setStatut] = useState<StampState>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError("Ce lien de réinitialisation est invalide ou a expiré.");
      setStatut("error");
      return;
    }

    setStatut("loading");
    const formData = new FormData(e.currentTarget);
    const newPassword = formData.get("password") as string;

    const res = await authClient.resetPassword({ newPassword, token });

    if (res.error) {
      setError(res.error.message || "Une erreur est survenue.");
      setStatut("error");
    } else {
      setStatut("success");
      setTimeout(() => router.push("/login"), 1200);
    }
  }

  const enCours = statut === "loading" || statut === "success";

  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-[2rem] font-medium tracking-tight text-[#1B2A4A]">
            Nouveau mot de passe
          </h1>
          <p className="mt-2 text-sm text-[#6B6552]">
            Choisissez un nouveau mot de passe pour votre compte.
          </p>
        </div>
        <StampStatus state={statut} />
      </div>

      {error && <p className="mt-4 text-sm text-[#B23A2E]">{error}</p>}
      {!token && !error && (
        <p className="mt-4 text-sm text-[#B23A2E]">
          Ce lien de réinitialisation est invalide ou a expiré.
        </p>
      )}

      {statut === "success" ? (
        <p className="mt-10 text-sm text-[#2F6B4F]">
          Mot de passe mis à jour. Redirection vers la connexion…
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-10 space-y-7">
          <div>
            <label
              htmlFor="password"
              className="font-[family-name:var(--font-mono)] text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8A8467]"
            >
              Nouveau mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              minLength={8}
              autoComplete="new-password"
              className="mt-2 w-full border-0 border-b border-[#D9D0BA] bg-transparent pb-2 text-base text-[#1B2A4A] outline-none transition-colors placeholder:text-[#B7AF95] focus:border-[#1B2A4A]"
            />
            <p className="mt-1.5 font-[family-name:var(--font-mono)] text-[11px] text-[#B7AF95]">
              Au moins 8 caractères.
            </p>
          </div>

          <button
            type="submit"
            disabled={enCours || !token}
            className="flex w-full items-center justify-center gap-2 rounded-[4px] bg-[#1B2A4A] px-4 py-3 font-[family-name:var(--font-mono)] text-xs font-semibold uppercase tracking-[0.16em] text-[#F6F1E4] transition-colors hover:bg-[#243858] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {statut === "loading" ? "Mise à jour…" : "Réinitialiser"}
          </button>
        </form>
      )}

      <p className="mt-10 text-center text-sm text-[#6B6552]">
        <Link
          href="/login"
          className="font-medium text-[#1B2A4A] hover:underline"
        >
          ← Retour à la connexion
        </Link>
      </p>
    </>
  );
}
