/**
 * Fightersland combat data: per-character frame data and global design constants,
 * ported from the combat calculator and balanced with the headless sim check.
 * All lengths are in frames (60 Hz) and logical pixels.
 */
import type { CharId, CharRatings, Strength } from "../core/types";

/** Hitbox rect relative to the fighter: x forward from the origin, y up from the feet. */
export interface BoxDef {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface GroundMoveDef {
  /** Startup frames (the first active frame comes `s` frames after the press frame). */
  s: number;
  a: number;
  r: number;
  dmg: number;
  hs: number;
  bs: number;
  pushHit: number;
  pushBlock: number;
  hit: BoxDef;
  lunge: number;
  /** Startup frame range [from, to] (1-based) over which `lunge` px are travelled. */
  lungeFrames: readonly [number, number] | null;
  /** The hitbox is a limb: the hurtbox extends forward while it is out. */
  limb: boolean;
  /** Charge decision frame: if the button is still held on this startup frame, charging starts. */
  cf: number;
  hitstop: number;
  blockstop: number;
  guardDmg: number;
  chip: number;
}

export interface AirMoveDef {
  s: number;
  dmg: number;
  hs: number;
  bs: number;
  pushHit: number;
  pushBlock: number;
  hit: BoxDef;
  land: number;
  hitstop: number;
  blockstop: number;
  guardDmg: number;
}

export interface CharDef {
  id: CharId;
  hp: number;
  guard: number;
  walkF: number;
  walkB: number;
  jumpVy: number;
  jumpG: number;
  jumpVxF: number;
  jumpVxB: number;
  launchMul: number;
  dodge: number;
  height: number;
  hurtHalfW: number;
  pushHalfW: number;
  chargeTimeMul: number;
  chargeDmg: readonly [number, number];
  chargeLunge: Readonly<Record<Strength, readonly [number, number]>> | null;
  moves: Readonly<Record<Strength, GroundMoveDef>>;
  air: AirMoveDef;
}

/** Resolved ground move at a given charge level (precomputed, never allocated per frame). */
export interface MoveVariant {
  str: Strength;
  lvl: 0 | 1 | 2;
  s: number;
  a: number;
  r: number;
  cf: number;
  dmg: number;
  launch: boolean;
  hs: number;
  bs: number;
  guardBreak: boolean;
  pushHit: number;
  pushBlock: number;
  guardDmg: number;
  chip: number;
  hitstop: number;
  blockstop: number;
  /** Extra lunge px gained by charging, travelled between release and the first active frame. */
  chargeLunge: number;
  hit: BoxDef;
  limb: boolean;
  lunge: number;
  lungeFrames: readonly [number, number] | null;
}

export interface ChargeTiming {
  t1: number;
  t2: number;
  /** Auto-release after this many charging frames. */
  hold: number;
}

export const G = {
  /** Input buffer length in simulation frames. */
  BUFFER: 6,
  /** Chain cancel window: frames after contact during which a stronger attack may cancel. */
  CW: 8,
  /** Damage multiplier by hit index inside a combo (hit 1 = index 0). */
  SCALING: [1, 0.85, 0.75, 0.65, 0.55, 0.45, 0.4, 0.35] as readonly number[],
  PARRY_WINDOW: 4,
  PARRY_LOCKOUT: 24,
  PARRY_ADV: 18,
  GB_ADV: 18,
  /** Fraction of a full-charge attack's damage dealt when it breaks the guard. */
  GB_DAMAGE: 0.45,
  DODGE_TOTAL: 24,
  DODGE_INVULN: 9,
  DODGE_TRAVEL: 14,
  /** Frames after a dodge ends before the next one is allowed. */
  DODGE_COOLDOWN: 30,
  KD_DOWN: 26,
  KD_GETUP: 18,
  /** Extra invulnerable frames after standing up (no meaty pressure for free). */
  WAKE_INVULN: 3,
  LAUNCH: { vx: 3.0, vy: 4.0, g: 0.375 },
  LAUNCH_MAX: { vx: 4.5, vy: 5.0, g: 0.375 },
  AIR_HIT: { vx: 2.0, vy: 3.5, g: 0.375 },
  KO_LAUNCH: { vx: 4.0, vy: 5.5, g: 0.375 },
  LAND: 3,
  AIR_ACTIVE_MAX: 14,
  /** Guard meter regeneration per frame after GUARD_REGEN_DELAY frames without blocking. */
  GUARD_REGEN: 0.35,
  GUARD_REGEN_DELAY: 50,
  /** Fighters can never be further apart than this (both must stay in the camera). */
  MAX_SEP: 324,
  KO_HITSTOP: 20,
  CHIP_CAN_KO: false,
} as const;

const CH: Record<Strength, { t1: number; t2: number; lunge: readonly [number, number] }> = {
  light: { t1: 12, t2: 30, lunge: [4, 8] },
  medium: { t1: 14, t2: 36, lunge: [6, 12] },
  heavy: { t1: 16, t2: 44, lunge: [8, 16] },
};

const box = (x: number, y: number, w: number, h: number): BoxDef => ({ x, y, w, h });

export const CHARS: Readonly<Record<CharId, CharDef>> = {
  asagiri: {
    id: "asagiri",
    hp: 1000, guard: 100, walkF: 2.0, walkB: 1.5,
    jumpVy: 7.0, jumpG: 0.375, jumpVxF: 2.25, jumpVxB: 1.75, launchMul: 1.0,
    dodge: 56, height: 60, hurtHalfW: 9, pushHalfW: 11,
    chargeTimeMul: 1, chargeDmg: [1.3, 1.7], chargeLunge: null,
    moves: {
      light: { s: 5, a: 2, r: 10, dmg: 40, hs: 16, bs: 10, pushHit: 6, pushBlock: 6, hit: box(8, 32, 30, 12), lunge: 0, lungeFrames: null, limb: false, cf: 5, hitstop: 5, blockstop: 4, guardDmg: 6, chip: 0 },
      medium: { s: 8, a: 3, r: 17, dmg: 70, hs: 23, bs: 16, pushHit: 10, pushBlock: 10, hit: box(10, 24, 44, 40), lunge: 0, lungeFrames: null, limb: false, cf: 8, hitstop: 8, blockstop: 6, guardDmg: 10, chip: 0 },
      heavy: { s: 15, a: 4, r: 25, dmg: 115, hs: 0, bs: 18, pushHit: 0, pushBlock: 14, hit: box(12, 18, 58, 28), lunge: 8, lungeFrames: [9, 12], limb: false, cf: 11, hitstop: 11, blockstop: 8, guardDmg: 18, chip: 12 },
    },
    air: { s: 6, dmg: 60, hs: 19, bs: 15, pushHit: 6, pushBlock: 8, hit: box(2, -16, 38, 36), land: 6, hitstop: 8, blockstop: 6, guardDmg: 10 },
  },
  yoikaze: {
    id: "yoikaze",
    hp: 930, guard: 90, walkF: 2.625, walkB: 2.125,
    jumpVy: 8.0, jumpG: 0.4375, jumpVxF: 2.75, jumpVxB: 2.25, launchMul: 1.125,
    dodge: 70, height: 56, hurtHalfW: 8, pushHalfW: 10,
    chargeTimeMul: 1, chargeDmg: [1.3, 1.7], chargeLunge: null,
    moves: {
      light: { s: 4, a: 2, r: 10, dmg: 36, hs: 15, bs: 12, pushHit: 5, pushBlock: 5, hit: box(6, 30, 24, 12), lunge: 0, lungeFrames: null, limb: true, cf: 4, hitstop: 5, blockstop: 4, guardDmg: 6, chip: 0 },
      medium: { s: 7, a: 3, r: 15, dmg: 64, hs: 20, bs: 14, pushHit: 9, pushBlock: 9, hit: box(8, 22, 36, 16), lunge: 6, lungeFrames: [3, 5], limb: true, cf: 7, hitstop: 8, blockstop: 6, guardDmg: 10, chip: 0 },
      heavy: { s: 12, a: 4, r: 22, dmg: 100, hs: 0, bs: 17, pushHit: 0, pushBlock: 12, hit: box(8, 16, 44, 30), lunge: 12, lungeFrames: [5, 10], limb: false, cf: 8, hitstop: 11, blockstop: 8, guardDmg: 18, chip: 10 },
    },
    air: { s: 5, dmg: 52, hs: 19, bs: 15, pushHit: 5, pushBlock: 7, hit: box(0, -18, 30, 30), land: 5, hitstop: 8, blockstop: 6, guardDmg: 10 },
  },
  grimvald: {
    id: "grimvald",
    hp: 1150, guard: 120, walkF: 1.5, walkB: 1.125,
    jumpVy: 6.5, jumpG: 0.375, jumpVxF: 1.75, jumpVxB: 1.25, launchMul: 0.8125,
    dodge: 42, height: 64, hurtHalfW: 12, pushHalfW: 13,
    chargeTimeMul: 1, chargeDmg: [1.3, 1.7], chargeLunge: null,
    moves: {
      light: { s: 6, a: 3, r: 11, dmg: 48, hs: 18, bs: 12, pushHit: 7, pushBlock: 7, hit: box(10, 30, 28, 14), lunge: 0, lungeFrames: null, limb: false, cf: 6, hitstop: 6, blockstop: 4, guardDmg: 7, chip: 0 },
      medium: { s: 10, a: 4, r: 20, dmg: 82, hs: 27, bs: 19, pushHit: 11, pushBlock: 12, hit: box(12, 22, 44, 22), lunge: 0, lungeFrames: null, limb: false, cf: 8, hitstop: 9, blockstop: 7, guardDmg: 12, chip: 0 },
      heavy: { s: 19, a: 5, r: 27, dmg: 140, hs: 0, bs: 25, pushHit: 0, pushBlock: 18, hit: box(12, 10, 56, 60), lunge: 6, lungeFrames: [12, 17], limb: false, cf: 15, hitstop: 13, blockstop: 10, guardDmg: 22, chip: 21 },
    },
    air: { s: 8, dmg: 75, hs: 21, bs: 16, pushHit: 8, pushBlock: 10, hit: box(0, -20, 40, 40), land: 8, hitstop: 9, blockstop: 7, guardDmg: 12 },
  },
  maelis: {
    id: "maelis",
    hp: 930, guard: 100, walkF: 1.75, walkB: 1.625,
    jumpVy: 7.0, jumpG: 0.375, jumpVxF: 1.875, jumpVxB: 1.875, launchMul: 1.0,
    dodge: 56, height: 62, hurtHalfW: 9, pushHalfW: 11,
    chargeTimeMul: 1, chargeDmg: [1.3, 1.7], chargeLunge: null,
    moves: {
      light: { s: 6, a: 2, r: 12, dmg: 38, hs: 18, bs: 11, pushHit: 10, pushBlock: 10, hit: box(10, 30, 32, 10), lunge: 0, lungeFrames: null, limb: false, cf: 6, hitstop: 5, blockstop: 4, guardDmg: 6, chip: 0 },
      medium: { s: 10, a: 3, r: 19, dmg: 60, hs: 25, bs: 17, pushHit: 14, pushBlock: 14, hit: box(26, 28, 38, 34), lunge: 0, lungeFrames: null, limb: false, cf: 8, hitstop: 8, blockstop: 6, guardDmg: 10, chip: 0 },
      heavy: { s: 17, a: 4, r: 27, dmg: 108, hs: 0, bs: 19, pushHit: 0, pushBlock: 18, hit: box(40, 14, 46, 22), lunge: 0, lungeFrames: null, limb: false, cf: 13, hitstop: 11, blockstop: 8, guardDmg: 18, chip: 11 },
    },
    air: { s: 7, dmg: 58, hs: 19, bs: 15, pushHit: 8, pushBlock: 10, hit: box(6, -24, 44, 36), land: 7, hitstop: 8, blockstop: 6, guardDmg: 10 },
  },
  bazalt: {
    id: "bazalt",
    hp: 1050, guard: 110, walkF: 2.25, walkB: 1.25,
    jumpVy: 6.75, jumpG: 0.375, jumpVxF: 2.25, jumpVxB: 1.5, launchMul: 0.875,
    dodge: 49, height: 58, hurtHalfW: 11, pushHalfW: 12,
    chargeTimeMul: 1, chargeDmg: [1.3, 1.7], chargeLunge: null,
    moves: {
      light: { s: 5, a: 2, r: 10, dmg: 44, hs: 16, bs: 12, pushHit: 5, pushBlock: 4, hit: box(8, 34, 22, 12), lunge: 4, lungeFrames: [2, 3], limb: true, cf: 5, hitstop: 5, blockstop: 4, guardDmg: 6, chip: 0 },
      medium: { s: 8, a: 3, r: 15, dmg: 76, hs: 22, bs: 17, pushHit: 8, pushBlock: 7, hit: box(8, 24, 30, 16), lunge: 10, lungeFrames: [3, 7], limb: true, cf: 8, hitstop: 8, blockstop: 6, guardDmg: 10, chip: 0 },
      heavy: { s: 14, a: 4, r: 24, dmg: 125, hs: 0, bs: 21, pushHit: 0, pushBlock: 12, hit: box(6, 20, 38, 50), lunge: 16, lungeFrames: [6, 13], limb: true, cf: 10, hitstop: 12, blockstop: 9, guardDmg: 18, chip: 13 },
    },
    air: { s: 6, dmg: 64, hs: 19, bs: 15, pushHit: 6, pushBlock: 8, hit: box(0, -14, 28, 30), land: 6, hitstop: 8, blockstop: 6, guardDmg: 10 },
  },
  oriel: {
    id: "oriel",
    hp: 980, guard: 95, walkF: 1.875, walkB: 1.625,
    jumpVy: 6.5, jumpG: 0.3125, jumpVxF: 2.0, jumpVxB: 2.0, launchMul: 1.0625,
    dodge: 63, height: 60, hurtHalfW: 9, pushHalfW: 11,
    chargeTimeMul: 0.75, chargeDmg: [1.4, 1.9],
    chargeLunge: { light: [6, 12], medium: [10, 20], heavy: [14, 28] },
    moves: {
      light: { s: 5, a: 3, r: 10, dmg: 36, hs: 17, bs: 10, pushHit: 7, pushBlock: 7, hit: box(8, 30, 26, 14), lunge: 0, lungeFrames: null, limb: true, cf: 5, hitstop: 5, blockstop: 4, guardDmg: 6, chip: 0 },
      medium: { s: 9, a: 4, r: 17, dmg: 62, hs: 24, bs: 16, pushHit: 11, pushBlock: 11, hit: box(10, 18, 40, 48), lunge: 0, lungeFrames: null, limb: false, cf: 8, hitstop: 8, blockstop: 6, guardDmg: 10, chip: 0 },
      heavy: { s: 16, a: 5, r: 25, dmg: 104, hs: 0, bs: 19, pushHit: 0, pushBlock: 15, hit: box(12, 12, 50, 44), lunge: 0, lungeFrames: null, limb: false, cf: 12, hitstop: 11, blockstop: 8, guardDmg: 18, chip: 10 },
    },
    air: { s: 7, dmg: 56, hs: 19, bs: 15, pushHit: 6, pushBlock: 8, hit: box(-6, -22, 40, 36), land: 6, hitstop: 8, blockstop: 6, guardDmg: 10 },
  },
};

export const STRENGTHS: readonly Strength[] = ["light", "medium", "heavy"];

export function chargeTiming(c: CharDef, str: Strength): ChargeTiming {
  const base = CH[str];
  const t1 = Math.round(base.t1 * c.chargeTimeMul);
  const t2 = Math.round(base.t2 * c.chargeTimeMul);
  return { t1, t2, hold: t2 + 30 };
}

function buildVariant(c: CharDef, str: Strength, lvl: 0 | 1 | 2): MoveVariant {
  const m = c.moves[str];
  const lungeTable = c.chargeLunge ? c.chargeLunge[str] : CH[str].lunge;
  const mul = lvl === 0 ? 1 : lvl === 1 ? c.chargeDmg[0] : c.chargeDmg[1];
  const dmg = Math.round(m.dmg * mul);
  const launch = str === "heavy" || lvl === 2;
  return {
    str,
    lvl,
    s: m.s,
    a: m.a,
    r: m.r + (lvl === 2 ? 4 : 0),
    cf: m.cf,
    dmg,
    launch,
    hs: launch ? 0 : m.hs + (lvl === 1 ? 6 : 0),
    bs: lvl === 2 ? 0 : m.bs + (lvl === 1 ? 6 : 0),
    guardBreak: lvl === 2,
    pushHit: Math.round(m.pushHit * (lvl === 1 ? 1.25 : 1)),
    pushBlock: Math.round(m.pushBlock * (lvl === 1 ? 1.25 : 1)),
    guardDmg: lvl === 0 ? m.guardDmg : lvl === 1 ? m.guardDmg * 2 : 999,
    chip: lvl === 0 ? m.chip : lvl === 1 ? Math.round(dmg * (str === "heavy" ? 0.2 : 0.15)) : Math.round(dmg * 0.5),
    hitstop: m.hitstop + (lvl === 1 ? 2 : lvl === 2 ? 5 : 0),
    blockstop: m.blockstop + (lvl === 1 ? 2 : lvl === 2 ? 5 : 0),
    chargeLunge: lvl === 0 ? 0 : lvl === 1 ? lungeTable[0] : lungeTable[1],
    hit: m.hit,
    limb: m.limb,
    lunge: m.lunge,
    lungeFrames: m.lungeFrames,
  };
}

type VariantTable = Readonly<Record<Strength, readonly [MoveVariant, MoveVariant, MoveVariant]>>;
type TimingTable = Readonly<Record<Strength, ChargeTiming>>;

function buildTables(): { variants: Record<CharId, VariantTable>; timings: Record<CharId, TimingTable> } {
  const variants = {} as Record<CharId, VariantTable>;
  const timings = {} as Record<CharId, TimingTable>;
  for (const id of Object.keys(CHARS) as CharId[]) {
    const c = CHARS[id];
    const v = {} as Record<Strength, readonly [MoveVariant, MoveVariant, MoveVariant]>;
    const t = {} as Record<Strength, ChargeTiming>;
    for (const str of STRENGTHS) {
      v[str] = [buildVariant(c, str, 0), buildVariant(c, str, 1), buildVariant(c, str, 2)];
      t[str] = chargeTiming(c, str);
    }
    variants[id] = v;
    timings[id] = t;
  }
  return { variants, timings };
}

const TABLES = buildTables();
export const VARIANTS: Readonly<Record<CharId, VariantTable>> = TABLES.variants;
export const CHARGE: Readonly<Record<CharId, TimingTable>> = TABLES.timings;

/** Furthest forward reach (px from the origin) of a move including its lunge. */
export function moveReach(c: CharId, str: Strength, lvl: 0 | 1 | 2): number {
  const v = VARIANTS[c][str][lvl];
  return v.hit.x + v.hit.w + v.lunge + v.chargeLunge;
}

export const CHAR_RATINGS_DATA: Readonly<Record<CharId, CharRatings>> = {
  asagiri: { power: 3, speed: 3, reach: 3, health: 3 },
  yoikaze: { power: 2, speed: 5, reach: 2, health: 1 },
  grimvald: { power: 5, speed: 1, reach: 3, health: 5 },
  maelis: { power: 3, speed: 2, reach: 5, health: 2 },
  bazalt: { power: 4, speed: 3, reach: 2, health: 4 },
  oriel: { power: 3, speed: 3, reach: 3, health: 2 },
};
