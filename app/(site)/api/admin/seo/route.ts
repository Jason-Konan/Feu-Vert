// app/api/admin/seo/route.ts
import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SITE_SETTINGS_ID, revalidateSiteSettings } from "@/lib/site-settings";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "seo");
const ALLOWED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/svg+xml",
  "image/x-icon",
  "image/vnd.microsoft.icon",
];
const MAX_SIZE = 5 * 1024 * 1024; // 5 Mo

async function requireAdmin(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  return session?.user?.role === "admin" ? session : null;
}

/** Enregistre un fichier uploadé dans public/uploads/seo et renvoie son
 *  chemin public (ex: /uploads/seo/logo-171234.png). */
async function saveFile(file: File, prefix: string): Promise<string> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error(`Format d'image non supporté pour "${prefix}".`);
  }
  if (file.size > MAX_SIZE) {
    throw new Error(
      `Le fichier "${prefix}" dépasse la taille maximale (5 Mo).`,
    );
  }

  await mkdir(UPLOAD_DIR, { recursive: true });

  const ext = file.name.split(".").pop()?.toLowerCase() || "png";
  const filename = `${prefix}-${Date.now()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(UPLOAD_DIR, filename), buffer);

  return `/uploads/seo/${filename}`;
}

export async function GET(request: Request) {
  const session = await requireAdmin(request);
  if (!session) {
    return NextResponse.json(
      { ok: false, error: "Non autorisé." },
      { status: 403 },
    );
  }

  const settings = await prisma.siteSettings.findUnique({
    where: { id: SITE_SETTINGS_ID },
  });
  return NextResponse.json({ ok: true, settings });
}

export async function POST(request: Request) {
  const session = await requireAdmin(request);
  if (!session) {
    return NextResponse.json(
      { ok: false, error: "Non autorisé." },
      { status: 403 },
    );
  }

  try {
    const formData = await request.formData();

    const siteName = (formData.get("siteName") as string | null)?.trim();
    const title = (formData.get("title") as string | null)?.trim();
    const description = (formData.get("description") as string | null)?.trim();
    const keywords =
      (formData.get("keywords") as string | null)?.trim() || null;

    if (!siteName || !title || !description) {
      return NextResponse.json(
        {
          ok: false,
          error: "Nom du site, titre et description sont obligatoires.",
        },
        { status: 400 },
      );
    }

    const data: Record<string, unknown> = {
      siteName,
      title,
      description,
      keywords,
    };

    const logoFile = formData.get("logo") as File | null;
    if (logoFile && logoFile.size > 0) {
      data.logoUrl = await saveFile(logoFile, "logo");
    }

    const faviconFile = formData.get("favicon") as File | null;
    if (faviconFile && faviconFile.size > 0) {
      data.faviconUrl = await saveFile(faviconFile, "favicon");
    }

    const ogImageFile = formData.get("ogImage") as File | null;
    if (ogImageFile && ogImageFile.size > 0) {
      data.ogImageUrl = await saveFile(ogImageFile, "og");
    }

    const settings = await prisma.siteSettings.upsert({
      where: { id: SITE_SETTINGS_ID },
      create: { id: SITE_SETTINGS_ID, ...data },
      update: data,
    });

    // Invalide le cache serveur : le nouveau titre/logo/favicon apparaît
    // sur le site dès la prochaine requête, sans redéploiement.
    revalidateSiteSettings();

    return NextResponse.json({ ok: true, settings });
  } catch (err) {
    console.error("Erreur mise à jour SEO:", err);
    const message =
      err instanceof Error ? err.message : "Une erreur est survenue.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
