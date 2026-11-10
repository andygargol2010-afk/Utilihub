/**
 * Fightersland menu art helpers for the DOM screens: draw a fighter sprite / portrait onto any
 * 2D canvas context (crisp integer scaling, optional mirror) and paint a stage thumbnail.
 * DOM objects are only created when these functions are called (SSR-safe at import time).
 */
import type { MapId, SpriteFrame } from "../core/types";
import { STAGE_W, VIEW_H, VIEW_W } from "../core/constants";
import { getMapArt } from "./maps";
import { Surface } from "./surface";

type AnyCanvas = HTMLCanvasElement | OffscreenCanvas;

const SPRITE_CANVAS = new WeakMap<SpriteFrame, AnyCanvas>();

function makeCanvas(w: number, h: number): AnyCanvas | null {
  if (typeof OffscreenCanvas !== "undefined") return new OffscreenCanvas(w, h);
  if (typeof document !== "undefined") {
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    return c;
  }
  return null;
}

function canvasFor(s: SpriteFrame): AnyCanvas | null {
  let c = SPRITE_CANVAS.get(s);
  if (c) return c;
  const made = makeCanvas(s.w, s.h);
  if (!made) return null;
  const cx = made.getContext("2d") as CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D | null;
  if (!cx) return null;
  const id = cx.createImageData(s.w, s.h);
  id.data.set(s.data.subarray(0, id.data.length));
  cx.putImageData(id, 0, 0);
  c = made;
  SPRITE_CANVAS.set(s, c);
  return c;
}

export interface DrawSpriteOptions {
  /** integer pixel scale (default 1) */
  scale?: number;
  /** mirror horizontally (the sprite faces left) */
  flip?: boolean;
}

/**
 * Draw a sprite with its anchor (ox, oy) — the ground point, or the bottom centre of a
 * portrait — at (x, y) of the context, scaled by an integer factor with nearest-neighbour.
 */
export function drawSprite(ctx: CanvasRenderingContext2D, sprite: SpriteFrame, x: number, y: number, opts?: DrawSpriteOptions): void {
  const k = Math.max(1, Math.round(opts?.scale ?? 1));
  const flip = opts?.flip ?? false;
  const left = Math.round(x - (flip ? sprite.w - sprite.ox : sprite.ox) * k);
  const top = Math.round(y - sprite.oy * k);
  const c = canvasFor(sprite);
  if (c) {
    const prev = ctx.imageSmoothingEnabled;
    ctx.imageSmoothingEnabled = false;
    if (flip) {
      ctx.save();
      ctx.translate(left + sprite.w * k, top);
      ctx.scale(-1, 1);
      ctx.drawImage(c, 0, 0, sprite.w * k, sprite.h * k);
      ctx.restore();
    } else ctx.drawImage(c, left, top, sprite.w * k, sprite.h * k);
    ctx.imageSmoothingEnabled = prev;
    return;
  }
  // no canvas factory available: fill horizontal runs of identical pixels
  const d = sprite.data;
  for (let sy = 0; sy < sprite.h; sy++) {
    let sx = 0;
    while (sx < sprite.w) {
      const o = (sy * sprite.w + sx) * 4;
      if (!d[o + 3]) {
        sx++;
        continue;
      }
      const r = d[o] ?? 0;
      const g = d[o + 1] ?? 0;
      const b = d[o + 2] ?? 0;
      let n = 1;
      while (sx + n < sprite.w) {
        const q = (sy * sprite.w + sx + n) * 4;
        if (!d[q + 3] || d[q] !== r || d[q + 1] !== g || d[q + 2] !== b) break;
        n++;
      }
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      const dx = flip ? sprite.w - sx - n : sx;
      ctx.fillRect(left + dx * k, top + sy * k, n * k, k);
      sx += n;
    }
  }
}

const THUMB_FRAME = new Map<MapId, Surface>();

