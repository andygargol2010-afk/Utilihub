/**
 * Fightersland software surface: a 32-bit RGBA pixel buffer with the small set of pixel-crisp
 * primitives the maps, effects and HUD are drawn with (opaque rects, ordered dither, discs,
 * rings, polygons, lines, 1-bit glyph grids and sprite blits).
 *
 * Colours are packed 32-bit values in the platform's native byte order (see `rgb`), so a pixel
 * write is a single Uint32Array store. No DOM is touched here: the renderer hands the buffer of an
 * ImageData to `Surface` and presents it with putImageData.
 */
import type { SpriteFrame } from "../core/types";

const LITTLE = new Uint8Array(new Uint32Array([0x01020304]).buffer)[0] === 0x04;

/** Pack r, g, b (0..255) into an opaque native-order 32-bit pixel. */
export function pack(r: number, g: number, b: number): number {
  return LITTLE
    ? ((0xff << 24) | (b << 16) | (g << 8) | r) >>> 0
    : ((r << 24) | (g << 16) | (b << 8) | 0xff) >>> 0;
}

const ALPHA = LITTLE ? 0xff000000 : 0xff;

/** True when a packed pixel has a non-zero alpha. */
export function opaque(p: number): boolean {
  return (p & ALPHA) !== 0;
}

/** Channel accessors for packed pixels. */
export function chR(c: number): number {
  return LITTLE ? c & 0xff : (c >>> 24) & 0xff;
}
export function chG(c: number): number {
  return LITTLE ? (c >>> 8) & 0xff : (c >>> 16) & 0xff;
}
export function chB(c: number): number {
  return LITTLE ? (c >>> 16) & 0xff : (c >>> 8) & 0xff;
}

const HEX_CACHE = new Map<string, number>();

/** "#rrggbb" to a packed opaque pixel (cached). */
export function rgb(hex: string): number {
  let c = HEX_CACHE.get(hex);
  if (c === undefined) {
    const r = parseInt(hex.slice(1, 3), 16) || 0;
    const g = parseInt(hex.slice(3, 5), 16) || 0;
    const b = parseInt(hex.slice(5, 7), 16) || 0;
    c = pack(r, g, b);
    HEX_CACHE.set(hex, c);
  }
  return c;
}

/** Mix two packed colours (u = 0 gives a, 1 gives b). */
export function mix(a: number, b: number, u: number): number {
  const v = u < 0 ? 0 : u > 1 ? 1 : u;
  return pack(
    Math.round(chR(a) + (chR(b) - chR(a)) * v),
    Math.round(chG(a) + (chG(b) - chG(a)) * v),
    Math.round(chB(a) + (chB(b) - chB(a)) * v),
  );
}

/** Ordered-dither patterns (pixel on/off by screen position). */
export type Pattern = "solid" | "c25" | "c50" | "c75" | "h50" | "v50";

export function patOn(pat: Pattern, x: number, y: number): boolean {
  switch (pat) {
    case "solid":
      return true;
    case "c50":
      return ((x + y) & 1) === 0;
    case "c25":
      return ((x + 2 * y) & 3) === 0;
    case "c75":
      return ((x + 2 * y) & 3) !== 0;
    case "h50":
      return (y & 1) === 0;
    case "v50":
      return (x & 1) === 0;
  }
}

/** Pattern for a 0..1 coverage value (0 = nothing, 1 = solid). */
export function patFor(cover: number): Pattern | null {
  if (cover <= 0.12) return null;
  if (cover <= 0.37) return "c25";
  if (cover <= 0.62) return "c50";
  if (cover <= 0.87) return "c75";
  return "solid";
}

/** deterministic hash noise in [0, 1) (never Math.random in art code) */
export function hash(n: number): number {
  let x = Math.imul(n | 0, 0x9e3779b1);
  x ^= x >>> 15;
  x = Math.imul(x, 0x85ebca6b);
  x ^= x >>> 13;
  x = Math.imul(x, 0xc2b2ae35);
  x ^= x >>> 16;
  return (x >>> 0) / 4294967296;
}

