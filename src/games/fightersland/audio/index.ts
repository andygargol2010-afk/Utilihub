/**
 * Procedural WebAudio for Fightersland: one-shot SFX for every FightEvent, UI blips and a light
 * chiptune loop. Nothing is created until `unlock()` runs inside a user gesture, so the module
 * is SSR-safe and respects browser autoplay rules. No audio files are used.
 */
import type { FightEvent, MoveId } from "../core/types";

export type UiSound = "move" | "ok" | "back" | "pause" | "toggle";
export type MusicTrack = "menu" | "fight";

type Ctx = AudioContext;

const MOVE_WEIGHT: Record<MoveId, number> = { light: 0, medium: 1, heavy: 2, air: 1 };

/** Midi note → Hz. */
function mtof(n: number): number {
  return 440 * Math.pow(2, (n - 69) / 12);
}

// ---- music data: A minor, 4 bars of 16 steps per pattern; -1 = rest ----------------------
const PROG = [57, 53, 48, 55]; // A F C G (bass roots)
const CHORDS: readonly (readonly number[])[] = [
  [69, 72, 76],
  [65, 69, 72],
  [64, 67, 72],
  [62, 67, 71],
];
const LEAD_A = [
  76, -1, 74, 76, -1, 79, -1, 76, 74, -1, 72, -1, 74, -1, 72, 69,
  72, -1, 69, 72, -1, 77, -1, 76, 74, -1, 72, -1, 69, -1, -1, -1,
  76, -1, 74, 72, -1, 72, -1, 76, 79, -1, 77, -1, 76, -1, 72, -1,
  74, -1, -1, 71, -1, 74, -1, 79, 78, -1, 79, -1, 74, -1, -1, -1,
];
const LEAD_B = [
  81, -1, -1, 79, -1, 76, -1, -1, 77, -1, 76, -1, 72, -1, 74, -1,
  77, -1, -1, 76, -1, 72, -1, -1, 74, -1, 72, -1, 69, -1, -1, -1,
  79, -1, -1, 76, -1, 72, -1, 76, 79, -1, 84, -1, 83, -1, 79, -1,
  78, -1, 79, -1, 83, -1, 79, -1, 74, -1, 71, -1, 74, -1, -1, -1,
];

export class AudioEngine {
  private ctx: Ctx | null = null;
  private master: GainNode | null = null;
  private sfx: GainNode | null = null;
  private musicBus: GainNode | null = null;
  private noise: AudioBuffer | null = null;
  private soundOn = true;
  private musicOn = true;
  private track: MusicTrack | null = null;
  private musicHeld = false;
  private timer: ReturnType<typeof setInterval> | null = null;
  private step = 0;
  private nextTime = 0;
  private lastHitAt = 0;

