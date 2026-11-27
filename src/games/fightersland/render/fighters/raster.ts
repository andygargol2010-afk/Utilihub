/**
 * Fightersland fighter rasteriser: a tiny material/tone pixel buffer with emboss shading and a
 * 1 px ink outline, resolved to RGBA. Every fighter pose is drawn into this buffer from capsules,
 * polygons, lines and small bitmaps, then trimmed into a `SpriteFrame`.
 *
 * Pure TypeScript, no DOM: the buffers are allocated lazily on first use so importing this
 * module is free (and SSR-safe).
 */
import type { SpriteFrame } from "../../core/types";

/** Working buffer size and origin (ground point under the pelvis). */
export const BW = 208;
export const BH = 152;
export const BOX = 104;
export const BOY = 134;

export const INK = "#120e1a";

/** Master palette: ramps of 4 tones [line, shade, base, light]. */
export const RAMPS = {
  steel: ["#2b2f45", "#4a5670", "#8492a8", "#c9d4de"],
  stone: ["#2e2a36", "#544e5c", "#8a838d", "#bdb7b9"],
  white: ["#4b4a66", "#8f93b2", "#d8dbe8", "#ffffff"],
  black: ["#0e0b14", "#1e1b2e", "#34314d", "#514f73"],
  skinL: ["#6b2f3a", "#b5644f", "#e8a17a", "#ffd3a8"],
  skinT: ["#50262e", "#8e4b3c", "#c67e55", "#eeb07f"],
  skinD: ["#2e1a24", "#5a3330", "#8a563f", "#b98058"],
  frost: ["#2b3a5c", "#5d7fa3", "#9cc0d6", "#d9f0f5"],
  red: ["#4a0f2a", "#8f1d33", "#d1343c", "#f2735a"],
  orange: ["#5a2212", "#a8481a", "#e8802a", "#ffbf5e"],
  gold: ["#5c3a12", "#a8701c", "#e8b83a", "#fff08a"],
  green: ["#12332e", "#1f6b42", "#46a84a", "#a6e06a"],
  lime: ["#2a4a12", "#5c8a1c", "#a8d42a", "#e6ff7a"],
  teal: ["#0f2e3d", "#17616b", "#2aa79a", "#7ff0c8"],
  blue: ["#151c4a", "#24418f", "#3a7bd6", "#84c8ff"],
  indigo: ["#16133a", "#2a2a6b", "#4a4fa8", "#8088e0"],
  violet: ["#24104a", "#4a238a", "#8348c9", "#c08cf5"],
  night: ["#150f2e", "#2a1f55", "#473a85", "#6f63b8"],
  magenta: ["#450f3d", "#8a1f66", "#d14a9a", "#ff9ad0"],
  leather: ["#2a1620", "#57301f", "#8b5330", "#c08a52"],
  wood: ["#33201c", "#6b4426", "#a06c3a", "#d6a35e"],
  bone: ["#5a4a45", "#a39078", "#dccdaa", "#fff6dc"],
  /** smear / energy ramps (drawn without outline) */
  sSteel: ["#5d6f96", "#9fb4d4", "#dbe9ff", "#ffffff"],
  sLime: ["#4f8a1c", "#8fd12e", "#d4ff6a", "#f6ffd0"],
  sWater: ["#1d6f8a", "#36b3c4", "#8ff0e6", "#eafffb"],
  sEmber: ["#a8301a", "#e8682a", "#ffb64a", "#fff2b0"],
  sGold: ["#a8701c", "#e8b83a", "#fff08a", "#fffbe0"],
  sRed: ["#8f1d33", "#e04a4a", "#ff9a7a", "#ffe6d6"],
} as const;

export type MatName = keyof typeof RAMPS;
const MAT_NAMES = Object.keys(RAMPS) as MatName[];

/** Material ids are 1-based (0 = empty pixel). */
export const MAT = {} as Record<MatName, number>;
MAT_NAMES.forEach((k, i) => {
  MAT[k] = i + 1;
});
export const MAT_COUNT = MAT_NAMES.length;

function parseHex(h: string): number {
  return parseInt(h.slice(1, 7), 16);
}
/** Packed 0xRRGGBB per (mat, tone): index = mat * 4 + tone. */
const PAL = new Int32Array((MAT_COUNT + 1) * 4);
MAT_NAMES.forEach((k, i) => {
  const r = RAMPS[k];
  for (let t = 0; t < 4; t++) PAL[(i + 1) * 4 + t] = parseHex(r[t] ?? "#ff00ff");
});
const INK_RGB = parseHex(INK);

