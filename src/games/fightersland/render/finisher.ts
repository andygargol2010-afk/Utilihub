/**
 * Fightersland signature finisher presentation: per-character backdrop palette, technique name,
 * ambient particles while the cinematic plays, and the impact effects for every finisherHit.
 * Timing comes from `FINISHER` (frames since the "finisher" phase began).
 */
import type { CharId } from "../core/types";
import { FINISHER, GROUND_Y, VIEW_H, VIEW_W } from "../core/constants";
import { PK, Particles, SK, Shapes } from "./fx";
import { Surface, hash, rgb } from "./surface";

export interface FinStyle {
  /** technique name shown in the lower letterbox (a proper name, never translated) */
  name: string;
  /** backdrop base, speed line, bright speed line */
  bg: number;
  line: number;
  lineHi: number;
  /** effect colours: core, mid, rim */
  fx: readonly [number, number, number];
  /** banner gradient */
  banner: readonly [number, number, number];
}

export const FIN_STYLE: Record<CharId, FinStyle> = {
  asagiri: {
    name: "DAWNBREAK CUT",
    bg: rgb("#16133a"),
    line: rgb("#2a2a6b"),
    lineHi: rgb("#4a4fa8"),
    fx: [rgb("#ffffff"), rgb("#84c8ff"), rgb("#ff9ad0")],
    banner: [rgb("#ffffff"), rgb("#84c8ff"), rgb("#3a7bd6")],
  },
  yoikaze: {
    name: "HUNDRED GUSTS",
    bg: rgb("#0f1a0e"),
    line: rgb("#2a4a12"),
    lineHi: rgb("#5c8a1c"),
    fx: [rgb("#f6ffd0"), rgb("#d4ff6a"), rgb("#8fd12e")],
    banner: [rgb("#f6ffd0"), rgb("#d4ff6a"), rgb("#5c8a1c")],
  },
  grimvald: {
    name: "THUNDERHALL",
    bg: rgb("#0f1424"),
    line: rgb("#24418f"),
    lineHi: rgb("#3a7bd6"),
    fx: [rgb("#ffffff"), rgb("#fff08a"), rgb("#84c8ff")],
    banner: [rgb("#ffffff"), rgb("#fff08a"), rgb("#e8b83a")],
  },
  maelis: {
    name: "UNDERTOW CRESCENT",
    bg: rgb("#06202a"),
    line: rgb("#17616b"),
    lineHi: rgb("#2aa79a"),
    fx: [rgb("#eafffb"), rgb("#8ff0e6"), rgb("#36b3c4")],
    banner: [rgb("#eafffb"), rgb("#8ff0e6"), rgb("#1d6f8a")],
  },
  bazalt: {
    name: "FORGEHEART ERUPTION",
    bg: rgb("#1e0c08"),
    line: rgb("#5a2212"),
    lineHi: rgb("#a8481a"),
    fx: [rgb("#fff2b0"), rgb("#ffb64a"), rgb("#e8682a")],
    banner: [rgb("#fff2b0"), rgb("#ffb64a"), rgb("#e8682a")],
  },
  oriel: {
    name: "LAST LANTERN",
    bg: rgb("#1a1408"),
    line: rgb("#5c3a12"),
    lineHi: rgb("#a8701c"),
    fx: [rgb("#fffbe0"), rgb("#fff08a"), rgb("#e8b83a")],
    banner: [rgb("#fffbe0"), rgb("#fff08a"), rgb("#e8b83a")],
  },
};

const PETAL = rgb("#ff9ad0");
const PETAL_DARK = rgb("#d14a9a");
const SHIELD = [rgb("#c9d4de"), rgb("#8492a8"), rgb("#4a5670")] as const;
const ROCK = [rgb("#8a838d"), rgb("#544e5c"), rgb("#2e2a36")] as const;

/** Frames of the cinematic where the dark backdrop fully replaces the map. */
export const PANEL_IN = FINISHER.windup - 14;
export const PANEL_FULL = FINISHER.windup;
export const PANEL_OUT = FINISHER.final + 44;
export const PANEL_GONE = FINISHER.final + 64;
/** 2x punch-in window (centred on the pair). */
export const ZOOM_IN = FINISHER.final - 24;
export const ZOOM_OUT = FINISHER.final + 30;
export const LETTERBOX = 22;

