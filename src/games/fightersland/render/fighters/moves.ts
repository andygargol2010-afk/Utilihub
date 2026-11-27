/**
 * Hand-authored key poses for the six fighters. Every delta is applied on top of the
 * character's own idle stance (its arm set, weapon grip and leg spread).
 *
 * Airborne deltas (ground: false) give rootY relative to the standing pelvis height, so 0 puts
 * the feet roughly on the sprite origin; the simulation's `y` lifts the whole sprite.
 */
import type { CharId, MoveId } from "../../core/types";
import type { Tint } from "./raster";
import { pose } from "./rig";
import type { Pose, PoseDelta, SmearSrc } from "./rig";

export type ArmSet = "guard" | "hurt" | "hurt2" | "gut" | "flail" | "down" | "stagger";

export interface MoveDef {
  /** anticipation keys (spread over the startup phase) */
  startup: readonly PoseDelta[];
  /** held wind-up keys while charging (looped, trembling) */
  charge: readonly PoseDelta[];
  /** strike keys: the first carries the full smear, the second its fading tail */
  active: readonly PoseDelta[];
  /** follow-through keys back towards the stance */
  recovery: readonly PoseDelta[];
  sm: readonly SmearSrc[];
}

export interface FinKey {
  /** frame (since the finisher phase began) this key starts */
  at: number;
  d: PoseDelta;
  /** smear sources; swept from the key that starts at `from` */
  sm?: readonly SmearSrc[];
  from?: number;
  tint?: Tint;
}

export interface CharAnim {
  idle: Pose;
  /** inhale delta for the breathing loop */
  breathe: PoseDelta;
  arms: Readonly<Record<ArmSet, PoseDelta>>;
  moves: Readonly<Record<MoveId, MoveDef>>;
  intro: readonly PoseDelta[];
  /** first key = flourish, the last two loop */
  win: readonly PoseDelta[];
  finisher: readonly FinKey[];
}

/** Shared template poses for reactions / movement (legs + spine); arms come from the arm sets. */
export const TPL: Readonly<Record<string, PoseDelta & { arms?: ArmSet }>> = {
  guard: { lean: -6, bend: 8, legF: [-22, -34], legB: [26, -2], arms: "guard" },
  guardHit: { lean: -14, bend: 10, rootX: -3, legF: [-28, -40], legB: [18, -6], arms: "guard" },
  hitL: { lean: -14, bend: -8, rootX: -3, head: -2, face: 1, legF: [-20, -32], legB: [20, -8], arms: "hurt" },
  hitL2: { lean: -6, bend: -2, rootX: -2, face: 0, legF: [-18, -32], legB: [24, -6], arms: "hurt" },
  hitH: { lean: -30, bend: -12, rootX: -7, head: -3, face: 1, legF: [-34, -44], legB: [4, -22], arms: "hurt2" },
  hitH2: { lean: -18, bend: -6, rootX: -5, head: -2, face: 1, legF: [-28, -40], legB: [12, -14], arms: "hurt" },
  hitGut: { lean: 30, bend: 22, rootX: -4, head: 2, face: 1, legF: [-18, -34], legB: [30, -6], arms: "gut" },
  hitGut2: { lean: 18, bend: 12, rootX: -3, head: 1, face: 0, legF: [-18, -34], legB: [28, -6], arms: "gut" },
  stagger1: { lean: -24, bend: -14, rootX: -4, head: -3, face: 1, legF: [-30, -40], legB: [10, -16], arms: "stagger" },
  stagger2: { lean: -16, bend: -8, rootX: -3, head: 2, face: 1, legF: [-24, -36], legB: [16, -12], arms: "stagger" },
  launch: { ground: false, rootY: 4, rot: -40, lean: -8, bend: -10, face: 1, legF: [40, 10], legB: [70, 30], arms: "flail" },
  tumble: { ground: false, rootY: 2, rot: -90, lean: 0, bend: 16, face: 1, legF: [60, -20], legB: [90, 10], arms: "flail" },
  tumble2: { ground: false, rootY: 0, rot: -112.5, lean: 0, bend: 10, face: 1, legF: [40, 10], legB: [70, 40], arms: "flail" },
  bounce: { ground: true, rot: -80, lean: 0, bend: 10, face: 1, legF: [30, 0], legB: [50, 50], arms: "flail" },
  down: { rot: -90, lean: 0, bend: 0, face: 1, legF: [8, -6], legB: [26, 40], arms: "down" },
  getUp1: { rot: -45, lean: 20, bend: 20, legF: [40, -60], legB: [80, 0], arms: "down" },
  getUp2: { lean: 34, bend: 16, legF: [-8, -96], legB: [84, -4], arms: "gut" },
  getUp3: { lean: 16, bend: 8, legF: [-20, -40], legB: [40, -6], arms: "gut" },
  jumpUp: { ground: false, rootY: 4, sy: 1.08, lean: 6, legF: [-10, -30], legB: [40, -10] },
  jumpPeak: { ground: false, rootY: 8, lean: 4, legF: [30, -70], legB: [70, -30] },
  jumpFall: { ground: false, rootY: 2, lean: 0, legF: [-18, -34], legB: [36, 6] },
  land: { sy: 0.86, lean: 18, bend: 10, legF: [30, -58], legB: [66, -22] },
  dodge1: { sy: 0.9, lean: 16, bend: 8, rootX: 2, legF: [-10, -60], legB: [60, -16] },
  dodge2: { ground: false, rootY: 4, rootX: -6, lean: -22, bend: -6, legF: [-44, -16], legB: [-6, 30] },
  dodge3: { ground: false, rootY: 1, rootX: -4, lean: -10, bend: 0, legF: [-30, -50], legB: [40, -10] },
  dodge4: { sy: 0.9, lean: 14, bend: 8, legF: [24, -50], legB: [60, -16] },
  dizzy1: { lean: 12, bend: 14, head: 2, headRot: 0, face: 1, legF: [-10, -22], legB: [16, -4], arms: "down" },
  dizzy2: { lean: 4, bend: 10, rootX: -1, head: -2, face: 1, legF: [-14, -26], legB: [12, -2], arms: "down" },
  dizzy3: { lean: 14, bend: 16, rootX: 1, head: 3, face: 1, legF: [-6, -18], legB: [20, -6], arms: "down" },
  lose: { lean: 40, bend: 20, head: 3, face: 1, legF: [-6, -98], legB: [82, -8], arms: "down" },
  lose2: { lean: 44, bend: 22, head: 3, face: 1, sy: 0.97, legF: [-6, -98], legB: [82, -8], arms: "down" },
};

const air = (d: PoseDelta): PoseDelta => ({ ground: false, legF: [16, -54], legB: [62, -24], ...d });

