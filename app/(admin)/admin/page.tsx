// app/admin/page.tsx

import prisma from "@/lib/prisma";

export default async function AdminPage() {
  // Quelques compteurs simples pour avoir une vue d'ensemble immédiate.
  const [totalUtilisateurs, totalEssais, totalPremium] = await Promise.all([
    prisma.user.count(),
    prisma.quizAttempt.count(),
    prisma.subscription.count({ where: { status: "ACTIVE" } }),
  ]);

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold text-slate-900">
        Vue d&apos;ensemble
      </h1>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-2xl font-bold text-slate-900">
            {totalUtilisateurs}
          </p>
          <p className="text-xs font-medium text-slate-500">
            Utilisateurs inscrits
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-2xl font-bold text-slate-900">{totalEssais}</p>
          <p className="text-xs font-medium text-slate-500">Tests passés</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-2xl font-bold text-slate-900">{totalPremium}</p>
          <p className="text-xs font-medium text-slate-500">
            Abonnés premium actifs
          </p>
        </div>
      </div>

      <p className="mt-8 text-sm text-slate-500">
        Utilisez le menu à gauche pour gérer le contenu du site.
      </p>
    </div>
  );
}
