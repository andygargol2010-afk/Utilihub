/**
 * Fightersland bitmap font "FL5x7": proportional 7-row capitals, digits, punctuation, arrows and
 * the Spanish / Portuguese accented capitals. Each glyph line box is 11 rows: 2 accent rows,
 * 7 cap rows and 2 descender rows (cedilla, comma).
 *
 * `drawText` / `measureText` work on any CanvasRenderingContext2D (DOM menus); the stage
 * renderer uses the 1-bit helpers (`textBits`, `scale2x`, `bolden`) on its own surface.
 */
import type { Bits } from "./surface";

const GLYPHS: Record<string, string> = {
  A: ".###./#...#/#...#/#####/#...#/#...#/#...#",
  B: "####./#...#/#...#/####./#...#/#...#/####.",
  C: ".###./#...#/#..../#..../#..../#...#/.###.",
  D: "####./.#..#/.#..#/.#..#/.#..#/.#..#/####.",
  E: "#####/#..../#..../####./#..../#..../#####",
  F: "#####/#..../#..../####./#..../#..../#....",
  G: ".###./#...#/#..../#.###/#...#/#...#/.###.",
  H: "#...#/#...#/#...#/#####/#...#/#...#/#...#",
  I: "###/.#./.#./.#./.#./.#./###",
  J: "..###/...#./...#./...#./...#./#..#./.##..",
  K: "#...#/#..#./#.#../##.../#.#../#..#./#...#",
  L: "#..../#..../#..../#..../#..../#..../#####",
  M: "#...#/##.##/#.#.#/#.#.#/#...#/#...#/#...#",
  N: "#...#/##..#/#.#.#/#.#.#/#..##/#...#/#...#",
  O: ".###./#...#/#...#/#...#/#...#/#...#/.###.",
  P: "####./#...#/#...#/####./#..../#..../#....",
  Q: ".###./#...#/#...#/#...#/#.#.#/#..#./.##.#",
  R: "####./#...#/#...#/####./#.#../#..#./#...#",
  S: ".####/#..../#..../.###./....#/....#/####.",
  T: "#####/..#../..#../..#../..#../..#../..#..",
  U: "#...#/#...#/#...#/#...#/#...#/#...#/.###.",
  V: "#...#/#...#/#...#/#...#/.#.#./.#.#./..#..",
  W: "#...#/#...#/#...#/#.#.#/#.#.#/##.##/#...#",
  X: "#...#/#...#/.#.#./..#../.#.#./#...#/#...#",
  Y: "#...#/#...#/.#.#./..#../..#../..#../..#..",
  Z: "#####/....#/...#./..#../.#.../#..../#####",
  "0": ".###./#...#/#..##/#.#.#/##..#/#...#/.###.",
  "1": ".#./##./.#./.#./.#./.#./###",
  "2": ".###./#...#/....#/...#./..#../.#.../#####",
  "3": "####./....#/....#/.###./....#/....#/####.",
  "4": "...#./..##./.#.#./#..#./#####/...#./...#.",
  "5": "#####/#..../####./....#/....#/#...#/.###.",
  "6": ".###./#..../#..../####./#...#/#...#/.###.",
  "7": "#####/....#/...#./..#../..#../..#../..#..",
  "8": ".###./#...#/#...#/.###./#...#/#...#/.###.",
  "9": ".###./#...#/#...#/.####/....#/....#/.###.",
  " ": ".../.../.../.../.../.../...",
  ".": "././././././#",
  ",": "../../../../../.#/.#",
  ":": "./#/././#/./.",
  ";": "../.#/../../.#/.#/#.",
  "!": "#/#/#/#/#/./#",
  "¡": "#/./#/#/#/#/#",
  "?": ".###./#...#/....#/...#./..#../...../..#..",
  "¿": "..#../...../..#../.#.../#..../#...#/.###.",
  "'": "#/#/././././.",
  '"': "#.#/#.#/.../.../.../.../...",
  "-": ".../.../.../###/.../.../...",
  _: "...../...../...../...../...../...../#####",
  "+": ".../.../.#./###/.#./.../...",
  "/": "....#/...#./...#./..#../.#.../.#.../#....",
  "(": ".#/#./#./#./#./#./.#",
  ")": "#./.#/.#/.#/.#/.#/#.",
  "[": "##/#./#./#./#./#./##",
  "]": "##/.#/.#/.#/.#/.#/##",
  "%": "##..#/##.#./...#./..#../.#.../.#.##/#..##",
  "&": ".##../#..#./#..#./.##../#.#.#/#..#./.##.#",
  "=": ".../.../###/.../###/.../...",
  "*": ".../#.#/.#./#.#/.../.../...",
  "×": ".../.../#.#/.#./#.#/.../...",
  "·": "./././#/././.",
  "<": "...#/..#./.#../#.../.#../..#./...#",
  ">": "#.../.#../..#./...#/..#./.#../#...",
  "#": ".#.#./.#.#./#####/.#.#./#####/.#.#./.#.#.",
  "→": "...../..#../...#./#####/...#./..#../.....",
  "←": "...../..#../.#.../#####/.#.../..#../.....",
  "↑": "..#../.###./#.#.#/..#../..#../..#../..#..",
  "↓": "..#../..#../..#../..#../#.#.#/.###./..#..",
  "◀": "...#/..##/.###/####/.###/..##/...#",
  "▶": "#.../##../###./####/###./##../#...",
  "▲": "...../...../..#../.###./#####/...../.....",
  "▼": "...../...../#####/.###./..#../...../.....",
  "♪": "..##/..#./..#./..#./.##./###./.#..",
  "∞": "......./......./.##.##./#..#..#/.##.##./......./.......",
};

