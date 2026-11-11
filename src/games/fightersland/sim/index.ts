/**
 * Fightersland simulation: deterministic, DOM-free, one call to `stepFight` = one 60 Hz tick.
 *
 * Coordinates: fighter x is stage px (0..STAGE_W), y is height above the floor.
 * Hit / hurt boxes are resolved in that space; events and debug boxes convert y to
 * screen space (down from the top of the view) with GROUND_Y.
 */
import type {
  Action,
  CharId,
  CharRatings,
  FightConfig,
  FightRules,
  FightEvent,
  FightPhase,
  FightState,
  FighterState,
  InputFrame,
  PlayerIndex,
  Rect,
  Strength,
} from "../core/types";
import { FINISHER, GROUND_Y, ROUND_SECONDS, STAGE_MARGIN, STAGE_W, TICK_RATE } from "../core/constants";
import { CHARGE, CHARS, CHAR_RATINGS_DATA, G, VARIANTS } from "./data";
import type { AirMoveDef, BoxDef, MoveVariant } from "./data";

export { CHARS, G, VARIANTS, CHARGE, moveReach } from "./data";
export type { CharDef, MoveVariant, GroundMoveDef, AirMoveDef } from "./data";

export const CHAR_RATINGS: Record<CharId, CharRatings> = { ...CHAR_RATINGS_DATA };

/** Phase lengths in ticks. */
export const PHASE_LEN = {
  intro: 90,
  ko: 140,
  timeUp: 90,
  roundEnd: 110,
} as const;
export const KO_SLOWMO = 72;
/** Rounds after which the match is decided by the round count even if draws kept it going. */
export const MAX_ROUNDS = 5;
const START_GAP = 64;
const TUTORIAL_REGEN_DELAY = 70;
const TUTORIAL_REGEN = 4;

// ---------------------------------------------------------------------------------------------
// Private per-fighter data

interface Priv {
  // held buttons this tick
  hL: boolean;
  hM: boolean;
  hH: boolean;
  hBlock: boolean;
  hUp: boolean;
  hLeft: boolean;
  hRight: boolean;
  // previous tick (edge detection)
  pL: boolean;
  pM: boolean;
  pH: boolean;
  pDodge: boolean;
  pBlock: boolean;
  // buffered presses (frames remaining)
  bL: number;
  bM: number;
  bH: number;
  bDodge: number;
  // current attack
  variant: MoveVariant | null;
  air: AirMoveDef | null;
  released: boolean;
  hasHit: boolean;
  /** Frames since this attack made contact (hit or block); -1 = none. */
  contact: number;
  chainLen: number;
  chainLights: number;
  airUsed: boolean;
  landLen: number;
  // defence
  guard: number;
  guardIdle: number;
  parryWin: number;
  parryLock: number;
  /** Hits taken in the running combo (damage scaling index). */
  taken: number;
  comboBy: -1 | 0 | 1;
  push: number;
  pushFrom: -1 | 0 | 1;
  lastHurtTick: number;
  koLanded: boolean;
  prevX: number;
}

interface Internal {
  p: [Priv, Priv];
  /** Winner whose match-winning blow is in hit-freeze; the finisher starts after it. */
  pendingFinisher: -1 | 0 | 1;
  finisherTarget: number;
  finisherSpeed: number;
  timeUpLoser: -1 | 0 | 1;
  timeUp: boolean;
  announced: boolean;
}

const INTERNAL = new WeakMap<FightState, Internal>();

function newPriv(char: CharId): Priv {
  return {
    hL: false, hM: false, hH: false, hBlock: false, hUp: false, hLeft: false, hRight: false,
    pL: false, pM: false, pH: false, pDodge: false, pBlock: false,
    bL: 0, bM: 0, bH: 0, bDodge: 0,
    variant: null, air: null, released: false, hasHit: false, contact: -1,
    chainLen: 0, chainLights: 0, airUsed: false, landLen: G.LAND,
    guard: CHARS[char].guard, guardIdle: 0, parryWin: 0, parryLock: 0,
    taken: 0, comboBy: -1, push: 0, pushFrom: -1, lastHurtTick: -9999, koLanded: false, prevX: 0,
  };
}

function internalOf(state: FightState): Internal {
  let it = INTERNAL.get(state);
  if (!it) {
    it = {
      p: [newPriv(state.fighters[0].char), newPriv(state.fighters[1].char)],
      pendingFinisher: -1,
      finisherTarget: 0,
      finisherSpeed: 2,
      timeUpLoser: -1,
      timeUp: false,
      announced: false,
    };
    INTERNAL.set(state, it);
  }
  return it;
}

// ---------------------------------------------------------------------------------------------
// Creation

const STANDARD_RULES: FightRules = { hpMul: [1, 1], dmgMul: [1, 1], roundSeconds: ROUND_SECONDS, finisher: true };

function mulOf(v: number): number {
  return Number.isFinite(v) ? Math.min(10, Math.max(0.1, v)) : 1;
}

/** Sanitised copy of the optional rules (undefined stays undefined: standard rules). */
function normalRules(r: FightRules | undefined): FightRules | undefined {
  if (!r) return undefined;
  const secs = r.roundSeconds;
  return {
    hpMul: [mulOf(r.hpMul[0]), mulOf(r.hpMul[1])],
    dmgMul: [mulOf(r.dmgMul[0]), mulOf(r.dmgMul[1])],
    roundSeconds: secs === null || !Number.isFinite(secs) ? null : Math.min(600, Math.max(5, Math.floor(secs))),
    finisher: r.finisher !== false,
  };
}

function rulesOf(state: FightState): FightRules {
  return state.config.rules ?? STANDARD_RULES;
}

function roundTimer(rules: FightRules): number {
  return (rules.roundSeconds ?? ROUND_SECONDS) * TICK_RATE;
}

function newFighter(char: CharId, index: PlayerIndex, hpMul: number): FighterState {
  const c = CHARS[char];
  const hp = Math.max(1, Math.round(c.hp * hpMul));
  return {
    char,
    index,
    x: index === 0 ? STAGE_W / 2 - START_GAP : STAGE_W / 2 + START_GAP,
    y: 0,
    vx: 0,
    vy: 0,
    facing: index === 0 ? 1 : -1,
    hp,
    maxHp: hp,
    action: "intro",
    actionFrame: 0,
    move: null,
    phase: null,
    phaseFrame: 0,
    phaseLen: 0,
    chargeLevel: 0,
    chargeFrames: 0,
    hurtKind: "light",
    stun: 0,
    invuln: 0,
    dodgeCooldown: 0,
    combo: 0,
  };
}

export function createFight(config: FightConfig): FightState {
  const cfg: FightConfig = {
    chars: [config.chars[0], config.chars[1]],
    map: config.map,
    mode: config.mode,
    aiLevel: config.aiLevel,
    seed: config.seed,
    roundsToWin: Math.max(1, Math.floor(config.roundsToWin)),
  };
  const rules = normalRules(config.rules);
  if (rules) cfg.rules = rules;
  const active = rules ?? STANDARD_RULES;
  const state: FightState = {
    config: cfg,
    tick: 0,
    phase: "intro",
    phaseFrame: 0,
    round: 1,
    wins: [0, 0],
    timer: roundTimer(active),
    fighters: [newFighter(cfg.chars[0], 0, active.hpMul[0]), newFighter(cfg.chars[1], 1, active.hpMul[1])],
    hitstop: 0,
    slowmo: 0,
    roundWinner: null,
    matchWinner: null,
    events: [],
  };
  internalOf(state);
  return state;
}

