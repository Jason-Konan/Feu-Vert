// components/admin/toggle-publish-button.tsx
"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function TogglePublishButton({
  testId,
  isPublished,
  action,
}: {
  testId: string;
  isPublished: boolean;
  action: (
    id: string,
    next: boolean,
  ) => Promise<{ success: true } | { error: string }>;
}) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      const result = await action(testId, !isPublished);
      if ("error" in result) {
        toast.error(result.error);
      }
    });
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleClick}
      disabled={isPending}
    >
      {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {isPublished ? "Dépublier" : "Publier"}
    </Button>
  );
}
