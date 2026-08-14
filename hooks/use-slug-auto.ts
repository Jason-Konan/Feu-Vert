// hooks/use-slug-auto.ts

import { useEffect, useState } from "react";
import type {
  UseFormWatch,
  UseFormSetValue,
  FieldValues,
  Path,
} from "react-hook-form";
import { slugify } from "@/lib/slugify";

/**
 * Génère automatiquement un champ "slug" à partir d'un champ source
 * (ex: le titre), tant que l'utilisateur n'a pas modifié le slug
 * lui-même. Réutilisable par n'importe quel formulaire ayant ce besoin.
 */
export function useSlugAuto<T extends FieldValues>(
  watch: UseFormWatch<T>,
  setValue: UseFormSetValue<T>,
  champSource: Path<T>,
  champCible: Path<T>,
  dejaExistant: boolean,
) {
  const [modifieManuel, setModifieManuel] = useState(dejaExistant);
  const valeurSource = watch(champSource);

  useEffect(() => {
    if (!modifieManuel) {
      setValue(champCible, slugify(String(valeurSource || "")) as any);
    }
  }, [valeurSource, modifieManuel, setValue, champCible]);

  return { marquerModifieManuel: () => setModifieManuel(true) };
}
