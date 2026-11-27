/**
 * Input bindings shared by the keyboard, gamepad and touch sources.
 */
import type { InputFrame } from "../core/types";

export type Button = keyof InputFrame;

export const BUTTONS: readonly Button[] = ["left", "right", "up", "light", "medium", "heavy", "block", "dodge"];

/** Physical key codes (KeyboardEvent.code) per keyboard layout. */
export const KEYS_P1: Readonly<Record<string, Button>> = {
  KeyA: "left",
  KeyD: "right",
  KeyW: "up",
  KeyS: "block",
  KeyF: "light",
  KeyG: "medium",
  KeyH: "heavy",
  KeyE: "dodge",
};

export const KEYS_P2: Readonly<Record<string, Button>> = {
  ArrowLeft: "left",
  ArrowRight: "right",
  ArrowUp: "up",
  ArrowDown: "block",
  KeyJ: "light",
  KeyK: "medium",
  KeyL: "heavy",
  KeyU: "dodge",
  Numpad1: "light",
  Numpad2: "medium",
  Numpad3: "heavy",
  Numpad0: "dodge",
};

/** Menu navigation intents produced by every device. */
export type MenuIntent = "up" | "down" | "left" | "right" | "ok" | "back" | "pause";

export const MENU_KEYS: Readonly<Record<string, MenuIntent>> = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
  KeyW: "up",
  KeyS: "down",
  KeyA: "left",
  KeyD: "right",
  Enter: "ok",
  NumpadEnter: "ok",
  Space: "ok",
  KeyF: "ok",
  KeyJ: "ok",
  Escape: "back",
  Backspace: "back",
};

export const PAUSE_KEYS: ReadonlySet<string> = new Set(["Escape", "KeyP"]);

export function clearFrame(f: InputFrame): void {
  f.left = false;
  f.right = false;
  f.up = false;
  f.light = false;
  f.medium = false;
  f.heavy = false;
  f.block = false;
  f.dodge = false;
}

/** OR `src` into `dst`. */
export function mergeFrame(dst: InputFrame, src: InputFrame): void {
  dst.left = dst.left || src.left;
  dst.right = dst.right || src.right;
  dst.up = dst.up || src.up;
  dst.light = dst.light || src.light;
  dst.medium = dst.medium || src.medium;
  dst.heavy = dst.heavy || src.heavy;
  dst.block = dst.block || src.block;
  dst.dodge = dst.dodge || src.dodge;
}

export function isButton(v: unknown): v is Button {
  return typeof v === "string" && (BUTTONS as readonly string[]).includes(v);
}
