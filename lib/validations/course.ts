// lib/validations/course.ts
import { z } from "zod";

export const courseSchema = z.object({
  title: z.string().min(2, "Titre trop court"),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9-]+$/, "Slug invalide (minuscules, tirets)"),
  description: z.string().optional(),
  order: z.coerce.number().int().min(0).default(0),
  published: z.boolean().default(false),
  permitTypeId: z.string().min(1, "Sélectionne un type de permis"),
});

export const chapterSchema = z.object({
  title: z.string().min(2),
  content: z.string().min(10, "Le contenu ne peut pas être vide"),
  order: z.coerce.number().int().min(0).default(0),
  imageUrl: z.string().url().optional().or(z.literal("")),
  courseId: z.string().min(1),
});

export type CourseInput = z.infer<typeof courseSchema>;
export type ChapterInput = z.infer<typeof chapterSchema>;
