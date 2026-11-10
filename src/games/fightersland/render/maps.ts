/**
 * Fightersland stages: SUNSET QUAY (harbour pier at dusk) and FROSTGATE PASS (ruined mountain
 * gate at night). Static parallax layers are rasterised once per map (lazily, on first use) into
 * 32-bit surfaces; the ambient animation (sea glitter, swaying lanterns, gulls, stars, aurora,
 * pulsing runes, brazier flames, snowfall) is drawn per frame on top.
 */
import type { MapId } from "../core/types";
import { FLOOR_TOP, STAGE_W, VIEW_H, VIEW_W } from "../core/constants";
import { Surface, hash, rgb } from "./surface";

export const SCROLL = STAGE_W - VIEW_W;
const layerW = (f: number): number => VIEW_W + Math.ceil(SCROLL * f);

export interface Layer {
  id: string;
  s: Surface;
  /** parallax factor (0 = fixed, 1 = moves with the floor) */
  f: number;
  /** screen y of the layer's top row */
  y: number;
  /** horizontal drift in px per frame (wrapping layers only) */
  drift: number;
  wrap: boolean;
  /** per row: first / last opaque column (-1 when empty) and whether the row is fully opaque */
  x0: Int16Array;
  x1: Int16Array;
  full: Uint8Array;
}

function makeLayer(id: string, s: Surface, f: number, y: number, drift = 0, wrap = false): Layer {
  const x0 = new Int16Array(s.h).fill(-1);
  const x1 = new Int16Array(s.h).fill(-1);
  const full = new Uint8Array(s.h);
  for (let r = 0; r < s.h; r++) {
    let a = -1;
    let b = -1;
    let holes = 0;
    for (let x = 0; x < s.w; x++) {
      if (s.bytes[(r * s.w + x) * 4 + 3]) {
        if (a < 0) a = x;
        b = x;
      } else holes++;
    }
    x0[r] = a;
    x1[r] = b;
    full[r] = holes === 0 ? 1 : 0;
  }
  return { id, s, f, y, drift, wrap, x0, x1, full };
}

/** Draw one layer at camera position `cam` (stage px) and ambient time t (frames). */
export function drawLayer(S: Surface, l: Layer, cam: number, t: number): void {
  const src = l.s.px32;
  const sw = l.s.w;
  const d = S.px32;
  const W = S.w;
  let off = Math.round(cam * l.f);
  if (l.wrap) off = (((off + Math.floor(t * l.drift)) % sw) + sw) % sw;
  for (let r = 0; r < l.s.h; r++) {
    const Y = l.y + r;
    if (Y < 0 || Y >= S.h) continue;
    const a = l.x0[r]!;
    if (a < 0) continue;
    const srow = r * sw;
    const drow = Y * W;
    if (!l.wrap) {
      // screen x = sx - off
      const sx0 = Math.max(off, a);
      const sx1 = Math.min(off + W - 1, l.x1[r]!);
      if (sx1 < sx0) continue;
      if (l.full[r]) {
        d.set(src.subarray(srow + sx0, srow + sx1 + 1), drow + sx0 - off);
      } else {
        for (let sx = sx0; sx <= sx1; sx++) {
          const p = src[srow + sx]!;
          if (p !== 0) d[drow + sx - off] = p;
        }
      }
    } else {
      for (let x = 0; x < W; x++) {
        let sx = x + off;
        if (sx >= sw) sx -= sw;
        const p = src[srow + sx]!;
        if (p !== 0) d[drow + x] = p;
      }
    }
  }
}

export interface MapArt {
  id: MapId;
  layers: Layer[];
  /** shadow colour under the fighters */
  shadow: number;
  /** dust colours [light, mid, dark] */
  dust: readonly [number, number, number];
  /** finisher backdrop [base, line, line bright] */
  night: readonly [number, number, number];
  /** draw everything behind the fighters */
  back(S: Surface, cam: number, t: number): void;
  /** draw the foreground weather in front of the fighters */
  front(S: Surface, cam: number, t: number): void;
}

// ================================================================================================ SUNSET QUAY

