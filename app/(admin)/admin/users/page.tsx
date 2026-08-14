// app/admin/users/page.tsx

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { UsersTable } from "@/components/admin/users-table";
import { requireAdmin } from "@/lib/admin-guard";

const PAR_PAGE = 20;

type PageProps = {
  searchParams: Promise<{ q?: string; page?: string }>;
};

export default async function AdminUsersPage({ searchParams }: PageProps) {
  const session = await requireAdmin();
  const { q, page } = await searchParams;

  const pageActuelle = Math.max(1, Number(page) || 1);

  // READ : le plugin admin gère la recherche, le tri et la pagination
  // directement côté serveur — pas besoin de requête Prisma manuelle ici.
  const { users, total } = await auth.api.listUsers({
    query: {
      searchValue: q || undefined,
      searchField: "email",
      searchOperator: "contains",
      limit: PAR_PAGE,
      offset: (pageActuelle - 1) * PAR_PAGE,
      sortBy: "createdAt",
      sortDirection: "desc",
    },
    headers: await headers(),
  });

  const totalPages = Math.max(1, Math.ceil(total / PAR_PAGE));

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold text-slate-900">
        Utilisateurs
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        {total} compte{total > 1 ? "s" : ""} au total
      </p>

      {/* Formulaire GET : pas besoin de JS, la recherche fonctionne via l'URL */}
      <form className="mt-6 max-w-sm" method="GET">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Rechercher par email…"
          className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-[#235C43] focus:outline-none"
        />
      </form>

      <div className="mt-6">
        <UsersTable users={users} utilisateurConnecteId={session.user.id} />
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <a
              key={p}
              href={`/admin/users?page=${p}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                p === pageActuelle
                  ? "bg-[#1B1D1F] text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {p}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
