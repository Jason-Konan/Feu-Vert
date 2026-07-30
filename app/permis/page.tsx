import Link from "next/link";
import { Barlow_Condensed, Work_Sans } from "next/font/google";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Reveal } from "../reveal";
import { PERMIS } from "@/lib/data/permis";

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

export const metadata = {
  title: "Quel permis préparez-vous ? · Feu Vert",
  description:
    "Découvrez les catégories de permis disponibles au Bénin et choisissez celle qui correspond à votre véhicule pour commencer à réviser.",
};

export default function PermisListPage() {
  return (
    <main
      className={`${display.variable} ${body.variable} min-h-screen bg-[#EEECE4] font-[family-name:var(--font-body)] text-slate-800 antialiased`}
    >
      {/* ------------------- EN-TÊTE ------------------- */}
      <section className="bg-[#1B1D1F]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à l&apos;accueil
          </Link>

          <div className="mt-8 max-w-2xl">
            <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-300">
              Catégories de permis
            </span>
            <h1 className="mt-5 font-[family-name:var(--font-display)] text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl">
              Quel permis préparez-vous ?
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-slate-300">
              Le tronc commun du code est le même pour tous, mais quelques
              questions changent selon le véhicule visé. Choisissez votre
              catégorie pour voir le détail et démarrer vos révisions.
            </p>
          </div>
        </div>
      </section>

      {/* ------------------- LISTE DES PERMIS ------------------- */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PERMIS.map((permis, index) => (
            <Reveal key={permis.code} delay={(index % 3) * 90}>
              <Link
                href={`/permis/${permis.code}`}
                className="group relative block aspect-[4/5] overflow-hidden rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#235C43]"
              >
                <img
                  src={permis.image}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent transition-opacity duration-300 group-hover:from-black/95" />

                <span className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/25 backdrop-blur-sm">
                  <permis.icon className="h-5 w-5" />
                </span>

                <span className="absolute inset-x-0 bottom-0 p-5">
                  <span className="font-[family-name:var(--font-display)] text-2xl font-bold text-white">
                    Permis {permis.code}
                  </span>
                  <span className="mt-0.5 block text-sm font-medium text-white/80">
                    {permis.titre}
                  </span>
                  <span className="mt-2 grid grid-rows-[0fr] opacity-0 transition-all duration-300 ease-out group-hover:mt-2.5 group-hover:grid-rows-[1fr] group-hover:opacity-100 group-focus-visible:mt-2.5 group-focus-visible:grid-rows-[1fr] group-focus-visible:opacity-100">
                    <span className="overflow-hidden">
                      <span className="block text-xs leading-relaxed text-white/70">
                        {permis.resume}
                      </span>
                    </span>
                  </span>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-white/90">
                    Voir le détail
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </span>
              </Link>
            </Reveal>
          ))}
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