function resetRound(state: FightState, it: Internal): void {
  for (let i = 0; i < 2; i++) {
    const f = state.fighters[i as PlayerIndex];
    const fresh = newFighter(f.char, f.index, rulesOf(state).hpMul[f.index]);
    Object.assign(f, fresh);
    it.p[i as PlayerIndex] = newPriv(f.char);
  }
  state.timer = roundTimer(rulesOf(state));
  state.hitstop = 0;
  state.slowmo = 0;
  state.roundWinner = null;
  it.pendingFinisher = -1;
  it.timeUpLoser = -1;
  it.timeUp = false;
}

// ---------------------------------------------------------------------------------------------
// Helpers

let EVENTS: FightEvent[] = [];
let EVENTS_FRESH = false;
const NO_EVENTS: FightEvent[] = [];

function emit(state: FightState, e: FightEvent): void {
  if (!EVENTS_FRESH) {
    EVENTS = [];
    EVENTS_FRESH = true;
    state.events = EVENTS;
  }
  EVENTS.push(e);
}

function setPhase(state: FightState, it: Internal, phase: FightPhase): void {
  state.phase = phase;
  state.phaseFrame = 0;
  if (phase === "intro") it.announced = false;
}

function setAction(f: FighterState, a: Action): void {
  f.action = a;
  f.actionFrame = 0;
  if (a !== "attack" && a !== "airAttack") {
    f.move = null;
    f.phase = null;
    f.phaseFrame = 0;
    f.phaseLen = 0;
    f.chargeLevel = 0;
    f.chargeFrames = 0;
  }
}

function clampX(x: number): number {
  return x < STAGE_MARGIN ? STAGE_MARGIN : x > STAGE_W - STAGE_MARGIN ? STAGE_W - STAGE_MARGIN : x;
}

function sideOf(from: FighterState, to: FighterState): 1 | -1 {
  const dx = to.x - from.x;
  if (dx > 0.01) return 1;
  if (dx < -0.01) return -1;
  return from.facing;
}

const GROUND_NEUTRAL: ReadonlySet<Action> = new Set<Action>(["idle", "walkF", "walkB", "block"]);

/** True when the fighter can start a new action right now (grounded and free). */
export function isActionable(f: FighterState): boolean {
  return GROUND_NEUTRAL.has(f.action) && f.y <= 0;
}

function bufferedStrength(p: Priv, allowLight: boolean, allowMedium: boolean, allowHeavy: boolean): Strength | null {
  if (allowHeavy && p.bH > 0) return "heavy";
  if (allowMedium && p.bM > 0) return "medium";
  if (allowLight && p.bL > 0) return "light";
  return null;
}

function consume(p: Priv, s: Strength): void {
  if (s === "heavy") p.bH = 0;
  else if (s === "medium") p.bM = 0;
  else p.bL = 0;
}

function held(p: Priv, s: Strength): boolean {
  return s === "heavy" ? p.hH : s === "medium" ? p.hM : p.hL;
}

// ---------------------------------------------------------------------------------------------
// Fighter state machine

function startAttack(f: FighterState, p: Priv, s: Strength, cancel: boolean): void {
  setAction(f, "attack");
  const v = VARIANTS[f.char][s][0];
  f.move = s;
  f.phase = "startup";
  f.phaseFrame = 0;
  f.phaseLen = v.s;
  f.chargeLevel = 0;
  f.chargeFrames = 0;
  f.vx = 0;
  p.variant = v;
  p.air = null;
  p.released = false;
  p.hasHit = false;
  p.contact = -1;
  if (cancel) {
    p.chainLen++;
    if (s === "light") p.chainLights++;
  } else {
    p.chainLen = 1;
    p.chainLights = s === "light" ? 1 : 0;
  }
  consume(p, s);
}

function startDodge(state: FightState, f: FighterState, p: Priv): void {
  setAction(f, "dodge");
  f.invuln = G.DODGE_INVULN;
  f.dodgeCooldown = G.DODGE_TOTAL + G.DODGE_COOLDOWN;
  f.vx = 0;
  p.bDodge = 0;
  emit(state, { type: "dodge", player: f.index, x: f.x });
}

function startJump(state: FightState, f: FighterState, p: Priv, o: FighterState): void {
  const c = CHARS[f.char];
  f.facing = sideOf(f, o);
  setAction(f, "jump");
  const dir = (p.hRight ? 1 : 0) - (p.hLeft ? 1 : 0);
  f.vx = dir === 0 ? 0 : dir === f.facing ? c.jumpVxF * dir : c.jumpVxB * dir;
  f.vy = c.jumpVy;
  f.y = 0.01;
  p.airUsed = false;
  emit(state, { type: "jump", player: f.index, x: f.x });
}

/** Grounded neutral: pick the next action from buffered presses and held directions. */
function neutral(state: FightState, f: FighterState, p: Priv, o: FighterState): void {
  const s = bufferedStrength(p, true, true, true);
  if (s) {
    startAttack(f, p, s, false);
    return;
  }
  if (p.bDodge > 0 && f.dodgeCooldown <= 0) {
    startDodge(state, f, p);
    return;
  }
  if (p.hUp) {
    startJump(state, f, p, o);
    return;
  }
  if (p.hBlock) {
    if (f.action !== "block") setAction(f, "block");
    f.vx = 0;
    return;
  }
  const dir = (p.hRight ? 1 : 0) - (p.hLeft ? 1 : 0);
  const want: Action = dir === 0 ? "idle" : dir === f.facing ? "walkF" : "walkB";
  if (f.action !== want) setAction(f, want);
}

function moveForward(f: FighterState, px: number): void {
  f.x += f.facing * px;
}

function enterActive(state: FightState, f: FighterState, p: Priv): void {
  const v = p.variant;
  if (!v) return;
  f.phase = "active";
  f.phaseFrame = 0;
  f.phaseLen = v.a;
  if (p.released && v.s <= v.cf && v.chargeLunge > 0) moveForward(f, v.chargeLunge);
  emit(state, { type: "whoosh", player: f.index, move: v.str, charge: v.lvl });
}

function releaseCharge(state: FightState, f: FighterState, p: Priv): void {
  const s = f.move;
  if (s === null || s === "air") return;
  p.variant = VARIANTS[f.char][s][f.chargeLevel];
  p.released = true;
  const v = p.variant;
  f.phase = "startup";
  f.phaseFrame = v.cf;
  f.phaseLen = v.s;
  if (v.cf >= v.s) enterActive(state, f, p);
}

