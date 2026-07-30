import {
  Signpost,
  GitFork,
  Gauge,
  ShieldAlert,
  HeartPulse,
  Wrench,
  type LucideIcon,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Source unique de vérité pour les thèmes de cours.                  */
/*  Utilisée par /permis/[code]/cours et /permis/[code]/cours/[theme]. */
/*                                                                      */
/*  Le contenu pédagogique ci-dessous (points clés, paragraphes) est   */
/*  volontairement générique / à titre d'exemple de mise en page.      */
/*  À remplacer par du contenu vérifié et conforme au code de la route */
/*  béninois avant mise en production.                                 */
/* ------------------------------------------------------------------ */

export type CourseTheme = {
  /** Segment d'URL, ex. "panneaux" -> /permis/b/cours/panneaux */
  slug: string;
  titre: string;
  resume: string;
  icon: LucideIcon;
  /** Points clés affichés en tête de leçon */
  points: string[];
  /** Corps de la leçon, un paragraphe par élément */
  contenu: string[];
  /** Astuce ou rappel affiché en encart */
  astuce: string;
};

export const THEMES: CourseTheme[] = [
  {
    slug: "panneaux",
    titre: "Panneaux de signalisation",
    resume:
      "Danger, interdiction, obligation, indication : apprenez à les reconnaître d'un coup d'œil.",
    icon: Signpost,
    points: [
      "Distinguer les panneaux de danger, d'interdiction, d'obligation et d'indication",
      "Reconnaître les formes et couleurs qui donnent une première indication du message",
      "Savoir dans quel ordre appliquer les panneaux quand plusieurs se contredisent",
    ],
    contenu: [
      "Chaque famille de panneau a un code visuel propre : le triangle signale un danger à anticiper, le cercle bordé de rouge marque une interdiction, le cercle bleu indique une obligation, et le panneau carré ou rectangulaire donne une information pratique.",
      "En cas de panneaux contradictoires sur un même tronçon, la règle générale est de suivre l'indication la plus récente et la plus spécifique à la situation, sauf indication contraire d'un agent de circulation, qui reste toujours prioritaire.",
    ],
    astuce:
      "Un bon réflexe : à chaque nouveau panneau croisé en conditions réelles, nommez-le à voix haute avec sa signification. Cette verbalisation ancre la reconnaissance beaucoup plus vite qu'une simple lecture passive.",
  },
  {
    slug: "priorites",
    titre: "Priorités et intersections",
    resume:
      "Ronds-points, carrefours et priorités à droite, expliqués cas par cas.",
    icon: GitFork,
    points: [
      "Identifier qui a la priorité dans un carrefour non signalé",
      "Adapter son comportement à l'entrée et à l'intérieur d'un rond-point",
      "Repérer les panneaux qui suppriment ou confirment la priorité à droite",
    ],
    contenu: [
      "Dans un carrefour sans signalisation ni marquage, la priorité revient en général au véhicule arrivant par la droite. Cette règle change dès qu'un panneau, un feu ou un marquage au sol vient la préciser ou l'annuler.",
      "Dans un rond-point, la priorité est le plus souvent donnée aux véhicules déjà engagés dans l'anneau : on cède donc le passage avant d'y entrer, tout en restant attentif aux deux-roues qui peuvent se faufiler sur les côtés.",
    ],
    astuce:
      "Avant d'aborder un carrefour inconnu, ralentissez et balayez du regard les quatre branches : la vitesse d'anticipation compte souvent plus que la connaissance exacte de la règle.",
  },
  {
    slug: "vitesse-distances",
    titre: "Vitesse et distances",
    resume:
      "Limitations, distances de sécurité et temps de freinage selon les conditions.",
    icon: Gauge,
    points: [
      "Adapter sa vitesse au contexte, pas seulement au panneau affiché",
      "Comprendre pourquoi la distance de freinage augmente avec la vitesse et l'état de la route",
      "Appliquer une règle simple pour garder une distance de sécurité suffisante",
    ],
    contenu: [
      "La vitesse maximale autorisée est un plafond, pas un objectif : elle doit être réduite dès que la visibilité, la densité du trafic ou l'état de la chaussée le justifient.",
      "La distance de freinage dépend à la fois du temps de réaction du conducteur et de la distance parcourue une fois les freins actionnés ; les deux augmentent avec la vitesse, ce qui explique pourquoi un excès même modeste peut avoir un impact disproportionné.",
    ],
    astuce:
      "Pour garder une distance de sécurité suffisante avec le véhicule qui précède, comptez mentalement quelques secondes entre son passage et le vôtre au niveau d'un repère fixe : si vous arrivez avant la fin du compte, vous êtes trop près.",
  },
  {
    slug: "securite",
    titre: "Alcool, fatigue et sécurité",
    resume:
      "Les règles qui protègent le conducteur, les passagers et les autres usagers.",
    icon: ShieldAlert,
    points: [
      "Comprendre pourquoi l'alcool et la fatigue dégradent la conduite bien avant qu'on s'en rende compte",
      "Reconnaître les premiers signes de fatigue au volant",
      "Connaître les équipements de sécurité de base et leur utilité",
    ],
    contenu: [
      "L'alcool et la fatigue réduisent la vigilance, allongent le temps de réaction et donnent une fausse confiance dans ses propres capacités, ce qui les rend particulièrement dangereux : le conducteur concerné a souvent l'impression de conduire normalement.",
      "La ceinture de sécurité, le bon réglage des rétroviseurs et une position de conduite adaptée réduisent fortement la gravité des conséquences en cas d'incident, même si l'accident lui-même reste toujours à éviter en priorité.",
    ],
    astuce:
      "Dès les premiers bâillements répétés ou une perte de concentration sur la route, la seule réponse fiable est de s'arrêter et de faire une pause : aucune technique ne remplace le repos.",
  },
  {
    slug: "premiers-secours",
    titre: "Premiers secours",
    resume: "Les bons réflexes à avoir en cas d'accident sur la route.",
    icon: HeartPulse,
    points: [
      "Connaître l'ordre des priorités en arrivant sur un accident : protéger, alerter, secourir",
      "Savoir sécuriser les lieux avant d'intervenir",
      "Identifier les gestes à ne pas faire en attendant les secours",
    ],
    contenu: [
      "Face à un accident, la première action est toujours de sécuriser la zone pour éviter un sur-accident : signaler le danger, couper le moteur des véhicules impliqués si possible, et se mettre soi-même à l'abri.",
      "Alerter les secours avec des informations précises (lieu, nombre de personnes concernées, état apparent des blessés) permet une intervention plus rapide et mieux adaptée que d'agir seul sans en avoir la formation.",
    ],
    astuce:
      "Sauf danger immédiat (incendie, sur-accident), on ne déplace pas une personne blessée : un geste maladroit peut aggraver une blessure invisible, notamment au niveau du cou ou du dos.",
  },
  {
    slug: "mecanique",
    titre: "Mécanique et entretien",
    resume: "Ce qu'il faut vérifier avant de prendre le volant.",
    icon: Wrench,
    points: [
      "Connaître les points de contrôle rapides avant un trajet",
      "Comprendre l'impact d'un mauvais entretien sur la sécurité",
      "Repérer les signaux d'alerte qui imposent un arrêt",
    ],
    contenu: [
      "Un tour rapide avant de prendre la route permet de repérer l'essentiel : pression et état des pneus, propreté des vitres et rétroviseurs, fonctionnement des feux et clignotants, niveau des liquides visibles.",
      "Un véhicule mal entretenu n'est pas seulement source de panne : des pneus usés ou des freins mal réglés augmentent directement les distances de freinage et le risque de perte de contrôle.",
    ],
    astuce:
      "Un voyant allumé au tableau de bord qui persiste après le démarrage n'est jamais à ignorer : mieux vaut un léger retard qu'une panne, voire un accident, en cours de route.",
  },
];

export function getThemeBySlug(
  slug: string | undefined,
): CourseTheme | undefined {
  if (!slug) return undefined;
  return THEMES.find((t) => t.slug === slug.toLowerCase());
}
