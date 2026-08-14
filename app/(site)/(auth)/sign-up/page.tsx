// app/sign-up/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUp, signIn } from "@/lib/auth-client";
import AuthShell from "@/components/site/auth-shell";
import { ArrowRight, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

type Statut = "idle" | "loading" | "success" | "error";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.47a5.54 5.54 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.57-5.17 3.57-8.82Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.95-2.9l-3.88-3.02c-1.08.72-2.46 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.95H1.26v3.11A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.28A7.2 7.2 0 0 1 4.9 12c0-.79.14-1.56.37-2.28V6.61H1.26A12 12 0 0 0 0 12c0 1.94.46 3.77 1.26 5.39l4.01-3.11Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.77c1.76 0 3.34.61 4.58 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.26 6.61l4.01 3.11C6.22 6.88 8.87 4.77 12 4.77Z"
      />
    </svg>
  );
}

export default function SignUpPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [statut, setStatut] = useState<Statut>("idle");
  const [statutGoogle, setStatutGoogle] = useState<"idle" | "loading">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setStatut("loading");

    const formData = new FormData(e.currentTarget);

    const res = await signUp.email({
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    });

    if (res.error) {
      setError(res.error.message || "Une erreur est survenue.");
      setStatut("error");
    } else {
      setStatut("success");
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 500);
    }
  }

  async function handleGoogle() {
    setError(null);
    setStatutGoogle("loading");
    try {
      await signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });
    } catch {
      setError("Impossible de s'inscrire avec Google.");
      setStatutGoogle("idle");
    }
  }

  const enCours = statut === "loading" || statut === "success";

  return (
    <AuthShell>
      {/* ── En-tête ── */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#1C1C1E]/10 bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#6B7280] shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-[#235C43]" />
          Inscription
        </div>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-bold text-[#1C1C1E]">
          Créer un compte
        </h1>
        <p className="mt-1.5 text-sm text-[#6B7280]">
          Commencez votre préparation au permis dès aujourd&apos;hui.
        </p>
      </div>

      {/* ── Alerte erreur ── */}
      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-[#C0392B]/20 bg-[#C0392B]/5 px-4 py-3">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#C0392B]" />
          <p className="text-sm text-[#C0392B]">{error}</p>
        </div>
      )}

      {/* ── Confirmation succès ── */}
      {statut === "success" && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-[#235C43]/25 bg-[#235C43]/6 px-4 py-3">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#235C43]" />
          <p className="text-sm font-medium text-[#235C43]">
            Dossier validé. Redirection…
          </p>
        </div>
      )}

      {/* ── Formulaire ── */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nom complet */}
        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-[10px] font-bold uppercase tracking-[0.18em] text-[#6B7280]"
          >
            Nom complet
          </label>
          <input
            id="name"
            name="name"
            placeholder="Jean Dupont"
            required
            autoComplete="name"
            className="w-full rounded-xl border border-[#1C1C1E]/10 bg-white px-4 py-3 text-sm text-[#1C1C1E] outline-none transition-all duration-200 placeholder:text-[#6B7280]/35 focus:border-[#235C43] focus:shadow-[4px_4px_0_rgba(35,92,67,0.1)]"
          />
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-[10px] font-bold uppercase tracking-[0.18em] text-[#6B7280]"
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
            className="w-full rounded-xl border border-[#1C1C1E]/10 bg-white px-4 py-3 text-sm text-[#1C1C1E] outline-none transition-all duration-200 placeholder:text-[#6B7280]/35 focus:border-[#235C43] focus:shadow-[4px_4px_0_rgba(35,92,67,0.1)]"
          />
        </div>

        {/* Mot de passe */}
        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-[10px] font-bold uppercase tracking-[0.18em] text-[#6B7280]"
          >
            Mot de passe
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            required
            minLength={8}
            autoComplete="new-password"
            className="w-full rounded-xl border border-[#1C1C1E]/10 bg-white px-4 py-3 text-sm text-[#1C1C1E] outline-none transition-all duration-200 placeholder:text-[#6B7280]/35 focus:border-[#235C43] focus:shadow-[4px_4px_0_rgba(35,92,67,0.1)]"
          />
          <p className="mt-1.5 text-[11px] text-[#6B7280]/70">
            Au moins 8 caractères.
          </p>
        </div>

        {/* Bouton */}
        <button
          type="submit"
          disabled={enCours}
          className="group mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-[#1C1C1E] px-6 py-3.5 text-sm font-bold text-white shadow-[4px_4px_0_rgba(0,0,0,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#2a2a2c] hover:shadow-[4px_6px_0_rgba(0,0,0,0.18)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {statut === "loading" && (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Création en cours…
            </>
          )}
          {statut === "success" && (
            <>
              <CheckCircle2 className="h-4 w-4 text-[#F5C800]" />
              Dossier validé
            </>
          )}
          {(statut === "idle" || statut === "error") && (
            <>
              Créer mon compte
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </>
          )}
        </button>
      </form>

      {/* ── Séparateur "ou" ── */}
      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-[#1C1C1E]/8" />
        <span className="text-[11px] text-[#6B7280]">ou</span>
        <div className="h-px flex-1 bg-[#1C1C1E]/8" />
      </div>

      {/* ── Inscription Google ── */}
      <button
        type="button"
        onClick={handleGoogle}
        disabled={statutGoogle === "loading" || enCours}
        className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-[#1C1C1E]/12 bg-white px-6 py-3.5 text-sm font-bold text-[#1C1C1E] transition-all duration-200 hover:border-[#1C1C1E]/25 hover:shadow-[4px_4px_0_rgba(0,0,0,0.08)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {statutGoogle === "loading" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <GoogleIcon />
        )}
        Continuer avec Google
      </button>

      {/* ── Séparateur ── */}
      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-[#1C1C1E]/8" />
        <span className="text-[11px] text-[#6B7280]">déjà un compte ?</span>
        <div className="h-px flex-1 bg-[#1C1C1E]/8" />
      </div>

      {/* ── Lien connexion ── */}
      <Link
        href="/login"
        className="group flex w-full items-center justify-center gap-2 rounded-full border-2 border-[#1C1C1E]/12 bg-white px-6 py-3.5 text-sm font-bold text-[#1C1C1E] transition-all duration-200 hover:border-[#1C1C1E]/25 hover:shadow-[4px_4px_0_rgba(0,0,0,0.08)]"
      >
        Se connecter
        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
      </Link>
    </AuthShell>
  );
}