function advanceAttack(state: FightState, f: FighterState, p: Priv, o: FighterState): void {
  const v = p.variant;
  const s = f.move;
  if (!v || s === null || s === "air") {
    setAction(f, "idle");
    neutral(state, f, p, o);
    return;
  }
  // chain cancel after contact: light > light (twice at most) / medium / heavy, medium > heavy
  if (p.contact >= 1 && p.contact <= G.CW && p.chainLen < 4) {
    const next =
      s === "light"
        ? bufferedStrength(p, p.chainLights < 2, true, true)
        : s === "medium"
          ? bufferedStrength(p, false, false, true)
          : null;
    if (next) {
      startAttack(f, p, next, true);
      return;
    }
  }
  switch (f.phase) {
    case "startup": {
      f.phaseFrame++;
      const lf = v.lungeFrames;
      if (lf && v.lunge > 0 && f.phaseFrame >= lf[0] && f.phaseFrame <= lf[1]) {
        moveForward(f, v.lunge / (lf[1] - lf[0] + 1));
      }
      if (p.released && v.chargeLunge > 0 && f.phaseFrame > v.cf && v.s > v.cf) {
        moveForward(f, v.chargeLunge / (v.s - v.cf));
      }
      if (!p.released && f.phaseFrame === v.cf && held(p, s)) {
        f.phase = "charge";
        f.phaseFrame = 0;
        f.phaseLen = CHARGE[f.char][s].hold;
        f.chargeFrames = 0;
        return;
      }
      if (f.phaseFrame >= v.s) enterActive(state, f, p);
      return;
    }
    case "charge": {
      f.phaseFrame++;
      f.chargeFrames++;
      const t = CHARGE[f.char][s];
      if (f.chargeFrames === t.t1) {
        f.chargeLevel = 1;
        emit(state, { type: "charge", player: f.index, level: 1 });
      } else if (f.chargeFrames === t.t2) {
        f.chargeLevel = 2;
        emit(state, { type: "charge", player: f.index, level: 2 });
      }
      if (!held(p, s) || f.chargeFrames >= t.hold) releaseCharge(state, f, p);
      return;
    }
    case "active": {
      f.phaseFrame++;
      if (f.phaseFrame >= v.a) {
        f.phase = "recovery";
        f.phaseFrame = 0;
        f.phaseLen = v.r;
      }
      return;
    }
    case "recovery": {
      f.phaseFrame++;
      if (f.phaseFrame >= v.r) {
        p.variant = null;
        setAction(f, "idle");
        neutral(state, f, p, o);
      }
      return;
    }
    case null:
      setAction(f, "idle");
      return;
  }
}

function advanceAir(state: FightState, f: FighterState, p: Priv): void {
  if (f.action === "jump") {
    if (!p.airUsed) {
      const s = bufferedStrength(p, true, true, true);
      if (s) {
        consume(p, s);
        p.airUsed = true;
        const air = CHARS[f.char].air;
        f.action = "airAttack";
        f.actionFrame = 0;
        f.move = "air";
        f.phase = "startup";
        f.phaseFrame = 0;
        f.phaseLen = air.s;
        f.chargeLevel = 0;
        f.chargeFrames = 0;
        p.air = air;
        p.variant = null;
        p.hasHit = false;
        p.contact = -1;
      }
    }
    return;
  }
  // airAttack
  const air = p.air;
  if (!air) return;
  f.phaseFrame++;
  if (f.phase === "startup" && f.phaseFrame >= air.s) {
    f.phase = "active";
    f.phaseFrame = 0;
    f.phaseLen = G.AIR_ACTIVE_MAX;
    emit(state, { type: "whoosh", player: f.index, move: "air", charge: 0 });
  } else if (f.phase === "active" && f.phaseFrame >= G.AIR_ACTIVE_MAX) {
    f.phase = "recovery";
    f.phaseFrame = 0;
    f.phaseLen = 60;
  }
}

function endCombo(state: FightState, d: FighterState, pd: Priv): void {
  if (pd.comboBy >= 0) {
    const a = state.fighters[pd.comboBy as PlayerIndex];
    a.combo = 0;
  }
  pd.comboBy = -1;
  pd.taken = 0;
}

function updateFighter(state: FightState, it: Internal, i: PlayerIndex): void {
  const f = state.fighters[i];
  const o = state.fighters[i === 0 ? 1 : 0];
  const p = it.p[i];
  const c = CHARS[f.char];
  f.actionFrame++;
  if (f.invuln > 0) f.invuln--;
  if (f.dodgeCooldown > 0) f.dodgeCooldown--;
  if (p.parryWin > 0) p.parryWin--;
  if (p.parryLock > 0) p.parryLock--;
  if (p.contact >= 0) p.contact++;
  if (f.action === "block" || f.action === "blockstun") p.guardIdle = 0;
  else if (++p.guardIdle > G.GUARD_REGEN_DELAY && p.guard < c.guard) p.guard = Math.min(c.guard, p.guard + G.GUARD_REGEN);
  if (state.config.mode === "tutorial" && state.tick - p.lastHurtTick > TUTORIAL_REGEN_DELAY && f.hp > 0) {
    f.hp = Math.min(f.maxHp, f.hp + TUTORIAL_REGEN);
  }

  switch (f.action) {
    case "idle":
    case "walkF":
    case "walkB":
    case "block":
      neutral(state, f, p, o);
      break;
    case "land":
      if (f.actionFrame >= p.landLen) {
        setAction(f, "idle");
        neutral(state, f, p, o);
      }
      break;
    case "attack":
      advanceAttack(state, f, p, o);
      break;
    case "jump":
    case "airAttack":
      advanceAir(state, f, p);
      break;
    case "blockstun":
      if (--f.stun <= 0) {
        f.stun = 0;
        setAction(f, p.hBlock ? "block" : "idle");
        neutral(state, f, p, o);
      }
      break;
    case "hitstun":
    case "stagger":
      if (--f.stun <= 0) {
        f.stun = 0;
        endCombo(state, f, p);
        setAction(f, "idle");
        neutral(state, f, p, o);
      }
      break;
    case "dodge":
      if (f.actionFrame >= G.DODGE_TOTAL) {
        setAction(f, "idle");
        neutral(state, f, p, o);
      }
      break;
    case "down":
      if (--f.stun <= 0) {
        f.stun = 0;
        endCombo(state, f, p);
        setAction(f, "getup");
        f.invuln = G.KD_GETUP + G.WAKE_INVULN;
      }
      break;
    case "getup":
      if (f.actionFrame >= G.KD_GETUP) {
        setAction(f, "idle");
        neutral(state, f, p, o);
      }
      break;
    case "intro":
    case "launch":
    case "ko":
    case "dizzy":
    case "finisher":
    case "win":
    case "lose":
      break;
  }
  // buffers age only on simulated frames (presses made during hit-freeze survive it)
  if (p.bL > 0) p.bL--;
  if (p.bM > 0) p.bM--;
  if (p.bH > 0) p.bH--;
  if (p.bDodge > 0) p.bDodge--;
}

// ---------------------------------------------------------------------------------------------
// Physics

