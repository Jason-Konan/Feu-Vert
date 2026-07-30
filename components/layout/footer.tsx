import { LightbulbIcon } from "lucide-react";
import Link from "next/link";

// Liens regroupés par colonne : simple à modifier sans toucher au JSX (DRY)
const FOOTER_LINKS = [
  {
    title: "Navigation",
    links: [
      { href: "/", label: "Accueil" },
      { href: "/about", label: "À propos" },
      { href: "/services", label: "Services" },
    ],
  },
  {
    title: "Légal",
    links: [
      { href: "/mentions-legales", label: "Mentions légales" },
      { href: "/confidentialite", label: "Confidentialité" },
    ],
  },
];

export default function Footer() {
  // Année calculée automatiquement, jamais à mettre à jour à la main
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-900/5 bg-[#F6F4EF]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row">
          <div>
            <div className="flex items-center gap-2.5">
              <LightbulbIcon className="h-6 w-3 text-slate-900" />
              <span className="font-[system-ui,'Arial_Narrow',sans-serif] tracking-tight text-base font-semibold uppercase tracking-wide text-slate-900">
                Feu Vert
              </span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-slate-500">
              Préparation à l&apos;examen du code de la route pour les candidats
              au Bénin.
            </p>
          </div>

          <div className="flex gap-16 text-sm">
            <div>
              <p className="font-semibold text-slate-900">Plateforme</p>
              <ul className="mt-3 space-y-2 text-slate-500">
                <li>
                  <a href="#themes" className="hover:text-slate-900">
                    Thèmes
                  </a>
                </li>
                <li>
                  <a href="#fonctionnement" className="hover:text-slate-900">
                    Fonctionnement
                  </a>
                </li>
                <li>
                  <a href="#tarifs" className="hover:text-slate-900">
                    Tarifs
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-slate-900">Compte</p>
              <ul className="mt-3 space-y-2 text-slate-500">
                <li>
                  <Link href="/connexion" className="hover:text-slate-900">
                    Se connecter
                  </Link>
                </li>
                <li>
                  <Link href="/inscription" className="hover:text-slate-900">
                    S&apos;inscrire
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-900/5 pt-6 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Feu Vert. Tous droits réservés.</p>
          <p className="mt-1">
            Feu Vert est une plateforme indépendante et n&apos;est pas affiliée
            à l&apos;Agence Nationale de Sécurité Routière du Bénin.
          </p>
        </div>
      </div>
    </footer>
  );
}
