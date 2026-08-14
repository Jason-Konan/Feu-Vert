"use client";

import { useState, useTransition } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  questionSchema,
  type QuestionInput,
} from "@/lib/validations/validations";
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
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUpload } from "@/components/admin/image-upload";
import { createQuestion, updateQuestion } from "@/lib/actions/tests";
import { toast } from "sonner";
import { Loader2, Plus, Pencil, X } from "lucide-react";

interface QuestionFormProps {
  testId: string;
  question?: QuestionInput & { id: string };
  nextOrder?: number;
}

export function QuestionForm({
  testId,
  question,
  nextOrder = 0,
}: QuestionFormProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const isEditing = !!question;

  const form = useForm<QuestionInput>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      text: question?.text ?? "",
      imageUrl: question?.imageUrl ?? "",
      explanation: question?.explanation ?? "",
      difficulty: question?.difficulty ?? "MOYEN",
      order: question?.order ?? nextOrder,
      testId,
      options: question?.options ?? [
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "options",
  });

  function onSubmit(values: QuestionInput) {
    startTransition(async () => {
      const result = isEditing
        ? await updateQuestion(question!.id, values)
        : await createQuestion(values);

      if (result && "error" in result) {
        toast.error(result.error);
        return;
      }

      toast.success(isEditing ? "Question mise à jour" : "Question créée");
      setOpen(false);
      if (!isEditing) {
        form.reset({
          text: "",
          imageUrl: "",
          explanation: "",
          difficulty: "MOYEN",
          order: nextOrder + 1,
          testId,
          options: [
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
          ],
        });
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        {isEditing ? (
          <Pencil className="h-4 w-4" />
        ) : (
          <div className="">
            <Plus className="mr-2 h-4 w-4" />
            Ajouter une question
          </div>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Modifier la question" : "Nouvelle question"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="text"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="question-text">
                    Énoncé de la question
                  </FieldLabel>
                  <Textarea
                    {...field}
                    id="question-text"
                    rows={2}
                    placeholder="Ex : Que signifie ce panneau ?"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="imageUrl"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="question-imageUrl">
                    Image (panneau, situation...)
                  </FieldLabel>
                  <ImageUpload
                    value={field.value ?? ""}
                    onUploaded={(url) => field.onChange(url)}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Field>
              <FieldLabel>Options de réponse</FieldLabel>
              <div className="mt-2 space-y-2">
                {fields.map((option, index) => (
                  <div key={option.id} className="flex items-center gap-2">
                    <Controller
                      name={`options.${index}.isCorrect`}
                      control={form.control}
                      render={({ field }) => (
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      )}
                    />
                    <Controller
                      name={`options.${index}.text`}
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <div className="flex-1">
                          <Input
                            {...field}
                            placeholder={`Option ${index + 1}`}
                            aria-invalid={fieldState.invalid}
                          />
                        </div>
                      )}
                    />
                    {fields.length > 2 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              {form.formState.errors.options?.root && (
                <p className="mt-1 text-sm text-destructive">
                  {form.formState.errors.options.root.message}
                </p>
              )}
              {fields.length < 6 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => append({ text: "", isCorrect: false })}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter une option
                </Button>
              )}
              <FieldDescription>
                Coche la ou les bonnes réponses.
              </FieldDescription>
            </Field>

            <Controller
              name="explanation"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="question-explanation">
                    Explication (affichée après la réponse)
                  </FieldLabel>
                  <Textarea
                    {...field}
                    id="question-explanation"
                    rows={3}
                    value={field.value ?? ""}
                    placeholder="Explique pourquoi c'est la bonne réponse..."
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="difficulty"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="question-difficulty">
                    Difficulté
                  </FieldLabel>
                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      id="question-difficulty"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FACILE">Facile</SelectItem>
                      <SelectItem value="MOYEN">Moyen</SelectItem>
                      <SelectItem value="DIFFICILE">Difficile</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <DialogFooter>
              <Field orientation="horizontal">
                <Button type="submit" disabled={isPending}>
                  {isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isEditing ? "Enregistrer" : "Créer la question"}
                </Button>
              </Field>
            </DialogFooter>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