function physics(state: FightState, it: Internal, i: PlayerIndex): void {
  const f = state.fighters[i];
  const p = it.p[i];
  const c = CHARS[f.char];
  switch (f.action) {
    case "walkF":
      f.x += f.facing * c.walkF;
      break;
    case "walkB":
      f.x -= f.facing * c.walkB;
      break;
    case "dodge":
      if (f.actionFrame < G.DODGE_TRAVEL) f.x -= f.facing * (c.dodge / G.DODGE_TRAVEL);
      break;
    case "jump":
    case "airAttack":
    case "launch":
    case "ko":
    case "dizzy": {
      if (f.y > 0 || f.vy > 0) {
        const g = f.action === "jump" || f.action === "airAttack" ? c.jumpG : G.LAUNCH.g;
        f.x += f.vx;
        f.y += f.vy;
        f.vy -= g;
        if (f.y <= 0) {
          f.y = 0;
          f.vy = 0;
          f.vx = 0;
          land(state, f, p);
        }
      } else {
        f.vx = 0;
        f.vy = 0;
      }
      break;
    }
    default:
      // anything left in the air without its own arc (e.g. a parried air attack) just falls
      if (f.y > 0) {
        f.x += f.vx;
        f.y += f.vy;
        f.vy -= G.LAUNCH.g;
        if (f.y <= 0) {
          f.y = 0;
          f.vy = 0;
          f.vx = 0;
        }
      }
      break;
  }
  if (p.push !== 0) {
    const mag = Math.abs(p.push);
    const step = Math.sign(p.push) * Math.min(mag, Math.max(0.75, mag * 0.3));
    const want = f.x + step;
    const clamped = clampX(want);
    f.x = clamped;
    p.push -= step;
    if (Math.abs(p.push) < 0.01) p.push = 0;
    const overflow = want - clamped;
    if (overflow !== 0 && p.pushFrom >= 0) {
      const a = state.fighters[p.pushFrom as PlayerIndex];
      if (a.y <= 0) a.x = clampX(a.x - overflow);
    }
  }
  f.x = clampX(f.x);
}

function land(state: FightState, f: FighterState, p: Priv): void {
  switch (f.action) {
    case "jump":
    case "airAttack": {
      const len = f.action === "airAttack" && p.air ? p.air.land : G.LAND;
      setAction(f, "land");
      p.landLen = len;
      p.air = null;
      emit(state, { type: "land", player: f.index, x: f.x });
      break;
    }
    case "launch":
      setAction(f, "down");
      f.stun = G.KD_DOWN;
      emit(state, { type: "knockdown", player: f.index, x: f.x });
      break;
    case "ko":
      if (!p.koLanded) {
        p.koLanded = true;
        emit(state, { type: "knockdown", player: f.index, x: f.x });
      }
      break;
    default:
      break;
  }
}

function pushHeight(f: FighterState): number {
  return CHARS[f.char].height * 0.72;
}

function separate(state: FightState, it: Internal): void {
  const a = state.fighters[0];
  const b = state.fighters[1];
  if (a.action === "ko" || b.action === "ko") return;
  const vOverlap = Math.min(a.y + pushHeight(a), b.y + pushHeight(b)) - Math.max(a.y, b.y);
  if (vOverlap > 0) {
    const minD = CHARS[a.char].pushHalfW + CHARS[b.char].pushHalfW;
    let dx = b.x - a.x;
    if (Math.abs(dx) < minD) {
      let dir: number;
      if (Math.abs(dx) > 0.001) dir = Math.sign(dx);
      else {
        // perfectly stacked: whoever came from the left stays on the left
        const pa = it.p[0].prevX;
        const pb = it.p[1].prevX;
        dir = pa < pb ? 1 : pa > pb ? -1 : a.facing;
        dx = 0;
      }
      const over = minD - Math.abs(dx);
      // an airborne fighter yields to the grounded one
      let shareA = 0.5;
      if (a.y > 0 && b.y <= 0) shareA = 1;
      else if (b.y > 0 && a.y <= 0) shareA = 0;
      a.x = clampX(a.x - dir * over * shareA);
      b.x = clampX(b.x + dir * over * (1 - shareA));
      // corner: whoever is not pinned takes the rest
      const deficit = minD - (b.x - a.x) * dir;
      if (deficit > 0.001) {
        const aPinned = dir > 0 ? a.x <= STAGE_MARGIN : a.x >= STAGE_W - STAGE_MARGIN;
        if (aPinned) b.x = clampX(b.x + dir * deficit);
        else a.x = clampX(a.x - dir * deficit);
      }
    }
  }
  // camera constraint
  const sep = b.x - a.x;
  const abs = Math.abs(sep);
  if (abs > G.MAX_SEP) {
    const excess = abs - G.MAX_SEP;
    const s = Math.sign(sep);
    const outA = (it.p[0].prevX - a.x) * s; // a moving away from b
    const outB = (b.x - it.p[1].prevX) * s;
    const oa = outA > 0 ? outA : 0;
    const ob = outB > 0 ? outB : 0;
    const tot = oa + ob;
    const ka = tot > 0 ? oa / tot : 0.5;
    a.x = clampX(a.x + s * excess * ka);
    b.x = clampX(b.x - s * excess * (1 - ka));
  }
}

function updateFacing(state: FightState): void {
  for (let i = 0; i < 2; i++) {
    const f = state.fighters[i as PlayerIndex];
    const o = state.fighters[i === 0 ? 1 : 0];
    if (f.y > 0) continue;
    switch (f.action) {
      case "idle":
      case "walkF":
      case "walkB":
      case "block":
      case "land":
      case "intro":
      case "blockstun": {
        const s = sideOf(f, o);
        if (s !== f.facing && Math.abs(o.x - f.x) > 1) {
          f.facing = s;
          if (f.action === "walkF") f.action = "walkB";
          else if (f.action === "walkB") f.action = "walkF";
        }
        break;
      }
      default:
        break;
    }
  }
}

// ---------------------------------------------------------------------------------------------
// Boxes and contact

interface Box {
  x0: number;
  x1: number;
  y0: number;
  y1: number;
}

const HIT_A: Box = { x0: 0, x1: 0, y0: 0, y1: 0 };
const HIT_B: Box = { x0: 0, x1: 0, y0: 0, y1: 0 };
const HURT: Box = { x0: 0, x1: 0, y0: 0, y1: 0 };

function activeBoxDef(f: FighterState, p: Priv): BoxDef | null {
  if (p.hasHit) return null;
  if (f.action === "attack" && f.phase === "active" && p.variant) return p.variant.hit;
  if (f.action === "airAttack" && f.phase === "active" && p.air) return p.air.hit;
  return null;
}

function hitBox(f: FighterState, p: Priv, out: Box): boolean {
  const b = activeBoxDef(f, p);
  if (!b) return false;
  if (f.facing === 1) {
    out.x0 = f.x + b.x;
    out.x1 = f.x + b.x + b.w;
  } else {
    out.x0 = f.x - b.x - b.w;
    out.x1 = f.x - b.x;
  }
  out.y0 = f.y + b.y;
  out.y1 = f.y + b.y + b.h;
  return true;
}

function hurtBox(f: FighterState, p: Priv, out: Box): void {
  const c = CHARS[f.char];
  let fwd = c.hurtHalfW;
  const v = p.variant;
  if (f.action === "attack" && v && v.limb) {
    const ext = (v.hit.x + v.hit.w) * 0.6;
    if (f.phase === "active" || (f.phase === "recovery" && f.phaseFrame < v.r * 0.5)) fwd = Math.max(fwd, ext);
  }
  if (f.facing === 1) {
    out.x0 = f.x - c.hurtHalfW;
    out.x1 = f.x + fwd;
  } else {
    out.x0 = f.x - fwd;
    out.x1 = f.x + c.hurtHalfW;
  }
  let h = c.height;
  if (f.action === "down" || f.action === "ko") h = 14;
  else if (f.action === "getup") h = c.height * 0.6;
  out.y0 = f.y;
  out.y1 = f.y + h;
}