const Q = {
  sky: ["#2a1f55", "#473a85", "#7a3f8f", "#b8506e", "#e0734f", "#f29a4a", "#ffc66e", "#ffe3a0"].map(rgb),
  sun: rgb("#fff6dc"),
  cloudBody: rgb("#8f4a7a"),
  cloudLit: rgb("#f2a65e"),
  cloudDark: rgb("#6a3a78"),
  hillFar: rgb("#d98a7a"),
  hillNear: rgb("#b8686f"),
  hillNearLit: rgb("#cf7f76"),
  sea: ["#e79a78", "#c9788a", "#a85f86", "#86507f"].map(rgb),
  seaLine: rgb("#b86a86"),
  glint: rgb("#ffe3a0"),
  town: rgb("#7d4a7c"),
  townLit: rgb("#a85f86"),
  window: rgb("#ffc66e"),
  windowDim: rgb("#d98a5e"),
  mast: rgb("#5a3560"),
  flag: rgb("#d1343c"),
  post: rgb("#57301f"),
  postLit: rgb("#8b5330"),
  rope: rgb("#8b5330"),
  lantern: rgb("#d1343c"),
  lanternLit: rgb("#ffbf5e"),
  lanternCap: rgb("#33201c"),
  plank: rgb("#a06c3a"),
  plankAlt: rgb("#96623a"),
  seam: rgb("#6b4426"),
  plankLit: rgb("#c08a52"),
  nail: rgb("#33201c"),
  fascia: rgb("#6b4426"),
  under: rgb("#33201c"),
  water: rgb("#2a1f55"),
  waterLit: rgb("#7a3f8f"),
  waterGlint: rgb("#e0734f"),
  shadow: rgb("#6b4426"),
  dust: [rgb("#d6a35e"), rgb("#c08a52"), rgb("#a06c3a")] as const,
};

const sky = (i: number): number => Q.sky[i] ?? 0;
const sea = (i: number): number => Q.sea[i] ?? 0;

/** rail-layer x of the tall lantern poles; at the centre camera they sit at screen x 44 / 340 */
const LANTERN_POLES = [-120, 140, 436, 696];
const SPANS: readonly (readonly [number, number])[] = [
  [-120, 140],
  [140, 436],
  [436, 696],
];
const CLOUD_W = 512;

