"use client";

import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  licenseTypeSchema,
  type LicenseTypeInput,
} from "@/lib/validations/validations";
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
import { ImageUpload } from "@/components/admin/image-upload";
import {
  createLicenseType,
  updateLicenseType,
} from "@/lib/actions/license-type";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { RichTextEditor } from "./rich-text-editor";
import { SimpleEditor } from "../tiptap-templates/simple/simple-editor";

interface LicenseTypeFormProps {
  licenseType?: LicenseTypeInput & { id: string };
}

export function LicenseTypeForm({ licenseType }: LicenseTypeFormProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter(); // ✅ ajout
  const isEditing = !!licenseType;

  // ✅ Un seul générique, pas de bidouille de types
  const form = useForm<LicenseTypeInput>({
    resolver: zodResolver(licenseTypeSchema),
    defaultValues: {
      code: licenseType?.code ?? "",
      name: licenseType?.name ?? "",
      description: licenseType?.description ?? "",
      imageUrl: licenseType?.imageUrl ?? "",
      minAge: licenseType?.minAge ?? null,
      isActive: licenseType?.isActive ?? true,
      order: licenseType?.order ?? 0,
    },
  });

  function onSubmit(values: LicenseTypeInput) {
    startTransition(async () => {
      const result = isEditing
        ? await updateLicenseType(licenseType!.id, values)
        : await createLicenseType(values);

      if (result && "error" in result) {
        toast.error(result.error);
        return;
      }

      // ✅ La navigation se fait côté client
      router.push("/admin/permis");
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <div className="grid gap-6 sm:grid-cols-2">
          <Controller
            name="code"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="lt-code">Code</FieldLabel>
                <Input
                  {...field}
                  id="lt-code"
                  placeholder="Ex : A, B, C, D"
                  aria-invalid={fieldState.invalid}
                />
                <FieldDescription>Code court unique du permis</FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* ✅ Champ number optionnel : valueAsNumber + fallback null si vide */}
          <Controller
            name="minAge"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="lt-minAge">Âge minimum</FieldLabel>
                <Input
                  id="lt-minAge"
                  type="number"
                  placeholder="Ex : 18"
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
        </div>

        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="lt-name">Nom</FieldLabel>
              <Input
                {...field}
                id="lt-name"
                placeholder="Ex : Permis A - Moto"
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
              <FieldLabel>Description</FieldLabel>
              {/* <RichTextEditor value={field.value} onChange={field.onChange} /> */}
              <SimpleEditor value={field.value} onChange={field.onChange} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="imageUrl"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Image</FieldLabel>
              <ImageUpload
                value={field.value}
                onUploaded={(url) => field.onChange(url)}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className="grid gap-6 sm:grid-cols-2">
          {/* ✅ Champ number requis : valueAsNumber direct */}
          <Controller
            name="order"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="lt-order">Ordre d'affichage</FieldLabel>
                <Input
                  id="lt-order"
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
            name="isActive"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                <FieldContent>
                  <FieldLabel htmlFor="lt-isActive">Actif</FieldLabel>
                  <FieldDescription>
                    Visible pour les apprenants
                  </FieldDescription>
                </FieldContent>
                <Switch
                  id="lt-isActive"
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
            {isEditing
              ? "Enregistrer les modifications"
              : "Créer le type de permis"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
