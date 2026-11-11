/**
 * GameApp: the non-React core of the shell. Owns the fixed-step loop, the current fight (real
 * or the attract-mode demo behind the menus), the input sources, audio, settings and the UI
 * state that the React screens render from (exposed as a tiny external store).
 */
import type {
  AiController,
  AiLevel,
  CharId,
  FightConfig,
  FightMode,
  FightState,
  InputFrame,
  Locale,
  MapId,
  PlayerIndex,
  Renderer,
  Settings,
  TutorialController,
} from "../core/types";
import { CHAR_IDS, MAP_IDS, neutralInput } from "../core/constants";
import { createFight, stepFight } from "../sim/index";
import { createAi } from "../ai/index";
import { createTutorial } from "../tutorial/index";
import { createRenderer } from "../render/index";
import { prewarmFighters } from "../render/fighters/index";
import { trackEvent } from "@/lib/analytics";
import { getStrings } from "../i18n";
import type { DeviceKind, Strings } from "../i18n";
import { AudioEngine } from "../audio/index";
import { KeyboardSource } from "../input/keyboard";
import { GamepadSource } from "../input/gamepad";
import { TouchState } from "../input/touch";
import { clearFrame, isButton, mergeFrame } from "../input/bindings";
import type { Button, MenuIntent } from "../input/bindings";
import { defaultSettings, loadSettings, saveSettings } from "./settings";
import { hostRoom, joinRoom } from "../net/link";
import type { Connecting, LinkError, LinkHandlers, NetLink } from "../net/link";
import { DEFAULT_SIGNAL_URL } from "../net/signal";
import { NetSession } from "../net/session";
import type { SessionStats } from "../net/session";
import { cleanRoomCode, decodeMsg, defaultRoomSettings, encodeMsg, isRoomCode, onlineFightConfig, packInput, randomRoomCode } from "../net/protocol";
import type { NetMsg, RoomSettings } from "../net/protocol";

export type Screen =
  | "title"
  | "firstVisit"
  | "mode"
  | "select"
  | "map"
  | "fight"
  | "result"
  | "tutorialDone"
  | "controls"
  | "options"
  | "online";

export const SCREENS: readonly Screen[] = [
  "title",
  "firstVisit",
  "mode",
  "select",
  "map",
  "fight",
  "result",
  "tutorialDone",
  "controls",
  "options",
  "online",
];

export type Pick = CharId | "random";

export interface ResultInfo {
  winner: PlayerIndex;
  wins: [number, number];
  chars: [CharId, CharId];
  mode: FightMode;
}

export interface TutorialInfo {
  index: number;
  total: number;
  progress: number;
}

export type OnlineNotice = "notFound" | "failed" | "timeout" | "disconnected" | "desync" | "rivalLeft";

/** Online lobby / match state rendered by the online screens. */
export interface OnlineUi {
  /** "menu": create / join. "host": waiting for a guest. "join": code entry. "room": connected. */
  view: "menu" | "host" | "join" | "room";
  role: "host" | "guest" | null;
  /** Player index of this device (host 0, guest 1). */
  local: PlayerIndex;
  code: string;
  status: "idle" | "connecting" | "waiting" | "connected";
  notice: OnlineNotice | null;
  settings: RoomSettings;
  myPick: CharId | null;
  rivalPick: CharId | null;
  /** The start message went out / arrived: the match begins in a moment. */
  starting: boolean;
  rematchMe: boolean;
  rematchRival: boolean;
  /** Smoothed round trip in ms (null until measured). */
  rtt: number | null;
}

export interface UiState {
  screen: Screen;
  /** Screen to return to from "controls" / "options". */
  back: Screen;
  mode: FightMode;
  picks: [Pick | null, Pick | null];
  slot: PlayerIndex;
  paused: boolean;
  pauseView: "main" | "controls";
  result: ResultInfo | null;
  tutorial: TutorialInfo | null;
  device: DeviceKind;
  /** Show touch controls (coarse pointer or a touch happened). */
  touch: boolean;
  settings: Settings;
  /** Resolved fighters of the current / last match. */
  chars: [CharId, CharId];
  /** Online play (null outside it). */
  online: OnlineUi | null;
}

/** Ticks of the winner's pose before the result screen appears. */
const RESULT_DELAY = 150;
/** Demo matches restart this long after they end. */
const DEMO_RESTART = 200;
const STEP_MS = 1000 / 60;
/** Delay between the host sending `start` and the first frame, so both peers begin together. */
const ONLINE_START_MS = 700;
/** The rival is considered gone after this long without any message. */
const ONLINE_SILENCE_MS = 5000;

export interface NetDebugInfo extends SessionStats {
  role: "host" | "guest" | null;
  local: PlayerIndex;
  rtt: number | null;
  config: FightConfig | null;
  confirmed: FightState | null;
}

export interface DebugApi {
  start(config?: Partial<FightConfig>): void;
  state(): FightState | null;
  press(player: PlayerIndex, button: Button): void;
  release(player: PlayerIndex, button: Button): void;
  releaseAll(): void;
  goto(screen: Screen): void;
  setSpeed(n: number): void;
  ui(): UiState;
  /** Online session internals (null when no online match is running). */
  net(): NetDebugInfo | null;
}

function randomSeed(): number {
  return Math.floor(Math.random() * 0x7fffffff) >>> 0;
}

function randomOf<T>(list: readonly T[], fallback: T): T {
  return list[Math.floor(Math.random() * list.length)] ?? fallback;
}

export class GameApp {
  readonly locale: Locale;
  readonly strings: Strings;
  readonly keyboard = new KeyboardSource();
  readonly gamepad = new GamepadSource();
  readonly touchState = new TouchState();
  readonly audio = new AudioEngine();
  debug = false;