type Mark = "acute" | "grave" | "circ" | "tilde" | "uml" | "cedilla";

const MARKS: Record<Mark, readonly [string, string]> = {
  acute: ["..#", ".#."],
  grave: ["#..", ".#."],
  circ: [".#.", "#.#"],
  tilde: [".#.#", "#.#."],
  uml: ["...", "#.#"],
  cedilla: [".#.", "#.."],
};

const COMPOSED: Record<string, readonly [string, Mark]> = {
  Á: ["A", "acute"],
  É: ["E", "acute"],
  Í: ["I", "acute"],
  Ó: ["O", "acute"],
  Ú: ["U", "acute"],
  À: ["A", "grave"],
  È: ["E", "grave"],
  Ò: ["O", "grave"],
  Â: ["A", "circ"],
  Ê: ["E", "circ"],
  Ô: ["O", "circ"],
  Ã: ["A", "tilde"],
  Õ: ["O", "tilde"],
  Ñ: ["N", "tilde"],
  Ü: ["U", "uml"],
  Ç: ["C", "cedilla"],
};

/** Rows of the line box (2 accent + 7 cap + 2 descender). */
export const FONT_HEIGHT = 11;
/** Row of the line box where the capitals start. */
export const CAP_TOP = 2;
/** Height of a capital letter. */
export const CAP_HEIGHT = 7;

interface Glyph {
  w: number;
  /** FONT_HEIGHT rows of w bits */
  bits: Uint8Array;
  /** horizontal runs per row: flat [row, x, len, ...] (for fillRect drawing) */
  runs: Int16Array;
}

const GLYPH_CACHE = new Map<string, Glyph>();

function normalise(ch: string): string {
  const up = ch.toUpperCase();
  return up.length === 1 ? up : ch;
}

function buildGlyph(ch: string): Glyph {
  let base = ch;
  let mark: Mark | null = null;
  const comp = COMPOSED[ch];
  if (comp) {
    base = comp[0];
    mark = comp[1];
  }
  const src = GLYPHS[base] ?? GLYPHS["?"] ?? ".";
  const rows = src.split("/");
  const w = Math.max(1, ...rows.map((r) => r.length));
  const bits = new Uint8Array(FONT_HEIGHT * w);
  rows.slice(0, CAP_HEIGHT).forEach((r, i) => {
    for (let c = 0; c < r.length; c++) if (r[c] === "#") bits[(i + CAP_TOP) * w + c] = 1;
  });
  if (base === ",") bits[9 * w] = 1;
  if (mark) {
    const m = MARKS[mark];
    const mw = m[0].length;
    const off = Math.max(0, Math.floor((w - mw) / 2) + (mark === "tilde" ? 1 : 0));
    const put = (row: number, s: string): void => {
      for (let i = 0; i < s.length; i++) if (s[i] === "#" && off + i < w) bits[row * w + off + i] = 1;
    };
    if (mark === "cedilla") {
      put(9, m[0]);
      put(10, m[1]);
    } else {
      put(0, m[0]);
      put(1, m[1]);
    }
  }
  const runs: number[] = [];
  for (let r = 0; r < FONT_HEIGHT; r++) {
    let c = 0;
    while (c < w) {
      if (!bits[r * w + c]) {
        c++;
        continue;
      }
      const s = c;
      while (c < w && bits[r * w + c]) c++;
      runs.push(r, s, c - s);
    }
  }
  return { w, bits, runs: Int16Array.from(runs) };
}

function glyph(ch: string): Glyph {
  const key = normalise(ch);
  let g = GLYPH_CACHE.get(key);
  if (!g) {
    g = buildGlyph(key);
    GLYPH_CACHE.set(key, g);
  }
  return g;
}

/** Width in pixels of `text` at the given integer scale (1 px letter spacing per scale unit). */
export function measureText(text: string, scale = 1): number {
  let w = 0;
  let n = 0;
  for (const ch of text) {
    w += glyph(ch).w + 1;
    n++;
  }
  return n === 0 ? 0 : (w - 1) * Math.max(1, Math.round(scale));
}