function hittable(f: FighterState): boolean {
  if (f.invuln > 0) return false;
  switch (f.action) {
    case "launch":
    case "down":
    case "getup":
    case "ko":
    case "dizzy":
    case "finisher":
    case "intro":
    case "win":
    case "lose":
      return false;
    default:
      return true;
  }
}

function overlaps(a: Box, b: Box): boolean {
  return a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1;
}

function canBlock(d: FighterState, a: FighterState): boolean {
  if (d.y > 0) return false;
  if (d.action !== "block" && d.action !== "blockstun") return false;
  const s = sideOf(d, a);
  return s === d.facing || Math.abs(a.x - d.x) < 2;
}

function attackerRemaining(a: FighterState, pa: Priv): number {
  const v = pa.variant;
  if (a.action === "attack" && v) {
    if (a.phase === "active") return v.a - 1 - a.phaseFrame + v.r;
    if (a.phase === "recovery") return v.r - a.phaseFrame;
    return v.a + v.r;
  }
  if (a.action === "airAttack" && pa.air) return pa.air.land + 6;
  return 10;
}

interface AttackNumbers {
  move: "light" | "medium" | "heavy" | "air";
  lvl: 0 | 1 | 2;
  dmg: number;
  hs: number;
  bs: number;
  launch: boolean;
  guardBreak: boolean;
  pushHit: number;
  pushBlock: number;
  guardDmg: number;
  chip: number;
  hitstop: number;
  blockstop: number;
  heavyHurt: boolean;
}

const NUM: AttackNumbers = {
  move: "light", lvl: 0, dmg: 0, hs: 0, bs: 0, launch: false, guardBreak: false,
  pushHit: 0, pushBlock: 0, guardDmg: 0, chip: 0, hitstop: 0, blockstop: 0, heavyHurt: false,
};

function loadNumbers(a: FighterState, pa: Priv, n: AttackNumbers, dmgMul: number): void {
  const v = pa.variant;
  if (a.action === "attack" && v) {
    n.move = v.str;
    n.lvl = v.lvl;
    n.dmg = v.dmg * dmgMul;
    n.hs = v.hs;
    n.bs = v.bs;
    n.launch = v.launch;
    n.guardBreak = v.guardBreak;
    n.pushHit = v.pushHit;
    n.pushBlock = v.pushBlock;
    n.guardDmg = v.guardDmg;
    n.chip = Math.round(v.chip * dmgMul);
    n.hitstop = v.hitstop;
    n.blockstop = v.blockstop;
    n.heavyHurt = v.str !== "light" || v.lvl > 0;
    return;
  }
  const air = pa.air ?? CHARS[a.char].air;
  n.move = "air";
  n.lvl = 0;
  n.dmg = air.dmg * dmgMul;
  n.hs = air.hs;
  n.bs = air.bs;
  n.launch = false;
  n.guardBreak = false;
  n.pushHit = air.pushHit;
  n.pushBlock = air.pushBlock;
  n.guardDmg = air.guardDmg;
  n.chip = 0;
  n.hitstop = air.hitstop;
  n.blockstop = air.blockstop;
  n.heavyHurt = true;
}

function interrupt(f: FighterState, p: Priv): void {
  p.variant = null;
  p.air = null;
  p.hasHit = false;
  p.contact = -1;
  p.released = false;
}

function pushApart(state: FightState, it: Internal, ai: PlayerIndex, di: PlayerIndex, amount: number): void {
  const a = state.fighters[ai];
  const d = state.fighters[di];
  const pd = it.p[di];
  pd.push = sideOf(a, d) * amount;
  pd.pushFrom = ai;
}

function applyContact(state: FightState, it: Internal, ai: PlayerIndex, ix: number, iy: number): void {
  const di: PlayerIndex = ai === 0 ? 1 : 0;
  const a = state.fighters[ai];
  const d = state.fighters[di];
  const pa = it.p[ai];
  const pd = it.p[di];
  const cd = CHARS[d.char];
  const n = NUM;
  loadNumbers(a, pa, n, rulesOf(state).dmgMul[ai]);
  pa.hasHit = true;
  pa.contact = 0;
  const sy = GROUND_Y - iy;

  if (canBlock(d, a)) {
    pd.guardIdle = 0;
    if (pd.parryWin > 0) {
      // just-block: the attacker is left wide open
      pd.parryWin = 0;
      pd.parryLock = 0;
      emit(state, { type: "parry", defender: di, x: ix, y: sy });
      interrupt(a, pa);
      setAction(a, "stagger");
      a.stun = G.PARRY_ADV;
      a.vx = 0;
      if (a.y > 0) a.vy = Math.min(a.vy, 0);
      a.combo = 0;
      state.hitstop = Math.max(state.hitstop, 10);
      return;
    }
    let gb = n.guardBreak;
    if (!gb) {
      pd.guard -= n.guardDmg;
      if (pd.guard <= 0) gb = true;
    }
    if (gb) {
      const dmg = n.guardBreak ? Math.round(n.dmg * G.GB_DAMAGE) : n.chip;
      d.hp -= dmg;
      if (state.config.mode === "tutorial" && d.hp < 1) d.hp = 1;
      pd.lastHurtTick = state.tick;
      pd.guard = cd.guard;
      emit(state, { type: "guardBreak", defender: di, x: ix, y: sy });
      setAction(d, "stagger");
      d.stun = attackerRemaining(a, pa) + G.GB_ADV;
      d.vx = 0;
      pd.taken = 1;
      pd.comboBy = ai;
      a.combo = 0;
      pushApart(state, it, ai, di, n.pushBlock * 0.6);
      state.hitstop = Math.max(state.hitstop, n.hitstop);
      return;
    }
    let chip = n.chip;
    if (!G.CHIP_CAN_KO && chip >= d.hp) chip = Math.max(0, d.hp - 1);
    d.hp -= chip;
    if (chip > 0) pd.lastHurtTick = state.tick;
    setAction(d, "blockstun");
    d.stun = n.bs;
    d.vx = 0;
    pushApart(state, it, ai, di, n.pushBlock);
    emit(state, { type: "block", defender: di, x: ix, y: sy, move: n.move, chip });
    state.hitstop = Math.max(state.hitstop, n.blockstop);
    return;
  }

  // clean hit
  const inCombo = pd.comboBy === ai && (d.action === "hitstun" || d.action === "stagger" || d.action === "launch");
  if (!inCombo) {
    if (pd.comboBy >= 0 && pd.comboBy !== ai) state.fighters[pd.comboBy as PlayerIndex].combo = 0;
    pd.taken = 0;
    a.combo = 0;
  }
  const scale = G.SCALING[Math.min(pd.taken, G.SCALING.length - 1)] ?? 0.35;
  const dmg = Math.max(1, Math.round(n.dmg * scale));
  pd.taken++;
  pd.comboBy = ai;
  a.combo++;
  d.hp -= dmg;
  if (state.config.mode === "tutorial" && d.hp < 1) d.hp = 1;
  pd.lastHurtTick = state.tick;
  const wasAirborne = d.y > 0;
  interrupt(d, pd);
  const away = sideOf(a, d);
  const mul = cd.launchMul;
  let launched = false;
  if (d.hp <= 0) {
    setAction(d, "ko");
    const L = G.KO_LAUNCH;
    d.vx = away * L.vx * mul;
    d.vy = L.vy;
    d.y = Math.max(d.y, 0.01);
    launched = true;
  } else if (n.launch || wasAirborne) {
    const L = n.launch ? (n.lvl === 2 ? G.LAUNCH_MAX : G.LAUNCH) : G.AIR_HIT;
    setAction(d, "launch");
    d.vx = away * L.vx * mul;
    d.vy = L.vy * (0.85 + 0.15 * mul);
    d.y = Math.max(d.y, 0.01);
    d.hurtKind = "heavy";
    launched = true;
  } else {
    setAction(d, "hitstun");
    d.stun = n.hs;
    d.hurtKind = n.heavyHurt ? "heavy" : "light";
    d.vx = 0;
    pushApart(state, it, ai, di, n.pushHit);
  }
  if (launched) pd.push = 0;
  emit(state, {
    type: "hit",
    attacker: ai,
    x: ix,
    y: sy,
    move: n.move,
    charge: n.lvl,
    damage: dmg,
    combo: a.combo,
    launch: launched,
  });
  state.hitstop = Math.max(state.hitstop, n.hitstop);
}

