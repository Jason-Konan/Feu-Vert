// lib/premium.ts

import prisma from "./prisma";

/**
 * Vérifie si l'utilisateur a un abonnement premium actif et non expiré.
 * Ne fait AUCUNE confiance au champ `status` seul : la date d'expiration
 * est la vérité (évite d'avoir à faire tourner un cron pour "expirer"
 * les abonnements — on vérifie à la volée).
 */
export async function estPremium(userId: string): Promise<boolean> {
  const abonnement = await prisma.subscription.findUnique({
    where: { userId },
    select: { status: true, expiresAt: true },
  });

  if (!abonnement || abonnement.status !== "ACTIVE") return false;
  if (!abonnement.expiresAt) return false;

  return abonnement.expiresAt > new Date();
}