// ---------------------------------------------------------------- ASAGIRI: thrust / overhead cut / rising draw
const ASAGIRI: CharAnim = {
  idle: pose({ lean: 6, bend: 4, armF: [28, 78], weapon: 122, grip2: true, legF: [-16, -34], legB: [30, -2], z: { armBFront: true } }),
  breathe: { sy: 0.95, armF: [26, 74], weapon: 119 },
  arms: {
    guard: { armF: [60, 150], weapon: 185, grip2: true, z: { armBFront: true } },
    hurt: { armF: [-10, 60], weapon: 150, grip2: false, armB: [-30, 30], z: { armBFront: false } },
    hurt2: { armF: [-40, 30], weapon: 120, grip2: false, armB: [-70, -10], z: { armBFront: false } },
    gut: { armF: [40, 110], weapon: 60, grip2: false, armB: [30, 120], z: { armBFront: false } },
    flail: { armF: [120, 150], weapon: 200, grip2: false, armB: [150, 170], z: { armBFront: false } },
    down: { armF: [10, 20], weapon: 60, grip2: false, armB: [-10, 10], z: { armBFront: false } },
    stagger: { armF: [150, 200], weapon: 235, grip2: false, armB: [-60, -20], z: { armBFront: false } },
  },
  moves: {
    light: {
      startup: [{ lean: 0, bend: 2, rootX: -2, armF: [0, 50], weapon: 96, legF: [-20, -38], legB: [30, -2] }],
      charge: [{ lean: -6, bend: 0, rootX: -4, armF: [-20, 40], weapon: 98, legF: [-30, -48], legB: [34, -4] }],
      active: [
        { lean: 20, bend: 8, rootX: 5, armF: [82, 92], weapon: 92, legF: [-34, -54], legB: [50, 4] },
        { lean: 18, bend: 8, rootX: 5, armF: [80, 90], weapon: 91, legF: [-34, -54], legB: [50, 4] },
      ],
      recovery: [
        { lean: 12, bend: 6, rootX: 3, armF: [52, 84], weapon: 104, legF: [-28, -46], legB: [42, 0] },
        { lean: 8, bend: 5, rootX: 1, armF: [36, 80], weapon: 115, legF: [-20, -38], legB: [34, -2] },
      ],
      sm: ["weapon"],
    },
    medium: {
      startup: [
        { lean: 0, bend: 0, armF: [90, 140], weapon: 170, legF: [-16, -34], legB: [30, -2] },
        { lean: -6, bend: -4, rootX: -1, armF: [150, 185], weapon: 212, legF: [-18, -34], legB: [30, -2] },
      ],
      charge: [{ lean: -10, bend: -6, rootX: -3, armF: [162, 200], weapon: 235, legF: [-28, -46], legB: [40, -4] }],
      active: [
        { lean: 26, bend: 12, rootX: 5, armF: [96, 72], weapon: 55, legF: [-34, -52], legB: [48, 2] },
        { lean: 28, bend: 12, rootX: 5, armF: [72, 52], weapon: 38, legF: [-34, -52], legB: [48, 2] },
      ],
      recovery: [
        { lean: 22, bend: 10, rootX: 4, armF: [52, 40], weapon: 36, legF: [-30, -48], legB: [44, 2] },
        { lean: 12, bend: 6, rootX: 2, armF: [36, 66], weapon: 90, legF: [-22, -40], legB: [36, 0] },
      ],
      sm: ["weapon"],
    },
    heavy: {
      startup: [
        { lean: 2, bend: 4, rootX: -1, armF: [0, 30], weapon: 20, legF: [-22, -40], legB: [34, -2] },
        { lean: -4, bend: 6, rootX: -3, armF: [-30, 10], weapon: -50, legF: [-32, -52], legB: [42, -6], z: { armBFront: false } },
      ],
      charge: [
        { lean: -8, bend: 10, rootX: -5, sy: 0.94, armF: [-40, 0], weapon: -70, legF: [-42, -62], legB: [48, -8], z: { armBFront: false } },
      ],
      active: [
        { lean: 30, bend: 10, rootX: 8, armF: [92, 98], weapon: 100, legF: [-52, -78], legB: [64, 12] },
        { lean: 32, bend: 10, rootX: 8, armF: [104, 116], weapon: 124, legF: [-52, -78], legB: [64, 12] },
      ],
      recovery: [
        { lean: 26, bend: 10, rootX: 7, armF: [100, 125], weapon: 142, legF: [-48, -72], legB: [60, 10] },
        { lean: 16, bend: 6, rootX: 4, armF: [60, 95], weapon: 130, legF: [-34, -52], legB: [46, 2] },
        { lean: 9, bend: 4, rootX: 1, armF: [34, 80], weapon: 122, legF: [-20, -38], legB: [34, -2] },
      ],
      sm: ["weapon"],
    },
    air: {
      startup: [air({ lean: -6, armF: [160, 190], weapon: 222 })],
      charge: [air({ lean: -6, armF: [160, 190], weapon: 222 })],
      active: [air({ lean: 24, armF: [84, 44], weapon: 42, legF: [10, -60], legB: [56, -12] }), air({ lean: 26, armF: [70, 34], weapon: 30, legF: [10, -60], legB: [56, -12] })],
      recovery: [{ lean: 22, bend: 10, sy: 0.88, armF: [60, 40], weapon: 40, legF: [30, -58], legB: [66, -22] }],
      sm: ["weapon"],
    },
  },
  intro: [
    { lean: 0, bend: 0, armF: [10, 100], weapon: -95, ext: -22, grip2: false, armB: [20, 90], legF: [-6, -10], legB: [12, 0], z: { armBFront: false } },
    { lean: 2, bend: 2, armF: [30, 110], weapon: -100, ext: -6, grip2: false, armB: [20, 90], legF: [-10, -16], legB: [18, 0], z: { armBFront: false } },
    { lean: 4, bend: 2, armF: [60, 130], weapon: 160, grip2: true, legF: [-14, -28], legB: [26, -2] },
    {},
  ],
  win: [
    { lean: -4, bend: -2, armF: [150, 175], weapon: 250, grip2: false, armB: [20, 40], legF: [-10, -14], legB: [16, 0], z: { armBFront: false } },
    { lean: 0, bend: 0, armF: [20, 60], weapon: 178, grip2: false, armB: [10, 30], legF: [-8, -12], legB: [14, 0], z: { armBFront: false } },
    { lean: 0, bend: 0, sy: 0.97, armF: [20, 58], weapon: 177, grip2: false, armB: [10, 28], legF: [-8, -12], legB: [14, 0], z: { armBFront: false } },
  ],
  finisher: [
    { at: 0, d: { lean: -4, bend: 6, rootX: -3, armF: [-30, 10], weapon: -50, legF: [-32, -52], legB: [42, -6], z: { armBFront: false } } },
    { at: 24, d: { lean: -8, bend: 10, rootX: -5, sy: 0.94, armF: [-40, 0], weapon: -70, legF: [-42, -62], legB: [48, -8], z: { armBFront: false } } },
    { at: 40, tint: 1, d: { lean: -8, bend: 10, rootX: -5, sy: 0.94, armF: [-40, 0], weapon: -70, legF: [-42, -62], legB: [48, -8], z: { armBFront: false } } },
    { at: 44, d: { lean: -8, bend: 10, rootX: -5, sy: 0.94, armF: [-40, 0], weapon: -70, legF: [-42, -62], legB: [48, -8], z: { armBFront: false } } },
    { at: 50, d: { lean: -6, bend: -4, rootX: -1, armF: [150, 185], weapon: 212 } },
    { at: 56, from: 50, sm: ["weapon"], d: { lean: 26, bend: 12, rootX: 5, armF: [96, 72], weapon: 55, legF: [-34, -52], legB: [48, 2] } },
    { at: 62, d: { lean: 22, bend: 10, rootX: 4, armF: [52, 40], weapon: 36, legF: [-30, -48], legB: [44, 2] } },
    { at: 67, d: { lean: -4, bend: 6, rootX: -3, armF: [-30, 10], weapon: -50, legF: [-32, -52], legB: [42, -6], z: { armBFront: false } } },
    { at: 72, from: 67, sm: ["weapon"], d: { lean: 30, bend: 10, rootX: 8, armF: [104, 116], weapon: 130, legF: [-52, -78], legB: [64, 12] } },
    { at: 78, d: { lean: 20, bend: 6, rootX: 6, armF: [130, 170], weapon: 190, legF: [-46, -70], legB: [60, 10] } },
    { at: 83, d: { lean: -4, bend: -2, rootX: 2, armF: [160, 195], weapon: 225, legF: [-30, -48], legB: [44, 0] } },
    { at: 88, from: 83, sm: ["weapon"], d: { lean: 32, bend: 12, rootX: 7, armF: [90, 60], weapon: 35, legF: [-46, -70], legB: [60, 8] } },
    { at: 94, d: { lean: 30, bend: 12, rootX: 7, armF: [70, 40], weapon: 25, legF: [-46, -70], legB: [60, 8] } },
    { at: 100, d: { lean: -2, bend: 14, rootX: -6, sy: 0.92, armF: [-70, -40], weapon: -92, grip2: false, armB: [-40, 20], legF: [-52, -82], legB: [58, -6], z: { armBFront: false } } },
    { at: 110, tint: 1, d: { lean: -2, bend: 14, rootX: -6, sy: 0.92, armF: [-70, -40], weapon: -92, grip2: false, armB: [-40, 20], legF: [-52, -82], legB: [58, -6], z: { armBFront: false } } },
    { at: 113, d: { lean: -2, bend: 14, rootX: -6, sy: 0.92, armF: [-70, -40], weapon: -92, grip2: false, armB: [-40, 20], legF: [-52, -82], legB: [58, -6], z: { armBFront: false } } },
    { at: 118, tint: 1, d: { lean: -2, bend: 14, rootX: -6, sy: 0.92, armF: [-70, -40], weapon: -92, grip2: false, armB: [-40, 20], legF: [-52, -82], legB: [58, -6], z: { armBFront: false } } },
    { at: 121, d: { lean: -2, bend: 14, rootX: -6, sy: 0.92, armF: [-70, -40], weapon: -92, grip2: false, armB: [-40, 20], legF: [-52, -82], legB: [58, -6], z: { armBFront: false } } },
    { at: 124, from: 100, sm: ["weapon"], d: { lean: 30, bend: 6, rootX: 14, armF: [90, 92], weapon: 92, grip2: false, armB: [-60, -30], legF: [-60, -86], legB: [70, 20], z: { armBFront: false } } },
    { at: 130, d: { lean: 30, bend: 6, rootX: 14, armF: [90, 92], weapon: 92, grip2: false, armB: [-60, -30], legF: [-60, -86], legB: [70, 20], z: { armBFront: false } } },
    { at: 160, d: { lean: 10, bend: 4, rootX: 10, armF: [50, 80], weapon: 140, grip2: false, armB: [10, 40], legF: [-30, -46], legB: [40, 0], z: { armBFront: false } } },
    { at: 176, d: { lean: 2, bend: 0, rootX: 8, armF: [20, 100], weapon: -95, grip2: false, armB: [20, 90], legF: [-10, -16], legB: [18, 0], z: { armBFront: false } } },
    { at: 190, d: { lean: 0, bend: 0, rootX: 8, armF: [12, 100], weapon: -95, ext: -22, grip2: false, armB: [20, 90], legF: [-8, -12], legB: [14, 0], z: { armBFront: false } } },
  ],
};