/** 1-bit grid: row-major bytes (0 / 1). */
export interface Bits {
  w: number;
  h: number;
  d: Uint8Array;
}

export class Surface {
  readonly w: number;
  readonly h: number;
  readonly px32: Uint32Array;
  readonly bytes: Uint8ClampedArray;

  constructor(w: number, h: number, backing?: Uint8ClampedArray) {
    this.w = w;
    this.h = h;
    this.bytes = backing ?? new Uint8ClampedArray(w * h * 4);
    this.px32 = new Uint32Array(this.bytes.buffer, this.bytes.byteOffset, w * h);
  }

  clear(c = 0): void {
    this.px32.fill(c);
  }

  px(x: number, y: number, c: number): void {
    x |= 0;
    y |= 0;
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return;
    this.px32[y * this.w + x] = c;
  }

  rect(x: number, y: number, w: number, h: number, c: number): void {
    let x0 = Math.round(x);
    let y0 = Math.round(y);
    let x1 = x0 + Math.round(w);
    let y1 = y0 + Math.round(h);
    if (x0 < 0) x0 = 0;
    if (y0 < 0) y0 = 0;
    if (x1 > this.w) x1 = this.w;
    if (y1 > this.h) y1 = this.h;
    if (x1 <= x0 || y1 <= y0) return;
    const d = this.px32;
    for (let yy = y0; yy < y1; yy++) d.fill(c, yy * this.w + x0, yy * this.w + x1);
  }

  /** pattern fill (screen-anchored, so neighbouring fills line up) */
  dither(x: number, y: number, w: number, h: number, c: number, pat: Pattern): void {
    if (pat === "solid") {
      this.rect(x, y, w, h, c);
      return;
    }
    const x0 = Math.max(0, Math.round(x));
    const y0 = Math.max(0, Math.round(y));
    const x1 = Math.min(this.w, Math.round(x) + Math.round(w));
    const y1 = Math.min(this.h, Math.round(y) + Math.round(h));
    const d = this.px32;
    for (let yy = y0; yy < y1; yy++) {
      const row = yy * this.w;
      for (let xx = x0; xx < x1; xx++) if (patOn(pat, xx, yy)) d[row + xx] = c;
    }
  }

  /** filled pixel disc of integer radius r */
  disc(cx: number, cy: number, r: number, c: number, pat: Pattern = "solid"): void {
    cx = Math.round(cx);
    cy = Math.round(cy);
    r = Math.round(r);
    if (r < 0) return;
    const rr = (r + 0.35) * (r + 0.35);
    for (let y = -r; y <= r; y++) {
      const Y = cy + y;
      if (Y < 0 || Y >= this.h) continue;
      const half = Math.floor(Math.sqrt(Math.max(0, rr - y * y)));
      const x0 = Math.max(0, cx - half);
      const x1 = Math.min(this.w - 1, cx + half);
      if (pat === "solid") {
        if (x1 >= x0) this.px32.fill(c, Y * this.w + x0, Y * this.w + x1 + 1);
      } else {
        for (let X = x0; X <= x1; X++) if (patOn(pat, X, Y)) this.px32[Y * this.w + X] = c;
      }
    }
  }

  /** 1 px (or thicker) pixel ring */
  ring(cx: number, cy: number, r: number, c: number, thick = 1, pat: Pattern = "solid"): void {
    cx = Math.round(cx);
    cy = Math.round(cy);
    r = Math.round(r);
    if (r < 0) return;
    const a = (r + 0.35) * (r + 0.35);
    const ri = r - thick + 0.35;
    const b = ri > 0 ? ri * ri : -1;
    for (let y = -r; y <= r; y++) {
      const Y = cy + y;
      if (Y < 0 || Y >= this.h) continue;
      for (let x = -r; x <= r; x++) {
        const q = x * x + y * y;
        if (q <= a && q > b) {
          const X = cx + x;
          if (X >= 0 && X < this.w && patOn(pat, X, Y)) this.px32[Y * this.w + X] = c;
        }
      }
    }
  }

