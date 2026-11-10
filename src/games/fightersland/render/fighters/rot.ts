/**
 * Rotation of small hand-authored bitmaps without mush ("RotSprite-lite"): exact quarter turns,
 * then the remainder is sampled from a Scale2x x2 upscaled source and despeckled.
 * Used to pre-rotate head bitmaps to 16 directions for tumbling / lying poses.
 */
import type { Bitmap } from "./raster";

const T = ".";

interface Grid {
  w: number;
  h: number;
  ax: number;
  ay: number;
  c: string[][];
}

function toGrid(bm: Bitmap): Grid {
  let w = 0;
  for (const r of bm.rows) w = Math.max(w, r.length);
  return {
    w,
    h: bm.rows.length,
    ax: bm.ax,
    ay: bm.ay,
    c: bm.rows.map((r) =>
      r
        .padEnd(w, T)
        .split("")
        .map((ch) => (ch === " " ? T : ch)),
    ),
  };
}

const at = (g: Grid, x: number, y: number): string => (x < 0 || y < 0 || x >= g.w || y >= g.h ? T : (g.c[y]?.[x] ?? T));

function blank(w: number, h: number): string[][] {
  const o: string[][] = [];
  for (let y = 0; y < h; y++) o.push(new Array<string>(w).fill(T));
  return o;
}

function set(c: string[][], x: number, y: number, v: string): void {
  const row = c[y];
  if (row && x >= 0 && x < row.length) row[x] = v;
}

/** Exact quarter turns, clockwise on screen (y down); the anchor follows. */
function quarter(g: Grid, q: number): Grid {
  q = ((q % 4) + 4) % 4;
  let cur = g;
  for (let i = 0; i < q; i++) {
    const n = blank(cur.h, cur.w);
    for (let y = 0; y < cur.h; y++) for (let x = 0; x < cur.w; x++) set(n, cur.h - 1 - y, x, at(cur, x, y));
    cur = { w: cur.h, h: cur.w, c: n, ax: cur.h - 1 - cur.ay, ay: cur.ax };
  }
  return cur;
}

function scale2x(g: Grid): Grid {
  const o = blank(g.w * 2, g.h * 2);
  for (let y = 0; y < g.h; y++) {
    for (let x = 0; x < g.w; x++) {
      const P = at(g, x, y);
      const A = at(g, x, y - 1);
      const B = at(g, x + 1, y);
      const C = at(g, x - 1, y);
      const D = at(g, x, y + 1);
      set(o, x * 2, y * 2, C === A && C !== D && A !== B ? A : P);
      set(o, x * 2 + 1, y * 2, A === B && A !== C && B !== D ? B : P);
      set(o, x * 2, y * 2 + 1, D === C && D !== B && C !== A ? C : P);
      set(o, x * 2 + 1, y * 2 + 1, B === D && B !== A && D !== C ? D : P);
    }
  }
  return { w: g.w * 2, h: g.h * 2, ax: g.ax * 2, ay: g.ay * 2, c: o };
}

function trim(g: Grid): Grid {
  let x0 = g.w;
  let y0 = g.h;
  let x1 = -1;
  let y1 = -1;
  for (let y = 0; y < g.h; y++) {
    for (let x = 0; x < g.w; x++) {
      if (at(g, x, y) !== T) {
        x0 = Math.min(x0, x);
        x1 = Math.max(x1, x);
        y0 = Math.min(y0, y);
        y1 = Math.max(y1, y);
      }
    }
  }
  if (x1 < 0) return { w: 1, h: 1, c: [[T]], ax: 0, ay: 0 };
  return {
    w: x1 - x0 + 1,
    h: y1 - y0 + 1,
    ax: g.ax - x0,
    ay: g.ay - y0,
    c: g.c.slice(y0, y1 + 1).map((r) => r.slice(x0, x1 + 1)),
  };
}

/** Rotate by deg (clockwise) about the anchor pixel centre, sampling a 4x upscaled source. */
function rotSample(g: Grid, deg: number): Grid {
  const src = scale2x(scale2x(g));
  const k = 4;
  const a = (deg * Math.PI) / 180;
  const cs = Math.cos(a);
  const sn = Math.sin(a);
  const pad = Math.ceil(Math.hypot(g.w, g.h));
  const W = pad * 2 + 1;
  const o = blank(W, W);
  for (let y = 0; y < W; y++) {
    for (let x = 0; x < W; x++) {
      const dx = x - pad;
      const dy = y - pad;
      const sx = dx * cs + dy * sn + g.ax + 0.5;
      const sy = -dx * sn + dy * cs + g.ay + 0.5;
      const ix = Math.floor(sx * k);
      const iy = Math.floor(sy * k);
      if (ix >= 0 && iy >= 0 && ix < src.w && iy < src.h) set(o, x, y, at(src, ix, iy));
    }
  }
  return trim({ w: W, h: W, c: o, ax: pad, ay: pad });
}

/** Orphan pixels created by resampling take the most common neighbour colour. */
function despeckle(g: Grid): Grid {
  const o = g.c.map((r) => r.slice());
  for (let y = 0; y < g.h; y++) {
    for (let x = 0; x < g.w; x++) {
      const p = at(g, x, y);
      if (p === T) continue;
      const cnt = new Map<string, number>();
      let same = 0;
      let n4 = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (!dx && !dy) continue;
          const q = at(g, x + dx, y + dy);
          if (q === p) same++;
          cnt.set(q, (cnt.get(q) ?? 0) + 1);
          if ((dx === 0 || dy === 0) && q !== T) n4++;
        }
      }
      if (same === 0) {
        let best = p;
        let bn = 0;
        for (const [k, v] of cnt) {
          if (v > bn) {
            best = k;
            bn = v;
          }
        }
        set(o, x, y, n4 === 0 ? T : best);
      }
    }
  }
  return { ...g, c: o };
}

export function rotateBitmap(bm: Bitmap, deg: number): Bitmap {
  const g0 = toGrid(bm);
  const q = Math.round(deg / 90);
  const r = deg - q * 90;
  let g = quarter(g0, q);
  if (Math.abs(r) >= 0.01) g = despeckle(rotSample(g, r));
  return { rows: g.c.map((row) => row.join("")), legend: bm.legend, ax: g.ax, ay: g.ay };
}

/** 16 pre-rotated variants (index i = i * 22.5 deg clockwise). */
export function variants16(bm: Bitmap): Bitmap[] {
  const out: Bitmap[] = [];
  for (let i = 0; i < 16; i++) out.push(i === 0 ? bm : rotateBitmap(bm, i * 22.5));
  return out;
}
