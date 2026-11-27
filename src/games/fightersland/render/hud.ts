/**
 * Fightersland HUD and announcer drawing: HP bars with delayed ghost damage, guard meters,
 * portraits, names, player tags, round pips, the timer box, the combo counter and the big
 * gradient banners. Text and banners are composited once into cached 32-bit stamps.
 */
import type { CharId, SpriteFrame } from "../core/types";
import { bolden, inkRows, scale2x, textBits } from "./font";
import { Surface, blit32, mix, opaque, rgb, sprite32 } from "./surface";
import type { Pattern } from "./surface";

export const INK = rgb("#120e1a");

export const HUD = {
  ink: INK,
  panel: rgb("#1e1b2e"),
  frame: rgb("#f4f7fa"),
  frameDim: rgb("#8f93b2"),
  empty: rgb("#3a1f2e"),
  hp: [rgb("#a6e06a"), rgb("#46a84a"), rgb("#1f6b42")] as const,
  hpLow: [rgb("#f2735a"), rgb("#d1343c"), rgb("#8f1d33")] as const,
  ghost: rgb("#ffbf5e"),
  guard: rgb("#84c8ff"),
  guardLow: rgb("#f2735a"),
  text: rgb("#f4f7fa"),
  white: rgb("#ffffff"),
  gold: [rgb("#fff08a"), rgb("#e8b83a"), rgb("#e8802a")] as const,
  ice: [rgb("#ffffff"), rgb("#84c8ff"), rgb("#3a7bd6")] as const,
  red: [rgb("#ffd3a8"), rgb("#f2735a"), rgb("#d1343c")] as const,
  silver: [rgb("#ffffff"), rgb("#c9d4de"), rgb("#8492a8")] as const,
  pipOff: rgb("#34314d"),
  hitsText: rgb("#fff08a"),
};

export const PORTRAIT_BG: Record<CharId, number> = {
  asagiri: rgb("#4a4fa8"),
  yoikaze: rgb("#5c8a1c"),
  grimvald: rgb("#8f1d33"),
  maelis: rgb("#17616b"),
  bazalt: rgb("#a8481a"),
  oriel: rgb("#a8701c"),
};

/** A pre-composited RGBA image (alpha 0 = transparent). */
export interface Stamp {
  w: number;
  h: number;
  px: Uint32Array;
  /** rows of the stamp that hold the text's capitals (for vertical centring) */
  top: number;
  bottom: number;
}

const OUT8: readonly (readonly [number, number])[] = [
  [1, 0],
  [0, 1],
  [1, 1],
  [-1, 0],
  [0, -1],
  [-1, -1],
  [1, -1],
  [-1, 1],
];

const STAMPS = new Map<string, Stamp>();
const STAMP_LIMIT = 400;

function remember(key: string, s: Stamp): Stamp {
  if (STAMPS.size >= STAMP_LIMIT) STAMPS.clear();
  STAMPS.set(key, s);
  return s;
}

/** Small HUD text with a 1 px ink outline. */
export function textStamp(str: string, color: number, outline: number = INK): Stamp {
  const key = `t|${str}|${color}|${outline}`;
  const hit = STAMPS.get(key);
  if (hit) return hit;
  const g = textBits(str);
  const S = new Surface(g.w + 2, g.h + 2);
  if (outline >= 0) for (const [dx, dy] of OUT8) S.bits(g, 1 + dx, 1 + dy, outline);
  S.bits(g, 1, 1, color);
  const [a, b] = inkRows(g);
  return remember(key, { w: S.w, h: S.h, px: S.px32, top: a + 1, bottom: b + 1 });
}

/**
 * Big announcer / timer text: Scale2x-smoothed `times` times, emboldened, with a heavy ink
 * outline (deeper at the bottom) and a three-band vertical gradient.
 */
export function bannerStamp(str: string, times: number, bands: readonly [number, number, number]): Stamp {
  const key = `b|${str}|${times}|${bands[0]}|${bands[1]}|${bands[2]}`;
  const hit = STAMPS.get(key);
  if (hit) return hit;
  let g = textBits(str, 1);
  for (let i = 0; i < times; i++) g = scale2x(g);
  g = bolden(g);
  const [a, b] = inkRows(g);
  const pad = 1;
  const S = new Surface(g.w + pad * 2, g.h + pad + 3);
  const ox = pad;
  const oy = pad;
  for (const [dx, dy] of [...OUT8, [0, 2], [1, 2], [-1, 2]] as const) S.bits(g, ox + dx, oy + dy, INK);
  const ink = Math.max(1, b - a + 1);
  for (let r = a; r <= b; r++) {
    const t = (r - a) / ink;
    S.bits(g, ox, oy, t < 0.42 ? bands[0] : t < 0.62 ? bands[1] : bands[2], r, r + 1);
  }
  return remember(key, { w: S.w, h: S.h, px: S.px32, top: a + oy, bottom: b + oy });
}

export function drawStamp(S: Surface, st: Stamp, x: number, y: number, flat = -1, pat: Pattern = "solid"): void {
  blit32(S, st.px, st.w, st.h, Math.round(x), Math.round(y), false, flat, pat);
}

// ------------------------------------------------------------------------------------------ pieces

export const BAR_W = 150;

