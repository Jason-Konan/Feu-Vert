// app/admin/layout.tsx

import { requireAdmin } from "@/lib/admin-guard";
import { AdminSidebar } from "./_components/admin-sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Protège TOUTES les routes sous /admin d'un seul coup — pas besoin de
  // répéter ce contrôle dans chaque sous-page.
  const session = await requireAdmin();

  return (
    <div className="flex min-h-screen flex-col bg-[#EEECE4] md:flex-row">
      <AdminSidebar email={session.user.email} />

      {/* ------------------- CONTENU ------------------- */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
