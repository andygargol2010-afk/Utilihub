/**
 * Keyboard source: tracks held physical keys and turns them into per-layout InputFrames.
 * Keys still held when a fight starts are ignored until released, so the key that confirmed
 * the last menu never fires an attack.
 */
import type { InputFrame } from "../core/types";
import { KEYS_P1, KEYS_P2, MENU_KEYS, PAUSE_KEYS } from "./bindings";
import type { MenuIntent } from "./bindings";

export interface KeyboardHandlers {
  /** True while the fight owns the keyboard (game keys are captured). */
  inFight(): boolean;
  onMenu(intent: MenuIntent, e: KeyboardEvent): void;
  onPause(): void;
  onAnyKey(): void;
}

export class KeyboardSource {
  private readonly held = new Set<string>();
  private readonly stale = new Set<string>();
  private attached = false;
  private handlers: KeyboardHandlers | null = null;

  private readonly down = (e: KeyboardEvent): void => {
    const h = this.handlers;
    if (!h) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const target = e.target as HTMLElement | null;
    if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) return;
    const code = e.code;
    h.onAnyKey();
    if (h.inFight()) {
      if (PAUSE_KEYS.has(code)) {
        e.preventDefault();
        if (!e.repeat) h.onPause();
        return;
      }
      if (code in KEYS_P1 || code in KEYS_P2) {
        e.preventDefault();
        this.held.add(code);
      } else if (code === "Space" || code === "Enter" || code === "Tab") {
        // never activate a focused corner button mid-fight
        e.preventDefault();
      }
      return;
    }
    this.held.add(code);
    const intent = MENU_KEYS[code];
    if (intent) {
      e.preventDefault();
      h.onMenu(intent, e);
    } else if (code === "KeyP") {
      e.preventDefault();
      h.onMenu("pause", e);
    }
  };

  private readonly up = (e: KeyboardEvent): void => {
    this.held.delete(e.code);
    this.stale.delete(e.code);
    const h = this.handlers;
    if (!h) return;
    if (h.inFight() ? e.code in KEYS_P1 || e.code in KEYS_P2 : MENU_KEYS[e.code] !== undefined) e.preventDefault();
  };

  attach(handlers: KeyboardHandlers): void {
    this.handlers = handlers;
    if (this.attached) return;
    this.attached = true;
    window.addEventListener("keydown", this.down);
    window.addEventListener("keyup", this.up);
  }

  detach(): void {
    if (!this.attached) return;
    this.attached = false;
    window.removeEventListener("keydown", this.down);
    window.removeEventListener("keyup", this.up);
    this.releaseAll();
    this.handlers = null;
  }

  /** Forget every held key (window blur, pause). */
  releaseAll(): void {
    this.held.clear();
    this.stale.clear();
  }

  /** Ignore the keys held right now until they are released. */
  markStale(): void {
    for (const k of this.held) this.stale.add(k);
  }

  /** OR the buttons of one layout (1 = WASD side, 2 = arrows side) into `out`. */
  read(layout: 1 | 2, out: InputFrame): void {
    const map = layout === 1 ? KEYS_P1 : KEYS_P2;
    for (const code of this.held) {
      if (this.stale.has(code)) continue;
      const b = map[code];
      if (b) out[b] = true;
    }
  }
}
