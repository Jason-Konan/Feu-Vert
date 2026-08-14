// app/permis/[id]/page.tsx

import Link from "next/link";
import { notFound } from "next/navigation";
import { Fredoka, Plus_Jakarta_Sans } from "next/font/google";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ListChecks,
  ShieldCheck,
} from "lucide-react";
import { Reveal } from "../../reveal";
import prisma from "@/lib/prisma";
import { TiptapContentRenderer } from "@/components/site/tiptap-content-renderer";

/* ─────────────────────────────────────────────────────────────────── */
/*  Page /permis/[id] — alignée sur la DA v5 "Signalisation" :        */
/*  bitume + jaune signal + vert feu vert, cartes bordées à ombre     */
/*  offset plate. Pas de tirets de marquage ici : les sections        */
/*  s'enchaînent simplement par changement de fond.                   */
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

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const lt = await prisma.licenseType.findUnique({ where: { id } });
  if (!lt) return {};
  return {
    title: `Permis ${lt.code} · ${lt.name} · Feu Vert`,
    description: lt.description ?? undefined,
  };
}

export default async function PermisDetailPage({ params }: PageProps) {
  const { id } = await params;

  const lt = await prisma.licenseType.findUnique({
    where: { id, isActive: true },
  });
  if (!lt) notFound();

  const autresPermis = await prisma.licenseType.findMany({
    where: { id: { not: lt.id }, isActive: true },
    orderBy: { order: "asc" },
    select: { id: true, code: true, name: true },
  });

  return (
    <main
      className={`${display.variable} ${body.variable} bg-[#F9F9F7] font-[family-name:var(--font-body)] text-[#1C1C1E] antialiased`}
    >
      {/* ══════════════ EN-TÊTE ══════════════ */}
      <section className="relative overflow-hidden bg-[#1C1C1E]">
        <div className="absolute inset-0">
          {lt.imageUrl ? (
            <img
              src={lt.imageUrl}
              alt=""
              className="h-full w-full object-cover opacity-25"
            />
          ) : (
            <div className="absolute inset-0 bg-[#235C43]/40" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1E] via-[#1C1C1E]/88 to-[#1C1C1E]/45" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <Reveal>
            <Link
              href="/permis"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/50 transition-colors duration-200 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Toutes les catégories
            </Link>

            <div className="mt-8">
              <Etiquette light>Catégorie {lt.code}</Etiquette>
              <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl sm:text-5xl font-bold leading-[1.02] tracking-tight text-white">
                Permis {lt.name}
              </h1>
            </div>

            {lt.minAge && (
              <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm text-white/70">
                <ShieldCheck className="h-4 w-4 text-[#F5C800]" />
                Âge minimum requis :{" "}
                <strong className="text-white">{lt.minAge} ans</strong>
              </div>
            )}
          </Reveal>
        </div>
      </section>

      {/* ══════════════ IMAGE + DESCRIPTION ══════════════ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col gap-8">
        {lt.imageUrl && (
          <Reveal>
            <div className="overflow-hidden rounded-xl border-2 border-[#1C1C1E] shadow-[6px_6px_0_#1C1C1E]">
              <img
                src={lt.imageUrl}
                alt=""
                loading="lazy"
                className="w-full max-h-[420px] object-cover"
              />
            </div>
          </Reveal>
        )}
        {lt.description && (
          <Reveal delay={80}>
            <TiptapContentRenderer html={lt.description} />
          </Reveal>
        )}
      </section>

      {/* ══════════════ ACTIONS : COURS / TEST ══════════════ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <Reveal>
          <div className="grid gap-5 sm:grid-cols-2">
            <Link
              href={`/permis/${lt.id}/cours`}
              className="group flex flex-col justify-between rounded-xl bg-[#1C1C1E] border-2 border-[#1C1C1E] shadow-[6px_6px_0_rgba(28,28,30,0.22)] p-7 transition-all duration-200 hover:-translate-y-1 hover:bg-[#235C43] hover:shadow-[6px_8px_0_rgba(28,28,30,0.22)]"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#F5C800] text-[#1C1C1E]">
                <BookOpen className="h-5 w-5" />
              </span>
              <span className="mt-6">
                <span className="block font-[family-name:var(--font-display)] text-xl font-semibold text-white">
                  Suivre les cours
                </span>
                <span className="mt-1.5 block text-sm text-white/50">
                  Révisez les thèmes propres au permis {lt.code}, à votre
                  rythme.
                </span>
              </span>
              <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[#F5C800]">
                Commencer
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </span>
            </Link>

            <Link
              href={`/permis/${lt.id}/test`}
              className="group flex flex-col justify-between rounded-xl bg-white border-2 border-[#1C1C1E] shadow-[6px_6px_0_rgba(28,28,30,0.16)] p-7 transition-all duration-200 hover:-translate-y-1 hover:shadow-[6px_8px_0_rgba(28,28,30,0.16)]"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#1C1C1E] text-white transition-colors duration-200 group-hover:bg-[#F5C800] group-hover:text-[#1C1C1E]">
                <ListChecks className="h-5 w-5" />
              </span>
              <span className="mt-6">
                <span className="block font-[family-name:var(--font-display)] text-xl font-semibold text-[#1C1C1E]">
                  Passer un test
                </span>
                <span className="mt-1.5 block text-sm text-[#6B7280]">
                  Testez-vous en conditions réelles sur les questions du permis{" "}
                  {lt.code}.
                </span>
              </span>
              <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[#1C1C1E]">
                Démarrer le test
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </span>
            </Link>
          </div>
        </Reveal>
      </section>

      {/* ══════════════ AUTRES PERMIS ══════════════ */}
      {autresPermis.length > 0 && (
        <section className="bg-[#F5C800]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
            <Reveal>
              <Etiquette>Autres catégories</Etiquette>
              <div className="mt-5 flex flex-wrap gap-2.5">
                {autresPermis.map((autre) => (
                  <Link
                    key={autre.id}
                    href={`/permis/${autre.id}`}
                    className="inline-flex items-center gap-2 rounded-full border-2 border-[#1C1C1E] bg-white px-4 py-2 text-sm font-bold text-[#1C1C1E] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1C1C1E] hover:text-white"
                  >
                    Permis {autre.code}
                  </Link>
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      )}
    </main>
  );
}
