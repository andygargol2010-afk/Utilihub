import type { Goal, Output, Time } from "./taxonomy";

export type TargetKind = "game" | "sim" | "static";

export type Target = {
  id: string;
  kind: TargetKind;
  /** game: GAMES slug; sim: SIMS slug; static: unused */
  slug?: string;
  /** static targets: real route per locale */
  pathEn?: string;
  pathEs?: string;
  nameEn?: string;
  nameEs?: string;
  goals: Goal[];
  times: Time[];
  outputs: Output[];
  reasonEn: string;
  reasonEs: string;
};

const g = (slug: string, goals: Goal[], times: Time[], outputs: Output[], reasonEn: string, reasonEs: string): Target => ({
  id: `game-${slug}`, kind: "game", slug, goals, times, outputs, reasonEn, reasonEs,
});
const s = (slug: string, goals: Goal[], times: Time[], outputs: Output[], reasonEn: string, reasonEs: string): Target => ({
  id: `sim-${slug}`, kind: "sim", slug, goals, times, outputs, reasonEn, reasonEs,
});
const x = (
  id: string, pathEn: string, pathEs: string, nameEn: string, nameEs: string,
  goals: Goal[], times: Time[], outputs: Output[], reasonEn: string, reasonEs: string,
): Target => ({ id, kind: "static", pathEn, pathEs, nameEn, nameEs, goals, times, outputs, reasonEn, reasonEs });

