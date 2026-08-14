import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LicenseTypeForm } from "@/components/admin/license-type-form";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditLicenseTypePage({ params }: PageProps) {
  await requireAdmin();
  const { id } = await params;

  const licenseType = await prisma.licenseType.findUnique({ where: { id } });

  if (!licenseType) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold">
        Modifier « {licenseType.name} »
      </h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Informations</CardTitle>
        </CardHeader>
        <CardContent>
          <LicenseTypeForm
            licenseType={{
              id: licenseType.id,
              code: licenseType.code,
              name: licenseType.name,
              description: licenseType.description,
              imageUrl: licenseType.imageUrl,
              minAge: licenseType.minAge,
              isActive: licenseType.isActive,
              order: licenseType.order,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