/** Rasterise text into a FONT_HEIGHT-row 1-bit grid. */
export function textBits(text: string, spacing = 1): Bits {
  let w = 0;
  let n = 0;
  for (const ch of text) {
    w += glyph(ch).w + spacing;
    n++;
  }
  w = Math.max(1, n === 0 ? 1 : w - spacing);
  const d = new Uint8Array(w * FONT_HEIGHT);
  let x = 0;
  for (const ch of text) {
    const g = glyph(ch);
    for (let r = 0; r < FONT_HEIGHT; r++) {
      for (let c = 0; c < g.w; c++) if (g.bits[r * g.w + c] && x + c < w) d[r * w + x + c] = 1;
    }
    x += g.w + spacing;
  }
  return { w, h: FONT_HEIGHT, d };
}

/** EPX / Scale2x on a 1-bit grid: rounded 2x glyphs for banner text. */
export function scale2x(g: Bits): Bits {
  const { w, h } = g;
  const out = new Uint8Array(w * 2 * h * 2);
  const at = (x: number, y: number): number => (x < 0 || y < 0 || x >= w || y >= h ? 0 : g.d[y * w + x]!);
  const W2 = w * 2;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const P = at(x, y);
      const A = at(x, y - 1);
      const B = at(x + 1, y);
      const C = at(x - 1, y);
      const D = at(x, y + 1);
      let e0 = P;
      let e1 = P;
      let e2 = P;
      let e3 = P;
      if (C === A && C !== D && A !== B) e0 = A;
      if (A === B && A !== C && B !== D) e1 = B;
      if (D === C && D !== B && C !== A) e2 = C;
      if (B === D && B !== A && D !== C) e3 = D;
      out[y * 2 * W2 + x * 2] = e0;
      out[y * 2 * W2 + x * 2 + 1] = e1;
      out[(y * 2 + 1) * W2 + x * 2] = e2;
      out[(y * 2 + 1) * W2 + x * 2 + 1] = e3;
    }
  }
  return { w: W2, h: h * 2, d: out };
}

/** +1 px to the right: heavier banner weight. */
export function bolden(g: Bits): Bits {
  const w = g.w + 1;
  const d = new Uint8Array(w * g.h);
  for (let y = 0; y < g.h; y++) {
    for (let x = 0; x < g.w; x++) {
      if (g.d[y * g.w + x]) {
        d[y * w + x] = 1;
        d[y * w + x + 1] = 1;
      }
    }
  }
  return { w, h: g.h, d };
}

/** Rows of a grid that contain ink: [first, last] (or [0, -1] when empty). */
export function inkRows(g: Bits): [number, number] {
  let a = -1;
  let b = -1;
  for (let y = 0; y < g.h; y++) {
    for (let x = 0; x < g.w; x++) {
      if (g.d[y * g.w + x]) {
        if (a < 0) a = y;
        b = y;
        break;
      }
    }
  }
  return a < 0 ? [0, -1] : [a, b];
}

export interface DrawTextOptions {
  color?: string;
  /** integer pixel scale (default 1) */
  scale?: number;
  /** outline colour drawn one scaled pixel around every glyph; null / omitted = none */
  shadow?: string | null;
  align?: "left" | "center" | "right";
}

/** Minimal 2D context surface used by drawText (any CanvasRenderingContext2D satisfies it). */
export interface FillRectContext {
  fillStyle: string | CanvasGradient | CanvasPattern;
  fillRect(x: number, y: number, w: number, h: number): void;
}

const OUTLINE: readonly (readonly [number, number])[] = [
  [-1, -1],
  [0, -1],
  [1, -1],
  [-1, 0],
  [1, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
];

function fillRuns(ctx: FillRectContext, text: string, x: number, y: number, k: number): void {
  let cx = x;
  for (const ch of text) {
    const g = glyph(ch);
    const r = g.runs;
    for (let i = 0; i < r.length; i += 3) ctx.fillRect(cx + r[i + 1]! * k, y + r[i]! * k, r[i + 2]! * k, k);
    cx += (g.w + 1) * k;
  }
}

/**
 * Draw text with the bitmap font. (x, y) is the top-left of the FONT_HEIGHT-row line box
 * (capitals start CAP_TOP rows lower); `align` anchors x at the left, centre or right edge.
 * Works on any 2D context; call it with integer coordinates and image smoothing off for crisp
 * pixels.
 */
export function drawText(ctx: FillRectContext, text: string, x: number, y: number, opts?: DrawTextOptions): void {
  const k = Math.max(1, Math.round(opts?.scale ?? 1));
  const w = measureText(text, k);
  const align = opts?.align ?? "left";
  const x0 = Math.round(align === "right" ? x - w : align === "center" ? x - w / 2 : x);
  const y0 = Math.round(y);
  const shadow = opts?.shadow ?? null;
  if (shadow) {
    ctx.fillStyle = shadow;
    for (const [dx, dy] of OUTLINE) fillRuns(ctx, text, x0 + dx * k, y0 + dy * k, k);
  }
  ctx.fillStyle = opts?.color ?? "#f4f7fa";
  fillRuns(ctx, text, x0, y0, k);
}
