import Link from "next/link";
import { Barlow_Condensed, Work_Sans } from "next/font/google";
import {
  Signpost,
  GitFork,
  Gauge,
  ShieldAlert,
  HeartPulse,
  Wrench,
  Check,
  X,
  ShieldCheck,
  Smartphone,
  MessageCircle,
  ArrowRight,
  ArrowLeftRight,
  Flag,
  Bike,
  Car,
  Truck,
  Bus,
  Link2,
  Star,
  ListChecks,
  Repeat,
  Timer,
  CheckCircle2,
} from "lucide-react";
import { Reveal } from "./reveal";
import { PERMIS } from "@/lib/data/permis";

/* ------------------------------------------------------------------ */
/*  Typographie                                                        */
/*  Barlow Condensed pour les titres — la même famille de forme que    */
/*  les panneaux de signalisation — et Work Sans pour le corps de      */
/*  texte, plus posé, pour ne pas fatiguer sur les longs paragraphes.  */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/*  Palette                                                             */
/*  Vert, jaune, rouge : les couleurs du feu tricolore sont aussi      */
/*  celles du drapeau béninois. On les assume comme identité plutôt    */
/*  que comme simples couleurs de statut (succès/erreur générique).    */
/* ------------------------------------------------------------------ */
// vert  #235C43 · jaune #B98A2E · rouge #A6402B · encre #1B1D1F · papier #EEECE4

function FeuTricolore({ className = "h-6 w-3" }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 26" fill="none" className={className}>
      <rect
        x="0.5"
        y="0.5"
        width="11"
        height="25"
        rx="5.5"
        stroke="currentColor"
        strokeWidth="1"
      />
      <circle cx="6" cy="6.5" r="2.4" fill="#A6402B" />
      <circle cx="6" cy="13" r="2.4" fill="#B98A2E" />
      <circle
        cx="6"
        cy="19.5"
        r="2.4"
        fill="#235C43"
        className="motion-safe:animate-pulse"
      />
    </svg>
  );
}

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-[family-name:var(--font-body)] text-xs font-semibold uppercase tracking-[0.2em] text-[#235C43]">
      {children}
    </p>
  );
}

/* ------------------------------------------------------------------ */
/*  Données                                                             */
/* ------------------------------------------------------------------ */

const THEMES = [
  {
    icon: Signpost,
    title: "Panneaux de signalisation",
    description:
      "Danger, interdiction, obligation, indication : apprenez à les reconnaître d'un coup d'œil.",
  },
  {
    icon: GitFork,
    title: "Priorités et intersections",
    description:
      "Ronds-points, carrefours et priorités à droite, expliqués cas par cas.",
  },
  {
    icon: Gauge,
    title: "Vitesse et distances",
    description:
      "Limitations, distances de sécurité et temps de freinage selon les conditions.",
  },
  {
    icon: ShieldAlert,
    title: "Alcool, fatigue et sécurité",
    description:
      "Les règles qui protègent le conducteur, les passagers et les autres usagers.",
  },
  {
    icon: HeartPulse,
    title: "Premiers secours",
    description: "Les bons réflexes à avoir en cas d'accident sur la route.",
  },
  {
    icon: Wrench,
    title: "Mécanique et entretien",
    description: "Ce qu'il faut vérifier avant de prendre le volant.",
  },
] as const;

