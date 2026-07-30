import { Bike, Car, Truck, Bus, Link2, type LucideIcon } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Source unique de vérité pour les catégories de permis.             */
/*  Utilisée par la page d'accueil (aperçu), la liste /permis, et la  */
/*  page de détail /permis/[code].                                     */
/* ------------------------------------------------------------------ */

export type Permis = {
  /** Libellé affiché, ex. "A1" */
  code: string;
  /** Segment d'URL, ex. "a1" -> /permis/a1 */
  slug: string;
  titre: string;
  /** Description courte, utilisée sur les cartes */
  resume: string;
  /** Description longue, utilisée sur la page de détail */
  description: string;
  /** Véhicules couverts par cette catégorie */
  vehicules: string[];
  icon: LucideIcon;
  image: string;
};

export const PERMIS: Permis[] = [
  {
    code: "A1",
    slug: "a1",
    titre: "Motos légères",
    resume: "Cyclomoteurs et motos jusqu'à 125 cm³.",
    description:
      "Le permis A1 est fait pour les deux-roues motorisés de faible cylindrée : c'est souvent la première étape avant d'accéder aux motos plus puissantes. Il couvre la conduite en circulation urbaine dense, la gestion de l'équilibre à basse vitesse et le partage de la route avec les autres usagers.",
    vehicules: [
      "Cyclomoteurs jusqu'à 50 cm³",
      "Motos légères jusqu'à 125 cm³ et 11 kW",
      "Scooters urbains",
    ],
    icon: Bike,
    image: "https://picsum.photos/seed/feuvert-a1/900/700",
  },
  {
    code: "A",
    slug: "a",
    titre: "Motos",
    resume: "Toutes cylindrées, sans limite de puissance.",
    description:
      "Le permis A donne accès à l'ensemble des motos, sans restriction de cylindrée ni de puissance. Il exige une bonne maîtrise de la vitesse, des distances de freinage et des dépassements, ainsi qu'une vigilance accrue vis-à-vis des autres véhicules aux intersections.",
    vehicules: [
      "Motos de toutes cylindrées",
      "Motos équipées d'un side-car",
      "Motos utilisées pour le transport de passager",
    ],
    icon: Bike,
    image: "https://picsum.photos/seed/feuvert-a/900/700",
  },
  {
    code: "B",
    slug: "b",
    titre: "Véhicules légers",
    resume: "Voitures particulières et utilitaires jusqu'à 3,5 t.",
    description:
      "Le permis B est le plus courant : il couvre la conduite des voitures particulières et des utilitaires légers. Il met l'accent sur les priorités, le stationnement, la conduite en agglomération et sur route, ainsi que les bons réflexes en cas d'imprévu.",
    vehicules: [
      "Voitures particulières",
      "Camionnettes et utilitaires jusqu'à 3,5 t",
      "Véhicules avec jusqu'à 8 places passagers",
    ],
    icon: Car,
    image: "https://picsum.photos/seed/feuvert-b/900/700",
  },
  {
    code: "C",
    slug: "c",
    titre: "Poids lourds",
    resume: "Camions et véhicules de plus de 3,5 tonnes.",
    description:
      "Le permis C concerne la conduite professionnelle des poids lourds. Il approfondit les notions de gabarit, de distances de freinage allongées, d'arrimage du chargement et de sécurité pour les usagers vulnérables autour d'un grand véhicule.",
    vehicules: [
      "Camions de plus de 3,5 tonnes",
      "Véhicules de transport de marchandises",
      "Camions-citernes et bennes",
    ],
    icon: Truck,
    image: "https://picsum.photos/seed/feuvert-c/900/700",
  },
  {
    code: "D",
    slug: "d",
    titre: "Transport en commun",
    resume: "Bus et minibus de plus de 9 places.",
    description:
      "Le permis D s'adresse à celles et ceux qui transportent des passagers. Il insiste sur la responsabilité vis-à-vis des voyageurs, la conduite souple, le respect des arrêts et itinéraires, et la gestion des montées et descentes en sécurité.",
    vehicules: [
      "Autobus et autocars",
      "Minibus de plus de 9 places",
      "Véhicules de transport scolaire",
    ],
    icon: Bus,
    image: "https://picsum.photos/seed/feuvert-d/900/700",
  },
  {
    code: "EB",
    slug: "eb",
    titre: "Avec remorque",
    resume: "Véhicules de catégorie B tractant une remorque lourde.",
    description:
      "Le permis EB complète le permis B pour la conduite d'un véhicule attelé à une remorque lourde. Il couvre les manœuvres spécifiques à l'attelage, la stabilité de l'ensemble en virage et au freinage, ainsi que les règles propres aux convois.",
    vehicules: [
      "Véhicules de catégorie B",
      "Avec remorque de plus de 750 kg",
      "Ensembles routiers légers (voiture + caravane, par exemple)",
    ],
    icon: Link2,
    image: "https://picsum.photos/seed/feuvert-eb/900/700",
  },
];

export function getPermisBySlug(slug: string | undefined): Permis | undefined {
  if (!slug) return undefined;
  return PERMIS.find((p) => p.slug === slug.toLowerCase());
}
