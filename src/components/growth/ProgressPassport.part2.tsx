// Part 2 of 3 — split from ProgressPassport.tsx on 2026-11-04. Edit here; ProgressPassport.tsx re-exports.

export type Stamp = {
  id: string;
  label: { en: string; es: string };
  desc: { en: string; es: string };
};

export const STAMPS: Stamp[] = [
  {
    id: "science-volcano",
    label: { en: "Science Kit: Volcano", es: "Kit Ciencia: Volcán" },
    desc: { en: "Complete the volcano experiment theme", es: "Completa el tema de experimento volcán" },
  },
  {
    id: "memory-level-3",
    label: { en: "Memory Match L3", es: "Memoria L3" },
    desc: { en: "Reach level 3 in memory match", es: "Alcanza nivel 3 en memoria" },
  },
  {
    id: "binpack-high",
    label: { en: "Bin Pack 80%+", es: "Empaque 80%+" },
    desc: { en: "Achieve 80%+ utilization", es: "Logra 80%+ de utilización" },
  },
  {
    id: "adsense-score-80",
    label: { en: "AdSense 80+", es: "AdSense 80+" },
    desc: { en: "Score 80+ on compliance kit", es: "Puntaje 80+ en kit de cumplimiento" },
  },
  {
    id: "quote-share",
    label: { en: "Quote Card Shared", es: "Tarjeta Cita Compartida" },
    desc: { en: "Generate and share a quote card", es: "Genera y comparte una tarjeta de cita" },
  },
  {
    id: "streak-7",
    label: { en: "7-Day Streak", es: "Racha 7 días" },
    desc: { en: "Maintain a 7-day return streak", es: "Mantén racha de retorno de 7 días" },
  },
];
