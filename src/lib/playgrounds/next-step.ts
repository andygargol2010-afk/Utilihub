import type { PlaygroundId } from "./registry";

export type NextStepEntry = {
  id: PlaygroundId;
  nameEn: string;
  nameEs: string;
  blurbEn: string;
  blurbEs: string;
  pathEn: string;
  pathEs: string;
  emoji: string;
};

export const NEXT_STEP_CATALOG: readonly NextStepEntry[] = [
  {
    id: "pixel-art-studio",
    nameEn: "Pixel Art Studio",
    nameEs: "Estudio de Pixel Art",
    blurbEn: "Draw pixel art with layers, undo, and export.",
    blurbEs: "Dibujá pixel art con capas, deshacer y exportar.",
    pathEn: "/pixel-art-studio",
    pathEs: "/es/pixel-art-studio",
    emoji: "🎨",
  },
  {
    id: "orbit-pulse-catcher",
    nameEn: "Orbit Pulse Catcher",
    nameEs: "Cazador de Pulsos Orbitales",
    blurbEn: "Catch pulses in orbit with timing and zones.",
    blurbEs: "Atrapá pulsos en órbita con timing y zonas.",
    pathEn: "/orbit-pulse-catcher",
    pathEs: "/es/orbit-pulse-catcher",
    emoji: "🚀",
  },
  {
    id: "fluid-ink-flow-playground",
    nameEn: "Fluid Ink Flow Playground",
    nameEs: "Playground Flujo de Tinta Fluida",
    blurbEn: "Draw freehand strokes that become viscous multi-color flowing ink with mixing, gravity and tension.",
    blurbEs: "Dibujá trazos a mano alzada que se convierten en tinta viscosa multicolor que fluye, con mezcla, gravedad y tensión.",
    pathEn: "/fluid-ink-flow-playground",
    pathEs: "/es/fluid-ink-flow-playground",
    emoji: "🖋️",
  },
] as const;
