/* ------------------------------------------------------------------ */
/*  Banque de questions pour les tests.                                */
/*  Contenu générique / à titre d'exemple de structure — à remplacer   */
/*  par des questions officielles et vérifiées avant mise en           */
/*  production. Le tronc commun étant partagé par tous les permis      */
/*  (voir la page /permis), la même banque alimente tous les tests ;   */
/*  libre à toi de créer des variantes par catégorie plus tard.        */
/* ------------------------------------------------------------------ */

export type Choice = {
  id: "a" | "b" | "c" | "d";
  label: string;
};

export type Question = {
  id: string;
  /** slug du thème correspondant, voir lib/data/themes.ts */
  theme: string;
  question: string;
  choices: Choice[];
  correctChoiceId: Choice["id"];
  explication: string;
};

export const QUESTIONS: Question[] = [
  {
    id: "q1",
    theme: "panneaux",
    question: "Que signifie un panneau triangulaire à bordure rouge ?",
    choices: [
      { id: "a", label: "Une obligation à respecter" },
      { id: "b", label: "Un danger à anticiper" },
      { id: "c", label: "Une indication pratique" },
      { id: "d", label: "Une interdiction totale" },
    ],
    correctChoiceId: "b",
    explication:
      "Le triangle à bordure rouge est la famille des panneaux de danger : il prévient d'une situation à anticiper, sans forcément l'interdire.",
  },
  {
    id: "q2",
    theme: "panneaux",
    question: "Un panneau rond à fond bleu indique généralement…",
    choices: [
      { id: "a", label: "Une obligation" },
      { id: "b", label: "Un danger" },
      { id: "c", label: "Une interdiction" },
      { id: "d", label: "Une simple information" },
    ],
    correctChoiceId: "a",
    explication:
      "Le fond bleu et la forme ronde signalent en général une obligation à suivre, contrairement au cercle bordé de rouge qui marque une interdiction.",
  },
  {
    id: "q3",
    theme: "priorites",
    question:
      "Dans un carrefour sans aucune signalisation, qui est prioritaire, en règle générale ?",
    choices: [
      { id: "a", label: "Le véhicule le plus rapide" },
      { id: "b", label: "Le véhicule venant de la droite" },
      { id: "c", label: "Le véhicule le plus gros" },
      { id: "d", label: "Le premier arrivé au carrefour" },
    ],
    correctChoiceId: "b",
    explication:
      "En l'absence de tout marquage ou panneau, la priorité à droite s'applique par défaut.",
  },
  {
    id: "q4",
    theme: "priorites",
    question: "En arrivant à un rond-point, vous devez en général…",
    choices: [
      { id: "a", label: "Forcer le passage si vous êtes prioritaire" },
      {
        id: "b",
        label: "Céder le passage aux véhicules déjà engagés dans l'anneau",
      },
      { id: "c", label: "Vous arrêter systématiquement avant d'entrer" },
      { id: "d", label: "Accélérer pour vous insérer rapidement" },
    ],
    correctChoiceId: "b",
    explication:
      "Les véhicules déjà engagés dans l'anneau sont le plus souvent prioritaires sur ceux qui souhaitent y entrer.",
  },
  {
    id: "q5",
    theme: "vitesse-distances",
    question: "La vitesse maximale indiquée sur un panneau est…",
    choices: [
      { id: "a", label: "Toujours la vitesse à adopter" },
      {
        id: "b",
        label: "Un plafond à ne pas dépasser, à réduire selon les conditions",
      },
      { id: "c", label: "Indicative seulement" },
      { id: "d", label: "Valable uniquement de jour" },
    ],
    correctChoiceId: "b",
    explication:
      "C'est un maximum, pas un objectif : la vitesse doit être réduite si la visibilité, le trafic ou l'état de la route l'exigent.",
  },
  {
    id: "q6",
    theme: "vitesse-distances",
    question: "La distance de freinage augmente avec…",
    choices: [
      { id: "a", label: "Uniquement la météo" },
      { id: "b", label: "Uniquement l'état des pneus" },
      { id: "c", label: "La vitesse, entre autres facteurs" },
      { id: "d", label: "Elle ne varie jamais" },
    ],
    correctChoiceId: "c",
    explication:
      "La vitesse est un facteur central : plus elle augmente, plus la distance nécessaire pour s'arrêter s'allonge.",
  },
  {
    id: "q7",
    theme: "securite",
    question: "Un des dangers de l'alcool au volant est qu'il…",
    choices: [
      { id: "a", label: "Améliore les réflexes" },
      {
        id: "b",
        label: "Donne une fausse confiance tout en réduisant la vigilance",
      },
      { id: "c", label: "N'a aucun effet à faible dose" },
      { id: "d", label: "Se ressent toujours immédiatement et fortement" },
    ],
    correctChoiceId: "b",
    explication:
      "C'est ce décalage entre la confiance ressentie et la vigilance réelle qui rend l'alcool particulièrement dangereux au volant.",
  },
  {
    id: "q8",
    theme: "securite",
    question:
      "Face aux premiers signes de fatigue au volant, la meilleure réaction est…",
    choices: [
      { id: "a", label: "Ouvrir la fenêtre et continuer" },
      { id: "b", label: "Augmenter la vitesse pour arriver plus vite" },
      { id: "c", label: "S'arrêter et faire une pause" },
      { id: "d", label: "Mettre la musique plus fort" },
    ],
    correctChoiceId: "c",
    explication:
      "Aucune astuce ne remplace le repos : s'arrêter reste la seule réponse fiable face à la fatigue.",
  },
  {
    id: "q9",
    theme: "premiers-secours",
    question:
      "En arrivant sur les lieux d'un accident, la toute première action est…",
    choices: [
      { id: "a", label: "Déplacer les blessés" },
      { id: "b", label: "Sécuriser la zone pour éviter un sur-accident" },
      { id: "c", label: "Filmer la scène" },
      { id: "d", label: "Discuter avec les témoins" },
    ],
    correctChoiceId: "b",
    explication:
      "Protéger avant de secourir : sécuriser la zone évite qu'un second accident ne s'ajoute au premier.",
  },
  {
    id: "q10",
    theme: "premiers-secours",
    question: "Sauf danger immédiat, une personne blessée doit…",
    choices: [
      { id: "a", label: "Être déplacée rapidement" },
      {
        id: "b",
        label: "Ne pas être déplacée avant l'arrivée des secours",
      },
      { id: "c", label: "Être assise pour la calmer" },
      { id: "d", label: "Être mise sur le ventre" },
    ],
    correctChoiceId: "b",
    explication:
      "Un mauvais geste peut aggraver une blessure invisible : mieux vaut attendre des secours formés, sauf danger immédiat.",
  },
  {
    id: "q11",
    theme: "mecanique",
    question: "Avant un trajet, un contrôle rapide devrait inclure…",
    choices: [
      { id: "a", label: "Seulement le niveau de carburant" },
      { id: "b", label: "L'état des pneus, des feux et des rétroviseurs" },
      { id: "c", label: "Rien, ce n'est pas nécessaire" },
      { id: "d", label: "Uniquement la propreté extérieure" },
    ],
    correctChoiceId: "b",
    explication:
      "Ces quelques points de contrôle rapides permettent de repérer l'essentiel avant de prendre la route.",
  },
  {
    id: "q12",
    theme: "mecanique",
    question: "Un voyant d'alerte qui reste allumé au tableau de bord…",
    choices: [
      { id: "a", label: "Peut toujours être ignoré" },
      { id: "b", label: "Doit être vérifié rapidement" },
      { id: "c", label: "Concerne uniquement le confort" },
      { id: "d", label: "S'éteint toujours tout seul" },
    ],
    correctChoiceId: "b",
    explication:
      "Un voyant persistant signale un problème à ne pas laisser traîner : mieux vaut un léger retard qu'une panne en route.",
  },
];