  /** even-odd polygon fill sampled at pixel centres; pts = flat [x0, y0, x1, y1, ...] */
  poly(pts: ArrayLike<number>, n: number, c: number, pat: Pattern = "solid"): void {
    let y0 = 1e9;
    let y1 = -1e9;
    for (let i = 0; i < n; i++) {
      const y = pts[i * 2 + 1]!;
      if (y < y0) y0 = y;
      if (y > y1) y1 = y;
    }
    const ys = Math.max(0, Math.floor(y0));
    const ye = Math.min(this.h - 1, Math.ceil(y1));
    const xs = POLY_XS;
    for (let y = ys; y <= ye; y++) {
      let k = 0;
      const py = y + 0.5;
      for (let i = 0, j = n - 1; i < n; j = i++) {
        const xi = pts[i * 2]!;
        const yi = pts[i * 2 + 1]!;
        const xj = pts[j * 2]!;
        const yj = pts[j * 2 + 1]!;
        if (yi > py !== yj > py && k < xs.length) xs[k++] = xi + ((py - yi) * (xj - xi)) / (yj - yi);
      }
      // insertion sort (k is tiny)
      for (let a = 1; a < k; a++) {
        const v = xs[a]!;
        let b = a - 1;
        while (b >= 0 && xs[b]! > v) {
          xs[b + 1] = xs[b]!;
          b--;
        }
        xs[b + 1] = v;
      }
      const row = y * this.w;
      for (let q = 0; q + 1 < k; q += 2) {
        const xa = Math.max(0, Math.ceil(xs[q]! - 0.5));
        const xb = Math.min(this.w - 1, Math.floor(xs[q + 1]! - 0.5));
        if (pat === "solid") {
          if (xb >= xa) this.px32.fill(c, row + xa, row + xb + 1);
        } else {
          for (let x = xa; x <= xb; x++) if (patOn(pat, x, y)) this.px32[row + x] = c;
        }
      }
    }
  }

  /** polygon from a list of [x, y] pairs (build-time convenience) */
  polyPts(pts: readonly (readonly [number, number])[], c: number, pat: Pattern = "solid"): void {
    const flat = new Float64Array(pts.length * 2);
    pts.forEach((p, i) => {
      flat[i * 2] = p[0];
      flat[i * 2 + 1] = p[1];
    });
    this.poly(flat, pts.length, c, pat);
  }

  /** Bresenham line */
  line(ax: number, ay: number, bx: number, by: number, c: number): void {
    ax = Math.round(ax);
    ay = Math.round(ay);
    bx = Math.round(bx);
    by = Math.round(by);
    const dx = Math.abs(bx - ax);
    const dy = -Math.abs(by - ay);
    const sx = ax < bx ? 1 : -1;
    const sy = ay < by ? 1 : -1;
    let e = dx + dy;
    for (let guard = 0; guard < 2048; guard++) {
      this.px(ax, ay, c);
      if (ax === bx && ay === by) break;
      const e2 = 2 * e;
      if (e2 >= dy) {
        e += dy;
        ax += sx;
      }
      if (e2 <= dx) {
        e += dx;
        ay += sy;
      }
    }
  }

  /** silhouette from a ridge (x ascending) down to yBase */
  ridge(pts: readonly (readonly [number, number])[], yBase: number, c: number): void {
    const first = pts[0];
    const last = pts[pts.length - 1];
    if (!first || !last) return;
    this.polyPts([...pts, [last[0], yBase], [first[0], yBase]], c);
  }

  /** vertical banded gradient: [[colour, height], ...]; each boundary gets 2 dither rows */
  bands(x: number, y: number, w: number, bands: readonly (readonly [number, number])[]): number {
    let yy = y;
    bands.forEach(([c, h], i) => {
      this.rect(x, yy, w, h, c);
      if (i > 0) {
        this.dither(x, yy - 2, w, 1, c, "c25");
        this.dither(x, yy - 1, w, 1, c, "c50");
      }
      yy += h;
    });
    return yy;
  }

