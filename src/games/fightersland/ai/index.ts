/**
 * Fightersland CPU opponent: a virtual controller that only produces button states.
 *
 * It perceives the opponent's actions through a reaction delay (a ring of past snapshots),
 * keeps a preferred spacing, blocks or dodges what it recognises in time, punishes whiffs,
 * charges against turtles, confirms combos and takes human-like pauses. Positions are read
 * live (people track distance well) but the opponent's intent is always seen late.
 */
import type { AiController, AiLevel, CharId, FightState, FighterState, InputFrame, PlayerIndex, Strength } from "../core/types";
import { STAGE_MARGIN, STAGE_W } from "../core/constants";
import { CHARGE, CHARS, VARIANTS, moveReach } from "../sim/data";

interface Params {
  /** Reaction delay range in ticks. */
  reactMin: number;
  reactMax: number;
  block: number;
  dodge: number;
  parry: number;
  punish: number;
  antiAir: number;
  interruptCharge: number;
  /** Probability to continue a chain after each confirmed hit. */
  comboHit: number;
  /** Probability to continue a chain after it was blocked. */
  comboBlock: number;
  /** Highest strength used as the chain ender (1 = medium, 2 = heavy). */
  comboDepth: 1 | 2;
  aggression: number;
  poke: number;
  chargeUse: number;
  jumpIn: number;
  pause: number;
  /** Chance a poke is thrown at a bad range. */
  sloppy: number;
  thinkMin: number;
  thinkMax: number;
  wakeBlock: number;
  /** Chance per decision to hold a guard stance while the opponent is in range. */
  guardStance: number;
}

const PARAMS: Record<AiLevel, Params> = {
  easy: {
    reactMin: 22, reactMax: 32, block: 0.2, dodge: 0.05, parry: 0, punish: 0.15, antiAir: 0.08,
    interruptCharge: 0.1, comboHit: 0.45, comboBlock: 0.7, comboDepth: 1, aggression: 0.35, poke: 0.18,
    chargeUse: 0.12, jumpIn: 0.05, pause: 0.35, sloppy: 0.4, thinkMin: 9, thinkMax: 16, wakeBlock: 0.1, guardStance: 0.08,
  },
  normal: {
    reactMin: 15, reactMax: 22, block: 0.5, dodge: 0.12, parry: 0.03, punish: 0.5, antiAir: 0.3,
    interruptCharge: 0.35, comboHit: 0.75, comboBlock: 0.45, comboDepth: 2, aggression: 0.5, poke: 0.3,
    chargeUse: 0.25, jumpIn: 0.08, pause: 0.18, sloppy: 0.15, thinkMin: 5, thinkMax: 10, wakeBlock: 0.4, guardStance: 0.22,
  },
  hard: {
    reactMin: 10, reactMax: 15, block: 0.74, dodge: 0.22, parry: 0.08, punish: 0.85, antiAir: 0.55,
    interruptCharge: 0.6, comboHit: 0.95, comboBlock: 0.25, comboDepth: 2, aggression: 0.6, poke: 0.4,
    chargeUse: 0.45, jumpIn: 0.08, pause: 0.07, sloppy: 0.03, thinkMin: 3, thinkMax: 7, wakeBlock: 0.7, guardStance: 0.32,
  },
};

interface Snap {
  tick: number;
  action: FighterState["action"];
  phase: FighterState["phase"];
  move: FighterState["move"];
  chargeLevel: 0 | 1 | 2;
  phaseFrame: number;
  x: number;
  y: number;
  vy: number;
}

interface Style {
  aggression: number;
  poke: number;
  chargeMul: number;
  jumpIn: number;
  rangeBias: number;
}

/** Per-fighter play style so every character is played to its strengths. */
const STYLE: Record<CharId, Style> = {
  asagiri: { aggression: 0, poke: 0, chargeMul: 1, jumpIn: 0, rangeBias: 0 },
  yoikaze: { aggression: 0.2, poke: 0.12, chargeMul: 0.6, jumpIn: 0.05, rangeBias: -6 },
  grimvald: { aggression: -0.05, poke: 0, chargeMul: 1.2, jumpIn: -0.03, rangeBias: 0 },
  maelis: { aggression: -0.15, poke: 0.05, chargeMul: 1, jumpIn: -0.03, rangeBias: 10 },
  bazalt: { aggression: 0.15, poke: 0.05, chargeMul: 1, jumpIn: 0, rangeBias: -4 },
  oriel: { aggression: 0.05, poke: 0.05, chargeMul: 2.5, jumpIn: 0, rangeBias: -2 },
};

