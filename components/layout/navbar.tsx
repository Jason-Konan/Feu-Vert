// components/site/navbar.tsx
"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useSession, signOut } from "@/lib/auth-client";
import {
  LayoutDashboard,
  Crown,
  LogOut,
  ChevronDown,
  User,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Accueil", href: "/" },
  { label: "Permis", href: "/permis" },
  { label: "Contact Us", href: "/contact" },
];

type NavbarProps = {
  /** Nom du site depuis les réglages SEO. Repli sur "FeuVert" si absent. */
  siteName?: string;
  /** Logo uploadé depuis /admin/seo. Repli sur le logo pastilles par défaut si absent. */
  logoUrl?: string | null;
};

/** Initiales à partir du nom (ex. "Jean Dupont" -> "JD"), pour le fallback
 *  de l'avatar quand l'utilisateur n'a pas de photo de profil. */
function obtenirInitiales(nom?: string | null, email?: string | null): string {
  if (nom) {
    const parties = nom.trim().split(/\s+/);
    const initiales = parties
      .slice(0, 2)
      .map((mot) => mot[0]?.toUpperCase())
      .join("");
    if (initiales) return initiales;
  }
  return email?.[0]?.toUpperCase() ?? "?";
}

/** Détermine si un lien est actif. Le "/" exige une correspondance exacte
 *  pour éviter que l'accueil reste actif sur toutes les routes ; les autres
 *  liens sont actifs aussi sur leurs sous-routes. */
function estActif(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export default function Navbar({ siteName, logoUrl }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = useSession();

  async function handleSignOut() {
    await signOut();
    router.push("/");
    router.refresh();
  }

  const adminActif = estActif(pathname, "/admin");
  const nom = siteName?.trim() || "FeuVert";

  return (
    <header className="sticky top-0 z-50 border-b border-[#1C1C1E]/8 bg-[#FBFAF7]/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* ── Logo ── */}
        <Link href="/" className="flex items-center justify-center gap-2">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- image externe (Vercel Blob), taille fixe, pas besoin d'optimisation
            <img
              src={logoUrl}
              alt={nom}
              className="h-8 w-auto max-w-[160px] object-contain"
            />
          ) : (
            <>
              <span className="flex flex-col items-center justify-center gap-0.5 rounded-xl border-2 border-[#1C1C1E] p-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#C0392B]" />
                <span className="h-1.5 w-1.5 rounded-full bg-[#F5C800]" />
                <span className="h-1.5 w-1.5 rounded-full bg-[#235C43]" />
              </span>
              <span className="font-[family-name:var(--font-display)] text-2xl font-bold text-slate-950">
                {nom}
              </span>
            </>
          )}
        </Link>

        {/* ── Liens de navigation ── */}
        <ul className="items-center gap-x-2 md:flex">
          {NAV_LINKS.map((link) => {
            const actif = estActif(pathname, link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={actif ? "page" : undefined}
                  className={cn(
                    "relative px-3.5 py-1.5 text-sm font-bold transition-colors duration-200 after:absolute after:bottom-0 after:left-3.5 after:right-3.5 after:h-[2px] after:rounded-full after:bg-[#235C43] after:transition-transform after:duration-200",
                    actif
                      ? "text-[#1C1C1E] after:scale-x-100"
                      : "text-[#6B7280] after:scale-x-0 hover:text-[#1C1C1E]",
                  )}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Pendant le chargement de la session, on réserve l'espace pour
            éviter un saut de mise en page (CLS) quand le contenu apparaît. */}
        {isPending ? (
          <div className="h-9 w-9 animate-pulse rounded-full bg-[#1C1C1E]/8" />
        ) : session?.user ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 rounded-full outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-[#235C43]">
              <Avatar className="h-9 w-9 border border-[#1C1C1E]/10">
                <AvatarImage
                  src={session.user.image ?? undefined}
                  alt={session.user.name ?? ""}
                />
                <AvatarFallback className="bg-[#1C1C1E] text-sm font-bold text-white">
                  {obtenirInitiales(session.user.name, session.user.email)}
                </AvatarFallback>
              </Avatar>
              <ChevronDown className="hidden h-4 w-4 text-[#6B7280] sm:block" />
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-56 rounded-xl border-[#1C1C1E]/10 shadow-[4px_4px_0_rgba(0,0,0,0.08)]"
            >
              <DropdownMenuGroup>
                <DropdownMenuLabel className="font-normal">
                  <p className="truncate text-sm font-bold text-[#1C1C1E]">
                    {session.user.name || "Utilisateur"}
                  </p>
                  <p className="truncate text-xs text-[#6B7280]">
                    {session.user.email}
                  </p>
                </DropdownMenuLabel>
              </DropdownMenuGroup>

              <DropdownMenuSeparator className="bg-[#1C1C1E]/8" />
              <DropdownMenuGroup>
                {session.user.role === "admin" && (
                  <DropdownMenuItem>
                    <Link
                      href="/admin"
                      aria-current={adminActif ? "page" : undefined}
                      className={cn(
                        "flex items-center justify-center gap-1 cursor-pointer",
                        adminActif && "font-bold text-[#235C43]",
                      )}
                    >
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Panel Admin
                    </Link>
                  </DropdownMenuItem>
                )}{" "}
                <DropdownMenuItem>
                  <Link
                    href="/dashboard"
                    className="flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Tableau de bord
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link
                    href="/dashboard#premium"
                    className="flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Crown className="mr-2 h-4 w-4 text-[#F5C800]" />
                    Passer premium
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator className="bg-[#1C1C1E]/8" />
              <DropdownMenuGroup>
                {" "}
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="flex items-center justify-center gap-1 cursor-pointer text-[#C0392B] focus:text-[#C0392B]"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Se déconnecter
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/login"
              className="hidden rounded-full border-2 border-[#1C1C1E]/12 bg-white px-5 py-2 text-sm font-bold text-[#1C1C1E] transition-all duration-200 hover:border-[#1C1C1E]/25 hover:shadow-[3px_3px_0_rgba(0,0,0,0.08)] md:inline-block"
            >
              Se connecter
            </Link>
            <Link
              href="/sign-up"
              className="hidden rounded-full bg-[#1C1C1E] px-5 py-2 text-sm font-bold text-white shadow-[3px_3px_0_rgba(0,0,0,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#2a2a2c] hover:shadow-[3px_5px_0_rgba(0,0,0,0.18)] md:inline-block"
            >
              Créer un compte
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
