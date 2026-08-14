import { z } from "zod";

export const licenseTypeSchema = z.object({
  code: z.string().min(1, "Le code est requis").max(5).toUpperCase(),
  name: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
  description: z.string().optional().nullable(),
  imageUrl: z.string().url().optional().nullable().or(z.literal("")),
  minAge: z.number().int().min(0).max(100).optional().nullable(), // ✅ z.number()
  isActive: z.boolean(),
  order: z.number().int(), // ✅ z.number()
});

// Un seul type, plus de LicenseTypeFormValues
export type LicenseTypeInput = z.infer<typeof licenseTypeSchema>;

// Idem pour les autres schémas
export const courseSchema = z.object({
  title: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
  description: z.string().optional().nullable(),
  coverImageUrl: z.string().url().optional().nullable().or(z.literal("")),
  licenseTypeId: z.string().min(1, "Le type de permis est requis"),
  order: z.number().int(),
  isPublished: z.boolean(),
});
export type CourseInput = z.infer<typeof courseSchema>;

export const lessonSchema = z.object({
  title: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
  content: z.string().min(1, "Le contenu ne peut pas être vide"),
  duration: z.number().int().min(0).optional().nullable(),
  order: z.number().int(),
  isPublished: z.boolean(),
  courseId: z.string().min(1),
});
export type LessonInput = z.infer<typeof lessonSchema>;

export const testSchema = z.object({
  title: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
  description: z.string().optional().nullable(),
  durationMin: z.number().int().min(1),
  passingScore: z.number().int().min(1).max(100),
  licenseTypeId: z.string().min(1, "Le type de permis est requis"),
  isPublished: z.boolean(),
});
export type TestInput = z.infer<typeof testSchema>;

export const questionOptionSchema = z.object({
  id: z.string().optional(),
  text: z.string().min(1, "Le texte de l'option est requis"),
  isCorrect: z.boolean(),
});

export const questionSchema = z
  .object({
    text: z.string().min(3, "L'énoncé doit contenir au moins 3 caractères"),
    imageUrl: z.string().url().optional().nullable().or(z.literal("")),
    explanation: z.string().optional().nullable(),
    difficulty: z.enum(["FACILE", "MOYEN", "DIFFICILE"]),
    order: z.number().int(),
    testId: z.string().min(1),
    options: z.array(questionOptionSchema).min(2).max(6),
  })
  .refine((data) => data.options.some((o) => o.isCorrect), {
    message: "Au moins une option doit être marquée comme correcte",
    path: ["options"],
  });
export type QuestionInput = z.infer<typeof questionSchema>;
