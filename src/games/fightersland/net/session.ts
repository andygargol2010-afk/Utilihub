/**
 * Rollback session for one online match (pure logic: no DOM, no network objects).
 *
 * Frames are numbered from 0. The CONFIRMED state has had frames [0, confirmedFrame) applied
 * with the real inputs of both players. `frame` is the local clock: every local tick samples
 * the local input for frame + INPUT_DELAY, sends it, and advances. The PREDICTED state shown on
 * screen is a copy of the confirmed one stepped up to the local clock with the real local
 * inputs and the rival's last known input repeated; it is rebuilt from scratch whenever it is
 * asked for, so a late rival input "rolls back" simply by confirming differently.
 */
import type { FightState, InputFrame, PlayerIndex } from "../core/types";
import { neutralInput } from "../core/constants";
import { cloneFight, hashFight, stepFight } from "../sim/index";
import { unpackInput } from "./protocol";
import type { NetMsg } from "./protocol";

/** Local inputs take effect this many frames later (hides most of the latency). */
export const INPUT_DELAY = 2;
/** The local clock never runs more than this many frames past the rival's last input. */
export const MAX_AHEAD = 8;
/** Longest prediction, in frames. */
export const MAX_PREDICTION = 10;
/** A state hash is exchanged every this many confirmed frames. */
export const HASH_EVERY = 120;

export interface SessionHooks {
  send(msg: NetMsg): void;
  /** Called once per confirmed tick, right after it was simulated (state.events are fresh). */
  onConfirmed(state: FightState): void;
  /** The two simulations diverged (hash mismatch) or the input stream broke. */
  onDesync(): void;
}

export interface SessionStats {
  frame: number;
  confirmedFrame: number;
  remoteLast: number;
  stalls: number;
  slips: number;
  maxPrediction: number;
  /** Own hashes by confirmed frame. */
  hashes: Record<number, number>;
  /** Frames whose hash was compared with the rival's and matched. */
  hashesChecked: number;
  desynced: boolean;
}

/** Past this point inputs no longer matter, so the confirmed state runs on the local clock. */
function isTerminal(s: FightState): boolean {
  return s.phase === "finisher" || s.phase === "matchEnd";
}

export class NetSession {
  readonly local: PlayerIndex;
  readonly confirmed: FightState;
  frame = 0;
  confirmedFrame = 0;
  /** Highest frame for which the rival's input is known. */
  remoteLast = INPUT_DELAY - 1;

  private readonly hooks: SessionHooks;
  private readonly localBits: number[] = [];
  private readonly remoteBits: number[] = [];
  private readonly mine = new Map<number, number>();
  private readonly theirs = new Map<number, number>();
  private readonly pair: [InputFrame, InputFrame] = [neutralInput(), neutralInput()];
  private predictedCache: FightState | null = null;
  private stalls = 0;
  private slips = 0;
  private maxPrediction = 0;
  private hashesChecked = 0;
  private desynced = false;
  private ticks = 0;
  /** Smoothed estimate of how many frames the local clock is ahead of the rival's. */
  private advantage = 0;

  constructor(state: FightState, local: PlayerIndex, hooks: SessionHooks) {
    this.confirmed = state;
    this.local = local;
    this.hooks = hooks;
    for (let i = 0; i < INPUT_DELAY; i++) {
      this.localBits.push(0);
      this.remoteBits.push(0);
    }
  }

  /**
   * One 60 Hz local tick with the buttons held right now. `rttMs` is the measured round trip
   * (used to keep the two clocks together). Returns false when the clock did not advance.
   */
  tick(bits: number, rttMs: number): boolean {
    if (this.desynced) return false;
    this.ticks++;
    if (isTerminal(this.confirmed)) {
      this.frame++;
      this.advance();
      return true;
    }
    if (this.frame - this.remoteLast > MAX_AHEAD) {
      // too far ahead of the rival's inputs: wait for them
      this.stalls++;
      this.advance();
      return false;
    }
    // Clock sync: the rival sent the input for frame remoteLast when its clock read
    // remoteLast - INPUT_DELAY; about half a round trip has passed since. If we run ahead of
    // that, drop one tick in ten until the clocks agree again.
    const rivalFrame = this.remoteLast - INPUT_DELAY + 1 + rttMs / 2 / (1000 / 60);
    this.advantage += (this.frame - rivalFrame - this.advantage) * 0.1;
    if (this.advantage > 2 && this.ticks % 10 === 0) {
      this.slips++;
      this.advance();
      return false;
    }
    const f = this.frame + INPUT_DELAY;
    this.localBits[f] = bits & 255;
    this.hooks.send({ t: "input", frame: f, bits: bits & 255 });
    this.frame++;
    this.advance();
    return true;
  }

