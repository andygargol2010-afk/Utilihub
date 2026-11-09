// Part 2 of 3 — split from QuoteCardMaker.tsx on 2026-11-04. Edit here; QuoteCardMaker.tsx re-exports.

export type StyleId = "minimal" | "bold" | "accent";

export const STYLES: { id: StyleId; name: { en: string; es: string } }[] = [
  { id: "minimal", name: { en: "Minimal", es: "Minimal" } },
  { id: "bold", name: { en: "Bold", es: "Negrita" } },
  { id: "accent", name: { en: "Accent", es: "Acento" } },
];

export const BACKGROUNDS = [
  { id: "slate", label: { en: "Slate", es: "Pizarra" }, css: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", solid: "#0f172a" },
  { id: "indigo", label: { en: "Indigo", es: "Índigo" }, css: "linear-gradient(135deg, #312e81 0%, #4c1d95 100%)", solid: "#312e81" },
  { id: "rose", label: { en: "Rose", es: "Rosa" }, css: "linear-gradient(135deg, #881337 0%, #9f1239 100%)", solid: "#881337" },
  { id: "emerald", label: { en: "Emerald", es: "Esmeralda" }, css: "linear-gradient(135deg, #064e3b 0%, #065f46 100%)", solid: "#064e3b" },
  { id: "amber", label: { en: "Amber", es: "Ámbar" }, css: "linear-gradient(135deg, #78350f 0%, #92400e 100%)", solid: "#78350f" },
  { id: "white", label: { en: "White", es: "Blanco" }, css: "#ffffff", solid: "#ffffff" },
] as const;

export type BgId = (typeof BACKGROUNDS)[number]["id"];

export const EXAMPLES = [
  {
    q: { en: "The only way to do great work is to love what you do.", es: "La única forma de hacer un gran trabajo es amar lo que haces." },
    a: { en: "Steve Jobs", es: "Steve Jobs" },
  },
  {
    q: { en: "Be yourself; everyone else is already taken.", es: "Sé tú mismo; todos los demás ya están ocupados." },
    a: { en: "Oscar Wilde", es: "Oscar Wilde" },
  },
  {
    q: { en: "In the middle of difficulty lies opportunity.", es: "En medio de la dificultad yace la oportunidad." },
    a: { en: "Albert Einstein", es: "Albert Einstein" },
  },
  {
    q: { en: "Life is what happens when you're busy making other plans.", es: "La vida es lo que pasa mientras estás ocupado haciendo otros planes." },
    a: { en: "John Lennon", es: "John Lennon" },
  },
  {
    q: { en: "The future belongs to those who believe in the beauty of their dreams.", es: "El futuro pertenece a quienes creen en la belleza de sus sueños." },
    a: { en: "Eleanor Roosevelt", es: "Eleanor Roosevelt" },
  },
];
