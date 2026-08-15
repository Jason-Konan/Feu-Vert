import { cache } from "react";
import prisma from "@/lib/prisma";

/**
 * Récupère les types de permis actifs, triés par ordre.
 * cache() de React mémorise le résultat pour la durée d'une seule
 * requête/rendu — évite les doublons de requête si plusieurs composants
 * l'appellent dans le même arbre (home, /permis, etc.), sans persister
 * entre requêtes (contrairement à unstable_cache).
 */
export const getActiveLicenseTypes = cache(async () => {
  return prisma.licenseType.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });
});

export type ActiveLicenseType = Awaited<
  ReturnType<typeof getActiveLicenseTypes>
>[number];
