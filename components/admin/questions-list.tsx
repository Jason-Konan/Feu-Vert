import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { deleteQuestion } from "@/lib/actions/tests";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { QuestionForm } from "./question-form";
import { DeleteButton } from "./bouton-supprimer";

interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface Question {
  id: string;
  text: string;
  imageUrl: string | null;
  explanation: string | null;
  difficulty: "FACILE" | "MOYEN" | "DIFFICILE";
  order: number;
  testId: string;
  options: Option[];
}

const difficultyLabel: Record<Question["difficulty"], string> = {
  FACILE: "Facile",
  MOYEN: "Moyen",
  DIFFICILE: "Difficile",
};

const difficultyVariant: Record<
  Question["difficulty"],
  "default" | "secondary" | "destructive"
> = {
  FACILE: "secondary",
  MOYEN: "default",
  DIFFICILE: "destructive",
};

export function QuestionList({
  questions,
  testId,
}: {
  questions: Question[];
  testId: string;
}) {
  if (questions.length === 0) {
    return (
      <p className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
        Aucune question pour l'instant. Ajoute au moins 5 questions pour pouvoir
        publier ce test.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {questions.map((question, index) => (
        <Card key={question.id}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Q{index + 1}
                  </span>
                  <Badge variant={difficultyVariant[question.difficulty]}>
                    {difficultyLabel[question.difficulty]}
                  </Badge>
                </div>
                <p className="font-medium">{question.text}</p>

                {question.imageUrl && (
                  <div className="relative mt-2 h-32 w-48 overflow-hidden rounded-md border">
                    <Image
                      src={question.imageUrl}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                <ul className="mt-3 space-y-1">
                  {question.options.map((option) => (
                    <li
                      key={option.id}
                      className={`flex items-center gap-2 text-sm ${
                        option.isCorrect
                          ? "font-medium text-emerald-600"
                          : "text-muted-foreground"
                      }`}
                    >
                      {option.isCorrect && <CheckCircle2 className="h-4 w-4" />}
                      {option.text}
                    </li>
                  ))}
                </ul>

                {question.explanation && (
                  <p className="mt-2 rounded-md bg-muted/50 p-2 text-sm text-muted-foreground">
                    💡 {question.explanation}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-1">
                <QuestionForm testId={testId} question={question} />
                <DeleteButton
                  title="Supprimer cette question ?"
                  action={deleteQuestion.bind(null, question.id, testId)}
                  description="Cette question sera définitivement supprimée."
                  redirectTo="/"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
