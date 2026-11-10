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
  | "options";

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
}

/** Ticks of the winner's pose before the result screen appears. */
const RESULT_DELAY = 150;
/** Demo matches restart this long after they end. */
const DEMO_RESTART = 200;
const STEP_MS = 1000 / 60;

export interface DebugApi {
  start(config?: Partial<FightConfig>): void;
  state(): FightState | null;
  press(player: PlayerIndex, button: Button): void;
  release(player: PlayerIndex, button: Button): void;
  releaseAll(): void;
  goto(screen: Screen): void;
  setSpeed(n: number): void;
  ui(): UiState;
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
      this.debug = new URLSearchParams(window.location.search).get("fldebug") === "1";
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
  }

  close(): void {
    if (!this.isOpen) return;
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
    const ctx = this.ctx;
    if (this.dirty && ctx && this.renderer && this.fight) {
      this.dirty = false;
      this.drawSkip = 0;
      this.renderer.draw(ctx, this.fight);
    }
  };

  private isRunning(): boolean {
    if (!this.real) return true;
    return !this.ui.paused;
  }

  private readHuman(p: PlayerIndex, out: InputFrame): void {
    clearFrame(out);
    const mode = this.fight?.config.mode ?? "ai";
    if (mode === "versus") {
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

  private dropRealFight(): void {
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
    if (screen !== "result" && screen !== "tutorialDone") this.dropRealFight();
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
    if (this.ui.slot === 1) this.set({ slot: 0, picks: [null, null] });
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
    this.dropRealFight();
    this.set({ screen: "title", paused: false, result: null, tutorial: null });
  }

  pause(): void {
    if (this.ui.screen !== "fight" || !this.real || this.ui.paused) return;
    this.keyboard.releaseAll();
    this.touchState.clear();
    this.audio.ui("pause");
    this.set({ paused: true, pauseView: "main" });
    this.audio.holdMusic(true);
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
    };
    (window as unknown as { __FL__?: DebugApi }).__FL__ = api;
  }
}
