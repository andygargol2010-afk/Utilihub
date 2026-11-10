/**
 * Fightersland effects: a fixed pool of particles (sparks, dust, petals, embers, bubbles, shards,
 * wind streaks, motes) and a fixed pool of one-shot shapes (star bursts, rings, crosses, slashes,
 * shockwaves, lightning, water crescents, light rays). Everything lives in stage space
 * (x = stage px, y = screen px from the view top) and is drawn with a camera offset.
 * Struct-of-arrays storage: spawning and stepping never allocate.
 */
import { Surface, hash, patFor } from "./surface";
import type { Pattern } from "./surface";

// ------------------------------------------------------------------------------------------ particles

export const PK = {
  spark: 1,
  dot: 2,
  dust: 3,
  petal: 4,
  ember: 5,
  bubble: 6,
  shard: 7,
  wind: 8,
  mote: 9,
} as const;
export type PK = (typeof PK)[keyof typeof PK];

const PMAX = 640;

export class Particles {
  private n = 0;
  private next = 0;
  readonly kind = new Uint8Array(PMAX);
  readonly x = new Float32Array(PMAX);
  readonly y = new Float32Array(PMAX);
  readonly vx = new Float32Array(PMAX);
  readonly vy = new Float32Array(PMAX);
  readonly g = new Float32Array(PMAX);
  readonly drag = new Float32Array(PMAX);
  readonly life = new Float32Array(PMAX);
  readonly max = new Float32Array(PMAX);
  readonly size = new Float32Array(PMAX);
  readonly seed = new Uint16Array(PMAX);
  readonly c0 = new Uint32Array(PMAX);
  readonly c1 = new Uint32Array(PMAX);
  readonly c2 = new Uint32Array(PMAX);
  /** 1 = drawn behind the fighters */
  readonly back = new Uint8Array(PMAX);

  clear(): void {
    this.kind.fill(0);
    this.n = 0;
    this.next = 0;
  }

  get count(): number {
    return this.n;
  }

  spawn(
    kind: PK,
    x: number,
    y: number,
    vx: number,
    vy: number,
    life: number,
    c0: number,
    c1: number,
    c2: number,
    size = 1,
    g = 0,
    drag = 1,
    back = false,
  ): void {
    // find a free slot from the cursor; when the pool is full the oldest cursor slot is replaced
    let i = this.next;
    for (let k = 0; k < PMAX; k++) {
      const j = (this.next + k) % PMAX;
      if (this.kind[j] === 0) {
        i = j;
        break;
      }
    }
    if (this.kind[i] === 0) this.n++;
    this.next = (i + 1) % PMAX;
    this.kind[i] = kind;
    this.x[i] = x;
    this.y[i] = y;
    this.vx[i] = vx;
    this.vy[i] = vy;
    this.life[i] = 0;
    this.max[i] = Math.max(1, life);
    this.c0[i] = c0;
    this.c1[i] = c1;
    this.c2[i] = c2;
    this.size[i] = size;
    this.g[i] = g;
    this.drag[i] = drag;
    this.seed[i] = (i * 977 + Math.floor(x * 13 + y * 7)) & 0xffff;
    this.back[i] = back ? 1 : 0;
  }

  step(dt: number): void {
    for (let i = 0; i < PMAX; i++) {
      const k = this.kind[i]!;
      if (!k) continue;
      const life = this.life[i]! + dt;
      if (life >= this.max[i]!) {
        this.kind[i] = 0;
        this.n--;
        continue;
      }
      this.life[i] = life;
      const dr = dt >= 1 ? this.drag[i]! : 1 - (1 - this.drag[i]!) * dt;
      this.vx[i] = this.vx[i]! * dr;
      this.vy[i] = this.vy[i]! * dr + this.g[i]! * dt;
      let vx = this.vx[i]!;
      if (k === PK.petal) vx += Math.sin((life + this.seed[i]!) / 6) * 0.35;
      this.x[i] = this.x[i]! + vx * dt;
      this.y[i] = this.y[i]! + this.vy[i]! * dt;
      if ((k === PK.shard || k === PK.dot) && this.g[i]! > 0 && this.y[i]! > FLOOR_LINE) {
        this.y[i] = FLOOR_LINE;
        this.vy[i] = -this.vy[i]! * 0.35;
        this.vx[i] = this.vx[i]! * 0.6;
      }
    }
  }