function buildQuay(): Layer[] {
  const L: Layer[] = [];
  // L0 sky (fixed)
  const skyS = new Surface(VIEW_W, 140);
  skyS.bands(0, 0, VIEW_W, [
    [sky(0), 12],
    [sky(1), 12],
    [sky(2), 14],
    [sky(3), 16],
    [sky(4), 18],
    [sky(5), 20],
    [sky(6), 22],
    [sky(7), 26],
  ]);
  skyS.disc(250, 78, 18, Q.sun);
  for (const [y, xa, xb] of [
    [84, 236, 266],
    [88, 233, 268],
    [92, 240, 262],
  ] as const)
    skyS.rect(xa, y, xb - xa, 1, sky(6));
  L.push(makeLayer("sky", skyS, 0, 0));
  // L1 streak clouds (slow parallax + drift, wrapping tile)
  const cl = new Surface(CLOUD_W, 100);
  const cloud = (x: number, y: number, w: number): void => {
    cl.rect(x + 8, y, w - 20, 1, Q.cloudDark);
    cl.rect(x + 3, y + 1, w - 8, 2, Q.cloudBody);
    cl.rect(x, y + 3, w, 2, Q.cloudBody);
    cl.rect(x + 5, y + 5, w - 14, 1, Q.cloudLit);
    cl.rect(x + 12, y + 6, w - 34, 1, Q.cloudLit);
  };
  for (const [x, y, w] of [
    [10, 22, 70],
    [120, 40, 96],
    [250, 14, 58],
    [300, 58, 110],
    [60, 66, 80],
    [420, 34, 60],
    [470, 80, 34],
  ] as const)
    cloud(x, y, w);
  L.push(makeLayer("clouds", cl, 0.06, 0, 1 / 45, true));
  // L2 far hills
  const h = new Surface(layerW(0.1), 140);
  h.ridge(
    [
      [0, 118],
      [22, 110],
      [40, 113],
      [66, 100],
      [84, 104],
      [108, 96],
      [132, 108],
      [160, 114],
      [196, 120],
      [230, 116],
      [262, 104],
      [286, 98],
      [306, 106],
      [334, 112],
      [370, 102],
      [396, 110],
      [410, 116],
    ],
    140,
    Q.hillFar,
  );
  h.ridge(
    [
      [0, 130],
      [30, 124],
      [58, 126],
      [90, 120],
      [118, 128],
      [150, 132],
      [250, 132],
      [280, 126],
      [318, 122],
      [350, 127],
      [384, 124],
      [410, 128],
    ],
    140,
    Q.hillNear,
  );
  for (const [x, y, w] of [
    [26, 124, 10],
    [86, 120, 12],
    [316, 122, 12],
    [380, 124, 10],
  ] as const)
    h.rect(x, y, w, 1, Q.hillNearLit);
  L.push(makeLayer("hills", h, 0.1, 0));
  // L3 sea band (fixed); glitter is animated
  const seaS = new Surface(VIEW_W, 36);
  seaS.bands(0, 0, VIEW_W, [
    [sea(0), 3],
    [sea(1), 6],
    [sea(2), 11],
    [sea(3), 16],
  ]);
  L.push(makeLayer("sea", seaS, 0, 136));
  // L4 harbour town on stilts
  const t = new Surface(layerW(0.3), 172);
  const house = (x: number, w: number, hh: number, roof: number): void => {
    const y = 160 - hh;
    t.rect(x, y, w, hh, Q.town);
    t.polyPts(
      [
        [x - 3, y],
        [x + w / 2, y - roof],
        [x + w + 3, y],
      ],
      Q.town,
    );
    t.rect(x - 3, y, w + 6, 1, Q.townLit);
    for (let sx = x + 2; sx < x + w - 1; sx += Math.max(6, w - 5)) t.rect(sx, 160, 2, 12, Q.town);
    for (let wy = y + 5; wy < 156; wy += 8)
      for (let wx = x + 3; wx < x + w - 3; wx += 6) if (hash(wx * 31 + wy * 17) < 0.55) t.rect(wx, wy, 2, 3, Q.window);
  };
  for (const [x, w, hh, r] of [
    [14, 22, 26, 8],
    [40, 16, 34, 6],
    [60, 26, 22, 9],
    [150, 18, 30, 7],
    [172, 28, 24, 10],
    [300, 20, 28, 7],
    [324, 30, 36, 11],
    [360, 18, 22, 6],
    [420, 24, 30, 8],
  ] as const)
    house(x, w, hh, r);
  // watchtower with lamp + two ship masts
  t.rect(232, 96, 10, 64, Q.town);
  t.rect(229, 92, 16, 5, Q.town);
  t.polyPts(
    [
      [228, 92],
      [237, 82],
      [246, 92],
    ],
    Q.town,
  );
  t.rect(235, 98, 4, 4, Q.window);
  t.rect(232, 160, 2, 12, Q.town);
  t.rect(240, 160, 2, 12, Q.town);
  t.rect(237, 76, 1, 7, Q.mast);
  for (const mx of [104, 268]) {
    t.rect(mx, 104, 1, 60, Q.mast);
    t.rect(mx - 9, 116, 19, 1, Q.mast);
    t.rect(mx - 6, 130, 13, 1, Q.mast);
    t.polyPts(
      [
        [mx - 16, 162],
        [mx + 18, 162],
        [mx + 13, 168],
        [mx - 12, 168],
      ],
      Q.mast,
    );
  }
  L.push(makeLayer("town", t, 0.3, 0));
  // L5 railing posts + rope; lantern strings are animated
  const r = new Surface(layerW(0.75), 172);
  for (let x = 12; x < r.w; x += 48) {
    r.rect(x, 150, 5, 22, Q.post);
    r.rect(x, 150, 1, 22, Q.postLit);
    r.rect(x - 1, 148, 7, 2, Q.postLit);
    if (x + 48 < r.w)
      for (let i = 0; i <= 43; i++) {
        const u = i / 43;
        r.px(x + 5 + i, Math.round(154 + 5 * 4 * u * (1 - u)), Q.rope);
      }
  }
  for (const px of LANTERN_POLES) {
    r.rect(px, 86, 3, 86, Q.post);
    r.rect(px, 86, 1, 86, Q.postLit);
    r.rect(px - 2, 84, 7, 2, Q.postLit);
  }
  L.push(makeLayer("rail", r, 0.75, 0));
  // L6 pier deck (moves with the fighters)
  const fl = new Surface(STAGE_W, VIEW_H - FLOOR_TOP);
  const rows = [3, 4, 5, 6, 7, 8];
  let y = 0;
  rows.forEach((rh, i) => {
    fl.rect(0, y, STAGE_W, rh, i % 2 ? Q.plankAlt : Q.plank);
    fl.rect(0, y, STAGE_W, 1, i === 0 ? Q.plankLit : Q.seam);
    const step = 40 + i * 12;
    for (let x = Math.floor(hash(i * 7) * step); x < STAGE_W; x += step) {
      fl.rect(x, y + 1, 1, rh - 1, Q.seam);
      if (rh > 3) {
        fl.px(x - 2, y + 2, Q.nail);
        fl.px(x + 2, y + 2, Q.nail);
      }
    }
    for (let k = 0; k < 14; k++) {
      const x = Math.floor(hash(i * 100 + k) * STAGE_W);
      const w = 4 + Math.floor(hash(i * 100 + k + 50) * 10);
      if (rh > 3) fl.rect(x, y + 1 + Math.floor(hash(k + i) * (rh - 2)), w, 1, Q.plankLit);
    }
    y += rh;
  });
  fl.rect(0, y, STAGE_W, 6, Q.fascia);
  fl.rect(0, y, STAGE_W, 1, Q.plankLit);
  fl.rect(0, y + 5, STAGE_W, 1, Q.under);
  fl.rect(0, y + 6, STAGE_W, 5, Q.water);
  for (let x = 20; x < STAGE_W; x += 96) fl.rect(x, y + 1, 7, 10, Q.under);
  L.push(makeLayer("floor", fl, 1, FLOOR_TOP));
  return L;
}