const ETAPES = [
  {
    numero: "01",
    titre: "Choisissez un thème",
    texte:
      "Révisez chaque catégorie du code à votre rythme, avec une explication claire après chaque question.",
    icon: ListChecks,
    arrivee: false,
  },
  {
    numero: "02",
    titre: "Enchaînez les séries",
    texte:
      "Des lots de 20 questions pour ancrer les réflexes, avec un score affiché en temps réel.",
    icon: Repeat,
    arrivee: false,
  },
  {
    numero: "03",
    titre: "Passez un examen blanc",
    texte:
      "40 questions chronométrées, dans les conditions réelles de l'examen béninois.",
    icon: Timer,
    arrivee: false,
  },
  {
    numero: "04",
    titre: "Le jour de l'examen",
    texte:
      "Vous arrivez en salle en ayant déjà vécu l'épreuve plusieurs fois : même durée, même nombre de questions, même pression maîtrisée.",
    icon: Flag,
    arrivee: true,
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

const SANS_FEU_VERT = [
  "Questions du livret parfois dépassées",
  "Aucune explication après une erreur",
  "Impossible de suivre sa progression",
  "Pas de mise en situation chronométrée",
] as const;

const AVEC_FEU_VERT = [
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
  {
    chiffre: "87%",
    label: "de réussite au premier essai (utilisateurs Premium)",
  },
  {
    chiffre: "1 240",
    label: "questions officielles couvrant les 9 thèmes du code",
  },
  {
    chiffre: "15 000+",
    label: "candidats formés à Cotonou, Porto-Novo, Parakou et Abomey-Calavi",
  },
  { chiffre: "24/7", label: "accès aux séries d'entraînement" },
] as const;

export default function Home() {
  return (
    <main
      className={`${display.variable} ${body.variable} bg-[#EEECE4] font-[family-name:var(--font-body)] text-slate-800 antialiased`}
    >
      {/* Animation de la ligne médiane de route + réduction de mouvement */}
      <style>{`
        @keyframes roadmove { to { stroke-dashoffset: -68; } }
        .road-dash { animation: roadmove 1.6s linear infinite; }
        @media (prefers-reduced-motion: reduce) {
          .road-dash { animation: none; }
        }
      `}</style>

      {/* ------------------- HERO ------------------- */}
      <section className="relative overflow-hidden bg-[#1B1D1F]">
        {/* texture de fond : grille de points, très discrète */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{
            background:
              "linear-gradient(to right, transparent, rgba(185,138,46,0.4), transparent)",
          }}
        />

        <div className="mx-auto grid max-w-6xl gap-14 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8">
          {/* Colonne texte */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 relative z-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-300">
              <FeuTricolore className="h-3.5 w-2 text-slate-500" />
              Basé sur le code de la route béninois · édition 2026
            </span>

            <h1 className="mt-6 font-[family-name:var(--font-display)] text-5xl font-bold leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-[4.2rem]">
              Le code, réussi{" "}
              <span className="text-[#C9A24D]">du premier coup.</span>
            </h1>

            <p className="mt-7 max-w-lg text-lg leading-relaxed text-slate-300">
              Feu Vert prépare les candidats béninois à l&apos;examen du permis
              : questions officielles, corrections qui expliquent chaque erreur,
              et examens blancs chronométrés dans les conditions réelles.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/sign-up"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#235C43] px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1B4933] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B98A2E]"
              >
                Démarrer gratuitement
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="#themes"
                className="inline-flex items-center justify-center rounded-full border border-white/20 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B98A2E]"
              >
                Voir les 9 thèmes
              </a>
            </div>

            {/* Preuve sociale : convivial, humain, chiffré */}
            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/10 pt-6">
              <div className="flex -space-x-2.5">
                {["#235C43", "#B98A2E", "#A6402B", "#3A4048"].map((c, i) => (
                  <span
                    key={c}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold text-white ring-2 ring-[#1B1D1F]"
                    style={{ backgroundColor: c, zIndex: 4 - i }}
                  >
                    {["A", "R", "S", "+"][i]}
                  </span>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 text-[#B98A2E]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
                <p className="mt-0.5 text-xs text-slate-400">
                  15 000+ candidats formés · sans carte bancaire requise
                </p>
              </div>
            </div>
          </div>

          {/* Colonne visuelle : route en perspective, signature de la page.
              Masquée sur mobile pour laisser le texte respirer et éviter
              un empilement trop long avant le premier appel à l'action. */}
          <div className="relative z-0 hidden h-[440px] lg:block lg:h-[500px]">
            <svg
              viewBox="0 0 640 520"
              className="h-full w-full"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1E2329" />
                  <stop offset="100%" stopColor="#0E1013" />
                </linearGradient>
                <linearGradient id="roadSurface" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2B3038" />
                  <stop offset="100%" stopColor="#454C56" />
                </linearGradient>
              </defs>
              <rect width="640" height="520" fill="url(#sky)" />
              <ellipse
                cx="320"
                cy="222"
                rx="230"
                ry="34"
                fill="#B98A2E"
                opacity="0.10"
              />

              {/* route en perspective */}
              <polygon
                points="235,520 405,520 338,222 302,222"
                fill="url(#roadSurface)"
              />
              {/* bas-côtés */}
              <polygon points="0,520 235,520 302,222 210,222" fill="#181B20" />
              <polygon
                points="405,520 640,520 430,222 338,222"
                fill="#181B20"
              />

              {/* ligne médiane pointillée, animée */}
              <line
                x1="320"
                y1="520"
                x2="320"
                y2="228"
                stroke="#B98A2E"
                strokeWidth="7"
                strokeDasharray="20 18"
                className="road-dash"
                strokeLinecap="round"
              />

              {/* portique de signalisation avec feu tricolore */}
              <line
                x1="150"
                y1="222"
                x2="150"
                y2="120"
                stroke="#3A4048"
                strokeWidth="4"
              />
              <line
                x1="150"
                y1="130"
                x2="300"
                y2="130"
                stroke="#3A4048"
                strokeWidth="4"
              />
              <rect
                x="278"
                y="112"
                width="26"
                height="58"
                rx="7"
                fill="#1B1E23"
                stroke="#3A4048"
                strokeWidth="2"
              />
              <circle cx="291" cy="126" r="6" fill="#A6402B" opacity="0.35" />
              <circle cx="291" cy="141" r="6" fill="#B98A2E" opacity="0.35" />
              <circle
                cx="291"
                cy="156"
                r="6"
                fill="#235C43"
                className="motion-safe:animate-pulse"
              />

              {/* panneau kilométrique au bord de route */}
              <line
                x1="470"
                y1="380"
                x2="470"
                y2="300"
                stroke="#3A4048"
                strokeWidth="4"
              />
              <rect
                x="452"
                y="284"
                width="52"
                height="26"
                rx="4"
                fill="#235C43"
              />
              <text
                x="478"
                y="302"
                textAnchor="middle"
                fontSize="14"
                fill="#EEECE4"
                fontFamily="sans-serif"
                fontWeight="700"
              >
                CI
              </text>
            </svg>
            {/* carte principale : question type */}
            <div className="absolute -right-5 hover:-right-20 hover:rotate-[60deg]hover:top-0 duration-300 transition-all top-20 w-[320px] rotate-[3deg] rounded-3xl bg-white p-6 shadow-2xl shadow-black/40 sm:w-[360px]">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Question 7 / 20
                </span>
                <FeuTricolore className="h-5 w-2.5 text-slate-300" />
              </div>

              <div className="mt-5 flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#1B1D1F] text-white">
                  <Signpost className="h-5 w-5" />
                </span>
                <p className="pt-1.5 text-sm font-semibold leading-snug text-slate-900">
                  Que devez-vous faire face à ce panneau ?
                </p>
              </div>

              <div className="mt-5 space-y-2.5">
                <div className="flex items-center gap-2.5 rounded-xl border-2 border-[#235C43] bg-[#235C43]/[0.06] px-4 py-2.5 text-sm font-medium text-[#1B4933]">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-[#235C43]" />
                  Céder le passage
                </div>
                <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-500">
                  <span className="h-4 w-4 shrink-0 rounded-full border border-slate-300" />
                  Accélérer pour passer
                </div>
                <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-500">
                  <span className="h-4 w-4 shrink-0 rounded-full border border-slate-300" />
                  S&apos;arrêter obligatoirement
                </div>
              </div>
            </div>
            {/* Carte flottante de preuve, ancrée sur l'illustration :
                un repère chiffré immédiat, lisible sans lire tout le hero. */}
            <div className="absolute bottom-6 left-0 flex items-center gap-3 rounded-2xl bg-white/95 px-4 py-3 shadow-xl shadow-black/30 backdrop-blur">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#235C43]/10 text-[#235C43]">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <div>
                <p className="font-[family-name:var(--font-display)] text-xl font-bold leading-none text-slate-900">
                  87%
                </p>
                <p className="mt-1 text-[11px] leading-tight text-slate-500">
                  de réussite au premier essai
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------- CHIFFRES CLÉS ------------------- */}
      <section className="border-y border-slate-900/5 bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
          {STATS.map((stat, index) => (
            <Reveal key={stat.label} delay={index * 90}>
              <div className="border-t-2 border-[#235C43]/70 pt-4">
                <p className="font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight text-slate-900">
                  {stat.chiffre}
                </p>
                <p className="mt-1.5 text-sm text-slate-500">{stat.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ------------------- POURQUOI FEU VERT (avant / après éditorial) ------------------- */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Kicker>Pourquoi Feu Vert</Kicker>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Mieux qu&apos;un livret de révision
          </h2>
          <p className="mt-3 text-slate-600">
            Le code de la route a beaucoup changé. Réviser avec des questions
            actualisées et des corrections claires fait toute la différence.
          </p>
        </Reveal>

        <div className="relative mt-16 grid gap-12 lg:grid-cols-[1fr_auto_1fr] lg:gap-x-14">
          {/* Colonne « avant » : atténuée, barrée — le problème qu'on résout */}
          <Reveal>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 lg:text-right">
                Réviser seul, avec un livret
              </h3>
              <ul className="mt-6 space-y-5">
                {SANS_FEU_VERT.map((item, i) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 lg:flex-row-reverse lg:text-right"
                  >
                    <span className="mt-0.5 font-[family-name:var(--font-display)] text-xs font-bold text-slate-300">
                      0{i + 1}
                    </span>
                    <span className="text-base leading-snug text-slate-400 line-through decoration-slate-300 decoration-2">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Séparateur : la transformation, matérialisée par un feu de croisement */}
          <div className="flex items-center justify-center lg:flex-col">
            <div className="hidden w-px flex-1 bg-gradient-to-b from-transparent via-slate-200 to-transparent lg:block" />
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#1B1D1F] text-[#B98A2E] shadow-md shadow-slate-900/10">
              <ArrowLeftRight className="h-5 w-5 rotate-90 lg:rotate-0" />
            </span>
            <div className="hidden w-px flex-1 bg-gradient-to-b from-transparent via-slate-200 to-transparent lg:block" />
          </div>

          {/* Colonne « avec Feu Vert » : affirmée, colorée — la solution */}
          <Reveal delay={120}>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#235C43]">
                Réviser avec Feu Vert
              </h3>
              <ul className="mt-6 space-y-5">
                {AVEC_FEU_VERT.map((item, i) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 font-[family-name:var(--font-display)] text-xs font-bold text-[#235C43]">
                      0{i + 1}
                    </span>
                    <span className="text-base font-medium leading-snug text-slate-800">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ------------------- THÈMES ------------------- */}
      <section
        id="themes"
        className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8"
      >
        <Reveal className="mx-auto max-w-2xl text-center">
          <Kicker>Programme</Kicker>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Les 9 thèmes du code, en un seul endroit
          </h2>
          <p className="mt-3 text-slate-600">
            Chaque thème regroupe les questions les plus posées à l&apos;examen,
            classées par difficulté croissante.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {THEMES.map((theme, index) => (
            <Reveal key={theme.title} delay={(index % 3) * 90}>
              <div className="group h-full rounded-2xl border border-slate-200 bg-white p-7 transition-transform duration-300 hover:-translate-y-1 hover:border-[#235C43]/30 hover:shadow-lg hover:shadow-slate-900/5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1B1D1F] text-white transition-colors group-hover:bg-[#235C43]">
                  <theme.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-base font-semibold text-slate-900">
                  {theme.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  {theme.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ------------------- TYPES DE PERMIS ------------------- */}
      {/* Cartes en pleine image : le titre reste toujours lisible en
          surimpression, et la description apparaît au survol (ou au
          focus clavier) pour garder les cartes légères par défaut. */}
      <section className="border-y border-slate-900/5 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <Kicker>Catégories</Kicker>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Quel permis préparez-vous ?
            </h2>
            <p className="mt-3 text-slate-600">
              Le tronc commun du code est le même pour tous, mais quelques
              questions changent selon le véhicule visé. Choisissez votre
              catégorie pour affiner vos séries.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {PERMIS.map((permis, index) => (
              <Reveal key={permis.code} delay={(index % 3) * 90}>
                <Link
                  href={`/permis/${permis.slug}`}
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
                    <span className="flex items-baseline gap-2">
                      <span className="font-[family-name:var(--font-display)] text-2xl font-bold text-white">
                        Permis {permis.code}
                      </span>
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
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------- UTILITÉ (texte + masonry) ------------------- */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <Reveal>
            <Kicker>Pourquoi ça compte</Kicker>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Un accident évitable commence souvent par une règle mal comprise.
            </h2>
            <p className="mt-5 text-slate-600 leading-relaxed">
              Au Bénin, la route reste l&apos;un des endroits les plus dangereux
              du quotidien. La plupart des accidents ne viennent pas d&apos;un
              excès spectaculaire, mais d&apos;une priorité mal négociée,
              d&apos;une distance de sécurité oubliée, d&apos;un panneau mal
              interprété.
            </p>
            <p className="mt-4 text-slate-600 leading-relaxed">
              Le code de la route n&apos;est pas une formalité administrative :
              c&apos;est la première leçon de conduite, celle qui évite les
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
                  className="flex items-start gap-2.5 text-sm text-slate-700"
                >
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#235C43]" />
                  {ligne}
                </li>
              ))}
            </ul>
            <Link
              href="/sign-up"
              className="group mt-8 inline-flex items-center gap-2 rounded-full bg-[#1B1D1F] px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#235C43]"
            >
              Commencer à réviser
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>

          <Reveal delay={120}>
            <div className="grid h-[420px] grid-cols-2 gap-4 sm:h-[480px]">
              <div className="grid grid-rows-2 gap-4">
                <div className="overflow-hidden rounded-2xl">
                  <img
                    src="https://picsum.photos/seed/feuvert-etude/500/380"
                    alt="Candidate révisant sur son téléphone"
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="overflow-hidden rounded-2xl">
                  <img
                    src="https://picsum.photos/seed/feuvert-route/500/380"
                    alt="Carrefour urbain à Cotonou"
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
              </div>
              <div className="overflow-hidden rounded-2xl">
                <img
                  src="https://picsum.photos/seed/feuvert-permis/500/800"
                  alt="Jeune conducteur avec son permis"
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ------------------- PARCOURS (route à étapes) ------------------- */}
      <section id="fonctionnement" className="bg-[#1B1D1F]">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <Kicker>Méthode</Kicker>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Quatre étapes jusqu&apos;au permis
            </h2>
            <p className="mt-3 text-slate-400">
              Une progression pensée pour construire de vrais réflexes, pas
              seulement mémoriser des réponses.
            </p>
          </Reveal>

          {/* Desktop : quatre bornes le long d'une route horizontale */}
          <div className="relative mt-20 hidden lg:block">
            <div className="absolute left-0 right-0 top-7 h-[3px] rounded-full bg-white/10" />
            <div
              className="absolute left-0 right-0 top-7 h-[3px]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(to right, #B98A2E 0, #B98A2E 16px, transparent 16px, transparent 32px)",
              }}
            />
            <div className="grid grid-cols-4 gap-8">
              {ETAPES.map((etape, index) => (
                <Reveal key={etape.numero} delay={index * 110} y={16}>
                  <div className="flex flex-col items-start">
                    <span
                      className={`relative z-10 flex h-14 w-14 items-center justify-center rounded-full border-2 ${
                        etape.arrivee
                          ? "border-[#235C43] bg-[#235C43] text-white"
                          : "border-[#B98A2E] bg-[#1B1D1F] text-[#B98A2E]"
                      }`}
                    >
                      <etape.icon className="h-6 w-6" />
                    </span>
                    <span className="mt-5 font-[family-name:var(--font-display)] text-xs font-bold tracking-widest text-slate-500">
                      ÉTAPE {etape.numero}
                    </span>
                    <h3 className="mt-1.5 font-[family-name:var(--font-display)] text-xl font-bold tracking-tight text-white">
                      {etape.titre}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-400">
                      {etape.texte}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Mobile : rail vertical, plus dense et lisible en une colonne */}
          <div className="relative mt-16 pl-14 sm:pl-20 lg:hidden">
            <div className="absolute left-[19px] top-1 bottom-1 w-[3px] rounded-full bg-white/10 sm:left-[27px]" />
            <div
              className="absolute left-[19px] top-1 bottom-1 w-[3px] sm:left-[27px]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(to bottom, #B98A2E 0, #B98A2E 14px, transparent 14px, transparent 28px)",
              }}
            />
            <div className="flex flex-col gap-14">
              {ETAPES.map((etape, index) => (
                <Reveal key={etape.numero} delay={index * 110} y={20}>
                  <div className="relative">
                    <span
                      className={`absolute -left-14 top-0 flex h-10 w-10 items-center justify-center rounded-full border-2 sm:-left-20 sm:h-14 sm:w-14 ${
                        etape.arrivee
                          ? "border-[#235C43] bg-[#235C43] text-white"
                          : "border-[#B98A2E] bg-[#1B1D1F] text-[#B98A2E]"
                      }`}
                    >
                      <etape.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                    </span>
                    <h3 className="font-[family-name:var(--font-display)] text-xl font-bold tracking-tight text-white sm:text-2xl">
                      {etape.titre}
                    </h3>
                    <p className="mt-2 max-w-md text-sm text-slate-400">
                      {etape.texte}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ------------------- TÉMOIGNAGES ------------------- */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Kicker>Avis</Kicker>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Ils ont eu leur code avec Feu Vert
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {AVIS.map((avis, index) => (
            <Reveal key={avis.nom} delay={index * 100}>
              <figure className="h-full rounded-2xl bg-white p-7 ring-1 ring-slate-100">
                <FeuTricolore className="h-5 w-2.5 text-slate-300" />
                <blockquote className="mt-4 text-sm leading-relaxed text-slate-700">
                  « {avis.texte} »
                </blockquote>
                <figcaption className="mt-5 text-sm font-semibold text-slate-900">
                  {avis.nom}{" "}
                  <span className="font-normal text-slate-500">
                    · {avis.ville}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ------------------- CONFIANCE ------------------- */}
      <section className="border-y border-slate-900/5 bg-white">
        <div className="mx-auto grid max-w-5xl gap-8 px-4 py-14 sm:grid-cols-3 sm:px-6 lg:px-8">
          {CONFIANCE.map((item, index) => (
            <Reveal key={item.label} delay={index * 90}>
              <div className="flex items-center gap-3">
                <item.icon className="h-5 w-5 shrink-0 text-[#235C43]" />
                <p className="text-sm font-medium text-slate-700">
                  {item.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ------------------- FAQ ------------------- */}
      <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal className="text-center">
          <Kicker>Questions fréquentes</Kicker>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Tout ce qu&apos;il faut savoir avant de commencer
          </h2>
        </Reveal>

        <Reveal className="mt-10">
          <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
            {FAQ.map((item) => (
              <details key={item.question} className="group p-6">
                <summary className="cursor-pointer list-none text-sm font-semibold text-slate-900 marker:content-none">
                  <span className="flex items-center justify-between gap-4">
                    {item.question}
                    <span className="shrink-0 text-slate-400 transition-transform duration-300 group-open:rotate-45">
                      ＋
                    </span>
                  </span>
                </summary>
                <p className="mt-3 text-sm text-slate-600">{item.reponse}</p>
              </details>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ------------------- TARIFS ------------------- */}
      <section id="tarifs" className="border-t border-slate-100 bg-slate-50">
        <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <Kicker>Tarifs</Kicker>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Un tarif simple, sans surprise
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-6 sm:grid-cols-2">
            {/* Offre gratuite */}
            <Reveal delay={0}>
              <div className="h-full rounded-2xl border border-slate-200 bg-white p-8">
                <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-slate-900">
                  Gratuit
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Pour découvrir la plateforme
                </p>
                <p className="mt-6 font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight text-slate-900">
                  0 FCFA
                </p>
                <ul className="mt-6 space-y-3 text-sm text-slate-600">
                  {[
                    "20 questions par jour",
                    "3 thèmes débloqués",
                    "Suivi de score basique",
                  ].map((ligne) => (
                    <li key={ligne} className="flex items-start gap-2.5">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                      {ligne}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/sign-up"
                  className="mt-8 block rounded-full border border-slate-300 px-6 py-3 text-center text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-50"
                >
                  Commencer gratuitement
                </Link>
              </div>
            </Reveal>

            {/* Offre premium */}
            <Reveal delay={120}>
              <div className="h-full rounded-2xl bg-[#1B1D1F] p-8 ring-1 ring-[#1B1D1F]">
                <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-white">
                  Premium
                </h3>
                <p className="mt-1 text-sm text-slate-400">
                  Pour préparer sérieusement l&apos;examen
                </p>
                <p className="mt-6 font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight text-white">
                  2 500 FCFA
                  <span className="text-base font-normal text-slate-400">
                    {" "}
                    / mois
                  </span>
                </p>
                <ul className="mt-6 space-y-3 text-sm text-slate-300">
                  {[
                    "Les 9 thèmes en accès illimité",
                    "Examens blancs chronométrés",
                    "Corrections détaillées après chaque série",
                    "Suivi de progression complet",
                  ].map((ligne) => (
                    <li key={ligne} className="flex items-start gap-2.5">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#B98A2E]" />
                      {ligne}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/sign-up?offre=premium"
                  className="mt-8 block rounded-full bg-[#235C43] px-6 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-[#1B4933]"
                >
                  Passer en Premium
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ------------------- APPEL À L'ACTION FINAL ------------------- */}
      <section className="bg-white">
        <Reveal className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <FeuTricolore className="mx-auto h-8 w-4 text-slate-900" />
          <h2 className="mt-6 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Prêt à décrocher votre code ?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-600">
            Créez votre compte en une minute et commencez votre première série
            de questions dès aujourd&apos;hui.
          </p>
          <Link
            href="/sign-up"
            className="group mt-8 inline-flex items-center gap-2 rounded-full bg-[#1B1D1F] px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#235C43]"
          >
            Créer mon compte gratuit
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </section>

      {/* Trait tricolore en pied de page, écho discret du filet du haut */}
      <div className="flex h-1 w-full">
        <div className="flex-1 bg-[#235C43]" />
        <div className="flex-1 bg-[#B98A2E]" />
        <div className="flex-1 bg-[#A6402B]" />
      </div>
    </main>
  );
}