// ---------------------------------------------------------------- YOIKAZE: dagger slash / snap kick / lunging X-cut
const YOIKAZE: CharAnim = {
  idle: pose({ lean: 14, bend: 6, armF: [-20, 95], armB: [50, 130], weapon: 215, legF: [-24, -48], legB: [38, -6] }),
  breathe: { sy: 0.95, armF: [-22, 92], armB: [48, 126] },
  arms: {
    guard: { armF: [60, 170], armB: [80, 160], weapon: 200, z: { armBFront: true } },
    hurt: { armF: [-10, 60], armB: [-30, 30], weapon: 160 },
    hurt2: { armF: [-40, 30], armB: [-70, -10], weapon: 130 },
    gut: { armF: [40, 110], armB: [30, 120], weapon: 200 },
    flail: { armF: [120, 150], armB: [150, 170], weapon: 240 },
    down: { armF: [10, 20], armB: [-10, 10], weapon: 200 },
    stagger: { armF: [150, 200], armB: [-60, -20], weapon: 250 },
  },
  moves: {
    light: {
      startup: [{ lean: 10, armF: [30, 150], weapon: 230 }],
      charge: [{ lean: 4, rootX: -3, armF: [10, 165], weapon: 245, legF: [-30, -56], legB: [42, -8] }],
      active: [{ lean: 24, rootX: 4, armF: [88, 92], armB: [30, 110], weapon: 150, legF: [-32, -56], legB: [48, 0] }],
      recovery: [
        { lean: 20, rootX: 3, armF: [72, 84], armB: [40, 120], weapon: 170, legF: [-30, -54], legB: [44, -2] },
        { lean: 16, rootX: 1, armF: [10, 100], weapon: 205 },
      ],
      sm: ["weapon"],
    },
    medium: {
      startup: [{ lean: -4, bend: 0, armF: [-30, 60], armB: [40, 140], legF: [-12, -22], legB: [110, 10] }],
      charge: [{ lean: -10, bend: -2, rootX: -3, armF: [-40, 50], armB: [30, 150], legF: [-16, -28], legB: [122, 4] }],
      active: [
        { lean: -22, bend: -4, rootX: 4, armF: [-50, 40], armB: [20, 120], legF: [-16, -24], legB: [96, 94], footB: 170 },
        { lean: -20, bend: -4, rootX: 4, armF: [-50, 40], armB: [20, 120], legF: [-16, -24], legB: [96, 92], footB: 170 },
      ],
      recovery: [
        { lean: -8, bend: 0, rootX: 3, armF: [-40, 60], armB: [30, 130], legF: [-14, -24], legB: [104, 24] },
        { lean: 8, bend: 4, rootX: 1, legF: [-20, -40], legB: [50, -6] },
      ],
      sm: ["footB"],
    },
    heavy: {
      startup: [
        { lean: 4, bend: 2, armF: [100, 150], armB: [110, 160], weapon: 200 },
        { lean: -4, bend: -4, rootX: -2, armF: [170, 170], armB: [160, 200], weapon: 230, legF: [-30, -50], legB: [36, -4] },
      ],
      charge: [{ lean: -10, bend: -6, rootX: -4, sy: 0.95, armF: [180, 190], armB: [172, 210], weapon: 250, legF: [-38, -62], legB: [46, -6] }],
      active: [
        { lean: 32, bend: 10, rootX: 6, armF: [95, 60], armB: [85, 40], weapon: 30, legF: [-50, -74], legB: [62, 10] },
        { lean: 34, bend: 10, rootX: 6, armF: [72, 32], armB: [62, 22], weapon: 12, legF: [-50, -74], legB: [62, 10] },
      ],
      recovery: [
        { lean: 28, bend: 10, rootX: 5, armF: [52, 30], armB: [42, 40], weapon: 20, legF: [-44, -66], legB: [56, 6] },
        { lean: 18, bend: 6, rootX: 2, armF: [0, 80], armB: [40, 120], weapon: 200, legF: [-30, -52], legB: [44, -4] },
      ],
      sm: ["weapon", "weaponB"],
    },
    air: {
      startup: [air({ lean: -10, legF: [30, -40], legB: [100, 20], armF: [120, 150], armB: [150, 170] })],
      charge: [air({ lean: -10, legF: [30, -40], legB: [100, 20], armF: [120, 150], armB: [150, 170] })],
      active: [
        air({ lean: -26, legB: [62, 54], footB: 120, legF: [20, -60], armF: [150, 200], armB: [-40, -10], weapon: 240 }),
        air({ lean: -26, legB: [60, 54], footB: 120, legF: [20, -60], armF: [150, 200], armB: [-40, -10], weapon: 240 }),
      ],
      recovery: [{ lean: 20, bend: 10, sy: 0.86, legF: [30, -58], legB: [66, -22], armF: [40, 120], armB: [60, 140] }],
      sm: ["footB"],
    },
  },
  intro: [
    { lean: 30, bend: 20, legF: [-10, -100], legB: [84, -4], armF: [60, 20], armB: [30, 10], weapon: 180 },
    { lean: 30, bend: 20, legF: [-10, -100], legB: [84, -4], armF: [60, 20], armB: [30, 10], weapon: 180 },
    { lean: 18, bend: 10, legF: [-20, -60], legB: [50, -6], armF: [20, 120], armB: [40, 140], weapon: 210 },
    {},
  ],
  win: [
    { lean: 4, bend: 2, armF: [90, 170], armB: [100, 175], weapon: 100, legF: [-10, -14], legB: [16, 0], z: { armBFront: true } },
    { lean: 4, bend: 2, armF: [30, 150], armB: [40, 160], weapon: 110, legF: [-8, -12], legB: [14, 0], z: { armBFront: true } },
    { lean: 4, bend: 2, sy: 0.97, armF: [30, 148], armB: [40, 158], weapon: 112, legF: [-8, -12], legB: [14, 0], z: { armBFront: true } },
  ],
  finisher: [
    { at: 0, d: { lean: 30, bend: 20, legF: [-10, -100], legB: [84, -4], armF: [60, 20], armB: [30, 10], weapon: 180 } },
    { at: 30, d: { lean: 24, bend: 16, sy: 0.96, legF: [-14, -90], legB: [80, -4], armF: [80, 150], armB: [90, 160], weapon: 100, z: { armBFront: true } } },
    { at: 42, tint: 1, d: { lean: 24, bend: 16, sy: 0.96, legF: [-14, -90], legB: [80, -4], armF: [80, 150], armB: [90, 160], weapon: 100, z: { armBFront: true } } },
    { at: 46, d: { lean: 24, bend: 16, sy: 0.96, legF: [-14, -90], legB: [80, -4], armF: [80, 150], armB: [90, 160], weapon: 100, z: { armBFront: true } } },
    { at: 51, d: { lean: 10, armF: [30, 150], weapon: 230 } },
    { at: 56, from: 51, sm: ["weapon"], d: { lean: 24, rootX: 4, armF: [88, 92], armB: [30, 110], weapon: 150, legF: [-32, -56], legB: [48, 0] } },
    { at: 62, d: { lean: 20, rootX: 3, armF: [72, 84], armB: [40, 120], weapon: 170, legF: [-30, -54], legB: [44, -2] } },
    { at: 67, d: { lean: -4, bend: -4, rootX: -2, armF: [170, 170], armB: [160, 200], weapon: 230, legF: [-30, -50], legB: [36, -4] } },
    { at: 72, from: 67, sm: ["weapon", "weaponB"], d: { lean: 32, bend: 10, rootX: 6, armF: [95, 60], armB: [85, 40], weapon: 30, legF: [-50, -74], legB: [62, 10] } },
    { at: 78, d: { lean: 28, bend: 10, rootX: 5, armF: [52, 30], armB: [42, 40], weapon: 20, legF: [-44, -66], legB: [56, 6] } },
    { at: 83, d: { lean: -4, armF: [-30, 60], armB: [40, 140], legF: [-12, -22], legB: [110, 10] } },
    { at: 88, from: 83, sm: ["footB"], d: { lean: -22, bend: -4, rootX: 4, armF: [-50, 40], armB: [20, 120], legF: [-16, -24], legB: [96, 94], footB: 170 } },
    { at: 94, d: { lean: -8, rootX: 3, armF: [-40, 60], armB: [30, 130], legF: [-14, -24], legB: [104, 24] } },
    { at: 100, d: { ground: false, rootY: 26, rootX: -4, lean: -12, bend: -4, legF: [40, -50], legB: [90, -20], armF: [170, 190], armB: [172, 205], weapon: 250 } },
    { at: 110, tint: 1, d: { ground: false, rootY: 30, rootX: -4, lean: -14, bend: -4, legF: [44, -50], legB: [94, -20], armF: [172, 192], armB: [174, 208], weapon: 252 } },
    { at: 114, d: { ground: false, rootY: 30, rootX: -4, lean: -14, bend: -4, legF: [44, -50], legB: [94, -20], armF: [172, 192], armB: [174, 208], weapon: 252 } },
    { at: 119, tint: 1, d: { ground: false, rootY: 24, rootX: 0, lean: 0, bend: 0, legF: [40, -40], legB: [90, -10], armF: [176, 196], armB: [176, 210], weapon: 255 } },
    { at: 124, from: 100, sm: ["weapon", "weaponB"], d: { lean: 42, bend: 20, rootX: 12, sy: 0.92, legF: [-30, -100], legB: [84, -6], armF: [100, 40], armB: [90, 30], weapon: 15 } },
    { at: 130, d: { lean: 42, bend: 20, rootX: 12, sy: 0.92, legF: [-30, -100], legB: [84, -6], armF: [100, 40], armB: [90, 30], weapon: 15 } },
    { at: 162, d: { lean: 20, bend: 10, rootX: 10, legF: [-20, -60], legB: [50, -6], armF: [40, 100], armB: [50, 120], weapon: 200 } },
    { at: 180, d: { lean: 4, bend: 2, rootX: 8, armF: [30, 150], armB: [40, 160], weapon: 110, legF: [-8, -12], legB: [14, 0], z: { armBFront: true } } },
  ],
};

