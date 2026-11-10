/**
 * Spatial focus navigation for the DOM menus (keyboard arrows / WASD and gamepad d-pad).
 * Focusable items carry `data-fl-nav`; the item with `data-fl-autofocus` gets focus first; the
 * element with `data-fl-back` is clicked by the "back" intent.
 */
import type { MenuIntent } from "../input/bindings";

const SELECTOR = "[data-fl-nav]:not([disabled])";

function items(root: HTMLElement): HTMLElement[] {
  const list = Array.from(root.querySelectorAll<HTMLElement>(SELECTOR));
  return list.filter((el) => el.offsetParent !== null || el.getClientRects().length > 0);
}

/** Focus the screen's preferred element (if focus is not already inside it). */
export function focusDefault(root: HTMLElement, force = false): void {
  const active = document.activeElement;
  if (!force && active instanceof HTMLElement && root.contains(active) && active.matches(SELECTOR)) return;
  const pref = root.querySelector<HTMLElement>("[data-fl-autofocus]:not([disabled])") ?? items(root)[0];
  pref?.focus({ preventScroll: true });
}

function move(root: HTMLElement, dir: "up" | "down" | "left" | "right"): boolean {
  const list = items(root);
  if (list.length === 0) return false;
  const active = document.activeElement;
  const cur = active instanceof HTMLElement && list.includes(active) ? active : null;
  if (!cur) {
    focusDefault(root, true);
    return true;
  }
  const a = cur.getBoundingClientRect();
  const ax = a.left + a.width / 2;
  const ay = a.top + a.height / 2;
  let best: HTMLElement | null = null;
  let bestScore = Infinity;
  for (const el of list) {
    if (el === cur) continue;
    const b = el.getBoundingClientRect();
    const bx = b.left + b.width / 2;
    const by = b.top + b.height / 2;
    const dx = bx - ax;
    const dy = by - ay;
    let primary: number;
    let ortho: number;
    switch (dir) {
      case "left":
        if (b.right > a.left + 2 && dx >= -2) continue;
        primary = -dx;
        ortho = Math.abs(dy);
        break;
      case "right":
        if (b.left < a.right - 2 && dx <= 2) continue;
        primary = dx;
        ortho = Math.abs(dy);
        break;
      case "up":
        if (b.bottom > a.top + 2 && dy >= -2) continue;
        primary = -dy;
        ortho = Math.abs(dx);
        break;
      case "down":
        if (b.top < a.bottom - 2 && dy <= 2) continue;
        primary = dy;
        ortho = Math.abs(dx);
        break;
    }
    if (primary <= 0) continue;
    const score = primary + ortho * 2.2;
    if (score < bestScore) {
      bestScore = score;
      best = el;
    }
  }
  if (!best && (dir === "up" || dir === "down")) {
    // wrap around vertical lists
    const sorted = list.slice().sort((p, q) => p.getBoundingClientRect().top - q.getBoundingClientRect().top);
    best = (dir === "down" ? sorted[0] : sorted[sorted.length - 1]) ?? null;
    if (best === cur) best = null;
  }
  if (best) {
    best.focus({ preventScroll: true });
    return true;
  }
  return false;
}

/**
 * Apply a menu intent inside `root`. Returns "moved" | "ok" | "back" | null so the caller can
 * play the matching UI sound.
 */
export function applyIntent(root: HTMLElement, intent: MenuIntent): "moved" | "ok" | "back" | null {
  switch (intent) {
    case "up":
    case "down":
    case "left":
    case "right": {
      const active = document.activeElement;
      // a slider-like control may consume left/right itself
      if ((intent === "left" || intent === "right") && active instanceof HTMLElement && active.dataset["flLr"] !== undefined) {
        active.dispatchEvent(new CustomEvent("fl-lr", { detail: intent === "left" ? -1 : 1 }));
        return "moved";
      }
      return move(root, intent) ? "moved" : null;
    }
    case "ok": {
      const active = document.activeElement;
      if (active instanceof HTMLElement && root.contains(active) && active.matches(SELECTOR)) {
        active.click();
        return "ok";
      }
      focusDefault(root, true);
      return "moved";
    }
    case "back":
    case "pause": {
      const back = root.querySelector<HTMLElement>("[data-fl-back]:not([disabled])");
      if (back) {
        back.click();
        return "back";
      }
      return null;
    }
  }
}
