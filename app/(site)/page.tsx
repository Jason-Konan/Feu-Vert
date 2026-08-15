import Link from "next/link";
import { Fredoka, Plus_Jakarta_Sans } from "next/font/google";
import {
  Signpost,
  GitFork,
  Gauge,
  ShieldAlert,
  HeartPulse,
  Wrench,
  Route,
  FileCheck,
  MapPin,
  Check,
  ShieldCheck,
  Smartphone,
  MessageCircle,
  ArrowRight,
  Flag,
  ListChecks,
  Repeat,
  Timer,
  CheckCircle2,
  Star,
  X,
  Car,
} from "lucide-react";
import { Reveal } from "./reveal";
import { PERMIS } from "@/lib/data/permis";
import prisma from "@/lib/prisma";
import Image from "next/image";
import { LicenseIcon } from "@hugeicons/core-free-icons";
import { TiptapContentRenderer } from "@/components/site/tiptap-content-renderer";
import { LicenseTypeGrid } from "@/components/site/license-type-grid";

/* ─────────────────────────────────────────────────────────────────── */
/*  Direction artistique — v5 "Signalisation"                         */
/*                                                                     */
/*  Rupture totale avec v4 : fond quasi-noir et halos flous → système */
/*  calqué sur la signalisation routière. Jaune signal (#F5C800) en   */
/*  hero ; sections alternant blanc chaud, bitume et vert de marque.  */
/*  Vagues SVG + halos → tirets de marquage routier entre sections.   */
/*  Ombres offset plates (4px 4px 0) → esthétique affiche             */
/*  sérigraphiée. Border-radius 12px : moins SaaS candy, plus         */
/*  document officiel. La carte d'examen dans le hero est stylée      */
/*  comme un vrai formulaire (header bitume, bande d'explication)     */
/*  — signature de la v5.                                              */
/*                                                                     */
/*  Palette :                                                          */
/*  jaune signal  #F5C800  · bitume     #1C1C1E · blanc chaud #F9F9F7 */
/*  vert feuvert  #235C43  · rouge stop #C0392B · ardoise    #6B7280  */
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

/* ── Composants structurels ────────────────────────────────────────── */

/** Tirets de peinture routière — remplace les vagues SVG */
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

/** Étiquette de section — remplace le Kicker à paillettes */
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

/* ── Données ──────────────────────────────────────────────────────── */

const THEMES = [
  {
    icon: Signpost,
    title: "Signalisation",
    description:
      "Danger, interdiction, obligation, indication : les reconnaître d'un coup d'œil, pas en les récitant.",
  },
  {
    icon: GitFork,
    title: "Priorités et intersections",
    description:
      "Ronds-points, carrefours, priorité à droite : chaque cas expliqué avec un vrai schéma.",
  },
  {
    icon: Gauge,
    title: "Vitesse et distances",
    description:
      "Limitations, distances de sécurité, temps de freinage selon l'état de la route.",
  },
  {
    icon: Route,
    title: "Circulation et usage des voies",
    description:
      "Dépassement, changement de file, comportement à adopter face aux zémidjans et poids lourds.",
  },
  {
    icon: ShieldAlert,
    title: "Alcool, fatigue et sécurité",
    description:
      "Les règles qui protègent le conducteur, les passagers et les autres usagers de la route.",
  },
  {
    icon: HeartPulse,
    title: "Premiers secours",
    description:
      "Les bons réflexes à avoir dans les minutes après un accident.",
  },
  {
    icon: Wrench,
    title: "Mécanique et entretien",
    description:
      "Ce qu'il faut vérifier sur le véhicule avant de prendre le volant.",
  },
  {
    icon: FileCheck,
    title: "Documents et assurance",
    description:
      "Carte grise, assurance, contrôle technique : les papiers à avoir et pourquoi.",
  },
  {
    icon: MapPin,
    title: "Stationnement et arrêt",
    description:
      "Où s'arrêter, où ne jamais se garer, et ce que ça change en ville.",
  },
] as const;