/** HP bar 150x9; side +1 = P1 (drains towards the centre... anchored right), -1 = P2 (anchored left). */
export function hpBar(S: Surface, x: number, y: number, side: 1 | -1, hp: number, ghost: number, blink: boolean): void {
  S.rect(x, y, BAR_W, 9, HUD.ink);
  S.rect(x + 1, y + 1, BAR_W - 2, 7, HUD.frame);
  S.rect(x + 2, y + 2, BAR_W - 4, 5, HUD.empty);
  const inner = BAR_W - 4;
  const wG = Math.round(inner * clamp01(ghost));
  const wH = Math.round(inner * clamp01(hp));
  const low = hp < 0.3;
  const ramp = low ? HUD.hpLow : HUD.hp;
  const gx = side > 0 ? x + 2 + inner - wG : x + 2;
  const hx = side > 0 ? x + 2 + inner - wH : x + 2;
  if (wG > wH) S.rect(gx, y + 2, wG, 5, HUD.ghost);
  if (wH > 0) {
    const mid = low && blink ? ramp[0] : ramp[1];
    S.rect(hx, y + 2, wH, 5, mid);
    S.rect(hx, y + 2, wH, 1, ramp[0]);
    S.rect(hx, y + 6, wH, 1, ramp[2]);
    // bright leading edge
    S.rect(side > 0 ? hx : hx + wH - 1, y + 2, 1, 5, ramp[0]);
  }
  for (let k = 1; k < 4; k++) {
    const tx = x + 2 + Math.round((inner * k) / 4);
    S.px(tx, y + 1, HUD.ink);
    S.px(tx, y + 7, HUD.ink);
  }
}

/** Guard meter 60x3 under the HP bar (anchored to the bar's inner end). */
export function guardBar(S: Surface, x: number, y: number, side: 1 | -1, v: number, blink: boolean): void {
  S.rect(x, y, 60, 3, HUD.ink);
  S.rect(x + 1, y + 1, 58, 1, HUD.panel);
  const w = Math.round(58 * clamp01(v));
  const c = v < 0.3 && blink ? HUD.guardLow : HUD.guard;
  S.rect(side > 0 ? x + 1 + 58 - w : x + 1, y + 1, w, 1, c);
}

/** 7x7 diamond round pip: ink rim, gold when won. */
export function pip(S: Surface, x: number, y: number, on: boolean): void {
  for (let r = 0; r < 7; r++) {
    const hw = 3 - Math.abs(3 - r);
    S.rect(x + 3 - hw, y + r, hw * 2 + 1, 1, HUD.ink);
  }
  for (let r = 1; r < 6; r++) {
    const hw = 2 - Math.abs(3 - r);
    const c = on ? (r < 3 ? HUD.gold[0] : r < 4 ? HUD.gold[1] : HUD.gold[2]) : HUD.pipOff;
    S.rect(x + 3 - hw, y + r, hw * 2 + 1, 1, c);
  }
}

/** 22x22 framed portrait; the 24x24 bust is cropped to the 18x18 window, bottom-anchored. */
export function portrait(S: Surface, x: number, y: number, p: SpriteFrame, bg: number, flip: boolean, flash: boolean): void {
  S.rect(x, y, 22, 22, HUD.ink);
  S.rect(x + 1, y + 1, 20, 20, flash ? HUD.hpLow[1] : HUD.frame);
  S.rect(x + 2, y + 2, 18, 18, bg);
  const src = sprite32(p);
  const wx0 = x + 2;
  const wy0 = y + 2;
  // centred horizontally, top-anchored one row into the bust's 2 px headroom so the face fills it
  const ax = x + 11;
  const dx = flip ? ax - (p.w - 1 - p.ox) : ax - p.ox;
  const dy = wy0 - 1;
  const d = S.px32;
  for (let sy = 0; sy < p.h; sy++) {
    const Y = dy + sy;
    if (Y < wy0 || Y >= wy0 + 18 || Y < 0 || Y >= S.h) continue;
    for (let sx = 0; sx < p.w; sx++) {
      const X = dx + sx;
      if (X < wx0 || X >= wx0 + 18 || X < 0 || X >= S.w) continue;
      const v = src[sy * p.w + (flip ? p.w - 1 - sx : sx)]!;
      if (opaque(v)) d[Y * S.w + X] = v;
    }
  }
}

/** Small coloured tag ("P1", "CPU"). Anchor = left or right edge depending on side. */
export function tag(S: Surface, label: string, x: number, y: number, side: 1 | -1, bg: number): void {
  const st = textStamp(label, HUD.text, -1);
  const w = st.w + 2;
  const x0 = side > 0 ? x : x - w;
  S.rect(x0, y, w, 10, HUD.ink);
  S.rect(x0 + 1, y + 1, w - 2, 8, bg);
  S.rect(x0 + 1, y + 1, w - 2, 1, mixLight(bg));
  drawStamp(S, st, x0 + 1, y - 1);
}

function mixLight(c: number): number {
  return mix(c, HUD.white, 0.45);
}

export function timerBox(S: Surface, text: string, low: boolean): void {
  S.rect(178, 3, 28, 20, HUD.ink);
  S.rect(179, 4, 26, 18, HUD.frame);
  S.rect(180, 5, 24, 16, HUD.panel);
  const st = bannerStamp(text, 1, low ? HUD.red : HUD.gold);
  const cy = (st.top + st.bottom) / 2;
  drawStamp(S, st, Math.round(192 - st.w / 2 + 0.5), Math.round(13 - cy));
}

export function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