  /** draw the particles of one layer (back = behind the fighters) */
  draw(S: Surface, ox: number, oy: number, back: boolean, t: number): void {
    const bk = back ? 1 : 0;
    for (let i = 0; i < PMAX; i++) {
      const k = this.kind[i]!;
      if (!k || this.back[i] !== bk) continue;
      const u = this.life[i]! / this.max[i]!;
      const x = Math.round(this.x[i]! + ox);
      const y = Math.round(this.y[i]! + oy);
      if (x < -24 || x > S.w + 24 || y < -24 || y > S.h + 24) continue;
      const c0 = this.c0[i]!;
      const c1 = this.c1[i]!;
      const c2 = this.c2[i]!;
      const col = u < 0.3 ? c0 : u < 0.65 ? c1 : c2;
      switch (k) {
        case PK.spark: {
          const sp = Math.hypot(this.vx[i]!, this.vy[i]!);
          const len = Math.min(7, sp * this.size[i]! * (1 - u * 0.6));
          if (sp > 0.01) {
            const nx = this.vx[i]! / sp;
            const ny = this.vy[i]! / sp;
            S.line(x, y, x - nx * len, y - ny * len, col);
          }
          S.px(x, y, u < 0.5 ? c0 : c1);
          break;
        }
        case PK.dot: {
          const s = this.size[i]! > 1 && u < 0.6 ? 2 : 1;
          S.rect(x, y, s, s, col);
          break;
        }
        case PK.dust: {
          const r = Math.round(this.size[i]! * (1 - u * 0.7));
          const pat: Pattern = u < 0.55 ? "solid" : u < 0.8 ? "c50" : "c25";
          S.disc(x, y, r, u < 0.35 ? c0 : u < 0.7 ? c1 : c2, pat);
          break;
        }
        case PK.petal: {
          const f = (Math.floor((this.life[i]! + this.seed[i]!) / 5) & 3) as number;
          if (f === 0 || f === 2) {
            S.rect(x, y, 2, 1, c0);
            S.px(x + (f === 0 ? 1 : 0), y + 1, c1);
          } else {
            S.rect(x, y, 1, 2, c0);
            S.px(x + 1, y + (f === 1 ? 1 : 0), c1);
          }
          break;
        }
        case PK.ember: {
          if (((this.seed[i]! + Math.floor(t / 3)) & 3) === 0 && u > 0.5) break;
          S.px(x, y, col);
          if (this.size[i]! > 1 && u < 0.5) S.px(x, y + 1, c1);
          break;
        }
        case PK.bubble: {
          const r = Math.max(1, Math.round(this.size[i]!));
          if (r <= 1) {
            S.px(x, y - 1, c0);
            S.px(x - 1, y, c1);
            S.px(x + 1, y, c1);
            S.px(x, y + 1, c1);
          } else S.ring(x, y, r, c1);
          S.px(x - 1, y - 1, c0);
          break;
        }
        case PK.shard: {
          const f = (this.seed[i]! + Math.floor(this.life[i]! / 3)) & 1;
          if (f) {
            S.rect(x, y, 3, 2, c1);
            S.px(x, y, c0);
          } else {
            S.rect(x, y, 2, 3, c1);
            S.px(x + 1, y, c0);
          }
          break;
        }
        case PK.wind: {
          const len = Math.round(this.size[i]! * (1 - u * 0.5));
          const dir = this.vx[i]! >= 0 ? -1 : 1;
          const pat = patFor(1 - u);
          if (!pat) break;
          S.dither(dir < 0 ? x - len : x, y, len, 1, col, pat);
          break;
        }
        case PK.mote: {
          const tw = (Math.floor((this.life[i]! + this.seed[i]!) / 4) & 1) === 0;
          S.px(x, y, tw ? c0 : c1);
          if (this.size[i]! > 1 && u < 0.6) {
            S.px(x - 1, y, c1);
            S.px(x + 1, y, c1);
            S.px(x, y - 1, c1);
            S.px(x, y + 1, c1);
          }
          break;
        }
        default:
          break;
      }
    }
  }
}

let FLOOR_LINE = 188;
/** Screen y where bouncing particles land. */
export function setParticleFloor(y: number): void {
  FLOOR_LINE = y;
}