/** Group ids: inner separation lines appear only between different groups. */
export const G = {
  back: 1,
  armB: 2,
  legB: 3,
  legF: 4,
  body: 5,
  head: 6,
  weapon: 7,
  armF: 8,
  extra: 9,
  shield: 10,
  /** smears and energy: never outlined, never cause inner lines */
  fx: 11,
} as const;

export interface Buf {
  mat: Uint8Array;
  tone: Uint8Array;
  grp: Uint8Array;
  auto: Uint8Array;
}

let buf0: Buf | null = null;
let mask: Uint8Array | null = null;

/** The shared working buffer, cleared. */
export function freshBuf(): Buf {
  if (!buf0) {
    const n = BW * BH;
    buf0 = { mat: new Uint8Array(n), tone: new Uint8Array(n), grp: new Uint8Array(n), auto: new Uint8Array(n) };
  } else {
    buf0.mat.fill(0);
    buf0.tone.fill(0);
    buf0.grp.fill(0);
    buf0.auto.fill(0);
  }
  return buf0;
}
function M(): Uint8Array {
  if (!mask) mask = new Uint8Array(BW * BH);
  return mask;
}

const inb = (x: number, y: number): boolean => x >= 0 && y >= 0 && x < BW && y < BH;

export type Box = [number, number, number, number];
export type Pt = readonly [number, number];

// ---------------------------------------------------------------- mask builders (set M, return bbox)
export function maskCapsule(ax: number, ay: number, bx: number, by: number, ra: number, rb: number): Box {
  const m = M();
  const rm = Math.max(ra, rb) + 1;
  const x0 = Math.max(0, Math.floor(Math.min(ax, bx) - rm));
  const x1 = Math.min(BW - 1, Math.ceil(Math.max(ax, bx) + rm));
  const y0 = Math.max(0, Math.floor(Math.min(ay, by) - rm));
  const y1 = Math.min(BH - 1, Math.ceil(Math.max(ay, by) + rm));
  const dx = bx - ax;
  const dy = by - ay;
  const L2 = dx * dx + dy * dy;
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      let t = L2 > 0 ? ((x - ax) * dx + (y - ay) * dy) / L2 : 0;
      t = t < 0 ? 0 : t > 1 ? 1 : t;
      const ex = x - (ax + dx * t);
      const ey = y - (ay + dy * t);
      const r = ra + (rb - ra) * t;
      if (ex * ex + ey * ey <= r * r) m[y * BW + x] = 1;
    }
  }
  return [x0, y0, x1, y1];
}

export function maskPoly(pts: readonly Pt[]): Box {
  const m = M();
  let x0 = BW;
  let y0 = BH;
  let x1 = 0;
  let y1 = 0;
  for (const p of pts) {
    x0 = Math.min(x0, Math.floor(p[0]));
    x1 = Math.max(x1, Math.ceil(p[0]));
    y0 = Math.min(y0, Math.floor(p[1]));
    y1 = Math.max(y1, Math.ceil(p[1]));
  }
  x0 = Math.max(0, x0);
  y0 = Math.max(0, y0);
  x1 = Math.min(BW - 1, x1);
  y1 = Math.min(BH - 1, y1);
  const n = pts.length;
  for (let y = y0; y <= y1; y++) {
    const py = y + 0.001;
    for (let x = x0; x <= x1; x++) {
      const pxx = x + 0.001;
      let inside = false;
      for (let i = 0, j = n - 1; i < n; j = i++) {
        const pi = pts[i]!;
        const pj = pts[j]!;
        const xi = pi[0];
        const yi = pi[1];
        const xj = pj[0];
        const yj = pj[1];
        if (yi > py !== yj > py && pxx < ((xj - xi) * (py - yi)) / (yj - yi) + xi) inside = !inside;
      }
      if (inside) m[y * BW + x] = 1;
    }
  }
  return [x0, y0, x1, y1];
}

