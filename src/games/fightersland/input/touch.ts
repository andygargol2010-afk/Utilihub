/**
 * Touch input state shared between the on-screen controls (writers) and the game loop
 * (reader). Each button counts the pointers holding it, so multi-touch works naturally.
 */
import type { InputFrame } from "../core/types";
import { BUTTONS } from "./bindings";
import type { Button } from "./bindings";

export class TouchState {
  private readonly counts: Record<Button, number> = {
    left: 0,
    right: 0,
    up: 0,
    light: 0,
    medium: 0,
    heavy: 0,
    block: 0,
    dodge: 0,
  };
  /** Pointer id → buttons it currently holds. */
  private readonly owners = new Map<number, Button[]>();
  /** Bumped on every change so the controls can redraw their pressed state. */
  version = 0;
  private readonly listeners = new Set<() => void>();

  /** Replace the set of buttons held by one pointer. */
  set(pointer: number, buttons: readonly Button[]): void {
    const prev = this.owners.get(pointer);
    if (prev && prev.length === buttons.length && prev.every((b, i) => b === buttons[i])) return;
    if (prev) for (const b of prev) this.counts[b] = Math.max(0, this.counts[b] - 1);
    if (buttons.length > 0) {
      const copy = buttons.slice();
      this.owners.set(pointer, copy);
      for (const b of copy) this.counts[b]++;
    } else {
      this.owners.delete(pointer);
    }
    this.changed();
  }

  release(pointer: number): void {
    this.set(pointer, []);
  }

  clear(): void {
    if (this.owners.size === 0) return;
    this.owners.clear();
    for (const b of BUTTONS) this.counts[b] = 0;
    this.changed();
  }

  isHeld(b: Button): boolean {
    return this.counts[b] > 0;
  }

  read(out: InputFrame): void {
    for (const b of BUTTONS) if (this.counts[b] > 0) out[b] = true;
  }

  subscribe(fn: () => void): () => void {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  }

  private changed(): void {
    this.version++;
    for (const fn of this.listeners) fn();
  }
}
