// Tool Playlists — curated ordered workflows of 2-5 real UtiliHub tools.
// Every step points at an id from src/lib/tool-matchmaker/targets.ts so links stay verified.

export type PlaylistStep = { target: string; whyEn: string; whyEs: string };

export type Playlist = {
  id: string;
  emoji: string;
  titleEn: string;
  titleEs: string;
  goalEn: string;
  goalEs: string;
  steps: PlaylistStep[];
};

export const PLAYLISTS: Playlist[] = [
  {
    id: "plan-a-move",
    emoji: "📦",
    titleEn: "Plan a move",
    titleEs: "Planificar una mudanza",
    goalEn: "Budget, lay out the new place and schedule the big day.",
    goalEs: "Presupuesta, distribuye el lugar nuevo y agenda el gran día.",
    steps: [
      { target: "finance-calculators", whyEn: "Work out what the move can cost you before you commit.", whyEs: "Calcula cuánto te puede costar la mudanza antes de comprometerte." },
      { target: "floor-plan", whyEn: "Check that your furniture actually fits the new rooms.", whyEs: "Comprueba que tus muebles realmente caben en las habitaciones nuevas." },
      { target: "timeline-composer", whyEn: "Put packing, truck and keys on one dated timeline.", whyEs: "Pon embalaje, camión y llaves en una sola línea de tiempo con fechas." },
    ],
  },
  {
    id: "host-a-dinner",
    emoji: "🍽️",
    titleEn: "Host a dinner",
    titleEs: "Organizar una cena",
    goalEn: "Cook for a group, seat everyone and send a nice invite.",
    goalEs: "Cocina para un grupo, ubica a todos y envía una buena invitación.",
    steps: [
      { target: "kit-recipe-assembly", whyEn: "Scale your recipe to the number of guests.", whyEs: "Ajusta tu receta al número de invitados." },
      { target: "seating-chart", whyEn: "Decide who sits where so the evening flows.", whyEs: "Decide quién se sienta dónde para que la noche fluya." },
      { target: "timeline-composer", whyEn: "Plan the evening from first guest to dessert.", whyEs: "Planifica la noche desde el primer invitado hasta el postre." },
      { target: "quote-card-maker", whyEn: "Turn the invite line into a shareable card.", whyEs: "Convierte la frase de la invitación en una tarjeta para compartir." },
    ],
  },
  {
    id: "get-debt-free",
    emoji: "🧾",
    titleEn: "Get debt-free",
    titleEs: "Salir de deudas",
    goalEn: "Understand the numbers, pick an order and see your finish line.",
    goalEs: "Entiende los números, elige un orden y mira tu meta.",
    steps: [
      { target: "finance-calculators", whyEn: "Get the interest and payment figures for each debt.", whyEs: "Obtén los intereses y pagos de cada deuda." },
      { target: "debt-snowball", whyEn: "Order your debts and see the date you become debt-free.", whyEs: "Ordena tus deudas y mira la fecha en que quedas libre." },
      { target: "timeline-composer", whyEn: "Draw the milestones so progress feels real.", whyEs: "Dibuja los hitos para que el avance se sienta real." },
    ],
  },
  {
    id: "brain-warmup",
    emoji: "🧠",
    titleEn: "Study session reset",
    titleEs: "Reinicio de estudio",
    goalEn: "Three short brain games to refocus before you study.",
    goalEs: "Tres juegos cortos para enfocarte antes de estudiar.",
    steps: [
      { target: "game-simon-sequence-memory", whyEn: "Wake up working memory with growing sequences.", whyEs: "Despierta la memoria de trabajo con secuencias crecientes." },
      { target: "game-memory-match-classic", whyEn: "Train quick recall by matching pairs.", whyEs: "Entrena la memoria rápida emparejando cartas." },
      { target: "game-sudoku-classic", whyEn: "Finish with calm, focused logic.", whyEs: "Termina con lógica tranquila y concentrada." },
    ],
  },
  {
    id: "science-night",
    emoji: "🔬",
    titleEn: "Science night",
    titleEs: "Noche de ciencia",
    goalEn: "Experiment, simulate and build a molecule in one evening.",
    goalEs: "Experimenta, simula y construye una molécula en una noche.",
    steps: [
      { target: "kit-science-experiment", whyEn: "Set up a guided experiment and record what you see.", whyEs: "Prepara un experimento guiado y anota lo que observas." },
      { target: "sim-sir-epidemic", whyEn: "See how an outbreak spreads when you change the rates.", whyEs: "Mira cómo se propaga un brote al cambiar las tasas." },
      { target: "sim-predator-prey-simulator", whyEn: "Watch populations rise and fall in cycles.", whyEs: "Observa poblaciones que suben y bajan en ciclos." },
      { target: "molecule-builder", whyEn: "Snap atoms together and read the formula.", whyEs: "Une átomos y lee la fórmula." },
    ],
  },
  {
    id: "brand-colors",
    emoji: "🎨",
    titleEn: "Pick your brand colors",
    titleEs: "Elige los colores de tu marca",
    goalEn: "Learn the theory, build a palette and use it on a share card.",
    goalEs: "Aprende la teoría, arma una paleta y úsala en una tarjeta.",
    steps: [
      { target: "color-harmony", whyEn: "Walk through colour theory and build a palette.", whyEs: "Recorre la teoría del color y arma una paleta." },
      { target: "quote-card-maker", whyEn: "Try the palette on a real shareable image.", whyEs: "Prueba la paleta en una imagen real para compartir." },
    ],
  },
  {
    id: "build-and-launch",
    emoji: "✈️",
    titleEn: "Build and launch",
    titleEs: "Construir y lanzar",
    goalEn: "Fold a plane, understand the physics, then chase chaos.",
    goalEs: "Dobla un avión, entiende la física y luego persigue el caos.",
    steps: [
      { target: "kit-paper-airplane", whyEn: "Pick a fold, build it and test the flight.", whyEs: "Elige un plegado, constrúyelo y prueba el vuelo." },
      { target: "sim-projectile-motion", whyEn: "See how angle and speed set range and peak height.", whyEs: "Mira cómo el ángulo y la velocidad fijan alcance y altura." },
      { target: "sim-double-pendulum", whyEn: "Finish with motion where tiny changes explode.", whyEs: "Termina con un movimiento donde cambios mínimos se disparan." },
    ],
  },
  {
    id: "think-like-a-computer",
    emoji: "💡",
    titleEn: "Think like a computer",
    titleEs: "Piensa como una computadora",
    goalEn: "Wire logic, solve a switch puzzle, then deduce a board.",
    goalEs: "Conecta lógica, resuelve un puzzle de interruptores y deduce un tablero.",
    steps: [
      { target: "kit-logic-circuit", whyEn: "Wire gates and read the live truth table.", whyEs: "Conecta compuertas y lee la tabla de verdad en vivo." },
      { target: "game-lights-out", whyEn: "Apply the same toggle logic to a grid puzzle.", whyEs: "Aplica la misma lógica de interruptores a un puzzle de cuadrícula." },
      { target: "game-minesweeper-classic", whyEn: "Finish with pure deduction under pressure.", whyEs: "Termina con deducción pura bajo presión." },
    ],
  },
];
