// app/forgot-password/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import AuthShell from "@/components/site/auth-shell";
import StampStatus, { type StampState } from "@/components/site/stamp-status";

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [statut, setStatut] = useState<StampState>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setStatut("loading");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    const res = await authClient.requestPasswordReset({
      email,
      redirectTo: "/reset-password",
    });

    if (res.error) {
      setError(res.error.message || "Une erreur est survenue.");
      setStatut("error");
    } else {
      setStatut("success");
    }
  }

  const enCours = statut === "loading" || statut === "success";

  return (
    <AuthShell>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-[2rem] font-medium tracking-tight text-[#1B2A4A]">
            Mot de passe oublié
          </h1>
          <p className="mt-2 text-sm text-[#6B6552]">
            Indiquez votre email, nous vous envoyons un lien de
            réinitialisation.
          </p>
        </div>
        <StampStatus state={statut} />
      </div>

      {error && <p className="mt-4 text-sm text-[#B23A2E]">{error}</p>}

      {statut === "success" ? (
        <p className="mt-10 text-sm leading-relaxed text-[#2F6B4F]">
          Si un compte existe avec cette adresse, un email vient de vous être
          envoyé. Pensez à vérifier vos spams — le lien est valable 1 heure.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-10 space-y-7">
          <div>
            <label
              htmlFor="email"
              className="font-[family-name:var(--font-mono)] text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8A8467]"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="vous@exemple.com"
              required
              autoComplete="email"
              className="mt-2 w-full border-0 border-b border-[#D9D0BA] bg-transparent pb-2 text-base text-[#1B2A4A] outline-none transition-colors placeholder:text-[#B7AF95] focus:border-[#1B2A4A]"
            />
          </div>

          <button
            type="submit"
            disabled={enCours}
            className="flex w-full items-center justify-center gap-2 rounded-[4px] bg-[#1B2A4A] px-4 py-3 font-[family-name:var(--font-mono)] text-xs font-semibold uppercase tracking-[0.16em] text-[#F6F1E4] transition-colors hover:bg-[#243858] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {statut === "loading" ? "Envoi en cours" : "Envoyer le lien"}
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
    </AuthShell>
  );
}