// ------------------------------------------------------------------------------------------ shapes

export const SK = {
  /** star burst of rays + core disc (hit spark) */
  star: 1,
  /** expanding ring */
  ring: 2,
  /** 4 long rays (parry) */
  cross: 3,
  /** shield-shaped block flash facing `dir` */
  guard: 4,
  /** long straight slash line through (x, y) at angle `rot` */
  slash: 5,
  /** flat ground ellipse shockwave */
  shock: 6,
  /** lightning bolt from the top of the view down to (x, y) */
  bolt: 7,
  /** water crescent arc */
  crescent: 8,
  /** radial god-rays */
  rays: 9,
  /** soft filled flash disc */
  flash: 10,
  /** glowing ground crack line */
  crack: 11,
} as const;
export type SK = (typeof SK)[keyof typeof SK];

const SMAX = 72;

export class Shapes {
  readonly kind = new Uint8Array(SMAX);
  readonly x = new Float32Array(SMAX);
  readonly y = new Float32Array(SMAX);
  readonly age = new Float32Array(SMAX);
  readonly life = new Float32Array(SMAX);
  readonly size = new Float32Array(SMAX);
  readonly rot = new Float32Array(SMAX);
  readonly dir = new Int8Array(SMAX);
  readonly c0 = new Uint32Array(SMAX);
  readonly c1 = new Uint32Array(SMAX);
  readonly c2 = new Uint32Array(SMAX);
  readonly back = new Uint8Array(SMAX);
  private next = 0;

  clear(): void {
    this.kind.fill(0);
  }

  spawn(
    kind: SK,
    x: number,
    y: number,
    size: number,
    life: number,
    c0: number,
    c1: number,
    c2: number,
    rot = 0,
    dir: 1 | -1 = 1,
    back = false,
  ): void {
    let i = this.next;
    for (let k = 0; k < SMAX; k++) {
      const j = (this.next + k) % SMAX;
      if (this.kind[j] === 0) {
        i = j;
        break;
      }
    }
    this.next = (i + 1) % SMAX;
    this.kind[i] = kind;
    this.x[i] = x;
    this.y[i] = y;
    this.age[i] = 0;
    this.life[i] = Math.max(1, life);
    this.size[i] = size;
    this.rot[i] = rot;
    this.dir[i] = dir;
    this.c0[i] = c0;
    this.c1[i] = c1;
    this.c2[i] = c2;
    this.back[i] = back ? 1 : 0;
  }

  step(dt: number): void {
    for (let i = 0; i < SMAX; i++) {
      if (!this.kind[i]) continue;
      const a = this.age[i]! + dt;
      if (a >= this.life[i]!) this.kind[i] = 0;
      else this.age[i] = a;
    }
  }

  draw(S: Surface, ox: number, oy: number, back: boolean): void {
    const bk = back ? 1 : 0;
    for (let i = 0; i < SMAX; i++) {
      const k = this.kind[i]!;
      if (!k || this.back[i] !== bk) continue;
      drawShape(S, this, i, k, Math.round(this.x[i]! + ox), Math.round(this.y[i]! + oy));
    }
  }
}

