import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

import { deleteCourse } from "@/lib/actions/courses";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DeleteButton } from "@/components/admin/bouton-supprimer";
import { LessonForm } from "@/components/admin/lesson-form";
import { LessonList } from "@/components/admin/lesson-list";
import { CourseForm } from "@/components/admin/courses-form";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCoursePage({ params }: PageProps) {
  await requireAdmin();
  const { id } = await params;

  const [course, licenseTypes] = await Promise.all([
    prisma.course.findUnique({
      where: { id },
      include: { lessons: { orderBy: { order: "asc" } } },
    }),
    prisma.licenseType.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      select: { id: true, name: true, code: true },
    }),
  ]);

  if (!course) notFound();

  const nextOrder =
    course.lessons.length > 0
      ? Math.max(...course.lessons.map((l) => l.order)) + 1
      : 0;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{course.title}</h1>
        {/* ✅ .bind() crée une server action partiellement appliquée, sérialisable */}
        <DeleteButton
          title={`Supprimer "${course.title}" ?`}
          description="Toutes les leçons de ce cours seront également supprimées."
          action={deleteCourse.bind(null, course.id)}
          redirectTo="/admin/cours"
        />
      </div>

      <Tabs defaultValue="lecons">
        <TabsList>
          <TabsTrigger value="lecons">
            Leçons ({course.lessons.length})
          </TabsTrigger>
          <TabsTrigger value="infos">Informations</TabsTrigger>
        </TabsList>

        <TabsContent value="lecons" className="space-y-4">
          <div className="flex justify-end">
            <LessonForm courseId={course.id} nextOrder={nextOrder} />
          </div>
          <LessonList lessons={course.lessons} courseId={course.id} />
        </TabsContent>

        <TabsContent value="infos">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Modifier le cours</CardTitle>
            </CardHeader>
            <CardContent>
              <CourseForm
                course={{
                  id: course.id,
                  title: course.title,
                  description: course.description ?? "",
                  coverImageUrl: course.coverImageUrl ?? "",
                  licenseTypeId: course.licenseTypeId,
                  order: course.order,
                  isPublished: course.isPublished,
                }}
                licenseTypes={licenseTypes}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
