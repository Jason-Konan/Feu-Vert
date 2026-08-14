// app/permis/[id]/cours/page.tsx

import Link from "next/link";
import { notFound } from "next/navigation";
import { Fredoka, Plus_Jakarta_Sans } from "next/font/google";
import { ArrowLeft, ArrowRight, IdCard, ListChecks } from "lucide-react";
import { Reveal } from "../../../reveal";
import prisma from "@/lib/prisma";

/* ─────────────────────────────────────────────────────────────────── */
/*  Page /permis/[id]/cours — liste des thèmes, DA v5 "Signalisation" */
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

// ✅ Le segment URL est [id], pas [code]
type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const licenseType = await prisma.licenseType.findUnique({ where: { id } });
  if (!licenseType) return {};

  return {
    title: `Cours · Permis ${licenseType.code} · Feu Vert`,
    description: `Révisez les thèmes du code de la route pour le permis ${licenseType.code}.`,
  };
}

export default async function CoursPage({ params }: PageProps) {
  const { id } = await params;

  const licenseType = await prisma.licenseType.findUnique({ where: { id } });
  if (!licenseType) notFound();

  const courses = await prisma.course.findMany({
    where: { licenseTypeId: licenseType.id, isPublished: true },
    orderBy: { order: "asc" },
    include: {
      lessons: {
        where: { isPublished: true },
        orderBy: { order: "asc" },
        select: { id: true, title: true, duration: true },
      },
    },
  });

  return (
    <main
      className={`${display.variable} ${body.variable} bg-[#F9F9F7] font-[family-name:var(--font-body)] text-[#1C1C1E] antialiased`}
    >
      {/* ══════════════ EN-TÊTE ══════════════ */}
      <section className="bg-[#1C1C1E]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <Reveal>
            <Link
              href={`/permis/${licenseType.id}`}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/50 transition-colors duration-200 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Permis {licenseType.code}
            </Link>

            <div className="mt-8 flex items-center gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#F5C800] text-[#1C1C1E]">
                <IdCard className="h-7 w-7" />
              </span>
              <div>
                <Etiquette light>
                  Cours · Catégorie {licenseType.code}
                </Etiquette>
                <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl sm:text-5xl font-bold leading-[1.02] tracking-tight text-white">
                  Tous les thèmes à réviser
                </h1>
              </div>
            </div>

            <p className="mt-6 max-w-2xl text-white/45 leading-relaxed">
              Parcourez chaque thème dans l&apos;ordre, ou allez directement à
              celui que vous voulez revoir. Chaque leçon se termine par les
              points clés à retenir avant de passer un test.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ══════════════ LISTE DES THÈMES ══════════════ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col gap-4">
          {courses.map((theme, index) => (
            <Reveal key={theme.slug} delay={index * 80}>
              <Link
                href={`/permis/${licenseType.id}/cours/${theme.slug}`}
                className="group flex items-center gap-5 rounded-xl bg-white border border-[#1C1C1E]/8 p-5 sm:p-6 transition-all duration-200 hover:border-[#235C43]/35 hover:shadow-[4px_4px_0_#235C43]"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#F5C800]">
                  {theme.coverImageUrl ? (
                    <img
                      src={theme.coverImageUrl}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <ListChecks className="h-5 w-5 text-[#1C1C1E]" />
                  )}
                </div>

                <span className="min-w-0 flex-1">
                  <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#6B7280]">
                    Thème {index + 1}
                  </span>
                  <span className="mt-0.5 block font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight text-[#1C1C1E]">
                    {theme.title}
                  </span>
                </span>

                <ArrowRight className="h-5 w-5 shrink-0 text-[#1C1C1E]/25 transition-all duration-200 group-hover:translate-x-1 group-hover:text-[#235C43]" />
              </Link>
            </Reveal>
          ))}
        </div>

        {courses.length === 0 && (
          <p className="text-center text-sm text-[#6B7280]">
            Aucun thème de cours n&apos;est encore disponible.
          </p>
        )}

        {/* ══════════════ CTA TEST ══════════════ */}
        <Reveal delay={courses.length * 80} className="mt-10">
          <div className="flex flex-col items-start justify-between gap-5 rounded-xl bg-[#F5C800] border-2 border-[#1C1C1E] shadow-[6px_6px_0_rgba(28,28,30,0.18)] p-6 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#1C1C1E] text-[#F5C800]">
                <ListChecks className="h-5 w-5" />
              </span>
              <div>
                <p className="font-[family-name:var(--font-display)] text-lg font-semibold text-[#1C1C1E]">
                  Prêt à vous tester ?
                </p>
                <p className="text-sm text-[#1C1C1E]/65">
                  Passez un test dans les conditions de l&apos;examen dès que
                  vous vous sentez à l&apos;aise.
                </p>
              </div>
            </div>
            <Link
              href={`/permis/${licenseType.id}/test`}
              className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-[#1C1C1E] px-6 py-3 text-sm font-bold text-white transition-colors duration-200 hover:bg-[#235C43]"
            >
              Passer un test
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
