// app/api/quiz-attempts/stats/route.ts

import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

/**
 * GET : renvoie les statistiques globales de l'utilisateur connecté
 * (nombre d'essais, meilleur score, dernier score, historique récent).
 */
export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const userId = session.user.id;

  // On récupère tout l'historique trié du plus récent au plus ancien
  const attempts = await prisma.quizAttempt.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  const totalEssais = attempts.length;
  const essaisReussis = attempts.filter((a) => a.passed).length;
  const meilleurScore = attempts.reduce(
    (max, a) =>
      Math.max(max, a.totalQuestions ? a.score / a.totalQuestions : 0),
    0,
  );

  return NextResponse.json({
    totalEssais,
    essaisReussis,
    meilleurScorePourcentage: Math.round(meilleurScore * 100),
    dernierEssais: attempts.slice(0, 5), // les 5 derniers, pour l'affichage
  });
}
