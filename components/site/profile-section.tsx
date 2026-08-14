"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Pencil,
  Check,
  X,
  Mail,
  ShieldCheck,
  ShieldAlert,
  Calendar,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

interface ProfileSectionProps {
  user: {
    name: string;
    email: string;
    emailVerified: boolean;
    createdAt: Date;
  };
}

export function ProfileSection({ user }: ProfileSectionProps) {
  const router = useRouter();

  /* ---------- Nom ---------- */
  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState(user.name);
  // FIX: committedName tracks the last successfully saved name so the
  // display updates immediately — without waiting for router.refresh().
  const [committedName, setCommittedName] = useState(user.name);
  const [savingName, setSavingName] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);

  async function handleSaveName() {
    if (!name.trim()) return;
    setSavingName(true);
    setNameError(null);

    const res = await authClient.updateUser({ name: name.trim() });

    setSavingName(false);
    if (res.error) {
      setNameError(res.error.message || "Impossible de mettre à jour le nom.");
      return;
    }

    // FIX: persist the new name locally before closing edit mode,
    // so the display reflects the change instantly.
    const saved = name.trim();
    setCommittedName(saved);
    setEditingName(false);
    router.refresh(); // still syncs server state in the background
  }

  /* ---------- Vérification email ---------- */
  const [resendStatut, setResendStatut] = useState<
    "idle" | "loading" | "sent" | "error"
  >("idle");

  async function handleResendVerification() {
    setResendStatut("loading");
    const res = await authClient.sendVerificationEmail({
      email: user.email,
      callbackURL: "/dashboard",
    });
    setResendStatut(res.error ? "error" : "sent");
  }

  /* ---------- Mot de passe ---------- */
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [pwStatut, setPwStatut] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [pwError, setPwError] = useState<string | null>(null);

  async function handleChangePassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPwError(null);

    if (pwForm.next !== pwForm.confirm) {
      setPwError("Les deux mots de passe ne correspondent pas.");
      setPwStatut("error");
      return;
    }
    if (pwForm.next.length < 8) {
      setPwError(
        "Le nouveau mot de passe doit contenir au moins 8 caractères.",
      );
      setPwStatut("error");
      return;
    }

    setPwStatut("loading");
    const res = await authClient.changePassword({
      currentPassword: pwForm.current,
      newPassword: pwForm.next,
      revokeOtherSessions: true,
    });

    if (res.error) {
      setPwError(res.error.message || "Impossible de changer le mot de passe.");
      setPwStatut("error");
      return;
    }

    setPwStatut("success");
    setPwForm({ current: "", next: "", confirm: "" });
  }

  // FIX: derive initial from committedName, not user.name (prop),
  // so the avatar updates immediately after saving.
  const initiale = (committedName || user.email || "?")
    .trim()
    .charAt(0)
    .toUpperCase();

  return (
    <div className="mt-12">
      <span className="inline-block rounded-md border border-[#1C1C1E]/20 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#6B7280]">
        Compte
      </span>
      <h2 className="mt-3 font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-[#1C1C1E]">
        Profil
      </h2>
      <p className="mt-1 text-sm text-[#6B7280]">
        Gérez vos informations personnelles et votre sécurité.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* ------- Carte identité ------- */}
        <div className="rounded-xl border border-[#1C1C1E]/10 bg-white p-6">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#1C1C1E] text-lg font-bold text-white">
              {initiale}
            </span>
            <div className="min-w-0 flex-1">
              {editingName ? (
                <div className="flex items-center gap-2">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoFocus
                    className="w-full rounded-lg border border-[#1C1C1E]/15 px-2.5 py-1.5 text-sm font-semibold text-[#1C1C1E] outline-none focus:border-[#235C43] focus:ring-1 focus:ring-[#235C43]"
                  />
                  <button
                    onClick={handleSaveName}
                    disabled={savingName}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#235C43] text-white disabled:opacity-60"
                    aria-label="Enregistrer"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      setEditingName(false);
                      // FIX: reset to committedName (last saved), not user.name (stale prop).
                      setName(committedName);
                      setNameError(null);
                    }}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#1C1C1E]/15 text-[#6B7280]"
                    aria-label="Annuler"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {/* FIX: display committedName instead of user.name */}
                  <p className="truncate text-base font-bold text-[#1C1C1E]">
                    {committedName}
                  </p>
                  <button
                    onClick={() => setEditingName(true)}
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[#6B7280] hover:bg-[#1C1C1E]/5 hover:text-[#1C1C1E]"
                    aria-label="Modifier le nom"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
              {nameError && (
                <p className="mt-1 text-xs text-[#C0392B]">{nameError}</p>
              )}

              <p className="mt-1 flex items-center gap-1.5 text-sm text-[#6B7280]">
                <Mail className="h-3.5 w-3.5" />
                {user.email}
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            {user.emailVerified ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#235C43]/10 px-3 py-1 text-xs font-semibold text-[#235C43]">
                <ShieldCheck className="h-3.5 w-3.5" />
                Email vérifié
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#C0392B]/10 px-3 py-1 text-xs font-semibold text-[#C0392B]">
                <ShieldAlert className="h-3.5 w-3.5" />
                Email non vérifié
              </span>
            )}

            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1C1C1E]/5 px-3 py-1 text-xs font-medium text-[#6B7280]">
              <Calendar className="h-3.5 w-3.5" />
              Membre depuis{" "}
              {new Date(user.createdAt).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>

          {!user.emailVerified && (
            <div className="mt-4">
              {resendStatut === "sent" ? (
                <p className="text-xs font-medium text-[#235C43]">
                  Email de vérification envoyé — pensez à vérifier vos spams.
                </p>
              ) : (
                <button
                  onClick={handleResendVerification}
                  disabled={resendStatut === "loading"}
                  className="text-xs font-semibold text-[#1C1C1E] underline underline-offset-2 hover:text-[#235C43] disabled:opacity-60"
                >
                  {resendStatut === "loading"
                    ? "Envoi en cours…"
                    : "Renvoyer l'email de vérification"}
                </button>
              )}
              {resendStatut === "error" && (
                <p className="mt-1 text-xs text-[#C0392B]">
                  L&apos;envoi a échoué, réessayez dans un instant.
                </p>
              )}
            </div>
          )}
        </div>

        {/* ------- Carte mot de passe ------- */}
        <div className="rounded-xl border border-[#1C1C1E]/10 bg-white p-6">
          <p className="text-sm font-bold text-[#1C1C1E]">
            Changer le mot de passe
          </p>
          <p className="mt-1 text-xs text-[#6B7280]">
            Vous serez déconnecté des autres appareils après ce changement.
          </p>

          <form onSubmit={handleChangePassword} className="mt-4 space-y-3">
            <input
              type="password"
              placeholder="Mot de passe actuel"
              required
              autoComplete="current-password"
              value={pwForm.current}
              onChange={(e) =>
                setPwForm((f) => ({ ...f, current: e.target.value }))
              }
              className="w-full rounded-lg border border-[#1C1C1E]/15 px-3 py-2 text-sm text-[#1C1C1E] outline-none focus:border-[#235C43] focus:ring-1 focus:ring-[#235C43]"
            />
            <input
              type="password"
              placeholder="Nouveau mot de passe"
              required
              minLength={8}
              autoComplete="new-password"
              value={pwForm.next}
              onChange={(e) =>
                setPwForm((f) => ({ ...f, next: e.target.value }))
              }
              className="w-full rounded-lg border border-[#1C1C1E]/15 px-3 py-2 text-sm text-[#1C1C1E] outline-none focus:border-[#235C43] focus:ring-1 focus:ring-[#235C43]"
            />
            <input
              type="password"
              placeholder="Confirmer le nouveau mot de passe"
              required
              minLength={8}
              autoComplete="new-password"
              value={pwForm.confirm}
              onChange={(e) =>
                setPwForm((f) => ({ ...f, confirm: e.target.value }))
              }
              className="w-full rounded-lg border border-[#1C1C1E]/15 px-3 py-2 text-sm text-[#1C1C1E] outline-none focus:border-[#235C43] focus:ring-1 focus:ring-[#235C43]"
            />

            {pwError && <p className="text-xs text-[#C0392B]">{pwError}</p>}
            {pwStatut === "success" && (
              <p className="text-xs font-medium text-[#235C43]">
                Mot de passe mis à jour.
              </p>
            )}

            <button
              type="submit"
              disabled={pwStatut === "loading"}
              className="w-full rounded-full bg-[#1C1C1E] px-4 py-2.5 text-xs font-semibold text-white transition-colors duration-200 hover:bg-[#235C43] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pwStatut === "loading"
                ? "Mise à jour…"
                : "Mettre à jour le mot de passe"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