function resolveHits(state: FightState, it: Internal): void {
  const a = state.fighters[0];
  const b = state.fighters[1];
  const pa = it.p[0];
  const pb = it.p[1];
  let hitA = false;
  let hitB = false;
  let ax = 0, ay = 0, bx = 0, by = 0;
  if (hitBox(a, pa, HIT_A) && hittable(b)) {
    hurtBox(b, pb, HURT);
    if (overlaps(HIT_A, HURT)) {
      hitA = true;
      ax = (Math.max(HIT_A.x0, HURT.x0) + Math.min(HIT_A.x1, HURT.x1)) / 2;
      ay = (Math.max(HIT_A.y0, HURT.y0) + Math.min(HIT_A.y1, HURT.y1)) / 2;
    }
  }
  if (hitBox(b, pb, HIT_B) && hittable(a)) {
    hurtBox(a, pa, HURT);
    if (overlaps(HIT_B, HURT)) {
      hitB = true;
      bx = (Math.max(HIT_B.x0, HURT.x0) + Math.min(HIT_B.x1, HURT.x1)) / 2;
      by = (Math.max(HIT_B.y0, HURT.y0) + Math.min(HIT_B.y1, HURT.y1)) / 2;
    }
  }
  if (hitA) applyContact(state, it, 0, ax, ay);
  if (hitB) applyContact(state, it, 1, bx, by);
}

// ---------------------------------------------------------------------------------------------
// Round flow

function readInputs(state: FightState, it: Internal, inputs: readonly [InputFrame, InputFrame], live: boolean): void {
  for (let i = 0; i < 2; i++) {
    const p = it.p[i as PlayerIndex];
    const inp = inputs[i as PlayerIndex];
    if (!live) {
      p.hL = p.hM = p.hH = p.hBlock = p.hUp = p.hLeft = p.hRight = false;
      p.pL = inp.light;
      p.pM = inp.medium;
      p.pH = inp.heavy;
      p.pDodge = inp.dodge;
      p.pBlock = inp.block;
      p.bL = p.bM = p.bH = p.bDodge = 0;
      continue;
    }
    if (inp.light && !p.pL) p.bL = G.BUFFER;
    if (inp.medium && !p.pM) p.bM = G.BUFFER;
    if (inp.heavy && !p.pH) p.bH = G.BUFFER;
    if (inp.dodge && !p.pDodge) p.bDodge = G.BUFFER;
    if (inp.block && !p.pBlock && p.parryLock <= 0) {
      p.parryWin = G.PARRY_WINDOW;
      p.parryLock = G.PARRY_LOCKOUT;
    }
    p.pL = inp.light;
    p.pM = inp.medium;
    p.pH = inp.heavy;
    p.pDodge = inp.dodge;
    p.pBlock = inp.block;
    p.hL = inp.light;
    p.hM = inp.medium;
    p.hH = inp.heavy;
    p.hBlock = inp.block;
    p.hUp = inp.up;
    p.hLeft = inp.left;
    p.hRight = inp.right;
  }
}

function isFinalRound(state: FightState): boolean {
  const r = state.config.roundsToWin - 1;
  return (state.wins[0] === r && state.wins[1] === r) || state.round >= MAX_ROUNDS;
}

function simulate(state: FightState, it: Internal, allowHits: boolean): void {
  it.p[0].prevX = state.fighters[0].x;
  it.p[1].prevX = state.fighters[1].x;
  updateFighter(state, it, 0);
  updateFighter(state, it, 1);
  physics(state, it, 0);
  physics(state, it, 1);
  separate(state, it);
  if (allowHits) resolveHits(state, it);
  updateFacing(state);
  for (let i = 0; i < 2; i++) {
    const f = state.fighters[i as PlayerIndex];
    if (f.hp < 0) f.hp = 0;
  }
}

function checkRoundOver(state: FightState, it: Internal): void {
  const [a, b] = state.fighters;
  if (state.config.mode === "tutorial") return;
  const deadA = a.hp <= 0;
  const deadB = b.hp <= 0;
  if (deadA || deadB) {
    if (deadA && deadB) {
      state.roundWinner = "draw";
      if (a.action !== "ko") koFall(a, b);
      if (b.action !== "ko") koFall(b, a);
      const final = state.round >= MAX_ROUNDS;
      emit(state, { type: "ko", winner: "draw", perfect: false, final });
      setPhase(state, it, "ko");
      state.slowmo = KO_SLOWMO;
      state.hitstop = Math.max(state.hitstop, G.KO_HITSTOP);
      return;
    }
    const w: PlayerIndex = deadA ? 1 : 0;
    const winner = state.fighters[w];
    const loser = state.fighters[w === 0 ? 1 : 0];
    state.roundWinner = w;
    state.wins[w]++;
    if (loser.action !== "ko") koFall(loser, winner);
    let final = false;
    if (state.wins[w] >= state.config.roundsToWin) {
      state.matchWinner = w;
      if (rulesOf(state).finisher) {
        it.pendingFinisher = w;
        state.hitstop = Math.max(state.hitstop, G.KO_HITSTOP);
        return;
      }
      // finisher off: the match-winning round ends with a regular KO
      final = true;
    }
    emit(state, { type: "ko", winner: w, perfect: winner.hp >= winner.maxHp, final });
    setPhase(state, it, "ko");
    state.slowmo = KO_SLOWMO;
    state.hitstop = Math.max(state.hitstop, G.KO_HITSTOP);
    return;
  }
  if (state.timer <= 0 && rulesOf(state).roundSeconds !== null) {
    state.timer = 0;
    const ra = a.hp / a.maxHp;
    const rb = b.hp / b.maxHp;
    let w: PlayerIndex | "draw" = "draw";
    if (Math.abs(ra - rb) > 1e-9) w = ra > rb ? 0 : 1;
    state.roundWinner = w;
    if (w !== "draw") {
      state.wins[w]++;
      if (state.wins[w] >= state.config.roundsToWin) state.matchWinner = w;
      it.timeUpLoser = w === 0 ? 1 : 0;
    }
    it.timeUp = true;
    emit(state, { type: "timeUp", winner: w });
    setPhase(state, it, "ko");
  }
}

