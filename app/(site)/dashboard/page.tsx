// app/dashboard/page.tsx

import Link from "next/link";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { Fredoka, Plus_Jakarta_Sans } from "next/font/google";
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
import { ProfileSection } from "@/components/site/profile-section";
import prisma from "@/lib/prisma";
import { BoutonPremium } from "@/components/site/bouton-premium";

/* ─────────────────────────────────────────────────────────────────── */
/*  Direction artistique v5 "Signalisation" (voir app/page.tsx).       */
/*  LigneDivision / Etiquette dupliqués ici — à extraire dans un        */
/*  fichier partagé (components/site/section-elements.tsx) si on les   */
/*  retrouve dans une 4e page.                                         */
/* ─────────────────────────────────────────────────────────────────── */

const display = Fredoka({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});

const body = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-body",
});

export const metadata = {
  title: "Tableau de bord · Feu Vert",
};

/* ------------------------------------------------------------------ */
/*  Types                                                               */
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

/** Tirets de peinture routière — identique à la home */
function LigneDivision({
  dark = false,
  className = "",
}: {
  dark?: boolean;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`w-full ${className}`}
      style={{
        height: "6px",
        background: dark
          ? "repeating-linear-gradient(90deg,rgba(255,255,255,0.22) 0px,rgba(255,255,255,0.22) 36px,transparent 36px,transparent 60px)"
          : "repeating-linear-gradient(90deg,#1C1C1E 0px,#1C1C1E 36px,transparent 36px,transparent 60px)",
      }}
    />
  );
}

