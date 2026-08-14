// lib/admin-guard.ts

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

/**
 * À appeler en tête de CHAQUE page/layout admin. Redirige vers le
 * dashboard normal si l'utilisateur n'est ni connecté ni admin —
 * centralisé ici pour ne pas dupliquer cette vérification dans
 * chaque page (DRY).
 */
export async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user || session.user.role !== "admin") {
    redirect("/dashboard");
  }

  return session;
}