/** The full 384x216 stage view (centre camera, ambient frame 100), rendered once per map. */
function stageFrame(map: MapId): Surface {
  let s = THUMB_FRAME.get(map);
  if (!s) {
    s = new Surface(VIEW_W, VIEW_H);
    const art = getMapArt(map);
    const cam = (STAGE_W - VIEW_W) / 2;
    art.back(s, cam, 100);
    art.front(s, cam, 100);
    THUMB_FRAME.set(map, s);
  }
  return s;
}

const THUMB_CANVAS = new Map<string, AnyCanvas>();
const THUMB_PIXELS = new Map<string, Uint8ClampedArray>();

/**
 * Paint a w x h thumbnail of the stage at the context's origin (0, 0). The view is scaled to
 * cover the box (centre crop): box-filtered when shrinking, nearest-neighbour when enlarging.
 */
export function drawMapThumb(ctx: CanvasRenderingContext2D, map: MapId, w: number, h: number): void {
  const W = Math.max(1, Math.round(w));
  const H = Math.max(1, Math.round(h));
  const key = `${map}|${W}|${H}`;
  let c = THUMB_CANVAS.get(key);
  if (!c) {
    let px = THUMB_PIXELS.get(key);
    if (!px) {
      px = thumbPixels(stageFrame(map), W, H);
      if (THUMB_PIXELS.size > 24) THUMB_PIXELS.clear();
      THUMB_PIXELS.set(key, px);
    }
    const made = makeCanvas(W, H);
    const cx = made ? (made.getContext("2d") as CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D | null) : null;
    if (!made || !cx) {
      const id = ctx.createImageData(W, H);
      id.data.set(px);
      ctx.putImageData(id, 0, 0);
      return;
    }
    const id = cx.createImageData(W, H);
    id.data.set(px);
    cx.putImageData(id, 0, 0);
    c = made;
    if (THUMB_CANVAS.size > 24) THUMB_CANVAS.clear();
    THUMB_CANVAS.set(key, c);
  }
  const prev = ctx.imageSmoothingEnabled;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(c, 0, 0);
  ctx.imageSmoothingEnabled = prev;
}

function thumbPixels(src: Surface, W: number, H: number): Uint8ClampedArray {
  const out = new Uint8ClampedArray(W * H * 4);
  const scale = Math.max(W / VIEW_W, H / VIEW_H);
  const cropW = W / scale;
  const cropH = H / scale;
  const x0 = (VIEW_W - cropW) / 2;
  const y0 = (VIEW_H - cropH) / 2;
  const b = src.bytes;
  for (let y = 0; y < H; y++) {
    const sy0 = y0 + y / scale;
    const sy1 = y0 + (y + 1) / scale;
    for (let x = 0; x < W; x++) {
      const sx0 = x0 + x / scale;
      const sx1 = x0 + (x + 1) / scale;
      const o = (y * W + x) * 4;
      if (scale >= 1) {
        const s = (Math.min(VIEW_H - 1, Math.floor(sy0)) * VIEW_W + Math.min(VIEW_W - 1, Math.floor(sx0))) * 4;
        out[o] = b[s] ?? 0;
        out[o + 1] = b[s + 1] ?? 0;
        out[o + 2] = b[s + 2] ?? 0;
        out[o + 3] = 255;
        continue;
      }
      let r = 0;
      let g = 0;
      let bl = 0;
      let n = 0;
      for (let yy = Math.floor(sy0); yy < Math.ceil(sy1) && yy < VIEW_H; yy++) {
        for (let xx = Math.floor(sx0); xx < Math.ceil(sx1) && xx < VIEW_W; xx++) {
          const s = (yy * VIEW_W + xx) * 4;
          r += b[s] ?? 0;
          g += b[s + 1] ?? 0;
          bl += b[s + 2] ?? 0;
          n++;
        }
      }
      n = Math.max(1, n);
      out[o] = Math.round(r / n);
      out[o + 1] = Math.round(g / n);
      out[o + 2] = Math.round(bl / n);
      out[o + 3] = 255;
    }
  }
  return out;
}
