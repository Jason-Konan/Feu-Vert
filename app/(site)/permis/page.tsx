// app/permis/page.tsx

import Link from "next/link";
import { Fredoka, Plus_Jakarta_Sans } from "next/font/google";
import { ArrowLeft, ArrowRight, Signpost } from "lucide-react";
import { Reveal } from "../reveal";
import prisma from "@/lib/prisma";

/* ─────────────────────────────────────────────────────────────────── */
/*  Page /permis — alignée sur la DA v5 "Signalisation" de la home :  */
/*  bitume + jaune signal + vert feu vert, tirets de marquage routier,*/
/*  cartes bordées façon panneau, ombres offset plates.               */
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
  title: "Quel permis préparez-vous ? · Feu Vert",
  description:
    "Découvrez les catégories de permis disponibles au Bénin et choisissez celle qui correspond à votre véhicule pour commencer à réviser.",
};

/* ── Composants structurels (identiques à la home) ─────────────────── */

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

/* ── Helpers ──────────────────────────────────────────────────────── */

function truncate(text: string | null | undefined, max: number): string {
  if (!text) return "";
  return text.length <= max ? text : text.slice(0, max).trimEnd() + "…";
}

/* ── Page ─────────────────────────────────────────────────────────── */

export default async function PermisListPage() {
  const licenseTypes = await prisma.licenseType.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });
  const stripHtml = (html: string) => html.replace(/<[^>]*>/g, "");

  return (
    <main
      className={`${display.variable} ${body.variable} bg-[#F9F9F7] font-[family-name:var(--font-body)] text-[#1C1C1E] antialiased`}
    >
      {/* ══════════════ HERO ══════════════ */}
      <section className="relative bg-[#1C1C1E] overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 sm:pt-20 pb-16">
          <Reveal>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/50 transition-colors duration-200 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour à l&apos;accueil
            </Link>

            <div className="mt-8 max-w-2xl">
              <Etiquette light>Catégories de permis</Etiquette>
              <h1 className="mt-5 font-[family-name:var(--font-display)] text-4xl sm:text-5xl font-bold leading-[1.02] tracking-tight text-white">
                Quel permis préparez-vous ?
              </h1>
              <p className="mt-5 text-white/45 leading-relaxed">
                Le tronc commun du code est le même pour tous, mais quelques
                questions changent selon le véhicule visé. Choisissez votre
                catégorie pour voir le détail et démarrer vos révisions.
              </p>
            </div>
          </Reveal>
        </div>
        <LigneDivision dark />
      </section>

      {/* ══════════════ GRILLE DES PERMIS ══════════════ */}
      <section className="bg-[#F9F9F7]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          {licenseTypes.length === 0 ? (
            <Reveal>
              <p className="text-center text-sm text-[#6B7280]">
                Aucune catégorie de permis n&apos;est encore disponible.
                Ajoutez-en depuis le panel admin.
              </p>
            </Reveal>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {licenseTypes.map((lt, index) => (
                <Reveal key={lt.id} delay={(index % 3) * 90}>
                  <Link
                    href={`/permis/${lt.id}`}
                    className="group relative block aspect-[4/5] overflow-hidden rounded-xl border-2 border-[#1C1C1E] shadow-[6px_6px_0_#1C1C1E] transition-all duration-200 hover:-translate-y-1 hover:shadow-[6px_8px_0_#1C1C1E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1C1C1E]"
                  >
                    {lt.imageUrl ? (
                      <img
                        src={lt.imageUrl}
                        alt=""
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                    ) : (
                      // Fallback si pas d'image uploadée
                      <div className="absolute inset-0 bg-[#235C43]" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1E]/92 via-[#1C1C1E]/20 to-transparent" />

                    <span className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-lg bg-[#F5C800] text-[#1C1C1E]">
                      <Signpost className="h-5 w-5" />
                    </span>
                    <span className="absolute right-3 top-3 rounded-md bg-[#1C1C1E] text-[#F5C800] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide">
                      {lt.code}
                    </span>

                    <span className="absolute inset-x-0 bottom-0 block p-5">
                      <span className="block font-[family-name:var(--font-display)] text-2xl font-semibold text-white">
                        Permis {lt.code}
                      </span>
                      <span className="mt-0.5 block text-sm font-medium text-white/75">
                        {lt.name}
                      </span>
                      {lt.description && (
                        <span className="mt-2 grid grid-rows-[0fr] opacity-0 transition-all duration-300 ease-out group-hover:mt-2.5 group-hover:grid-rows-[1fr] group-hover:opacity-100 group-focus-visible:mt-2.5 group-focus-visible:grid-rows-[1fr] group-focus-visible:opacity-100">
                          <span className="overflow-hidden">
                            <span className="block text-xs leading-relaxed text-white/55">
                              {truncate(stripHtml(lt.description), 120)}
                            </span>
                          </span>
                        </span>
                      )}
                      <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-white/90">
                        Voir le détail
                        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                      </span>
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ══════════════ BANDE FEU TRICOLORE ══════════════ */}
      <div className="flex h-1.5 w-full">
        <div className="flex-1 bg-[#235C43]" />
        <div className="flex-1 bg-[#F5C800]" />
        <div className="flex-1 bg-[#C0392B]" />
      </div>
    </main>
  );
}
