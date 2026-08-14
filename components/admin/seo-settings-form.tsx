// app/admin/seo/seo-settings-form.tsx
"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Upload,
  X,
  ImageIcon,
} from "lucide-react";
import { SiteSettings } from "@/lib/site-settings";
import { updateSiteSettings } from "@/lib/actions/seo";

type Statut = "idle" | "success" | "error";
type ChampImage = "logo" | "favicon" | "ogImage";

const LABELS: Record<ChampImage, { titre: string; aide: string }> = {
  logo: {
    titre: "Logo",
    aide: "Affiché dans la barre de navigation et le pied de page. PNG ou SVG conseillé.",
  },
  favicon: {
    titre: "Favicon",
    aide: "Icône affichée dans l'onglet du navigateur. Format carré, 512×512 recommandé.",
  },
  ogImage: {
    titre: "Image de partage (OG)",
    aide: "Aperçu affiché quand un lien vers le site est partagé sur les réseaux sociaux. 1200×630 recommandé.",
  },
};

export default function SeoSettingsForm({
  settings,
}: {
  settings: SiteSettings;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [statut, setStatut] = useState<Statut>("idle");
  const [error, setError] = useState<string | null>(null);

  const [logo, setLogo] = useImageField(settings.logoUrl);
  const [favicon, setFavicon] = useImageField(settings.faviconUrl);
  const [ogImage, setOgImage] = useImageField(settings.ogImageUrl);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!formRef.current) return;
    setError(null);
    setStatut("idle");

    const formData = new FormData(formRef.current);
    startTransition(async () => {
      const res = await updateSiteSettings(formData);
      if (res.ok) {
        setStatut("success");
      } else {
        setError(res.error);
        setStatut("error");
      }
    });
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-[#C0392B]/20 bg-[#C0392B]/5 px-4 py-3">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#C0392B]" />
          <p className="text-sm text-[#C0392B]">{error}</p>
        </div>
      )}

      {statut === "success" && (
        <div className="flex items-start gap-3 rounded-xl border border-[#235C43]/25 bg-[#235C43]/6 px-4 py-3">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#235C43]" />
          <p className="text-sm font-medium text-[#235C43]">
            Réglages enregistrés. Les changements sont déjà visibles sur le
            site.
          </p>
        </div>
      )}

      {/* ── Section Général ── */}
      <section className="rounded-2xl border border-[#1C1C1E]/8 bg-white p-6 shadow-[3px_3px_0_rgba(0,0,0,0.04)]">
        <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-[#1C1C1E]">
          Général
        </h2>

        <div className="mt-5 space-y-4">
          <div>
            <label
              htmlFor="siteName"
              className="mb-2 block text-[10px] font-bold uppercase tracking-[0.18em] text-[#6B7280]"
            >
              Nom du site
            </label>
            <input
              id="siteName"
              name="siteName"
              defaultValue={settings.siteName}
              required
              className="w-full rounded-xl border border-[#1C1C1E]/10 bg-white px-4 py-3 text-sm text-[#1C1C1E] outline-none transition-all duration-200 focus:border-[#235C43] focus:shadow-[4px_4px_0_rgba(35,92,67,0.1)]"
            />
          </div>

          <div>
            <label
              htmlFor="title"
              className="mb-2 block text-[10px] font-bold uppercase tracking-[0.18em] text-[#6B7280]"
            >
              Titre (balise &lt;title&gt;)
            </label>
            <input
              id="title"
              name="title"
              defaultValue={settings.title}
              required
              maxLength={70}
              className="w-full rounded-xl border border-[#1C1C1E]/10 bg-white px-4 py-3 text-sm text-[#1C1C1E] outline-none transition-all duration-200 focus:border-[#235C43] focus:shadow-[4px_4px_0_rgba(35,92,67,0.1)]"
            />
            <p className="mt-1.5 text-[11px] text-[#6B7280]/70">
              Idéalement moins de 60 caractères pour ne pas être tronqué dans
              les résultats Google.
            </p>
          </div>

          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-[10px] font-bold uppercase tracking-[0.18em] text-[#6B7280]"
            >
              Meta description
            </label>
            <textarea
              id="description"
              name="description"
              defaultValue={settings.description}
              required
              rows={3}
              maxLength={160}
              className="w-full resize-none rounded-xl border border-[#1C1C1E]/10 bg-white px-4 py-3 text-sm text-[#1C1C1E] outline-none transition-all duration-200 focus:border-[#235C43] focus:shadow-[4px_4px_0_rgba(35,92,67,0.1)]"
            />
            <p className="mt-1.5 text-[11px] text-[#6B7280]/70">
              Idéalement moins de 160 caractères.
            </p>
          </div>

          <div>
            <label
              htmlFor="keywords"
              className="mb-2 block text-[10px] font-bold uppercase tracking-[0.18em] text-[#6B7280]"
            >
              Mots-clés{" "}
              <span className="normal-case text-[#6B7280]/60">
                (séparés par des virgules)
              </span>
            </label>
            <input
              id="keywords"
              name="keywords"
              defaultValue={settings.keywords ?? ""}
              placeholder="code de la route, permis, Bénin"
              className="w-full rounded-xl border border-[#1C1C1E]/10 bg-white px-4 py-3 text-sm text-[#1C1C1E] outline-none transition-all duration-200 placeholder:text-[#6B7280]/35 focus:border-[#235C43] focus:shadow-[4px_4px_0_rgba(35,92,67,0.1)]"
            />
          </div>
        </div>
      </section>

      {/* ── Section Images ── */}
      <section className="rounded-2xl border border-[#1C1C1E]/8 bg-white p-6 shadow-[3px_3px_0_rgba(0,0,0,0.04)]">
        <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-[#1C1C1E]">
          Images
        </h2>

        <div className="mt-5 space-y-6">
          <ImageField
            champ="logo"
            state={logo}
            setState={setLogo}
            rond={false}
          />
          <ImageField
            champ="favicon"
            state={favicon}
            setState={setFavicon}
            rond
          />
          <ImageField
            champ="ogImage"
            state={ogImage}
            setState={setOgImage}
            rond={false}
            large
          />
        </div>
      </section>

      <button
        type="submit"
        disabled={isPending}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-[#1C1C1E] px-6 py-3.5 text-sm font-bold text-white shadow-[4px_4px_0_rgba(0,0,0,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#2a2a2c] hover:shadow-[4px_6px_0_rgba(0,0,0,0.18)] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Enregistrement…
          </>
        ) : (
          "Enregistrer les réglages"
        )}
      </button>
    </form>
  );
}

