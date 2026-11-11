/**
 * Fightersland stage renderer: composites the map (parallax layers + ambient animation), shadows,
 * fighters, event-driven effects, the finisher cinematic, the HUD and the announcer into a
 * 384x216 software surface that is presented with a single putImageData.
 *
 * `update(state)` runs once per simulation tick (consumes `state.events`, advances effects and
 * the camera); `draw(ctx, state)` composes the frame. Nothing touches the DOM until the first
 * draw, and the hot paths reuse fixed buffers.
 */
import type {
  CharId,
  FightEvent,
  FightState,
  FighterState,
  PlayerIndex,
  RenderLabels,
  Renderer,
  RendererOptions,
  SpriteFrame,
} from "../core/types";
import { CHAR_NAMES, FINISHER, GROUND_Y, STAGE_W, VIEW_H, VIEW_W } from "../core/constants";
import { getDebugBoxes, getGuard } from "../sim/index";
import { CHAR_ACCENT, getFighterSprite, getPortrait, prewarmFighters } from "./fighters/index";
import {
  FIN_STYLE,
  LETTERBOX,
  PANEL_FULL,
  PANEL_GONE,
  ZOOM_IN,
  ZOOM_OUT,
  drawBackdrop,
  finisherAmbient,
  finisherHitFx,
  letterbox,
  panelCover,
} from "./finisher";
import type { FxSink } from "./finisher";
import { PK, Particles, SK, Shapes, setParticleFloor } from "./fx";
import {
  HUD,
  INK,
  PORTRAIT_BG,
  bannerStamp,
  drawStamp,
  guardBar,
  hpBar,
  pip,
  portrait,
  tag,
  textStamp,
  timerBox,
} from "./hud";
import type { Stamp } from "./hud";
import { SCROLL, getMapArt } from "./maps";
import type { MapArt } from "./maps";
import { Surface, drawHaloAt, drawSpriteAt, hash, mix, rgb } from "./surface";
import type { Pattern } from "./surface";

export { drawText, measureText, FONT_HEIGHT } from "./font";

// ------------------------------------------------------------------------------------------ colours

const C = {
  white: rgb("#ffffff"),
  silhouette: rgb("#0e0b14"),
  hit: {
    light: [rgb("#ffffff"), rgb("#fff08a"), rgb("#e8b83a")] as const,
    medium: [rgb("#ffffff"), rgb("#fff08a"), rgb("#e8802a")] as const,
    heavy: [rgb("#ffffff"), rgb("#ffbf5e"), rgb("#e8682a")] as const,
  },
  block: [rgb("#ffffff"), rgb("#84c8ff"), rgb("#3a7bd6")] as const,
  parry: [rgb("#ffffff"), rgb("#7ff0c8"), rgb("#2aa79a")] as const,
  guard: [rgb("#d9f0f5"), rgb("#84c8ff"), rgb("#3a7bd6")] as const,
  charge: rgb("#fff08a"),
};

const ACCENT: Record<CharId, number> = {
  asagiri: rgb(CHAR_ACCENT.asagiri),
  yoikaze: rgb(CHAR_ACCENT.yoikaze),
  grimvald: rgb(CHAR_ACCENT.grimvald),
  maelis: rgb(CHAR_ACCENT.maelis),
  bazalt: rgb(CHAR_ACCENT.bazalt),
  oriel: rgb(CHAR_ACCENT.oriel),
};

// ------------------------------------------------------------------------------------------ state

const AFTER_N = 6;

interface FighterFx {
  /** frames of flat-colour flash left, and its colour */
  flash: number;
  flashCol: number;
  /** portrait frame flash after taking damage */
  hurt: number;
  ghost: number;
  ghostHold: number;
  lastHp: number;
  combo: number;
  comboT: number;
  comboPop: number;
  /** afterimages (ring buffer) */
  aSprite: (SpriteFrame | null)[];
  aX: Float32Array;
  aY: Float32Array;
  aFace: Int8Array;
  aAge: Float32Array;
  aNext: number;
  lastAction: string;
  /** flash only on alternate frames (with a glow halo in between) */
  flicker: boolean;
}

function newFighterFx(): FighterFx {
  return {
    flash: 0,
    flashCol: 0,
    hurt: 0,
    ghost: 1,
    ghostHold: 0,
    lastHp: -1,
    combo: 0,
    comboT: 0,
    comboPop: 0,
    aSprite: new Array<SpriteFrame | null>(AFTER_N).fill(null),
    aX: new Float32Array(AFTER_N),
    aY: new Float32Array(AFTER_N),
    aFace: new Int8Array(AFTER_N),
    aAge: new Float32Array(AFTER_N).fill(99),
    aNext: 0,
    lastAction: "",
    flicker: false,
  };
}

type BannerStyle = "slide" | "pop" | "rise";

interface Banner {
  stamp: Stamp;
  /** centre x, top y */
  x: number;
  y: number;
  age: number;
  delay: number;
  /** total frames visible (Infinity = until cleared) */
  life: number;
  style: BannerStyle;
  /** removed when the fight leaves this phase (null = time based only) */
  phase: string | null;
}

const BIG = 2;