const ETAPES = [
  {
    numero: "1",
    titre: "Ouvrez un thème",
    texte:
      "Révisez une catégorie à la fois, avec une explication claire après chaque question.",
    icon: ListChecks,
  },
  {
    numero: "2",
    titre: "Enchaînez les séries",
    texte:
      "Des lots de 20 questions pour ancrer les réflexes, avec un score affiché en direct.",
    icon: Repeat,
  },
  {
    numero: "3",
    titre: "Passez un blanc chronométré",
    texte: "40 questions, le temps exact de l'examen béninois, sans filet.",
    icon: Timer,
  },
  {
    numero: "4",
    titre: "Le jour J",
    texte:
      "Vous entrez en salle en connaissant déjà le rythme : même durée, même nombre de questions.",
    icon: Flag,
  },
] as const;

const AVIS = [
  {
    nom: "Aïcha",
    ville: "Cotonou",
    texte:
      "J'ai eu mon code du premier coup après deux semaines de révision par thème. Les explications après chaque erreur font vraiment la différence.",
  },
  {
    nom: "Rodrigue",
    ville: "Porto-Novo",
    texte:
      "Les examens blancs chronométrés m'ont appris à gérer le stress. Le jour J, je connaissais déjà le rythme.",
  },
  {
    nom: "Sandra",
    ville: "Parakou",
    texte:
      "Simple à utiliser depuis mon téléphone, même avec une connexion faible. Je révisais entre deux clients au marché.",
  },
] as const;

const AVANT = [
  "Questions du livret parfois dépassées",
  "Aucune explication après une erreur",
  "Impossible de suivre sa progression",
  "Pas de mise en situation chronométrée",
] as const;

const APRES = [
  "Questions mises à jour régulièrement",
  "Explication claire après chaque erreur",
  "Progression suivie thème par thème",
  "Examens blancs dans les conditions réelles",
] as const;

const CONFIANCE = [
  { icon: ShieldCheck, label: "Contenu conforme au code béninois" },
  { icon: Smartphone, label: "Paiement Mobile Money accepté, sans engagement" },
  { icon: MessageCircle, label: "Support en français, 7 jours sur 7" },
] as const;

const FAQ = [
  {
    question: "Combien de temps faut-il pour être prêt ?",
    reponse:
      "La plupart des candidats se sentent prêts après deux à trois semaines de révision régulière, à raison d'une série par jour environ.",
  },
  {
    question: "Les questions sont-elles vraiment celles de l'examen béninois ?",
    reponse:
      "Nos 1 240 questions sont rédigées à partir du code de la route en vigueur au Bénin et mises à jour dès qu'une règle change.",
  },
  {
    question: "Puis-je réviser sans connexion internet ?",
    reponse:
      "Une fois une série chargée, vous pouvez continuer à répondre même avec une connexion faible ou instable.",
  },
  {
    question: "Comment fonctionne l'abonnement Premium ?",
    reponse:
      "Il se paie au mois, par Mobile Money ou carte, sans engagement : vous pouvez l'arrêter à tout moment depuis votre compte.",
  },
] as const;

const STATS = [
  { chiffre: "87%", label: "de réussite au premier essai (Premium)" },
  { chiffre: "1 240", label: "questions officielles, 9 thèmes" },
  { chiffre: "15 000+", label: "candidats formés dans le pays" },
  { chiffre: "24/7", label: "accès aux séries d'entraînement" },
] as const;
function truncate(text: string | null | undefined, max: number): string {
  if (!text) return "";
  return text.length <= max ? text : text.slice(0, max).trimEnd() + "…";
}

/* ── Page ─────────────────────────────────────────────────────────── */

