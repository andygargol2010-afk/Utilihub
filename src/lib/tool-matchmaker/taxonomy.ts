export type Locale = "en" | "es";
export type Goal = "play" | "learn" | "create" | "plan";
export type Time = "quick" | "medium" | "long";
export type Output = "score" | "insight" | "creation" | "answer";

export type Choice<T extends string> = {
  id: T;
  emoji: string;
  en: { label: string; hint: string };
  es: { label: string; hint: string };
};

export const GOALS: Choice<Goal>[] = [
  { id: "play", emoji: "🎮", en: { label: "Have fun", hint: "A challenge or a game to beat" }, es: { label: "Divertirme", hint: "Un reto o un juego que superar" } },
  { id: "learn", emoji: "🔬", en: { label: "Learn something", hint: "Understand how something works" }, es: { label: "Aprender algo", hint: "Entender cómo funciona algo" } },
  { id: "create", emoji: "🧩", en: { label: "Make something", hint: "Build, assemble or design" }, es: { label: "Crear algo", hint: "Construir, armar o diseñar" } },
  { id: "plan", emoji: "🧭", en: { label: "Plan or organize", hint: "Sort out money, space or time" }, es: { label: "Planificar u organizar", hint: "Ordenar dinero, espacio o tiempo" } },
];

export const TIMES: Choice<Time>[] = [
  { id: "quick", emoji: "⚡", en: { label: "Under 5 minutes", hint: "A quick break" }, es: { label: "Menos de 5 minutos", hint: "Un descanso rápido" } },
  { id: "medium", emoji: "⏱️", en: { label: "5 to 15 minutes", hint: "A proper session" }, es: { label: "De 5 a 15 minutos", hint: "Una sesión completa" } },
  { id: "long", emoji: "🌙", en: { label: "15 minutes or more", hint: "Settle in and explore" }, es: { label: "15 minutos o más", hint: "Ponerme cómodo y explorar" } },
];

export const OUTPUTS: Choice<Output>[] = [
  { id: "score", emoji: "🏆", en: { label: "A score to beat", hint: "Win, lose, improve" }, es: { label: "Un puntaje que superar", hint: "Ganar, perder, mejorar" } },
  { id: "insight", emoji: "💡", en: { label: "An aha moment", hint: "See why it behaves that way" }, es: { label: "Un momento de claridad", hint: "Ver por qué se comporta así" } },
  { id: "creation", emoji: "🎨", en: { label: "Something to share", hint: "An image, layout or design" }, es: { label: "Algo para compartir", hint: "Una imagen, plano o diseño" } },
  { id: "answer", emoji: "✅", en: { label: "A clear answer", hint: "A number or a plan I can use" }, es: { label: "Una respuesta clara", hint: "Un número o plan que pueda usar" } },
];

export const STEP_TITLES = {
  en: ["What do you feel like doing?", "How much time do you have?", "What do you want to walk away with?"],
  es: ["¿Qué tienes ganas de hacer?", "¿Cuánto tiempo tienes?", "¿Qué quieres llevarte?"],
} as const;

export const VALID: { g: Goal[]; t: Time[]; o: Output[] } = {
  g: GOALS.map((c) => c.id),
  t: TIMES.map((c) => c.id),
  o: OUTPUTS.map((c) => c.id),
};
