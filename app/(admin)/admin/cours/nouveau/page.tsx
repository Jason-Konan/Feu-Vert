import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CourseForm } from "@/components/admin/courses-form";

export default async function NewCoursePage() {
  await requireAdmin();

  const licenseTypes = await prisma.licenseType.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
    select: { id: true, name: true, code: true },
  });

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold">Nouveau cours</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Informations</CardTitle>
        </CardHeader>
        <CardContent>
          <CourseForm licenseTypes={licenseTypes} />
        </CardContent>
      </Card>
    </div>
  );
}