export default async function Home() {
  const licenseTypes = await prisma.licenseType.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });
  const stripHtml = (html: string) => html.replace(/<[^>]*>/g, "");
  return (
    <main
      className={`${display.variable} ${body.variable} bg-[#F9F9F7] font-[family-name:var(--font-body)] text-[#1C1C1E] antialiased`}
    >
      <style>{`
        html { scroll-behavior: smooth; }
        @media (prefers-reduced-motion: reduce) {
          html { scroll-behavior: auto; }
          * { transition: none !important; }
        }
      `}</style>

      {/* ══════════════ HERO ══════════════ */}
      <section className="relative bg-[#F5C950] overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-0">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:items-end">
            {/* Colonne texte */}
            <Reveal>
              <div className="inline-flex items-center gap-2.5 bg-[#1C1C1E] text-white text-xs font-bold uppercase tracking-[0.18em] px-4 py-2 rounded-full">
                <span className="w-2 h-2 rounded-full bg-[#F5C800]" />
                Code de la route béninois
              </div>

              <h1 className="mt-6 font-[family-name:var(--font-display)] text-[3.5rem] sm:text-[4.5rem] lg:text-[5.25rem] font-bold leading-[0.92] tracking-tight text-white ">
                Code de la route,{" "}
                <span className="relative inline-block">
                  <span className="relative z-10 text-green-500/70">
                    réussi
                  </span>
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0.5 h-[10px] rounded-sm z-0"
                    style={{ background: "rgba(255,255,255,0.6)" }}
                  />
                </span>{" "}
                <span className="text-green-800">du premier coup.</span>
              </h1>

              <p className="mt-6 max-w-md text-base leading-relaxed text-[#1C1C1E]/65">
                Questions officielles, corrections qui expliquent chaque erreur,
                et examens blancs chronométrés dans les conditions réelles.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/sign-up"
                  className="group inline-flex items-center justify-center gap-2 bg-[#1C1C1E] text-white text-sm font-bold px-7 py-3.5 rounded-full shadow-[4px_4px_0_rgba(0,0,0,0.22)] transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:shadow-[4px_6px_0_rgba(0,0,0,0.22)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1C1C1E]"
                >
                  Démarrer gratuitement
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
                </Link>
                <a
                  href="#themes"
                  className="inline-flex items-center justify-center text-sm font-semibold text-[#1C1C1E] bg-white/50 hover:bg-white/70 px-7 py-3.5 rounded-full border border-[#1C1C1E]/15 transition-colors duration-300 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1C1C1E]"
                >
                  Voir les 9 thèmes
                </a>
              </div>

              <div className="mt-8 flex items-center gap-3">
                <div className="flex text-[#1C1C1E]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-[#1C1C1E]/55">
                  15 000+ candidats formés · sans carte bancaire requise
                </p>
              </div>
            </Reveal>

            {/* Carte examen — signature v5 : simulacre d'un vrai dossier d'examen */}
            <Reveal delay={150} className="hidden lg:block self-end">
              <div className="rounded-xl overflow-hidden border-2 border-[#1C1C1E] shadow-[8px_8px_0_#1C1C1E] bg-white">
                {/* Header façon formulaire officiel */}
                <div className="bg-[#1C1C1E] px-5 py-3 flex items-center justify-between">
                  <span className="text-[#F5C800] text-xs font-bold uppercase tracking-widest">
                    Question 7 / 20
                  </span>
                  <span className="text-white/40 text-xs font-medium">
                    Signalisation
                  </span>
                </div>

                <div className="p-6">
                  <div className="flex items-start gap-3 mb-5">
                    <div className="w-10 h-10 rounded-lg bg-[#1C1C1E] flex items-center justify-center shrink-0">
                      <Signpost className="h-5 w-5 text-[#F5C800]" />
                    </div>
                    <p className="font-[family-name:var(--font-display)] text-lg font-medium text-[#1C1C1E] leading-snug pt-1.5">
                      Que devez-vous faire face à ce panneau ?
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div
                      className="flex items-center gap-3 rounded-lg border-2 border-[#235C43] px-4 py-2.5"
                      style={{ background: "rgba(35,92,67,0.06)" }}
                    >
                      <CheckCircle2 className="h-4 w-4 text-[#235C43] shrink-0" />
                      <span className="text-sm font-semibold text-[#235C43]">
                        Céder le passage
                      </span>
                    </div>
                    {[
                      "Accélérer pour passer",
                      "S\u2019arrêter obligatoirement",
                    ].map((opt) => (
                      <div
                        key={opt}
                        className="flex items-center gap-3 rounded-lg border border-[#1C1C1E]/10 px-4 py-2.5"
                      >
                        <span className="h-4 w-4 rounded-full border border-[#1C1C1E]/20 shrink-0" />
                        <span className="text-sm text-[#6B7280]">{opt}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bande d'explication — distinct d'un simple screenshot SaaS */}
                <div
                  className="border-t-2 border-[#235C43]/20 px-5 py-3.5"
                  style={{ background: "rgba(35,92,67,0.06)" }}
                >
                  <p className="text-xs text-[#235C43] font-medium leading-relaxed">
                    ✓ Céder le passage = laisser passer les autres, sans
                    s&apos;arrêter obligatoirement.
                  </p>
                </div>
              </div>

              {/* Badge preuve */}
              <div className="mt-4 inline-flex items-center gap-3 bg-[#1C1C1E] text-white rounded-xl px-4 py-3 border-2 border-[#1C1C1E] shadow-[4px_4px_0_rgba(0,0,0,0.3)]">
                <ShieldCheck className="h-5 w-5 text-[#F5C800]" />
                <div>
                  <p className="font-[family-name:var(--font-display)] text-xl font-bold text-[#F5C800] leading-none">
                    87%
                  </p>
                  <p className="text-[10px] text-white/50 mt-0.5">
                    de réussite au premier essai (Premium)
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Tirets routiers en bas du hero */}
          <div className="mt-16">
            <LigneDivision />
          </div>
        </div>
      </section>

      {/* ══════════════ STATS ══════════════ */}
      <section className="bg-[#F9F9F7]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map((stat, index) => (
              <Reveal key={stat.label} delay={index * 80}>
                <div className="text-center">
                  <p className="font-[family-name:var(--font-display)] text-4xl font-bold text-[#1C1C1E]">
                    {stat.chiffre}
                  </p>
                  <p className="mt-1.5 text-xs text-[#6B7280] leading-tight">
                    {stat.label}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
        <LigneDivision />
      </section>

      {/* ══════════════ POURQUOI FEU VERT ══════════════ */}
      <section className="bg-slate-900/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <Reveal className="mb-12">
            <Etiquette light>Pourquoi Feu Vert</Etiquette>
            <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-semibold text-white">
              Mieux qu&apos;un livret de révision
            </h2>
            <p className="mt-3 text-white/50 max-w-xl leading-relaxed">
              Le code de la route a beaucoup changé. Réviser avec des questions
              actualisées et des corrections claires fait toute la différence.
            </p>
          </Reveal>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Avant */}
            <Reveal>
              <div className="h-full rounded-xl bg-white border-2 border-[#1C1C1E] shadow-[6px_6px_0_#1C1C1E] p-8 sm:p-10">
                <div className="flex items-center gap-4 mb-7">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#C0392B]/10 text-[#C0392B]">
                    <X className="h-5 w-5" />
                  </span>
                  <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[#1C1C1E]">
                    Réviser seul, avec un livret
                  </h3>
                </div>
                <ul className="space-y-4">
                  {AVANT.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <X className="h-4 w-4 shrink-0 text-[#C0392B] mt-0.5" />
                      <span className="text-sm text-[#6B7280] leading-snug">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            {/* Après */}
            <Reveal delay={100}>
              <div className="h-full rounded-xl bg-white border-2 border-[#1C1C1E] shadow-[6px_6px_0_#1C1C1E] p-8 sm:p-10">
                <div className="flex items-center gap-4 mb-7">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#235C43]/10 text-[#235C43]">
                    <Check className="h-5 w-5" />
                  </span>
                  <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[#1C1C1E]">
                    Réviser avec Feu Vert
                  </h3>
                </div>
                <ul className="space-y-4">
                  {APRES.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <Check className="h-4 w-4 shrink-0 text-[#235C43] mt-0.5" />
                      <span className="text-sm text-[#1C1C1E] font-semibold leading-snug">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
        <LigneDivision dark />
      </section>
      {/* ══════════════ THÈMES ══════════════ */}
      <section id="themes" className="bg-[#F9F9F7]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <Reveal className="mb-12 max-w-2xl">
            <Etiquette>Programme</Etiquette>
            <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-semibold text-[#1C1C1E]">
              Les 9 thèmes du code, en un seul endroit
            </h2>
            <p className="mt-3 text-[#6B7280] leading-relaxed">
              Chaque thème regroupe les questions les plus posées à
              l&apos;examen, classées par difficulté croissante.
            </p>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {THEMES.map((theme, index) => (
              <Reveal key={theme.title} delay={(index % 3) * 80}>
                <div className="group h-full rounded-xl bg-white border border-[#1C1C1E]/8 p-6 transition-all duration-300 ease-in-out hover:border-[#235C43]/35 hover:shadow-[4px_4px_0_#235C43] cursor-default">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#F5C800] flex items-center justify-center shrink-0 transition-colors duration-300 ease-in-out group-hover:bg-[#235C43]">
                      <theme.icon className="h-5 w-5 text-[#1C1C1E] transition-colors duration-300 ease-in-out group-hover:text-white" />
                    </div>
                    <div>
                      <h3 className="font-[family-name:var(--font-display)] text-lg font-medium text-[#1C1C1E]">
                        {theme.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-[#6B7280]">
                        {theme.description}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
        <LigneDivision />
      </section>

      {/* ══════════════ TYPES DE PERMIS ══════════════ */}
      <section className="bg-[#F5C800]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <Reveal className="mb-12">
            <Etiquette>Catégories</Etiquette>
            <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-semibold text-[#1C1C1E]">
              Quel permis préparez-vous ?
            </h2>
            <p className="mt-3 text-[#1C1C1E]/60 max-w-xl leading-relaxed">
              Le tronc commun du code est le même pour tous, mais quelques
              questions changent selon le véhicule visé. Choisissez votre
              catégorie pour affiner vos séries.
            </p>
          </Reveal>

          <LicenseTypeGrid variant="home" />
        </div>
        <LigneDivision />
      </section>

      {/* ══════════════ POURQUOI ÇA COMPTE ══════════════ */}
      <section className="bg-[#F9F9F7]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
            <Reveal>
              <Etiquette>Pourquoi ça compte</Etiquette>
              <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-semibold text-[#1C1C1E]">
                Un accident évitable commence souvent par une règle mal
                comprise.
              </h2>
              <p className="mt-5 leading-relaxed text-[#6B7280]">
                Au Bénin, la route reste l&apos;un des endroits les plus
                dangereux du quotidien. La plupart des accidents ne viennent pas
                d&apos;un excès spectaculaire, mais d&apos;une priorité mal
                négociée, d&apos;une distance de sécurité oubliée, d&apos;un
                panneau mal interprété.
              </p>
              <p className="mt-4 leading-relaxed text-[#6B7280]">
                Le code de la route n&apos;est pas une formalité administrative
                : c&apos;est la première leçon de conduite, celle qui évite les
                erreurs qui coûtent cher. Feu Vert existe pour que cette leçon
                soit comprise, pas seulement récitée le temps d&apos;un examen.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Comprendre une règle, pas seulement mémoriser une réponse",
                  "Une correction pédagogique après chaque erreur",
                  "Des candidats prêts pour la route, pas seulement pour l'examen",
                ].map((ligne) => (
                  <li
                    key={ligne}
                    className="flex items-start gap-2.5 text-sm text-[#1C1C1E]"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#235C43]" />
                    {ligne}
                  </li>
                ))}
              </ul>
              <Link
                href="/sign-up"
                className="group mt-8 inline-flex items-center gap-2 bg-[#235C43] text-white text-sm font-semibold px-7 py-3.5 rounded-full shadow-[4px_4px_0_#1C1C1E] transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:shadow-[4px_6px_0_#1C1C1E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#235C43]"
              >
                Commencer à réviser
                <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
              </Link>
            </Reveal>

            <Reveal delay={120}>
              <div className="grid h-[420px] grid-cols-2 gap-4 sm:h-[480px]">
                <div className="grid grid-rows-2 gap-4">
                  <div className="overflow-hidden rounded-xl border-2 border-[#1C1C1E] shadow-[4px_4px_0_#1C1C1E]">
                    <img
                      src="images/young-woman-taxi-cotonou.png"
                      alt="Candidate révisant sur son téléphone"
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 ease-out hover:scale-105"
                    />
                  </div>
                  <div className="overflow-hidden rounded-xl border-2 border-[#1C1C1E] shadow-[4px_4px_0_#1C1C1E]">
                    <img
                      src="images/cotonou-uban-traffic.png"
                      alt="Carrefour urbain à Cotonou"
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 ease-out hover:scale-105"
                    />
                  </div>
                </div>
                <div className="overflow-hidden rounded-xl border-2 border-[#1C1C1E] shadow-[4px_4px_0_#1C1C1E]">
                  <img
                    src="images/young_man_with_driving_license.png"
                    alt="Jeune conducteur avec son permis"
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 ease-out hover:scale-105"
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
        <LigneDivision />
      </section>

      {/* ══════════════ PARCOURS ══════════════ */}
      <section id="fonctionnement" className="bg-[#1C1C1E]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <Reveal className="mb-14">
            <Etiquette light>Méthode</Etiquette>
            <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-semibold text-white">
              Quatre étapes jusqu&apos;au permis
            </h2>
            <p className="mt-3 text-white/40 max-w-xl leading-relaxed">
              Une progression pensée pour construire de vrais réflexes, pas
              seulement mémoriser des réponses.
            </p>
          </Reveal>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {ETAPES.map((etape, index) => (
              <Reveal key={etape.numero} delay={index * 100} y={16}>
                <div className="relative">
                  {/* Grand chiffre en filigrane */}
                  <p
                    className="font-[family-name:var(--font-display)] font-bold leading-none select-none mb-3 text-[#F5C800]/15"
                    style={{ fontSize: "6rem" }}
                  >
                    {etape.numero}
                  </p>
                  {/* Icône qui se superpose au chiffre */}
                  <div className="absolute top-0 left-0">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F5C800] text-[#1C1C1E]">
                      <etape.icon className="h-5 w-5" />
                    </span>
                  </div>
                  <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold text-white">
                    {etape.titre}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/40">
                    {etape.texte}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
        <LigneDivision dark />
      </section>

      {/* ══════════════ TÉMOIGNAGES ══════════════ */}
      <section className="bg-[#F9F9F7]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <Reveal className="mb-14 text-center max-w-2xl mx-auto">
            <Etiquette>Avis</Etiquette>
            <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-semibold text-[#1C1C1E]">
              Ils ont eu leur code avec Feu Vert
            </h2>
          </Reveal>

          <div className="grid gap-5 sm:grid-cols-3">
            {AVIS.map((avis, index) => (
              <Reveal key={avis.nom} delay={index * 90}>
                <figure className="h-full rounded-xl bg-white border border-[#1C1C1E]/8 p-6 transition-all duration-300 ease-in-out hover:border-[#235C43]/30 hover:shadow-[4px_4px_0_#235C43]">
                  <div className="flex text-[#F5C800] mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-sm leading-relaxed text-[#1C1C1E]">
                    « {avis.texte} »
                  </blockquote>
                  <figcaption className="mt-5 text-sm font-bold text-[#1C1C1E]">
                    {avis.nom}{" "}
                    <span className="font-normal text-[#6B7280]">
                      · {avis.ville}
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
        <LigneDivision />
      </section>

      {/* ══════════════ CONFIANCE ══════════════ */}
      <section className="bg-[#235C43]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid gap-8 sm:grid-cols-3">
            {CONFIANCE.map((item, index) => (
              <Reveal key={item.label} delay={index * 80}>
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-[#F5C800]">
                    <item.icon className="h-4 w-4" />
                  </span>
                  <p className="text-sm font-medium text-white">{item.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
        <LigneDivision dark />
      </section>

      {/* ══════════════ FAQ ══════════════ */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Reveal className="text-center mb-12">
          <Etiquette>Questions fréquentes</Etiquette>
          <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-semibold text-[#1C1C1E]">
            Tout ce qu&apos;il faut savoir avant de commencer
          </h2>
        </Reveal>

        <Reveal className="space-y-3">
          {FAQ.map((item) => (
            <details
              key={item.question}
              className="group rounded-xl bg-white border border-[#1C1C1E]/10 p-6 open:border-[#235C43]/30 open:shadow-[4px_4px_0_#235C43] transition-shadow duration-300 ease-in-out"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-[#1C1C1E] marker:content-none">
                {item.question}
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#F5C800] text-[#1C1C1E] font-bold text-base leading-none transition-transform duration-300 ease-in-out group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-4 text-sm leading-relaxed text-[#6B7280]">
                {item.reponse}
              </p>
            </details>
          ))}
        </Reveal>
      </section>

      {/* ══════════════ TARIFS ══════════════ */}
      <section id="tarifs" className="bg-[#F5C800]">
        <LigneDivision />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <Reveal className="text-center mb-14">
            <Etiquette>Tarifs</Etiquette>
            <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-semibold text-[#1C1C1E]">
              Un tarif simple, sans surprise
            </h2>
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-2">
            {/* Gratuit */}
            <Reveal delay={0}>
              <div className="flex h-full flex-col rounded-xl bg-white border-2 border-[#1C1C1E] shadow-[6px_6px_0_rgba(28,28,30,0.16)] p-8">
                <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[#1C1C1E]">
                  Gratuit
                </h3>
                <p className="mt-1 text-sm text-[#6B7280]">
                  Pour découvrir la plateforme
                </p>
                <p className="mt-6 font-[family-name:var(--font-display)] text-4xl font-bold text-[#1C1C1E]">
                  0 FCFA
                </p>
                <ul className="mt-6 flex-1 space-y-3 text-sm">
                  {[
                    "20 questions par jour",
                    "3 thèmes débloqués",
                    "Suivi de score basique",
                  ].map((ligne) => (
                    <li
                      key={ligne}
                      className="flex items-start gap-2.5 text-[#1C1C1E]"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#6B7280]" />
                      {ligne}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/sign-up"
                  className="mt-8 block text-center text-sm font-bold text-[#1C1C1E] border-2 border-[#1C1C1E] rounded-full px-6 py-3 transition-colors duration-300 ease-in-out hover:bg-[#1C1C1E] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1C1C1E]"
                >
                  Commencer gratuitement
                </Link>
              </div>
            </Reveal>

            {/* Premium */}
            <Reveal delay={120}>
              <div className="relative flex h-full flex-col rounded-xl bg-[#1C1C1E] border-2 border-[#1C1C1E] shadow-[6px_6px_0_rgba(28,28,30,0.28)] p-8">
                <span className="absolute right-5 top-5 rounded-md bg-[#F5C800] text-[#1C1C1E] text-[11px] font-bold uppercase tracking-wide px-3 py-1">
                  Conseillé
                </span>
                <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold text-white">
                  Premium
                </h3>
                <p className="mt-1 text-sm text-white/40">
                  Pour préparer sérieusement l&apos;examen
                </p>
                <p className="mt-6 font-[family-name:var(--font-display)] text-4xl font-bold text-white">
                  2 500 FCFA
                  <span className="text-base font-normal text-white/35">
                    {" "}
                    / mois
                  </span>
                </p>
                <ul className="mt-6 flex-1 space-y-3 text-sm">
                  {[
                    "Les 9 thèmes en accès illimité",
                    "Examens blancs chronométrés",
                    "Corrections détaillées après chaque série",
                    "Suivi de progression complet",
                  ].map((ligne) => (
                    <li
                      key={ligne}
                      className="flex items-start gap-2.5 text-white/80"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#F5C800]" />
                      {ligne}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/sign-up?offre=premium"
                  className="mt-8 block text-center text-sm font-bold text-[#1C1C1E] bg-[#F5C800] border-2 border-[#F5C800] rounded-full px-6 py-3 shadow-[4px_4px_0_rgba(0,0,0,0.22)] transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:shadow-[4px_6px_0_rgba(0,0,0,0.22)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5C800]"
                >
                  Passer en Premium
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══════════════ CTA FINAL ══════════════ */}
      <section className="bg-[#235C43]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <Reveal>
            <h2 className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl font-bold text-white">
              Prêt à décrocher votre code ?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-white/55 leading-relaxed">
              Créez votre compte en une minute et commencez votre première série
              de questions dès aujourd&apos;hui.
            </p>
            <Link
              href="/sign-up"
              className="group mt-8 inline-flex items-center gap-2 bg-[#F5C800] text-[#1C1C1E] text-sm font-bold px-8 py-3.5 rounded-full border-2 border-[#1C1C1E] shadow-[4px_4px_0_#1C1C1E] transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:shadow-[4px_6px_0_#1C1C1E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Créer mon compte gratuit
              <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
            </Link>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
