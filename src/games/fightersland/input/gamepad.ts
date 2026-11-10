/**
 * Gamepad source (standard mapping). Polled once per animation frame.
 *
 * Fight: d-pad / left stick move, A or up = jump, down or LB/LT = block, X light, Y medium,
 * B heavy, RB/RT dodge, Start pause. Menus: d-pad / stick navigate with auto-repeat,
 * A confirm, B back, Start pause.
 */
import type { InputFrame } from "../core/types";
import { clearFrame } from "./bindings";
import type { MenuIntent } from "./bindings";

const DEAD = 0.45;
const REPEAT_DELAY = 22;
const REPEAT_EVERY = 7;
const MAX_PADS = 4;

interface PadSlot {
  frame: InputFrame;
  /** Previous-poll pressed state of the menu intents (for edges). */
  prev: Record<MenuIntent, boolean>;
  /** Frames a direction has been held (auto-repeat). */
  hold: number;
  connected: boolean;
}

function newSlot(): PadSlot {
  return {
    frame: { left: false, right: false, up: false, light: false, medium: false, heavy: false, block: false, dodge: false },
    prev: { up: false, down: false, left: false, right: false, ok: false, back: false, pause: false },
    hold: 0,
    connected: false,
  };
}

function pressed(pad: Gamepad, i: number): boolean {
  const b = pad.buttons[i];
  return b !== undefined && (b.pressed || b.value > 0.5);
}

export class GamepadSource {
  private readonly slots: PadSlot[] = [];
  private readonly now: Record<MenuIntent, boolean> = {
    up: false,
    down: false,
    left: false,
    right: false,
    ok: false,
    back: false,
    pause: false,
  };
  /** Number of connected pads after the last poll. */
  count = 0;

  constructor() {
    for (let i = 0; i < MAX_PADS; i++) this.slots.push(newSlot());
  }

  /**
   * Read every pad. `emit` receives menu intents (edges plus direction auto-repeat);
   * returns true when any pad input was active (to switch the "last device" hint).
   */
  poll(emit: (intent: MenuIntent) => void): boolean {
    let active = false;
    let pads: (Gamepad | null)[] = [];
    try {
      pads = typeof navigator !== "undefined" && navigator.getGamepads ? Array.from(navigator.getGamepads()) : [];
    } catch {
      pads = [];
    }
    let n = 0;
    for (let i = 0; i < MAX_PADS; i++) {
      const slot = this.slots[i];
      if (!slot) continue;
      clearFrame(slot.frame);
      slot.connected = false;
    }
    for (const pad of pads) {
      if (!pad || !pad.connected || n >= MAX_PADS) continue;
      const slot = this.slots[n];
      n++;
      if (!slot) continue;
      slot.connected = true;
      const ax = pad.axes[0] ?? 0;
      const ay = pad.axes[1] ?? 0;
      const f = slot.frame;
      f.left = pressed(pad, 14) || ax < -DEAD;
      f.right = pressed(pad, 15) || ax > DEAD;
      f.up = pressed(pad, 12) || pressed(pad, 0) || ay < -0.6;
      f.block = pressed(pad, 13) || pressed(pad, 4) || pressed(pad, 6) || ay > 0.6;
      f.light = pressed(pad, 2);
      f.medium = pressed(pad, 3);
      f.heavy = pressed(pad, 1);
      f.dodge = pressed(pad, 5) || pressed(pad, 7);

      const now = this.now;
      now.up = pressed(pad, 12) || ay < -DEAD;
      now.down = pressed(pad, 13) || ay > DEAD;
      now.left = f.left;
      now.right = f.right;
      now.ok = pressed(pad, 0);
      now.back = pressed(pad, 1);
      now.pause = pressed(pad, 9);
      const anyDir = now.up || now.down || now.left || now.right;
      slot.hold = anyDir ? slot.hold + 1 : 0;
      const repeat = slot.hold > REPEAT_DELAY && (slot.hold - REPEAT_DELAY) % REPEAT_EVERY === 0;
      for (const k of ["up", "down", "left", "right", "ok", "back", "pause"] as const) {
        const isDir = k === "up" || k === "down" || k === "left" || k === "right";
        if (now[k] && (!slot.prev[k] || (isDir && repeat))) emit(k);
        slot.prev[k] = now[k];
        if (now[k]) active = true;
      }
      if (f.light || f.medium || f.heavy || f.dodge || f.block) active = true;
    }
    this.count = n;
    return active;
  }

  /** Buttons of the n-th connected pad (all false when absent). */
  frame(n: number): InputFrame | null {
    const s = this.slots[n];
    return s && s.connected ? s.frame : null;
  }
}
