// components/site/navbar.tsx
"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession, signOut } from "@/lib/auth-client";
import { LayoutDashboard, Crown, LogOut, ChevronDown } from "lucide-react";
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

const NAV_LINKS = [
  { label: "Accueil", href: "/" },
  { label: "Permis", href: "/permis" },
];

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

export default function Navbar() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  async function handleSignOut() {
    await signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/50 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center justify-center gap-2">
          <span className="flex flex-col items-center justify-center gap-0.5 rounded-full border-2 border-slate-900 p-0.5">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
          </span>
          <span className="text-2xl font-medium">FeuVert</span>
        </Link>

        <ul className="items-center gap-x-2 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Pendant le chargement de la session, on réserve l'espace pour
            éviter un saut de mise en page (CLS) quand le contenu apparaît. */}
        {isPending ? (
          <div className="h-9 w-9 animate-pulse rounded-full bg-slate-200" />
        ) : session?.user ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 rounded-full outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-slate-900">
              <Avatar className="h-9 w-9">
                <AvatarImage
                  src={session.user.image ?? undefined}
                  alt={session.user.name ?? ""}
                />
                <AvatarFallback className="bg-slate-900 text-sm font-medium text-white">
                  {obtenirInitiales(session.user.name, session.user.email)}
                </AvatarFallback>
              </Avatar>
              <ChevronDown className="hidden h-4 w-4 text-slate-500 sm:block" />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="font-normal">
                  <p className="truncate text-sm font-medium text-slate-900">
                    {session.user.name || "Utilisateur"}
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    {session.user.email}
                  </p>
                </DropdownMenuLabel>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {" "}
                <DropdownMenuItem>
                  <Link href="/dashboard" className="cursor-pointer">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Tableau de bord
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/dashboard#premium" className="cursor-pointer">
                    <Crown className="mr-2 h-4 w-4" />
                    Passer premium
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {" "}
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="cursor-pointer text-[#A6402B] focus:text-[#A6402B]"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Se déconnecter
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/sign-up"
              className="hidden rounded bg-slate-900 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700 md:inline-block"
            >
              Créer un compte
            </Link>
            <Link
              href="/login"
              className="hidden rounded bg-slate-100 px-5 py-2 text-sm font-medium text-slate-900 transition-colors hover:bg-slate-200 md:inline-block"
            >
              Se connecter
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
