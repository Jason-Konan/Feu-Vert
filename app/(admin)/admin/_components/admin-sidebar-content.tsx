// app/admin/_components/admin-sidebar-content.tsx
import Link from "next/link";
import { AdminNav } from "./admin-nav";

interface AdminSidebarContentProps {
  email: string;
  onNavigate?: () => void;
}

export function AdminSidebarContent({
  email,
  onNavigate,
}: AdminSidebarContentProps) {
  return (
    <div className="flex h-full flex-col">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Administration
        </p>
        <p className="mt-1 truncate text-sm text-slate-300">{email}</p>
      </div>

      <AdminNav onNavigate={onNavigate} />

      <Link
        href="/dashboard"
        onClick={onNavigate}
        className="mt-auto pt-8 block text-xs font-medium text-slate-500 hover:text-slate-300"
      >
        ← Retour au site
      </Link>
    </div>
  );
}