const RING = 48;
const PUNISH_ORDER: readonly Strength[] = ["heavy", "medium", "light"];

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Plan = "none" | "approach" | "retreat" | "pause" | "block" | "charge";

export function createAi(level: AiLevel, seed: number): AiController {
  const P = PARAMS[level];
  const rnd = mulberry32(seed ^ 0x9e3779b9);
  const ring: Snap[] = [];
  for (let i = 0; i < RING; i++) {
    ring.push({ tick: -1, action: "idle", phase: null, move: null, chargeLevel: 0, phaseFrame: 0, x: 0, y: 0, vy: 0 });
  }
  const out: InputFrame = { left: false, right: false, up: false, light: false, medium: false, heavy: false, block: false, dodge: false };

  let lastTick = -1;
  let delay = P.reactMin;
  // tap / hold of attack buttons
  let pressBtn: Strength | null = null;
  let pressUntil = 0;
  let releasedAt: Record<Strength, number> = { light: -10, medium: -10, heavy: -10 };
  let chargeTarget: 0 | 1 | 2 = 0;
  // scheduled chain press
  let chainBtn: Strength | null = null;
  let chainAt = 0;
  // plans
  let plan: Plan = "none";
  let planUntil = 0;
  let nextThink = 0;
  // defence decision per perceived opponent attack instance
  let seenAttackTick = -1;
  let defence: "block" | "dodge" | "parry" | "interrupt" | "none" = "none";
  let blockUntil = 0;
  let dodgeAt = -1;
  let jumpAt = -1;
  let wakeDecided = false;
  let oppBlockFrames = 0;
  let oppFrames = 0;

  function rr(a: number, b: number): number {
    return a + Math.floor(rnd() * (b - a + 1));
  }

  function record(state: FightState, o: FighterState): void {
    const s = ring[state.tick % RING];
    if (!s) return;
    s.tick = state.tick;
    s.action = o.action;
    s.phase = o.phase;
    s.move = o.move;
    s.chargeLevel = o.chargeLevel;
    s.phaseFrame = o.phaseFrame;
    s.x = o.x;
    s.y = o.y;
    s.vy = o.vy;
  }

  function perceived(state: FightState): Snap | null {
    const t = state.tick - delay;
    const s = ring[((t % RING) + RING) % RING];
    if (!s || s.tick !== t) {
      // not enough history yet: fall back to the oldest valid snapshot
      let best: Snap | null = null;
      for (const r of ring) if (r.tick >= 0 && r.tick <= t && (!best || r.tick > best.tick)) best = r;
      return best;
    }
    return s;
  }

  function tap(btn: Strength, state: FightState, hold = 2): boolean {
    if (pressBtn !== null) return false;
    if (state.tick - releasedAt[btn] < 1) return false;
    pressBtn = btn;
    pressUntil = state.tick + hold;
    chargeTarget = 0;
    return true;
  }

  function startCharge(btn: Strength, level: 1 | 2, state: FightState): void {
    if (pressBtn !== null) return;
    pressBtn = btn;
    pressUntil = state.tick + 400;
    chargeTarget = level;
  }

  function reach(f: FighterState, s: Strength, lvl: 0 | 1 | 2, target: FighterState): number {
    return moveReach(f.char, s, lvl) + CHARS[target.char].hurtHalfW;
  }

  function minReach(f: FighterState, s: Strength, target: FighterState): number {
    return VARIANTS[f.char][s][0].hit.x - CHARS[target.char].hurtHalfW;
  }

  function inRange(me: FighterState, o: FighterState, s: Strength, d: number, slack = 0): boolean {
    return d <= reach(me, s, 0, o) - 2 + slack && d >= minReach(me, s, o);
  }

  function holdPressed(): void {
    if (pressBtn !== null) out[pressBtn] = true;
  }

  function setMove(dirRel: number, me: FighterState): void {
    const abs = dirRel * me.facing;
    out.left = abs < 0;
    out.right = abs > 0;
  }

  function clearOut(): void {
    out.left = out.right = out.up = out.light = out.medium = out.heavy = out.block = out.dodge = false;
  }

  function bestPunish(me: FighterState, o: FighterState, d: number, window: number): Strength | null {
    for (const s of PUNISH_ORDER) {
      const v = VARIANTS[me.char][s][0];
      if (v.s + 1 <= window && inRange(me, o, s, d)) return s;
    }
    return null;
  }

  function oppReachThreat(o: FighterState, me: FighterState, sn: Snap): number {
    if (sn.move === null) return 0;
    if (sn.move === "air") {
      const air = CHARS[o.char].air;
      return air.hit.x + air.hit.w + CHARS[me.char].hurtHalfW + 30;
    }
    return reach(o, sn.move, sn.chargeLevel, me) + 14;
  }

  return {
    next(state: FightState, me: PlayerIndex): InputFrame {
      const f = state.fighters[me];
      const o = state.fighters[me === 0 ? 1 : 0];
      if (state.tick !== lastTick + 1) {
        // a new fight (or a skipped frame): forget the past
        for (const r of ring) r.tick = -1;
        pressBtn = null;
        chainBtn = null;
        plan = "none";
        seenAttackTick = -1;
        releasedAt = { light: -10, medium: -10, heavy: -10 };
      }
      lastTick = state.tick;
      record(state, o);
      clearOut();
      if (state.phase !== "fight") {
        pressBtn = null;
        chainBtn = null;
        plan = "none";
        return out;
      }
      const t = state.tick;
      oppFrames++;
      if (o.action === "block" || o.action === "blockstun") oppBlockFrames++;
      if (oppFrames > 240) {
        oppFrames = Math.floor(oppFrames * 0.5);
        oppBlockFrames = Math.floor(oppBlockFrames * 0.5);
      }

      // events: confirm chains on hit / block
      for (const e of state.events) {
        if (e.type === "hit" && e.attacker === me && f.action === "attack" && f.move !== null && f.move !== "air") {
          const nx = nextInChain(f.move, P.comboDepth);
          if (nx && rnd() < P.comboHit) {
            chainBtn = nx;
            chainAt = t + state.hitstop + rr(1, 4);
          }
        } else if (e.type === "block" && e.defender !== me && f.action === "attack" && f.move !== null && f.move !== "air") {
          const nx = nextInChain(f.move, level === "easy" ? 2 : 1);
          if (nx && rnd() < P.comboBlock) {
            chainBtn = nx;
            chainAt = t + state.hitstop + rr(1, 5);
          }
        }
      }

      const dx = o.x - f.x;
      const d = Math.abs(dx);
      const sn = perceived(state);

      // ---- held attack button (tap or charge)
      if (pressBtn !== null) {
        let keep = t < pressUntil;
        if (chargeTarget > 0) {
          keep = f.action === "attack" && (f.phase === "startup" || (f.phase === "charge" && f.chargeLevel < chargeTarget));
          if (f.action === "attack" && f.phase === "charge" && f.chargeLevel >= 1 && chargeTarget === 2 && d < 26 && o.action === "attack") keep = false;
        }
        if (keep) {
          out[pressBtn] = true;
          return out;
        }
        releasedAt[pressBtn] = t;
        pressBtn = null;
        chargeTarget = 0;
      }

      // ---- scheduled chain continuation
      if (chainBtn !== null) {
        if (t >= chainAt) {
          const b = chainBtn;
          chainBtn = null;
          if (f.action === "attack") {
            tap(b, state);
            holdPressed();
            return out;
          }
        } else {
          return out;
        }
      }

      // ---- not in control: plan the wake-up, keep blocking if asked
      if (f.action === "down" || f.action === "getup") {
        if (!wakeDecided) {
          wakeDecided = true;
          if (rnd() < P.wakeBlock) blockUntil = t + 60;
        }
        if (t < blockUntil) out.block = true;
        return out;
      }
      wakeDecided = false;
      if (f.action === "blockstun") {
        out.block = true;
        return out;
      }
      const actionable =
        f.y <= 0 && (f.action === "idle" || f.action === "walkF" || f.action === "walkB" || f.action === "block" || f.action === "land");
      if (f.action === "jump") {
        // one air attack when it can connect on the way down
        if (f.vy < 0 && f.y < 46 && f.y > 8 && d < 50 && rnd() < 0.5) tap("heavy", state);
        holdPressed();
        return out;
      }
      if (!actionable) return out;

      // ---- defence against what we perceive
      if (sn && sn.action === "attack" && (sn.phase === "startup" || sn.phase === "charge" || sn.phase === "active")) {
        const startTick = sn.tick - (sn.phase === "startup" ? sn.phaseFrame : 0);
        const fresh = Math.abs(startTick - seenAttackTick) > 3 && sn.phase !== "charge" ? true : seenAttackTick < 0;
        const threat = d <= oppReachThreat(o, f, sn);
        if (sn.phase === "charge" && threat) {
          // telegraphed: interrupt it, step out, dodge the full charge or block the partial one
          if (defence === "none" || fresh) {
            seenAttackTick = startTick;
            const r = rnd();
            if (r < P.interruptCharge && inRange(f, o, "light", d)) defence = "interrupt";
            else if (sn.chargeLevel >= 1 && r < P.interruptCharge + P.dodge * 2) defence = "dodge";
            else if (r < P.block + P.dodge) defence = "block";
            else defence = "none";
          }
          if (defence === "interrupt" && o.action === "attack" && o.phase === "charge") {
            const s: Strength = inRange(f, o, "medium", d) ? "medium" : "light";
            tap(s, state);
            holdPressed();
            return out;
          }
          if (defence === "dodge" && f.dodgeCooldown <= 0 && o.chargeLevel >= 1) {
            out.dodge = true;
            return out;
          }
          if (defence === "block" && o.chargeLevel < 2) {
            out.block = true;
            blockUntil = t + 20;
            return out;
          }
          if (o.chargeLevel >= 2 || defence === "dodge") {
            setMove(-1, f);
            return out;
          }
        } else if (threat && fresh) {
          seenAttackTick = startTick;
          const r = rnd();
          if (r < P.parry) defence = "parry";
          else if (r < P.parry + P.block) defence = "block";
          else if (r < P.parry + P.block + P.dodge) defence = "dodge";
          else defence = "none";
        }
        if (threat) {
          if (defence === "block" || defence === "parry") {
            out.block = true;
            blockUntil = t + rr(8, 16);
            return out;
          }
          if (defence === "dodge" && f.dodgeCooldown <= 0) {
            out.dodge = true;
            defence = "none";
            return out;
          }
        }
      } else if (sn && (sn.action === "jump" || sn.action === "airAttack") && d < 110) {
        // anti-air or block a jump-in
        const coming = (o.x - f.x) * o.vx < 0 || d < 50;
        if (coming) {
          if (rnd() < P.antiAir * 0.2 && o.vy < 0 && o.y < 44 && inRange(f, o, "medium", d, 10)) {
            tap("medium", state);
            holdPressed();
            return out;
          }
          if (o.y < 50 && o.vy < 0 && rnd() < P.block * 0.5) {
            out.block = true;
            blockUntil = t + 14;
            return out;
          }
        }
      } else if (seenAttackTick >= 0 && sn && sn.action !== "attack") {
        defence = "none";
        seenAttackTick = -1;
      }
      if (t < blockUntil) {
        out.block = true;
        return out;
      }

      // ---- punish: perceived recovery or a helpless opponent
      if (o.action === "stagger" && sn && sn.action === "stagger") {
        const s = bestPunish(f, o, d, o.stun + 2);
        if (s && rnd() < Math.max(P.punish, 0.4)) {
          tap(s === "heavy" && inRange(f, o, "light", d) ? "light" : s, state);
          holdPressed();
          return out;
        }
      }
      if (sn && sn.action === "attack" && sn.phase === "recovery" && o.action === "attack" && o.phase === "recovery") {
        const v = o.move !== null && o.move !== "air" ? VARIANTS[o.char][o.move][o.chargeLevel] : null;
        const left = v ? v.r - o.phaseFrame : 0;
        const s = bestPunish(f, o, d, left);
        if (s && rnd() < P.punish * 0.35) {
          tap(s, state);
          holdPressed();
          return out;
        }
      }
      if (o.action === "dodge" && sn && sn.action === "dodge" && o.actionFrame > 10 && o.invuln <= 0) {
        const s = bestPunish(f, o, d, 24 - o.actionFrame);
        if (s && rnd() < P.punish * 0.3) {
          tap(s, state);
          holdPressed();
          return out;
        }
      }

      // ---- neutral thinking at a human cadence
      if (t < nextThink) {
        continuePlan(f, o, d, t);
        return out;
      }
      nextThink = t + rr(P.thinkMin, P.thinkMax);
      delay = rr(P.reactMin, P.reactMax);

      const st = STYLE[f.char];
      const sw = level === "easy" ? 0.4 : level === "normal" ? 0.8 : 1;
      const pref = preferredRange(f, o) + st.rangeBias;
      // guard stance: hold block for a moment when the opponent could reach us
      if (o.action !== "down" && o.action !== "getup" && d < oppMaxReach(o, f) + 12 && rnd() < P.guardStance) {
        blockUntil = t + rr(10, 28);
        out.block = true;
        return out;
      }
      const cornered = (f.facing === 1 && f.x < STAGE_MARGIN + 30) || (f.facing === -1 && f.x > STAGE_W - STAGE_MARGIN - 30);

      if (rnd() < P.pause * 0.4) {
        plan = "pause";
        planUntil = t + rr(10, 40);
        continuePlan(f, o, d, t);
        return out;
      }
      // charge against a turtle (or just to mix it up) from a range the lunge covers
      const turtle = oppFrames > 60 && oppBlockFrames / oppFrames > 0.3;
      if (rnd() < P.chargeUse * st.chargeMul * (turtle ? 0.9 : 0.15)) {
        const lvl: 1 | 2 = turtle && rnd() < 0.7 ? 2 : 1;
        const s: Strength = rnd() < 0.7 ? "heavy" : "medium";
        if (d <= reach(f, s, lvl, o) - 4 && d >= minReach(f, s, o) && d > 30) {
          startCharge(s, lvl, state);
          holdPressed();
          return out;
        }
      }
      // pokes and chain starters
      if (rnd() < P.poke + st.poke * sw) {
        const s: Strength | null = inRange(f, o, "light", d)
          ? rnd() < 0.6
            ? "light"
            : "medium"
          : inRange(f, o, "medium", d)
            ? "medium"
            : inRange(f, o, "heavy", d) && rnd() < 0.25
              ? "heavy"
              : rnd() < P.sloppy
                ? "medium"
                : null;
        if (s) {
          tap(s, state);
          holdPressed();
          return out;
        }
      }
      if (rnd() < P.jumpIn + st.jumpIn && d > 60 && d < 120) {
        jumpAt = t;
        out.up = true;
        setMove(1, f);
        return out;
      }
      if (cornered && d < 40 && f.dodgeCooldown <= 0 && rnd() < 0.15) {
        jumpAt = t;
        out.up = true;
        setMove(1, f);
        return out;
      }
      if (d > pref + 8) {
        plan = rnd() < P.aggression + st.aggression * sw + 0.3 ? "approach" : "pause";
        planUntil = t + rr(8, 24);
      } else if (d < pref - 18 && !cornered) {
        plan = rnd() < 0.6 ? "retreat" : "pause";
        planUntil = t + rr(6, 16);
      } else {
        const r = rnd();
        plan = r < (P.aggression + st.aggression * sw) * 0.5 ? "approach" : r < 0.75 ? "pause" : "retreat";
        planUntil = t + rr(6, 20);
      }
      continuePlan(f, o, d, t);
      return out;

      function continuePlan(me2: FighterState, o2: FighterState, d2: number, t2: number): void {
        if (t2 >= planUntil) plan = "none";
        if (jumpAt === t2 - 1) jumpAt = -1;
        switch (plan) {
          case "approach":
            if (d2 > CHARS[me2.char].pushHalfW + CHARS[o2.char].pushHalfW + 2) setMove(1, me2);
            break;
          case "retreat":
            setMove(-1, me2);
            break;
          case "block":
            out.block = true;
            break;
          case "pause":
          case "charge":
          case "none":
            break;
        }
        if (dodgeAt === t2) out.dodge = true;
      }
    },
  };
}

function nextInChain(cur: Strength, depth: 1 | 2): Strength | null {
  if (cur === "light") return depth >= 1 ? "medium" : null;
  if (cur === "medium") return depth >= 2 ? "heavy" : null;
  return null;
}

function oppMaxReach(o: FighterState, me: FighterState): number {
  let best = 0;
  for (const s of PUNISH_ORDER) best = Math.max(best, moveReach(o.char, s, 0));
  return best + CHARS[me.char].hurtHalfW;
}

function preferredRange(f: FighterState, o: FighterState): number {
  const m = VARIANTS[f.char].medium[0];
  const reachM = m.hit.x + m.hit.w + m.lunge + CHARS[o.char].hurtHalfW;
  return Math.max(CHARS[f.char].pushHalfW + CHARS[o.char].pushHalfW + 6, reachM - 6);
}

/** Exposed for tooling: frames a full charge of `s` takes for this fighter. */
export function fullChargeFrames(f: FighterState, s: Strength): number {
  return VARIANTS[f.char][s][0].cf + CHARGE[f.char][s].t2;
}