  /** 1-bit grid blit */
  bits(g: Bits, x: number, y: number, c: number, r0 = 0, r1 = g.h): void {
    x = Math.round(x);
    y = Math.round(y);
    const d = this.px32;
    for (let r = r0; r < r1; r++) {
      const Y = y + r;
      if (Y < 0 || Y >= this.h) continue;
      const row = Y * this.w;
      const src = r * g.w;
      for (let col = 0; col < g.w; col++) {
        if (!g.d[src + col]) continue;
        const X = x + col;
        if (X >= 0 && X < this.w) d[row + X] = c;
      }
    }
  }

  /** copy another surface (alpha 0 = transparent) at an integer offset */
  draw(src: Surface, dx: number, dy: number): void {
    blit32(this, src.px32, src.w, src.h, Math.round(dx), Math.round(dy), false, -1, "solid");
  }

  /** whole-surface darkening by a power-of-two shift on every channel (1 = half brightness) */
  darken(shift: 1 | 2): void {
    const d = this.px32;
    const m = shift === 1 ? 0x7f7f7f7f : 0x3f3f3f3f;
    const a = LITTLE ? 0xff000000 : 0xff;
    for (let i = 0; i < d.length; i++) d[i] = (((d[i]! >>> shift) & m) | a) >>> 0;
  }

  /** blend every pixel towards colour c by k/4 (k = 1..3) */
  tint(c: number, k: 1 | 2 | 3, y0 = 0, y1 = this.h): void {
    const d = this.px32;
    const tr = chR(c);
    const tg = chG(c);
    const tb = chB(c);
    const from = Math.max(0, y0) * this.w;
    const to = Math.min(this.h, y1) * this.w;
    const j = 4 - k;
    for (let i = from; i < to; i++) {
      const p = d[i]!;
      d[i] = pack((chR(p) * j + tr * k) >> 2, (chG(p) * j + tg * k) >> 2, (chB(p) * j + tb * k) >> 2);
    }
  }
}

const POLY_XS = new Float64Array(64);

/**
 * Blit a 32-bit pixel array onto the surface. Pixels with alpha 0 are skipped.
 * flat >= 0 draws every opaque pixel in that colour (afterimage / flash / silhouette).
 */
export function blit32(
  S: Surface,
  src: Uint32Array,
  sw: number,
  sh: number,
  dx: number,
  dy: number,
  flip: boolean,
  flat: number,
  pat: Pattern,
): void {
  const d = S.px32;
  const W = S.w;
  const y0 = Math.max(0, -dy);
  const y1 = Math.min(sh, S.h - dy);
  const x0 = Math.max(0, -dx);
  const x1 = Math.min(sw, W - dx);
  if (y1 <= y0 || x1 <= x0) return;
  const amask = LITTLE ? 0xff000000 : 0xff;
  for (let y = y0; y < y1; y++) {
    const srow = y * sw;
    const Y = dy + y;
    const drow = Y * W + dx;
    for (let x = x0; x < x1; x++) {
      const p = src[srow + (flip ? sw - 1 - x : x)]!;
      if ((p & amask) === 0) continue;
      if (pat !== "solid" && !patOn(pat, dx + x, Y)) continue;
      d[drow + x] = flat >= 0 ? flat : p | amask;
    }
  }
}

const SPRITE32 = new WeakMap<SpriteFrame, Uint32Array>();

/** 32-bit view of a sprite's RGBA data (cached per sprite object). */
export function sprite32(s: SpriteFrame): Uint32Array {
  let v = SPRITE32.get(s);
  if (!v) {
    const d = s.data;
    if (d.byteOffset % 4 === 0 && d.length >= s.w * s.h * 4) {
      v = new Uint32Array(d.buffer, d.byteOffset, s.w * s.h);
    } else {
      const copy = new Uint8ClampedArray(s.w * s.h * 4);
      copy.set(d.subarray(0, copy.length));
      v = new Uint32Array(copy.buffer);
    }
    SPRITE32.set(s, v);
  }
  return v;
}

