import Link from "next/link";
import { notFound } from "next/navigation";
import { Barlow_Condensed, Work_Sans } from "next/font/google";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  BookOpen,
  ListChecks,
} from "lucide-react";
import { Reveal } from "../../reveal";
import { getPermisBySlug, PERMIS } from "@/lib/data/permis";

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
    title: `Permis ${permis.code} · ${permis.titre} · Feu Vert`,
    description: permis.description,
  };
}

export default async function PermisDetailPage({ params }: PageProps) {
  const { code } = await params;
  const permis = getPermisBySlug(code);
  if (!permis) notFound();

  const autresPermis = PERMIS.filter((p) => p.slug !== permis.slug);

  return (
    <main
      className={`${display.variable} ${body.variable} min-h-screen bg-[#EEECE4] font-[family-name:var(--font-body)] text-slate-800 antialiased`}
    >
      {/* ------------------- EN-TÊTE / BANNIÈRE ------------------- */}
      <section className="relative overflow-hidden bg-[#1B1D1F]">
        <div className="absolute inset-0">
          <img
            src={permis.image}
            alt=""
            className="h-full w-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1B1D1F] via-[#1B1D1F]/85 to-[#1B1D1F]/40" />
        </div>

        <div className="relative mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <Link
            href="/permis"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Toutes les catégories
          </Link>

          <div className="mt-8 flex items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white ring-1 ring-white/20 backdrop-blur-sm">
              <permis.icon className="h-7 w-7" />
            </span>
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Catégorie {permis.code}
              </span>
              <h1 className="font-[family-name:var(--font-display)] text-4xl font-bold leading-none tracking-tight text-white sm:text-5xl">
                Permis {permis.titre}
              </h1>
            </div>
          </div>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">
            {permis.resume}
          </p>
        </div>
      </section>

      {/* ------------------- DÉTAILS ------------------- */}
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal>
            <Kicker>De quoi s&apos;agit-il</Kicker>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Ce que couvre le permis {permis.code}
            </h2>
            <p className="mt-4 text-slate-600 leading-relaxed">
              {permis.description}
            </p>
          </Reveal>

          <Reveal delay={100}>
            <div className="rounded-2xl border border-slate-200 bg-white p-7">
              <Kicker>Véhicules concernés</Kicker>
              <ul className="mt-4 space-y-3">
                {permis.vehicules.map((vehicule) => (
                  <li
                    key={vehicule}
                    className="flex items-start gap-2.5 text-sm text-slate-700"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#235C43]" />
                    {vehicule}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ------------------- ACTIONS : COURS / TEST ------------------- */}
      <section className="mx-auto max-w-4xl px-4 pb-16 sm:px-6 lg:px-8">
        <Reveal delay={120}>
          <div className="rounded-3xl border border-slate-200 bg-white p-2">
            <div className="grid gap-2 sm:grid-cols-2">
              <Link
                href={`/permis/${permis.slug}/cours`}
                className="group flex flex-col justify-between rounded-2xl bg-[#1B1D1F] p-7 transition-colors hover:bg-[#235C43]"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-white">
                  <BookOpen className="h-5 w-5" />
                </span>
                <span className="mt-6">
                  <span className="block font-[family-name:var(--font-display)] text-xl font-bold text-white">
                    Suivre les cours
                  </span>
                  <span className="mt-1 block text-sm text-slate-300">
                    Révisez les thèmes propres au permis {permis.code}, à votre
                    rythme.
                  </span>
                </span>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-white">
                  Commencer
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>

              <Link
                href={`/permis/${permis.slug}/test`}
                className="group flex flex-col justify-between rounded-2xl border border-slate-200 p-7 transition-colors hover:border-[#B98A2E]/40 hover:bg-[#B98A2E]/[0.05]"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition-colors group-hover:bg-[#B98A2E] group-hover:text-white">
                  <ListChecks className="h-5 w-5" />
                </span>
                <span className="mt-6">
                  <span className="block font-[family-name:var(--font-display)] text-xl font-bold text-slate-900">
                    Passer un test
                  </span>
                  <span className="mt-1 block text-sm text-slate-500">
                    Testez-vous en conditions réelles sur les questions du
                    permis {permis.code}.
                  </span>
                </span>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[#1B1D1F]">
                  Démarrer le test
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ------------------- AUTRES PERMIS ------------------- */}
      <section className="border-t border-slate-900/5 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
          <Kicker>Autres catégories</Kicker>
          <div className="mt-4 flex flex-wrap gap-2.5">
            {autresPermis.map((autre) => (
              <Link
                key={autre.slug}
                href={`/permis/${autre.slug}`}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-[#235C43]/30 hover:bg-[#235C43]/[0.05] hover:text-[#235C43]"
              >
                <autre.icon className="h-4 w-4" />
                Permis {autre.code}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="flex h-1 w-full">
        <div className="flex-1 bg-[#235C43]" />
        <div className="flex-1 bg-[#B98A2E]" />
        <div className="flex-1 bg-[#A6402B]" />
      </div>
    </main>
  );
}
