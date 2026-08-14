// app/permis/[id]/cours/[theme]/page.tsx

import Link from "next/link";
import { notFound } from "next/navigation";
import { Fredoka, Plus_Jakarta_Sans } from "next/font/google";
import { ArrowLeft, ArrowRight, Clock, ListChecks } from "lucide-react";
import { Reveal } from "../../../../reveal";
import prisma from "@/lib/prisma";
import { TiptapContentRenderer } from "@/components/site/tiptap-content-renderer";

/* ─────────────────────────────────────────────────────────────────── */
/*  Page /permis/[id]/cours/[theme] — leçons d'un thème, DA v5         */
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
  params: Promise<{ id: string; theme: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { id, theme: courseSlug } = await params;
  const course = await prisma.course.findFirst({
    where: { slug: courseSlug, licenseType: { id }, isPublished: true },
  });
  if (!course) return {};
  return {
    title: `${course.title} · Feu Vert`,
    description: course.description ?? undefined,
  };
}

export default async function LeconPage({ params }: PageProps) {
  const { id, theme: courseSlug } = await params;

  const licenseType = await prisma.licenseType.findUnique({
    where: { id },
  });
  if (!licenseType) notFound();

  const courses = await prisma.course.findMany({
    where: { licenseTypeId: licenseType.id, isPublished: true },
    orderBy: { order: "asc" },
    include: {
      lessons: {
        where: { isPublished: true },
        orderBy: { order: "asc" },
      },
    },
  });

  const currentIndex = courses.findIndex((c) => c.slug === courseSlug);
  const course = courses[currentIndex];
  if (!course) notFound();

  const coursePrecedent = currentIndex > 0 ? courses[currentIndex - 1] : null;
  const coursSuivant =
    currentIndex < courses.length - 1 ? courses[currentIndex + 1] : null;
  const dureeTotale = course.lessons.reduce(
    (total, l) => total + (l.duration ?? 0),
    0,
  );

  return (
    <main
      className={`${display.variable} ${body.variable} bg-[#F9F9F7] font-[family-name:var(--font-body)] text-[#1C1C1E] antialiased`}
    >
      {/* ══════════════ EN-TÊTE ══════════════ */}
      <section className="bg-[#1C1C1E]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
          <Reveal>
            <Link
              href={`/permis/${licenseType.id}/cours`}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/50 transition-colors duration-200 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Tous les thèmes · Permis {licenseType.code}
            </Link>

            <div className="mt-6">
              <Etiquette light>
                Thème {currentIndex + 1} / {courses.length}
              </Etiquette>
              <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-bold leading-[1.05] tracking-tight text-white">
                {course.title}
              </h1>
              {dureeTotale > 0 && (
                <span className="mt-3 flex items-center gap-1.5 text-xs text-white/45">
                  <Clock className="h-3.5 w-3.5" />
                  {dureeTotale} min au total
                </span>
              )}
            </div>

            <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-[#F5C800] transition-all"
                style={{
                  width: `${((currentIndex + 1) / courses.length) * 100}%`,
                }}
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════ LEÇONS DU COURS ══════════════ */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {course.lessons.length === 0 ? (
          <p className="rounded-xl border border-[#1C1C1E]/15 bg-white p-6 text-center text-sm text-[#6B7280]">
            Aucune leçon disponible pour ce thème pour l&apos;instant.
          </p>
        ) : (
          <div className="space-y-8">
            {course.lessons.map((lesson, index) => (
              <Reveal key={lesson.id} delay={index * 80}>
                <div className="rounded-xl bg-white border border-[#1C1C1E]/8 p-7">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#235C43]">
                      Leçon {index + 1}
                    </span>
                    {lesson.duration && (
                      <span className="flex items-center gap-1 text-xs text-[#6B7280]">
                        <Clock className="h-3.5 w-3.5" />
                        {lesson.duration} min
                      </span>
                    )}
                  </div>
                  <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold text-[#1C1C1E]">
                    {lesson.title}
                  </h2>
                  {/* Le contenu est du HTML généré par l'éditeur riche admin */}
                  <TiptapContentRenderer html={lesson.content} />
                </div>
              </Reveal>
            ))}
          </div>
        )}

        {/* Navigation entre thèmes (cours) */}
        <Reveal delay={160} className="mt-12">
          <div className="grid gap-3 sm:grid-cols-2">
            {coursePrecedent ? (
              <Link
                href={`/permis/${licenseType.id}/cours/${coursePrecedent.slug}`}
                className="group flex items-center gap-3 rounded-xl bg-white border border-[#1C1C1E]/8 p-5 transition-colors duration-200 hover:border-[#235C43]/35"
              >
                <ArrowLeft className="h-4 w-4 shrink-0 text-[#6B7280] transition-transform duration-200 group-hover:-translate-x-1" />
                <span className="min-w-0">
                  <span className="block text-xs font-bold uppercase tracking-wide text-[#6B7280]">
                    Thème précédent
                  </span>
                  <span className="block truncate text-sm font-semibold text-[#1C1C1E]">
                    {coursePrecedent.title}
                  </span>
                </span>
              </Link>
            ) : (
              <div />
            )}

            {coursSuivant ? (
              <Link
                href={`/permis/${licenseType.id}/cours/${coursSuivant.slug}`}
                className="group flex items-center justify-end gap-3 rounded-xl bg-white border border-[#1C1C1E]/8 p-5 text-right transition-colors duration-200 hover:border-[#235C43]/35"
              >
                <span className="min-w-0">
                  <span className="block text-xs font-bold uppercase tracking-wide text-[#6B7280]">
                    Thème suivant
                  </span>
                  <span className="block truncate text-sm font-semibold text-[#1C1C1E]">
                    {coursSuivant.title}
                  </span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-[#6B7280] transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            ) : (
              <Link
                href={`/permis/${licenseType.id}/test`}
                className="group flex items-center justify-end gap-3 rounded-xl bg-[#235C43] p-5 text-right text-white transition-colors duration-200 hover:bg-[#1C1C1E]"
              >
                <span className="min-w-0">
                  <span className="block text-xs font-bold uppercase tracking-wide text-white/60">
                    Dernier thème terminé
                  </span>
                  <span className="flex items-center justify-end gap-1.5 text-sm font-semibold">
                    Passer un test
                    <ListChecks className="h-4 w-4" />
                  </span>
                </span>
              </Link>
            )}
          </div>
        </Reveal>
      </section>
    </main>
  );
}
