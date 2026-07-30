import Link from "next/link";
import { notFound } from "next/navigation";
import { Barlow_Condensed, Work_Sans } from "next/font/google";
import { ArrowLeft, ArrowRight, ListChecks } from "lucide-react";
import { Reveal } from "../../../reveal";
import { getPermisBySlug, PERMIS } from "@/lib/data/permis";
import { THEMES } from "@/lib/data/themes";

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

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-[family-name:var(--font-body)] text-xs font-semibold uppercase tracking-[0.2em] text-[#235C43]">
      {children}
    </p>
  );
}

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
    title: `Cours · Permis ${permis.code} · Feu Vert`,
    description: `Révisez les thèmes du code de la route pour le permis ${permis.code}.`,
  };
}

export default async function CoursPage({ params }: PageProps) {
  const { code } = await params;
  const permis = getPermisBySlug(code);
  if (!permis) notFound();

  return (
    <main
      className={`${display.variable} ${body.variable} min-h-screen bg-[#EEECE4] font-[family-name:var(--font-body)] text-slate-800 antialiased`}
    >
      {/* ------------------- EN-TÊTE ------------------- */}
      <section className="bg-[#1B1D1F]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <Link
            href={`/permis/${permis.slug}`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Permis {permis.code}
          </Link>

          <div className="mt-8 flex items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white ring-1 ring-white/20 backdrop-blur-sm">
              <permis.icon className="h-7 w-7" />
            </span>
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Cours · Catégorie {permis.code}
              </span>
              <h1 className="font-[family-name:var(--font-display)] text-4xl font-bold leading-none tracking-tight text-white sm:text-5xl">
                Tous les thèmes à réviser
              </h1>
            </div>
          </div>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">
            Parcourez chaque thème dans l&apos;ordre, ou allez directement à
            celui que vous voulez revoir. Chaque leçon se termine par les points
            clés à retenir avant de passer un test.
          </p>
        </div>
      </section>

      {/* ------------------- LISTE DES THÈMES ------------------- */}
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4">
          {THEMES.map((theme, index) => (
            <Reveal key={theme.slug} delay={index * 80}>
              <Link
                href={`/permis/${permis.slug}/cours/${theme.slug}`}
                className="group flex items-center gap-5 rounded-2xl border border-slate-200 bg-white p-5 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-0.5 hover:border-[#235C43]/30 hover:shadow-lg hover:shadow-slate-900/5 sm:p-6"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#1B1D1F] text-white transition-colors group-hover:bg-[#235C43]">
                  <theme.icon className="h-5 w-5" />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-400">
                      Thème {index + 1}
                    </span>
                  </span>
                  <span className="mt-0.5 block font-[family-name:var(--font-display)] text-lg font-bold tracking-tight text-slate-900">
                    {theme.titre}
                  </span>
                  <span className="mt-1 block text-sm text-slate-500">
                    {theme.resume}
                  </span>
                </span>

                <ArrowRight className="h-5 w-5 shrink-0 text-slate-300 transition-all group-hover:translate-x-1 group-hover:text-[#235C43]" />
              </Link>
            </Reveal>
          ))}
        </div>

        {/* ------------------- CTA TEST ------------------- */}
        <Reveal delay={THEMES.length * 80} className="mt-10">
          <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-[#B98A2E]/30 bg-[#B98A2E]/[0.06] p-6 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#B98A2E] text-white">
                <ListChecks className="h-5 w-5" />
              </span>
              <div>
                <p className="font-[family-name:var(--font-display)] text-lg font-bold text-slate-900">
                  Prêt à vous tester ?
                </p>
                <p className="text-sm text-slate-600">
                  Passez un test dans les conditions de l&apos;examen dès que
                  vous vous sentez à l&apos;aise.
                </p>
              </div>
            </div>
            <Link
              href={`/permis/${permis.slug}/test`}
              className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-[#1B1D1F] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#235C43]"
            >
              Passer un test
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>
      </section>

      <div className="flex h-1 w-full">
        <div className="flex-1 bg-[#235C43]" />
        <div className="flex-1 bg-[#B98A2E]" />
        <div className="flex-1 bg-[#A6402B]" />
      </div>
    </main>
  );
}
