import Link from "next/link";
import { notFound } from "next/navigation";
import { Barlow_Condensed, Work_Sans } from "next/font/google";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Lightbulb,
  ListChecks,
} from "lucide-react";
import { Reveal } from "../../../../reveal";
import { getPermisBySlug, PERMIS } from "@/lib/data/permis";
import { THEMES, getThemeBySlug } from "@/lib/data/themes";

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
  params: Promise<{ code: string; theme: string }>;
};

export function generateStaticParams() {
  return THEMES.map((theme) => ({ theme: theme.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { code, theme: themeSlug } = await params;
  const permis = getPermisBySlug(code);
  const theme = getThemeBySlug(themeSlug);
  if (!permis || !theme) return {};
  return {
    title: `${theme.titre} · Permis ${permis.code} · Feu Vert`,
    description: theme.resume,
  };
}

export default async function LeconPage({ params }: PageProps) {
  const { code, theme: themeSlug } = await params;
  const permis = getPermisBySlug(code);
  const theme = getThemeBySlug(themeSlug);
  if (!permis || !theme) notFound();

  const currentIndex = THEMES.findIndex((t) => t.slug === theme.slug);
  const themePrecedent = currentIndex > 0 ? THEMES[currentIndex - 1] : null;
  const themeSuivant =
    currentIndex < THEMES.length - 1 ? THEMES[currentIndex + 1] : null;

  return (
    <main
      className={`${display.variable} ${body.variable} min-h-screen bg-[#EEECE4] font-[family-name:var(--font-body)] text-slate-800 antialiased`}
    >
      {/* ------------------- EN-TÊTE ------------------- */}
      <section className="bg-[#1B1D1F]">
        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <Link
            href={`/permis/${permis.slug}/cours`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Tous les thèmes · Permis {permis.code}
          </Link>

          <div className="mt-6 flex items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white ring-1 ring-white/20 backdrop-blur-sm">
              <theme.icon className="h-7 w-7" />
            </span>
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Thème {currentIndex + 1} / {THEMES.length}
              </span>
              <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
                {theme.titre}
              </h1>
            </div>
          </div>

          {/* barre de progression dans le cours */}
          <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-[#B98A2E] transition-all"
              style={{
                width: `${((currentIndex + 1) / THEMES.length) * 100}%`,
              }}
            />
          </div>
        </div>
      </section>

      {/* ------------------- CONTENU DE LA LEÇON ------------------- */}
      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
        {/* Points clés */}
        <Reveal>
          <div className="rounded-2xl border border-slate-200 bg-white p-7">
            <Kicker>Points clés à retenir</Kicker>
            <ul className="mt-4 space-y-3">
              {theme.points.map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-2.5 text-sm text-slate-700"
                >
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#235C43]" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        {/* Corps de la leçon */}
        <Reveal delay={80} className="mt-10">
          <Kicker>La leçon</Kicker>
          <div className="mt-3 space-y-4">
            {theme.contenu.map((paragraphe, index) => (
              <p key={index} className="text-slate-600 leading-relaxed">
                {paragraphe}
              </p>
            ))}
          </div>
        </Reveal>

        {/* Astuce Feu Vert */}
        <Reveal delay={120} className="mt-10">
          <div className="flex items-start gap-4 rounded-2xl border border-[#B98A2E]/30 bg-[#B98A2E]/[0.06] p-6">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#B98A2E] text-white">
              <Lightbulb className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Astuce Feu Vert
              </p>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">
                {theme.astuce}
              </p>
            </div>
          </div>
        </Reveal>

        {/* Navigation entre thèmes */}
        <Reveal delay={160} className="mt-12">
          <div className="grid gap-3 sm:grid-cols-2">
            {themePrecedent ? (
              <Link
                href={`/permis/${permis.slug}/cours/${themePrecedent.slug}`}
                className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-5 transition-colors hover:border-[#235C43]/30"
              >
                <ArrowLeft className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:-translate-x-1" />
                <span className="min-w-0">
                  <span className="block text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Thème précédent
                  </span>
                  <span className="block truncate text-sm font-semibold text-slate-900">
                    {themePrecedent.titre}
                  </span>
                </span>
              </Link>
            ) : (
              <div />
            )}

            {themeSuivant ? (
              <Link
                href={`/permis/${permis.slug}/cours/${themeSuivant.slug}`}
                className="group flex items-center justify-end gap-3 rounded-2xl border border-slate-200 bg-white p-5 text-right transition-colors hover:border-[#235C43]/30"
              >
                <span className="min-w-0">
                  <span className="block text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Thème suivant
                  </span>
                  <span className="block truncate text-sm font-semibold text-slate-900">
                    {themeSuivant.titre}
                  </span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-1" />
              </Link>
            ) : (
              <Link
                href={`/permis/${permis.slug}/test`}
                className="group flex items-center justify-end gap-3 rounded-2xl bg-[#235C43] p-5 text-right text-white transition-colors hover:bg-[#1B4933]"
              >
                <span className="min-w-0">
                  <span className="block text-xs font-semibold uppercase tracking-wide text-white/70">
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

      <div className="flex h-1 w-full">
        <div className="flex-1 bg-[#235C43]" />
        <div className="flex-1 bg-[#B98A2E]" />
        <div className="flex-1 bg-[#A6402B]" />
      </div>
    </main>
  );
}
