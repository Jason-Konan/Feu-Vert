import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

/**
 * Vérifie que l'utilisateur connecté est bien un administrateur.
 * À appeler en haut de chaque Server Component / Server Action de l'admin.
 *
 * ⚠️ Adapte le nom du champ `role` et sa valeur ("ADMIN") si ton modèle
 * User (better-auth) utilise une convention différente (ex: isAdmin: boolean).
 */
export async function requireAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/connexion");
  }

  const role = (session.user as { role?: string }).role;

  if (role !== "ADMIN") {
    redirect("/");
  }

  return session;
}