export function maskLine(ax: number, ay: number, bx: number, by: number): Box {
  const m = M();
  ax = Math.round(ax);
  ay = Math.round(ay);
  bx = Math.round(bx);
  by = Math.round(by);
  const dx = Math.abs(bx - ax);
  const dy = -Math.abs(by - ay);
  const sx = ax < bx ? 1 : -1;
  const sy = ay < by ? 1 : -1;
  let e = dx + dy;
  let x = ax;
  let y = ay;
  for (let guard = 0; guard < 2000; guard++) {
    if (inb(x, y)) m[y * BW + x] = 1;
    if (x === bx && y === by) break;
    const e2 = 2 * e;
    if (e2 >= dy) {
      e += dy;
      x += sx;
    }
    if (e2 <= dx) {
      e += dx;
      y += sy;
    }
  }
  return [
    Math.max(0, Math.min(ax, bx)),
    Math.max(0, Math.min(ay, by)),
    Math.min(BW - 1, Math.max(ax, bx)),
    Math.min(BH - 1, Math.max(ay, by)),
  ];
}

// ---------------------------------------------------------------- stamping
const MODE_FLAT = 1;
const MODE_NOLIGHT = 2;
const MODE_FULL = 3;
export type ShadeMode = "full" | "noLight" | "flat";

export interface StampOpts {
  shade?: ShadeMode;
  /** 2 px shade band */
  deep?: boolean;
  /** tone shift (-1 for far-side limbs) */
  dark?: number;
  /** draw a separation line on pixels of other groups bordering this part */
  inner?: boolean;
}

const modeOf = (s: ShadeMode | undefined): number => (s === "flat" ? MODE_FLAT : s === "noLight" ? MODE_NOLIGHT : MODE_FULL);
const clampTone = (t: number): number => (t < 0 ? 0 : t > 3 ? 3 : t);

/**
 * Stamp the current mask into the buffer and clear it. Shading is an emboss of the union
 * silhouette of the part's group (thigh + shin, pelvis + abdomen + chest read as one form).
 */
export function stamp(buf: Buf, box: Box, matId: number, grp: number, opts?: StampOpts): void {
  const m = M();
  const [x0, y0, x1, y1] = box;
  const mode = modeOf(opts?.shade);
  const deep = opts?.deep ? 4 : 0;
  const dark = opts?.dark ?? 0;
  const inner = opts?.inner ?? true;
  if (inner && grp !== G.fx) {
    for (let y = y0 - 1; y <= y1 + 1; y++) {
      for (let x = x0 - 1; x <= x1 + 1; x++) {
        if (!inb(x, y)) continue;
        const i = y * BW + x;
        if (m[i]) continue;
        const nb =
          (x > 0 && m[i - 1]) || (x < BW - 1 && m[i + 1]) || (y > 0 && m[i - BW]) || (y < BH - 1 && m[i + BW]);
        if (nb && buf.mat[i] && buf.grp[i] !== grp && buf.grp[i] !== G.fx) {
          buf.tone[i] = 0;
          buf.auto[i] = 0;
        }
      }
    }
  }
  const a = mode | deep | ((dark + 2) << 4);
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      const i = y * BW + x;
      if (!m[i]) continue;
      m[i] = 0;
      buf.mat[i] = matId;
      buf.grp[i] = grp;
      buf.tone[i] = clampTone(2 + dark);
      buf.auto[i] = a;
    }
  }
  reshade(buf, grp, x0 - 3, y0 - 3, x1 + 3, y1 + 3);
}

function reshade(buf: Buf, grp: number, bx0: number, by0: number, bx1: number, by1: number): void {
  const x0 = Math.max(0, bx0);
  const y0 = Math.max(0, by0);
  const x1 = Math.min(BW - 1, bx1);
  const y1 = Math.min(BH - 1, by1);
  const mat = buf.mat;
  const gr = buf.grp;
  const g = (x: number, y: number): boolean => {
    if (!inb(x, y)) return false;
    const i = y * BW + x;
    return mat[i] !== 0 && gr[i] === grp;
  };
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      const i = y * BW + x;
      const a = buf.auto[i]!;
      if (!a || gr[i] !== grp || !mat[i]) continue;
      const mode = a & 3;
      const deep = a & 4;
      const dark = (a >> 4) - 2;
      let tone = 2;
      if (mode !== MODE_FLAT) {
        const lit = !g(x, y - 1) || (!g(x + 1, y) && !g(x + 1, y - 1));
        let drk = !g(x, y + 1) || (!g(x - 1, y) && !g(x - 1, y + 1));
        if (deep && !drk) drk = !g(x, y + 2) || !g(x - 1, y + 1) || (!g(x - 2, y) && !g(x - 2, y + 1));
        if (lit && drk) tone = 2;
        else if (lit) tone = mode === MODE_NOLIGHT ? 2 : 3;
        else if (drk) tone = 1;
      }
      buf.tone[i] = clampTone(tone + dark);
    }
  }
}

const rnd = (v: number): number => Math.round(v);

