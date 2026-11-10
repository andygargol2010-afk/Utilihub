/**
 * Fightersland — shared contract between the simulation, the renderer and the React shell.
 * Units: logical pixels (view 384x216, stage 640 wide) and simulation frames (60 per second).
 */
import type { GameLocale } from "@/lib/games/catalog";

export type Locale = GameLocale;
export type CharId = "asagiri" | "yoikaze" | "grimvald" | "maelis" | "bazalt" | "oriel";
export type MapId = "quay" | "frost";
export type Strength = "light" | "medium" | "heavy";
export type MoveId = Strength | "air";
export type PlayerIndex = 0 | 1;
export type AiLevel = "easy" | "normal" | "hard";
export type FightMode = "ai" | "versus" | "tutorial";

/** Buttons held during one simulation tick. Directions are absolute (screen left/right). */
export interface InputFrame {
  left: boolean;
  right: boolean;
  up: boolean;
  light: boolean;
  medium: boolean;
  heavy: boolean;
  block: boolean;
  dodge: boolean;
}

export type Action =
  | "intro" // round intro stance, inputs ignored
  | "idle"
  | "walkF"
  | "walkB"
  | "jump" // airborne by own jump (use y / vy for rise vs fall)
  | "land"
  | "attack" // grounded attack: see move / phase / chargeLevel
  | "airAttack"
  | "block" // holding guard
  | "blockstun"
  | "stagger" // guard broken, or own attack was parried: helpless
  | "dodge" // back-dodge
  | "hitstun" // grounded hit reaction: see hurtKind
  | "launch" // knocked into the air
  | "down" // lying on the floor
  | "getup"
  | "ko" // defeated: falls (y > 0) then lies still
  | "dizzy" // match loser waiting for the finisher
  | "finisher" // match winner performing the signature finisher
  | "win"
  | "lose"; // standing defeat (time up)

export type AttackPhase = "startup" | "charge" | "active" | "recovery";

export interface FighterState {
  char: CharId;
  index: PlayerIndex;
  /** Stage x of the ground point under the pelvis (0..STAGE_W). */
  x: number;
  /** Height above the floor, positive up (0 = grounded). */
  y: number;
  vx: number;
  vy: number;
  /** 1 = facing right, -1 = facing left. */
  facing: 1 | -1;
  hp: number;
  maxHp: number;
  action: Action;
  /** Frames since `action` began. */
  actionFrame: number;
  /** Current attack (action "attack" / "airAttack"), else null. */
  move: MoveId | null;
  phase: AttackPhase | null;
  /** Frames since `phase` began and its planned length (for normalised animation). */
  phaseFrame: number;
  phaseLen: number;
  /** 0 = normal, 1 = charged, 2 = fully charged (breaks guard). */
  chargeLevel: 0 | 1 | 2;
  /** Frames the current attack has been charging. */
  chargeFrames: number;
  /** Strength of the reaction while in hitstun. */
  hurtKind: "light" | "heavy";
  /** Remaining frames of hitstun / blockstun / stagger / down. */
  stun: number;
  /** Remaining invulnerable frames (dodge, wake-up). */
  invuln: number;
  /** Frames until the dodge can be used again. */
  dodgeCooldown: number;
  /** Hits landed by this fighter in the current combo (0 when no combo is running). */
  combo: number;
}

export type FightPhase = "intro" | "fight" | "ko" | "finisher" | "roundEnd" | "matchEnd";

export interface FightConfig {
  chars: [CharId, CharId];
  map: MapId;
  mode: FightMode;
  aiLevel: AiLevel;
  seed: number;
  /** Rounds needed to win the match (2 = best of 3). */
  roundsToWin: number;
}

export interface FightState {
  config: FightConfig;
  /** Simulation ticks since the match began. */
  tick: number;
  phase: FightPhase;
  /** Ticks since `phase` began. */
  phaseFrame: number;
  /** 1-based round number. */
  round: number;
  wins: [number, number];
  /** Remaining round time in frames (ROUND_SECONDS * 60 at the start; frozen outside "fight"). */
  timer: number;
  fighters: [FighterState, FighterState];
  /** Remaining hit-freeze frames (the simulation is frozen while > 0). */
  hitstop: number;
  /** Remaining slow-motion frames (the simulation advances every other tick while > 0). */
  slowmo: number;
  roundWinner: PlayerIndex | "draw" | null;
  matchWinner: PlayerIndex | null;
  /** Events emitted by the most recent stepFight call (replaced on every call). */
  events: FightEvent[];
}

