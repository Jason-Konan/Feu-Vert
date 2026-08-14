"use client";

import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { testSchema, type TestInput } from "@/lib/validations/validations";
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
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createTest, updateTest } from "@/lib/actions/tests";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface TestFormProps {
  test?: TestInput & { id: string };
  licenseTypes: { id: string; name: string; code: string }[];
}

export function TestForm({ test, licenseTypes }: TestFormProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const isEditing = !!test;

  const form = useForm<TestInput>({
    resolver: zodResolver(testSchema),
    defaultValues: {
      title: test?.title ?? "",
      description: test?.description ?? "",
      durationMin: test?.durationMin ?? 20,
      passingScore: test?.passingScore ?? 80,
      licenseTypeId: test?.licenseTypeId ?? "",
      isPublished: test?.isPublished ?? false,
    },
  });

  function onSubmit(values: TestInput) {
    startTransition(async () => {
      const result = isEditing
        ? await updateTest(test!.id, values)
        : await createTest(values);

      if (result && "error" in result) {
        toast.error(result.error);
        return;
      }

      router.push("/admin/tests");
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="licenseTypeId"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="test-licenseTypeId">
                Type de permis
              </FieldLabel>
              <Select
                name={field.name}
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger
                  id="test-licenseTypeId"
                  aria-invalid={fieldState.invalid}
                >
                  <SelectValue placeholder="Sélectionner un type de permis" />
                </SelectTrigger>
                <SelectContent>
                  {licenseTypes.map((lt) => (
                    <SelectItem key={lt.id} value={lt.id}>
                      {lt.code} — {lt.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="title"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="test-title">Titre du test</FieldLabel>
              <Input
                {...field}
                id="test-title"
                placeholder="Ex : Examen blanc n°1"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="test-description">Description</FieldLabel>
              <Textarea
                {...field}
                id="test-description"
                rows={3}
                value={field.value ?? ""}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className="grid gap-6 sm:grid-cols-2">
          <Controller
            name="durationMin"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="test-durationMin">
                  Durée (minutes)
                </FieldLabel>
                <Input
                  id="test-durationMin"
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
            name="passingScore"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="test-passingScore">
                  Score de réussite (%)
                </FieldLabel>
                <Input
                  id="test-passingScore"
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
        </div>

        <Controller
          name="isPublished"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field orientation="horizontal" data-invalid={fieldState.invalid}>
              <FieldContent>
                <FieldLabel htmlFor="test-isPublished">Publié</FieldLabel>
                <FieldDescription>
                  Nécessite au moins 5 questions pour être publié
                </FieldDescription>
              </FieldContent>
              <Switch
                id="test-isPublished"
                checked={field.value}
                onCheckedChange={field.onChange}
                aria-invalid={fieldState.invalid}
              />
            </Field>
          )}
        />

        <Field orientation="horizontal">
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? "Enregistrer les modifications" : "Créer le test"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