export function createRenderer(initial: RendererOptions): Renderer {
  const opts: RendererOptions = { labels: { ...initial.labels }, reducedFlash: initial.reducedFlash, debug: initial.debug };

  let img: ImageData | null = null;
  let S: Surface | null = null;
  let world: Surface | null = null;
  
  const parts = new Particles();
  const shapes = new Shapes();
  const fxs: [FighterFx, FighterFx] = [newFighterFx(), newFighterFx()];
  const banners: Banner[] = [];

  /** Identity of the current fight: its (immutable, shared) config object. Online play updates
   *  the renderer with the confirmed state and draws a predicted copy of the same fight. */
  let lastFight: FightState["config"] | null = null;
  let t = 0;
  let cam = SCROLL / 2;
  let shakeAmp = 0;
  let shakeX = 0;
  let shakeY = 0;
  let flashT = 0;
  let flashLen = 1;
  let lastVictim = -1;
  let finWinner: PlayerIndex | -1 = -1;
  /** impact frames: white world with ink silhouettes (match-winning blow) */
  let impactT = 0;

  setParticleFloor(GROUND_Y + 2);

  const sink: FxSink = {
    p: parts,
    s: shapes,
    shake: (px) => addShake(px),
    flash: (n) => addFlash(n),
  };

  function addShake(px: number): void {
    const cap = opts.reducedFlash ? 1 : 7;
    shakeAmp = Math.min(cap, Math.max(shakeAmp, opts.reducedFlash ? Math.min(1, px * 0.5) : px));
  }

  function addFlash(n: number): void {
    const len = opts.reducedFlash ? Math.min(2, n) : n;
    if (len > flashT) {
      flashT = len;
      flashLen = len;
    }
  }

  function reset(): void {
    parts.clear();
    shapes.clear();
    banners.length = 0;
    for (let i = 0; i < 2; i++) {
      const f = fxs[i as PlayerIndex];
      Object.assign(f, newFighterFx());
    }
    shakeAmp = 0;
    shakeX = 0;
    shakeY = 0;
    flashT = 0;
    impactT = 0;
    lastVictim = -1;
    finWinner = -1;
    lastFight = null;
  }

  function camTarget(state: FightState): number {
    const [a, b] = state.fighters;
    const mid = (a.x + b.x) / 2;
    return clamp(mid - VIEW_W / 2, 0, STAGE_W - VIEW_W);
  }

  function labels(): RenderLabels {
    return opts.labels;
  }

  function pushBanner(text: string, times: number, bands: readonly [number, number, number], y: number, life: number, style: BannerStyle, delay = 0, phase: string | null = null): void {
    if (!text) return;
    const stamp = bannerStamp(text, times, bands);
    // a new main banner replaces one in the same row
    for (let i = banners.length - 1; i >= 0; i--) {
      const b = banners[i];
      if (b && Math.abs(b.y - y) < 12 && b.delay <= 0) banners.splice(i, 1);
    }
    if (banners.length > 6) banners.shift();
    banners.push({ stamp, x: VIEW_W / 2, y, age: 0, delay, life, style, phase });
  }

  // ---------------------------------------------------------------------------------------- events

  function onEvent(state: FightState, e: FightEvent): void {
    const L = labels();
    switch (e.type) {
      case "roundIntro": {
        banners.length = 0;
        for (const f of fxs) {
          f.ghost = 1;
          f.ghostHold = 0;
          f.combo = 0;
          f.comboT = 0;
        }
        const txt = e.final ? L.finalRound : `${L.round} ${e.round}`;
        pushBanner(txt, 1, HUD.gold, 74, 70, "slide", 8, "intro");
        break;
      }
      case "fight": {
        pushBanner(L.fight, BIG, HUD.red, 66, 48, "pop");
        addShake(2);
        break;
      }
      case "whoosh": {
        const f = state.fighters[e.player];
        if (e.move === "heavy" || e.charge > 0) {
          for (let i = 0; i < 3 + e.charge * 2; i++) {
            parts.spawn(PK.wind, f.x - f.facing * 6, GROUND_Y - f.y - 20 - hash(t + i * 5) * 30, f.facing * (4 + hash(t + i) * 3), 0, 9, C.white, rgb("#c9d4de"), rgb("#8492a8"), 10 + hash(i + t) * 12, 0, 0.92, true);
          }
        }
        if (e.move === "heavy" && f.y <= 0) dust(state, f.x - f.facing * 8, 1, -f.facing, 0.8);
        break;
      }
      case "charge": {
        const f = state.fighters[e.player];
        const acc = ACCENT[f.char];
        const cx = f.x;
        const cy = GROUND_Y - f.y - 34;
        if (e.level === 1) {
          shapes.spawn(SK.ring, cx, cy, 22, 14, C.white, acc, acc);
        } else {
          shapes.spawn(SK.ring, cx, cy, 36, 18, C.white, acc, C.white);
          shapes.spawn(SK.star, cx, cy - 6, 10, 10, C.white, C.charge, acc);
          const fx = fxs[e.player];
          fx.flash = 4;
          fx.flashCol = C.white;
          fx.flicker = true;
          addShake(1);
        }
        for (let i = 0; i < 6 + e.level * 4; i++) {
          const a = hash(t * 3 + i) * Math.PI * 2;
          parts.spawn(PK.mote, cx + Math.cos(a) * 18, cy + Math.sin(a) * 22, -Math.cos(a) * 0.9, -Math.sin(a) * 0.9 - 0.3, 18, C.white, acc, acc, 2);
        }
        break;
      }
      case "hit": {
        const att = state.fighters[e.attacker];
        const vi = e.attacker === 0 ? 1 : 0;
        const str = e.move === "air" ? "medium" : e.move;
        const cols = C.hit[str];
        const base = str === "light" ? 9 : str === "medium" ? 12 : 15;
        const size = base + e.charge * 3;
        const dir = att.facing;
        shapes.spawn(SK.star, e.x, e.y, size, 9 + e.charge * 2 + (str === "heavy" ? 2 : 0), cols[0], cols[1], cols[2], hash(t) * 0.8);
        if (str !== "light" || e.charge > 0) shapes.spawn(SK.ring, e.x, e.y, size + 6, 12, cols[0], cols[1], cols[2]);
        if (e.charge === 2) {
          const acc = ACCENT[att.char];
          shapes.spawn(SK.ring, e.x, e.y, 40, 18, C.white, acc, acc);
          shapes.spawn(SK.flash, e.x, e.y, 14, 8, C.white, acc, acc);
        }
        const n = (str === "light" ? 4 : str === "medium" ? 6 : 9) + e.charge * 3;
        for (let i = 0; i < n; i++) {
          const a = (hash(t * 11 + i) - 0.5) * 2.2 + (dir > 0 ? 0 : Math.PI);
          const sp = 2 + hash(t * 5 + i) * (2 + base / 5);
          parts.spawn(PK.spark, e.x, e.y, Math.cos(a) * sp, Math.sin(a) * sp - 0.8, 9 + hash(i) * 6, cols[0], cols[1], cols[2], 1.1, 0.16, 0.86);
        }
        const victim = state.fighters[vi];
        const vf = fxs[vi];
        vf.flash = 2;
        vf.flashCol = C.white;
        vf.flicker = false;
        vf.hurt = 10;
        lastVictim = vi;
        addShake((str === "light" ? 1 : str === "medium" ? 2 : 3) + e.charge + (e.launch ? 1 : 0));
        if (e.launch || str === "heavy") dust(state, victim.x + dir * 6, 2, dir, 1);
        if (e.launch) {
          for (let i = 0; i < 6; i++)
            parts.spawn(PK.wind, e.x - dir * 10, e.y - 18 + i * 7, dir * (5 + hash(i + t) * 3), 0, 14, C.white, cols[1], cols[2], 18 + hash(t + i * 3) * 18, 0, 0.95, true);
        }
        if (e.combo >= 2) {
          const af = fxs[e.attacker];
          if (e.combo !== af.combo) af.comboPop = 6;
          af.combo = e.combo;
          af.comboT = 80;
        }
        break;
      }
      case "block": {
        const def = state.fighters[e.defender];
        const dir = def.facing;
        const heavy = e.move === "heavy";
        shapes.spawn(SK.guard, e.x, e.y, heavy ? 14 : 11, heavy ? 14 : 11, C.block[0], C.block[1], C.block[2], 0, dir);
        for (let i = 0; i < (heavy ? 6 : 3); i++) {
          const a = (hash(t * 7 + i) - 0.5) * 2.4 + (dir > 0 ? 0 : Math.PI);
          parts.spawn(PK.spark, e.x, e.y, Math.cos(a) * 2.5, Math.sin(a) * 2.5 - 0.5, 8, C.block[0], C.block[1], C.block[2], 1, 0.1, 0.85);
        }
        dust(state, def.x - dir * 8, heavy ? 2 : 1, -dir, 0.7);
        if (heavy) addShake(1);
        const fx = fxs[e.defender];
        fx.flash = 2;
        fx.flashCol = rgb("#c9e6ff");
        fx.flicker = false;
        break;
      }
      case "parry": {
        shapes.spawn(SK.cross, e.x, e.y, 22, 16, C.parry[0], C.parry[1], C.parry[2]);
        shapes.spawn(SK.ring, e.x, e.y, 30, 16, C.parry[0], C.parry[1], C.parry[2]);
        for (let i = 0; i < 10; i++) {
          const a = (i / 10) * Math.PI * 2;
          parts.spawn(PK.mote, e.x, e.y, Math.cos(a) * 2.2, Math.sin(a) * 2.2, 16, C.white, C.parry[1], C.parry[2], 1, 0, 0.9);
        }
        const att = e.defender === 0 ? 1 : 0;
        fxs[att].flash = 6;
        fxs[att].flashCol = C.parry[1];
        fxs[att].flicker = true;
        fxs[e.defender].flash = 2;
        fxs[e.defender].flashCol = C.white;
        fxs[e.defender].flicker = false;
        addFlash(2);
        addShake(2);
        break;
      }
      case "guardBreak": {
        shapes.spawn(SK.star, e.x, e.y, 18, 14, C.guard[0], C.guard[1], C.guard[2], 0.3);
        shapes.spawn(SK.ring, e.x, e.y, 44, 22, C.white, C.guard[1], C.guard[2]);
        for (let i = 0; i < 14; i++) {
          const a = hash(t * 9 + i) * Math.PI * 2;
          const sp = 1.5 + hash(i * 3 + t) * 3.5;
          parts.spawn(PK.shard, e.x, e.y, Math.cos(a) * sp, Math.sin(a) * sp - 1.5, 46, C.guard[0], C.guard[1], C.guard[2], 1, 0.2, 0.98);
        }
        fxs[e.defender].flash = 4;
        fxs[e.defender].flashCol = C.guard[1];
        fxs[e.defender].flicker = false;
        addShake(4);
        addFlash(3);
        break;
      }
      case "dodge": {
        const f = state.fighters[e.player];
        dust(state, e.x + f.facing * 4, 2, f.facing, 1);
        break;
      }
      case "jump": {
        dust(state, e.x, 1, 0, 0.8);
        break;
      }
      case "land": {
        dust(state, e.x - 6, 1, -1, 0.8);
        dust(state, e.x + 6, 1, 1, 0.8);
        break;
      }
      case "knockdown": {
        dust(state, e.x - 10, 3, -1, 1.2);
        dust(state, e.x + 10, 3, 1, 1.2);
        const m = mapOf(state);
        shapes.spawn(SK.shock, e.x, GROUND_Y + 1, 36, 16, m.dust[0], m.dust[1], m.dust[2], 0, 1, true);
        addShake(2);
        break;
      }
      case "ko": {
        addFlash(8);
        addShake(5);
        pushBanner(L.ko, BIG, HUD.red, 70, 100, "pop", 0, null);
        if (e.perfect) pushBanner(L.perfect, 1, HUD.gold, 118, 70, "rise", 34, null);
        break;
      }
      case "timeUp": {
        pushBanner(L.timeUp, BIG, HUD.ice, 70, 86, "pop");
        break;
      }
      case "roundEnd": {
        if (e.winner === "draw") pushBanner(L.draw, BIG, HUD.silver, 70, 100, "pop", 6);
        else {
          const name = CHAR_NAMES[state.fighters[e.winner].char];
          pushBanner(`${name} ${L.wins}`, 1, HUD.gold, 78, 100, "slide", 10);
        }
        break;
      }
      case "finisherStart": {
        finWinner = e.winner;
        addFlash(8);
        addShake(5);
        pushBanner(L.ko, BIG, HUD.red, 70, PANEL_FULL - 14, "pop", 0, null);
        const w = state.fighters[e.winner];
        if (w.hp >= w.maxHp) pushBanner(L.perfect, 1, HUD.gold, 118, PANEL_FULL - 30, "rise", 14, null);
        break;
      }
      case "finisherHit": {
        const w = state.fighters[e.winner];
        finisherHitFx(sink, w.char, e.x, e.y, w.facing, e.index, e.final, opts.reducedFlash);
        const li = e.winner === 0 ? 1 : 0;
        fxs[li].flash = e.final ? 4 : 2;
        fxs[li].flashCol = C.white;
        fxs[li].flicker = false;
        fxs[li].hurt = 10;
        if (e.final && !opts.reducedFlash) impactT = 4;
        break;
      }
      case "matchEnd": {
        const name = CHAR_NAMES[state.fighters[e.winner].char];
        pushBanner(name, 1, HUD.gold, 62, Infinity, "slide", 4, "matchEnd");
        pushBanner(L.wins, BIG, HUD.gold, 88, Infinity, "pop", 16, "matchEnd");
        break;
      }
    }
  }

  function mapOf(state: FightState): MapArt {
    return getMapArt(state.config.map);
  }

  function dust(state: FightState, x: number, amount: number, dir: number, scale: number): void {
    const m = mapOf(state);
    const n = 2 + amount * 2;
    for (let i = 0; i < n; i++) {
      const r = hash(t * 17 + i * 31 + Math.floor(x));
      const r2 = hash(t * 23 + i * 7);
      const vx = (dir === 0 ? (r - 0.5) * 2 : dir * (0.4 + r * 1.2)) * scale;
      parts.spawn(PK.dust, x + (r2 - 0.5) * 8, GROUND_Y - 1 - r * 3, vx, -0.25 - r2 * 0.5, 16 + r * 12, m.dust[0], m.dust[1], m.dust[2], Math.round((2 + r2 * 2) * scale), -0.004, 0.9);
    }
  }

  // ---------------------------------------------------------------------------------------- update

  function update(state: FightState): void {
    if (state.config !== lastFight) {
      reset();
      lastFight = state.config;
      cam = camTarget(state);
      // new fight: build the stage layers and rasterise the common fighter keys up front
      getMapArt(state.config.map);
      prewarmFighters(state.config.chars);
      for (let i = 0; i < 2; i++) {
        const f = state.fighters[i as PlayerIndex];
        fxs[i as PlayerIndex].lastHp = f.hp;
        fxs[i as PlayerIndex].ghost = f.hp / f.maxHp;
      }
    }
    t++;
    const dt = state.slowmo > 0 ? 0.5 : 1;
    const ev = state.events;
    for (let i = 0; i < ev.length; i++) {
      const e = ev[i];
      if (e) onEvent(state, e);
    }

    for (let i = 0; i < 2; i++) {
      const idx = i as PlayerIndex;
      const f = state.fighters[idx];
      const fx = fxs[idx];
      // HP ghost: hold briefly after damage, then drain
      const hp = f.hp / f.maxHp;
      if (fx.lastHp >= 0 && f.hp < fx.lastHp) fx.ghostHold = 30;
      fx.lastHp = f.hp;
      if (hp >= fx.ghost) {
        fx.ghost = hp;
        fx.ghostHold = 0;
      } else if (fx.ghostHold > 0) {
        if (state.hitstop === 0) fx.ghostHold--;
      } else fx.ghost = Math.max(hp, fx.ghost - 0.01);
      if (fx.flash > 0) fx.flash--;
      else fx.flicker = false;
      if (fx.hurt > 0) fx.hurt--;
      if (fx.comboT > 0 && f.combo === 0) fx.comboT--;
      if (fx.comboPop > 0) fx.comboPop--;
      // afterimages: dodge (and dashing finishers)
      for (let k = 0; k < AFTER_N; k++) fx.aAge[k] = fx.aAge[k]! + dt;
      const trail = f.action === "dodge" || (f.action === "finisher" && f.char === "yoikaze") || f.action === "launch";
      if (trail && state.hitstop === 0 && t % 3 === 0) {
        const k = fx.aNext;
        fx.aSprite[k] = getFighterSprite(f, state);
        fx.aX[k] = f.x;
        fx.aY[k] = f.y;
        fx.aFace[k] = f.facing;
        fx.aAge[k] = 0;
        fx.aNext = (k + 1) % AFTER_N;
      }
      // charge aura particles
      if (f.action === "attack" && f.phase === "charge" && (t & 1) === 0) {
        const acc = ACCENT[f.char];
        const r = hash(t * 5 + i);
        parts.spawn(PK.dot, f.x + (r - 0.5) * 30, GROUND_Y - f.y - 2 - hash(t * 3 + i) * 10, 0, -0.9 - f.chargeLevel * 0.4, 22, f.chargeLevel === 2 ? C.white : acc, acc, acc, f.chargeLevel + 1, 0, 1);
      }
      fx.lastAction = f.action;
    }

    // camera: follow the midpoint (a little looser during the finisher walk-in)
    const target = camTarget(state);
    cam += (target - cam) * (state.phase === "finisher" ? 0.12 : 0.2);
    if (Math.abs(target - cam) < 0.05) cam = target;

    if (state.phase === "finisher" && finWinner >= 0) {
      const w = state.fighters[finWinner as PlayerIndex];
      finisherAmbient(sink, w.char, state.phaseFrame, w.x, GROUND_Y - w.y, w.facing, t);
    } else if (state.phase !== "finisher" && state.phase !== "matchEnd") finWinner = -1;

    parts.step(dt);
    shapes.step(dt);

    // screenshake: decaying random offset
    if (shakeAmp > 0.2) {
      shakeX = Math.round((hash(t * 2 + 1) * 2 - 1) * shakeAmp);
      shakeY = Math.round((hash(t * 2 + 2) * 2 - 1) * shakeAmp * 0.6);
      shakeAmp *= 0.8;
    } else {
      shakeAmp = 0;
      shakeX = 0;
      shakeY = 0;
    }
    if (flashT > 0) flashT--;
    if (impactT > 0) impactT--;

    for (let i = banners.length - 1; i >= 0; i--) {
      const b = banners[i];
      if (!b) continue;
      if (b.delay > 0) b.delay--;
      else b.age++;
      if (b.age >= b.life || (b.phase !== null && b.phase !== state.phase)) banners.splice(i, 1);
    }
  }

  // ---------------------------------------------------------------------------------------- draw

  function ensureSurface(ctx: CanvasRenderingContext2D): Surface {
    if (!img || !S) {
      img = ctx.createImageData(VIEW_W, VIEW_H);
      S = new Surface(VIEW_W, VIEW_H, img.data);
    }
    return S;
  }

  function drawShadow(W: Surface, m: MapArt, f: FighterState, camI: number): void {
    const cx = Math.round(f.x - camI);
    const hw = Math.max(6, Math.round(14 - f.y / 9));
    const pat: Pattern = f.y > 24 ? "c50" : "solid";
    W.dither(cx - hw + 2, GROUND_Y, hw * 2 - 4, 1, m.shadow, pat);
    W.dither(cx - hw, GROUND_Y + 1, hw * 2, 2, m.shadow, pat);
    W.dither(cx - hw + 2, GROUND_Y + 3, hw * 2 - 4, 1, m.shadow, pat);
  }

  function drawFighter(W: Surface, state: FightState, idx: PlayerIndex, camI: number, silhouette: boolean): void {
    const f = state.fighters[idx];
    const fx = fxs[idx];
    const spr = getFighterSprite(f, state);
    let ax = Math.round(f.x - camI);
    const ay = GROUND_Y - Math.round(f.y);
    if (state.hitstop > 0 && lastVictim === idx) ax += (state.hitstop & 1) === 1 ? 1 : -1;
    const flip = f.facing < 0;
    // afterimages (oldest first)
    const acc = ACCENT[f.char];
    for (let n = 0; n < AFTER_N; n++) {
      const k = (fx.aNext + n) % AFTER_N;
      const s = fx.aSprite[k];
      const age = fx.aAge[k]!;
      if (!s || age >= 15) continue;
      const col = mix(acc, INK, 0.25 + (age / 15) * 0.5);
      drawSpriteAt(W, s, Math.round(fx.aX[k]! - camI), GROUND_Y - Math.round(fx.aY[k]!), fx.aFace[k]! < 0, col, age < 6 ? "solid" : age < 11 ? "c50" : "c25");
    }
    // charge aura / finisher wind-up glow
    if (f.action === "attack" && f.phase === "charge") {
      const blink = (t >> 1) & 1;
      if (f.chargeLevel === 0) drawHaloAt(W, spr, ax, ay, flip, -1, acc, "c50");
      else if (f.chargeLevel === 1) drawHaloAt(W, spr, ax, ay, flip, mix(acc, INK, 0.4), acc, blink ? "solid" : "c75");
      else drawHaloAt(W, spr, ax, ay, flip, blink ? acc : C.white, blink ? C.white : acc);
    } else if (state.phase === "finisher" && idx === finWinner && state.phaseFrame >= 14 && state.phaseFrame < FINISHER.final + 10) {
      const st = FIN_STYLE[f.char];
      const blink = (t >> 1) & 1;
      drawHaloAt(W, spr, ax, ay, flip, st.fx[2], blink ? st.fx[0] : st.fx[1], state.phaseFrame < PANEL_FULL ? "c50" : "solid");
    }
    if (silhouette) {
      drawSpriteAt(W, spr, ax, ay, flip, impactT > 0 ? INK : C.silhouette);
      return;
    }
    if (fx.flash > 0 && fx.flicker) {
      if ((fx.flash & 1) === 0) drawSpriteAt(W, spr, ax, ay, flip, fx.flashCol);
      else {
        drawHaloAt(W, spr, ax, ay, flip, -1, fx.flashCol);
        drawSpriteAt(W, spr, ax, ay, flip);
      }
      return;
    }
    drawSpriteAt(W, spr, ax, ay, flip, fx.flash > 0 ? fx.flashCol : -1);
  }

  /** Draws the world; returns the camera used for the fighters / effects layer. */
  function drawWorld(W: Surface, state: FightState, camF: number): number {
    const m = mapOf(state);
    const camI = Math.round(camF);
    const fin = state.phase === "finisher" && finWinner >= 0;
    const pf = state.phaseFrame;
    const cover = fin ? panelCover(pf) : 0;
    const floorY = GROUND_Y + 4;
    const [a, b] = state.fighters;
    // while the backdrop hides the map the pair is centred even when it stands at a stage edge
    let fxCam = camI;
    if (cover > 0) fxCam = Math.round(camI + ((a.x + b.x) / 2 - VIEW_W / 2 - camI) * Math.min(1, cover));
    if (cover < 1) {
      m.back(W, camI, t);
      if (cover > 0 && finWinner >= 0) {
        const st = FIN_STYLE[state.fighters[finWinner as PlayerIndex].char];
        W.tint(st.bg, cover < 0.34 ? 1 : cover < 0.67 ? 2 : 3);
      }
    } else if (finWinner >= 0) {
      const w = state.fighters[finWinner as PlayerIndex];
      if (impactT > 0) W.clear(impactT > 2 ? C.white : FIN_STYLE[w.char].fx[1]);
      else drawBackdrop(W, FIN_STYLE[w.char], pf, w.facing, floorY);
    }
    if (cover < 1) {
      drawShadow(W, m, a, fxCam);
      drawShadow(W, m, b, fxCam);
    }
    const ox = -fxCam;
    shapes.draw(W, ox, 0, true);
    parts.draw(W, ox, 0, true, t);
    // attacker in front; during the finisher the winner is in front
    let front: PlayerIndex = 1;
    if (fin) front = finWinner === 0 ? 0 : 1;
    else if (isStriking(a) && !isStriking(b)) front = 0;
    else if (!isStriking(a) && isStriking(b)) front = 1;
    else if (lastVictim === 1) front = 0;
    const back: PlayerIndex = front === 0 ? 1 : 0;
    const impact = fin && cover >= 1 && impactT > 0;
    const loserSil = fin && cover >= 1 && pf >= FINISHER.final;
    drawFighter(W, state, back, fxCam, impact || (loserSil && back !== finWinner));
    drawFighter(W, state, front, fxCam, impact || (loserSil && front !== finWinner));
    shapes.draw(W, ox, 0, false);
    parts.draw(W, ox, 0, false, t);
    if (cover < 1) m.front(W, camI, t);
    return fxCam;
  }

  function zoom2x(src: Surface, dst: Surface, sx: number, sy: number): void {
    const d = dst.px32;
    const s = src.px32;
    const hw = VIEW_W >> 1;
    for (let y = 0; y < VIEW_H; y++) {
      const srow = (sy + (y >> 1)) * VIEW_W + sx;
      const drow = y * VIEW_W;
      for (let x = 0; x < hw; x++) {
        const p = s[srow + x]!;
        d[drow + x * 2] = p;
        d[drow + x * 2 + 1] = p;
      }
    }
  }

  function shiftRows(W: Surface, dy: number): void {
    if (dy === 0) return;
    const d = W.px32;
    const w = W.w;
    if (dy > 0) d.copyWithin(dy * w, 0, (W.h - dy) * w);
    else d.copyWithin(0, -dy * w, W.h * w);
  }

  function drawHud(O: Surface, state: FightState): void {
    const L = labels();
    const blink = ((t >> 3) & 1) === 1;
    const [a, b] = state.fighters;
    const fa = fxs[0];
    const fb = fxs[1];
    portrait(O, 3, 3, getPortrait(a.char), PORTRAIT_BG[a.char], false, fa.hurt > 0 && ((t >> 1) & 1) === 1);
    portrait(O, 359, 3, getPortrait(b.char), PORTRAIT_BG[b.char], true, fb.hurt > 0 && ((t >> 1) & 1) === 1);
    hpBar(O, 26, 5, 1, a.hp / a.maxHp, fa.ghost, blink);
    hpBar(O, 208, 5, -1, b.hp / b.maxHp, fb.ghost, blink);
    guardBar(O, 116, 15, 1, safeGuard(state, 0), blink);
    guardBar(O, 208, 15, -1, safeGuard(state, 1), blink);
    const na = textStamp(CHAR_NAMES[a.char], HUD.text);
    const nb = textStamp(CHAR_NAMES[b.char], HUD.text);
    drawStamp(O, na, 26, 14);
    drawStamp(O, nb, 358 - nb.w, 14);
    // tags
    const mode = state.config.mode;
    tag(O, L.p1, 3, 27, 1, ACCENT_DARK[a.char]);
    tag(O, mode === "versus" || mode === "online" ? L.p2 : L.cpu, 381, 27, -1, ACCENT_DARK[b.char]);
    // round pips
    const need = Math.max(1, state.config.roundsToWin);
    if (mode !== "tutorial") {
      for (let k = 0; k < need; k++) {
        pip(O, 169 - k * 9, 19, state.wins[0] > k);
        pip(O, 208 + k * 9, 19, state.wins[1] > k);
      }
    }
    // timer
    if (mode === "tutorial" || (state.config.rules !== undefined && state.config.rules.roundSeconds === null)) timerBox(O, "∞", false);
    else {
      const secs = Math.max(0, Math.ceil(state.timer / 60));
      const low = secs <= 10 && state.phase === "fight";
      timerBox(O, String(secs), low && blink);
    }
    // combo counters
    for (let i = 0; i < 2; i++) {
      const fx = fxs[i as PlayerIndex];
      if (fx.combo < 2 || fx.comboT <= 0) continue;
      const pat: Pattern = fx.comboT > 16 ? "solid" : fx.comboT > 8 ? "c50" : "c25";
      const num = bannerStamp(String(fx.combo), 1, HUD.gold);
      const hits = textStamp(L.hits, HUD.hitsText);
      const lift = fx.comboPop > 3 ? -2 : fx.comboPop > 0 ? -1 : 0;
      const y = 38 + lift;
      if (i === 0) {
        drawStamp(O, num, 6, y, -1, pat);
        drawStamp(O, hits, 6 + num.w + 1, y + num.bottom - hits.bottom, -1, pat);
      } else {
        drawStamp(O, hits, VIEW_W - 6 - hits.w, y + num.bottom - hits.bottom, -1, pat);
        drawStamp(O, num, VIEW_W - 6 - hits.w - 1 - num.w, y, -1, pat);
      }
    }
  }

  function safeGuard(state: FightState, i: PlayerIndex): number {
    const g = getGuard(state, i);
    return Number.isFinite(g) ? g : 1;
  }

  function drawBanners(O: Surface): void {
    for (const b of banners) {
      if (b.delay > 0) continue;
      const st = b.stamp;
      let x = b.x - st.w / 2;
      let y = b.y;
      let flat = -1;
      let pat: Pattern = "solid";
      const left = b.life - b.age;
      switch (b.style) {
        case "slide": {
          const inT = 9;
          if (b.age < inT) {
            const u = 1 - b.age / inT;
            x -= u * u * (VIEW_W / 2 + st.w / 2);
          } else if (left < 8) {
            const u = 1 - left / 8;
            x += u * u * (VIEW_W / 2 + st.w / 2);
          }
          if (b.age < 2) flat = C.white;
          break;
        }
        case "pop": {
          if (b.age < 6) y -= Math.round((6 - b.age) * 3);
          else if (b.age < 9) y += 9 - b.age === 2 ? 2 : 1;
          if (b.age < 3) flat = C.white;
          if (left < 10) pat = left > 6 ? "c75" : left > 3 ? "c50" : "c25";
          break;
        }
        case "rise": {
          if (b.age < 8) {
            y += 8 - b.age;
            pat = b.age < 3 ? "c25" : b.age < 6 ? "c50" : "solid";
          }
          if (left < 10) pat = left > 5 ? "c50" : "c25";
          break;
        }
      }
      drawStamp(O, st, x, y, flat, pat);
    }
  }

  function drawFlash(O: Surface): void {
    if (flashT <= 0 || impactT > 0) return;
    const u = flashT / flashLen;
    if (opts.reducedFlash) {
      O.tint(C.white, 1);
      return;
    }
    O.tint(C.white, u > 0.75 ? 3 : u > 0.4 ? 2 : 1);
  }

  function drawDebug(O: Surface, state: FightState, camI: number): void {
    for (let i = 0; i < 2; i++) {
      const idx = i as PlayerIndex;
      const f = state.fighters[idx];
      const bx = getDebugBoxes(state, idx);
      outline(O, bx.push.x - camI, bx.push.y, bx.push.w, bx.push.h, rgb("#3a7bd6"));
      outline(O, bx.hurt.x - camI, bx.hurt.y, bx.hurt.w, bx.hurt.h, f.invuln > 0 ? rgb("#ffffff") : rgb("#46a84a"));
      if (bx.hit) outline(O, bx.hit.x - camI, bx.hit.y, bx.hit.w, bx.hit.h, rgb("#ff3355"));
      O.rect(Math.round(f.x - camI), GROUND_Y - 3, 1, 7, rgb("#fff08a"));
      const lines = [
        `${f.action} ${f.actionFrame}`,
        f.phase ? `${f.move ?? ""} ${f.phase} ${f.phaseFrame}/${f.phaseLen} C${f.chargeLevel}` : `STUN ${f.stun} INV ${f.invuln}`,
        `HP ${Math.ceil(f.hp)} X ${Math.round(f.x)} Y ${Math.round(f.y)}`,
      ];
      lines.forEach((s, k) => {
        const st = textStamp(s, HUD.text);
        drawStamp(O, st, i === 0 ? 4 : VIEW_W - 4 - st.w, 48 + k * 9);
      });
    }
    const top = textStamp(`T${state.tick} ${state.phase} ${state.phaseFrame} HS${state.hitstop} SM${state.slowmo} P${parts.count}`, rgb("#fff08a"));
    drawStamp(O, top, VIEW_W / 2 - top.w / 2, 26);
  }

  function draw(ctx: CanvasRenderingContext2D, state: FightState): void {
    const O = ensureSurface(ctx);
    if (state.config !== lastFight) {
      // drawn before any update for this fight: start from a clean slate
      reset();
      lastFight = state.config;
      cam = camTarget(state);
    }
    const fin = state.phase === "finisher" && finWinner >= 0;
    const pf = state.phaseFrame;
    const zoom = fin && pf >= ZOOM_IN && pf < ZOOM_OUT;
    const camF = cam + shakeX;
    if (zoom) {
      if (!world) world = new Surface(VIEW_W, VIEW_H);
      const fxCam = drawWorld(world, state, cam);
      const [a, b] = state.fighters;
      // centre on the pair, then follow the winner once the loser is sent flying
      const w = state.fighters[finWinner as PlayerIndex];
      const focus = pf >= FINISHER.final ? w.x + w.facing * 22 : (a.x + b.x) / 2;
      const mid = Math.round(focus - fxCam);
      const sx = clamp(mid - VIEW_W / 4 + shakeX, 0, VIEW_W / 2);
      const sy = clamp(GROUND_Y - 34 - VIEW_H / 4 + 10 + shakeY, 0, VIEW_H / 2);
      zoom2x(world, O, Math.round(sx), Math.round(sy));
    } else {
      drawWorld(O, state, camF);
      shiftRows(O, shakeY);
    }
    const lb = fin ? letterbox(pf) : 0;
    if (lb > 0) {
      O.rect(0, 0, VIEW_W, lb, C.silhouette);
      O.rect(0, VIEW_H - lb, VIEW_W, lb, C.silhouette);
      if (pf >= PANEL_FULL + 4 && pf < PANEL_GONE + 4 && finWinner >= 0) {
        const st = FIN_STYLE[state.fighters[finWinner as PlayerIndex].char];
        const name = bannerStamp(st.name, 1, st.banner);
        const age = pf - PANEL_FULL - 4;
        const pat: Pattern = age < 3 ? "c25" : age < 6 ? "c50" : PANEL_GONE + 4 - pf < 6 ? "c50" : "solid";
        drawStamp(O, name, Math.round(VIEW_W / 2 - name.w / 2), Math.round(VIEW_H - LETTERBOX / 2 - (name.top + name.bottom) / 2), -1, pat);
      }
    } else drawHud(O, state);
    drawFlash(O);
    drawBanners(O);
    if (opts.debug) drawDebug(O, state, Math.round(camF));
    if (img) ctx.putImageData(img, 0, 0);
  }

  return {
    update,
    draw,
    setOptions(o: Partial<RendererOptions>): void {
      if (o.labels) opts.labels = { ...o.labels };
      if (o.reducedFlash !== undefined) opts.reducedFlash = o.reducedFlash;
      if (o.debug !== undefined) opts.debug = o.debug;
    },
    reset,
  };
}

const ACCENT_DARK: Record<CharId, number> = {
  asagiri: mix(ACCENT.asagiri, INK, 0.35),
  yoikaze: mix(ACCENT.yoikaze, INK, 0.45),
  grimvald: mix(ACCENT.grimvald, INK, 0.5),
  maelis: mix(ACCENT.maelis, INK, 0.45),
  bazalt: mix(ACCENT.bazalt, INK, 0.35),
  oriel: mix(ACCENT.oriel, INK, 0.45),
};

function isStriking(f: FighterState): boolean {
  return f.action === "attack" || f.action === "airAttack" || f.action === "finisher";
}

function outline(S: Surface, x: number, y: number, w: number, h: number, c: number): void {
  const X = Math.round(x);
  const Y = Math.round(y);
  const Wd = Math.max(1, Math.round(w));
  const H = Math.max(1, Math.round(h));
  S.rect(X, Y, Wd, 1, c);
  S.rect(X, Y + H - 1, Wd, 1, c);
  S.rect(X, Y, 1, H, c);
  S.rect(X + Wd - 1, Y, 1, H, c);
}

function clamp(v: number, a: number, b: number): number {
  return v < a ? a : v > b ? b : v;
}
