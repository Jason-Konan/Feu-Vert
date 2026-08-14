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
import { Plus, Pencil, BookMarked } from "lucide-react";

export default async function CoursesPage() {
  await requireAdmin();

  const courses = await prisma.course.findMany({
    orderBy: [{ licenseType: { order: "asc" } }, { order: "asc" }],
    include: {
      licenseType: { select: { code: true, name: true } },
      _count: { select: { lessons: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Cours</h1>
          <p className="text-sm text-muted-foreground">
            Gère les cours disponibles pour chaque type de permis
          </p>
        </div>
        <Button>
          <Link href="/admin/cours/nouveau">
            <Plus className="mr-2 h-4 w-4" />
            Nouveau cours
          </Link>
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Titre</TableHead>
            <TableHead>Type de permis</TableHead>
            <TableHead>Leçons</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={5}
                className="py-8 text-center text-muted-foreground"
              >
                Aucun cours pour l'instant.
              </TableCell>
            </TableRow>
          )}
          {courses.map((course) => (
            <TableRow key={course.id}>
              <TableCell className="font-medium">{course.title}</TableCell>
              <TableCell>
                <Badge variant="outline">{course.licenseType.code}</Badge>{" "}
                <span className="text-muted-foreground">
                  {course.licenseType.name}
                </span>
              </TableCell>
              <TableCell>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <BookMarked className="h-3.5 w-3.5" /> {course._count.lessons}
                </span>
              </TableCell>
              <TableCell>
                <Badge variant={course.isPublished ? "default" : "secondary"}>
                  {course.isPublished ? "Publié" : "Brouillon"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon">
                  <Link href={`/admin/cours/${course.id}/modifier`}>
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
