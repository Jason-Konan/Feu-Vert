// app/contact/page.tsx
"use client";

import { useState } from "react";
import {
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Mail,
  Clock,
  MapPin,
} from "lucide-react";

type Statut = "idle" | "loading" | "success" | "error";

export default function ContactPage() {
  const [error, setError] = useState<string | null>(null);
  const [statut, setStatut] = useState<Statut>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setStatut("loading");

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
      // Champ piège anti-spam : invisible pour un humain, tentant pour un bot.
      societe: formData.get("societe") as string,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        setError(data.error || "Une erreur est survenue.");
        setStatut("error");
        return;
      }

      setStatut("success");
      (e.target as HTMLFormElement).reset();
    } catch {
      setError("Impossible d'envoyer le message. Vérifiez votre connexion.");
      setStatut("error");
    }
  }

  const enCours = statut === "loading";

  return (
    <main className="min-h-screen bg-[#FBFAF7] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        {/* ── Colonne info ── */}
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#1C1C1E]/10 bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#6B7280] shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#235C43]" />
            Contact
          </div>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-bold text-[#1C1C1E] sm:text-4xl">
            Une question ?
            <br />
            Écrivez-nous.
          </h1>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#6B7280]">
            Que ce soit sur votre préparation, votre abonnement ou un bug
            rencontré sur la plateforme, notre équipe vous répond rapidement.
          </p>

          <div className="mt-10 space-y-5">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#1C1C1E]/10 bg-white shadow-sm">
                <Mail className="h-4 w-4 text-[#235C43]" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#1C1C1E]">Par email</p>
                <p className="text-sm text-[#6B7280]">contact@feuvert.fr</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#1C1C1E]/10 bg-white shadow-sm">
                <Clock className="h-4 w-4 text-[#235C43]" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#1C1C1E]">
                  Délai de réponse
                </p>
                <p className="text-sm text-[#6B7280]">Sous 24 à 48h ouvrées</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#1C1C1E]/10 bg-white shadow-sm">
                <MapPin className="h-4 w-4 text-[#235C43]" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#1C1C1E]">Basés en</p>
                <p className="text-sm text-[#6B7280]">France</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Colonne formulaire ── */}
        <div className="rounded-2xl border border-[#1C1C1E]/8 bg-white p-6 shadow-[6px_6px_0_rgba(0,0,0,0.06)] sm:p-8">
          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-[#C0392B]/20 bg-[#C0392B]/5 px-4 py-3">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#C0392B]" />
              <p className="text-sm text-[#C0392B]">{error}</p>
            </div>
          )}

          {statut === "success" && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-[#235C43]/25 bg-[#235C43]/6 px-4 py-3">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#235C43]" />
              <p className="text-sm font-medium text-[#235C43]">
                Message envoyé. Nous revenons vers vous très vite !
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Champ piège anti-spam : hors champ visuel, ignoré des humains,
                tentant pour les bots qui remplissent tout automatiquement. */}
            <input
              type="text"
              name="societe"
              tabIndex={-1}
              autoComplete="off"
              className="absolute left-[-9999px] h-0 w-0 opacity-0"
              aria-hidden="true"
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-[10px] font-bold uppercase tracking-[0.18em] text-[#6B7280]"
                >
                  Nom
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
            </div>

            <div>
              <label
                htmlFor="subject"
                className="mb-2 block text-[10px] font-bold uppercase tracking-[0.18em] text-[#6B7280]"
              >
                Sujet{" "}
                <span className="normal-case text-[#6B7280]/60">
                  (optionnel)
                </span>
              </label>
              <input
                id="subject"
                name="subject"
                placeholder="Question sur mon abonnement"
                autoComplete="off"
                className="w-full rounded-xl border border-[#1C1C1E]/10 bg-white px-4 py-3 text-sm text-[#1C1C1E] outline-none transition-all duration-200 placeholder:text-[#6B7280]/35 focus:border-[#235C43] focus:shadow-[4px_4px_0_rgba(35,92,67,0.1)]"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="mb-2 block text-[10px] font-bold uppercase tracking-[0.18em] text-[#6B7280]"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                placeholder="Écrivez votre message ici…"
                required
                rows={5}
                maxLength={5000}
                className="w-full resize-none rounded-xl border border-[#1C1C1E]/10 bg-white px-4 py-3 text-sm text-[#1C1C1E] outline-none transition-all duration-200 placeholder:text-[#6B7280]/35 focus:border-[#235C43] focus:shadow-[4px_4px_0_rgba(35,92,67,0.1)]"
              />
            </div>

            <button
              type="submit"
              disabled={enCours}
              className="group mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-[#1C1C1E] px-6 py-3.5 text-sm font-bold text-white shadow-[4px_4px_0_rgba(0,0,0,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#2a2a2c] hover:shadow-[4px_6px_0_rgba(0,0,0,0.18)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {statut === "loading" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Envoi en cours…
                </>
              ) : (
                <>
                  Envoyer le message
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
