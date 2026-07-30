// app/dashboard/page.tsx

import Link from "next/link";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { Barlow_Condensed, Work_Sans } from "next/font/google";
import {
  Trophy,
  Target,
  Flame,
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { auth } from "@/lib/auth";
import { PERMIS } from "@/lib/data/permis";
import { SignOutButton } from "@/components/site/sign-out-button";
import prisma from "@/lib/prisma";
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

export const metadata = {
  title: "Tableau de bord · Feu Vert",
};

/* ------------------------------------------------------------------ */
/*  Regroupe les essais bruts de Prisma par permis, et calcule pour     */
/*  chacun : nombre d'essais, meilleur score, dernier score, tendance.  */
/* ------------------------------------------------------------------ */
type EssaiBrut = {
  permisSlug: string;
  permisCode: string;
  score: number;
  totalQuestions: number;
  passed: boolean;
  createdAt: Date;
};

type ProgressionParPermis = {
  permisSlug: string;
  permisCode: string;
  totalEssais: number;
  meilleurPourcentage: number;
  dernierPourcentage: number;
  tendance: "hausse" | "baisse" | "stable";
  dernierEssaiLe: Date;
};

function regrouperParPermis(essais: EssaiBrut[]): ProgressionParPermis[] {
  const parSlug = new Map<string, EssaiBrut[]>();

  for (const essai of essais) {
    const liste = parSlug.get(essai.permisSlug) ?? [];
    liste.push(essai);
    parSlug.set(essai.permisSlug, liste);
  }

  return Array.from(parSlug.entries()).map(([slug, liste]) => {
    // `essais` est déjà trié du plus récent au plus ancien (voir la requête).
    const [dernier, avantDernier] = liste;
    const dernierPourcentage = Math.round(
      (dernier.score / dernier.totalQuestions) * 100,
    );
    const meilleurPourcentage = Math.round(
      Math.max(...liste.map((e) => (e.score / e.totalQuestions) * 100)),
    );

    let tendance: ProgressionParPermis["tendance"] = "stable";
    if (avantDernier) {
      const precedentPourcentage = Math.round(
        (avantDernier.score / avantDernier.totalQuestions) * 100,
      );
      if (dernierPourcentage > precedentPourcentage) tendance = "hausse";
      else if (dernierPourcentage < precedentPourcentage) tendance = "baisse";
    }

    return {
      permisSlug: slug,
      permisCode: dernier.permisCode,
      totalEssais: liste.length,
      meilleurPourcentage,
      dernierPourcentage,
      tendance,
      dernierEssaiLe: dernier.createdAt,
    };
  });
}

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    redirect("/sign-in");
  }

  const { user } = session;

  const essais = await prisma.quizAttempt.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    select: {
      permisSlug: true,
      permisCode: true,
      score: true,
      totalQuestions: true,
      passed: true,
      createdAt: true,
    },
  });

  const progressionParPermis = regrouperParPermis(essais);

  // Stats globales, dérivées de la même liste — pas de requête séparée.
  const totalEssais = essais.length;
  const essaisReussis = essais.filter((e) => e.passed).length;
  const meilleurScoreGlobal = essais.length
    ? Math.round(
        Math.max(...essais.map((e) => (e.score / e.totalQuestions) * 100)),
      )
    : 0;

  // Les 5 essais les plus récents, tous permis confondus.
  const derniersEssais = essais.slice(0, 5);

  return (
    <main
      className={`${display.variable} ${body.variable} min-h-screen bg-[#EEECE4] font-[family-name:var(--font-body)] text-slate-800 antialiased`}
    >
      {/* ------------------- EN-TÊTE ------------------- */}
      <section className="bg-[#1B1D1F]">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Tableau de bord
              </span>
              <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl font-bold leading-none tracking-tight text-white sm:text-5xl">
                Bienvenue, {user.name || "candidat"}
              </h1>
              <p className="mt-3 text-sm text-slate-400">{user.email}</p>
            </div>
            <SignOutButton />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        {/* ------------------- STATS GLOBALES ------------------- */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <CarteStat
            icone={<Target className="h-5 w-5" />}
            libelle="Essais effectués"
            valeur={totalEssais}
          />
          <CarteStat
            icone={<Trophy className="h-5 w-5" />}
            libelle="Essais réussis"
            valeur={essaisReussis}
          />
          <CarteStat
            icone={<Flame className="h-5 w-5" />}
            libelle="Meilleur score"
            valeur={`${meilleurScoreGlobal}%`}
          />
        </div>

        {/* ------------------- PROGRESSION PAR PERMIS ------------------- */}
        <div className="mt-12">
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-slate-900">
            Vos permis
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Reprenez vos cours ou lancez un nouveau test blanc.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {PERMIS.map((permis) => {
              const progression = progressionParPermis.find(
                (p) => p.permisSlug === permis.slug,
              );
              return (
                <CartePermis
                  key={permis.slug}
                  slug={permis.slug}
                  code={permis.code}
                  Icone={permis.icon}
                  progression={progression}
                />
              );
            })}
          </div>
        </div>

        {/* ------------------- DERNIERS ESSAIS ------------------- */}
        {derniersEssais.length > 0 && (
          <div className="mt-12">
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-slate-900">
              Historique récent
            </h2>

            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <ul className="divide-y divide-slate-100">
                {derniersEssais.map((essai, i) => {
                  const pourcentage = Math.round(
                    (essai.score / essai.totalQuestions) * 100,
                  );
                  return (
                    <li
                      key={i}
                      className="flex items-center justify-between gap-4 p-4 sm:p-5"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold text-white ${
                            essai.passed ? "bg-[#235C43]" : "bg-[#A6402B]"
                          }`}
                        >
                          {essai.permisCode}
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">
                            {essai.score}/{essai.totalQuestions} bonnes réponses
                          </p>
                          <p className="text-xs text-slate-400">
                            {new Date(essai.createdAt).toLocaleDateString(
                              "fr-FR",
                              {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              },
                            )}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`shrink-0 text-sm font-bold ${
                          essai.passed ? "text-[#235C43]" : "text-[#A6402B]"
                        }`}
                      >
                        {pourcentage}%
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        )}

        {/* ------------------- ÉTAT VIDE ------------------- */}
        {totalEssais === 0 && (
          <div className="mt-12 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <p className="text-sm font-medium text-slate-500">
              Vous n&apos;avez encore passé aucun test blanc.
            </p>
            <p className="mt-1 text-sm text-slate-400">
              Choisissez un permis ci-dessus pour commencer.
            </p>
          </div>
        )}
      </div>
      <section
        id="premium"
        className="mt-12 rounded-2xl border border-slate-200 bg-white p-8 text-center"
      >
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-slate-900">
          Passez premium
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
          Tests illimités, banque de questions complète, mode examen chronométré
          et suivi détaillé de votre progression.
        </p>
        <div className="mt-5 flex justify-center">
          <BoutonPremium />
        </div>
      </section>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/*  Petite carte de statistique globale, réutilisée trois fois.         */
/* ------------------------------------------------------------------ */
function CarteStat({
  icone,
  libelle,
  valeur,
}: {
  icone: React.ReactNode;
  libelle: string;
  valeur: string | number;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#235C43]/10 text-[#235C43]">
        {icone}
      </span>
      <div>
        <p className="text-2xl font-bold tracking-tight text-slate-900">
          {valeur}
        </p>
        <p className="text-xs font-medium text-slate-500">{libelle}</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Carte "permis" : affiche soit la progression de l'utilisateur sur   */
/*  ce permis, soit une invitation à démarrer s'il n'a rien tenté.      */
/* ------------------------------------------------------------------ */
function CartePermis({
  slug,
  code,
  Icone,
  progression,
}: {
  slug: string;
  code: string;
  Icone: React.ComponentType<{ className?: string }>;
  progression?: ProgressionParPermis;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex items-center gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#1B1D1F] text-white">
          <Icone className="h-6 w-6" />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
            Catégorie
          </p>
          <p className="font-[family-name:var(--font-display)] text-xl font-bold text-slate-900">
            Permis {code}
          </p>
        </div>
      </div>

      {progression ? (
        <div className="mt-5 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">
              {progression.totalEssais} essai
              {progression.totalEssais > 1 ? "s" : ""}
            </span>
            <IndicateurTendance tendance={progression.tendance} />
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Dernier score</span>
            <span className="font-semibold text-slate-800">
              {progression.dernierPourcentage}%
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Meilleur score</span>
            <span className="font-semibold text-slate-800">
              {progression.meilleurPourcentage}%
            </span>
          </div>

          {/* Barre de progression basée sur le meilleur score */}
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-[#235C43] transition-all"
              style={{ width: `${progression.meilleurPourcentage}%` }}
            />
          </div>
        </div>
      ) : (
        <p className="mt-5 text-sm text-slate-500">
          Aucun test passé pour l&apos;instant.
        </p>
      )}

      <div className="mt-5 flex gap-2">
        <Link
          href={`/permis/${slug}/cours`}
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 transition-colors hover:border-[#235C43]/30 hover:text-[#235C43]"
        >
          <BookOpen className="h-3.5 w-3.5" />
          Cours
        </Link>
        <Link
          href={`/permis/${slug}/test`}
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-[#1B1D1F] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#235C43]"
        >
          {progression ? "Refaire un test" : "Démarrer"}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}

function IndicateurTendance({
  tendance,
}: {
  tendance: ProgressionParPermis["tendance"];
}) {
  if (tendance === "hausse") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#235C43]">
        <TrendingUp className="h-3.5 w-3.5" />
        En progression
      </span>
    );
  }
  if (tendance === "baisse") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#A6402B]">
        <TrendingDown className="h-3.5 w-3.5" />
        En baisse
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-400">
      <Minus className="h-3.5 w-3.5" />
      Stable
    </span>
  );
}