function koFall(f: FighterState, from: FighterState): void {
  const away = sideOf(from, f);
  setAction(f, "ko");
  f.vx = away * G.KO_LAUNCH.vx * CHARS[f.char].launchMul;
  f.vy = G.KO_LAUNCH.vy;
  f.y = Math.max(f.y, 0.01);
}

function enterFinisher(state: FightState, it: Internal, w: PlayerIndex): void {
  const winner = state.fighters[w];
  const loser = state.fighters[w === 0 ? 1 : 0];
  const pl = it.p[w === 0 ? 1 : 0];
  interrupt(loser, pl);
  interrupt(winner, it.p[w]);
  pl.push = 0;
  it.p[w].push = 0;
  setAction(loser, "dizzy");
  loser.vx = 0;
  if (loser.vy > 0) loser.vy = 0;
  loser.hp = 0;
  loser.stun = 0;
  loser.invuln = 0;
  const side = sideOf(winner, loser);
  const dist = CHARS[winner.char].pushHalfW + CHARS[loser.char].pushHalfW + 18;
  let target = loser.x - side * dist;
  if (clampX(target) !== target) {
    target = clampX(target);
    loser.x = clampX(target + side * dist);
  }
  it.finisherTarget = target;
  it.finisherSpeed = Math.max(CHARS[winner.char].walkF, Math.abs(target - winner.x) / 36);
  loser.facing = (side === 1 ? -1 : 1);
  winner.facing = side;
  if (winner.y <= 0) {
    setAction(winner, Math.abs(target - winner.x) < 1 ? "idle" : "walkF");
    winner.vx = 0;
  }
  winner.combo = 0;
  state.hitstop = 0;
  state.slowmo = 0;
  setPhase(state, it, "finisher");
  emit(state, { type: "finisherStart", winner: w, char: winner.char });
}

function stepFinisher(state: FightState, it: Internal): void {
  const w = state.matchWinner;
  if (w === null) return;
  const winner = state.fighters[w];
  const li: PlayerIndex = w === 0 ? 1 : 0;
  const loser = state.fighters[li];
  const pf = state.phaseFrame;
  const side: 1 | -1 = winner.facing;
  loser.actionFrame++;
  // winner: land, walk into place, then perform
  if (winner.action !== "finisher") {
    winner.actionFrame++;
    if (winner.y > 0 || winner.vy > 0) {
      const g = CHARS[winner.char].jumpG;
      winner.x = clampX(winner.x + winner.vx);
      winner.y += winner.vy;
      winner.vy -= g;
      if (winner.y <= 0) {
        winner.y = 0;
        winner.vy = 0;
        winner.vx = 0;
        setAction(winner, "walkF");
      }
    } else {
      const dx = it.finisherTarget - winner.x;
      const sp = it.finisherSpeed;
      if (Math.abs(dx) <= sp || pf >= 40) {
        winner.x = it.finisherTarget;
        setAction(winner, "finisher");
        winner.actionFrame = pf;
      } else {
        const want: Action = Math.sign(dx) === side ? "walkF" : "walkB";
        if (winner.action !== want) setAction(winner, want);
        winner.x += Math.sign(dx) * sp;
      }
    }
  } else {
    winner.actionFrame = pf;
  }
  // loser
  if (loser.y > 0 || loser.vy > 0) {
    loser.x = clampX(loser.x + loser.vx);
    loser.y += loser.vy;
    loser.vy -= G.LAUNCH.g;
    if (loser.y <= 0) {
      loser.y = 0;
      loser.vy = 0;
      loser.vx = 0;
      if (loser.action === "ko") {
        const pl = it.p[li];
        if (!pl.koLanded) {
          pl.koLanded = true;
          emit(state, { type: "knockdown", player: li, x: loser.x });
        }
      }
    }
  }
  const hy = GROUND_Y - CHARS[loser.char].height * 0.55;
  const hits = FINISHER.hits;
  for (let k = 0; k < hits.length; k++) {
    if (hits[k] === pf) emit(state, { type: "finisherHit", winner: w, index: k, final: false, x: loser.x - side * 4, y: hy });
  }
  if (pf === FINISHER.final) {
    emit(state, { type: "finisherHit", winner: w, index: hits.length, final: true, x: loser.x - side * 4, y: hy });
    setAction(loser, "ko");
    it.p[li].koLanded = false;
    loser.vx = side * 5;
    loser.vy = 6;
    loser.y = 0.01;
  }
  if (pf >= FINISHER.total) {
    setAction(winner, "win");
    setPhase(state, it, "matchEnd");
    emit(state, { type: "matchEnd", winner: w });
  }
}

function settlePoses(state: FightState, it: Internal): void {
  const rw = state.roundWinner;
  for (let i = 0; i < 2; i++) {
    const f = state.fighters[i as PlayerIndex];
    if (f.action === "ko" || f.action === "win" || f.action === "lose") continue;
    if (!isActionable(f) && f.action !== "land") continue;
    if (rw === i) setAction(f, "win");
    else if (it.timeUpLoser === i || (rw === "draw" && it.timeUp)) setAction(f, "lose");
  }
}

function nextRoundOrEnd(state: FightState, it: Internal): void {
  if (state.matchWinner === null && state.round >= MAX_ROUNDS) {
    state.matchWinner = state.wins[1] > state.wins[0] ? 1 : 0;
  }
  if (state.matchWinner !== null) {
    const w = state.matchWinner;
    const f = state.fighters[w];
    if (f.action !== "win") setAction(f, "win");
    setPhase(state, it, "matchEnd");
    emit(state, { type: "matchEnd", winner: w });
    return;
  }
  state.round++;
  resetRound(state, it);
  setPhase(state, it, "intro");
}

const NEUTRAL_PAIR: readonly [InputFrame, InputFrame] = [
  { left: false, right: false, up: false, light: false, medium: false, heavy: false, block: false, dodge: false },
  { left: false, right: false, up: false, light: false, medium: false, heavy: false, block: false, dodge: false },
];

