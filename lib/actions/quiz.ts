"use server";

import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

type AnswerResult =
  | {
      isCorrect: boolean;
      correctOptionIds: string[];
      explanation: string | null;
    }
  | { error: string };

/**
 * Valide UNE réponse à la volée. Ne révèle la ou les bonnes options
 * que pour la question à laquelle l'utilisateur vient de répondre —
 * jamais pour les questions suivantes qu'il n'a pas encore vues.
 */
export async function submitAnswer(
  testId: string,
  questionId: string,
  selectedOptionId: string,
): Promise<AnswerResult> {
  const question = await prisma.question.findFirst({
    where: { id: questionId, testId },
    include: { options: true },
  });

  if (!question) {
    return { error: "Question introuvable" };
  }

  const selectedOption = question.options.find(
    (o) => o.id === selectedOptionId,
  );
  if (!selectedOption) {
    return { error: "Option invalide" };
  }

  const correctOptionIds = question.options
    .filter((o) => o.isCorrect)
    .map((o) => o.id);

  return {
    isCorrect: selectedOption.isCorrect,
    correctOptionIds,
    explanation: question.explanation,
  };
}

type FinalizeResult =
  | { score: number; totalQuestions: number; passed: boolean }
  | { error: string };

/**
 * Recalcule le score côté serveur à partir des réponses envoyées
 * (jamais de confiance dans un score calculé côté client) et
 * enregistre l'essai si l'utilisateur est connecté.
 */
export async function finalizeQuizAttempt(
  testId: string,
  permisCode: string,
  answers: Record<string, string>, // questionId -> selectedOptionId
): Promise<FinalizeResult> {
  const test = await prisma.test.findUnique({
    where: { id: testId },
    include: { questions: { include: { options: true } } },
  });

  if (!test) return { error: "Test introuvable" };

  let score = 0;
  for (const question of test.questions) {
    const selectedOptionId = answers[question.id];
    if (!selectedOptionId) continue;
    const selectedOption = question.options.find(
      (o) => o.id === selectedOptionId,
    );
    if (selectedOption?.isCorrect) score += 1;
  }

  const totalQuestions = test.questions.length;
  const passed =
    totalQuestions > 0 && score / totalQuestions >= test.passingScore / 100;

  const session = await auth.api.getSession({ headers: await headers() });
  if (session?.user) {
    await prisma.quizAttempt.create({
      data: {
        userId: session.user.id,
        permisSlug: permisCode.toLowerCase(),
        permisCode,
        score,
        totalQuestions,
        passed,
      },
    });
  }

  return { score, totalQuestions, passed };
}