export function capsule(buf: Buf, a: Pt, b: Pt, ra: number, rb: number, matId: number, grp: number, opts?: StampOpts): void {
  stamp(buf, maskCapsule(rnd(a[0]), rnd(a[1]), rnd(b[0]), rnd(b[1]), ra, rb), matId, grp, opts);
}

const polyTmp: [number, number][] = [];
export function poly(buf: Buf, pts: readonly Pt[], matId: number, grp: number, opts?: StampOpts): void {
  polyTmp.length = 0;
  for (const p of pts) polyTmp.push([rnd(p[0]), rnd(p[1])]);
  stamp(buf, maskPoly(polyTmp), matId, grp, opts);
}

/** Flat polygon fill at a fixed tone (smears, energy); no emboss. */
export function flatPoly(buf: Buf, pts: readonly Pt[], matId: number, tone: number, grp: number, dither = 0): void {
  const m = M();
  polyTmp.length = 0;
  for (const p of pts) polyTmp.push([rnd(p[0]), rnd(p[1])]);
  const [x0, y0, x1, y1] = maskPoly(polyTmp);
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      const i = y * BW + x;
      if (!m[i]) continue;
      m[i] = 0;
      if (dither === 1 && ((x + y) & 1) !== 0) continue;
      if (dither === 2 && ((x + 2 * y) & 3) !== 0) continue;
      if (grp === G.fx && ((buf.mat[i] && buf.grp[i] !== G.fx) || y > BOY + 1)) continue; // smears stay behind the body, above the floor
      buf.mat[i] = matId;
      buf.tone[i] = tone;
      buf.grp[i] = grp;
      buf.auto[i] = 0;
    }
  }
}

export function line(buf: Buf, a: Pt, b: Pt, matId: number, tone: number, grp: number): void {
  const m = M();
  const [x0, y0, x1, y1] = maskLine(a[0], a[1], b[0], b[1]);
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      const i = y * BW + x;
      if (!m[i]) continue;
      m[i] = 0;
      if (grp === G.fx && ((buf.mat[i] && buf.grp[i] !== G.fx) || y > BOY + 1)) continue;
      buf.mat[i] = matId;
      buf.tone[i] = tone;
      buf.grp[i] = grp;
      buf.auto[i] = 0;
    }
  }
}

export function px(buf: Buf, x: number, y: number, matId: number, tone: number, grp: number): void {
  x = rnd(x);
  y = rnd(y);
  if (!inb(x, y)) return;
  const i = y * BW + x;
  buf.mat[i] = matId;
  buf.tone[i] = tone;
  buf.grp[i] = grp;
  buf.auto[i] = 0;
}

// ---------------------------------------------------------------- bitmaps
/** A small hand-authored bitmap: rows of legend chars ('.' = empty), anchor (ax, ay). */
export interface Bitmap {
  rows: readonly string[];
  legend: Readonly<Record<string, readonly [MatName, number]>>;
  ax: number;
  ay: number;
}
/** Bitmap resolved to [dx, dy, mat, tone] cells relative to the anchor, for fast stamping. */
export interface Cells {
  /** flat array: dx, dy, mat, tone, ... per opaque cell; row index stored for shear */
  d: Int16Array;
  rows: number;
  ay: number;
}

export function compileBitmap(bm: Bitmap): Cells {
  const out: number[] = [];
  for (let r = 0; r < bm.rows.length; r++) {
    const row = bm.rows[r] ?? "";
    for (let c = 0; c < row.length; c++) {
      const ch = row[c] ?? ".";
      if (ch === "." || ch === " ") continue;
      const def = bm.legend[ch];
      if (!def) throw new Error("fightersland: bitmap legend missing " + ch);
      out.push(c - bm.ax, r - bm.ay, MAT[def[0]], def[1], r);
    }
  }
  return { d: Int16Array.from(out), rows: bm.rows.length, ay: bm.ay };
}

/**
 * Stamp compiled cells with the anchor at (x, y). `shear` shifts row r by
 * round(shear * (ay - r) / rows) px forward (a head tilt without resampling).
 */
