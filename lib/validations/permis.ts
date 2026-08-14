// lib/validations/validations.ts
import { z } from "zod";

export const licenseTypeSchema = z.object({
  code: z.string().min(1, "Le code est requis").max(5),
  name: z.string().min(1, "Le nom est requis"),
  description: z.string().optional().nullable(),
  imageUrl: z.string().url().optional().nullable(),
  // ✅ z.coerce pour accepter la valeur de l'input HTML (string → number)
  minAge: z.coerce.number().int().positive().optional().nullable(),
  // ✅ Pas de .default() ici — géré par useForm defaultValues
  isActive: z.boolean(),
  order: z.coerce.number().int().min(0),
});

export type LicenseTypeInput = z.infer<typeof licenseTypeSchema>;
