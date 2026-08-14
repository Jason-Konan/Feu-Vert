"use client";

import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { lessonSchema, type LessonInput } from "@/lib/validations/validations";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { createLesson, updateLesson } from "@/lib/actions/courses";
import { toast } from "sonner";
import { Loader2, Plus, Pencil } from "lucide-react";
import { SimpleEditor } from "../tiptap-templates/simple/simple-editor";

interface LessonFormProps {
  courseId: string;
  lesson?: LessonInput & { id: string };
  nextOrder?: number;
}

export function LessonForm({
  courseId,
  lesson,
  nextOrder = 0,
}: LessonFormProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const isEditing = !!lesson;

  const form = useForm<LessonInput>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: lesson?.title ?? "",
      content: lesson?.content ?? "",
      duration: lesson?.duration ?? undefined,
      order: lesson?.order ?? nextOrder,
      isPublished: lesson?.isPublished ?? true,
      courseId,
    },
  });

  function onSubmit(values: LessonInput) {
    startTransition(async () => {
      const result = isEditing
        ? await updateLesson(lesson!.id, values)
        : await createLesson(values);

      if (result && "error" in result) {
        toast.error(result.error); // ✅ result.error est string
        return;
      }

      toast.success(isEditing ? "Leçon mise à jour" : "Leçon créée");
      setOpen(false);
      if (!isEditing)
        form.reset({ ...form.getValues(), title: "", content: "" });
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* ✅ asChild + Button pour l'accessibilité et le style cohérent */}
      <DialogTrigger>
        {isEditing ? (
          <Pencil className="h-4 w-4" />
        ) : (
          <div className="">
            {" "}
            <Plus className="mr-2 h-4 w-4" />
            Ajouter une leçon
          </div>
        )}
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Modifier la leçon" : "Nouvelle leçon"}
          </DialogTitle>
        </DialogHeader>

        <form id="lesson-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="lesson-title">Titre</FieldLabel>
                  <Input
                    {...field}
                    id="lesson-title"
                    placeholder="Ex : Les panneaux de danger"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="content"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Contenu</FieldLabel>
                  <SimpleEditor value={field.value} onChange={field.onChange} />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <div className="grid grid-cols-3 gap-4">
              {/* ✅ Champ number optionnel : valueAsNumber + null si vide (comme minAge dans license-type-form) */}
              <Controller
                name="duration"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="lesson-duration">
                      Durée (min)
                    </FieldLabel>
                    <Input
                      id="lesson-duration"
                      type="number"
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === "" ? null : e.target.valueAsNumber,
                        )
                      }
                      onBlur={field.onBlur}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* ✅ Champ number requis : valueAsNumber direct (comme order dans license-type-form) */}
              <Controller
                name="order"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="lesson-order">Ordre</FieldLabel>
                    <Input
                      id="lesson-order"
                      type="number"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      onBlur={field.onBlur}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="isPublished"
                control={form.control}
                render={({ field }) => (
                  <Field className="justify-center">
                    <FieldContent>
                      <FieldLabel htmlFor="lesson-isPublished">
                        Publiée
                      </FieldLabel>
                    </FieldContent>
                    <Switch
                      id="lesson-isPublished"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </Field>
                )}
              />
            </div>
          </FieldGroup>
        </form>

        <DialogFooter>
          <Button type="submit" form="lesson-form" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? "Enregistrer" : "Créer la leçon"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
