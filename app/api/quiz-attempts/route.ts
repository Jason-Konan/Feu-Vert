// app/api/quiz-attempts/route.ts

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth"; // votre instance better-auth côté serveur
import prisma from "@/lib/prisma";

/**
 * POST : enregistre un nouvel essai de test pour l'utilisateur connecté.
 * Appelée depuis TestClient une fois le quiz terminé.
 */
export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const body = await req.json();
  const { permisSlug, permisCode, score, totalQuestions, passed } = body;

  // Validation minimale des données reçues
  if (
    typeof permisSlug !== "string" ||
    typeof permisCode !== "string" ||
    typeof score !== "number" ||
    typeof totalQuestions !== "number" ||
    typeof passed !== "boolean"
  ) {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }

  const attempt = await prisma.quizAttempt.create({
    data: {
      userId: session.user.id,
      permisSlug,
      permisCode,
      score,
      totalQuestions,
      passed,
    },
  });

  return NextResponse.json(attempt, { status: 201 });
}