/**
 * Draw a sprite with its anchor (ox, oy) at screen (ax, ay). `flip` mirrors it around the anchor
 * (sprites face right; a fighter facing left is drawn flipped).
 */
export function drawSpriteAt(
  S: Surface,
  s: SpriteFrame,
  ax: number,
  ay: number,
  flip: boolean,
  flat = -1,
  pat: Pattern = "solid",
): void {
  const dx = flip ? Math.round(ax) - (s.w - 1 - s.ox) : Math.round(ax) - s.ox;
  const dy = Math.round(ay) - s.oy;
  blit32(S, sprite32(s), s.w, s.h, dx, dy, flip, flat, pat);
}

/** Dilated silhouette ring of a sprite (radius 1..3), for glow outlines. Cached per sprite. */
export interface Halo {
  w: number;
  h: number;
  /** offset of the halo grid's (0, 0) relative to the sprite's (0, 0) */
  pad: number;
  /** 0 = nothing, 1 = outer ring (distance 2..r), 2 = inner ring (distance 1) */
  d: Uint8Array;
}

const HALOS = new WeakMap<SpriteFrame, Halo>();
const HALO_R = 3;

export function spriteHalo(s: SpriteFrame): Halo {
  let h = HALOS.get(s);
  if (h) return h;
  const pad = HALO_R;
  const w = s.w + pad * 2;
  const hh = s.h + pad * 2;
  const d = new Uint8Array(w * hh);
  const src = sprite32(s);
  const amask = LITTLE ? 0xff000000 : 0xff;
  const solid = (x: number, y: number): boolean =>
    x >= 0 && y >= 0 && x < s.w && y < s.h && (src[y * s.w + x]! & amask) !== 0;
  for (let y = 0; y < hh; y++) {
    for (let x = 0; x < w; x++) {
      const sx = x - pad;
      const sy = y - pad;
      if (solid(sx, sy)) continue;
      let best = 99;
      for (let oy = -HALO_R; oy <= HALO_R && best > 1; oy++) {
        for (let ox = -HALO_R; ox <= HALO_R; ox++) {
          const q = ox * ox + oy * oy;
          if (q > HALO_R * HALO_R + 1) continue;
          if (solid(sx + ox, sy + oy) && q < best) best = q;
        }
      }
      if (best <= 2) d[y * w + x] = 2;
      else if (best < 99) d[y * w + x] = 1;
    }
  }
  h = { w, h: hh, pad, d };
  HALOS.set(s, h);
  return h;
}

/** Draw a sprite's glow halo (outer colour, inner colour; -1 skips that ring). */
export function drawHaloAt(
  S: Surface,
  s: SpriteFrame,
  ax: number,
  ay: number,
  flip: boolean,
  outer: number,
  inner: number,
  pat: Pattern = "solid",
): void {
  const h = spriteHalo(s);
  const dx = (flip ? Math.round(ax) - (s.w - 1 - s.ox) : Math.round(ax) - s.ox) - h.pad;
  const dy = Math.round(ay) - s.oy - h.pad;
  const d = S.px32;
  for (let y = 0; y < h.h; y++) {
    const Y = dy + y;
    if (Y < 0 || Y >= S.h) continue;
    const row = y * h.w;
    for (let x = 0; x < h.w; x++) {
      const v = h.d[row + (flip ? h.w - 1 - x : x)]!;
      if (!v) continue;
      const X = dx + x;
      if (X < 0 || X >= S.w) continue;
      if (pat !== "solid" && !patOn(pat, X, Y)) continue;
      const c = v === 2 ? inner : outer;
      if (c >= 0) d[Y * S.w + X] = c;
    }
  }
}
