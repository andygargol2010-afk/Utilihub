// Part 2 of 3 — split from AuraCardComposer.tsx on 2026-11-04. Edit here; AuraCardComposer.tsx re-exports.

export type ColorScheme = "aurora" | "neon" | "sunset" | "cosmic" | "ocean" | "magma";

export const SCHEMES: Record<ColorScheme, string[]> = {
  aurora: ["#00ffcc", "#66ffcc", "#00ccff", "#99ffee", "#33aaff"],
  neon: ["#ff00ff", "#00ffff", "#ff073a", "#39ff14", "#bc13fe"],
  sunset: ["#ff6b35", "#f7c59f", "#ef476f", "#ffd166", "#06d6a0"],
  cosmic: ["#9d4edd", "#c77dff", "#e0aaff", "#7b2cbf", "#5a189a"],
  ocean: ["#0077be", "#00a8e8", "#00c9ff", "#48cae4", "#90e0ef"],
  magma: ["#ff4500", "#ff6b35", "#f7b801", "#ff8c42", "#d00000"],
};

export const RANDOM_QUOTES_EN = [
  "My personal aura",
  "Radiate your light",
  "Stay curious",
  "Create joy",
  "Glow on",
  "Breathe magic",
  "Own your vibe",
  "Shine bright",
  "Feel the energy",
];

export const RANDOM_QUOTES_ES = [
  "Mi aura personal",
  "Irradiá tu luz",
  "Mantené la curiosidad",
  "Creá alegría",
  "Seguí brillando",
  "Respirá magia",
  "Apropiate de tu vibra",
  "Brillá fuerte",
  "Sentí la energía",
];

export const RANDOM_QUOTES_PT = [
  "Minha aura pessoal",
  "Irradie sua luz",
  "Mantenha a curiosidade",
  "Crie alegria",
  "Continue brilhando",
  "Respire magia",
  "Aproprie-se da sua vibração",
  "Brilhe forte",
  "Sinta a energia",
];

export function shortId(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  return Math.abs(h).toString(36).slice(0, 8);
}