export function stepFight(state: FightState, inputs: readonly [InputFrame, InputFrame]): void {
  const it = internalOf(state);
  EVENTS_FRESH = false;
  state.events = NO_EVENTS;
  state.tick++;
  // phaseFrame = ticks since the phase began (0 on the tick that entered it)
  state.phaseFrame++;
  const live = state.phase === "fight";
  readInputs(state, it, live ? inputs : NEUTRAL_PAIR, live);

  if (state.hitstop > 0) {
    state.hitstop--;
    if (state.hitstop === 0 && it.pendingFinisher >= 0) {
      const w = it.pendingFinisher as PlayerIndex;
      it.pendingFinisher = -1;
      enterFinisher(state, it, w);
    }
    return;
  }
  if (state.slowmo > 0) {
    state.slowmo--;
    if ((state.slowmo & 1) === 1) {
      return;
    }
  }

  switch (state.phase) {
    case "intro": {
      if (!it.announced) {
        it.announced = true;
        emit(state, { type: "roundIntro", round: state.round, final: isFinalRound(state) });
      }
      for (let i = 0; i < 2; i++) state.fighters[i as PlayerIndex].actionFrame++;
      if (state.phaseFrame >= PHASE_LEN.intro) {
        for (let i = 0; i < 2; i++) setAction(state.fighters[i as PlayerIndex], "idle");
        setPhase(state, it, "fight");
        emit(state, { type: "fight" });
      }
      break;
    }
    case "fight": {
      simulate(state, it, true);
      if (state.config.mode !== "tutorial" && state.timer > 0 && rulesOf(state).roundSeconds !== null) state.timer--;
      checkRoundOver(state, it);
      break;
    }
    case "ko": {
      simulate(state, it, false);
      const len = it.timeUp ? PHASE_LEN.timeUp : PHASE_LEN.ko;
      if (state.phaseFrame >= len) {
        setPhase(state, it, "roundEnd");
        const rw = state.roundWinner ?? "draw";
        emit(state, { type: "roundEnd", winner: rw });
        settlePoses(state, it);
      }
      break;
    }
    case "roundEnd": {
      simulate(state, it, false);
      settlePoses(state, it);
      if (state.phaseFrame >= PHASE_LEN.roundEnd) nextRoundOrEnd(state, it);
      break;
    }
    case "finisher":
      stepFinisher(state, it);
      break;
    case "matchEnd": {
      simulate(state, it, false);
      const w = state.matchWinner;
      if (w !== null) {
        const f = state.fighters[w];
        if (f.action !== "win" && isActionable(f)) setAction(f, "win");
      }
      break;
    }
  }
}

// ---------------------------------------------------------------------------------------------
// Snapshots (online rollback)

/**
 * Deep copy of a fight, including the private per-fighter / per-fight data, so that stepping
 * the copy and the original with the same inputs gives identical results. The simulation has
 * no random state of its own (the seed only lives in the config); `config` is immutable and
 * shared, which is also how the renderer recognises copies of the same fight.
 */
export function cloneFight(state: FightState): FightState {
  const it = internalOf(state);
  const copy: FightState = {
    config: state.config,
    tick: state.tick,
    phase: state.phase,
    phaseFrame: state.phaseFrame,
    round: state.round,
    wins: [state.wins[0], state.wins[1]],
    timer: state.timer,
    fighters: [{ ...state.fighters[0] }, { ...state.fighters[1] }],
    hitstop: state.hitstop,
    slowmo: state.slowmo,
    roundWinner: state.roundWinner,
    matchWinner: state.matchWinner,
    events: state.events.slice(),
  };
  // Priv is flat; `variant` / `air` point at immutable move data and stay shared.
  INTERNAL.set(copy, {
    p: [{ ...it.p[0] }, { ...it.p[1] }],
    pendingFinisher: it.pendingFinisher,
    finisherTarget: it.finisherTarget,
    finisherSpeed: it.finisherSpeed,
    timeUpLoser: it.timeUpLoser,
    timeUp: it.timeUp,
    announced: it.announced,
  });
  return copy;
}

const HASH_F64 = new Float64Array(1);
const HASH_U32 = new Uint32Array(HASH_F64.buffer);

function hashMix(h: number, v: number): number {
  return Math.imul(h ^ (v >>> 0), 16777619) >>> 0;
}

function hashValue(h: number, v: unknown): number {
  if (typeof v === "number") {
    HASH_F64[0] = v === 0 ? 0 : v; // -0 and +0 hash alike
    return hashMix(hashMix(h, HASH_U32[0] ?? 0), HASH_U32[1] ?? 0);
  }
  if (typeof v === "boolean") return hashMix(h, v ? 1 : 2);
  if (typeof v === "string") {
    let x = hashMix(h, v.length + 7);
    for (let i = 0; i < v.length; i++) x = hashMix(x, v.charCodeAt(i));
    return x;
  }
  if (v === null || v === undefined) return hashMix(h, 3);
  if (Array.isArray(v)) {
    let x = hashMix(h, v.length + 11);
    for (let i = 0; i < v.length; i++) x = hashValue(x, v[i]);
    return x;
  }
  let x = hashMix(h, 5);
  const o = v as Record<string, unknown>;
  for (const k of Object.keys(o)) x = hashValue(x, o[k]);
  return x;
}

/**
 * 32-bit digest of everything that influences future ticks (public state except `events` and
 * `config`, plus the private data). Two peers that fed the same inputs get the same number.
 */
export function hashFight(state: FightState): number {
  const it = internalOf(state);
  let h = 2166136261;
  h = hashValue(h, state.tick);
  h = hashValue(h, state.phase);
  h = hashValue(h, state.phaseFrame);
  h = hashValue(h, state.round);
  h = hashValue(h, state.wins);
  h = hashValue(h, state.timer);
  h = hashValue(h, state.fighters);
  h = hashValue(h, state.hitstop);
  h = hashValue(h, state.slowmo);
  h = hashValue(h, state.roundWinner);
  h = hashValue(h, state.matchWinner);
  h = hashValue(h, it);
  return h >>> 0;
}

// ---------------------------------------------------------------------------------------------
// Debug / introspection

function toRect(b: Box): Rect {
  return { x: b.x0, y: GROUND_Y - b.y1, w: b.x1 - b.x0, h: b.y1 - b.y0 };
}

export function getDebugBoxes(state: FightState, i: PlayerIndex): { hurt: Rect; push: Rect; hit: Rect | null } {
  const it = internalOf(state);
  const f = state.fighters[i];
  const p = it.p[i];
  const c = CHARS[f.char];
  const hb: Box = { x0: 0, x1: 0, y0: 0, y1: 0 };
  hurtBox(f, p, hb);
  const pb: Box = { x0: f.x - c.pushHalfW, x1: f.x + c.pushHalfW, y0: f.y, y1: f.y + pushHeight(f) };
  const hit: Box = { x0: 0, x1: 0, y0: 0, y1: 0 };
  const has = hitBox(f, p, hit);
  return { hurt: toRect(hb), push: toRect(pb), hit: has ? toRect(hit) : null };
}

/** Guard meter 0..1 (for HUD / AI). */
export function getGuard(state: FightState, i: PlayerIndex): number {
  const it = internalOf(state);
  const f = state.fighters[i];
  return it.p[i].guard / CHARS[f.char].guard;
}

/** Remaining frames until the fighter's current attack ends (0 when not attacking). */
export function attackFramesLeft(f: FighterState): number {
  if (f.action !== "attack" || f.move === null || f.move === "air") return 0;
  const v = VARIANTS[f.char][f.move][f.chargeLevel];
  switch (f.phase) {
    case "startup":
      return v.s - f.phaseFrame + v.a + v.r;
    case "charge":
      return v.s - v.cf + v.a + v.r;
    case "active":
      return v.a - f.phaseFrame + v.r;
    case "recovery":
      return v.r - f.phaseFrame;
    case null:
      return 0;
  }
}