export const TARGETS: Target[] = [
  g("2048", ["play"], ["quick", "medium"], ["score"], "Easy to start, hard to put down: merge tiles for a high score.", "Fácil de empezar, difícil de soltar: une fichas para lograr un récord."),
  g("sudoku-classic", ["play", "learn"], ["medium", "long"], ["score"], "Calm logic puzzle with a timer and best times per level.", "Rompecabezas lógico y tranquilo, con cronómetro y mejores tiempos."),
  g("minesweeper-classic", ["play"], ["medium"], ["score"], "Classic deduction game: clear the board without a mine.", "Clásico de deducción: despeja el tablero sin pisar una mina."),
  g("memory-match-classic", ["play"], ["quick", "medium"], ["score"], "Flip pairs and beat your moves and time.", "Voltea pares y mejora tus movimientos y tu tiempo."),
  g("connect-four-classic", ["play"], ["quick", "medium"], ["score"], "Drop discs and line up four before the computer does.", "Suelta fichas y alinea cuatro antes que la computadora."),
  g("hangman-classic", ["play", "learn"], ["quick"], ["score"], "Guess the word letter by letter in a couple of minutes.", "Adivina la palabra letra a letra en un par de minutos."),
  g("lights-out", ["play"], ["quick", "medium"], ["score"], "Toggle the grid dark in as few moves as you can.", "Apaga toda la cuadrícula con la menor cantidad de movimientos."),
  g("simon-sequence-memory", ["play"], ["quick"], ["score"], "Repeat growing colour sequences to train your memory.", "Repite secuencias de colores cada vez más largas para entrenar la memoria."),
  s("sir-epidemic", ["learn"], ["medium"], ["insight"], "Change infection and recovery rates and watch an outbreak unfold.", "Cambia contagio y recuperación y mira cómo evoluciona un brote."),
  s("predator-prey-simulator", ["learn"], ["medium"], ["insight"], "See why predator and prey populations rise and fall in cycles.", "Descubre por qué depredadores y presas suben y bajan en ciclos."),
  s("double-pendulum", ["learn"], ["quick", "medium"], ["insight", "creation"], "A tiny change in start angle gives wildly different motion.", "Un cambio mínimo en el ángulo inicial produce movimientos muy distintos."),
  s("projectile-motion", ["learn"], ["quick", "medium"], ["insight", "answer"], "Tune angle and speed and read range and peak height.", "Ajusta ángulo y velocidad y lee alcance y altura máxima."),
  s("market-equilibrium", ["learn", "plan"], ["medium"], ["insight", "answer"], "Shift supply and demand curves to find the price that clears the market.", "Mueve las curvas de oferta y demanda para hallar el precio de equilibrio."),
  s("bin-packing", ["plan", "play"], ["medium"], ["insight", "score"], "Fit items into as few bins as possible and compare strategies.", "Acomoda objetos en la menor cantidad de cajas y compara estrategias."),
  x("kit-logic-circuit", "/kits/logic-circuit", "/es/kits/logic-circuit", "Logic Circuit Kit", "Kit de circuitos lógicos", ["learn", "create"], ["long"], ["insight", "creation"], "Wire logic gates and read the live truth table.", "Conecta compuertas lógicas y lee la tabla de verdad en vivo."),
  x("kit-recipe-assembly", "/kits/recipe-assembly", "/es/kits/ensamblaje-receta", "Recipe Assembly Kit", "Kit de ensamblaje de recetas", ["create", "plan"], ["medium"], ["creation", "answer"], "Build a recipe step by step and scale it to your servings.", "Arma una receta paso a paso y ajústala a tus porciones."),
  x("kit-science-experiment", "/kits/science-experiment", "/es/kits/experimento-ciencia", "Science Experiment Kit", "Kit de experimento científico", ["learn", "create"], ["long"], ["insight"], "Set up a guided experiment and record what you observe.", "Prepara un experimento guiado y registra lo que observas."),
  x("kit-paper-airplane", "/kits/paper-airplane-kit", "/es/kits/avion-papel-kit", "Paper Airplane Kit", "Kit de avión de papel", ["create", "play"], ["quick", "medium"], ["creation", "score"], "Pick a fold, build it and test the flight.", "Elige un plegado, constrúyelo y prueba el vuelo."),
  x("molecule-builder", "/molecule-builder-kit", "/es/constructor-moleculas", "Molecule Builder", "Constructor de moléculas", ["learn", "create"], ["medium"], ["creation", "insight"], "Snap atoms together and see the formula and molar mass.", "Une átomos y mira la fórmula y la masa molar."),
  x("daily-challenge", "/daily-challenge", "/es/reto-diario", "Daily Challenge", "Reto diario", ["play"], ["quick"], ["score"], "One new goal a day with a streak to protect.", "Un objetivo nuevo cada día y una racha que cuidar."),
  x("color-harmony", "/journeys/color-harmony", "/es/viajes/armonia-color", "Color Harmony Journey", "Viaje de armonía de color", ["create", "learn"], ["medium"], ["creation"], "Walk through colour theory and build a palette.", "Recorre la teoría del color y arma una paleta."),
  x("quote-card-maker", "/growth/quote-card-maker", "/es/crecimiento/creador-tarjetas-citas", "Quote Card Maker", "Creador de tarjetas de citas", ["create"], ["quick"], ["creation"], "Turn a line of text into a shareable image in a minute.", "Convierte una frase en una imagen para compartir en un minuto."),
  x("debt-snowball", "/playgrounds/debt-snowball", "/es/playgrounds/deuda-bola-nieve", "Debt Snowball Planner", "Planificador bola de nieve de deudas", ["plan"], ["medium"], ["answer", "insight"], "Order your debts and see the date you become debt-free.", "Ordena tus deudas y mira la fecha en que quedas libre."),
  x("seating-chart", "/playgrounds/seating-chart", "/es/playgrounds/plano-asientos", "Seating Chart", "Plano de asientos", ["plan", "create"], ["medium"], ["creation", "answer"], "Arrange guests at tables and export the layout.", "Acomoda invitados en mesas y exporta el plano."),
  x("floor-plan", "/playgrounds/floor-plan", "/es/playgrounds/plano-planta", "Floor Plan Sketcher", "Boceto de plano de planta", ["plan", "create"], ["long"], ["creation"], "Lay out rooms and furniture to scale.", "Distribuye habitaciones y muebles a escala."),
  x("timeline-composer", "/studio/timeline-composer", "/es/estudio/compositor-linea-tiempo", "Timeline Composer", "Compositor de línea de tiempo", ["plan", "create"], ["medium", "long"], ["creation"], "Place events on a timeline and share the picture.", "Coloca eventos en una línea de tiempo y comparte la imagen."),
  x("finance-calculators", "/finance", "/es/finanzas", "Finance Calculators", "Calculadoras financieras", ["plan"], ["quick"], ["answer"], "Get a number fast: loans, savings, interest and more.", "Obtén un número rápido: préstamos, ahorro, interés y más."),
];