function drawShape(S: Surface, sh: Shapes, i: number, k: number, x: number, y: number): void {
  const age = sh.age[i]!;
  const life = sh.life[i]!;
  const u = age / life;
  const size = sh.size[i]!;
  const c0 = sh.c0[i]!;
  const c1 = sh.c1[i]!;
  const c2 = sh.c2[i]!;
  const rot = sh.rot[i]!;
  const dir = sh.dir[i]!;
  switch (k) {
    case SK.star: {
      // frame 0-1: solid core flash, then rays shoot out and thin
      const n = size >= 12 ? 10 : 8;
      const grow = u < 0.25 ? 0.55 + u * 1.8 : 1;
      const r1 = size * grow;
      const r0 = u < 0.3 ? 2 : Math.round(size * (u - 0.2));
      const ray = u < 0.5 ? c1 : c2;
      for (let q = 0; q < n; q++) {
        const a = rot + (q * Math.PI * 2) / n;
        const long = q % 2 === 0 ? 1 : 0.6;
        const ca = Math.cos(a);
        const sa = Math.sin(a);
        if (r1 * long > r0) {
          S.line(x + ca * r0, y + sa * r0, x + ca * r1 * long, y + sa * r1 * long, ray);
          S.px(Math.round(x + ca * r1 * long), Math.round(y + sa * r1 * long), c0);
        }
      }
      const core = Math.round((size / 3) * (1 - u * 1.4));
      if (core > 0) {
        S.disc(x, y, core + 1, c1);
        S.disc(x, y, core, c0);
      }
      if (u < 0.2) S.ring(x, y, Math.round(size * 0.55), c0);
      break;
    }
    case SK.ring: {
      const r = Math.round(size * (0.25 + 0.75 * Math.sqrt(u)));
      const thick = u < 0.4 ? 2 : 1;
      const pat: Pattern = u < 0.6 ? "solid" : u < 0.85 ? "c50" : "c25";
      S.ring(x, y, r, u < 0.3 ? c0 : c1, thick, pat);
      if (u < 0.5 && r > 3) S.ring(x, y, r - 3, c2, 1, "c50");
      break;
    }
    case SK.cross: {
      const len = size * (u < 0.3 ? 0.6 + u * 1.4 : 1 - (u - 0.3) * 0.6);
      const w = u < 0.4 ? 1 : 0;
      S.rect(x - len, y - w, len * 2 + 1, 1 + w * 2, c1);
      S.rect(x - w, y - len * 0.7, 1 + w * 2, len * 1.4 + 1, c1);
      S.rect(x - len * 0.6, y, len * 1.2 + 1, 1, c0);
      S.rect(x, y - len * 0.45, 1, len * 0.9 + 1, c0);
      const d = Math.round(len * 0.35);
      S.line(x - d, y - d, x + d, y + d, c2);
      S.line(x - d, y + d, x + d, y - d, c2);
      if (u < 0.35) S.disc(x, y, 3, c0);
      break;
    }
    case SK.guard: {
      // a curved wall of light in front of the defender (dir = side facing the attacker)
      const h = Math.round(size * 1.3);
      const bulge = u < 0.3 ? 3 + u * 6 : 5 - (u - 0.3) * 4;
      const pat: Pattern = u < 0.5 ? "solid" : u < 0.8 ? "c50" : "c25";
      for (let yy = -h; yy <= h; yy++) {
        const v = yy / h;
        const off = Math.round(bulge * (1 - v * v) * 1.6);
        const px = x + dir * off;
        S.dither(px, y + yy, 1, 1, Math.abs(v) < 0.7 ? c0 : c1, pat);
        S.dither(px - dir, y + yy, 1, 1, c1, pat);
        S.dither(px - dir * 2, y + yy, 1, 1, c2, pat === "solid" ? "c50" : "c25");
      }
      if (u < 0.3) {
        S.disc(x, y, 4, c1);
        S.disc(x, y, 2, c0);
      }
      // chevron sparks thrown back toward the attacker
      if (u < 0.7) {
        const s = Math.round(5 + u * 14);
        S.line(x + dir * 3, y - 2, x + dir * (3 + s), y - 2 - s, c1);
        S.line(x + dir * 3, y + 2, x + dir * (3 + s), y + 2 + s, c1);
        S.line(x + dir * 4, y, x + dir * (6 + s), y, c0);
        S.px(x + dir * (3 + s), y - 2 - s, c0);
        S.px(x + dir * (3 + s), y + 2 + s, c0);
      }
      break;
    }
    case SK.slash: {
      // full-length line that shrinks to a sliver, centre brightest
      const len = size * (u < 0.15 ? u / 0.15 : 1);
      const ca = Math.cos(rot);
      const sa = Math.sin(rot);
      const thick = u < 0.35 ? 3 : u < 0.7 ? 2 : 1;
      for (let tt = -thick; tt <= thick; tt++) {
        const nx = -sa * tt;
        const ny = ca * tt;
        const c = Math.abs(tt) === thick ? c2 : Math.abs(tt) === thick - 1 && thick > 1 ? c1 : c0;
        const l = len * (1 - Math.abs(tt) / (thick + 2));
        S.line(x + nx - ca * l, y + ny - sa * l, x + nx + ca * l, y + ny + sa * l, c);
      }
      break;
    }
    case SK.shock: {
      const rx = Math.round(size * (0.2 + 0.8 * Math.sqrt(u)));
      const ry = Math.max(1, Math.round(rx / 6));
      const pat: Pattern = u < 0.5 ? "solid" : u < 0.8 ? "c50" : "c25";
      const segs = 48;
      for (let q = 0; q < segs; q++) {
        const a = (q / segs) * Math.PI * 2;
        const px = x + Math.cos(a) * rx;
        const py = y + Math.sin(a) * ry;
        S.dither(px, py, 2, 1, Math.sin(a) < 0 ? c1 : c0, pat);
      }
      if (u < 0.4) S.rect(x - rx * 0.6, y, rx * 1.2, 1, c2);
      break;
    }
    case SK.bolt: {
      if (u > 0.75 && Math.floor(age) % 2 === 1) break;
      const seed = Math.floor(sh.rot[i]! * 1000);
      let px = x + Math.round((hash(seed) - 0.5) * 30);
      let py = 0;
      const steps = 9;
      for (let q = 1; q <= steps; q++) {
        const ny = Math.round((y * q) / steps);
        const nx = q === steps ? x : x + Math.round((hash(seed + q * 7) - 0.5) * 26 * (1 - q / steps)) + (q % 2 ? 4 : -4);
        S.line(px - 1, py, nx - 1, ny, c1);
        S.line(px + 1, py, nx + 1, ny, c1);
        S.line(px, py, nx, ny, c0);
        if (q === 4 || q === 6) {
          const bx = nx + (q === 4 ? 10 : -9);
          S.line(nx, ny, bx, ny + 8, c2);
        }
        px = nx;
        py = ny;
      }
      if (u < 0.5) {
        S.disc(x, y, 5, c1);
        S.disc(x, y, 3, c0);
      }
      break;
    }
    case SK.crescent: {
      // half-ring opening towards dir, sweeping outward
      const r = Math.round(size * (0.4 + 0.6 * u));
      const thick = u < 0.5 ? 3 : 2;
      const pat: Pattern = u < 0.6 ? "solid" : u < 0.85 ? "c50" : "c25";
      for (let q = 0; q <= 28; q++) {
        const a = -Math.PI / 2 + (q / 28) * Math.PI;
        const ca = Math.cos(a) * dir;
        const sa = Math.sin(a);
        for (let tt = 0; tt < thick; tt++) {
          const rr = r - tt;
          const c = tt === 0 ? c0 : tt === 1 ? c1 : c2;
          S.dither(x + ca * rr, y + sa * rr * 1.2, 1, 1, c, pat);
        }
      }
      break;
    }
    case SK.rays: {
      const n = 12;
      const len = size * (u < 0.2 ? u / 0.2 : 1);
      const pat: Pattern = u < 0.55 ? "c50" : "c25";
      for (let q = 0; q < n; q++) {
        const a = rot + age * 0.01 + (q * Math.PI * 2) / n;
        const ca = Math.cos(a);
        const sa = Math.sin(a);
        const steps = Math.round(len / 2);
        for (let s = 2; s < steps; s++) {
          const rr = s * 2;
          const w = Math.max(1, Math.round(rr / 18));
          S.dither(x + ca * rr - (w >> 1), y + sa * rr - (w >> 1), w, w, q % 2 ? c1 : c0, s < steps * 0.5 ? "solid" : pat);
        }
      }
      break;
    }
    case SK.flash: {
      const r = Math.round(size * (u < 0.3 ? 1 : 1 - (u - 0.3)));
      const pat: Pattern = u < 0.3 ? "solid" : u < 0.65 ? "c50" : "c25";
      S.disc(x, y, r, c1, pat);
      if (u < 0.5) S.disc(x, y, Math.round(r * 0.6), c0, pat);
      break;
    }
    case SK.crack: {
      // jagged glowing fissure along the floor, centred on x
      const len = Math.round(size * (u < 0.2 ? u / 0.2 : 1));
      const c = u < 0.5 ? c0 : u < 0.8 ? c1 : c2;
      let py = y;
      for (let s = -len; s <= len; s += 3) {
        const ny = y + Math.round((hash(s * 13 + Math.floor(rot * 100)) - 0.5) * 3);
        S.line(x + s, py, x + s + 3, ny, c);
        if (u < 0.6 && (s & 7) === 0) S.px(x + s, ny - 1, c1);
        py = ny;
      }
      break;
    }
    default:
      break;
  }
}
