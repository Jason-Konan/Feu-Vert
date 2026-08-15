import Link from "next/link";
import { Car, Signpost, ArrowRight } from "lucide-react";
import { TiptapContentRenderer } from "@/components/site/tiptap-content-renderer";
import { getActiveLicenseTypes } from "@/lib/data/license-types";
import { Reveal } from "@/app/(site)/reveal";

function truncate(text: string | null | undefined, max: number): string {
  if (!text) return "";
  return text.length <= max ? text : text.slice(0, max).trimEnd() + "…";
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, "");
}

type LicenseTypeGridProps = {
  /** "home" : rendu compact utilisé sur la page d'accueil.
   *  "full" : rendu avec CTA "Voir le détail", utilisé sur /permis. */
  variant?: "home" | "full";
  emptyMessage?: string;
};

export async function LicenseTypeGrid({
  variant = "home",
  emptyMessage = "Aucune catégorie de permis n'est encore disponible.",
}: LicenseTypeGridProps) {
  const licenseTypes = await getActiveLicenseTypes();

  if (licenseTypes.length === 0) {
    return (
      <Reveal>
        <p className="text-center text-sm text-[#6B7280]">{emptyMessage}</p>
      </Reveal>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {licenseTypes.map((lt, index) => (
        <Reveal key={lt.id} delay={(index % 3) * 90}>
          <Link
            href={`/permis/${lt.id}`}
            className="group relative block aspect-[4/5] overflow-hidden rounded-xl border-2 border-[#1C1C1E] shadow-[6px_6px_0_#1C1C1E] transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-[6px_8px_0_#1C1C1E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1C1C1E]"
          >
            {lt.imageUrl ? (
              <img
                src={lt.imageUrl}
                alt=""
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 bg-[#235C43]" />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1E]/92 via-[#1C1C1E]/20 to-transparent" />

            <span className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-lg bg-[#F5C800] text-[#1C1C1E]">
              {variant === "full" ? (
                <Signpost className="h-5 w-5" />
              ) : (
                <Car className="h-5 w-5" />
              )}
            </span>
            <span className="absolute right-3 top-3 rounded-md bg-[#1C1C1E] text-[#F5C800] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide">
              {lt.code}
            </span>

            <div className="absolute inset-x-0 bottom-0 p-5">
              <p className="font-[family-name:var(--font-display)] text-2xl font-semibold text-white">
                Permis {lt.code}
              </p>
              <p className="mt-0.5 text-sm font-medium text-white/75">
                {lt.name}
              </p>

              {lt.description &&
                (variant === "home" ? (
                  <div className="mt-2 text-xs text-white/55 leading-relaxed opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-in-out">
                    <Reveal delay={80}>
                      <TiptapContentRenderer
                        html={truncate(stripHtml(lt.description), 120)}
                      />
                    </Reveal>
                  </div>
                ) : (
                  <span className="mt-2 grid grid-rows-[0fr] opacity-0 transition-all duration-300 ease-out group-hover:mt-2.5 group-hover:grid-rows-[1fr] group-hover:opacity-100 group-focus-visible:mt-2.5 group-focus-visible:grid-rows-[1fr] group-focus-visible:opacity-100">
                    <span className="overflow-hidden">
                      <span className="block text-xs leading-relaxed text-white/55">
                        {truncate(stripHtml(lt.description), 120)}
                      </span>
                    </span>
                  </span>
                ))}

              {variant === "full" && (
                <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-white/90">
                  Voir le détail
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                </span>
              )}
            </div>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}
