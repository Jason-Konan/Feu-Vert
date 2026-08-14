"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ActionResult } from "@/lib/actions/types";

interface DeleteButtonProps {
  title: string;
  description: string;
  action: () => Promise<ActionResult | void>;
  redirectTo?: string;
}

export function DeleteButton({
  title,
  description,
  action,
  redirectTo,
}: DeleteButtonProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleConfirm() {
    startTransition(async () => {
      const result = await action();

      if (result && "error" in result) {
        toast.error(result.error);
        return;
      }

      setOpen(false);

      if (redirectTo) {
        router.push(redirectTo);
      }
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger className="text-destructive hover:text-destructive">
        <Trash2 className="h-4 w-4" />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} disabled={isPending}>
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Supprimer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
