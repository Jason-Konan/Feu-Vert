import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

import { deleteTest, togglePublishTest } from "@/lib/actions/tests";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DeleteButton } from "@/components/admin/bouton-supprimer";
import { QuestionForm } from "@/components/admin/question-form";
import { TestForm } from "@/components/admin/test-form";
import { TogglePublishButton } from "@/components/admin/toggle-publish-button";
import { QuestionList } from "@/components/admin/questions-list";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditTestPage({ params }: PageProps) {
  await requireAdmin();
  const { id } = await params;

  const [test, licenseTypes] = await Promise.all([
    prisma.test.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: { order: "asc" },
          include: { options: { orderBy: { order: "asc" } } },
        },
      },
    }),
    prisma.licenseType.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      select: { id: true, name: true, code: true },
    }),
  ]);

  if (!test) notFound();

  const nextOrder =
    test.questions.length > 0
      ? Math.max(...test.questions.map((q) => q.order)) + 1
      : 0;

  async function handleTogglePublish() {
    "use server";
    await togglePublishTest(test!.id, !test!.isPublished);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold">{test.title}</h1>
          <Badge variant={test.isPublished ? "default" : "secondary"}>
            {test.isPublished ? "Publié" : "Brouillon"}
          </Badge>
        </div>
        <div className="flex gap-2">
          <TogglePublishButton
            testId={test.id}
            isPublished={test.isPublished}
            action={togglePublishTest}
          />
          <DeleteButton
            title={`Supprimer "${test.title}" ?`}
            description="Toutes les questions de ce test seront également supprimées."
            action={deleteTest.bind(null, test.id)}
            redirectTo="/admin/tests"
          />
        </div>
      </div>

      <Tabs defaultValue="questions">
        <TabsList>
          <TabsTrigger value="questions">
            Questions ({test.questions.length})
          </TabsTrigger>
          <TabsTrigger value="infos">Informations</TabsTrigger>
        </TabsList>

        <TabsContent value="questions" className="space-y-4">
          <div className="flex justify-end">
            <QuestionForm testId={test.id} nextOrder={nextOrder} />
          </div>
          <QuestionList questions={test.questions} testId={test.id} />
        </TabsContent>

        <TabsContent value="infos">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Modifier le test</CardTitle>
            </CardHeader>
            <CardContent>
              <TestForm
                test={{
                  id: test.id,
                  title: test.title,
                  description: test.description,
                  durationMin: test.durationMin,
                  passingScore: test.passingScore,
                  licenseTypeId: test.licenseTypeId,
                  isPublished: test.isPublished,
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