// ---------------------------------------------------------------- GRIMVALD: shield bash / rising backhand / leaping overhead chop
const GRIMVALD: CharAnim = {
  idle: pose({ lean: 4, bend: 4, armF: [-12, 60], armB: [45, 100], weapon: 150, legF: [-18, -30], legB: [26, 0] }),
  breathe: { sy: 0.96, armF: [-14, 56], armB: [43, 96], weapon: 147 },
  arms: {
    guard: { armF: [-20, 40], weapon: 125, armB: [80, 150], z: { armBFront: true } },
    hurt: { armF: [-30, 40], weapon: 170, armB: [-20, 30] },
    hurt2: { armF: [-50, 20], weapon: 160, armB: [-60, -10] },
    gut: { armF: [30, 100], weapon: 60, armB: [30, 110], z: { armBFront: true } },
    flail: { armF: [120, 150], weapon: 210, armB: [150, 170] },
    down: { armF: [10, 20], weapon: 80, armB: [-10, 10] },
    stagger: { armF: [150, 200], weapon: 240, armB: [-50, -10] },
  },
  moves: {
    light: {
      startup: [{ lean: -4, rootX: -2, armB: [20, 80], z: { armBFront: true } }],
      charge: [{ lean: -10, rootX: -4, armB: [0, 60], legF: [-26, -40], legB: [30, -2], z: { armBFront: true } }],
      active: [
        { lean: 22, bend: 8, rootX: 6, armB: [88, 92], armF: [-30, 40], weapon: 170, legF: [-32, -48], legB: [44, 4], z: { armBFront: true } },
      ],
      recovery: [
        { lean: 14, bend: 6, rootX: 4, armB: [72, 100], armF: [-24, 46], weapon: 165, legF: [-26, -40], legB: [36, 2], z: { armBFront: true } },
        { lean: 8, rootX: 1, armB: [52, 100] },
      ],
      sm: ["handB"],
    },
    medium: {
      startup: [
        { lean: 0, bend: 2, armF: [-30, 0], weapon: -20, legF: [-20, -34], legB: [28, 0] },
        { lean: -6, bend: 4, rootX: -2, armF: [-60, -50], weapon: -100, legF: [-24, -38], legB: [32, -2] },
      ],
      charge: [{ lean: -10, bend: 6, rootX: -4, sy: 0.95, armF: [-70, -60], weapon: -112, legF: [-30, -46], legB: [36, -4] }],
      active: [
        { lean: 22, bend: 4, rootX: 5, armF: [100, 110], weapon: 115, armB: [20, 80], legF: [-32, -48], legB: [44, 4] },
        { lean: 18, bend: 0, rootX: 5, armF: [125, 140], weapon: 150, armB: [20, 80], legF: [-32, -48], legB: [44, 4] },
      ],
      recovery: [
        { lean: 12, bend: 0, rootX: 4, armF: [120, 150], weapon: 170, legF: [-28, -44], legB: [38, 2] },
        { lean: 6, bend: 2, rootX: 1, armF: [20, 80], weapon: 160 },
      ],
      sm: ["weapon"],
    },
    heavy: {
      startup: [
        { lean: -8, bend: -2, rootX: -1, armF: [140, 180], weapon: 220, armB: [100, 140], legF: [-22, -36], legB: [30, 0] },
        { lean: -16, bend: -6, rootX: -3, sy: 1.04, armF: [172, 212], weapon: 262, armB: [120, 160], legF: [-24, -40], legB: [34, -2] },
      ],
      charge: [{ lean: -20, bend: -8, rootX: -5, sy: 1.04, armF: [180, 222], weapon: 276, armB: [130, 170], legF: [-30, -48], legB: [40, -4] }],
      active: [
        { lean: 40, bend: 14, rootX: 8, sy: 0.92, armF: [80, 40], weapon: 15, armB: [40, 60], legF: [-40, -64], legB: [60, 6] },
        { lean: 42, bend: 14, rootX: 8, sy: 0.9, armF: [72, 30], weapon: 5, armB: [40, 60], legF: [-42, -66], legB: [60, 6] },
      ],
      recovery: [
        { lean: 36, bend: 12, rootX: 7, sy: 0.92, armF: [60, 20], weapon: 5, armB: [40, 70], legF: [-40, -64], legB: [58, 6] },
        { lean: 24, bend: 8, rootX: 4, armF: [40, 40], weapon: 40, legF: [-30, -48], legB: [44, 2] },
        { lean: 10, bend: 4, rootX: 1, armF: [0, 60], weapon: 110 },
      ],
      sm: ["weapon"],
    },
    air: {
      startup: [air({ lean: -10, armF: [170, 210], weapon: 250 })],
      charge: [air({ lean: -10, armF: [170, 210], weapon: 250 })],
      active: [air({ lean: 30, armF: [80, 30], weapon: 20, legF: [10, -50], legB: [50, -10] }), air({ lean: 32, armF: [70, 24], weapon: 10, legF: [10, -50], legB: [50, -10] })],
      recovery: [{ lean: 26, bend: 10, sy: 0.86, armF: [60, 20], weapon: 10, legF: [30, -58], legB: [66, -22] }],
      sm: ["weapon"],
    },
  },
  intro: [
    { lean: 0, bend: 0, armF: [20, 170], weapon: 250, armB: [10, 40], legF: [-8, -12], legB: [14, 0] },
    { lean: 4, bend: 4, armF: [70, 150], weapon: 220, armB: [80, 120], legF: [-14, -24], legB: [22, 0], z: { armBFront: true } },
    { lean: 4, bend: 4, armF: [40, 120], weapon: 170, armB: [80, 120], legF: [-14, -24], legB: [22, 0], z: { armBFront: true } },
    {},
  ],
  win: [
    { lean: -8, bend: -6, head: -2, armF: [170, 180], weapon: 180, armB: [150, 170], legF: [-20, -30], legB: [30, 0] },
    { lean: -4, bend: -4, armF: [160, 175], weapon: 175, armB: [60, 110], legF: [-16, -26], legB: [26, 0], z: { armBFront: true } },
    { lean: -4, bend: -4, sy: 0.97, armF: [158, 172], weapon: 172, armB: [60, 108], legF: [-16, -26], legB: [26, 0], z: { armBFront: true } },
  ],
  finisher: [
    { at: 0, d: { lean: 4, bend: 4, armF: [70, 150], weapon: 220, armB: [80, 120], z: { armBFront: true } } },
    { at: 10, d: { lean: 6, bend: 6, armF: [40, 110], weapon: 160, armB: [80, 120], z: { armBFront: true } } },
    { at: 20, d: { lean: 4, bend: 4, armF: [70, 150], weapon: 220, armB: [80, 120], z: { armBFront: true } } },
    { at: 30, d: { lean: 6, bend: 6, armF: [40, 110], weapon: 160, armB: [80, 120], z: { armBFront: true } } },
    { at: 40, tint: 1, d: { lean: -8, bend: -6, head: -2, armF: [170, 180], weapon: 180, armB: [150, 170], legF: [-20, -30], legB: [30, 0] } },
    { at: 44, d: { lean: -8, bend: -6, head: -2, armF: [170, 180], weapon: 180, armB: [150, 170], legF: [-20, -30], legB: [30, 0] } },
    { at: 51, d: { lean: -4, rootX: -2, armB: [20, 80], z: { armBFront: true } } },
    { at: 56, from: 51, sm: ["handB"], d: { lean: 22, bend: 8, rootX: 6, armB: [88, 92], armF: [-30, 40], weapon: 170, legF: [-32, -48], legB: [44, 4], z: { armBFront: true } } },
    { at: 62, d: { lean: 14, bend: 6, rootX: 4, armB: [72, 100], armF: [-24, 46], weapon: 165, z: { armBFront: true } } },
    { at: 67, d: { lean: -6, bend: 4, rootX: -2, armF: [-60, -50], weapon: -100, legF: [-24, -38], legB: [32, -2] } },
    { at: 72, from: 67, sm: ["weapon"], d: { lean: 22, bend: 4, rootX: 5, armF: [100, 110], weapon: 115, armB: [20, 80], legF: [-32, -48], legB: [44, 4] } },
    { at: 78, d: { lean: 18, rootX: 5, armF: [125, 140], weapon: 150, armB: [20, 80], legF: [-32, -48], legB: [44, 4] } },
    { at: 83, d: { lean: -4, rootX: -2, armF: [120, 150], weapon: 180, armB: [20, 80], z: { armBFront: true } } },
    { at: 88, from: 83, sm: ["handB"], d: { lean: 24, bend: 8, rootX: 7, armB: [88, 92], armF: [100, 150], weapon: 190, legF: [-34, -50], legB: [46, 4], z: { armBFront: true } } },
    { at: 94, d: { lean: 16, bend: 6, rootX: 5, armB: [72, 100], armF: [100, 150], weapon: 190, z: { armBFront: true } } },
    { at: 100, d: { ground: false, rootY: 22, lean: -20, bend: -8, armF: [176, 218], weapon: 272, armB: [140, 170], legF: [20, -50], legB: [70, -20] } },
    { at: 110, tint: 1, d: { ground: false, rootY: 28, lean: -22, bend: -8, armF: [180, 222], weapon: 278, armB: [140, 170], legF: [24, -50], legB: [74, -20] } },
    { at: 114, d: { ground: false, rootY: 28, lean: -22, bend: -8, armF: [180, 222], weapon: 278, armB: [140, 170], legF: [24, -50], legB: [74, -20] } },
    { at: 119, tint: 1, d: { ground: false, rootY: 18, lean: -10, bend: -4, armF: [178, 220], weapon: 275, armB: [140, 170], legF: [10, -40], legB: [50, -10] } },
    { at: 124, from: 100, sm: ["weapon"], d: { lean: 44, bend: 16, rootX: 10, sy: 0.88, armF: [74, 30], weapon: 8, armB: [40, 60], legF: [-44, -70], legB: [62, 6] } },
    { at: 130, d: { lean: 44, bend: 16, rootX: 10, sy: 0.88, armF: [74, 30], weapon: 8, armB: [40, 60], legF: [-44, -70], legB: [62, 6] } },
    { at: 162, d: { lean: 20, bend: 8, rootX: 8, armF: [40, 40], weapon: 40, legF: [-30, -48], legB: [44, 2] } },
    { at: 180, d: { lean: -8, bend: -6, rootX: 6, head: -2, armF: [170, 180], weapon: 180, armB: [150, 170], legF: [-20, -30], legB: [30, 0] } },
  ],
};

