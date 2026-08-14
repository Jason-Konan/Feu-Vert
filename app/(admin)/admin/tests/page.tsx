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
import { Plus, Pencil, ClipboardList } from "lucide-react";

export default async function TestsPage() {
  await requireAdmin();

  const tests = await prisma.test.findMany({
    orderBy: [{ licenseType: { order: "asc" } }, { createdAt: "desc" }],
    include: {
      licenseType: { select: { code: true, name: true } },
      _count: { select: { questions: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Tests</h1>
          <p className="text-sm text-muted-foreground">
            Gère les examens blancs pour chaque type de permis
          </p>
        </div>
        <Button>
          <Link href="/admin/tests/new">
            <Plus className="mr-2 h-4 w-4" />
            Nouveau test
          </Link>
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Titre</TableHead>
            <TableHead>Type de permis</TableHead>
            <TableHead>Questions</TableHead>
            <TableHead>Durée</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tests.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={6}
                className="py-8 text-center text-muted-foreground"
              >
                Aucun test pour l'instant.
              </TableCell>
            </TableRow>
          )}
          {tests.map((test) => (
            <TableRow key={test.id}>
              <TableCell className="font-medium">{test.title}</TableCell>
              <TableCell>
                <Badge variant="outline">{test.licenseType.code}</Badge>{" "}
                <span className="text-muted-foreground">
                  {test.licenseType.name}
                </span>
              </TableCell>
              <TableCell>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <ClipboardList className="h-3.5 w-3.5" />{" "}
                  {test._count.questions}
                </span>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {test.durationMin} min
              </TableCell>
              <TableCell>
                <Badge variant={test.isPublished ? "default" : "secondary"}>
                  {test.isPublished ? "Publié" : "Brouillon"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon">
                  <Link href={`/admin/tests/edit/${test.id}`}>
                    <Pencil className="h-4 w-4" />
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
