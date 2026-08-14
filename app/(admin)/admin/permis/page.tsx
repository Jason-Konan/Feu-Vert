import Link from "next/link";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Plus, Pencil, BookOpen, ClipboardList } from "lucide-react";
import { DeleteButton } from "@/components/admin/bouton-supprimer";
import { deleteLicenseType } from "@/lib/actions/license-type";

export default async function LicenseTypesPage() {
  await requireAdmin();

  const licenseTypes = await prisma.licenseType.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { courses: true, tests: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Types de permis</h1>
          <p className="text-sm text-muted-foreground">
            Gère les catégories de permis (A, B, C, D...)
          </p>
        </div>
        <Button>
          <Link
            href="/admin/permis/new"
            className="flex items-center justify-center"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nouveau type de permis
          </Link>
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Nom</TableHead>
            <TableHead>Cours</TableHead>
            <TableHead>Tests</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {licenseTypes.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={6}
                className="py-8 text-center text-muted-foreground"
              >
                Aucun type de permis pour l'instant.
              </TableCell>
            </TableRow>
          )}
          {licenseTypes.map((lt) => (
            <TableRow key={lt.id}>
              <TableCell className="font-medium">{lt.code}</TableCell>
              <TableCell>{lt.name}</TableCell>
              <TableCell>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <BookOpen className="h-3.5 w-3.5" /> {lt._count.courses}
                </span>
              </TableCell>
              <TableCell>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <ClipboardList className="h-3.5 w-3.5" /> {lt._count.tests}
                </span>
              </TableCell>
              <TableCell>
                <Badge variant={lt.isActive ? "default" : "secondary"}>
                  {lt.isActive ? "Actif" : "Inactif"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button variant="ghost" size="icon">
                    <Link href={`/admin/permis/edit/${lt.id}`}>
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>
                  <DeleteButton
                    title={`Supprimer "${lt.name}" ?`}
                    description="Impossible si des cours ou tests y sont rattachés."
                    action={deleteLicenseType.bind(null, lt.id)} // ✅
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