// ---------------------------------------------------------------- MAELIS: quick jab / overhead crescent / deep lunge
const MAELIS: CharAnim = {
  idle: pose({ lean: 2, bend: 2, armF: [10, 70], weapon: 150, grip2: true, legF: [-10, -22], legB: [22, 0], z: { armBFront: true } }),
  breathe: { sy: 0.96, armF: [8, 68], weapon: 148 },
  arms: {
    guard: { armF: [50, 140], weapon: 175, grip2: true, z: { armBFront: true } },
    hurt: { armF: [-10, 60], weapon: 160, grip2: false, armB: [-30, 30], z: { armBFront: false } },
    hurt2: { armF: [-40, 30], weapon: 140, grip2: false, armB: [-70, -10], z: { armBFront: false } },
    gut: { armF: [40, 110], weapon: 70, grip2: false, armB: [30, 120], z: { armBFront: false } },
    flail: { armF: [120, 150], weapon: 200, grip2: false, armB: [150, 170], z: { armBFront: false } },
    down: { armF: [10, 20], weapon: 80, grip2: false, armB: [-10, 10], z: { armBFront: false } },
    stagger: { armF: [150, 200], weapon: 220, grip2: false, armB: [-60, -20], z: { armBFront: false } },
  },
  moves: {
    light: {
      startup: [{ lean: -2, rootX: -2, armF: [0, 60], weapon: 96 }],
      charge: [{ lean: -6, rootX: -4, armF: [-15, 45], weapon: 98, legF: [-20, -36], legB: [28, -2] }],
      active: [{ lean: 14, rootX: 3, armF: [70, 85], weapon: 92, legF: [-22, -40], legB: [36, 2] }],
      recovery: [
        { lean: 10, rootX: 2, armF: [45, 80], weapon: 100, legF: [-18, -34], legB: [30, 0] },
        { lean: 6, armF: [20, 72], weapon: 130 },
      ],
      sm: ["weapon"],
    },
    medium: {
      startup: [
        { lean: -2, bend: 0, armF: [80, 130], weapon: 180 },
        { lean: -8, bend: -4, rootX: -2, armF: [140, 175], weapon: 228 },
      ],
      charge: [{ lean: -12, bend: -6, rootX: -4, armF: [155, 190], weapon: 248, legF: [-20, -36], legB: [30, -2] }],
      active: [
        { lean: 18, bend: 8, rootX: 4, armF: [100, 100], weapon: 100, legF: [-28, -46], legB: [40, 2] },
        { lean: 20, bend: 8, rootX: 4, armF: [90, 84], weapon: 78, legF: [-28, -46], legB: [40, 2] },
      ],
      recovery: [
        { lean: 16, bend: 6, rootX: 3, armF: [70, 60], weapon: 68, legF: [-24, -40], legB: [36, 0] },
        { lean: 8, bend: 4, rootX: 1, armF: [30, 70], weapon: 125 },
      ],
      sm: ["weapon"],
    },
    heavy: {
      startup: [
        { lean: 0, bend: 0, rootX: -2, armF: [-5, 45], weapon: 100, legF: [-20, -34], legB: [28, -2] },
        { lean: -6, bend: 0, rootX: -4, armF: [-24, 28], weapon: 96, legF: [-30, -46], legB: [34, -2] },
      ],
      charge: [{ lean: -10, bend: 0, rootX: -6, sy: 0.95, armF: [-36, 18], weapon: 95, legF: [-38, -56], legB: [40, -4] }],
      active: [
        { lean: 34, bend: 8, rootX: 10, armF: [88, 96], weapon: 100, legF: [-56, -80], legB: [66, 14] },
        { lean: 34, bend: 8, rootX: 10, armF: [90, 97], weapon: 100, legF: [-56, -80], legB: [66, 14] },
      ],
      recovery: [
        { lean: 30, bend: 8, rootX: 9, armF: [78, 95], weapon: 106, legF: [-54, -78], legB: [64, 12] },
        { lean: 18, bend: 4, rootX: 5, armF: [50, 82], weapon: 118, legF: [-36, -54], legB: [46, 4] },
        { lean: 8, bend: 2, rootX: 1, armF: [22, 72], weapon: 138, legF: [-16, -30], legB: [28, 0] },
      ],
      sm: ["weapon"],
    },
    air: {
      startup: [air({ lean: -8, armF: [150, 180], weapon: 230 })],
      charge: [air({ lean: -8, armF: [150, 180], weapon: 230 })],
      active: [air({ lean: 20, armF: [80, 50], weapon: 45, legF: [10, -60], legB: [60, -10] }), air({ lean: 22, armF: [70, 40], weapon: 32, legF: [10, -60], legB: [60, -10] })],
      recovery: [{ lean: 20, bend: 10, sy: 0.86, armF: [60, 40], weapon: 50, legF: [30, -58], legB: [66, -22] }],
      sm: ["weapon"],
    },
  },
  intro: [
    { lean: 0, bend: 0, armF: [20, 40], weapon: 178, grip2: false, armB: [10, 30], legF: [-6, -10], legB: [12, 0], z: { armBFront: false } },
    { lean: 0, bend: 0, armF: [20, 40], weapon: 178, grip2: false, armB: [10, 30], legF: [-6, -10], legB: [12, 0], z: { armBFront: false } },
    { lean: 0, bend: 0, armF: [90, 160], weapon: 90, grip2: false, armB: [20, 40], legF: [-8, -16], legB: [16, 0], z: { armBFront: false } },
    { lean: 0, bend: 0, armF: [90, 160], weapon: 270, grip2: false, armB: [20, 40], legF: [-8, -16], legB: [16, 0], z: { armBFront: false } },
    {},
  ],
  win: [
    { lean: -2, bend: -2, armF: [170, 180], weapon: 90, grip2: false, armB: [150, 170], legF: [-10, -16], legB: [18, 0], z: { armBFront: false } },
    { lean: 0, bend: 0, armF: [20, 40], weapon: 178, grip2: false, armB: [10, 30], legF: [-6, -10], legB: [12, 0], z: { armBFront: false } },
    { lean: 0, bend: 0, sy: 0.97, armF: [20, 38], weapon: 178, grip2: false, armB: [10, 28], legF: [-6, -10], legB: [12, 0], z: { armBFront: false } },
  ],
  finisher: [
    { at: 0, d: { lean: -2, armF: [170, 180], weapon: 0, grip2: false, armB: [150, 170], z: { armBFront: false } } },
    { at: 7, d: { lean: -2, armF: [170, 180], weapon: 67, grip2: false, armB: [150, 170], z: { armBFront: false } } },
    { at: 14, d: { lean: -2, armF: [170, 180], weapon: 135, grip2: false, armB: [150, 170], z: { armBFront: false } } },
    { at: 21, d: { lean: -2, armF: [170, 180], weapon: 202, grip2: false, armB: [150, 170], z: { armBFront: false } } },
    { at: 28, d: { lean: -2, armF: [170, 180], weapon: 270, grip2: false, armB: [150, 170], z: { armBFront: false } } },
    { at: 35, d: { lean: -2, armF: [170, 180], weapon: 337, grip2: false, armB: [150, 170], z: { armBFront: false } } },
    { at: 42, tint: 1, d: { lean: -6, armF: [140, 175], weapon: 228, grip2: true } },
    { at: 46, d: { lean: -6, armF: [140, 175], weapon: 228, grip2: true } },
    { at: 51, d: { lean: -2, rootX: -2, armF: [0, 60], weapon: 96 } },
    { at: 56, from: 51, sm: ["weapon"], d: { lean: 14, rootX: 3, armF: [70, 85], weapon: 92, legF: [-22, -40], legB: [36, 2] } },
    { at: 62, d: { lean: 10, rootX: 2, armF: [45, 80], weapon: 100 } },
    { at: 67, d: { lean: -2, rootX: -2, armF: [0, 60], weapon: 98 } },
    { at: 72, from: 67, sm: ["weapon"], d: { lean: 16, rootX: 5, armF: [76, 90], weapon: 96, legF: [-30, -50], legB: [44, 4] } },
    { at: 78, d: { lean: 12, rootX: 3, armF: [50, 82], weapon: 104 } },
    { at: 83, d: { lean: -8, bend: -4, rootX: -2, armF: [140, 175], weapon: 228 } },
    { at: 88, from: 83, sm: ["weapon"], d: { lean: 18, bend: 8, rootX: 4, armF: [100, 100], weapon: 100, legF: [-28, -46], legB: [40, 2] } },
    { at: 94, d: { lean: 20, bend: 8, rootX: 4, armF: [90, 84], weapon: 78, legF: [-28, -46], legB: [40, 2] } },
    { at: 100, d: { lean: -4, bend: 10, rootX: -4, sy: 0.92, armF: [-30, -10], weapon: -60, legF: [-40, -62], legB: [46, -6] } },
    { at: 110, tint: 1, d: { lean: -4, bend: 10, rootX: -4, sy: 0.92, armF: [-30, -10], weapon: -60, legF: [-40, -62], legB: [46, -6] } },
    { at: 113, d: { lean: -4, bend: 10, rootX: -4, sy: 0.92, armF: [-30, -10], weapon: -60, legF: [-40, -62], legB: [46, -6] } },
    { at: 118, tint: 1, d: { lean: -4, bend: 10, rootX: -4, sy: 0.92, armF: [-30, -10], weapon: -60, legF: [-40, -62], legB: [46, -6] } },
    { at: 121, d: { lean: -4, bend: 10, rootX: -4, sy: 0.92, armF: [-30, -10], weapon: -60, legF: [-40, -62], legB: [46, -6] } },
    { at: 124, from: 100, sm: ["weapon"], d: { lean: -10, bend: -8, rootX: 8, sy: 1.04, armF: [160, 175], weapon: 172, legF: [-22, -32], legB: [42, 0] } },
    { at: 130, d: { lean: -10, bend: -8, rootX: 8, sy: 1.04, armF: [160, 175], weapon: 172, legF: [-22, -32], legB: [42, 0] } },
    { at: 162, d: { lean: 0, bend: 0, rootX: 6, armF: [90, 160], weapon: 270, grip2: false, armB: [20, 40], legF: [-8, -16], legB: [16, 0], z: { armBFront: false } } },
    { at: 180, d: { lean: 0, bend: 0, rootX: 6, armF: [20, 40], weapon: 178, grip2: false, armB: [10, 30], legF: [-6, -10], legB: [12, 0], z: { armBFront: false } } },
  ],
};

