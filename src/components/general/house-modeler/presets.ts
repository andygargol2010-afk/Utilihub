import type { SavedPart } from "./autosave";

export type Preset = { id: string; en: string; es: string; parts: SavedPart[] };

const Q = Math.PI / 2;
const p = (k: string, x: number, z: number, r = 0, f?: string): SavedPart => ({ k, x, z, r, ...(f ? { f } : {}) });

/** Ready-made layouts on the 3 m module (walls/floors/roofs are 3 m cells). Positions are on the 0.5 m grid. */
export const PRESETS: Preset[] = [
  {
    id: "cabin",
    en: "Small cabin",
    es: "Cabaña pequeña",
    parts: [
      p("foundation", -1.5, 0), p("foundation", 1.5, 0),
      p("floor", -1.5, 0), p("floor", 1.5, 0),
      p("wall", -1.5, 1.5), p("wall", -1.5, -1.5), p("wall", 1.5, -1.5),
      p("wall", -3, 0, Q), p("wall", 3, 0, Q),
      p("door", 1.5, 1.5),
      p("window", -1.5, 1.5), p("window", 0, -1.5), p("window", 3, 0, Q),
      p("roof", -1.5, 0), p("roof", 1.5, 0),
      p("chimney", -2.5, -0.5),
      p("stairs", 1.5, 2.5, Math.PI),
    ],
  },
  {
    id: "twoRoom",
    en: "Two-room house",
    es: "Casa de dos habitaciones",
    parts: [
      p("floor", -3, 0), p("floor", 0, 0), p("floor", 3, 0),
      p("wall", -3, 1.5), p("wall", 0, 1.5), p("wall", 3, 1.5),
      p("wall", -3, -1.5), p("wall", 0, -1.5), p("wall", 3, -1.5),
      p("wall", -4.5, 0, Q), p("wall", 4.5, 0, Q), p("wall", 1.5, 0, Q),
      p("door", 0, 1.5), p("window", -3, 1.5), p("window", 3, 1.5),
      p("window", -3, -1.5), p("window", 3, -1.5), p("door", 1.5, 0, Q),
      p("roof", -3, 0), p("roof", 0, 0), p("roof", 3, 0),
      p("path", 0, 3.5), p("path", 0, 5.5),
      p("planter", -2, 2.5), p("planter", 2, 2.5), p("lamp", 1.5, 3.5),
    ],
  },
  {
    id: "shed",
    en: "Garden shed",
    es: "Cobertizo de jardín",
    parts: [
      p("foundation", 0, 0), p("floor", 0, 0, 0, "timber"),
      p("wall", 0, 1.5, 0, "timber"), p("wall", 0, -1.5, 0, "timber"),
      p("wall", -1.5, 0, Q, "timber"), p("wall", 1.5, 0, Q, "timber"),
      p("door", 0, 1.5), p("window", 1.5, 0, Q),
      p("roof", 0, 0, 0, "metal"),
      p("bench", -3, 1.5, 0), p("planter", 3, 1.5), p("fence", -4, -2, Q), p("fence", 4, -2, Q),
    ],
  },
];