const QUAY_WATER_Y = FLOOR_TOP + 33 + 6;

function animQuaySea(S: Surface, t: number): void {
  // slow swell lines across the sea band
  for (let i = 0; i < 6; i++) {
    const y = 142 + i * 5;
    const x0 = Math.floor(hash(i * 11 + 3) * 200 + t * (0.05 + i * 0.012)) % (VIEW_W + 80);
    const w = 18 + Math.floor(hash(i * 5 + 1) * 26);
    S.rect(x0 - 40, y, w, 1, Q.seaLine);
    S.rect(((x0 + 190) % (VIEW_W + 80)) - 40, y + 2, w - 8, 1, Q.seaLine);
  }
  // sun glitter under the sun, shimmering every 20 frames
  const ph = Math.floor(t / 20);
  for (let i = 0; i < 9; i++) {
    const y = 137 + i * 3 + (i > 4 ? i - 4 : 0);
    if (y >= 170) break;
    const w = 30 - i * 3 + ((ph + i) % 3) * 2;
    const x = 250 - (w >> 1) + ((ph + i) & 1 ? 1 : -1);
    S.rect(x, y, w, 1, i < 2 ? Q.sun : Q.glint);
  }
}

function animQuayTown(S: Surface, cam: number, t: number): void {
  // pennant on the watchtower (2-frame flutter)
  const ox = -Math.round(cam * 0.3);
  const up = Math.floor(t / 14) & 1;
  S.rect(ox + 238, 76, 5, 1, Q.flag);
  S.rect(ox + 238, 77, up ? 3 : 4, 1, Q.flag);
  S.px(ox + 243 + (up ? 0 : -1), 76 + up, Q.flag);
  // one window per house flickers slowly
  const w = Math.floor(t / 90) % 4;
  const win: readonly (readonly [number, number])[] = [
    [17, 139],
    [175, 141],
    [327, 129],
    [423, 135],
  ];
  const p = win[w];
  if (p) S.rect(ox + p[0], p[1], 2, 3, Q.windowDim);
}

function animQuayRail(S: Surface, cam: number, t: number): void {
  const off = -Math.round(cam * 0.75);
  for (const [a, b] of SPANS) {
    for (let i = 0; i <= 74; i++) {
      const u = i / 74;
      S.px(off + Math.round(a + 1 + (b - a) * u), Math.round(87 + 14 * 4 * u * (1 - u)), Q.rope);
    }
    for (let i = 1; i <= 7; i++) {
      const u = i / 8;
      const x = off + Math.round(a + 1 + (b - a) * u);
      if (x < -6 || x > VIEW_W + 6) continue;
      const y = Math.round(88 + 14 * 4 * u * (1 - u));
      const sw = Math.round(Math.sin(t / 40 + i * 0.9 + a));
      S.px(x, y, Q.rope);
      S.rect(x - 2 + sw, y + 1, 5, 1, Q.lanternCap);
      S.rect(x - 2 + sw, y + 2, 5, 5, Q.lantern);
      S.rect(x - 1 + sw, y + 3, 3, 3, Q.lanternLit);
      S.px(x + sw, y + 7, Q.lanternCap);
    }
  }
  // gulls: 3 birds, 2-frame flap
  for (let g = 0; g < 3; g++) {
    const x = Math.round((t * (0.25 + g * 0.07) + g * 150) % (VIEW_W + 40)) - 20;
    const y = 30 + g * 13 + Math.round(2 * Math.sin(t / 30 + g));
    const up = (Math.floor(t / 12 + g) & 1) === 1;
    const c = sky(0);
    S.px(x, y, c);
    S.px(x - 1, y + (up ? -1 : 1), c);
    S.px(x + 1, y + (up ? -1 : 1), c);
    S.px(x - 2, y + (up ? -1 : 0), c);
    S.px(x + 2, y + (up ? -1 : 0), c);
  }
}