/** Étiquette de section — identique à la home */
function Etiquette({
  children,
  light = false,
}: {
  children: React.ReactNode;
  light?: boolean;
}) {
  return (
    <span
      className={`inline-block border text-xs font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-md ${
        light
          ? "border-white/25 text-white/55"
          : "border-[#1C1C1E]/20 text-[#6B7280]"
      }`}
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Regroupe les essais bruts de Prisma par permis.                     */
/* ------------------------------------------------------------------ */
function regrouperParPermis(essais: EssaiBrut[]): ProgressionParPermis[] {
  const parSlug = new Map<string, EssaiBrut[]>();

  for (const essai of essais) {
    const liste = parSlug.get(essai.permisSlug) ?? [];
    liste.push(essai);
    parSlug.set(essai.permisSlug, liste);
  }

  return Array.from(parSlug.entries()).map(([slug, liste]) => {
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

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */
export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    redirect("/login");
  }

  const { user } = session;

  // Les deux requêtes sont indépendantes : on les lance en parallèle.
  const [essais, licenseTypesEnBase] = await Promise.all([
    prisma.quizAttempt.findMany({
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
    }),
    // On récupère uniquement les codes des types de permis actifs en base.
    prisma.licenseType.findMany({
      where: { isActive: true },
      select: { code: true },
    }),
  ]);

  const progressionParPermis = regrouperParPermis(essais);

  // Stats globales dérivées de la même liste.
  const totalEssais = essais.length;
  const essaisReussis = essais.filter((e) => e.passed).length;
  const meilleurScoreGlobal = essais.length
    ? Math.round(
        Math.max(...essais.map((e) => (e.score / e.totalQuestions) * 100)),
      )
    : 0;

  // 5 essais les plus récents.
  const derniersEssais = essais.slice(0, 5);

  // Ensemble des codes présents en base (recherche O(1)).
  const codesEnBase = new Set(licenseTypesEnBase.map((lt) => lt.code));

  // Permis avec au moins un essai utilisateur.
  const permisActifs = PERMIS.filter((p) =>
    progressionParPermis.some((pp) => pp.permisSlug === p.slug),
  );

  // Permis jamais tentés ET présents en base — seuls ceux-là ont du
  // contenu à proposer. Si la liste est vide on affiche "Aucun".
  const permisDisponibles = PERMIS.filter(
    (p) =>
      !progressionParPermis.some((pp) => pp.permisSlug === p.slug) &&
      codesEnBase.has(p.code),
  );

  return (
    <main
      className={`${display.variable} ${body.variable} min-h-screen bg-[#F9F9F7] font-[family-name:var(--font-body)] text-[#1C1C1E] antialiased`}
    >
      {/* ══════════════ EN-TÊTE ══════════════ */}
      <section className="bg-[#1C1C1E]">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <Etiquette light>Tableau de bord</Etiquette>
              <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-bold leading-none tracking-tight text-white sm:text-5xl">
                Bienvenue, {user.name || "candidat"}
              </h1>
              <p className="mt-3 text-sm text-white/40">{user.email}</p>
            </div>
            <SignOutButton />
          </div>

          <div className="mt-12">
            <LigneDivision dark />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        {/* ------------------- STATS GLOBALES ------------------- */}
        {totalEssais > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <CarteStat
              icone={<Target className="h-5 w-5" />}
              libelle="Essais effectués"
              valeur={totalEssais}
              accent="vert"
            />
            <CarteStat
              icone={<Trophy className="h-5 w-5" />}
              libelle="Essais réussis"
              valeur={essaisReussis}
              accent="jaune"
            />
            <CarteStat
              icone={<Flame className="h-5 w-5" />}
              libelle="Meilleur score"
              valeur={`${meilleurScoreGlobal}%`}
              accent="rouge"
            />
          </div>
        )}

        {/* ------------------- PROFIL ------------------- */}
        <ProfileSection
          user={{
            name: user.name,
            email: user.email,
            emailVerified: user.emailVerified,
            createdAt: user.createdAt,
          }}
        />

        {/* ------------------- PERMIS EN COURS ------------------- */}
        {permisActifs.length > 0 && (
          <div className="mt-12">
            <Etiquette>Vos permis</Etiquette>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-[#1C1C1E]">
              Permis en cours
            </h2>
            <p className="mt-1 text-sm text-[#6B7280]">
              Continuez là où vous en étiez.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {permisActifs.map((permis) => {
                const progression = progressionParPermis.find(
                  (p) => p.permisSlug === permis.slug,
                )!;
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
        )}

        {/* ------------------- EXPLORER / COMMENCER ------------------- */}
        {/*
          Section toujours affichée (guide les nouveaux utilisateurs et
          permet de découvrir de nouvelles catégories).
          Le contenu varie selon ce que la base de données expose.
        */}
        <div className="mt-12">
          <Etiquette>
            {permisActifs.length > 0 ? "Découvrir" : "Démarrage"}
          </Etiquette>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-[#1C1C1E]">
            {permisActifs.length > 0
              ? "Explorer d'autres permis"
              : "Commencer votre préparation"}
          </h2>
          <p className="mt-1 text-sm text-[#6B7280]">
            {permisActifs.length > 0
              ? "Ces catégories n'ont pas encore été tentées."
              : "Choisissez un permis pour démarrer vos révisions."}
          </p>

          {permisDisponibles.length > 0 ? (
            <div className="mt-6 space-y-3">
              {permisDisponibles.map((permis) => (
                <CartePermisDisponible
                  key={permis.slug}
                  slug={permis.slug}
                  code={permis.code}
                  Icone={permis.icon}
                />
              ))}
            </div>
          ) : (
            <p className="mt-6 text-sm text-[#6B7280]/70">
              Aucun permis disponible pour le moment.
            </p>
          )}
        </div>

        {/* ------------------- HISTORIQUE RÉCENT ------------------- */}
        {derniersEssais.length > 0 && (
          <div className="mt-12">
            <Etiquette>Historique</Etiquette>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-[#1C1C1E]">
              Essais récents
            </h2>

            <div className="mt-6 overflow-hidden rounded-xl border border-[#1C1C1E]/10 bg-white">
              <ul className="divide-y divide-[#1C1C1E]/8">
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
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white ${
                            essai.passed ? "bg-[#235C43]" : "bg-[#C0392B]"
                          }`}
                        >
                          {essai.permisCode}
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-[#1C1C1E]">
                            {essai.score}/{essai.totalQuestions} bonnes réponses
                          </p>
                          <p className="text-xs text-[#6B7280]">
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
                          essai.passed ? "text-[#235C43]" : "text-[#C0392B]"
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

        {/* ------------------- PREMIUM ------------------- */}
        <section
          id="premium"
          className="relative mt-12 overflow-hidden rounded-xl border-2 border-[#1C1C1E] bg-[#1C1C1E] p-8 text-center shadow-[6px_6px_0_rgba(0,0,0,0.18)] sm:p-10"
        >
          <Etiquette light>Premium</Etiquette>
          <h2 className="mt-4 font-[family-name:var(--font-display)] text-2xl font-semibold text-white sm:text-3xl">
            Passez premium
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-white/45">
            Tests illimités, banque de questions complète, mode examen
            chronométré et suivi détaillé de votre progression.
          </p>
          <div className="mt-6 flex justify-center">
            <BoutonPremium />
          </div>
        </section>
      </div>

      <div className="flex h-1.5 w-full">
        <div className="flex-1 bg-[#235C43]" />
        <div className="flex-1 bg-[#F5C800]" />
        <div className="flex-1 bg-[#C0392B]" />
      </div>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/*  Carte statistique globale                                           */
/* ------------------------------------------------------------------ */
const ACCENTS = {
  vert: { bg: "bg-[#235C43]/10", text: "text-[#235C43]" },
  jaune: { bg: "bg-[#F5C800]/20", text: "text-[#B98A2E]" },
  rouge: { bg: "bg-[#C0392B]/10", text: "text-[#C0392B]" },
} as const;

function CarteStat({
  icone,
  libelle,
  valeur,
  accent,
}: {
  icone: React.ReactNode;
  libelle: string;
  valeur: string | number;
  accent: keyof typeof ACCENTS;
}) {
  const couleurs = ACCENTS[accent];
  return (
    <div className="flex items-center gap-4 rounded-xl border border-[#1C1C1E]/10 bg-white p-5">
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${couleurs.bg} ${couleurs.text}`}
      >
        {icone}
      </span>
      <div>
        <p className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-[#1C1C1E]">
          {valeur}
        </p>
        <p className="text-xs font-medium text-[#6B7280]">{libelle}</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Carte permis avec progression                                       */
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
  progression: ProgressionParPermis;
}) {
  return (
    <div className="group rounded-xl border border-[#1C1C1E]/10 bg-white p-6 transition-all duration-200 hover:border-[#235C43]/35 hover:shadow-[4px_4px_0_#235C43]">
      <div className="flex items-center gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#F5C800] text-[#1C1C1E] transition-colors duration-200 group-hover:bg-[#235C43] group-hover:text-white">
          <Icone className="h-6 w-6" />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#6B7280]">
            Catégorie
          </p>
          <p className="font-[family-name:var(--font-display)] text-xl font-semibold text-[#1C1C1E]">
            Permis {code}
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#6B7280]">
            {progression.totalEssais} essai
            {progression.totalEssais > 1 ? "s" : ""}
          </span>
          <IndicateurTendance tendance={progression.tendance} />
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#6B7280]">Dernier score</span>
          <span className="font-semibold text-[#1C1C1E]">
            {progression.dernierPourcentage}%
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#6B7280]">Meilleur score</span>
          <span className="font-semibold text-[#1C1C1E]">
            {progression.meilleurPourcentage}%
          </span>
        </div>

        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#1C1C1E]/8">
          <div
            className="h-full rounded-full bg-[#235C43] transition-all"
            style={{ width: `${progression.meilleurPourcentage}%` }}
          />
        </div>
      </div>

      <div className="mt-5 flex gap-2">
        <Link
          href={`/permis/${slug}/cours`}
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-[#1C1C1E]/15 px-4 py-2 text-xs font-semibold text-[#1C1C1E] transition-colors duration-200 hover:border-[#235C43]/40 hover:text-[#235C43]"
        >
          <BookOpen className="h-3.5 w-3.5" />
          Cours
        </Link>
        <Link
          href={`/permis/${slug}/test`}
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-[#1C1C1E] px-4 py-2 text-xs font-semibold text-white transition-colors duration-200 hover:bg-[#235C43]"
        >
          Refaire un test
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Carte compacte pour un permis disponible en base, jamais tenté.     */
/* ------------------------------------------------------------------ */
function CartePermisDisponible({
  slug,
  code,
  Icone,
}: {
  slug: string;
  code: string;
  Icone: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-[#1C1C1E]/10 bg-white px-5 py-4">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#1C1C1E] text-white">
          <Icone className="h-5 w-5" />
        </span>
        <p className="font-[family-name:var(--font-display)] text-lg font-semibold text-[#1C1C1E]">
          Permis {code}
        </p>
      </div>

      <div className="flex shrink-0 gap-2">
        <Link
          href={`/permis/${slug}/cours`}
          className="inline-flex items-center gap-1.5 rounded-full border border-[#1C1C1E]/15 px-4 py-2 text-xs font-semibold text-[#1C1C1E] transition-colors duration-200 hover:border-[#235C43]/40 hover:text-[#235C43]"
        >
          <BookOpen className="h-3.5 w-3.5" />
          Cours
        </Link>
        <Link
          href={`/permis/${slug}/test`}
          className="inline-flex items-center gap-1.5 rounded-full bg-[#1C1C1E] px-4 py-2 text-xs font-semibold text-white transition-colors duration-200 hover:bg-[#235C43]"
        >
          Démarrer
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Indicateur de tendance                                              */
/* ------------------------------------------------------------------ */
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
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#C0392B]">
        <TrendingDown className="h-3.5 w-3.5" />
        En baisse
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-[#6B7280]">
      <Minus className="h-3.5 w-3.5" />
      Stable
    </span>
  );
}
