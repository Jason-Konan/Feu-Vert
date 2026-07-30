// components/site/test-client.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
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
} from "lucide-react";
import { Choice, Question, QUESTIONS } from "@/lib/data/quiz";

const NOMBRE_DE_QUESTIONS = 10;
const SEUIL_DE_REUSSITE = 0.8;

/** Progression connue de l'utilisateur sur ce permis AVANT le test en cours. */
type ProgressionUtilisateur = {
  totalEssais: number;
  dernierPourcentage: number;
  meilleurPourcentage: number;
} | null;

type TestClientProps = {
  permisSlug: string;
  permisCode: string;
  estConnecte: boolean;
  progressionInitiale: ProgressionUtilisateur;
};

function melanger<T>(tableau: T[]): T[] {
  const copie = [...tableau];
  for (let i = copie.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copie[i], copie[j]] = [copie[j], copie[i]];
  }
  return copie;
}

export function TestClient({
  permisSlug,
  permisCode,
  estConnecte,
  progressionInitiale,
}: TestClientProps) {
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [indexCourant, setIndexCourant] = useState(0);
  const [choixSelectionne, setChoixSelectionne] = useState<Choice["id"] | null>(
    null,
  );
  const [reponses, setReponses] = useState<Record<string, Choice["id"]>>({});
  const [estTermine, setEstTermine] = useState(false);

  // On garde une copie LOCALE de la progression : elle sert de point de
  // comparaison ("avant ce test") et ne doit pas bouger même après l'envoi
  // du nouvel essai à l'API — sinon on comparerait le score à lui-même.
  const [progressionAvant] = useState(progressionInitiale);

  useEffect(() => {
    setQuestions(melanger(QUESTIONS).slice(0, NOMBRE_DE_QUESTIONS));
  }, []);

  const question = questions?.[indexCourant];
  const aRepondu = choixSelectionne !== null;
  const derniereQuestion = questions
    ? indexCourant === questions.length - 1
    : false;

  const score = useMemo(() => {
    if (!questions) return 0;
    return questions.reduce((total, q) => {
      return reponses[q.id] === q.correctChoiceId ? total + 1 : total;
    }, 0);
  }, [questions, reponses]);

  // Enregistrement de l'essai en base — uniquement utile si connecté, mais
  // l'API elle-même vérifie déjà la session (401 sinon), donc pas besoin
  // de dupliquer la condition ici.
  useEffect(() => {
    if (!estTermine || !questions || !estConnecte) return;

    const aReussi = score / questions.length >= SEUIL_DE_REUSSITE;

    fetch("/api/quiz-attempts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        permisSlug,
        permisCode,
        score,
        totalQuestions: questions.length,
        passed: aReussi,
      }),
    }).catch((err) => {
      console.error("Échec de l'enregistrement de l'essai :", err);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estTermine]);

  function selectionnerChoix(choiceId: Choice["id"]) {
    if (aRepondu || !question) return;
    setChoixSelectionne(choiceId);
    setReponses((prev) => ({ ...prev, [question.id]: choiceId }));
  }

  function questionSuivante() {
    if (derniereQuestion) {
      setEstTermine(true);
      return;
    }
    setIndexCourant((i) => i + 1);
    setChoixSelectionne(null);
  }

  function recommencer() {
    setQuestions(melanger(QUESTIONS).slice(0, NOMBRE_DE_QUESTIONS));
    setIndexCourant(0);
    setChoixSelectionne(null);
    setReponses({});
    setEstTermine(false);
  }

  if (!questions) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white p-12 text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#235C43] border-t-transparent" />
        <p className="text-sm font-medium text-slate-500">
          Préparation du test…
        </p>
      </div>
    );
  }

  if (estTermine) {
    const pourcentage = Math.round((score / questions.length) * 100);
    const aReussi = score / questions.length >= SEUIL_DE_REUSSITE;

    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center sm:p-10">
        <span
          className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl text-white ${
            aReussi ? "bg-[#235C43]" : "bg-[#A6402B]"
          }`}
        >
          <Trophy className="h-8 w-8" />
        </span>

        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Résultat du test · Permis {permisCode}
        </p>
        <h2 className="mt-2 font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight text-slate-900">
          {score} / {questions.length}
        </h2>
        <p
          className={`mt-1 text-lg font-semibold ${
            aReussi ? "text-[#235C43]" : "text-[#A6402B]"
          }`}
        >
          {pourcentage}% de bonnes réponses
        </p>

        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-slate-600">
          {aReussi
            ? "Belle performance : vous êtes sur la bonne voie pour l'examen officiel."
            : "Encore un peu d'entraînement et ce sera acquis. Revoyez les thèmes qui vous ont posé problème."}
        </p>

        {/* ------------------- SECTION PROGRESSION ------------------- */}
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
          <Link
            href={`/permis/${permisSlug}/cours`}
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-[#235C43]/30 hover:text-[#235C43]"
          >
            Revoir les cours
          </Link>
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
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#235C43]">
          {question.theme}
        </p>
        <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-bold leading-snug tracking-tight text-slate-900 sm:text-3xl">
          {question.question}
        </h2>

        <div className="mt-6 flex flex-col gap-3">
          {question.choices.map((choix) => {
            const estSelectionne = choixSelectionne === choix.id;
            const estCorrect = choix.id === question.correctChoiceId;

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
                key={choix.id}
                onClick={() => selectionnerChoix(choix.id)}
                disabled={aRepondu}
                className={`flex items-center justify-between gap-3 rounded-xl border p-4 text-left text-sm font-medium text-slate-800 transition-colors disabled:cursor-default ${styleClasse}`}
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-slate-300 text-xs font-semibold uppercase text-slate-500">
                    {choix.id}
                  </span>
                  {choix.label}
                </span>

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

        {aRepondu && (
          <div className="mt-6 rounded-xl bg-[#EEECE4] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">
              Explication
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-700">
              {question.explication}
            </p>
          </div>
        )}

        {aRepondu && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={questionSuivante}
              className="group inline-flex items-center gap-2 rounded-full bg-[#1B1D1F] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#235C43]"
            >
              {derniereQuestion ? "Voir mon résultat" : "Question suivante"}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sous-composant : affiche soit la progression (connecté), soit une   */
/*  invitation à se connecter. Extrait à part pour respecter le DRY et  */
/*  garder le rendu du résultat lisible.                                */
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
  // Utilisateur non connecté : on l'invite à créer un compte pour suivre
  // sa progression, sans bloquer l'accès au résultat du test lui-même.
  if (!estConnecte) {
    return (
      <div className="mx-auto mt-6 flex max-w-md flex-col items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5">
        <p className="text-sm font-medium text-slate-600">
          Connectez-vous pour enregistrer ce score et suivre votre progression
          au fil de vos essais.
        </p>
        <Link
          href="/sign-in"
          className="inline-flex items-center gap-2 rounded-full bg-[#235C43] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1B1D1F]"
        >
          <LogIn className="h-4 w-4" />
          Se connecter
        </Link>
      </div>
    );
  }

  // Connecté, mais c'est son tout premier essai sur ce permis : rien à
  // comparer, on l'invite simplement vers son tableau de bord.
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
