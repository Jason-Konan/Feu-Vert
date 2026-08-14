// lib/validations/test.ts
import { z } from "zod";

export const choiceSchema = z.object({
  label: z.string().min(1, "Le libellé est requis"),
  isCorrect: z.boolean().default(false),
});

export const questionSchema = z
  .object({
    label: z.string().min(5, "La question est trop courte"),
    imageUrl: z.string().url().optional().or(z.literal("")),
    type: z.enum(["SINGLE_CHOICE", "MULTIPLE_CHOICE"]),
    explanation: z.string().optional(),
    order: z.coerce.number().int().min(0).default(0),
    choices: z.array(choiceSchema).min(2, "Au moins 2 choix requis"),
  })
  .refine((data) => data.choices.filter((c) => c.isCorrect).length >= 1, {
    message: "Au moins une bonne réponse est requise",
    path: ["choices"],
  })
  .refine(
    (data) =>
      data.type === "MULTIPLE_CHOICE" ||
      data.choices.filter((c) => c.isCorrect).length === 1,
    {
      message:
        "Une question à choix unique doit avoir exactement une bonne réponse",
      path: ["choices"],
    },
  );

export const testSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  durationMinutes: z.coerce.number().int().positive().default(20),
  passScore: z.coerce.number().int().min(0).max(100).default(80),
  published: z.boolean().default(false),
  permitTypeId: z.string().min(1),
});

export type QuestionInput = z.infer<typeof questionSchema>;
export type TestInput = z.infer<typeof testSchema>;