export type FightEvent =
  | { type: "roundIntro"; round: number; final: boolean }
  | { type: "fight" }
  | { type: "whoosh"; player: PlayerIndex; move: MoveId; charge: 0 | 1 | 2 }
  | { type: "charge"; player: PlayerIndex; level: 1 | 2 }
  | {
      type: "hit";
      attacker: PlayerIndex;
      /** Stage coordinates of the impact (y measured down from the top of the view). */
      x: number;
      y: number;
      move: MoveId;
      charge: 0 | 1 | 2;
      damage: number;
      combo: number;
      launch: boolean;
    }
  | { type: "block"; defender: PlayerIndex; x: number; y: number; move: MoveId; chip: number }
  | { type: "parry"; defender: PlayerIndex; x: number; y: number }
  | { type: "guardBreak"; defender: PlayerIndex; x: number; y: number }
  | { type: "dodge"; player: PlayerIndex; x: number }
  | { type: "jump"; player: PlayerIndex; x: number }
  | { type: "land"; player: PlayerIndex; x: number }
  | { type: "knockdown"; player: PlayerIndex; x: number }
  | { type: "ko"; winner: PlayerIndex | "draw"; perfect: boolean; final: boolean }
  | { type: "timeUp"; winner: PlayerIndex | "draw" }
  | { type: "roundEnd"; winner: PlayerIndex | "draw" }
  | { type: "finisherStart"; winner: PlayerIndex; char: CharId }
  | { type: "finisherHit"; winner: PlayerIndex; index: number; final: boolean; x: number; y: number }
  | { type: "matchEnd"; winner: PlayerIndex };

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** 1..5 ratings shown on the character-select screen. */
export interface CharRatings {
  power: number;
  speed: number;
  reach: number;
  health: number;
}

export interface AiController {
  /** Input for player `me` this tick. Must not mutate the state. */
  next(state: FightState, me: PlayerIndex): InputFrame;
}

export type TutorialStepId =
  | "move"
  | "jump"
  | "light"
  | "medium"
  | "heavy"
  | "charge"
  | "block"
  | "dodge"
  | "combo"
  | "free";

export interface TutorialController {
  readonly steps: readonly TutorialStepId[];
  /** Index into `steps`; equals steps.length when the tutorial is complete. */
  stepIndex(): number;
  /** 0..1 progress of the current step (e.g. 2 of 3 hits). */
  progress(): number;
  /** Call once after every stepFight (reads state.events). */
  update(state: FightState): void;
  /** Input for the training dummy (player 1) this tick. */
  dummyInput(state: FightState): InputFrame;
}

/** RGBA sprite drawn facing right; (ox, oy) is the ground point under the pelvis. */
export interface SpriteFrame {
  data: Uint8ClampedArray;
  w: number;
  h: number;
  ox: number;
  oy: number;
}

/** Localised words drawn by the canvas HUD / announcer (uppercase, bitmap-font glyphs only). */
export interface RenderLabels {
  round: string;
  finalRound: string;
  fight: string;
  ko: string;
  perfect: string;
  timeUp: string;
  draw: string;
  hits: string;
  wins: string;
  cpu: string;
  p1: string;
  p2: string;
}

export interface RendererOptions {
  labels: RenderLabels;
  /** Tone down full-screen flashes and shake. */
  reducedFlash: boolean;
  /** Draw hit / hurt / push boxes and state text. */
  debug: boolean;
}

export interface Renderer {
  /** Call once after every stepFight: consumes state.events and advances effects. */
  update(state: FightState): void;
  /** Draw the complete frame (map, fighters, effects, HUD) at 1:1 into a 384x216 context. */
  draw(ctx: CanvasRenderingContext2D, state: FightState): void;
  setOptions(opts: Partial<RendererOptions>): void;
  /** Drop all effects (call when a new fight starts). */
  reset(): void;
}

export interface Settings {
  version: 1;
  sound: boolean;
  music: boolean;
  aiLevel: AiLevel;
  reducedFlash: boolean;
  tutorialSeen: boolean;
  lastChar: CharId;
  lastMap: MapId;
}
