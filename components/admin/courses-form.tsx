"use client";

import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { courseSchema, type CourseInput } from "@/lib/validations/validations";
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
import { ImageUpload } from "@/components/admin/image-upload";
import { createCourse, updateCourse } from "@/lib/actions/courses";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { RichTextEditor } from "./rich-text-editor";
import { SimpleEditor } from "../tiptap-templates/simple/simple-editor";

interface CourseFormProps {
  course?: CourseInput & { id: string };
  licenseTypes: { id: string; name: string; code: string }[];
}

export function CourseForm({ course, licenseTypes }: CourseFormProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const isEditing = !!course;

  const form = useForm<CourseInput>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: course?.title ?? "",
      description: course?.description ?? "",
      coverImageUrl: course?.coverImageUrl ?? "",
      licenseTypeId: course?.licenseTypeId ?? "",
      order: course?.order ?? 0,
      isPublished: course?.isPublished ?? false,
    },
  });

  function onSubmit(values: CourseInput) {
    startTransition(async () => {
      const result = isEditing
        ? await updateCourse(course!.id, values)
        : await createCourse(values);

      if (result && "error" in result) {
        toast.error(result.error);
        return;
      }

      router.push("/admin/cours");
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
              <FieldLabel htmlFor="course-licenseTypeId">
                Type de permis
              </FieldLabel>
              <Select
                name={field.name}
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger
                  id="course-licenseTypeId"
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
              <FieldLabel htmlFor="course-title">Titre du cours</FieldLabel>
              <Input
                {...field}
                id="course-title"
                placeholder="Ex : La signalisation routière"
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
              <FieldLabel htmlFor="course-description">Description</FieldLabel>
              {/* <Textarea
                {...field}
                id="course-description"
                rows={3}
                value={field.value ?? ""}
                aria-invalid={fieldState.invalid}
              /> */}
              <SimpleEditor value={field.value} onChange={field.onChange} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="coverImageUrl"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Image de couverture</FieldLabel>
              <ImageUpload
                value={field.value}
                onUploaded={(url) => field.onChange(url)}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className="grid gap-6 sm:grid-cols-2">
          <Controller
            name="order"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="course-order">
                  Ordre d'affichage
                </FieldLabel>
                <Input
                  id="course-order"
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
            render={({ field, fieldState }) => (
              <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                <FieldContent>
                  <FieldLabel htmlFor="course-isPublished">Publié</FieldLabel>
                  <FieldDescription>
                    Visible pour les apprenants
                  </FieldDescription>
                </FieldContent>
                <Switch
                  id="course-isPublished"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  aria-invalid={fieldState.invalid}
                />
              </Field>
            )}
          />
        </div>

        <Field orientation="horizontal">
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? "Enregistrer les modifications" : "Créer le cours"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