// ---------------------------------------------------------------- BAZALT: jab / lunging hook / rising uppercut
const BAZALT: CharAnim = {
  idle: pose({ lean: 10, bend: 8, armF: [20, 150], armB: [60, 160], legF: [-20, -36], legB: [30, -4], z: { armBFront: true } }),
  breathe: { sy: 0.95, armF: [18, 146], armB: [58, 156] },
  arms: {
    guard: { armF: [70, 175], armB: [85, 175], z: { armBFront: true } },
    hurt: { armF: [-10, 60], armB: [-30, 30], z: { armBFront: false } },
    hurt2: { armF: [-40, 30], armB: [-70, -10], z: { armBFront: false } },
    gut: { armF: [40, 120], armB: [30, 120], z: { armBFront: true } },
    flail: { armF: [120, 150], armB: [150, 170], z: { armBFront: false } },
    down: { armF: [10, 20], armB: [-10, 10], z: { armBFront: false } },
    stagger: { armF: [150, 200], armB: [-60, -20], z: { armBFront: false } },
  },
  moves: {
    light: {
      startup: [{ lean: 6, armF: [0, 140] }],
      charge: [{ lean: 0, rootX: -3, armF: [-20, 130], legF: [-26, -44], legB: [34, -4] }],
      active: [{ lean: 18, rootX: 4, armF: [86, 90], legF: [-26, -44], legB: [40, 0] }],
      recovery: [
        { lean: 14, rootX: 3, armF: [56, 120] },
        { lean: 12, rootX: 1, armF: [28, 145] },
      ],
      sm: ["handF"],
    },
    medium: {
      startup: [
        { lean: 6, bend: 6, armF: [-20, 90], legF: [-22, -38], legB: [32, -4] },
        { lean: 2, bend: 10, rootX: -2, armF: [-50, 40], legF: [-26, -44], legB: [34, -4] },
      ],
      charge: [{ lean: 0, bend: 12, rootX: -4, sy: 0.95, armF: [-64, 30], legF: [-30, -50], legB: [38, -6] }],
      active: [
        { lean: 30, bend: 14, rootX: 6, armF: [72, 120], armB: [20, 150], legF: [-38, -58], legB: [52, 6] },
        { lean: 32, bend: 14, rootX: 6, armF: [80, 130], armB: [20, 150], legF: [-38, -58], legB: [52, 6] },
      ],
      recovery: [
        { lean: 24, bend: 12, rootX: 5, armF: [62, 140], legF: [-34, -52], legB: [46, 4] },
        { lean: 14, bend: 9, rootX: 2, armF: [28, 150] },
      ],
      sm: ["handF"],
    },
    heavy: {
      startup: [
        { lean: 16, bend: 12, rootX: -1, sy: 0.94, armF: [-10, 70], legF: [-26, -52], legB: [42, -6] },
        { lean: 20, bend: 16, rootX: -2, sy: 0.9, armF: [-34, 36], legF: [-30, -60], legB: [46, -6] },
      ],
      charge: [{ lean: 24, bend: 20, rootX: -4, sy: 0.86, armF: [-50, 20], legF: [-34, -66], legB: [50, -8] }],
      active: [
        { lean: -8, bend: -10, rootX: 6, sy: 1.06, armF: [158, 176], armB: [30, 140], legF: [-22, -32], legB: [42, 0] },
        { lean: -12, bend: -12, rootX: 6, sy: 1.06, armF: [148, 172], armB: [30, 140], legF: [-22, -32], legB: [42, 0] },
      ],
      recovery: [
        { lean: -6, bend: -8, rootX: 5, armF: [150, 175], armB: [40, 150], legF: [-22, -34], legB: [40, 0] },
        { lean: 4, bend: 2, rootX: 3, armF: [70, 160], legF: [-22, -36], legB: [34, -2] },
        { lean: 9, bend: 7, rootX: 1, armF: [24, 150] },
      ],
      sm: ["handF"],
    },
    air: {
      startup: [air({ lean: -14, armF: [170, 200], armB: [160, 190], z: { armBFront: true } })],
      charge: [air({ lean: -14, armF: [170, 200], armB: [160, 190], z: { armBFront: true } })],
      active: [
        air({ lean: 30, armF: [80, 20], armB: [70, 10], legF: [10, -60], legB: [60, -10], z: { armBFront: true } }),
        air({ lean: 32, armF: [70, 14], armB: [62, 6], legF: [10, -60], legB: [60, -10], z: { armBFront: true } }),
      ],
      recovery: [{ lean: 26, bend: 12, sy: 0.86, armF: [60, 20], armB: [50, 20], legF: [30, -58], legB: [66, -22] }],
      sm: ["handF"],
    },
  },
  intro: [
    { lean: 6, bend: 4, armF: [60, 100], armB: [70, 90], legF: [-14, -24], legB: [22, 0], z: { armBFront: true } },
    { lean: 8, bend: 6, armF: [40, 130], armB: [70, 90], legF: [-14, -24], legB: [22, 0], z: { armBFront: true } },
    { lean: 6, bend: 4, armF: [70, 95], armB: [70, 90], legF: [-14, -24], legB: [22, 0], z: { armBFront: true } },
    {},
  ],
  win: [
    { lean: -2, bend: -4, armF: [150, 190], armB: [160, 200], legF: [-10, -14], legB: [16, 0] },
    { lean: -2, bend: -4, armF: [100, 190], armB: [110, 200], legF: [-12, -18], legB: [18, 0] },
    { lean: -2, bend: -4, sy: 0.97, armF: [100, 186], armB: [110, 196], legF: [-12, -18], legB: [18, 0] },
  ],
  finisher: [
    { at: 0, d: { lean: 6, bend: 4, armF: [60, 100], armB: [70, 90], z: { armBFront: true } } },
    { at: 10, d: { lean: 8, bend: 6, armF: [40, 130], armB: [70, 90], z: { armBFront: true } } },
    { at: 18, d: { lean: 6, bend: 4, armF: [70, 95], armB: [70, 90], z: { armBFront: true } } },
    { at: 28, d: { lean: 8, bend: 6, armF: [40, 130], armB: [70, 90], z: { armBFront: true } } },
    { at: 36, d: { lean: 6, bend: 4, armF: [70, 95], armB: [70, 90], z: { armBFront: true } } },
    { at: 42, tint: 1, d: { lean: -2, bend: -4, armF: [150, 190], armB: [160, 200] } },
    { at: 46, d: { lean: -2, bend: -4, armF: [150, 190], armB: [160, 200] } },
    { at: 51, d: { lean: 6, armF: [0, 140] } },
    { at: 56, from: 51, sm: ["handF"], d: { lean: 18, rootX: 4, armF: [86, 90], legF: [-26, -44], legB: [40, 0] } },
    { at: 62, d: { lean: 14, rootX: 3, armF: [56, 120] } },
    { at: 67, d: { lean: 2, bend: 10, rootX: -2, armF: [-50, 40], legF: [-26, -44], legB: [34, -4] } },
    { at: 72, from: 67, sm: ["handF"], d: { lean: 30, bend: 14, rootX: 6, armF: [72, 120], armB: [20, 150], legF: [-38, -58], legB: [52, 6] } },
    { at: 78, d: { lean: 24, bend: 12, rootX: 5, armF: [62, 140], legF: [-34, -52], legB: [46, 4] } },
    { at: 83, d: { lean: 10, rootX: 3, armF: [60, 150], armB: [20, 120], z: { armBFront: false } } },
    { at: 88, from: 83, sm: ["handB"], d: { lean: 22, rootX: 7, armF: [60, 150], armB: [86, 92], legF: [-30, -48], legB: [44, 2], z: { armBFront: true } } },
    { at: 94, d: { lean: 16, rootX: 5, armF: [50, 150], armB: [60, 120], z: { armBFront: true } } },
    { at: 100, d: { lean: 24, bend: 20, rootX: -4, sy: 0.86, armF: [-50, 20], legF: [-34, -66], legB: [50, -8] } },
    { at: 106, tint: 1, d: { lean: 24, bend: 20, rootX: -4, sy: 0.86, armF: [-50, 20], legF: [-34, -66], legB: [50, -8] } },
    { at: 109, d: { lean: 24, bend: 20, rootX: -4, sy: 0.86, armF: [-50, 20], legF: [-34, -66], legB: [50, -8] } },
    { at: 113, tint: 1, d: { lean: 26, bend: 22, rootX: -5, sy: 0.84, armF: [-54, 16], legF: [-36, -68], legB: [52, -8] } },
    { at: 116, d: { lean: 26, bend: 22, rootX: -5, sy: 0.84, armF: [-54, 16], legF: [-36, -68], legB: [52, -8] } },
    { at: 120, tint: 1, d: { lean: 26, bend: 22, rootX: -5, sy: 0.84, armF: [-54, 16], legF: [-36, -68], legB: [52, -8] } },
    { at: 124, from: 100, sm: ["handF"], d: { lean: -12, bend: -12, rootX: 8, sy: 1.08, armF: [132, 160], armB: [30, 140], legF: [-22, -32], legB: [42, 0] } },
    { at: 130, d: { lean: -12, bend: -12, rootX: 8, sy: 1.08, armF: [132, 160], armB: [30, 140], legF: [-22, -32], legB: [42, 0] } },
    { at: 162, d: { lean: 0, bend: 0, rootX: 6, armF: [100, 160], armB: [40, 150], legF: [-18, -28], legB: [30, 0] } },
    { at: 180, d: { lean: -2, bend: -4, rootX: 6, armF: [100, 190], armB: [110, 200], legF: [-12, -18], legB: [18, 0] } },
  ],
};