  /** Create / resume the context. Must be called from a user gesture handler. */
  unlock(): void {
    try {
      if (!this.ctx) {
        const W = window as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext };
        const C = W.AudioContext ?? W.webkitAudioContext;
        if (!C) return;
        const ctx = new C();
        this.ctx = ctx;
        const comp = ctx.createDynamicsCompressor();
        comp.threshold.value = -14;
        comp.ratio.value = 4;
        const master = ctx.createGain();
        master.gain.value = 0.8;
        master.connect(comp);
        comp.connect(ctx.destination);
        const sfx = ctx.createGain();
        sfx.gain.value = this.soundOn ? 1 : 0;
        sfx.connect(master);
        const music = ctx.createGain();
        music.gain.value = this.musicOn && this.soundOn ? 0.16 : 0;
        music.connect(master);
        this.master = master;
        this.sfx = sfx;
        this.musicBus = music;
        const len = Math.floor(ctx.sampleRate * 1.5);
        const buf = ctx.createBuffer(1, len, ctx.sampleRate);
        const d = buf.getChannelData(0);
        let seed = 12345;
        for (let i = 0; i < len; i++) {
          seed = (seed * 1103515245 + 12345) & 0x7fffffff;
          d[i] = (seed / 0x7fffffff) * 2 - 1;
        }
        this.noise = buf;
      }
      if (this.ctx.state === "suspended") void this.ctx.resume();
      this.syncMusic();
    } catch {
      this.ctx = null;
    }
  }

  get unlocked(): boolean {
    return this.ctx !== null;
  }

  setSound(on: boolean): void {
    this.soundOn = on;
    this.applyGains();
  }

  setMusic(on: boolean): void {
    this.musicOn = on;
    this.applyGains();
    this.syncMusic();
  }

  private applyGains(): void {
    const ctx = this.ctx;
    if (!ctx || !this.sfx || !this.musicBus) return;
    const t = ctx.currentTime;
    this.sfx.gain.setTargetAtTime(this.soundOn ? 1 : 0, t, 0.02);
    this.musicBus.gain.setTargetAtTime(this.musicOn && this.soundOn ? 0.16 : 0, t, 0.05);
  }

  /** Select the music loop (null = silence). */
  playMusic(track: MusicTrack | null): void {
    if (this.track === track) return;
    this.track = track;
    this.step = 0;
    this.syncMusic();
  }

  /** Hold the music (pause menu) without forgetting the track. */
  holdMusic(held: boolean): void {
    this.musicHeld = held;
    this.syncMusic();
  }

  /** Suspend everything while the page is hidden. */
  setHidden(hidden: boolean): void {
    const ctx = this.ctx;
    if (!ctx) return;
    try {
      if (hidden) void ctx.suspend();
      else void ctx.resume();
    } catch {
      // ignore
    }
  }

  dispose(): void {
    if (this.timer !== null) clearInterval(this.timer);
    this.timer = null;
    const ctx = this.ctx;
    this.ctx = null;
    if (ctx) void ctx.close().catch(() => undefined);
  }

  // ---- primitives ---------------------------------------------------------------------------

  private env(g: GainNode, t: number, vol: number, attack: number, dur: number): void {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(vol, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  }

  private tone(
    type: OscillatorType,
    f0: number,
    f1: number,
    dur: number,
    vol: number,
    delay = 0,
    bus: GainNode | null = this.sfx,
    attack = 0.004,
  ): void {
    const ctx = this.ctx;
    if (!ctx || !bus) return;
    const t = ctx.currentTime + delay;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f0, t);
    if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(Math.max(1, f1), t + dur);
    this.env(g, t, vol, attack, dur);
    o.connect(g);
    g.connect(bus);
    o.start(t);
    o.stop(t + dur + 0.05);
  }

  private hiss(
    filter: BiquadFilterType,
    f0: number,
    f1: number,
    dur: number,
    vol: number,
    delay = 0,
    q = 1,
    attack = 0.003,
    bus: GainNode | null = this.sfx,
  ): void {
    const ctx = this.ctx;
    if (!ctx || !bus || !this.noise) return;
    const t = ctx.currentTime + delay;
    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    const bf = ctx.createBiquadFilter();
    bf.type = filter;
    bf.Q.value = q;
    bf.frequency.setValueAtTime(f0, t);
    if (f1 !== f0) bf.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
    const g = ctx.createGain();
    this.env(g, t, vol, attack, dur);
    src.connect(bf);
    bf.connect(g);
    g.connect(bus);
    const offset = Math.random() * 0.8;
    src.start(t, offset);
    src.stop(t + dur + 0.05);
  }

  // ---- sound design ---------------------------------------------------------------------------

  ui(kind: UiSound): void {
    if (!this.ctx) return;
    switch (kind) {
      case "move":
        this.tone("square", 880, 880, 0.04, 0.05);
        break;
      case "ok":
        this.tone("square", 660, 660, 0.05, 0.06);
        this.tone("square", 990, 990, 0.08, 0.06, 0.05);
        break;
      case "back":
        this.tone("square", 520, 330, 0.09, 0.05);
        break;
      case "pause":
        this.tone("triangle", 784, 784, 0.07, 0.1);
        this.tone("triangle", 523, 523, 0.1, 0.1, 0.07);
        break;
      case "toggle":
        this.tone("square", 740, 1100, 0.06, 0.05);
        break;
    }
  }

  private whoosh(move: MoveId, charge: number): void {
    const w = MOVE_WEIGHT[move] + charge * 0.6;
    const dur = 0.09 + w * 0.05;
    this.hiss("bandpass", 2600 - w * 500, 500 - w * 80, dur, 0.18 + w * 0.05, 0, 1.4, 0.01);
    if (charge > 0) this.tone("sawtooth", 220 + charge * 60, 90, dur + 0.05, 0.05);
  }

  private hit(move: MoveId, charge: number, combo: number, launch: boolean): void {
    const ctx = this.ctx;
    if (!ctx) return;
    // avoid stacking several hits on the same audio frame
    if (ctx.currentTime - this.lastHitAt < 0.015) return;
    this.lastHitAt = ctx.currentTime;
    const w = Math.min(3, MOVE_WEIGHT[move] + charge * 0.7);
    const lift = Math.min(6, Math.max(0, combo - 1)) * 0.04;
    this.hiss("highpass", 3000 - w * 600, 1200, 0.05 + w * 0.025, 0.35 + w * 0.05);
    this.hiss("lowpass", 1600, 200, 0.1 + w * 0.06, 0.3 + w * 0.12);
    this.tone("sine", (190 - w * 30) * (1 + lift), 45, 0.12 + w * 0.06, 0.45 + w * 0.1);
    if (w >= 2) this.tone("square", 140, 50, 0.16 + w * 0.04, 0.12);
    if (launch) this.hiss("bandpass", 600, 2400, 0.25, 0.12, 0.04, 2, 0.02);
  }

  private block(move: MoveId): void {
    const w = MOVE_WEIGHT[move];
    this.tone("square", 1250 - w * 120, 1100 - w * 120, 0.07, 0.07);
    this.tone("triangle", 1870 - w * 150, 1700, 0.12, 0.08);
    this.hiss("highpass", 4200, 3000, 0.06, 0.18);
    this.tone("sine", 220, 120, 0.08, 0.2);
  }

  private parry(): void {
    this.tone("sine", 1560, 2340, 0.08, 0.2);
    this.tone("triangle", 2340, 2340, 0.3, 0.12, 0.04);
    this.tone("triangle", 3120, 3120, 0.25, 0.06, 0.08);
    this.hiss("highpass", 6000, 6000, 0.05, 0.12);
  }

  private guardBreak(): void {
    this.hiss("highpass", 5000, 1500, 0.35, 0.35);
    this.tone("square", 900, 90, 0.4, 0.14);
    this.tone("sine", 160, 40, 0.3, 0.5);
    for (let i = 0; i < 4; i++) this.tone("triangle", 2000 + i * 430, 1800 + i * 300, 0.08, 0.05, 0.03 * i);
  }

  private dodge(): void {
    this.hiss("bandpass", 500, 3200, 0.16, 0.16, 0, 1.2, 0.03);
    this.tone("sine", 300, 600, 0.12, 0.04);
  }

  private ko(final: boolean): void {
    this.tone("sine", 110, 28, 1.3, 0.7);
    this.tone("square", 220, 55, 0.6, 0.12);
    this.hiss("lowpass", 2400, 80, 1.4, 0.5, 0, 0.7, 0.005);
    this.hiss("highpass", 5000, 2000, 0.25, 0.25);
    if (final) this.tone("triangle", 880, 220, 0.9, 0.08, 0.1);
  }

  private gong(): void {
    const base = 98;
    const partials = [1, 2.01, 2.76, 3.93, 5.4];
    partials.forEach((p, i) => this.tone("sine", base * p, base * p * 0.995, 1.8 - i * 0.25, 0.22 / (i + 1), 0, this.sfx, 0.006));
    this.hiss("lowpass", 900, 200, 0.4, 0.08);
  }

  private fightStab(): void {
    for (const n of [57, 64, 69, 76]) this.tone("square", mtof(n), mtof(n), 0.32, 0.06, 0, this.sfx, 0.005);
    this.hiss("highpass", 3000, 2000, 0.2, 0.15);
    this.tone("sine", 140, 50, 0.25, 0.4);
  }

  private buzzer(): void {
    this.tone("square", 196, 196, 0.22, 0.12);
    this.tone("square", 147, 147, 0.4, 0.12, 0.26);
  }

  private finisherStart(): void {
    this.hiss("lowpass", 120, 900, 0.9, 0.35, 0, 1, 0.6);
    this.tone("sawtooth", 55, 55, 0.9, 0.08, 0, this.sfx, 0.5);
    this.tone("sine", 41, 41, 1, 0.3, 0, this.sfx, 0.4);
    this.tone("triangle", 440, 1760, 0.8, 0.04, 0.1, this.sfx, 0.5);
  }

  private finisherHit(final: boolean): void {
    if (!final) {
      this.hit("heavy", 1, 1, false);
      return;
    }
    this.tone("sine", 160, 26, 1.6, 0.8);
    this.tone("square", 330, 40, 0.8, 0.15);
    this.hiss("lowpass", 5000, 60, 1.8, 0.6, 0, 0.7, 0.003);
    this.hiss("highpass", 7000, 3000, 0.5, 0.3);
    for (const n of [69, 76, 81]) this.tone("triangle", mtof(n), mtof(n), 1.2, 0.05, 0.2, this.sfx, 0.01);
  }

  private fanfare(): void {
    const notes = [69, 72, 76, 81, 79, 81];
    const times = [0, 0.12, 0.24, 0.36, 0.6, 0.72];
    notes.forEach((n, i) => {
      const d = times[i] ?? 0;
      const len = i === notes.length - 1 ? 0.7 : 0.16;
      this.tone("square", mtof(n), mtof(n), len, 0.07, d, this.sfx, 0.005);
      this.tone("triangle", mtof(n - 12), mtof(n - 12), len, 0.1, d, this.sfx, 0.005);
    });
  }

  /** Play the sounds for one tick's events. */
  onEvents(events: readonly FightEvent[]): void {
    if (!this.ctx || !this.soundOn || events.length === 0) return;
    for (const e of events) {
      switch (e.type) {
        case "roundIntro":
          this.gong();
          break;
        case "fight":
          this.fightStab();
          break;
        case "whoosh":
          this.whoosh(e.move, e.charge);
          break;
        case "charge":
          if (e.level === 1) this.tone("square", 330, 660, 0.14, 0.06);
          else {
            this.tone("square", 495, 990, 0.12, 0.07);
            this.tone("triangle", 1320, 1320, 0.25, 0.06, 0.1);
          }
          break;
        case "hit":
          this.hit(e.move, e.charge, e.combo, e.launch);
          break;
        case "block":
          this.block(e.move);
          break;
        case "parry":
          this.parry();
          break;
        case "guardBreak":
          this.guardBreak();
          break;
        case "dodge":
          this.dodge();
          break;
        case "jump":
          this.tone("square", 260, 520, 0.07, 0.04);
          break;
        case "land":
          this.hiss("lowpass", 600, 150, 0.07, 0.12);
          break;
        case "knockdown":
          this.hiss("lowpass", 900, 90, 0.25, 0.35);
          this.tone("sine", 90, 40, 0.2, 0.35);
          break;
        case "ko":
          this.ko(e.final);
          break;
        case "timeUp":
          this.buzzer();
          break;
        case "roundEnd":
          break;
        case "finisherStart":
          this.finisherStart();
          break;
        case "finisherHit":
          this.finisherHit(e.final);
          break;
        case "matchEnd":
          this.fanfare();
          break;
      }
    }
  }

  // ---- music --------------------------------------------------------------------------------

  private syncMusic(): void {
    const want = this.ctx !== null && this.track !== null && this.musicOn && !this.musicHeld;
    if (want && this.timer === null) {
      const ctx = this.ctx;
      if (!ctx) return;
      this.nextTime = ctx.currentTime + 0.08;
      this.timer = setInterval(() => this.schedule(), 25);
    } else if (!want && this.timer !== null) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  private schedule(): void {
    const ctx = this.ctx;
    const track = this.track;
    if (!ctx || !track || ctx.state !== "running") return;
    const bpm = track === "fight" ? 138 : 104;
    const stepDur = 60 / bpm / 4;
    // if the tab stalled, skip ahead instead of firing a burst of notes
    if (this.nextTime < ctx.currentTime - 0.2) this.nextTime = ctx.currentTime + 0.05;
    while (this.nextTime < ctx.currentTime + 0.12) {
      this.playStep(track, this.step, this.nextTime - ctx.currentTime, stepDur);
      this.step = (this.step + 1) % 128;
      this.nextTime += stepDur;
    }
  }

  private playStep(track: MusicTrack, step: number, delay: number, sd: number): void {
    const bus = this.musicBus;
    if (!bus) return;
    const s16 = step % 16;
    const bar = Math.floor(step / 16) % 4;
    const half = Math.floor(step / 64);
    const root = PROG[bar] ?? 57;
    const chord = CHORDS[bar] ?? CHORDS[0] ?? [69, 72, 76];
    if (track === "fight") {
      // driving octave bass
      if (s16 % 2 === 0) {
        const n = s16 % 4 === 0 ? root - 12 : root;
        this.tone("triangle", mtof(n), mtof(n), sd * 1.6, 0.5, delay, bus, 0.003);
      }
      if (s16 % 4 === 0) this.tone("sine", 150, 40, 0.12, 0.7, delay, bus, 0.002);
      if (s16 % 8 === 4) this.hiss("bandpass", 1800, 900, 0.1, 0.35, delay, 0.9, 0.002, bus);
      if (s16 % 2 === 1) this.hiss("highpass", 8000, 8000, 0.03, 0.12, delay, 1, 0.001, bus);
      const lead = (half === 0 ? LEAD_A : LEAD_B)[(step % 64)] ?? -1;
      if (lead > 0) this.tone("square", mtof(lead), mtof(lead), sd * 1.8, 0.11, delay, bus, 0.004);
    } else {
      if (s16 === 0 || s16 === 10) this.tone("triangle", mtof(root - 12), mtof(root - 12), sd * 5, 0.45, delay, bus, 0.01);
      const arp = chord[s16 % 3] ?? 69;
      if (s16 % 2 === 0) this.tone("square", mtof(arp), mtof(arp), sd * 1.2, 0.05, delay, bus, 0.004);
      if (s16 % 4 === 2) this.hiss("highpass", 9000, 9000, 0.025, 0.06, delay, 1, 0.001, bus);
      const lead = (half === 0 ? LEAD_A : LEAD_B)[(step % 64)] ?? -1;
      if (lead > 0 && s16 % 2 === 0) this.tone("triangle", mtof(lead), mtof(lead), sd * 3, 0.16, delay, bus, 0.01);
    }
  }
}
