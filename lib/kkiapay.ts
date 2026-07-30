// lib/kkiapay.ts

import { kkiapay } from "@kkiapay-org/nodejs-sdk";

// Instance serveur, réutilisée pour toute vérification/remboursement.
export const kkiapayClient = kkiapay({
  privatekey: process.env.KKIAPAY_PRIVATE_KEY!,
  publickey: process.env.KKIAPAY_PUBLIC_KEY!,
  secretkey: process.env.KKIAPAY_SECRET_KEY!,
  sandbox: process.env.KKIAPAY_SANDBOX === "true",
});

export const PRIX_PREMIUM_XOF = 2000;
export const DUREE_ABONNEMENT_JOURS = 30;
