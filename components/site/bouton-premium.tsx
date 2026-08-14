// components/site/bouton-premium.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Crown, Loader2 } from "lucide-react";

const PRIX_PREMIUM_XOF = 2000;

// Kkiapay attache ses écouteurs sur `window` une fois son script chargé ;
// on type minimalement l'API dont on a besoin plutôt que d'importer
// un typage tiers.
declare global {
  interface Window {
    openKkiapayWidget?: (config: Record<string, unknown>) => void;
    addSuccessListener?: (
      cb: (response: { transactionId: string }) => void,
    ) => void;
    addFailedListener?: (cb: (response: unknown) => void) => void;
    removeKkiapayListener?: (event: "success" | "failed") => void;
  }
}

export function BoutonPremium() {
  const router = useRouter();
  const { data: session } = useSession();
  const [enCours, setEnCours] = useState(false);

  useEffect(() => {
    if (!window.addSuccessListener) return;

    // Écouteur global : se déclenche quand le widget confirme un paiement
    // côté client. On envoie ensuite le transactionId au serveur pour la
    // VRAIE vérification — ne jamais faire confiance à ce seul événement,
    // un utilisateur malveillant pourrait le déclencher sans payer.
    window.addSuccessListener(async (response) => {
      setEnCours(true);
      try {
        const res = await fetch("/api/premium/confirmer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transactionId: response.transactionId }),
        });

        if (res.ok) {
          router.refresh(); // recharge la session/les données serveur
          router.push("/dashboard?premium=active");
        } else {
          alert(
            "Le paiement a été reçu mais n'a pas pu être confirmé. Contactez le support avec votre référence.",
          );
        }
      } finally {
        setEnCours(false);
      }
    });

    return () => window.removeKkiapayListener?.("success");
  }, [router]);

  function ouvrirPaiement() {
    if (!session?.user) {
      router.push("/login");
      return;
    }

    if (!window.openKkiapayWidget) {
      alert(
        "Le module de paiement n'a pas fini de charger. Rechargez la page et réessayez.",
      );
      return;
    }

    if (!process.env.NEXT_PUBLIC_KKIAPAY_PUBLIC_KEY) {
      console.error("NEXT_PUBLIC_KKIAPAY_PUBLIC_KEY est manquante");
      alert("Configuration de paiement incomplète. Contactez le support.");
      return;
    }

    window.openKkiapayWidget({
      amount: PRIX_PREMIUM_XOF,
      key: process.env.NEXT_PUBLIC_KKIAPAY_PUBLIC_KEY,
      sandbox: process.env.NEXT_PUBLIC_KKIAPAY_SANDBOX === "true",
      data: JSON.stringify({ userId: session.user.id }),
    });
  }

  return (
    <button
      onClick={ouvrirPaiement}
      disabled={enCours}
      className="inline-flex items-center gap-2 rounded-full bg-[#B98A2E] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#96701f] disabled:opacity-60"
    >
      {enCours ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Crown className="h-4 w-4" />
      )}
      Passer premium — {PRIX_PREMIUM_XOF} F CFA / mois
    </button>
  );
}
