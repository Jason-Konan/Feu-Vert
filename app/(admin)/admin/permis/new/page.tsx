import { requireAdmin } from "@/lib/admin-guard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LicenseTypeForm } from "@/components/admin/license-type-form";

export default async function NewLicenseTypePage() {
  await requireAdmin();

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <h1 className="text-2xl font-semibold">Nouveau type de permis</h1>
      <LicenseTypeForm />
    </div>
  );
}