function animQuayFloor(S: Surface, cam: number, t: number): void {
  // ripples on the dark water under the pier (they drift with the deck's parallax)
  for (let k = 0; k < 40; k++) {
    const base = Math.floor(hash(900 + k) * STAGE_W);
    const x = ((base + Math.floor(t / (18 + (k % 5) * 6)) * (k & 1 ? 1 : -1)) % STAGE_W + STAGE_W) % STAGE_W;
    const sx = x - Math.round(cam);
    if (sx < -8 || sx > VIEW_W) continue;
    const y = QUAY_WATER_Y + 1 + (k % 4);
    if (y >= VIEW_H) continue;
    S.rect(sx, y, 3 + (k % 5), 1, (k + Math.floor(t / 40)) % 9 === 0 ? Q.waterGlint : Q.waterLit);
  }
}

// ================================================================================================ FROSTGATE PASS

const F = {
  sky: ["#0e1235", "#151c4a", "#1d2a63", "#25346b", "#33508a", "#4a6fa5", "#6f93bd"].map(rgb),
  star: rgb("#d9f0f5"),
  starDim: rgb("#84c8ff"),
  moon: rgb("#fff6dc"),
  moonShade: rgb("#dccdaa"),
  aurora: rgb("#2aa79a"),
  auroraLit: rgb("#7ff0c8"),
  peak: rgb("#8fb0cc"),
  peakShade: rgb("#5d7fa3"),
  snowcap: rgb("#d9f0f5"),
  field: rgb("#86aacb"),
  fieldLit: rgb("#b4d3e4"),
  stone: rgb("#56688c"),
  stoneLit: rgb("#8492a8"),
  stoneDark: rgb("#3a4767"),
  rune: rgb("#7ff0c8"),
  runeDim: rgb("#2aa79a"),
  pine: rgb("#3f6090"),
  pineDark: rgb("#2c4674"),
  pineSnow: rgb("#d9f0f5"),
  ped: rgb("#544e5c"),
  pedLit: rgb("#8a838d"),
  bowl: rgb("#2e2a36"),
  flame: [rgb("#e8802a"), rgb("#ffbf5e"), rgb("#fff08a")] as const,
  glow: rgb("#c9a27a"),
  slab: rgb("#8492a8"),
  slabAlt: rgb("#7a88a0"),
  slabSeam: rgb("#4a5670"),
  slabLit: rgb("#c9d4de"),
  snow: rgb("#d8dbe8"),
  snowLit: rgb("#ffffff"),
  snowShade: rgb("#8f93b2"),
  shadow: rgb("#4a5670"),
  dust: [rgb("#ffffff"), rgb("#d8dbe8"), rgb("#8f93b2")] as const,
};
const fsky = (i: number): number => F.sky[i] ?? 0;

const RUNES: readonly (readonly [number, number])[] = [
  [154, 96],
  [154, 110],
  [154, 124],
  [154, 138],
  [230, 96],
  [230, 110],
  [230, 124],
  [230, 138],
  [168, 74],
  [186, 74],
  [204, 74],
  [222, 74],
];
const BRAZIERS = [92, 208, 344, 452];

