"use server";

import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import {
  testSchema,
  questionSchema,
  type TestInput,
  type QuestionInput,
} from "@/lib/validations/validations";
import { revalidatePath } from "next/cache";
import type { ActionResult } from "./types";
// ----- Tests -----

export async function createTest(input: TestInput): Promise<ActionResult> {
  await requireAdmin();
  const data = testSchema.parse(input);
  const test = await prisma.test.create({ data });
  revalidatePath("/admin/tests");
  return { success: true, id: test.id };
}

export async function updateTest(
  id: string,
  input: TestInput,
): Promise<ActionResult> {
  await requireAdmin();
  const data = testSchema.parse(input);
  await prisma.test.update({ where: { id }, data });
  revalidatePath("/admin/tests");
  revalidatePath(`/admin/tests/${id}`);
  return { success: true };
}

export async function deleteTest(id: string): Promise<ActionResult> {
  await requireAdmin();
  await prisma.test.delete({ where: { id } });
  revalidatePath("/admin/tests");
  return { success: true };
}

export async function togglePublishTest(
  id: string,
  isPublished: boolean,
): Promise<ActionResult> {
  await requireAdmin();

  if (isPublished) {
    const count = await prisma.question.count({ where: { testId: id } });
    if (count < 5) {
      return {
        error: "Il faut au moins 5 questions avant de publier un test.",
      };
    }
  }

  await prisma.test.update({ where: { id }, data: { isPublished } });
  revalidatePath("/admin/tests");
  revalidatePath(`/admin/tests/${id}`);
  return { success: true };
}

// ----- Questions -----

export async function createQuestion(
  input: QuestionInput,
): Promise<ActionResult> {
  await requireAdmin();
  const data = questionSchema.parse(input);

  const question = await prisma.question.create({
    data: {
      text: data.text,
      imageUrl: data.imageUrl || null,
      explanation: data.explanation || null,
      difficulty: data.difficulty,
      order: data.order,
      testId: data.testId,
      options: {
        create: data.options.map((o, index) => ({
          text: o.text,
          isCorrect: o.isCorrect,
          order: index,
        })),
      },
    },
  });

  revalidatePath(`/admin/tests/${data.testId}`);
  return { success: true, id: question.id };
}

export async function updateQuestion(
  id: string,
  input: QuestionInput,
): Promise<ActionResult> {
  await requireAdmin();
  const data = questionSchema.parse(input);

  await prisma.$transaction([
    prisma.questionOption.deleteMany({ where: { questionId: id } }),
    prisma.question.update({
      where: { id },
      data: {
        text: data.text,
        imageUrl: data.imageUrl || null,
        explanation: data.explanation || null,
        difficulty: data.difficulty,
        order: data.order,
        options: {
          create: data.options.map((o, index) => ({
            text: o.text,
            isCorrect: o.isCorrect,
            order: index,
          })),
        },
      },
    }),
  ]);

  revalidatePath(`/admin/tests/${data.testId}`);
  return { success: true };
}

export async function deleteQuestion(
  id: string,
  testId: string,
): Promise<ActionResult> {
  await requireAdmin();
  await prisma.question.delete({ where: { id } });
  revalidatePath(`/admin/tests/${testId}`);
  return { success: true };
}
