// lib/site-settings.ts
import { cache } from "react";
import prisma from "@/lib/prisma";

export const SITE_SETTINGS_ID = "main";

export type SiteSettings = {
  siteName: string;
  title: string;
  description: string;
  keywords: string | null;
  logoUrl: string | null;
  faviconUrl: string | null;
  ogImageUrl: string | null;
};

// Valeurs de secours utilisées tant que l'admin n'a rien configuré, ou si
// la ligne en base n'existe pas encore.
export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  siteName: "FeuVert",
  title: "FeuVert — Préparation au code de la route",
  description:
    "Préparez l'examen du code de la route en ligne : thèmes, séries d'entraînement et suivi de progression, pour les candidats au Bénin.",
  keywords: null,
  logoUrl: null,
  faviconUrl: null,
  ogImageUrl: null,
};

/**
 * Lit les réglages SEO depuis la base. `cache()` de React ne mémorise le
 * résultat que pour la durée d'une seule requête/rendu (contrairement à
 * unstable_cache qui persiste entre requêtes) : ça évite d'interroger la
 * base plusieurs fois si generateMetadata, le layout et une page l'appellent
 * tous, sans dépendre des API de cache encore instables de Next canary.
 * Les changements enregistrés depuis /admin/seo sont donc visibles dès la
 * requête suivante, sans étape de revalidation manuelle à gérer.
 */
export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: SITE_SETTINGS_ID },
  });
  if (!settings) return DEFAULT_SITE_SETTINGS;

  return {
    siteName: settings.siteName,
    title: settings.title,
    description: settings.description,
    keywords: settings.keywords,
    logoUrl: settings.logoUrl,
    faviconUrl: settings.faviconUrl,
    ogImageUrl: settings.ogImageUrl,
  };
});
