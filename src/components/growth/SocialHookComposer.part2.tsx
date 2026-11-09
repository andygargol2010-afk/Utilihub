// Part 2 of 3 — split from SocialHookComposer.tsx on 2026-11-04. Edit here; SocialHookComposer.tsx re-exports.

export type Blank = {
  key: string;
  label: { en: string; es: string };
  placeholder: { en: string; es: string };
};

export type Pattern = {
  id: string;
  name: { en: string; es: string };
  template: { en: string; es: string };
  blanks: Blank[];
  hashtags: string[];
  accent: string;
  example: Record<string, string>;
};

export const PATTERNS: Pattern[] = [
  {
    id: "question",
    name: { en: "Question Hook", es: "Gancho de Pregunta" },
    template: { en: "What if {topic} could {benefit} without {pain}?", es: "¿Y si {topic} pudiera {benefit} sin {pain}?" },
    blanks: [
      { key: "topic", label: { en: "Topic", es: "Tema" }, placeholder: { en: "your product", es: "tu producto" } },
      { key: "benefit", label: { en: "Benefit", es: "Beneficio" }, placeholder: { en: "save hours", es: "ahorrar horas" } },
      { key: "pain", label: { en: "Pain", es: "Dolor" }, placeholder: { en: "the usual hassle", es: "el lío habitual" } },
    ],
    hashtags: ["#productivity", "#tips", "#growth"],
    accent: "#ec4899",
    example: { topic: "a simple template", benefit: "write hooks that stop the scroll", pain: "staring at a blank page" },
  },
  {
    id: "story",
    name: { en: "Story Hook", es: "Gancho de Historia" },
    template: { en: "I used to struggle with {problem} until I discovered {solution} that {result}.", es: "Solía luchar con {problem} hasta que descubrí {solution} que {result}." },
    blanks: [
      { key: "problem", label: { en: "Problem", es: "Problema" }, placeholder: { en: "messy notes", es: "notas desordenadas" } },
      { key: "solution", label: { en: "Solution", es: "Solución" }, placeholder: { en: "this simple method", es: "este método simple" } },
      { key: "result", label: { en: "Result", es: "Resultado" }, placeholder: { en: "changed everything", es: "lo cambió todo" } },
    ],
    hashtags: ["#story", "#motivation", "#personal"],
    accent: "#8b5cf6",
    example: { problem: "posting without a clear hook", solution: "this fill-in pattern", result: "doubled my saves in a week" },
  },
  {
    id: "list",
    name: { en: "List Hook", es: "Gancho de Lista" },
    template: { en: "{number} ways to {goal} with {topic} that most people ignore.", es: "{number} formas de {goal} con {topic} que la mayoría ignora." },
    blanks: [
      { key: "number", label: { en: "Number", es: "Número" }, placeholder: { en: "5", es: "5" } },
      { key: "goal", label: { en: "Goal", es: "Objetivo" }, placeholder: { en: "grow your audience", es: "crecer tu audiencia" } },
      { key: "topic", label: { en: "Topic", es: "Tema" }, placeholder: { en: "short videos", es: "videos cortos" } },
    ],
    hashtags: ["#listicle", "#tips", "#howto"],
    accent: "#06b6d4",
    example: { number: "7", goal: "get more replies", topic: "your first line" },
  },
  {
    id: "myth",
    name: { en: "Myth-bust Hook", es: "Gancho Desmitificador" },
    template: { en: "The myth about {topic} is {myth}. The truth is {truth}.", es: "El mito sobre {topic} es {myth}. La verdad es {truth}." },
    blanks: [
      { key: "topic", label: { en: "Topic", es: "Tema" }, placeholder: { en: "morning routines", es: "rutinas matutinas" } },
      { key: "myth", label: { en: "Myth", es: "Mito" }, placeholder: { en: "you need 2 hours", es: "necesitas 2 horas" } },
      { key: "truth", label: { en: "Truth", es: "Verdad" }, placeholder: { en: "10 minutes works", es: "10 minutos funcionan" } },
    ],
    hashtags: ["#mythbust", "#truth", "#facts"],
    accent: "#f59e0b",
    example: { topic: "viral posts", myth: "they need perfect visuals", truth: "the hook does 80% of the work" },
  },
  {
    id: "howto",
    name: { en: "How-to Hook", es: "Gancho Cómo-hacer" },
    template: { en: "How to {result} in {time} using {method}.", es: "Cómo {result} en {time} usando {method}." },
    blanks: [
      { key: "result", label: { en: "Result", es: "Resultado" }, placeholder: { en: "write better hooks", es: "escribir mejores ganchos" } },
      { key: "time", label: { en: "Timeframe", es: "Plazo" }, placeholder: { en: "10 minutes", es: "10 minutos" } },
      { key: "method", label: { en: "Method", es: "Método" }, placeholder: { en: "this template", es: "esta plantilla" } },
    ],
    hashtags: ["#howto", "#tutorial", "#quicktip"],
    accent: "#10b981",
    example: { result: "stop the scroll", time: "under 60 seconds", method: "one proven pattern" },
  },
  {
    id: "curiosity",
    name: { en: "Curiosity Gap", es: "Brecha de Curiosidad" },
    template: { en: "Most people miss this about {topic}: {insight}. Here's why it matters.", es: "La mayoría se pierde esto sobre {topic}: {insight}. Aquí por qué importa." },
    blanks: [
      { key: "topic", label: { en: "Topic", es: "Tema" }, placeholder: { en: "writing hooks", es: "escribir ganchos" } },
      { key: "insight", label: { en: "Insight", es: "Insight" }, placeholder: { en: "the first line decides the rest", es: "la primera línea decide el resto" } },
    ],
    hashtags: ["#curiosity", "#insight", "#growth"],
    accent: "#f43f5e",
    example: { topic: "engagement", insight: "the first 8 words decide if anyone reads the rest" },
  },
  {
    id: "statistic",
    name: { en: "Statistic Hook", es: "Gancho con Estadística" },
    template: { en: "{stat}% of people {action} but only {few} actually {outcome}.", es: "{stat}% de las personas {action} pero solo {few} realmente {outcome}." },
    blanks: [
      { key: "stat", label: { en: "Stat", es: "Estadística" }, placeholder: { en: "80", es: "80" } },
      { key: "action", label: { en: "Action", es: "Acción" }, placeholder: { en: "post regularly", es: "publican con regularidad" } },
      { key: "few", label: { en: "Few", es: "Pocos" }, placeholder: { en: "a handful", es: "unos pocos" } },
      { key: "outcome", label: { en: "Outcome", es: "Resultado" }, placeholder: { en: "get real engagement", es: "logran engagement real" } },
    ],
    hashtags: ["#stats", "#data", "#growth"],
    accent: "#3b82f6",
    example: { stat: "73", action: "post every day", few: "less than 10%", outcome: "see consistent growth" },
  },
  {
    id: "contrarian",
    name: { en: "Contrarian Hook", es: "Gancho Contrario" },
    template: { en: "Stop {common}. Start {alternative} instead. Here's why.", es: "Deja de {common}. Empieza a {alternative} en su lugar. Aquí por qué." },
    blanks: [
      { key: "common", label: { en: "Common", es: "Común" }, placeholder: { en: "posting every day", es: "publicar todos los días" } },
      { key: "alternative", label: { en: "Alternative", es: "Alternativa" }, placeholder: { en: "posting with intention", es: "publicar con intención" } },
    ],
    hashtags: ["#contrarian", "#truth", "#strategy"],
    accent: "#ef4444",
    example: { common: "chasing viral trends", alternative: "writing one clear hook that solves a real problem" },
  },
  {
    id: "beforeafter",
    name: { en: "Before / After", es: "Antes / Después" },
    template: { en: "Before: {before}. After: {after}. The only change was {change}.", es: "Antes: {before}. Después: {after}. El único cambio fue {change}." },
    blanks: [
      { key: "before", label: { en: "Before", es: "Antes" }, placeholder: { en: "crickets on every post", es: "silencio en cada post" } },
      { key: "after", label: { en: "After", es: "Después" }, placeholder: { en: "saves and replies daily", es: "guardados y respuestas a diario" } },
      { key: "change", label: { en: "Change", es: "Cambio" }, placeholder: { en: "rewriting the first line", es: "reescribir la primera línea" } },
    ],
    hashtags: ["#beforeandafter", "#results", "#growth"],
    accent: "#a855f7",
    example: { before: "0 comments on most posts", after: "people quoting my first line", change: "using a specific hook pattern" },
  },
];

export const PLATFORMS = {
  x: { limit: 280, name: { en: "X / Twitter", es: "X / Twitter" } },
  linkedin: { limit: 1300, name: { en: "LinkedIn", es: "LinkedIn" } },
  instagram: { limit: 2200, name: { en: "Instagram", es: "Instagram" } },
} as const;

export type PlatformId = keyof typeof PLATFORMS;

export function interpolate(template: string, blanks: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => blanks[key]?.trim() || `{${key}}`);
}
