// app/permis/[code]/test/page.tsx

import Link from "next/link";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { Barlow_Condensed, Work_Sans } from "next/font/google";
import { ArrowLeft } from "lucide-react";
import { getPermisBySlug, PERMIS } from "@/lib/data/permis";
import { TestClient } from "@/components/site/test-client";
import { auth } from "@/lib/auth"; // instance serveur de better-auth
import prisma from "@/lib/prisma";
import { estPremium } from "@/lib/premium";
import { BoutonPremium } from "@/components/site/bouton-premium";

const display = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
});

const body = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

type PageProps = {
  params: Promise<{ code: string }>;
};

export function generateStaticParams() {
  return PERMIS.map((permis) => ({ code: permis.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { code } = await params;
  const permis = getPermisBySlug(code);
  if (!permis) return {};
  return {
    title: `Test blanc · Permis ${permis.code} · Feu Vert`,
    description: `Passez un test blanc dans les conditions de l'examen pour le permis ${permis.code}.`,
  };
}

/**
 * Récupère les données de progression de l'utilisateur sur CE permis
 * uniquement : son dernier essai et son meilleur score en pourcentage.
 * Retourne `null` si l'utilisateur n'a jamais tenté ce permis.
 */
async function getProgressionUtilisateur(userId: string, permisSlug: string) {
  const essais = await prisma.quizAttempt.findMany({
    where: { userId, permisSlug },
    orderBy: { createdAt: "desc" },
    select: { score: true, totalQuestions: true, createdAt: true },
  });

  if (essais.length === 0) return null;

  const dernierEssai = essais[0];
  const meilleurPourcentage = Math.round(
    Math.max(...essais.map((e) => (e.score / e.totalQuestions) * 100)),
  );

  return {
    totalEssais: essais.length,
    dernierPourcentage: Math.round(
      (dernierEssai.score / dernierEssai.totalQuestions) * 100,
    ),
    meilleurPourcentage,
  };
}

export default async function TestPage({ params }: PageProps) {
  const { code } = await params;
  const permis = getPermisBySlug(code);
  if (!permis) notFound();

  // Session récupérée côté serveur : pas de flash "non connecté" au chargement.
  const session = await auth.api.getSession({ headers: await headers() });

  const utilisateurPremium = session?.user
    ? await estPremium(session.user.id)
    : false;

  // Limite gratuite : 1 test par jour et par permis.
  let quotaAtteint = true;
  if (session?.user && !utilisateurPremium) {
    const debutJournee = new Date();
    debutJournee.setHours(0, 0, 0, 0);

    const essaisAujourdhui = await prisma.quizAttempt.count({
      where: {
        userId: session.user.id,
        permisSlug: permis.slug,
        createdAt: { gte: debutJournee },
      },
    });
    quotaAtteint = essaisAujourdhui >= 1;
  }

  const progression = session?.user
    ? await getProgressionUtilisateur(session.user.id, permis.slug)
    : null;

  return (
    <main
      className={`${display.variable} ${body.variable} min-h-screen bg-[#EEECE4] font-[family-name:var(--font-body)] text-slate-800 antialiased`}
    >
      {/* ------------------- EN-TÊTE ------------------- */}
      <section className="bg-[#1B1D1F]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <Link
            href={`/permis/${permis.slug}/cours`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Cours · Permis {permis.code}
          </Link>

          <div className="mt-8 flex items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white ring-1 ring-white/20 backdrop-blur-sm">
              <permis.icon className="h-7 w-7" />
            </span>
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Test blanc · Catégorie {permis.code}
              </span>
              <h1 className="font-[family-name:var(--font-display)] text-4xl font-bold leading-none tracking-tight text-white sm:text-5xl">
                Passez votre test
              </h1>
            </div>
          </div>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">
            Répondez à chaque question comme si vous étiez le jour de
            l&apos;examen. Le corrigé et l&apos;explication s&apos;affichent
            après chaque réponse, et votre score final s&apos;affiche à la fin.
          </p>
        </div>
      </section>

      {/* ------------------- QUIZ (composant client) ------------------- */}
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        {/* <TestClient
          permisSlug={permis.slug}
          permisCode={permis.code}
          estConnecte={!!session?.user}
          progressionInitiale={progression}
        /> */}
        {quotaAtteint ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
            <p className="text-sm font-medium text-slate-600">
              Vous avez atteint votre limite de test gratuit pour
              aujourd&apos;hui.
            </p>
            <div className="mt-4 flex justify-center">
              <BoutonPremium />
            </div>
          </div>
        ) : (
          <TestClient
            permisSlug={permis.slug}
            permisCode={permis.code}
            estConnecte={!!session?.user}
            progressionInitiale={progression}
          />
        )}
      </section>

      <div className="flex h-1 w-full">
        <div className="flex-1 bg-[#235C43]" />
        <div className="flex-1 bg-[#B98A2E]" />
        <div className="flex-1 bg-[#A6402B]" />
      </div>
    </main>
  );
}
