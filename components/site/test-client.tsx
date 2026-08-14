"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowRight,
  Trophy,
  TrendingUp,
  LogIn,
  LayoutDashboard,
  Loader2,
} from "lucide-react";
import { submitAnswer, finalizeQuizAttempt } from "@/lib/actions/quiz";

type QuizOption = { id: string; text: string };
type QuizQuestion = {
  id: string;
  text: string;
  imageUrl: string | null;
  options: QuizOption[];
};

type ProgressionUtilisateur = {
  totalEssais: number;
  dernierPourcentage: number;
  meilleurPourcentage: number;
} | null;

type TestClientProps = {
  testId: string;
  permisCode: string;
  passingScore: number; // en pourcentage, ex: 80
  questions: QuizQuestion[];
  estConnecte: boolean;
  progressionInitiale: ProgressionUtilisateur;
};

type ReponseState = {
  selectedOptionId: string;
  isCorrect: boolean;
  correctOptionIds: string[];
  explanation: string | null;
};

export function TestClient({
  testId,
  permisCode,
  passingScore,
  questions,
  estConnecte,
  progressionInitiale,
}: TestClientProps) {
  const [indexCourant, setIndexCourant] = useState(0);
  const [reponses, setReponses] = useState<Record<string, ReponseState>>({});
  const [estTermine, setEstTermine] = useState(false);
  const [resultatFinal, setResultatFinal] = useState<{
    score: number;
    totalQuestions: number;
    passed: boolean;
  } | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Copie figée : sert de point de comparaison "avant ce test".
  const [progressionAvant] = useState(progressionInitiale);

  const question = questions[indexCourant];
  const reponseCourante = question ? reponses[question.id] : undefined;
  const aRepondu = !!reponseCourante;
  const derniereQuestion = indexCourant === questions.length - 1;

  function selectionnerChoix(optionId: string) {
    if (aRepondu || !question || isPending) return;
    setErreur(null);

    startTransition(async () => {
      const result = await submitAnswer(testId, question.id, optionId);

      if ("error" in result) {
        setErreur(result.error);
        return;
      }

      setReponses((prev) => ({
        ...prev,
        [question.id]: {
          selectedOptionId: optionId,
          isCorrect: result.isCorrect,
          correctOptionIds: result.correctOptionIds,
          explanation: result.explanation,
        },
      }));
    });
  }

  function questionSuivante() {
    if (derniereQuestion) {
      terminerTest();
      return;
    }
    setIndexCourant((i) => i + 1);
  }

  function terminerTest() {
    setErreur(null);
    startTransition(async () => {
      const answers = Object.fromEntries(
        Object.entries(reponses).map(([qid, r]) => [qid, r.selectedOptionId]),
      );

      const result = await finalizeQuizAttempt(testId, permisCode, answers);

      if ("error" in result) {
        setErreur(result.error);
        return;
      }

      setResultatFinal(result);
      setEstTermine(true);
    });
  }

  function recommencer() {
    setIndexCourant(0);
    setReponses({});
    setEstTermine(false);
    setResultatFinal(null);
    setErreur(null);
  }

  if (questions.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
        <p className="text-sm font-medium text-slate-600">
          Ce test ne contient aucune question pour le moment.
        </p>
      </div>
    );
  }

  if (estTermine && resultatFinal) {
    const pourcentage = Math.round(
      (resultatFinal.score / resultatFinal.totalQuestions) * 100,
    );

    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center sm:p-10">
        <span
          className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl text-white ${
            resultatFinal.passed ? "bg-[#235C43]" : "bg-[#A6402B]"
          }`}
        >
          <Trophy className="h-8 w-8" />
        </span>

        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Résultat du test · Permis {permisCode}
        </p>
        <h2 className="mt-2 font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight text-slate-900">
          {resultatFinal.score} / {resultatFinal.totalQuestions}
        </h2>
        <p
          className={`mt-1 text-lg font-semibold ${
            resultatFinal.passed ? "text-[#235C43]" : "text-[#A6402B]"
          }`}
        >
          {pourcentage}% de bonnes réponses
        </p>

        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-slate-600">
          {resultatFinal.passed
            ? "Belle performance : vous êtes sur la bonne voie pour l'examen officiel."
            : "Encore un peu d'entraînement et ce sera acquis. Revoyez les thèmes qui vous ont posé problème."}
        </p>

        <SectionProgression
          estConnecte={estConnecte}
          progressionAvant={progressionAvant}
          pourcentageActuel={pourcentage}
        />

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            onClick={recommencer}
            className="group inline-flex items-center gap-2 rounded-full bg-[#1B1D1F] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#235C43]"
          >
            <RotateCcw className="h-4 w-4 transition-transform group-hover:-rotate-45" />
            Refaire un test
          </button>
        </div>
      </div>
    );
  }

  if (!question) return null;

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-[#235C43] transition-all duration-300"
            style={{
              width: `${(indexCourant / questions.length) * 100}%`,
            }}
          />
        </div>
        <span className="shrink-0 text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">
          Question {indexCourant + 1} / {questions.length}
        </span>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold leading-snug tracking-tight text-slate-900 sm:text-3xl">
          {question.text}
        </h2>

        {question.imageUrl && (
          <img
            src={question.imageUrl}
            alt=""
            className="mt-4 max-h-64 rounded-xl border border-slate-200 object-contain"
          />
        )}

        {erreur && (
          <p className="mt-4 rounded-lg bg-[#A6402B]/10 px-3 py-2 text-sm font-medium text-[#A6402B]">
            {erreur}
          </p>
        )}

        <div className="mt-6 flex flex-col gap-3">
          {question.options.map((option) => {
            const estSelectionne =
              reponseCourante?.selectedOptionId === option.id;
            const estCorrect =
              reponseCourante?.correctOptionIds.includes(option.id) ?? false;

            let styleClasse =
              "border-slate-200 bg-white hover:border-[#235C43]/30 hover:bg-[#235C43]/[0.03]";

            if (aRepondu) {
              if (estCorrect) {
                styleClasse = "border-[#235C43] bg-[#235C43]/[0.06]";
              } else if (estSelectionne && !estCorrect) {
                styleClasse = "border-[#A6402B] bg-[#A6402B]/[0.06]";
              } else {
                styleClasse = "border-slate-200 bg-white opacity-60";
              }
            }

            return (
              <button
                key={option.id}
                onClick={() => selectionnerChoix(option.id)}
                disabled={aRepondu || isPending}
                className={`flex items-center justify-between gap-3 rounded-xl border p-4 text-left text-sm font-medium text-slate-800 transition-colors disabled:cursor-default ${styleClasse}`}
              >
                <span>{option.text}</span>

                {aRepondu && estCorrect && (
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-[#235C43]" />
                )}
                {aRepondu && estSelectionne && !estCorrect && (
                  <XCircle className="h-5 w-5 shrink-0 text-[#A6402B]" />
                )}
              </button>
            );
          })}
        </div>

        {isPending && !aRepondu && (
          <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Vérification…
          </div>
        )}

        {aRepondu && reponseCourante.explanation && (
          <div className="mt-6 rounded-xl bg-[#EEECE4] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">
              Explication
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-700">
              {reponseCourante.explanation}
            </p>
          </div>
        )}

        {aRepondu && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={questionSuivante}
              disabled={isPending}
              className="group inline-flex items-center gap-2 rounded-full bg-[#1B1D1F] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#235C43] disabled:opacity-60"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  {derniereQuestion ? "Voir mon résultat" : "Question suivante"}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
type SectionProgressionProps = {
  estConnecte: boolean;
  progressionAvant: ProgressionUtilisateur;
  pourcentageActuel: number;
};

function SectionProgression({
  estConnecte,
  progressionAvant,
  pourcentageActuel,
}: SectionProgressionProps) {
  if (!estConnecte) {
    return (
      <div className="mx-auto mt-6 flex max-w-md flex-col items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5">
        <p className="text-sm font-medium text-slate-600">
          Connectez-vous pour enregistrer ce score et suivre votre progression
          au fil de vos essais.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 rounded-full bg-[#235C43] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1B1D1F]"
        >
          <LogIn className="h-4 w-4" />
          Se connecter
        </Link>
      </div>
    );
  }

  if (!progressionAvant) {
    return (
      <div className="mx-auto mt-6 max-w-md rounded-xl bg-[#EEECE4] p-5">
        <p className="text-sm font-medium text-slate-700">
          Premier essai enregistré sur ce permis 🎉 Retrouvez-le dans votre
          tableau de bord.
        </p>
        <Link
          href="/dashboard"
          className="mt-3 inline-flex items-center gap-2 rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-[#235C43]/30 hover:text-[#235C43]"
        >
          <LayoutDashboard className="h-4 w-4" />
          Voir mon tableau de bord
        </Link>
      </div>
    );
  }

  const ecart = pourcentageActuel - progressionAvant.dernierPourcentage;
  const enProgression = ecart > 0;

  return (
    <div className="mx-auto mt-6 max-w-md rounded-xl border border-slate-200 bg-slate-50 p-5 text-left">
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-500">Essai précédent</span>
        <span className="font-semibold text-slate-800">
          {progressionAvant.dernierPourcentage}%
        </span>
      </div>
      <div className="mt-1.5 flex items-center justify-between text-sm">
        <span className="text-slate-500">Meilleur score</span>
        <span className="font-semibold text-slate-800">
          {progressionAvant.meilleurPourcentage}%
        </span>
      </div>

      {ecart !== 0 && (
        <div
          className={`mt-3 flex items-center gap-1.5 text-sm font-semibold ${
            enProgression ? "text-[#235C43]" : "text-[#A6402B]"
          }`}
        >
          <TrendingUp
            className={`h-4 w-4 ${enProgression ? "" : "rotate-180"}`}
          />
          {enProgression ? "+" : ""}
          {ecart} points par rapport à votre dernier essai
        </div>
      )}

      <Link
        href="/dashboard"
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#1B1D1F] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#235C43]"
      >
        <LayoutDashboard className="h-4 w-4" />
        Voir mon tableau de bord complet
      </Link>
    </div>
  );
}
