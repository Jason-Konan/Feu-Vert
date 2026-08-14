// lib/upload.ts
"use server";

import { put, del } from "@vercel/blob";

export async function uploadImage(formData: FormData) {
  const file = formData.get("file") as File | null;

  if (!file) return { error: "Aucun fichier reçu" };
  if (!file.type.startsWith("image/")) return { error: "Fichier non supporté" };
  if (file.size > 2 * 1024 * 1024)
    return { error: "Fichier trop lourd (max 2 Mo)" };

  const blob = await put(file.name, file, {
    access: "public",
    addRandomSuffix: true,
  });

  return { url: blob.url };
}

export async function deleteImage(url: string) {
  if (!url.includes("blob.vercel-storage.com")) return;
  await del(url);
}