export function cells(buf: Buf, c: Cells, x: number, y: number, grp: number, shear = 0, dark = 0, inner = true): void {
  const m = M();
  x = rnd(x);
  y = rnd(y);
  const d = c.d;
  const n = d.length;
  for (let k = 0; k < n; k += 5) {
    const sh = shear ? Math.round((shear * (c.ay - d[k + 4]!)) / c.rows) : 0;
    const X = x + d[k]! + sh;
    const Y = y + d[k + 1]!;
    if (inb(X, Y)) m[Y * BW + X] = 1;
  }
  if (inner) {
    for (let k = 0; k < n; k += 5) {
      const sh = shear ? Math.round((shear * (c.ay - d[k + 4]!)) / c.rows) : 0;
      const X = x + d[k]! + sh;
      const Y = y + d[k + 1]!;
      for (let q = 0; q < 4; q++) {
        const nx = X + (q === 0 ? 1 : q === 1 ? -1 : 0);
        const ny = Y + (q === 2 ? 1 : q === 3 ? -1 : 0);
        if (!inb(nx, ny)) continue;
        const i = ny * BW + nx;
        if (m[i]) continue;
        if (buf.mat[i] && buf.grp[i] !== grp && buf.grp[i] !== G.fx) {
          buf.tone[i] = 0;
          buf.auto[i] = 0;
        }
      }
    }
  }
  for (let k = 0; k < n; k += 5) {
    const sh = shear ? Math.round((shear * (c.ay - d[k + 4]!)) / c.rows) : 0;
    const X = x + d[k]! + sh;
    const Y = y + d[k + 1]!;
    if (!inb(X, Y)) continue;
    const i = Y * BW + X;
    m[i] = 0;
    buf.mat[i] = d[k + 2]!;
    buf.tone[i] = clampTone(d[k + 3]! + dark);
    buf.grp[i] = grp;
    buf.auto[i] = 0;
  }
}

// ---------------------------------------------------------------- resolve
/** Tone remap applied while resolving: 0 none, 1 glow (+1 tone), 2 white-hot flash, 3 dark silhouette. */
export type Tint = 0 | 1 | 2 | 3;

/**
 * Resolve the buffer to a trimmed RGBA SpriteFrame with a 1 px ink outline.
 * Smear pixels (group fx) are not outlined.
 */
export function resolve(buf: Buf, tint: Tint = 0): SpriteFrame {
  const mat = buf.mat;
  const gr = buf.grp;
  // bbox of filled pixels (+1 for the outline)
  let x0 = BW;
  let y0 = BH;
  let x1 = -1;
  let y1 = -1;
  for (let y = 0; y < BH; y++) {
    const row = y * BW;
    for (let x = 0; x < BW; x++) {
      if (mat[row + x]) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
    }
  }
  if (x1 < 0) return { data: new Uint8ClampedArray(4), w: 1, h: 1, ox: 0, oy: 0 };
  x0 = Math.max(0, x0 - 1);
  y0 = Math.max(0, y0 - 1);
  x1 = Math.min(BW - 1, x1 + 1);
  y1 = Math.min(BH - 1, y1 + 1);
  const w = x1 - x0 + 1;
  const h = y1 - y0 + 1;
  const out = new Uint8ClampedArray(w * h * 4);
  const solid = (i: number): boolean => mat[i] !== 0 && gr[i] !== G.fx;
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      const i = y * BW + x;
      const o = ((y - y0) * w + (x - x0)) * 4;
      const mt = mat[i]!;
      let c = -1;
      if (mt) {
        let t = buf.tone[i]!;
        if (gr[i] !== G.fx) {
          if (tint === 1) t = t < 3 ? t + 1 : 3;
          else if (tint === 2) {
            c = t >= 2 ? 0xffffff : t === 1 ? 0xffe8d0 : 0xd8b8c8;
          } else if (tint === 3) c = t >= 2 ? 0x2a2440 : 0x1a1528;
        }
        if (c < 0) c = PAL[mt * 4 + t]!;
        if (
          gr[i] === G.fx &&
          ((x > 0 && solid(i - 1)) ||
            (x < BW - 1 && solid(i + 1)) ||
            (y > 0 && solid(i - BW)) ||
            (y < BH - 1 && solid(i + BW)))
        ) {
          c = INK_RGB;
        }
      } else if (
        (x > 0 && solid(i - 1)) ||
        (x < BW - 1 && solid(i + 1)) ||
        (y > 0 && solid(i - BW)) ||
        (y < BH - 1 && solid(i + BW))
      ) {
        c = INK_RGB;
      }
      if (c >= 0) {
        out[o] = (c >> 16) & 255;
        out[o + 1] = (c >> 8) & 255;
        out[o + 2] = c & 255;
        out[o + 3] = 255;
      }
    }
  }
  return { data: out, w, h, ox: BOX - x0, oy: BOY - y0 };
}