  private ui: UiState;
  private readonly listeners = new Set<() => void>();
  private menuHandler: ((intent: MenuIntent) => void) | null = null;

  private ctx: CanvasRenderingContext2D | null = null;
  private renderer: Renderer | null = null;
  private fight: FightState | null = null;
  private real = false;
  private ais: [AiController | null, AiController | null] = [null, null];
  private tutorial: TutorialController | null = null;
  private lastConfig: FightConfig | null = null;
  private matchEndTracked = false;

  private isOpen = false;
  private initialized = false;
  private raf = 0;
  private lastT = 0;
  private acc = 0;
  private dirty = true;
  private drawSkip = 0;
  private speed = 1;
  private fpsFrames = 0;
  private fpsT = 0;
  fps = 0;

  private readonly human: [InputFrame, InputFrame] = [neutralInput(), neutralInput()];
  private readonly virt: [InputFrame, InputFrame] = [neutralInput(), neutralInput()];
  private readonly pair: [InputFrame, InputFrame] = [neutralInput(), neutralInput()];
  private readonly neutral: InputFrame = neutralInput();

  // online
  private link: NetLink | null = null;
  private connecting: Connecting | null = null;
  private session: NetSession | null = null;
  private earlyMsgs: NetMsg[] | null = null;
  private netEpoch = 0;
  private netTimer = 0;
  private startTimer = 0;
  private lastRecv = 0;
  private pingId = 0;
  private readonly pingSent = new Map<number, number>();
  private rtt = 0;
  private hostTries = 0;
  private signalUrl = DEFAULT_SIGNAL_URL;
  private lagMs: readonly [number, number] | null = null;
  private pendingRoom: string | null = null;
  private linkRoom: string | null = null;
  private bgWorker: Worker | null = null;
  private bgInterval = 0;
  private bgT = 0;
  private readonly netInput: InputFrame = neutralInput();

  constructor(locale: Locale) {
    this.locale = locale;
    this.strings = getStrings(locale);
    this.ui = {
      screen: "title",
      back: "title",
      mode: "ai",
      picks: [null, null],
      slot: 0,
      paused: false,
      pauseView: "main",
      result: null,
      tutorial: null,
      device: "keyboard",
      touch: false,
      settings: defaultSettings(),
      chars: ["asagiri", "grimvald"],
      online: null,
    };
  }

  // ---- store --------------------------------------------------------------------------------

  readonly subscribe = (fn: () => void): (() => void) => {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  };

  readonly getUi = (): UiState => this.ui;

  private set(patch: Partial<UiState>): void {
    const prev = this.ui;
    this.ui = { ...prev, ...patch };
    if (patch.screen !== undefined && patch.screen !== prev.screen) this.onScreenChange(prev.screen);
    for (const fn of this.listeners) fn();
  }

  setMenuHandler(fn: ((intent: MenuIntent) => void) | null): void {
    this.menuHandler = fn;
  }

  // ---- lifecycle ------------------------------------------------------------------------------