  onRemoteInput(frame: number, bits: number): void {
    if (this.desynced) return;
    if (frame <= this.remoteLast) return; // duplicate
    if (frame !== this.remoteLast + 1) {
      // the channel is ordered and reliable: a gap means the stream is broken
      if (!isTerminal(this.confirmed)) this.fail();
      return;
    }
    this.remoteBits[frame] = bits & 255;
    this.remoteLast = frame;
    this.advance();
  }

  onRemoteHash(frame: number, hash: number): void {
    const own = this.mine.get(frame);
    if (own === undefined) this.theirs.set(frame, hash);
    else this.compare(own, hash);
  }

  /** The state to draw: confirmed + prediction up to the local clock (cached until it changes). */
  predicted(): FightState {
    const cached = this.predictedCache;
    if (cached) return cached;
    const n = Math.min(this.frame - this.confirmedFrame, MAX_PREDICTION);
    if (n <= 0) {
      this.predictedCache = this.confirmed;
      return this.confirmed;
    }
    if (n > this.maxPrediction) this.maxPrediction = n;
    const p = cloneFight(this.confirmed);
    const lastRemote = this.remoteBits[this.remoteLast] ?? 0;
    for (let i = 0; i < n; i++) {
      const f = this.confirmedFrame + i;
      this.load(this.localBits[f] ?? 0, f <= this.remoteLast ? this.remoteBits[f] ?? 0 : lastRemote);
      stepFight(p, this.pair);
    }
    this.predictedCache = p;
    return p;
  }

  stats(): SessionStats {
    const hashes: Record<number, number> = {};
    for (const [k, v] of this.mine) hashes[k] = v;
    return {
      frame: this.frame,
      confirmedFrame: this.confirmedFrame,
      remoteLast: this.remoteLast,
      stalls: this.stalls,
      slips: this.slips,
      maxPrediction: this.maxPrediction,
      hashes,
      hashesChecked: this.hashesChecked,
      desynced: this.desynced,
    };
  }

  private load(localBits: number, remoteBits: number): void {
    unpackInput(localBits, this.pair[this.local]);
    unpackInput(remoteBits, this.pair[this.local === 0 ? 1 : 0]);
  }

  /** Apply every frame whose inputs are final. */
  private advance(): void {
    const st = this.confirmed;
    this.predictedCache = null;
    while (!this.desynced && this.confirmedFrame < this.frame) {
      const f = this.confirmedFrame;
      const terminal = isTerminal(st);
      if (!terminal && f > this.remoteLast) break;
      this.load(terminal ? 0 : this.localBits[f] ?? 0, terminal ? 0 : this.remoteBits[f] ?? 0);
      stepFight(st, this.pair);
      this.confirmedFrame = f + 1;
      this.hooks.onConfirmed(st);
      if (this.confirmedFrame % HASH_EVERY === 0) {
        const h = hashFight(st);
        this.mine.set(this.confirmedFrame, h);
        this.hooks.send({ t: "hash", frame: this.confirmedFrame, hash: h, seed: st.config.seed });
        const other = this.theirs.get(this.confirmedFrame);
        if (other !== undefined) {
          this.theirs.delete(this.confirmedFrame);
          this.compare(h, other);
        }
      }
    }
  }

  private compare(own: number, other: number): void {
    if (own === other) this.hashesChecked++;
    else this.fail();
  }

  private fail(): void {
    if (this.desynced) return;
    this.desynced = true;
    this.hooks.onDesync();
  }
}
