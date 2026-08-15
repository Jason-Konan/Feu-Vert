// app/permis/page.tsx

import Link from "next/link";
import { Fredoka, Plus_Jakarta_Sans } from "next/font/google";
import { ArrowLeft, ArrowRight, Signpost } from "lucide-react";
import { Reveal } from "../reveal";
import prisma from "@/lib/prisma";
import { LicenseTypeGrid } from "@/components/site/license-type-grid";

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
            <LicenseTypeGrid
              variant="full"
              emptyMessage="Aucune catégorie de permis n'est encore disponible. Ajoutez-en depuis le panel admin."
            />
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