  /** Browser-only setup (settings, device detection, debug flag). Idempotent. */
  init(): void {
    if (this.initialized) return;
    this.initialized = true;
    const settings = loadSettings();
    let touch = false;
    try {
      touch = window.matchMedia("(pointer: coarse)").matches;
    } catch {
      touch = false;
    }
    try {
      const q = new URLSearchParams(window.location.search);
      this.debug = q.get("fldebug") === "1";
      const room = cleanRoomCode(q.get("room") ?? "");
      this.pendingRoom = isRoomCode(room) ? room : null;
      if (this.debug) {
        // test hooks: a local signaling server and artificial latency on received messages
        const sig = q.get("flsignal");
        if (sig && /^wss?:\/\//.test(sig)) this.signalUrl = sig;
        const lag = /^(\d{1,4})-(\d{1,4})$/.exec(q.get("fllag") ?? "");
        if (lag) this.lagMs = [Number(lag[1]), Math.max(Number(lag[1]), Number(lag[2]))];
      }
    } catch {
      this.debug = false;
    }
    this.audio.setSound(settings.sound);
    this.audio.setMusic(settings.music);
    this.set({ settings, touch, device: touch ? "touch" : "keyboard" });
    if (this.debug) this.installDebug();
  }

  attachCanvas(canvas: HTMLCanvasElement | null): void {
    if (!canvas) {
      this.ctx = null;
      return;
    }
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;
    this.ctx = ctx;
    this.dirty = true;
    if (!this.renderer) {
      this.renderer = createRenderer({
        labels: this.strings.labels,
        reducedFlash: this.ui.settings.reducedFlash,
        debug: this.debug,
      });
    }
    if (!this.fight) this.startDemo();
  }

  open(): void {
    this.init();
    if (this.isOpen) return;
    this.isOpen = true;
    this.keyboard.attach({
      inFight: () => this.ui.screen === "fight" && !this.ui.paused,
      onMenu: (intent) => this.intent(intent),
      onPause: () => this.pause(),
      onAnyKey: () => {
        if (this.ui.device !== "keyboard") this.set({ device: "keyboard" });
        this.audio.unlock();
      },
    });
    window.addEventListener("blur", this.onBlur);
    document.addEventListener("visibilitychange", this.onVisibility);
    window.addEventListener("pointerdown", this.onPointer, true);
    this.lastT = 0;
    this.acc = 0;
    this.raf = requestAnimationFrame(this.frame);
    this.syncMusic();
    // shared link (?room=CODE): straight into joining that room
    const room = this.pendingRoom;
    this.pendingRoom = null;
    if (room) {
      this.linkRoom = room;
      this.joinOnline(room);
    }
  }

  close(): void {
    if (!this.isOpen) return;
    const o = this.ui.online;
    if (o) {
      // closed while still joining from a shared link: join again when the stage reopens
      if (o.view === "join" && o.status === "connecting" && o.code === this.linkRoom) this.pendingRoom = o.code;
      this.leaveOnline();
    }
    if (this.ui.screen === "fight" && this.real && !this.ui.paused) this.pause();
    this.isOpen = false;
    this.keyboard.detach();
    this.touchState.clear();
    window.removeEventListener("blur", this.onBlur);
    document.removeEventListener("visibilitychange", this.onVisibility);
    window.removeEventListener("pointerdown", this.onPointer, true);
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
    this.audio.playMusic(null);
  }

  dispose(): void {
    this.close();
    this.audio.dispose();
    this.ctx = null;
    this.initialized = false;
    if (this.debug) {
      const w = window as unknown as { __FL__?: DebugApi };
      delete w.__FL__;
    }
  }

  private readonly onBlur = (): void => {
    this.keyboard.releaseAll();
    this.touchState.clear();
    this.autoPause();
  };

  private readonly onVisibility = (): void => {
    const hidden = document.visibilityState === "hidden";
    this.audio.setHidden(hidden);
    if (hidden) {
      this.keyboard.releaseAll();
      this.touchState.clear();
      this.autoPause();
    }
    this.syncBackground();
    this.lastT = 0;
  };

  private readonly onPointer = (e: PointerEvent): void => {
    this.audio.unlock();
    if (e.pointerType === "touch") {
      if (!this.ui.touch || this.ui.device !== "touch") this.set({ touch: true, device: "touch" });
    } else if (e.pointerType === "mouse" && this.ui.device === "touch") {
      this.set({ device: "keyboard" });
    }
  };

  private autoPause(): void {
    // an online match cannot be paused: it keeps running with neutral inputs
    if (this.session) return;
    const f = this.fight;
    if (this.ui.screen === "fight" && this.real && f && f.phase !== "matchEnd" && !this.ui.paused) this.pause();
  }

  // ---- loop -----------------------------------------------------------------------------------

  private readonly frame = (t: number): void => {
    this.raf = requestAnimationFrame(this.frame);
    const dt = this.lastT === 0 ? STEP_MS : Math.min(250, t - this.lastT);
    this.lastT = t;
    this.fpsFrames++;
    if (t - this.fpsT >= 1000) {
      this.fps = Math.round((this.fpsFrames * 1000) / Math.max(1, t - this.fpsT));
      this.fpsFrames = 0;
      this.fpsT = t;
    }

    if (this.gamepad.poll((intent) => this.intent(intent))) {
      if (this.ui.device !== "pad") this.set({ device: "pad" });
    }

    // Battery: on touch devices the attract demo behind the menus is frozen after a short
    // warm-up, and the frame is only redrawn when the simulation advanced.
    const frozenDemo = !this.real && this.ui.touch && this.fight !== null && this.fight.tick > 150;
    let advanced = 0;
    if (this.fight && this.isRunning() && !frozenDemo) {
      this.acc += dt * this.speed;
      const maxTicks = Math.max(5, Math.ceil(5 * this.speed));
      let n = 0;
      while (this.acc >= STEP_MS && n < maxTicks) {
        this.acc -= STEP_MS;
        this.tick();
        n++;
      }
      if (n >= maxTicks) this.acc = 0;
      advanced = n;
    } else {
      this.acc = 0;
    }

    // Draw only when something changed. Phones (and the demo everywhere) present at 30 fps:
    // the simulation stays at 60 Hz, so input timing is unchanged.
    if (advanced > 0) {
      this.drawSkip++;
      const half = this.ui.touch || !this.real;
      if (!half || this.drawSkip >= 2) this.dirty = true;
    }
    // online: effects came from the confirmed ticks; what is drawn is the predicted state
    if (this.session && advanced > 0) this.fight = this.session.predicted();
    const ctx = this.ctx;
    if (this.dirty && ctx && this.renderer && this.fight) {
      this.dirty = false;
      this.drawSkip = 0;
      this.renderer.draw(ctx, this.fight);
    }
  };

  private isRunning(): boolean {
    if (!this.real || this.session) return true;
    return !this.ui.paused;
  }

  private readHuman(p: PlayerIndex, out: InputFrame): void {
    clearFrame(out);
    const mode = this.fight?.config.mode ?? "ai";
    if (mode === "online") {
      // every local device drives the local player
      this.keyboard.read(1, out);
      this.keyboard.read(2, out);
      for (let i = 0; i < this.gamepad.count; i++) {
        const pad = this.gamepad.frame(i);
        if (pad) mergeFrame(out, pad);
      }
      this.touchState.read(out);
    } else if (mode === "versus") {
      this.keyboard.read(p === 0 ? 1 : 2, out);
      const pad = this.gamepad.frame(p);
      if (pad) mergeFrame(out, pad);
      if (p === 0) this.touchState.read(out);
    } else if (p === 0) {
      this.keyboard.read(1, out);
      this.keyboard.read(2, out);
      for (let i = 0; i < this.gamepad.count; i++) {
        const pad = this.gamepad.frame(i);
        if (pad) mergeFrame(out, pad);
      }
      this.touchState.read(out);
    }
    mergeFrame(out, this.virt[p]);
  }

  private tick(): void {
    if (this.session) {
      this.tickOnline(this.session);
      return;
    }
    const st = this.fight;
    if (!st) return;
    const live = this.real && this.ui.screen === "fight";
    if (!this.real) {
      this.pair[0] = this.ais[0]?.next(st, 0) ?? this.neutral;
      this.pair[1] = this.ais[1]?.next(st, 1) ?? this.neutral;
    } else {
      if (live) this.readHuman(0, this.human[0]);
      else clearFrame(this.human[0]);
      this.pair[0] = this.human[0];
      const mode = st.config.mode;
      if (mode === "ai") {
        this.pair[1] = this.ais[1]?.next(st, 1) ?? this.neutral;
      } else if (mode === "tutorial") {
        this.pair[1] = this.tutorial ? this.tutorial.dummyInput(st) : this.neutral;
      } else {
        if (live) this.readHuman(1, this.human[1]);
        else clearFrame(this.human[1]);
        this.pair[1] = this.human[1];
      }
    }

    stepFight(st, this.pair);
    this.renderer?.update(st);

    if (!this.real) {
      if (st.phase === "matchEnd" && st.phaseFrame >= DEMO_RESTART) this.startDemo();
      return;
    }
    this.audio.onEvents(st.events);
    for (const e of st.events) {
      if (e.type === "matchEnd" && !this.matchEndTracked) {
        this.matchEndTracked = true;
        trackEvent("fightersland_match_end", {
          mode: st.config.mode,
          winner: e.winner === 0 ? "p1" : "p2",
          p1: st.config.chars[0],
          p2: st.config.chars[1],
          rounds: st.round,
        });
      }
    }
    const tut = this.tutorial;
    if (tut && st.config.mode === "tutorial") {
      tut.update(st);
      const index = tut.stepIndex();
      const total = tut.steps.length;
      const progress = Math.round(tut.progress() * 40) / 40;
      const cur = this.ui.tutorial;
      if (!cur || cur.index !== index || cur.progress !== progress) this.set({ tutorial: { index, total, progress } });
      if (index >= total && this.ui.screen === "fight") {
        this.updateSettings({ tutorialSeen: true });
        this.set({ screen: "tutorialDone" });
        this.audio.ui("ok");
      }
    }
    if (st.phase === "matchEnd" && st.phaseFrame >= RESULT_DELAY && this.ui.screen === "fight" && st.matchWinner !== null) {
      this.set({
        screen: "result",
        result: {
          winner: st.matchWinner,
          wins: [st.wins[0], st.wins[1]],
          chars: [st.config.chars[0], st.config.chars[1]],
          mode: st.config.mode,
        },
      });
    }
  }

  // ---- fights ---------------------------------------------------------------------------------

  private startDemo(): void {
    const a = randomOf(CHAR_IDS, "asagiri");
    let b = randomOf(CHAR_IDS, "grimvald");
    if (b === a) b = randomOf(CHAR_IDS, "maelis");
    const config: FightConfig = {
      chars: [a, b],
      map: randomOf(MAP_IDS, "quay"),
      mode: "ai",
      aiLevel: "hard",
      seed: randomSeed(),
      roundsToWin: 2,
    };
    this.fight = createFight(config);
    this.real = false;
    this.tutorial = null;
    this.ais = [createAi("hard", randomSeed()), createAi("normal", randomSeed())];
    this.renderer?.setOptions({ labels: this.strings.labels });
    this.renderer?.reset();
  }

  /** Start a real match (from the menus, rematch, or the debug API). */
  startMatch(config: FightConfig): void {
    this.lastConfig = config;
    this.fight = createFight(config);
    this.real = true;
    this.matchEndTracked = false;
    this.tutorial = config.mode === "tutorial" ? createTutorial() : null;
    this.ais = [null, config.mode === "ai" ? createAi(config.aiLevel, config.seed ^ 0x5bd1e995) : null];
    this.renderer?.setOptions({ labels: this.labelsFor(config) });
    this.renderer?.reset();
    prewarmFighters([config.chars[0], config.chars[1]]);
    this.keyboard.markStale();
    this.touchState.clear();
    this.acc = 0;
    this.set({
      screen: "fight",
      mode: config.mode,
      paused: false,
      pauseView: "main",
      result: null,
      chars: [config.chars[0], config.chars[1]],
      tutorial: this.tutorial ? { index: 0, total: this.tutorial.steps.length, progress: 0 } : null,
    });
    trackEvent("fightersland_match_start", {
      mode: config.mode,
      p1: config.chars[0],
      p2: config.chars[1],
      map: config.map,
      level: config.aiLevel,
    });
  }

  /** HUD tags: online shows YOU / RIVAL on the side of each device's own fighter. */
  private labelsFor(config: FightConfig): Strings["labels"] {
    const base = this.strings.labels;
    const o = this.ui.online;
    if (config.mode !== "online" || !o) return base;
    const you = this.strings.online.you;
    const rival = this.strings.online.rival;
    return { ...base, p1: o.local === 0 ? you : rival, p2: o.local === 0 ? rival : you };
  }

  private dropRealFight(): void {
    this.session = null;
    this.syncBackground();
    if (!this.real) return;
    this.real = false;
    this.tutorial = null;
    this.startDemo();
  }

  // ---- UI actions -----------------------------------------------------------------------------

  private onScreenChange(prev: Screen): void {
    if (prev === "fight" || this.ui.screen === "fight") {
      this.keyboard.releaseAll();
      this.touchState.clear();
    }
    this.syncMusic();
  }

  private syncMusic(): void {
    if (!this.isOpen) return;
    const s = this.ui.screen;
    this.audio.playMusic(s === "fight" ? "fight" : "menu");
    this.audio.holdMusic(this.ui.paused);
  }

  updateSettings(patch: Partial<Settings>): void {
    const settings: Settings = { ...this.ui.settings, ...patch, version: 1 };
    saveSettings(settings);
    if (patch.sound !== undefined) this.audio.setSound(settings.sound);
    if (patch.music !== undefined) this.audio.setMusic(settings.music);
    if (patch.reducedFlash !== undefined) this.renderer?.setOptions({ reducedFlash: settings.reducedFlash });
    this.set({ settings });
  }

  sfx(kind: "move" | "ok" | "back" | "pause" | "toggle"): void {
    this.audio.unlock();
    this.audio.ui(kind);
  }

  /** Route a menu intent from the keyboard or a gamepad. */
  intent(intent: MenuIntent): void {
    this.audio.unlock();
    if (this.ui.screen === "fight" && !this.ui.paused) {
      if (intent === "pause") this.pause();
      return;
    }
    if (this.ui.screen === "fight" && this.ui.paused && intent === "pause") {
      this.resume();
      return;
    }
    this.menuHandler?.(intent);
  }

  goto(screen: Screen): void {
    if (screen === "fight") {
      if (!this.real) this.startMatch(this.defaultConfig());
      else this.set({ screen: "fight", paused: false });
      return;
    }
    if (this.ui.online && screen !== "select" && screen !== "online" && screen !== "result") this.leaveOnline();
    if (screen !== "result" && screen !== "tutorialDone") this.dropRealFight();
    if (screen === "select" && this.ui.online) {
      this.set({ screen, slot: this.ui.online.local, paused: false });
      return;
    }
    if (screen === "result" && !this.ui.result) {
      const f = this.fight;
      this.set({
        screen,
        result: {
          winner: f?.matchWinner ?? 0,
          wins: f ? [f.wins[0], f.wins[1]] : [2, 0],
          chars: f ? [f.config.chars[0], f.config.chars[1]] : this.ui.chars,
          mode: f?.config.mode ?? "ai",
        },
      });
      return;
    }
    if (screen === "select") {
      this.set({ screen, picks: [null, null], slot: 0, paused: false });
      return;
    }
    this.set({ screen, paused: false });
  }

  /** Title "PLAY": first visit offers the tutorial. */
  play(): void {
    this.goto(this.ui.settings.tutorialSeen ? "mode" : "firstVisit");
  }

  openSub(screen: "controls" | "options"): void {
    this.set({ screen, back: this.ui.screen === "controls" || this.ui.screen === "options" ? this.ui.back : this.ui.screen });
  }

  closeSub(): void {
    this.set({ screen: this.ui.back });
  }

  chooseMode(mode: FightMode, level?: AiLevel): void {
    if (level) this.updateSettings({ aiLevel: level });
    this.set({ mode, screen: "select", picks: [null, null], slot: 0 });
  }

  startTutorialFlow(): void {
    this.chooseMode("tutorial");
  }

  skipTutorial(): void {
    this.updateSettings({ tutorialSeen: true });
    this.dropRealFight();
    this.set({ screen: "mode", paused: false, tutorial: null });
  }

  pick(p: Pick): void {
    const ui = this.ui;
    if (ui.online) {
      this.onlinePick(p);
      return;
    }
    if (ui.slot === 0) {
      const picks: [Pick | null, Pick | null] = [p, null];
      if (p !== "random") this.updateSettings({ lastChar: p });
      if (ui.mode === "tutorial") {
        const me = p === "random" ? randomOf(CHAR_IDS, "asagiri") : p;
        const dummy: CharId = me === "grimvald" ? "asagiri" : "grimvald";
        this.set({ picks });
        this.startMatch({
          chars: [me, dummy],
          map: this.ui.settings.lastMap,
          mode: "tutorial",
          aiLevel: "easy",
          seed: randomSeed(),
          roundsToWin: 2,
        });
        return;
      }
      this.set({ picks, slot: 1 });
      return;
    }
    this.set({ picks: [ui.picks[0], p], screen: "map" });
  }

  /** "Back" on the select screen. */
  unpick(): void {
    if (this.ui.online) this.set({ screen: "online" });
    else if (this.ui.slot === 1) this.set({ slot: 0, picks: [null, null] });
    else this.set({ screen: "mode" });
  }

  pickMap(m: MapId | "random"): void {
    const map = m === "random" ? randomOf(MAP_IDS, "quay") : m;
    if (m !== "random") this.updateSettings({ lastMap: m });
    const [a, b] = this.ui.picks;
    const resolve = (p: Pick | null): CharId => (p === null || p === "random" ? randomOf(CHAR_IDS, "asagiri") : p);
    this.startMatch({
      chars: [resolve(a), resolve(b)],
      map,
      mode: this.ui.mode === "tutorial" ? "ai" : this.ui.mode,
      aiLevel: this.ui.settings.aiLevel,
      seed: randomSeed(),
      roundsToWin: 2,
    });
  }

  rematch(): void {
    if (this.ui.online) {
      this.onlineRematch();
      return;
    }
    const c = this.lastConfig;
    if (!c) {
      this.goto("mode");
      return;
    }
    this.startMatch({ ...c, chars: [c.chars[0], c.chars[1]], seed: randomSeed(), aiLevel: this.ui.settings.aiLevel });
  }

  changeFighters(): void {
    const mode = this.ui.mode === "tutorial" ? "ai" : this.ui.mode;
    this.dropRealFight();
    this.set({ screen: "select", mode, picks: [null, null], slot: 0, result: null });
  }

  /** After the tutorial: straight into a VS CPU match with the same fighter. */
  tutorialToCpu(): void {
    const me = this.ui.chars[0];
    this.dropRealFight();
    this.set({ mode: "ai", picks: [me, null], slot: 1, screen: "select", tutorial: null });
  }

  toMenu(): void {
    if (this.ui.online) this.leaveOnline();
    this.dropRealFight();
    this.set({ screen: "title", paused: false, result: null, tutorial: null });
  }

  pause(): void {
    if (this.ui.screen !== "fight" || !this.real || this.ui.paused) return;
    this.keyboard.releaseAll();
    this.touchState.clear();
    this.audio.ui("pause");
    this.set({ paused: true, pauseView: "main" });
    // online: "paused" is only the leave-match confirmation; the fight keeps running
    if (!this.session) this.audio.holdMusic(true);
  }

  resume(): void {
    if (!this.ui.paused) return;
    this.keyboard.markStale();
    this.acc = 0;
    this.lastT = 0;
    this.set({ paused: false, pauseView: "main" });
    this.audio.holdMusic(false);
  }

  setPauseView(view: "main" | "controls"): void {
    this.set({ pauseView: view });
  }

  restartFight(): void {
    const c = this.lastConfig;
    if (c) this.startMatch({ ...c, seed: randomSeed() });
  }

  currentFight(): FightState | null {
    return this.fight;
  }

  isReal(): boolean {
    return this.real;
  }

  private defaultConfig(): FightConfig {
    return {
      chars: [this.ui.settings.lastChar, this.ui.settings.lastChar === "grimvald" ? "asagiri" : "grimvald"],
      map: this.ui.settings.lastMap,
      mode: "ai",
      aiLevel: this.ui.settings.aiLevel,
      seed: randomSeed(),
      roundsToWin: 2,
    };
  }

  // ---- online ---------------------------------------------------------------------------------

  private freshOnline(view: OnlineUi["view"], notice: OnlineNotice | null = null): OnlineUi {
    return {
      view,
      role: null,
      local: 0,
      code: "",
      status: "idle",
      notice,
      settings: defaultRoomSettings(this.ui.settings.lastMap),
      myPick: null,
      rivalPick: null,
      starting: false,
      rematchMe: false,
      rematchRival: false,
      rtt: null,
    };
  }

  private patchOnline(patch: Partial<OnlineUi>): void {
    const o = this.ui.online;
    if (o) this.set({ online: { ...o, ...patch } });
  }

  /** Mode screen "ONLINE": the create / join menu. */
  openOnline(): void {
    this.closeNet(false);
    this.dropRealFight();
    this.set({ screen: "online", mode: "online", paused: false, result: null, online: this.freshOnline("menu") });
  }

  /** Create a room and wait for a guest (a taken code is silently replaced by another one). */
  hostOnline(): void {
    this.closeNet(false);
    this.hostTries = 0;
    this.tryHost();
  }

  private tryHost(): void {
    const code = randomRoomCode();
    const epoch = ++this.netEpoch;
    this.set({
      screen: "online",
      mode: "online",
      online: { ...this.freshOnline("host"), role: "host", local: 0, code, status: "connecting" },
    });
    this.connecting = hostRoom(
      code,
      {
        ...this.linkHandlers(epoch),
        onReady: () => {
          if (epoch === this.netEpoch) this.patchOnline({ status: "waiting" });
        },
        onError: (kind) => {
          if (epoch !== this.netEpoch) return;
          this.connecting = null;
          if (kind === "taken" && this.hostTries++ < 5) this.tryHost();
          else this.patchOnline({ status: "idle", notice: "failed" });
        },
      },
      { signalUrl: this.signalUrl, lagMs: this.lagMs },
    );
  }

  /** Show the code entry (prefilled when a code is given, e.g. from a shared link) and connect. */
  joinOnline(code?: string): void {
    this.closeNet(false);
    this.dropRealFight();
    const clean = cleanRoomCode(code ?? "");
    this.set({
      screen: "online",
      mode: "online",
      paused: false,
      result: null,
      online: { ...this.freshOnline("join"), role: "guest", local: 1, code: clean },
    });
    if (!isRoomCode(clean)) return;
    const epoch = ++this.netEpoch;
    this.patchOnline({ status: "connecting", notice: null });
    this.connecting = joinRoom(
      clean,
      {
        ...this.linkHandlers(epoch),
        onError: (kind: LinkError) => {
          if (epoch !== this.netEpoch) return;
          this.connecting = null;
          this.patchOnline({ status: "idle", notice: kind === "notFound" ? "notFound" : kind === "timeout" ? "timeout" : "failed" });
        },
      },
      { signalUrl: this.signalUrl, lagMs: this.lagMs },
    );
  }

  /** Stop a join attempt and stay on the code entry. */
  cancelJoin(): void {
    const o = this.ui.online;
    if (!o || o.view !== "join") return;
    this.closeNet(false);
    this.patchOnline({ status: "idle", notice: null });
  }

  private linkHandlers(epoch: number): LinkHandlers {
    return {
      onOpen: (link) => {
        if (epoch !== this.netEpoch) {
          link.close();
          return;
        }
        this.connecting = null;
        this.onLinked(link);
      },
      onMessage: (text) => {
        if (epoch === this.netEpoch) this.onNetMessage(text);
      },
      onClose: () => {
        if (epoch === this.netEpoch) this.endOnline("disconnected");
      },
      onError: () => undefined,
    };
  }

  private onLinked(link: NetLink): void {
    const o = this.ui.online;
    if (!o) {
      link.close();
      return;
    }
    this.link = link;
    this.lastRecv = performance.now();
    this.rtt = 0;
    this.pingSent.clear();
    if (this.netTimer) clearInterval(this.netTimer);
    this.netTimer = window.setInterval(this.netBeat, 1000);
    this.netBeat();
    this.audio.ui("ok");
    this.patchOnline({ view: "room", status: "connected", notice: null, myPick: null, rivalPick: null, starting: false });
    if (o.role === "host") this.send({ t: "settings", settings: o.settings });
  }

  private send(msg: NetMsg): void {
    this.link?.send(encodeMsg(msg));
  }

  /** Once a second: ping for the RTT indicator and watch for a silent rival. */
  private readonly netBeat = (): void => {
    if (!this.link) return;
    const now = performance.now();
    if (now - this.lastRecv > ONLINE_SILENCE_MS) {
      this.endOnline("disconnected");
      return;
    }
    const id = ++this.pingId;
    this.pingSent.set(id, now);
    if (this.pingSent.size > 20) {
      const first = this.pingSent.keys().next();
      if (!first.done) this.pingSent.delete(first.value);
    }
    this.send({ t: "ping", id });
  };

  private onNetMessage(text: string): void {
    const m = decodeMsg(text);
    const o = this.ui.online;
    if (!m || !o) return;
    this.lastRecv = performance.now();
    switch (m.t) {
      case "input":
      case "hash":
        // the rival may start a moment earlier: keep its first messages for the new session
        if (this.earlyMsgs) this.earlyMsgs.push(m);
        else this.feedSession(m);
        break;
      case "ping":
        this.send({ t: "pong", id: m.id });
        break;
      case "pong": {
        const at = this.pingSent.get(m.id);
        if (at === undefined) break;
        this.pingSent.delete(m.id);
        const sample = performance.now() - at;
        this.rtt = this.rtt === 0 ? sample : this.rtt * 0.7 + sample * 0.3;
        const shown = Math.round(this.rtt);
        if (o.rtt === null || Math.abs(o.rtt - shown) >= 3) this.patchOnline({ rtt: shown });
        break;
      }
      case "pick":
        this.patchOnline({ rivalPick: m.char });
        this.maybeStartOnline();
        break;
      case "settings":
        // only the host owns the room settings
        if (o.role === "guest" && !o.starting) this.patchOnline({ settings: m.settings });
        break;
      case "start":
        if (o.role !== "guest" || o.starting) break;
        this.patchOnline({ settings: m.settings, rivalPick: m.chars[0], myPick: m.chars[1] });
        // the host began its countdown about half a round trip ago
        this.scheduleOnlineStart(onlineFightConfig(m), Math.max(0, m.startInMs - this.rtt / 2));
        break;
      case "rematch":
        this.patchOnline({ rematchRival: true });
        this.maybeRematch();
        break;
      case "leave":
        this.endOnline("rivalLeft");
        break;
    }
  }

  private feedSession(m: NetMsg): void {
    const ses = this.session;
    if (!ses) return;
    if (m.t === "input") ses.onRemoteInput(m.frame, m.bits);
    else if (m.t === "hash" && m.seed === ses.confirmed.config.seed) ses.onRemoteHash(m.frame, m.hash);
  }

  /** Host: change one room setting (sent live to the guest). */
  setRoomSettings(patch: Partial<RoomSettings>): void {
    const o = this.ui.online;
    if (!o || o.role !== "host" || o.starting) return;
    const settings: RoomSettings = { ...o.settings, ...patch };
    if (patch.map !== undefined && patch.map !== "random") this.updateSettings({ lastMap: patch.map });
    this.patchOnline({ settings });
    this.send({ t: "settings", settings });
  }

  /** From the room: open the fighter select for this device's own fighter. */
  onlineChoose(): void {
    const o = this.ui.online;
    if (!o || o.view !== "room" || o.starting) return;
    this.set({ screen: "select", mode: "online", slot: o.local, picks: [null, null] });
  }

  private onlinePick(p: Pick): void {
    const o = this.ui.online;
    if (!o || !this.link || o.starting) return;
    const char = p === "random" ? randomOf(CHAR_IDS, "asagiri") : p;
    if (p !== "random") this.updateSettings({ lastChar: p });
    this.send({ t: "pick", char });
    this.set({ screen: "online", online: { ...o, myPick: char } });
    this.maybeStartOnline();
  }

  /** Host: both fighters are chosen, so send `start` and begin the shared countdown. */
  private maybeStartOnline(): void {
    const o = this.ui.online;
    if (!o || o.role !== "host" || o.starting || !o.myPick || !o.rivalPick || !this.link) return;
    if (this.ui.screen !== "online") return;
    this.sendStart([o.myPick, o.rivalPick], o.settings.map === "random" ? randomOf(MAP_IDS, "quay") : o.settings.map);
  }

  private sendStart(chars: [CharId, CharId], map: MapId): void {
    const o = this.ui.online;
    if (!o) return;
    const msg: Extract<NetMsg, { t: "start" }> = {
      t: "start",
      chars,
      map,
      seed: randomSeed(),
      startInMs: ONLINE_START_MS,
      settings: { ...o.settings, map },
    };
    this.send(msg);
    this.scheduleOnlineStart(onlineFightConfig(msg), ONLINE_START_MS);
  }

  private scheduleOnlineStart(config: FightConfig, inMs: number): void {
    this.patchOnline({ starting: true, rematchMe: false, rematchRival: false });
    this.earlyMsgs = [];
    if (this.startTimer) clearTimeout(this.startTimer);
    const epoch = this.netEpoch;
    this.startTimer = window.setTimeout(() => {
      this.startTimer = 0;
      if (epoch !== this.netEpoch || !this.ui.online || !this.link) return;
      this.startOnlineMatch(config);
    }, inMs);
  }

  private startOnlineMatch(config: FightConfig): void {
    const o = this.ui.online;
    if (!o) return;
    this.session = null;
    this.startMatch(config);
    const st = this.fight;
    if (!st) return;
    this.session = new NetSession(st, o.local, {
      send: (msg) => this.send(msg),
      onConfirmed: (state) => this.onConfirmedTick(state),
      onDesync: () => {
        // let the current call stack (a confirmed tick) unwind first
        const epoch = this.netEpoch;
        window.setTimeout(() => {
          if (epoch === this.netEpoch) this.endOnline("desync");
        }, 0);
      },
    });
    const early = this.earlyMsgs ?? [];
    this.earlyMsgs = null;
    for (const m of early) this.feedSession(m);
    this.patchOnline({ starting: false });
    this.syncBackground();
  }

  private tickOnline(ses: NetSession): void {
    const live = this.ui.screen === "fight" && !this.ui.paused;
    if (live) this.readHuman(this.ui.online?.local ?? 0, this.netInput);
    else clearFrame(this.netInput);
    ses.tick(packInput(this.netInput), this.rtt);
  }

  /** Effects, audio and match flow come only from confirmed ticks (never from predictions). */
  private onConfirmedTick(st: FightState): void {
    this.renderer?.update(st);
    this.audio.onEvents(st.events);
    for (const e of st.events) {
      if (e.type === "matchEnd" && !this.matchEndTracked) {
        this.matchEndTracked = true;
        trackEvent("fightersland_match_end", {
          mode: st.config.mode,
          winner: e.winner === 0 ? "p1" : "p2",
          p1: st.config.chars[0],
          p2: st.config.chars[1],
          rounds: st.round,
        });
      }
    }
    if (st.phase === "matchEnd" && st.phaseFrame >= RESULT_DELAY && this.ui.screen === "fight" && st.matchWinner !== null) {
      this.set({
        screen: "result",
        paused: false,
        result: {
          winner: st.matchWinner,
          wins: [st.wins[0], st.wins[1]],
          chars: [st.config.chars[0], st.config.chars[1]],
          mode: st.config.mode,
        },
      });
    }
  }

  private onlineRematch(): void {
    const o = this.ui.online;
    if (!o || !this.link || o.rematchMe || o.starting) return;
    this.patchOnline({ rematchMe: true });
    this.send({ t: "rematch" });
    this.maybeRematch();
  }

  /** Host: both asked for a rematch, so start again with the same fighters, arena and rules. */
  private maybeRematch(): void {
    const o = this.ui.online;
    const c = this.lastConfig;
    if (!o || o.role !== "host" || !o.rematchMe || !o.rematchRival || o.starting || !c || c.mode !== "online") return;
    if (this.ui.screen !== "result") return;
    this.sendStart([c.chars[0], c.chars[1]], c.map);
  }

  /** Leave online play on purpose (tells the rival) and go back to the mode screen. */
  leaveOnline(): void {
    this.closeNet(true);
    this.dropRealFight();
    this.set({ screen: "mode", mode: "ai", paused: false, result: null, online: null });
  }

  /** The session ended from outside (rival gone, out of sync): back to the online menu with a notice. */
  private endOnline(notice: OnlineNotice): void {
    if (!this.ui.online) return;
    this.closeNet(true);
    this.dropRealFight();
    this.audio.ui("back");
    this.set({ screen: "online", mode: "online", paused: false, result: null, online: this.freshOnline("menu", notice) });
  }

  /** Stop every network activity; `sayLeave` tells the rival first. */
  private closeNet(sayLeave: boolean): void {
    this.netEpoch++;
    if (sayLeave && this.link?.isOpen()) this.send({ t: "leave" });
    this.connecting?.cancel();
    this.connecting = null;
    const link = this.link;
    this.link = null;
    // give the "leave" a moment to go out before the channel is torn down
    if (link) window.setTimeout(() => link.close(), sayLeave ? 250 : 0);
    if (this.netTimer) clearInterval(this.netTimer);
    if (this.startTimer) clearTimeout(this.startTimer);
    this.netTimer = 0;
    this.startTimer = 0;
    this.session = null;
    this.earlyMsgs = null;
    this.pingSent.clear();
    this.syncBackground();
  }

  /**
   * A hidden tab gets no animation frames, which would freeze the rival too. While an online
   * match runs in a hidden tab the simulation is driven by timers instead (a worker timer when
   * possible, since page timers are throttled to about one per second), with neutral inputs.
   */
  private syncBackground(): void {
    let hidden = false;
    try {
      hidden = document.visibilityState === "hidden";
    } catch {
      hidden = false;
    }
    const want = this.session !== null && hidden;
    if (want && !this.bgInterval) {
      this.bgT = performance.now();
      this.bgInterval = window.setInterval(this.bgTick, 200);
      try {
        const src = URL.createObjectURL(new Blob(["setInterval(function(){postMessage(0)},16)"], { type: "text/javascript" }));
        const w = new Worker(src);
        URL.revokeObjectURL(src);
        w.onmessage = this.bgTick;
        this.bgWorker = w;
      } catch {
        this.bgWorker = null;
      }
    } else if (!want && this.bgInterval) {
      clearInterval(this.bgInterval);
      this.bgInterval = 0;
      this.bgWorker?.terminate();
      this.bgWorker = null;
      this.acc = 0;
    }
  }

  private readonly bgTick = (): void => {
    if (!this.session) return;
    const now = performance.now();
    this.acc += Math.min(1500, now - this.bgT) * this.speed;
    this.bgT = now;
    let n = 0;
    while (this.acc >= STEP_MS && n < 120 && this.session) {
      this.acc -= STEP_MS;
      this.tick();
      n++;
    }
    if (n >= 120) this.acc = 0;
  };

  // ---- debug ----------------------------------------------------------------------------------

  private installDebug(): void {
    const api: DebugApi = {
      start: (config) => {
        const d = this.defaultConfig();
        const c: FightConfig = { ...d, ...(config ?? {}) };
        this.set({ mode: c.mode });
        this.startMatch(c);
      },
      state: () => this.fight,
      press: (player, button) => {
        if (isButton(button)) this.virt[player][button] = true;
      },
      release: (player, button) => {
        if (isButton(button)) this.virt[player][button] = false;
      },
      releaseAll: () => {
        clearFrame(this.virt[0]);
        clearFrame(this.virt[1]);
        this.keyboard.releaseAll();
        this.touchState.clear();
      },
      goto: (screen) => {
        if ((SCREENS as readonly string[]).includes(screen)) this.goto(screen);
      },
      setSpeed: (n) => {
        this.speed = Math.max(0.1, Math.min(50, Number.isFinite(n) ? n : 1));
      },
      ui: () => this.ui,
      net: () => {
        const ses = this.session;
        const o = this.ui.online;
        if (!ses || !o) return null;
        return { ...ses.stats(), role: o.role, local: o.local, rtt: o.rtt, config: ses.confirmed.config, confirmed: ses.confirmed };
      },
    };
    (window as unknown as { __FL__?: DebugApi }).__FL__ = api;
  }
}
