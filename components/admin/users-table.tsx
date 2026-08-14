// components/admin/users-table.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Ban, ShieldCheck, ShieldOff, Trash2, Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";

type UtilisateurAdmin = {
  id: string;
  name: string;
  email: string;
  role?: string | null;
  banned?: boolean | null;
  banReason?: string | null;
};

type UsersTableProps = {
  users: UtilisateurAdmin[];
  // Empêche un admin de se bannir/supprimer/rétrograder lui-même par erreur.
  utilisateurConnecteId: string;
};

export function UsersTable({ users, utilisateurConnecteId }: UsersTableProps) {
  const router = useRouter();
  // On ne bloque qu'UNE ligne à la fois pendant une action, pas tout le
  // tableau — meilleure UX si l'admin gère plusieurs comptes rapidement.
  const [chargementId, setChargementId] = useState<string | null>(null);

  // UPDATE — bascule utilisateur <-> admin
  async function basculerRole(user: UtilisateurAdmin) {
    const nouveauRole = user.role === "admin" ? "user" : "admin";
    setChargementId(user.id);
    try {
      await authClient.admin.setRole({ userId: user.id, role: nouveauRole });
      router.refresh(); // recharge les données serveur de la page
    } catch (err) {
      console.error(err);
      alert("Impossible de modifier le rôle.");
    } finally {
      setChargementId(null);
    }
  }

  // UPDATE — bascule actif <-> banni
  async function basculerBannissement(user: UtilisateurAdmin) {
    setChargementId(user.id);
    try {
      if (user.banned) {
        await authClient.admin.unbanUser({ userId: user.id });
      } else {
        const raison =
          prompt("Raison du bannissement (optionnel) :") ?? undefined;
        await authClient.admin.banUser({
          userId: user.id,
          banReason: raison || undefined,
        });
      }
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Impossible de modifier le statut de bannissement.");
    } finally {
      setChargementId(null);
    }
  }

  // DELETE — suppression définitive
  async function supprimerUtilisateur(user: UtilisateurAdmin) {
    const confirmation = confirm(
      `Supprimer définitivement le compte de ${user.email} ? Cette action est irréversible.`,
    );
    if (!confirmation) return;

    setChargementId(user.id);
    try {
      await authClient.admin.removeUser({ userId: user.id });
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Impossible de supprimer cet utilisateur.");
    } finally {
      setChargementId(null);
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3">Utilisateur</th>
            <th className="px-4 py-3">Rôle</th>
            <th className="px-4 py-3">Statut</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {users.map((user) => {
            // Sécurité : un admin ne doit pas pouvoir se bannir, se
            // supprimer ou se rétrograder lui-même (ça le verrouillerait
            // hors du dashboard). On désactive les boutons plutôt que de
            // compter uniquement sur le serveur pour bloquer ce cas.
            const estSoiMeme = user.id === utilisateurConnecteId;
            const enCours = chargementId === user.id;

            return (
              <tr key={user.id}>
                <td className="px-4 py-3">
                  <p className="font-medium text-slate-800">
                    {user.name || "—"}
                  </p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      user.role === "admin"
                        ? "bg-[#235C43]/10 text-[#235C43]"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {user.role === "admin" ? "Admin" : "Utilisateur"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {user.banned ? (
                    <span className="text-xs font-semibold text-[#A6402B]">
                      Banni{user.banReason ? ` — ${user.banReason}` : ""}
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">Actif</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    {enCours ? (
                      <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                    ) : (
                      <>
                        <button
                          onClick={() => basculerRole(user)}
                          disabled={estSoiMeme}
                          title={
                            estSoiMeme
                              ? "Vous ne pouvez pas modifier votre propre rôle"
                              : "Changer le rôle"
                          }
                          className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          <ShieldCheck className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => basculerBannissement(user)}
                          disabled={estSoiMeme}
                          title={user.banned ? "Débannir" : "Bannir"}
                          className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-[#A6402B] disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          {user.banned ? (
                            <ShieldOff className="h-4 w-4" />
                          ) : (
                            <Ban className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={() => supprimerUtilisateur(user)}
                          disabled={estSoiMeme}
                          title="Supprimer"
                          className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-[#A6402B]/10 hover:text-[#A6402B] disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}

          {users.length === 0 && (
            <tr>
              <td
                colSpan={4}
                className="px-4 py-10 text-center text-sm text-slate-400"
              >
                Aucun utilisateur trouvé.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