/** 0..1 coverage of the finisher backdrop at frame pf. */
export function panelCover(pf: number): number {
  if (pf < PANEL_IN) return 0;
  if (pf < PANEL_FULL) return (pf - PANEL_IN) / (PANEL_FULL - PANEL_IN);
  if (pf < PANEL_OUT) return 1;
  if (pf < PANEL_GONE) return 1 - (pf - PANEL_OUT) / (PANEL_GONE - PANEL_OUT);
  return 0;
}

/** Letterbox bar height at frame pf. */
export function letterbox(pf: number): number {
  if (pf < PANEL_IN - 10) return 0;
  if (pf < PANEL_IN) return Math.round((LETTERBOX * (pf - PANEL_IN + 10)) / 10);
  if (pf < PANEL_GONE) return LETTERBOX;
  if (pf < PANEL_GONE + 12) return Math.round(LETTERBOX * (1 - (pf - PANEL_GONE) / 12));
  return 0;
}

/**
 * Draw the dark finisher panel with horizontal speed lines streaming against the winner's
 * direction. Lines are clipped to the play band between the letterbox bars.
 */
export function drawBackdrop(S: Surface, st: FinStyle, pf: number, dir: 1 | -1, floorY: number): void {
  S.rect(0, 0, VIEW_W, VIEW_H, st.bg);
  const speed = pf < FINISHER.final ? 5 : 9;
  for (let i = 0; i < 46; i++) {
    const y = LETTERBOX + Math.floor(hash(i + 1) * (floorY - LETTERBOX - 2));
    const w = 20 + Math.floor(hash(i + 90) * 90);
    const span = VIEW_W + w + 40;
    const base = Math.floor(hash(i + 60) * span);
    const v = speed * (0.6 + hash(i + 33) * 0.8);
    let x = Math.floor((base + pf * v) % span) - w;
    if (dir > 0) x = VIEW_W - x - w;
    S.rect(x, y, w, i % 3 === 0 ? 2 : 1, i % 4 === 0 ? st.lineHi : st.line);
  }
  S.rect(0, floorY + 1, VIEW_W, VIEW_H - floorY - 1, rgb("#0e0b14"));
  S.rect(0, floorY, VIEW_W, 1, st.lineHi);
}

export interface FxSink {
  p: Particles;
  s: Shapes;
  shake(px: number): void;
  flash(frames: number): void;
}