function buildFrost(): Layer[] {
  const L: Layer[] = [];
  const skyS = new Surface(VIEW_W, 150);
  skyS.bands(0, 0, VIEW_W, [
    [fsky(0), 16],
    [fsky(1), 18],
    [fsky(2), 20],
    [fsky(3), 22],
    [fsky(4), 24],
    [fsky(5), 24],
    [fsky(6), 26],
  ]);
  skyS.disc(92, 44, 16, F.moon);
  skyS.disc(86, 40, 3, F.moonShade);
  skyS.disc(98, 50, 2, F.moonShade);
  skyS.disc(95, 36, 1, F.moonShade);
  L.push(makeLayer("sky", skyS, 0, 0));
  // far peaks: lit left face + shaded right face + snow cap
  const p = new Surface(layerW(0.08), 152);
  const peak = (x: number, top: number, hw: number): void => {
    p.polyPts(
      [
        [x - hw, 152],
        [x, top],
        [x + hw, 152],
      ],
      F.peak,
    );
    p.polyPts(
      [
        [x, top],
        [x + hw, 152],
        [x + Math.round(hw * 0.25), 152],
        [x + 2, top + 14],
      ],
      F.peakShade,
    );
    const ch = Math.round((152 - top) * 0.28);
    const cw = Math.round((hw * ch) / (152 - top));
    p.polyPts(
      [
        [x, top],
        [x - cw, top + ch],
        [x - 3, top + ch - 4],
        [x + 1, top + ch],
        [x + 4, top + ch - 5],
        [x + cw, top + ch],
      ],
      F.snowcap,
    );
  };
  for (const [x, top, hw] of [
    [30, 98, 46],
    [96, 84, 58],
    [170, 104, 44],
    [236, 78, 66],
    [318, 96, 52],
    [384, 88, 50],
  ] as const)
    peak(x, top, hw);
  L.push(makeLayer("peaks", p, 0.08, 0));
  // snowfield strip (fixed)
  const f = new Surface(VIEW_W, 22);
  f.rect(0, 0, VIEW_W, 22, F.field);
  f.rect(0, 0, VIEW_W, 1, F.fieldLit);
  for (let k = 0; k < 26; k++)
    f.rect(
      Math.floor(hash(k + 5) * VIEW_W),
      2 + Math.floor(hash(k + 77) * 18),
      8 + Math.floor(hash(k + 9) * 22),
      1,
      F.fieldLit,
    );
  L.push(makeLayer("field", f, 0, 150));
  // ruined gate + pines
  const g = new Surface(layerW(0.3), 172);
  const pine = (x: number, base: number, hh: number): void => {
    for (let i = 0; i < 4; i++) {
      const w = 6 + i * 4;
      const y = base - hh + i * Math.round(hh / 4.6);
      const third = Math.round(hh / 3);
      g.polyPts(
        [
          [x, y],
          [x + w, y + third],
          [x - w, y + third],
        ],
        i % 2 ? F.pineDark : F.pine,
      );
      g.polyPts(
        [
          [x, y],
          [x + 3, y + 4],
          [x - 1, y + 3],
          [x - 4, y + 5],
        ],
        F.pineSnow,
      );
      g.rect(x - w + 2, y + third - 1, Math.round(w * 0.9), 1, F.pineSnow);
    }
    g.rect(x - 1, base - 6, 3, 6, F.pineDark);
  };
  for (const [x, hh] of [
    [20, 52],
    [44, 40],
    [300, 46],
    [330, 58],
    [440, 44],
  ] as const)
    pine(x, 162, hh);
  const pillar = (x: number, top: number, w: number): void => {
    g.rect(x, top, w, 164 - top, F.stone);
    g.rect(x, top, 2, 164 - top, F.stoneLit);
    g.rect(x + w - 3, top, 3, 164 - top, F.stoneDark);
    g.rect(x - 2, top - 3, w + 4, 3, F.snowcap);
    g.rect(x - 2, 160, w + 4, 4, F.stoneDark);
  };
  pillar(150, 84, 16);
  pillar(226, 84, 16);
  g.rect(142, 70, 108, 14, F.stone);
  g.rect(142, 70, 108, 2, F.snowcap);
  g.rect(142, 82, 108, 2, F.stoneDark);
  g.rect(142, 72, 2, 10, F.stoneLit);
  pillar(96, 122, 12);
  pillar(282, 108, 12);
  L.push(makeLayer("gate", g, 0.3, 0));
  // near wall + brazier pedestals
  const w = new Surface(layerW(0.7), 172);
  for (const [x, ww] of [
    [0, 70],
    [120, 56],
    [236, 84],
    [380, 60],
    [470, 94],
  ] as const) {
    w.rect(x, 160, ww, 12, F.stone);
    w.rect(x, 158, ww, 3, F.snow);
    w.rect(x + 2, 157, ww - 6, 1, F.snowLit);
    for (let sx = x + 12; sx < x + ww; sx += 14) w.rect(sx, 163, 1, 9, F.stoneDark);
    w.rect(x, 166, ww, 1, F.stoneDark);
  }
  for (const bx of BRAZIERS) {
    w.rect(bx, 146, 10, 26, F.ped);
    w.rect(bx, 146, 2, 26, F.pedLit);
    w.rect(bx - 3, 142, 16, 4, F.bowl);
    w.rect(bx - 2, 142, 14, 1, F.pedLit);
  }
  L.push(makeLayer("wall", w, 0.7, 0));
  // flagstones with snow drifts
  const fl = new Surface(STAGE_W, VIEW_H - FLOOR_TOP);
  const rows = [4, 6, 8, 10, 12];
  let y = 0;
  rows.forEach((rh, i) => {
    fl.rect(0, y, STAGE_W, rh, i % 2 ? F.slabAlt : F.slab);
    fl.rect(0, y, STAGE_W, 1, i === 0 ? F.slabLit : F.slabSeam);
    const step = 34 + i * 14;
    for (let x = Math.floor(hash(i * 13 + 3) * step); x < STAGE_W; x += step + Math.floor(hash(x + i) * 12)) {
      fl.rect(x, y + 1, 1, rh - 1, F.slabSeam);
      fl.rect(x + 1, y + 1, 1, rh - 1, F.slabLit);
    }
    for (let k = 0; k < 9; k++) {
      const x = Math.floor(hash(i * 200 + k) * STAGE_W);
      const ww = 8 + Math.floor(hash(i * 200 + k + 9) * 18);
      fl.rect(x, y + 1, ww, Math.min(2, rh - 1), F.snow);
      fl.rect(x + 2, y + 1, Math.max(2, ww - 6), 1, F.snowLit);
    }
    y += rh;
  });
  fl.rect(0, y, STAGE_W, 4, F.snow);
  fl.rect(0, y, STAGE_W, 1, F.snowLit);
  for (let x = 0; x < STAGE_W; x += 2) if (hash(x) < 0.5) fl.px(x, y + 3, F.snowShade);
  L.push(makeLayer("floor", fl, 1, FLOOR_TOP));
  return L;
}

