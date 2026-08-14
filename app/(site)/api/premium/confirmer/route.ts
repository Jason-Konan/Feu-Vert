// app/api/premium/confirmer/route.ts

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import {
  kkiapayClient,
  PRIX_PREMIUM_XOF,
  DUREE_ABONNEMENT_JOURS,
} from "@/lib/kkiapay";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { transactionId } = await req.json();
  if (typeof transactionId !== "string") {
    return NextResponse.json(
      { error: "transactionId manquant" },
      { status: 400 },
    );
  }

  // Idempotence : si ce transactionId a déjà été traité (ex. double appel
  // réseau côté client), on ne le retraite pas une seconde fois.
  const paiementExistant = await prisma.payment.findUnique({
    where: { kkiapayTransactionId: transactionId },
  });
  if (paiementExistant?.status === "SUCCESS") {
    return NextResponse.json({ ok: true, dejaTraite: true });
  }

  // Vérification RÉELLE auprès de Kkiapay — seule source de vérité sur
  // le montant effectivement payé et le statut de la transaction.
  let transaction;
  try {
    transaction = await kkiapayClient.verify(transactionId);
  } catch {
    return NextResponse.json(
      { error: "Impossible de vérifier la transaction" },
      { status: 502 },
    );
  }

  const estReussie = transaction.status === "SUCCESS";
  const montantCorrect = transaction.amount === PRIX_PREMIUM_XOF;

  await prisma.payment.upsert({
    where: { kkiapayTransactionId: transactionId },
    create: {
      userId: session.user.id,
      kkiapayTransactionId: transactionId,
      amount: transaction.amount,
      status: estReussie && montantCorrect ? "SUCCESS" : "FAILED",
      method: transaction.paymentMethod ?? null,
    },
    update: {
      status: estReussie && montantCorrect ? "SUCCESS" : "FAILED",
    },
  });

  if (!estReussie || !montantCorrect) {
    return NextResponse.json(
      { error: "Transaction invalide ou montant incorrect" },
      { status: 400 },
    );
  }

  // Activation/prolongation de l'abonnement. Si l'utilisateur a encore
  // du temps premium restant, on prolonge à partir de la date d'expiration
  // actuelle plutôt que d'écraser — utile pour les renouvellements anticipés.
  const abonnementActuel = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  });

  const maintenant = new Date();
  const dateDepart =
    abonnementActuel?.expiresAt && abonnementActuel.expiresAt > maintenant
      ? abonnementActuel.expiresAt
      : maintenant;

  const nouvelleExpiration = new Date(dateDepart);
  nouvelleExpiration.setDate(
    nouvelleExpiration.getDate() + DUREE_ABONNEMENT_JOURS,
  );

  await prisma.subscription.upsert({
    where: { userId: session.user.id },
    create: {
      userId: session.user.id,
      status: "ACTIVE",
      startedAt: maintenant,
      expiresAt: nouvelleExpiration,
    },
    update: {
      status: "ACTIVE",
      expiresAt: nouvelleExpiration,
    },
  });

  return NextResponse.json({ ok: true });
}