/** Ambient particles while the cinematic plays (called once per renderer update). */
export function finisherAmbient(
  fx: FxSink,
  char: CharId,
  pf: number,
  wx: number,
  wy: number,
  dir: 1 | -1,
  t: number,
): void {
  const st = FIN_STYLE[char];
  const [c0, c1, c2] = st.fx;
  const r = hash(t * 7 + 3);
  const r2 = hash(t * 13 + 5);
  // wind-up: energy gathers on the winner
  if (pf >= 10 && pf < FINISHER.windup && (t & 1) === 0) {
    const a = r * Math.PI * 2;
    const d = 26 + r2 * 14;
    const px = wx + Math.cos(a) * d;
    const py = wy - 30 + Math.sin(a) * d * 0.8;
    fx.p.spawn(PK.mote, px, py, (wx - px) / 14, (wy - 30 - py) / 14, 14, c0, c1, c2, 2, 0, 1);
  }
  if (pf < PANEL_FULL || pf > PANEL_OUT) return;
  switch (char) {
    case "asagiri":
      if ((t & 3) === 0)
        fx.p.spawn(PK.petal, r * VIEW_W * 1.4 - VIEW_W * 0.2 + wx - VIEW_W / 2, LETTERBOX, -dir * (0.6 + r2), 0.7 + r2 * 0.5, 120, PETAL, PETAL_DARK, PETAL_DARK, 1, 0, 1);
      break;
    case "yoikaze":
      if ((t & 1) === 0)
        fx.p.spawn(PK.wind, wx - dir * (VIEW_W / 2) * r, GROUND_Y - 8 - r2 * 70, dir * (6 + r2 * 4), 0, 14, c1, c2, c2, 14 + r * 20, 0, 1, true);
      break;
    case "grimvald":
      if ((t & 3) === 0)
        fx.p.spawn(PK.spark, wx + (r - 0.5) * 50, GROUND_Y - 20 - r2 * 50, (r2 - 0.5) * 3, (r - 0.5) * 3, 8, c0, c2, c2, 1.5, 0, 0.9);
      break;
    case "maelis":
      if ((t & 1) === 0)
        fx.p.spawn(PK.bubble, wx + (r - 0.5) * 120, GROUND_Y + 2, (r2 - 0.5) * 0.3, -0.6 - r2 * 0.8, 70, c0, c1, c2, 1 + Math.round(r2 * 1.4), 0, 1, true);
      break;
    case "bazalt":
      fx.p.spawn(PK.ember, wx + (r - 0.5) * 140, GROUND_Y - 2, (r2 - 0.5) * 0.5, -0.8 - r2 * 1.2, 60, c0, c1, c2, 2, -0.004, 1, (t & 1) === 0);
      break;
    case "oriel":
      if ((t & 1) === 0) {
        const a = t * 0.09 + r * 0.4;
        const d = 30 + r2 * 20;
        fx.p.spawn(PK.mote, wx + Math.cos(a) * d, wy - 34 + Math.sin(a) * d * 0.6, Math.cos(a + 1.6) * 0.8, -0.3, 40, c0, c1, c2, r > 0.6 ? 2 : 1, 0, 0.98);
      }
      break;
  }
}

