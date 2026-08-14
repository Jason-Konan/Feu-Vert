// app/admin/seo/actions.ts
"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { uploadImage, deleteImage } from "@/lib/upload";
import { SITE_SETTINGS_ID, type SiteSettings } from "@/lib/site-settings";

type ChampImage = "logo" | "favicon" | "ogImage";

type Resultat = { ok: true } | { ok: false; error: string };

async function verifierAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user || session.user.role !== "admin") {
    redirect("/");
  }
}

/**
 * Gère un champ image du formulaire : upload d'un nouveau fichier vers
 * Vercel Blob, suppression explicite demandée par l'admin, ou conservation
 * de l'URL actuelle si rien n'a changé. L'ancienne image est toujours
 * supprimée de Vercel Blob quand elle est remplacée ou retirée, pour ne
 * pas accumuler de fichiers orphelins.
 */
async function gererImage(
  formData: FormData,
  champ: ChampImage,
  urlActuelle: string | null,
): Promise<string | null> {
  const suppression = formData.get(`${champ}Remove`) === "true";
  const fichier = formData.get(`${champ}File`) as File | null;

  if (fichier && fichier.size > 0) {
    const uploadFormData = new FormData();
    uploadFormData.set("file", fichier);
    const result = await uploadImage(uploadFormData);

    if ("error" in result && result.error) {
      throw new Error(result.error);
    }
    if (urlActuelle) await deleteImage(urlActuelle);
    return (result as { url: string }).url;
  }

  if (suppression) {
    if (urlActuelle) await deleteImage(urlActuelle);
    return null;
  }

  return urlActuelle;
}

export async function updateSiteSettings(
  formData: FormData,
): Promise<Resultat> {
  await verifierAdmin();

  const siteName = (formData.get("siteName") as string | null)?.trim();
  const title = (formData.get("title") as string | null)?.trim();
  const description = (formData.get("description") as string | null)?.trim();
  const keywords = (formData.get("keywords") as string | null)?.trim() || null;

  if (!siteName || !title || !description) {
    return {
      ok: false,
      error: "Nom du site, titre et description sont obligatoires.",
    };
  }

  try {
    const current = await prisma.siteSettings.findUnique({
      where: { id: SITE_SETTINGS_ID },
    });

    const logoUrl = await gererImage(
      formData,
      "logo",
      current?.logoUrl ?? null,
    );
    const faviconUrl = await gererImage(
      formData,
      "favicon",
      current?.faviconUrl ?? null,
    );
    const ogImageUrl = await gererImage(
      formData,
      "ogImage",
      current?.ogImageUrl ?? null,
    );

    const data = {
      siteName,
      title,
      description,
      keywords,
      logoUrl,
      faviconUrl,
      ogImageUrl,
    };

    await prisma.siteSettings.upsert({
      where: { id: SITE_SETTINGS_ID },
      create: { id: SITE_SETTINGS_ID, ...data },
      update: data,
    });

    // Régénère les pages statiques déjà mises en cache par Next (le layout
    // racine notamment, où generateMetadata lit ces réglages), pour que le
    // nouveau titre/logo/favicon apparaisse dès la prochaine visite, sans
    // redéploiement.
    revalidatePath("/", "layout");

    return { ok: true };
  } catch (err) {
    console.error("Erreur mise à jour SEO:", err);
    const message =
      err instanceof Error ? err.message : "Une erreur est survenue.";
    return { ok: false, error: message };
  }
}