// ---------------------------------------------------------------- ORIEL: palm strike / lantern upswing / chain hurl
const ORIEL: CharAnim = {
  idle: pose({ lean: 4, bend: 2, armF: [35, 85], armB: [10, 40], weapon: 0, legF: [-12, -26], legB: [22, 0] }),
  breathe: { sy: 0.96, armF: [33, 82], armB: [8, 38], weapon: 4 },
  arms: {
    guard: { armF: [60, 160], armB: [70, 170], weapon: 0, z: { armBFront: true } },
    hurt: { armF: [-10, 60], armB: [-30, 30], weapon: -20 },
    hurt2: { armF: [-40, 30], armB: [-70, -10], weapon: -40 },
    gut: { armF: [40, 110], armB: [30, 120], weapon: 10, z: { armBFront: true } },
    flail: { armF: [120, 150], armB: [150, 170], weapon: 200 },
    down: { armF: [10, 20], armB: [-10, 10], weapon: 80 },
    stagger: { armF: [150, 200], armB: [-60, -20], weapon: 230 },
  },
  moves: {
    light: {
      startup: [{ lean: -2, rootX: -2, armB: [-20, 60], armF: [30, 80], weapon: -10, z: { armBFront: true } }],
      charge: [{ lean: -6, rootX: -4, armB: [-40, 50], armF: [20, 70], weapon: -15, legF: [-20, -34], legB: [28, -2], z: { armBFront: true } }],
      active: [{ lean: 18, rootX: 4, armB: [88, 95], armF: [10, 40], weapon: -10, legF: [-24, -40], legB: [36, 2], z: { armBFront: true } }],
      recovery: [
        { lean: 12, rootX: 3, armB: [62, 92], armF: [16, 50], weapon: -6, legF: [-20, -36], legB: [30, 0], z: { armBFront: true } },
        { lean: 6, rootX: 1, armB: [24, 52] },
      ],
      sm: ["handB"],
    },
    medium: {
      startup: [
        { lean: 0, rootX: -1, armF: [-10, 20], weapon: -30, ext: 1 },
        { lean: -4, rootX: -2, armF: [-40, -30], weapon: -62, ext: 2 },
      ],
      charge: [{ lean: -8, rootX: -4, armF: [-55, -45], weapon: -82, ext: 2, legF: [-20, -34], legB: [28, -2] }],
      active: [
        { lean: 6, bend: -4, rootX: 3, armF: [128, 150], weapon: 150, ext: 8, legF: [-20, -36], legB: [32, 0] },
        { lean: 4, bend: -4, rootX: 3, armF: [148, 168], weapon: 182, ext: 8, legF: [-20, -36], legB: [32, 0] },
      ],
      recovery: [
        { lean: 2, rootX: 2, armF: [112, 150], weapon: 120, ext: 4 },
        { lean: 4, rootX: 1, armF: [50, 90], weapon: 40, ext: 0 },
      ],
      sm: ["weapon"],
    },
    heavy: {
      startup: [
        { lean: -4, armF: [150, 180], weapon: 180, ext: 4 },
        { lean: -8, armF: [134, 162], weapon: 270, ext: 8 },
      ],
      charge: [
        { lean: -8, rootX: -3, armF: [132, 160], weapon: 0, ext: 8 },
        { lean: -8, rootX: -3, armF: [132, 160], weapon: 90, ext: 8 },
        { lean: -8, rootX: -3, armF: [132, 160], weapon: 180, ext: 8 },
        { lean: -8, rootX: -3, armF: [132, 160], weapon: 270, ext: 8 },
      ],
      active: [
        { lean: 22, bend: 6, rootX: 6, armF: [95, 95], weapon: 95, ext: 28, legF: [-34, -54], legB: [48, 4] },
        { lean: 22, bend: 6, rootX: 6, armF: [93, 93], weapon: 92, ext: 33, legF: [-34, -54], legB: [48, 4] },
      ],
      recovery: [
        { lean: 18, bend: 4, rootX: 5, armF: [90, 90], weapon: 80, ext: 20, legF: [-30, -48], legB: [42, 2] },
        { lean: 10, bend: 2, rootX: 2, armF: [60, 85], weapon: 40, ext: 8 },
        { lean: 6, bend: 2, rootX: 1, armF: [38, 85], weapon: 6, ext: 0 },
      ],
      sm: ["weapon"],
    },
    air: {
      startup: [air({ lean: -6, armF: [150, 180], weapon: 200, ext: 4 })],
      charge: [air({ lean: -6, armF: [150, 180], weapon: 200, ext: 4 })],
      active: [air({ lean: 16, armF: [70, 40], weapon: 30, ext: 14 }), air({ lean: 16, armF: [66, 36], weapon: 24, ext: 16 })],
      recovery: [{ lean: 20, bend: 10, sy: 0.86, armF: [60, 40], weapon: 10, ext: 4, legF: [30, -58], legB: [66, -22] }],
      sm: ["weapon"],
    },
  },
  intro: [
    { lean: 0, bend: 0, armF: [24, 124], armB: [34, 124], weapon: 0, legF: [-6, -10], legB: [12, 0], z: { armBFront: true } },
    { lean: 0, bend: 0, armF: [24, 124], armB: [34, 124], weapon: 0, legF: [-6, -10], legB: [12, 0], z: { armBFront: true } },
    { lean: 2, bend: 0, armF: [140, 168], armB: [20, 40], weapon: 0, legF: [-8, -14], legB: [16, 0] },
    {},
  ],
  win: [
    { lean: -2, bend: -2, armF: [140, 168], armB: [20, 40], weapon: 0, ext: 2, legF: [-8, -14], legB: [16, 0] },
    { lean: 0, bend: 0, armF: [24, 124], armB: [34, 124], weapon: 0, legF: [-6, -10], legB: [12, 0], z: { armBFront: true } },
    { lean: 0, bend: 0, sy: 0.97, armF: [24, 122], armB: [34, 122], weapon: 2, legF: [-6, -10], legB: [12, 0], z: { armBFront: true } },
  ],
  finisher: [
    { at: 0, d: { lean: -8, armF: [132, 160], weapon: 0, ext: 8 } },
    { at: 6, d: { lean: -8, armF: [132, 160], weapon: 90, ext: 8 } },
    { at: 12, d: { lean: -8, armF: [132, 160], weapon: 180, ext: 8 } },
    { at: 18, d: { lean: -8, armF: [132, 160], weapon: 270, ext: 8 } },
    { at: 24, d: { lean: -8, armF: [132, 160], weapon: 0, ext: 10 } },
    { at: 29, d: { lean: -8, armF: [132, 160], weapon: 90, ext: 10 } },
    { at: 34, d: { lean: -8, armF: [132, 160], weapon: 180, ext: 10 } },
    { at: 39, d: { lean: -8, armF: [132, 160], weapon: 270, ext: 10 } },
    { at: 43, tint: 1, d: { lean: -8, armF: [132, 160], weapon: 0, ext: 12 } },
    { at: 47, d: { lean: -8, armF: [132, 160], weapon: 90, ext: 12 } },
    { at: 51, d: { lean: -2, rootX: -2, armB: [-20, 60], armF: [30, 80], weapon: -10, z: { armBFront: true } } },
    { at: 56, from: 51, sm: ["handB"], d: { lean: 18, rootX: 4, armB: [88, 95], armF: [10, 40], weapon: -10, legF: [-24, -40], legB: [36, 2], z: { armBFront: true } } },
    { at: 62, d: { lean: 12, rootX: 3, armB: [62, 92], armF: [16, 50], weapon: -6, z: { armBFront: true } } },
    { at: 67, d: { lean: -4, rootX: -2, armF: [-40, -30], weapon: -62, ext: 2 } },
    { at: 72, from: 67, sm: ["weapon"], d: { lean: 6, bend: -4, rootX: 3, armF: [128, 150], weapon: 150, ext: 8, legF: [-20, -36], legB: [32, 0] } },
    { at: 78, d: { lean: 4, bend: -4, rootX: 3, armF: [148, 168], weapon: 182, ext: 8 } },
    { at: 83, d: { lean: -2, rootX: -1, armB: [-20, 60], armF: [150, 175], weapon: 180, ext: 6, z: { armBFront: true } } },
    { at: 88, from: 83, sm: ["handB"], d: { lean: 20, rootX: 5, armB: [90, 92], armF: [140, 170], weapon: 160, ext: 6, legF: [-26, -42], legB: [38, 2], z: { armBFront: true } } },
    { at: 94, d: { lean: 12, rootX: 3, armB: [62, 92], armF: [150, 175], weapon: 200, ext: 8, z: { armBFront: true } } },
    { at: 100, d: { lean: -8, rootX: -3, armF: [132, 160], weapon: 270, ext: 10 } },
    { at: 104, d: { lean: -8, rootX: -3, armF: [132, 160], weapon: 0, ext: 12 } },
    { at: 108, tint: 1, d: { lean: -8, rootX: -3, armF: [132, 160], weapon: 90, ext: 14 } },
    { at: 112, d: { lean: -8, rootX: -3, armF: [132, 160], weapon: 180, ext: 16 } },
    { at: 116, tint: 1, d: { lean: -8, rootX: -3, armF: [132, 160], weapon: 270, ext: 18 } },
    { at: 120, d: { lean: -10, rootX: -4, armF: [136, 164], weapon: 0, ext: 18 } },
    { at: 124, from: 120, sm: ["weapon"], tint: 1, d: { lean: 24, bend: 6, rootX: 7, armF: [96, 96], weapon: 96, ext: 38, legF: [-38, -58], legB: [52, 6] } },
    { at: 128, d: { lean: 24, bend: 6, rootX: 7, armF: [96, 96], weapon: 94, ext: 40, legF: [-38, -58], legB: [52, 6] } },
    { at: 140, d: { lean: 18, bend: 4, rootX: 6, armF: [90, 90], weapon: 80, ext: 26, legF: [-30, -48], legB: [42, 2] } },
    { at: 150, d: { lean: 10, bend: 2, rootX: 4, armF: [60, 85], weapon: 40, ext: 8 } },
    { at: 166, d: { lean: -2, bend: -2, rootX: 4, armF: [140, 168], armB: [20, 40], weapon: 0, ext: 2, legF: [-8, -14], legB: [16, 0] } },
    { at: 186, d: { lean: 0, bend: 0, rootX: 4, armF: [24, 124], armB: [34, 124], weapon: 0, legF: [-6, -10], legB: [12, 0], z: { armBFront: true } } },
  ],
};

export const ANIMS: Record<CharId, CharAnim> = {
  asagiri: ASAGIRI,
  yoikaze: YOIKAZE,
  grimvald: GRIMVALD,
  maelis: MAELIS,
  bazalt: BAZALT,
  oriel: ORIEL,
};
