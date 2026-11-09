// Part 1 of 3 — split from PixelArtStudio.parts.ts on 2026-11-04. Edit here; PixelArtStudio.parts.ts re-exports.

// PixelArtStudio helpers — split from PixelArtStudio.tsx on 2026-11-03 (part 2 of 2).
export type Locale = "en" | "es";
export type ToolId = "pencil" | "eraser" | "eyedropper" | "fill" | "line" | "rect" | "circle";
export type Symmetry = "none" | "x" | "y" | "xy";

export const SIZES = [8, 16, 32, 64, 128, 256] as const;
export const MAX_LAYERS = 4;
export const STORAGE_KEY = "utilihub-pixelihub-v1";
/* onboarding-v1 */
export const ONBOARD_KEY = "utilihub-pixelihub-onboard-v1";
/* palettes-v1 */
export const PALETTE_PRESETS: { id: string; labelEn: string; labelEs: string; colors: string[] }[] = [
  {
    id: "default",
    labelEn: "Default",
    labelEs: "Default",
    colors: [
      "#000000", "#1a1a2e", "#16213e", "#0f3460", "#e94560", "#ff6b6b", "#feca57", "#ff9ff3",
      "#54a0ff", "#5f27cd", "#01a3a4", "#10ac84", "#ffffff", "#c8d6e5", "#8395a7", "#576574",
      "#222f3e", "#ee5a24", "#f79f1f", "#a3cb38", "#1289a7", "#d980fa", "#bdc3c7", "#6c5ce7",
    ],
  },
  {
    id: "pico",
    labelEn: "Retro 16",
    labelEs: "Retro 16",
    colors: [
      "#000000", "#1d2b53", "#7e2553", "#008751", "#ab5236", "#5f574f", "#c2c3c7", "#fff1e8",
      "#ff004d", "#ffa300", "#ffec27", "#00e436", "#29adff", "#83769c", "#ff77a8", "#ffccaa",
    ],
  },
  {
    id: "earth",
    labelEn: "Earth",
    labelEs: "Tierra",
    colors: [
      "#1a120b", "#3d2914", "#6b4226", "#a67c52", "#d4a574", "#f5e6d3", "#2d4a22", "#4a7c3f",
      "#8fbc8f", "#c4e0c4", "#4a3728", "#8b6914", "#c9a227", "#5c4033", "#ffffff", "#000000",
    ],
  },
  {
    id: "pastel",
    labelEn: "Pastel",
    labelEs: "Pastel",
    colors: [
      "#f8f1f1", "#ffe5ec", "#ffc2d1", "#ffb3c6", "#ff8fab", "#fb6f92", "#e0aaff", "#c77dff",
      "#9b5de5", "#a0c4ff", "#bdb2ff", "#caffbf", "#fdffb6", "#ffd6a5", "#ffadad", "#2b2d42",
    ],
  },
  {
    id: "mono",
    labelEn: "Mono",
    labelEs: "Mono",
    colors: [
      "#000000", "#111111", "#222222", "#333333", "#555555", "#777777", "#999999", "#bbbbbb",
      "#dddddd", "#ffffff", "#1a1a1a", "#2e2e2e", "#424242", "#616161", "#9e9e9e", "#e0e0e0",
    ],
  },
  {
    id: "neon",
    labelEn: "Neon",
    labelEs: "Neón",
    colors: [
      "#0d0d0d", "#1a0033", "#ff00ff", "#00ffff", "#39ff14", "#ff073a", "#fff01f", "#ff6ec7",
      "#7df9ff", "#b6ff00", "#fe019a", "#0ff0fc", "#ccff00", "#ff3131", "#ffffff", "#222222",
    ],
  },
];

export function emptyLayer(n: number) { return Array(n * n).fill("") as string[]; }