/** Impact effects for one finisherHit event at stage (x, y). */
export function finisherHitFx(
  fx: FxSink,
  char: CharId,
  x: number,
  y: number,
  dir: 1 | -1,
  index: number,
  final: boolean,
  reduced: boolean,
): void {
  const st = FIN_STYLE[char];
  const [c0, c1, c2] = st.fx;
  const big = final ? 1 : 0;
  fx.s.spawn(SK.star, x, y, final ? 22 : 14, final ? 18 : 12, c0, c1, c2, index * 0.4 + 0.2);
  fx.s.spawn(SK.ring, x, y, final ? 46 : 20, final ? 26 : 14, c0, c1, c2);
  for (let i = 0; i < (final ? 22 : 10); i++) {
    const a = hash(index * 31 + i) * Math.PI * 2;
    const sp = 2 + hash(index * 17 + i) * (final ? 5 : 3);
    fx.p.spawn(PK.spark, x, y, Math.cos(a) * sp + dir * 1.5, Math.sin(a) * sp - 1, 12 + big * 8, c0, c1, c2, 1.2, 0.12, 0.88);
  }
  fx.shake(final ? 6 : 3);
  if (final) fx.flash(reduced ? 2 : 5);
  switch (char) {
    case "asagiri": {
      const rot = final ? 0 : index % 2 ? -0.5 : 0.45;
      fx.s.spawn(SK.slash, x, y, final ? 260 : 46, final ? 30 : 12, c0, c1, rgb("#3a7bd6"), rot);
      for (let i = 0; i < (final ? 30 : 8); i++)
        fx.p.spawn(PK.petal, x + (hash(i + index * 9) - 0.5) * 40, y + (hash(i * 3 + 1) - 0.5) * 50, dir * (0.5 + hash(i + 5) * 2.5), -1 + hash(i + 7) * 2, 60 + i, PETAL, PETAL_DARK, PETAL_DARK, 1, 0.03, 0.97);
      break;
    }
    case "yoikaze": {
      fx.s.spawn(SK.slash, x, y, final ? 120 : 30, final ? 22 : 10, c0, c1, c2, 0.75);
      fx.s.spawn(SK.slash, x, y, final ? 120 : 30, final ? 22 : 10, c0, c1, c2, -0.75);
      for (let i = 0; i < (final ? 18 : 6); i++)
        fx.p.spawn(PK.wind, x - dir * 80 + hash(i + index) * 160, y - 40 + hash(i * 5 + index) * 70, dir * (8 + hash(i) * 6), 0, 12, c0, c1, c2, 20 + hash(i * 2) * 30, 0, 1);
      break;
    }
    case "grimvald": {
      if (final || index === 2) fx.s.spawn(SK.bolt, x, y, 1, final ? 22 : 12, c0, c2, c1, hash(index + 77));
      fx.s.spawn(SK.shock, x, GROUND_Y + 1, final ? 120 : 40, final ? 30 : 16, c0, c2, c1, 0, 1, true);
      for (let i = 0; i < (final ? 14 : 5); i++) {
        const a = -Math.PI / 2 + (hash(i + index * 3) - 0.5) * 2.2;
        const sp = 2 + hash(i * 7) * 3;
        fx.p.spawn(PK.shard, x, y, Math.cos(a) * sp + dir, Math.sin(a) * sp, 50, SHIELD[0], SHIELD[1], SHIELD[2], 1, 0.22, 0.98);
      }
      break;
    }
    case "maelis": {
      fx.s.spawn(SK.crescent, x - dir * 6, y, final ? 54 : 22, final ? 26 : 14, c0, c1, c2, 0, dir);
      if (final) fx.s.spawn(SK.crescent, x - dir * 16, y, 80, 32, c0, c1, c2, 0, dir);
      for (let i = 0; i < (final ? 28 : 10); i++) {
        const a = -Math.PI / 2 + (hash(i + index * 5) - 0.5) * 2.6;
        const sp = 1.5 + hash(i * 11 + index) * (final ? 4 : 2.5);
        fx.p.spawn(PK.dot, x, y, Math.cos(a) * sp + dir * 1.2, Math.sin(a) * sp, 36, c0, c1, c2, 2, 0.16, 0.98);
      }
      for (let i = 0; i < (final ? 12 : 4); i++)
        fx.p.spawn(PK.bubble, x + (hash(i + 40) - 0.5) * 40, y + (hash(i + 41) - 0.5) * 30, (hash(i + 42) - 0.5) * 0.6, -0.5 - hash(i + 43), 50, c0, c1, c2, 1 + Math.round(hash(i + 44) * 2));
      break;
    }
    case "bazalt": {
      fx.s.spawn(SK.flash, x, y, final ? 26 : 12, final ? 20 : 10, c0, c1, c2);
      fx.s.spawn(SK.crack, x, GROUND_Y + 2, final ? 90 : 26, final ? 70 : 30, c0, c1, c2, hash(index + 3), 1, true);
      for (let i = 0; i < (final ? 40 : 12); i++) {
        const a = -Math.PI / 2 + (hash(i + index * 7) - 0.5) * (final ? 1.4 : 2.4);
        const sp = 1.5 + hash(i * 3 + index) * (final ? 6 : 3);
        fx.p.spawn(PK.ember, x + (hash(i + 9) - 0.5) * 10, final ? GROUND_Y : y, Math.cos(a) * sp, Math.sin(a) * sp, 40 + i, c0, c1, c2, 2, 0.06, 0.97);
      }
      for (let i = 0; i < (final ? 10 : 3); i++) {
        const a = -Math.PI / 2 + (hash(i + 50) - 0.5) * 2;
        fx.p.spawn(PK.shard, x, GROUND_Y - 2, Math.cos(a) * (2 + hash(i) * 3), Math.sin(a) * (3 + hash(i + 1) * 3), 50, ROCK[0], ROCK[1], ROCK[2], 1, 0.25, 0.99);
      }
      break;
    }
    case "oriel": {
      fx.s.spawn(SK.ring, x, y, final ? 70 : 30, final ? 34 : 18, c0, c1, c2);
      if (final) fx.s.spawn(SK.rays, x, y, 110, 46, c0, c1, c2, 0.1);
      for (let i = 0; i < (final ? 24 : 8); i++) {
        const a = hash(i + index * 13) * Math.PI * 2;
        const sp = 0.8 + hash(i * 5) * (final ? 3 : 1.6);
        fx.p.spawn(PK.mote, x, y, Math.cos(a) * sp, Math.sin(a) * sp, 50, c0, c1, c2, 2, -0.01, 0.95);
      }
      break;
    }
  }
}
