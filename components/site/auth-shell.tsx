// components/site/auth-shell.tsx
import Link from "next/link";
import { Fredoka, Plus_Jakarta_Sans } from "next/font/google";
import { ShieldCheck, Timer, BookOpen } from "lucide-react";

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

const ATOUTS = [
  {
    icon: BookOpen,
    titre: "1 240 questions officielles",
    desc: "9 thèmes, adaptés au code béninois, mis à jour régulièrement.",
  },
  {
    icon: Timer,
    titre: "Examens blancs chronométrés",
    desc: "Dans les conditions exactes de l'épreuve — 40 questions, même durée.",
  },
  {
    icon: ShieldCheck,
    titre: "87 % de réussite",
    desc: "Au premier essai avec l'abonnement Premium.",
  },
] as const;

/** Tirets de marquage routier — signature visuelle v5 */
function LigneDivision({ dark = false }: { dark?: boolean }) {
  return (
    <div
      aria-hidden="true"
      style={{
        height: "4px",
        background: dark
          ? "repeating-linear-gradient(90deg,rgba(255,255,255,0.15) 0px,rgba(255,255,255,0.15) 28px,transparent 28px,transparent 48px)"
          : "repeating-linear-gradient(90deg,#1C1C1E 0px,#1C1C1E 28px,transparent 28px,transparent 48px)",
      }}
    />
  );
}

interface AuthShellProps {
  children: React.ReactNode;
}

export default function AuthShell({ children }: AuthShellProps) {
  return (
    <div
      className={`${display.variable} ${body.variable} relative flex min-h-screen bg-[#F9F9F7] font-[family-name:var(--font-body)] antialiased`}
    >
      {/* Liseré tricolore béninois */}
      <div className="absolute inset-x-0 top-0 z-30 flex h-[3px]">
        <span className="flex-1 bg-[#008751]" />
        <span className="flex-1 bg-[#FCD116]" />
        <span className="flex-1 bg-[#E8112D]" />
      </div>

      {/* ─────────── PANNEAU GAUCHE — bitume ─────────── */}
      <aside className="relative hidden w-[44%] flex-col justify-between overflow-hidden bg-[#1C1C1E] p-12 pt-16 lg:flex">
        {/* Cercles décoratifs */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border border-[#F5C800] opacity-[0.07]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 -left-16 h-80 w-80 rounded-full border border-[#F5C800] opacity-[0.05]"
        />

        {/* Logo */}
        <Link href="/" className="relative z-10 inline-flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F5C800] font-[family-name:var(--font-display)] text-sm font-bold text-[#1C1C1E]">
            FV
          </span>
          <span className="font-[family-name:var(--font-display)] text-xl font-semibold tracking-wide text-white">
            FeuVert
          </span>
          <span className="ml-0.5 rounded-md bg-white/8 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/30">
            Bénin
          </span>
        </Link>

        {/* Accroche principale */}
        <div className="relative z-10 space-y-8">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-[2.4rem] font-bold leading-[1.1] text-white">
              Code de la route,{" "}
              <span className="text-[#F5C800]">réussi du premier coup.</span>
            </h2>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/40">
              Questions officielles, corrections qui expliquent chaque erreur,
              examens blancs dans les conditions réelles.
            </p>
          </div>

          {/* Atouts */}
          <ul className="space-y-5 border-t border-white/8 pt-6">
            {ATOUTS.map((atout) => (
              <li key={atout.titre} className="flex items-start gap-3.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F5C800] text-[#1C1C1E]">
                  <atout.icon className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">
                    {atout.titre}
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed text-white/35">
                    {atout.desc}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          {/* Badge stat */}
          <div className="inline-flex items-center gap-3 rounded-xl border-2 border-white/8 bg-white/5 px-4 py-3">
            <span className="font-[family-name:var(--font-display)] text-2xl font-bold text-[#F5C800]">
              15 000+
            </span>
            <p className="text-xs leading-snug text-white/40">
              candidats formés
              <br />
              dans le pays
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="relative z-10 text-[10px] uppercase tracking-[0.14em] text-white/18">
          © {new Date().getFullYear()} FeuVert — Préparation au permis béninois
        </p>
      </aside>

      {/* ─────────── PANNEAU DROIT — formulaire ─────────── */}
      <main className="flex flex-1 flex-col items-center justify-center p-6 pt-12 sm:p-10 lg:p-14">
        {/* Logo mobile */}
        <Link href="/" className="mb-10 flex items-center gap-2.5 lg:hidden">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1C1C1E] font-[family-name:var(--font-display)] text-sm font-bold text-[#F5C800]">
            FV
          </span>
          <span className="font-[family-name:var(--font-display)] text-lg font-semibold text-[#1C1C1E]">
            FeuVert
          </span>
        </Link>

        <div className="w-full max-w-[22rem]">{children}</div>
      </main>
    </div>
  );
}