/** 4 flame frames, 9x11, anchor bottom-centre; 1 = outer, 2 = mid, 3 = core */
const FLAME = [
  ["....1....", "....1....", "...121...", "...121...", "..12221..", "..12321..", ".1223221.", ".1233321.", ".1233321.", "..12321..", "...111..."],
  ["...1.....", "...11....", "...121...", "..1221...", "..12221..", ".122321..", ".1223221.", ".1233321.", ".1233321.", "..12321..", "...111..."],
  [".....1...", "....11...", "...121...", "...1221..", "..12221..", "..123221.", ".1223221.", ".1233321.", ".1233321.", "..12321..", "...111..."],
  ["....1....", "...111...", "...121...", "..12221..", "..12321..", ".1223221.", ".1233321.", ".1233321.", ".1233321.", "..12321..", "...111..."],
].map((rows) => {
  const d = new Uint8Array(9 * 11);
  rows.forEach((r, y) => {
    for (let x = 0; x < 9; x++) d[y * 9 + x] = r.charCodeAt(x) === 46 ? 0 : r.charCodeAt(x) - 48;
  });
  return d;
});

const STARS = (() => {
  const a = new Int16Array(70 * 2);
  for (let i = 0; i < 70; i++) {
    a[i * 2] = Math.floor(hash(i * 3 + 1) * VIEW_W);
    a[i * 2 + 1] = Math.floor(hash(i * 3 + 2) * 84);
  }
  return a;
})();

function animFrostSky(S: Surface, t: number): void {
  const ph = Math.floor(t / 24);
  for (let i = 0; i < 70; i++) {
    const tw = (ph + i) % 7;
    if (tw === 0) continue;
    S.px(STARS[i * 2]!, STARS[i * 2 + 1]!, tw < 3 ? F.starDim : F.star);
  }
  // shooting star every ~14 s
  const st = t % 840;
  if (st < 24) {
    const sx = 300 - st * 5;
    const sy = 14 + st * 2;
    S.line(sx, sy, sx + 8, sy - 3, F.starDim);
    S.px(sx, sy, F.star);
  }
  for (let x = 0; x < VIEW_W; x += 2) {
    for (let b = 0; b < 2; b++) {
      const base = b ? 56 : 34;
      const amp = b ? 7 : 9;
      const sp = b ? -0.6 : 0.8;
      const hh = b ? 9 : 12;
      const yTop = Math.round(base + amp * Math.sin(x / 41 + (t * sp) / 90) + 4 * Math.sin(x / 17 - (t * sp) / 140));
      const len = Math.round(hh + 5 * Math.sin(x / 23 + t / 70));
      S.rect(x, yTop, 2, 2, F.auroraLit);
      S.dither(x, yTop + 2, 2, Math.max(2, len >> 1), F.aurora, "c50");
      S.dither(x, yTop + 2 + (len >> 1), 2, len >> 1, F.aurora, "c25");
    }
  }
}

function animFrostGate(S: Surface, cam: number, t: number): void {
  const go = -Math.round(cam * 0.3);
  const pulse = Math.floor(t / 30) % 4;
  RUNES.forEach(([x, y], i) => {
    const lit = (i + pulse) % 4 < 2;
    const c = lit ? F.rune : F.runeDim;
    S.rect(go + x + 3, y, 2, 6, c);
    S.rect(go + x + 1, y + 2, 6, 1, c);
  });
}

