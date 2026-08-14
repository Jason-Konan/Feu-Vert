// components/site/footer.tsx
import Link from "next/link";

// Liens regroupés par colonne : simple à modifier sans toucher au JSX (DRY)
const FOOTER_LINKS = [
  {
    title: "Navigation",
    links: [
      { href: "/", label: "Accueil" },
      { href: "/permis", label: "Permis" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Compte",
    links: [
      { href: "/login", label: "Se connecter" },
      { href: "/sign-up", label: "Créer un compte" },
    ],
  },
  // {
  //   title: "Légal",
  //   links: [
  //     { href: "/mentions-legales", label: "Mentions légales" },
  //     { href: "/confidentialite", label: "Confidentialité" },
  //   ],
  // },
];

type FooterProps = {
  /** Nom du site depuis les réglages SEO. Repli sur "FeuVert" si absent. */
  siteName?: string;
  /** Logo uploadé depuis /admin/seo. Repli sur le logo pastilles par défaut si absent. */
  logoUrl?: string | null;
};

export default function Footer({ siteName, logoUrl }: FooterProps) {
  // Année calculée automatiquement, jamais à mettre à jour à la main
  const currentYear = new Date().getFullYear();
  const nom = siteName?.trim() || "FeuVert";

  return (
    <footer className="border-t border-[#1C1C1E]/8 bg-[#FBFAF7]">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-12 sm:flex-row sm:gap-8">
          {/* ── Marque ── */}
          <div className="max-w-xs">
            <Link href="/" className="flex items-center gap-2">
              {logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- image externe (Vercel Blob), taille fixe
                <img
                  src={logoUrl}
                  alt={nom}
                  className="h-7 w-auto max-w-[140px] object-contain"
                />
              ) : (
                <>
                  <span className="flex flex-col items-center justify-center gap-0.5 rounded-xl border-2 border-[#1C1C1E] p-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#C0392B]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-[#F5C800]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-[#235C43]" />
                  </span>
                  <span className="font-[family-name:var(--font-display)] text-xl font-bold text-[#1C1C1E]">
                    {nom}
                  </span>
                </>
              )}
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-[#6B7280]">
              Préparation à l&apos;examen du code de la route pour les candidats
              au Bénin.
            </p>
          </div>

          {/* ── Colonnes de liens ── */}
          <div className="grid grid-cols-2 gap-x-10 gap-y-10 sm:grid-cols-3 sm:gap-x-16">
            {FOOTER_LINKS.map((colonne) => (
              <div key={colonne.title}>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#6B7280]">
                  {colonne.title}
                </p>
                <ul className="mt-4 space-y-2.5 text-sm">
                  {colonne.links.map((lien) => (
                    <li key={lien.href}>
                      <Link
                        href={lien.href}
                        className="text-[#1C1C1E]/80 transition-colors hover:text-[#235C43]"
                      >
                        {lien.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* ── Bas de page ── */}
        <div className="mt-12 flex flex-col gap-3 border-t border-[#1C1C1E]/8 pt-6 text-xs text-[#6B7280] sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {currentYear} {nom}. Tous droits réservés.
          </p>
          <p className="max-w-md sm:text-right">
            {nom} est une plateforme indépendante et n&apos;est pas affiliée à
            l&apos;Agence Nationale de Sécurité Routière du Bénin.
          </p>
        </div>
      </div>
    </footer>
  );
}
