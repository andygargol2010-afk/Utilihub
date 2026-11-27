/**
 * Fightersland fighter sprites: public API used by the stage renderer and the menus.
 *
 * Every sprite is drawn facing right with (ox, oy) at the ground point under the pelvis; the
 * renderer flips it by `facing` and lifts it by the fighter's `y`. Poses are sampled at a low
 * key rate (hand-animated look) and each key is rasterised once and cached.
 */
import type { CharId, FighterState, FightState, SpriteFrame } from "../../core/types";
import { CHAR_IDS } from "../../core/constants";
import { clipsFor, select } from "./anim";
import type { ClipName, Selection } from "./anim";
import { CHAR_DEFS } from "./chars";
import { ANIMS } from "./moves";
import { BH, BOX, BOY, BW, G, freshBuf, resolve } from "./raster";
import { drawFighter } from "./rig";

/** UI accent colour per fighter (HUD names, select screen, finisher banner). */
export const CHAR_ACCENT: Record<CharId, string> = {
  asagiri: "#e0434c",
  yoikaze: "#a8d42a",
  grimvald: "#8fb4d8",
  maelis: "#2ad1c0",
  bazalt: "#ff7a2a",
  oriel: "#f5c84a",
};

const sel: Selection = { clip: "idle", idx: 0 };

/** The full animated sprite for a fighter's current state. */
export function getFighterSprite(f: FighterState, fight: FightState): SpriteFrame {
  select(f, fight, sel);
  return clipsFor(f.char).sprite(sel.clip, sel.idx);
}

const PREVIEW_MOVES: readonly ("light" | "medium" | "heavy")[] = ["light", "medium", "heavy"];

/** Animated sprite for menus: idle breathing, a looping attack showcase, or the victory pose. */
export function getPreviewSprite(char: CharId, pose: "idle" | "attack" | "win", tick: number): SpriteFrame {
  const cc = clipsFor(char);
  const t = Math.max(0, Math.floor(tick));
  if (pose === "idle") return cc.sprite("idle", Math.floor(t / 12) % 4);
  if (pose === "win") {
    const af = t % 240;
    return cc.sprite("win", af < 36 ? 0 : 1 + (Math.floor((af - 36) / 24) % 2));
  }
  // attack showcase: idle beat, then light / medium / heavy in turn (64 ticks each)
  const cyc = t % (64 * 3);
  const mv = PREVIEW_MOVES[Math.floor(cyc / 64)] ?? "light";
  const f = cyc % 64;
  const name: ClipName = mv === "light" ? "atk_light" : mv === "medium" ? "atk_medium" : "atk_heavy";
  const m = ANIMS[char].moves[mv];
  const sn = m.startup.length;
  const cn = m.charge.length * 4;
  const an = m.active.length;
  const rn = m.recovery.length;
  if (f < 22) return cc.sprite("idle", Math.floor(t / 12) % 4);
  if (f < 34) return cc.sprite(name, Math.min(sn - 1, Math.floor(((f - 22) * sn) / 12)));
  if (f < 42) return cc.sprite(name, sn + cn + Math.min(an - 1, Math.floor(((f - 34) * an) / 8)));
  return cc.sprite(name, sn + cn + an + Math.min(rn - 1, Math.floor(((f - 42) * rn) / 22)));
}

const PORTRAITS = new Map<CharId, SpriteFrame>();
const PORTRAIT = 24;

/** 24x24 head-and-shoulders close-up (facing right) for the HUD and the select screen; (ox, oy) = bottom centre. */
export function getPortrait(char: CharId): SpriteFrame {
  let p = PORTRAITS.get(char);
  if (p) return p;
  const buf = freshBuf();
  // calm upright bust: arms lowered, weapon left out so it never covers the face
  const { drawWeapon: _weapon, drawFront: _front, ...def } = CHAR_DEFS[char];
  const idle = ANIMS[char].idle;
  const bust = { ...idle, lean: 2, bend: 0, armF: [4, 2] as const, armB: [6, 4] as const, grip2: false, z: {} };
  drawFighter(buf, def, bust, null);
  // frame the head pixels: centred horizontally, 2 px headroom
  let hx0 = BW;
  let hx1 = -1;
  let hy0 = BH;
  for (let y = 0; y < BH; y++) {
    for (let x = 0; x < BW; x++) {
      if (buf.grp[y * BW + x] === G.head && buf.mat[y * BW + x]) {
        if (x < hx0) hx0 = x;
        if (x > hx1) hx1 = x;
        if (y < hy0) hy0 = y;
      }
    }
  }
  const full = resolve(buf);
  const bx0 = BOX - full.ox;
  const by0 = BOY - full.oy;
  const x0 = Math.round((hx0 + hx1) / 2) - PORTRAIT / 2 - bx0;
  const y0 = hy0 - 2 - by0;
  const data = new Uint8ClampedArray(PORTRAIT * PORTRAIT * 4);
  for (let y = 0; y < PORTRAIT; y++) {
    const sy = y0 + y;
    if (sy < 0 || sy >= full.h) continue;
    for (let x = 0; x < PORTRAIT; x++) {
      const sx = x0 + x;
      if (sx < 0 || sx >= full.w) continue;
      const s = (sy * full.w + sx) * 4;
      const o = (y * PORTRAIT + x) * 4;
      data[o] = full.data[s] ?? 0;
      data[o + 1] = full.data[s + 1] ?? 0;
      data[o + 2] = full.data[s + 2] ?? 0;
      data[o + 3] = full.data[s + 3] ?? 0;
    }
  }
  // anchor at the bottom centre (the bust's "ground point"), like every other sprite
  p = { data, w: PORTRAIT, h: PORTRAIT, ox: PORTRAIT / 2, oy: PORTRAIT };
  PORTRAITS.set(char, p);
  return p;
}

const WARM_CLIPS: readonly ClipName[] = [
  "idle",
  "walk",
  "jump",
  "land",
  "block",
  "blockstun",
  "hitL",
  "hitM",
  "hitH",
  "atk_light",
  "atk_medium",
  "atk_heavy",
  "atk_air",
];

/**
 * Optional: rasterise the most common keys of the given fighters ahead of time (e.g. while the
 * round intro plays) so the first exchanges never pay the raster cost.
 */
export function prewarmFighters(chars: readonly CharId[] = CHAR_IDS): void {
  for (const id of chars) {
    const cc = clipsFor(id);
    for (const name of WARM_CLIPS) {
      const n = cc.clipLen(name);
      for (let i = 0; i < n; i++) cc.sprite(name, i);
    }
  }
}
