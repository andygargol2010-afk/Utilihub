import type { CharId, InputFrame, MapId } from "./types";

/** Logical frame presented with nearest-neighbour upscaling. */
export const VIEW_W = 384;
export const VIEW_H = 216;
/** Scrolling stage width; the camera follows the midpoint between the fighters. */
export const STAGE_W = 640;
/** Screen y (from the top of the view) of the line the fighters stand on. */
export const GROUND_Y = 186;
/** Screen y where the floor strip begins. */
export const FLOOR_TOP = 172;
/** Fighters cannot leave [STAGE_MARGIN, STAGE_W - STAGE_MARGIN]. */
export const STAGE_MARGIN = 20;

export const TICK_RATE = 60;
export const ROUND_SECONDS = 60;

/** Signature finisher timeline, in frames since the "finisher" phase began. */
export const FINISHER = {
  /** Wind-up: backdrop darkens, winner takes the stance. */
  windup: 50,
  /** Frames of the flurry hits (finisherHit events, final = false). */
  hits: [56, 72, 88] as readonly number[],
  /** Frame of the final blow (finisherHit with final = true; the loser is sent flying). */
  final: 124,
  /** Total length; then the phase becomes "matchEnd". */
  total: 215,
} as const;

export const CHAR_IDS: readonly CharId[] = ["asagiri", "yoikaze", "grimvald", "maelis", "bazalt", "oriel"];
export const MAP_IDS: readonly MapId[] = ["quay", "frost"];

/** Display names (never translated). */
export const CHAR_NAMES: Record<CharId, string> = {
  asagiri: "ASAGIRI",
  yoikaze: "YOIKAZE",
  grimvald: "GRIMVALD",
  maelis: "MAELIS",
  bazalt: "BAZALT",
  oriel: "ORIEL",
};

export function neutralInput(): InputFrame {
  return {
    left: false,
    right: false,
    up: false,
    light: false,
    medium: false,
    heavy: false,
    block: false,
    dodge: false,
  };
}