function animFrostWall(S: Surface, cam: number, t: number): void {
  const wo = -Math.round(cam * 0.7);
  const fr = Math.floor(t / 6) % 4;
  const big = Math.floor(t / 9) % 2;
  const flame = FLAME[fr];
  if (!flame) return;
  for (let k = 0; k < BRAZIERS.length; k++) {
    const cx = wo + BRAZIERS[k]! + 5;
    if (cx < -20 || cx > VIEW_W + 20) continue;
    S.disc(cx, 136, big ? 15 : 13, F.glow, "c25");
    S.disc(cx, 136, big ? 9 : 8, F.glow, "c50");
    for (let r = 0; r < 11; r++) {
      for (let c = 0; c < 9; c++) {
        const v = flame[r * 9 + c]!;
        if (v) S.px(cx - 4 + c, 131 + r, F.flame[v - 1] ?? F.glow);
      }
    }
    // embers rising from the bowl
    for (let e = 0; e < 2; e++) {
      const life = (t + k * 37 + e * 23) % 46;
      const ex = cx + Math.round(Math.sin((t + e * 40 + k * 9) / 9) * 2) + (e ? 2 : -2);
      S.px(ex, 130 - Math.floor(life / 2), life < 30 ? F.flame[1] : F.flame[0]);
    }
  }
}

function animFrostSnow(S: Surface, t: number, near: boolean): void {
  const n = near ? 16 : 26;
  for (let i = 0; i < n; i++) {
    const sp = near ? 0.75 + hash(i + 300) * 0.3 : 0.3 + hash(i + 100) * 0.2;
    const y = Math.floor((hash(i + (near ? 500 : 0)) * VIEW_H + t * sp) % VIEW_H);
    const x = Math.floor(
      (((hash(i + (near ? 700 : 40)) * VIEW_W + 10 * Math.sin(t / 50 + i) + t * (near ? 0.25 : 0.1)) % VIEW_W) +
        VIEW_W) %
        VIEW_W,
    );
    if (near) S.rect(x, y, 2, 2, F.snowLit);
    else S.px(x, y, F.snow);
  }
}

// ================================================================================================ registry

function drawLayersWith(
  S: Surface,
  L: readonly Layer[],
  cam: number,
  t: number,
  hook: (id: string) => void,
): void {
  for (const l of L) {
    drawLayer(S, l, cam, t);
    hook(l.id);
  }
}

const CACHE = new Map<MapId, MapArt>();

function quayArt(): MapArt {
  const layers = buildQuay();
  let hS: Surface = new Surface(1, 1);
  let hCam = 0;
  let hT = 0;
  const hook = (id: string): void => {
    if (id === "sea") animQuaySea(hS, hT);
    else if (id === "town") animQuayTown(hS, hCam, hT);
    else if (id === "rail") animQuayRail(hS, hCam, hT);
    else if (id === "floor") animQuayFloor(hS, hCam, hT);
  };
  return {
    id: "quay",
    layers,
    shadow: Q.shadow,
    dust: Q.dust,
    night: [rgb("#1e1033"), rgb("#4a2a5e"), rgb("#b8506e")],
    back(S, cam, t) {
      hS = S;
      hCam = cam;
      hT = t;
      drawLayersWith(S, layers, cam, t, hook);
    },
    front() {
      /* the quay has no foreground weather */
    },
  };
}

function frostArt(): MapArt {
  const layers = buildFrost();
  let hS: Surface = new Surface(1, 1);
  let hCam = 0;
  let hT = 0;
  const hook = (id: string): void => {
    if (id === "sky") animFrostSky(hS, hT);
    else if (id === "gate") {
      animFrostGate(hS, hCam, hT);
      animFrostSnow(hS, hT, false);
    } else if (id === "wall") animFrostWall(hS, hCam, hT);
  };
  return {
    id: "frost",
    layers,
    shadow: F.shadow,
    dust: F.dust,
    night: [rgb("#0b0e26"), rgb("#1d2a63"), rgb("#4a6fa5")],
    back(S, cam, t) {
      hS = S;
      hCam = cam;
      hT = t;
      drawLayersWith(S, layers, cam, t, hook);
    },
    front(S, _cam, t) {
      animFrostSnow(S, t, true);
    },
  };
}

/** The map's art (layers are built on first use and shared). */
export function getMapArt(id: MapId): MapArt {
  let m = CACHE.get(id);
  if (!m) {
    m = id === "frost" ? frostArt() : quayArt();
    CACHE.set(id, m);
  }
  return m;
}
