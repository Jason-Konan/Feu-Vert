"use server";

import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { revalidatePath } from "next/cache";
import {
  LicenseTypeInput,
  licenseTypeSchema,
} from "../validations/validations";

export async function createLicenseType(input: LicenseTypeInput) {
  await requireAdmin();
  const data = licenseTypeSchema.parse(input);

  const existing = await prisma.licenseType.findUnique({
    where: { code: data.code },
  });

  if (existing) {
    return { error: `Le code "${data.code}" est déjà utilisé.` };
  }

  await prisma.licenseType.create({
    data: { ...data, imageUrl: data.imageUrl || null },
  });

  revalidatePath("/admin/permis");
  return { success: true }; // ✅ plus de redirect() ici
}

export async function updateLicenseType(id: string, input: LicenseTypeInput) {
  await requireAdmin();
  const data = licenseTypeSchema.parse(input);

  const existing = await prisma.licenseType.findFirst({
    where: { code: data.code, NOT: { id } },
  });

  if (existing) {
    return { error: `Le code "${data.code}" est déjà utilisé.` };
  }

  await prisma.licenseType.update({
    where: { id },
    data: { ...data, imageUrl: data.imageUrl || null },
  });

  revalidatePath("/admin/permis");
  revalidatePath(`/admin/permis/${id}`);
  return { success: true }; // ✅
}

export async function deleteLicenseType(id: string) {
  await requireAdmin();

  const [coursesCount, testsCount] = await Promise.all([
    prisma.course.count({ where: { licenseTypeId: id } }),
    prisma.test.count({ where: { licenseTypeId: id } }),
  ]);

  if (coursesCount > 0 || testsCount > 0) {
    return {
      error:
        "Impossible de supprimer : ce type de permis a des cours ou des tests associés.",
    };
  }

  await prisma.licenseType.delete({ where: { id } });
  revalidatePath("/admin/permis");
  return { success: true };
}

export async function toggleLicenseTypeStatus(id: string, isActive: boolean) {
  await requireAdmin();
  await prisma.licenseType.update({ where: { id }, data: { isActive } });
  revalidatePath("/admin/permis");
}