/** État local d'un champ image : aperçu affiché + drapeau de suppression
 *  envoyé au serveur. Le fichier lui-même est lu directement depuis le
 *  <form> via son name="{champ}File" au moment de la soumission. */
function useImageField(initialUrl: string | null) {
  return useState({ preview: initialUrl, removed: false });
}

function ImageField({
  champ,
  state,
  setState,
  rond,
  large,
}: {
  champ: ChampImage;
  state: { preview: string | null; removed: boolean };
  setState: (v: { preview: string | null; removed: boolean }) => void;
  rond: boolean;
  large?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { titre, aide } = LABELS[champ];

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setState({ preview: URL.createObjectURL(file), removed: false });
  }

  function handleRemove() {
    setState({ preview: null, removed: true });
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="flex items-start gap-4">
      <div
        className={
          rond
            ? "flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#1C1C1E]/10 bg-[#F6F4EF]"
            : large
              ? "flex h-24 w-40 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#1C1C1E]/10 bg-[#F6F4EF]"
              : "flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#1C1C1E]/10 bg-[#F6F4EF]"
        }
      >
        {state.preview ? (
          <Image
            src={state.preview}
            alt={titre}
            width={large ? 160 : 64}
            height={large ? 96 : 64}
            unoptimized
            className="h-full w-full object-contain"
          />
        ) : (
          <ImageIcon className="h-5 w-5 text-[#6B7280]/40" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-[#1C1C1E]">{titre}</p>
        <p className="mt-0.5 text-xs text-[#6B7280]">{aide}</p>

        <div className="mt-2.5 flex items-center gap-2">
          <label className="flex cursor-pointer items-center gap-1.5 rounded-full border-2 border-[#1C1C1E]/12 bg-white px-3.5 py-1.5 text-xs font-bold text-[#1C1C1E] transition-all duration-200 hover:border-[#1C1C1E]/25">
            <Upload className="h-3.5 w-3.5" />
            Choisir un fichier
            <input
              ref={inputRef}
              type="file"
              name={`${champ}File`}
              accept="image/png,image/jpeg,image/webp,image/svg+xml,image/x-icon"
              onChange={handleChange}
              className="hidden"
            />
          </label>

          {state.preview && (
            <button
              type="button"
              onClick={handleRemove}
              className="flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-bold text-[#C0392B] transition-colors hover:bg-[#C0392B]/6"
            >
              <X className="h-3.5 w-3.5" />
              Retirer
            </button>
          )}
        </div>

        <input
          type="hidden"
          name={`${champ}Remove`}
          value={state.removed ? "true" : "false"}
        />
      </div>
    </div>
  );
}
