// app/admin/_components/admin-nav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  IdCard,
  BookOpen,
  ListChecks,
  Users,
  Search,
  LetterText,
} from "lucide-react";
import { cn } from "@/lib/utils";

const LIENS_ADMIN = [
  { label: "Vue d'ensemble", href: "/admin", icone: LayoutDashboard },
  { label: "Catégories de permis", href: "/admin/permis", icone: IdCard },
  { label: "Cours", href: "/admin/cours", icone: BookOpen },
  { label: "Questions de test", href: "/admin/tests", icone: ListChecks },
  { label: "Utilisateurs", href: "/admin/users", icone: Users },
  { label: "Messages", href: "/admin/messages", icone: LetterText },
  { label: "SEO", href: "/admin/seo", icone: Search },
];

/** "/admin" exige une correspondance exacte (sinon il resterait actif
 *  partout, vu que toutes les routes admin commencent par /admin). */
function estActif(pathname: string, href: string): boolean {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(href + "/");
}

interface AdminNavProps {
  /** Appelé au clic sur un lien — utilisé pour fermer le offcanvas mobile. */
  onNavigate?: () => void;
}

export function AdminNav({ onNavigate }: AdminNavProps) {
  const pathname = usePathname();

  return (
    <nav className="mt-8 flex flex-col gap-1">
      {LIENS_ADMIN.map((lien) => {
        const Icone = lien.icone;
        const actif = estActif(pathname, lien.href);
        return (
          <Link
            key={lien.label}
            href={lien.href}
            onClick={onNavigate}
            aria-current={actif ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              actif
                ? "bg-white/10 text-white"
                : "text-slate-300 hover:bg-white/5 hover:text-white",
            )}
          >
            <Icone className="h-4 w-4" />
            {lien.label}
          </Link>
        );
      })}
    </nav>
  );
}
