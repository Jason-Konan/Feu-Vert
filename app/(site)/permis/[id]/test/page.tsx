// app/permis/[id]/test/page.tsx

import Link from "next/link";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { Fredoka, Plus_Jakarta_Sans } from "next/font/google";
import { ArrowLeft, ListChecks, Timer, ShieldCheck } from "lucide-react";
import prisma from "@/lib/prisma";
import { TestClient } from "@/components/site/test-client";
import { auth } from "@/lib/auth";
import { estPremium } from "@/lib/premium";
import { BoutonPremium } from "@/components/site/bouton-premium";

/* ─────────────────────────────────────────────────────────────────── */
/*  Cette page reprend la direction artistique v5 "Signalisation" de   */
/*  la home : bitume + jaune signal, tirets de marquage, ombres        */
/*  offset plates, badges "Etiquette". Si LigneDivision / Etiquette    */
/*  sont amenés à servir ailleurs, il vaut la peine de les extraire    */
/*  dans components/site/section-elements.tsx et de les importer des   */
/*  deux côtés plutôt que de les dupliquer.                            */
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

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const licenseType = await prisma.licenseType.findUnique({ where: { id } });
  if (!licenseType) return {};
  return {
    title: `Test blanc · Permis ${licenseType.code} · Feu Vert`,
    description: `Passez un test blanc dans les conditions de l'examen pour le permis ${licenseType.code}.`,
  };
}

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

/**
 * Progression de l'utilisateur sur CE permis, tous tests confondus
 * (QuizAttempt est lié à un permisCode, pas à un Test précis).
 */
async function getProgressionUtilisateur(userId: string, permisCode: string) {
  const essais = await prisma.quizAttempt.findMany({
    where: { userId, permisCode },
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
  const { id } = await params;

  const licenseType = await prisma.licenseType.findUnique({
    where: { id, isActive: true },
  });
  if (!licenseType) notFound();

  // Le premier test publié pour ce permis, avec ses questions et options
  // (isCorrect volontairement exclu : jamais envoyé au client avant
  // qu'il ait répondu — voir lib/actions/quiz.ts).
  const test = await prisma.test.findFirst({
    where: { licenseTypeId: licenseType.id, isPublished: true },
    orderBy: { createdAt: "asc" },
    include: {
      questions: {
        orderBy: { order: "asc" },
        include: {
          options: {
            orderBy: { order: "asc" },
            select: { id: true, text: true, order: true },
          },
        },
      },
    },
  });

  const session = await auth.api.getSession({ headers: await headers() });

  const utilisateurPremium = session?.user
    ? await estPremium(session.user.id)
    : false;

  let quotaAtteint = true;
  if (session?.user && !utilisateurPremium) {
    const debutJournee = new Date();
    debutJournee.setHours(0, 0, 0, 0);

    const essaisAujourdhui = await prisma.quizAttempt.count({
      where: {
        userId: session.user.id,
        permisCode: licenseType.code,
        createdAt: { gte: debutJournee },
      },
    });
    quotaAtteint = essaisAujourdhui >= 1;
  }

  const progression = session?.user
    ? await getProgressionUtilisateur(session.user.id, licenseType.code)
    : null;

  return (
    <main
      className={`${display.variable} ${body.variable} min-h-screen bg-[#F9F9F7] font-[family-name:var(--font-body)] text-[#1C1C1E] antialiased`}
    >
      {/* ══════════════ EN-TÊTE ══════════════ */}
      <section className="bg-[#1C1C1E]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <Link
            href={`/permis/${licenseType.id}/cours`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/40 transition-colors duration-200 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Cours · Permis {licenseType.code}
          </Link>

          <div className="mt-8 flex items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#F5C800] text-[#1C1C1E] shadow-[4px_4px_0_rgba(0,0,0,0.3)]">
              <ListChecks className="h-7 w-7" />
            </span>
            <div>
              <Etiquette light>
                Test blanc · Catégorie {licenseType.code}
              </Etiquette>
              <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl font-bold leading-none tracking-tight text-white sm:text-5xl">
                Passez votre test
              </h1>
            </div>
          </div>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/45">
            Répondez à chaque question comme si vous étiez le jour de
            l&apos;examen. Le corrigé et l&apos;explication s&apos;affichent
            après chaque réponse, et votre score final s&apos;affiche à la fin.
          </p>

          {progression && (
            <div className="mt-8 inline-flex items-center gap-3 rounded-xl border-2 border-white/10 bg-white/[0.04] px-4 py-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-[#F5C800]">
                <ShieldCheck className="h-4 w-4" />
              </span>
              <p className="text-sm text-white/70">
                Meilleur score :{" "}
                <span className="font-bold text-[#F5C800]">
                  {progression.meilleurPourcentage}%
                </span>{" "}
                sur {progression.totalEssais}{" "}
                {progression.totalEssais > 1 ? "essais" : "essai"}
              </p>
            </div>
          )}

          <div className="mt-12">
            <LigneDivision dark />
          </div>
        </div>
      </section>

      {/* ══════════════ QUIZ (composant client) ══════════════ */}
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        {!test || test.questions.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-[#1C1C1E]/15 bg-white p-10 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-[#F9F9F7] text-[#6B7280]">
              <ListChecks className="h-6 w-6" />
            </span>
            <p className="mt-4 text-sm font-semibold text-[#1C1C1E]">
              Aucun test n&apos;est encore disponible pour ce permis.
            </p>
          </div>
        ) : quotaAtteint ? (
          <div className="rounded-xl border-2 border-dashed border-[#1C1C1E]/15 bg-white p-10 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-[#F5C800]/15 text-[#B98A2E]">
              <Timer className="h-6 w-6" />
            </span>
            <p className="mt-4 text-sm font-semibold text-[#1C1C1E]">
              Vous avez atteint votre limite de test gratuit pour
              aujourd&apos;hui.
            </p>
            <p className="mt-1.5 text-sm text-[#6B7280]">
              Passez en Premium pour des examens blancs illimités.
            </p>
            <div className="mt-5 flex justify-center">
              <BoutonPremium />
            </div>
          </div>
        ) : (
          <div className="rounded-xl border-2 border-[#1C1C1E] bg-white shadow-[6px_6px_0_#1C1C1E]">
            <TestClient
              testId={test.id}
              permisCode={licenseType.code}
              passingScore={test.passingScore}
              questions={test.questions.map((q) => ({
                id: q.id,
                text: q.text,
                imageUrl: q.imageUrl,
                options: q.options.map((o) => ({ id: o.id, text: o.text })),
              }))}
              estConnecte={!!session?.user}
              progressionInitiale={progression}
            />
          </div>
        )}
      </section>

      <div className="flex h-1.5 w-full">
        <div className="flex-1 bg-[#235C43]" />
        <div className="flex-1 bg-[#F5C800]" />
        <div className="flex-1 bg-[#C0392B]" />
      </div>
    </main>
  );
}
