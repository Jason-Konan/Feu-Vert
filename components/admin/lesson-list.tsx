import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { deleteLesson } from "@/lib/actions/courses";
import { GripVertical, Clock } from "lucide-react";
import { LessonForm } from "./lesson-form";
import { DeleteButton } from "./bouton-supprimer";

interface Lesson {
  id: string;
  title: string;
  content: string;
  duration: number | null;
  order: number;
  isPublished: boolean;
  courseId: string;
}

export function LessonList({
  lessons,
  courseId,
}: {
  lessons: Lesson[];
  courseId: string;
}) {
  if (lessons.length === 0) {
    return (
      <p className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
        Aucune leçon pour l'instant. Ajoute la première leçon de ce cours.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {lessons.map((lesson) => (
        <Card key={lesson.id}>
          <CardContent className="flex items-center justify-between gap-4 p-4">
            <div className="flex items-center gap-3">
              <GripVertical className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium">{lesson.title}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {lesson.duration && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {lesson.duration} min
                    </span>
                  )}
                  <Badge variant={lesson.isPublished ? "default" : "secondary"}>
                    {lesson.isPublished ? "Publiée" : "Brouillon"}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <LessonForm courseId={courseId} lesson={lesson} />
              <DeleteButton
                title="Supprimer cette leçon ?"
                description={`"${lesson.title}" sera définitivement supprimée.`}
                action={deleteLesson.bind(null, lesson.id, courseId)}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
