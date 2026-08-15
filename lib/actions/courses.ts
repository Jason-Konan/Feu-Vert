"use server";

import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import {
  courseSchema,
  lessonSchema,
  type CourseInput,
  type LessonInput,
} from "@/lib/validations/validations";
import { slugify } from "@/lib/slugify";
import { revalidatePath } from "next/cache";
import type { ActionResult } from "@/lib/actions/types";

async function generateUniqueSlug(title: string, excludeId?: string) {
  const base = slugify(title);
  let slug = base;
  let counter = 1;

  while (
    await prisma.course.findFirst({
      where: { slug, ...(excludeId ? { NOT: { id: excludeId } } : {}) },
    })
  ) {
    slug = `${base}-${counter}`;
    counter++;
  }

  return slug;
}

export async function createCourse(input: CourseInput): Promise<ActionResult> {
  try {
    await requireAdmin();
    const data = courseSchema.parse(input);
    const slug = await generateUniqueSlug(data.title);
    const course = await prisma.course.create({
      data: { ...data, slug, coverImageUrl: data.coverImageUrl || null },
    });
    revalidatePath("/admin/cours");
    revalidatePath(`/permis/${data.licenseTypeId}/cours`);
    return { success: true, id: course.id };
  } catch {
    return { error: "Erreur lors de la création du cours" };
  }
}

export async function updateCourse(
  id: string,
  input: CourseInput,
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const data = courseSchema.parse(input);
    const current = await prisma.course.findUnique({ where: { id } });
    const slug =
      current && current.title !== data.title
        ? await generateUniqueSlug(data.title, id)
        : (current?.slug ?? (await generateUniqueSlug(data.title, id)));
    await prisma.course.update({
      where: { id },
      data: { ...data, slug, coverImageUrl: data.coverImageUrl || null },
    });
    revalidatePath("/admin/cours");
    revalidatePath(`/admin/cours/${id}`);
    revalidatePath(`/permis/${data.licenseTypeId}/cours`);
    revalidatePath(`/permis/${data.licenseTypeId}/cours/${slug}`);
    // Si le permis d'origine a changé (déplacement du cours vers une autre
    // catégorie), on invalide aussi l'ancienne liste pour qu'il en disparaisse.
    if (current && current.licenseTypeId !== data.licenseTypeId) {
      revalidatePath(`/permis/${current.licenseTypeId}/cours`);
    }
    return { success: true };
  } catch {
    return { error: "Erreur lors de la mise à jour du cours" };
  }
}

export async function deleteCourse(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    const course = await prisma.course.delete({ where: { id } });
    revalidatePath("/admin/cours");
    revalidatePath(`/permis/${course.licenseTypeId}/cours`);
    revalidatePath(`/permis/${course.licenseTypeId}/cours/${course.slug}`);
    return { success: true };
  } catch {
    return { error: "Erreur lors de la suppression du cours" };
  }
}

export async function togglePublishCourse(
  id: string,
  isPublished: boolean,
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const course = await prisma.course.update({
      where: { id },
      data: { isPublished },
    });
    revalidatePath("/admin/cours");
    revalidatePath(`/permis/${course.licenseTypeId}/cours`);
    revalidatePath(`/permis/${course.licenseTypeId}/cours/${course.slug}`);
    return { success: true };
  } catch {
    return { error: "Erreur lors de la mise à jour du statut de publication" };
  }
}

// ----- Leçons -----
// Une leçon modifie l'affichage de la page de détail du cours auquel elle
// appartient : on récupère le cours (et son licenseTypeId/slug) pour
// revalider la bonne page publique.

async function revalidateCoursePublicPages(courseId: string) {
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) return;
  revalidatePath(`/permis/${course.licenseTypeId}/cours/${course.slug}`);
}

export async function createLesson(input: LessonInput): Promise<ActionResult> {
  try {
    await requireAdmin();
    const data = lessonSchema.parse(input);
    const lesson = await prisma.lesson.create({ data });
    revalidatePath(`/admin/cours/${data.courseId}`);
    await revalidateCoursePublicPages(data.courseId);
    return { success: true, id: lesson.id };
  } catch {
    return { error: "Erreur lors de la création de la leçon" };
  }
}

export async function updateLesson(
  id: string,
  input: LessonInput,
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const data = lessonSchema.parse(input);
    await prisma.lesson.update({ where: { id }, data });
    revalidatePath(`/admin/cours/${data.courseId}`);
    await revalidateCoursePublicPages(data.courseId);
    return { success: true };
  } catch {
    return { error: "Erreur lors de la mise à jour de la leçon" };
  }
}

export async function deleteLesson(
  id: string,
  courseId: string,
): Promise<ActionResult> {
  try {
    await requireAdmin();
    await prisma.lesson.delete({ where: { id } });
    revalidatePath(`/admin/cours/${courseId}`);
    await revalidateCoursePublicPages(courseId);
    return { success: true };
  } catch {
    return { error: "Erreur lors de la suppression de la leçon" };
  }
}

export async function reorderLessons(
  courseId: string,
  orderedIds: string[],
): Promise<ActionResult> {
  try {
    await requireAdmin();
    await prisma.$transaction(
      orderedIds.map((id, index) =>
        prisma.lesson.update({ where: { id }, data: { order: index } }),
      ),
    );
    revalidatePath(`/admin/cours/${courseId}`);
    await revalidateCoursePublicPages(courseId);
    return { success: true };
  } catch {
    return { error: "Erreur lors de la réorganisation des leçons" };
  }
}
