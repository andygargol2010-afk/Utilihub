/**
 * On-screen touch controls (Pointer Events, multi-touch, hold-to-charge).
 * Left: a movement pad (◀ ▶ and ▲ above them; sliding a finger across it changes direction,
 * the upper corners jump diagonally). Right: an arc of L / M / H attacks plus BLOCK and DODGE.
 */
import { useEffect, useReducer, useRef } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import type { TouchState } from "./touch";
import type { Button } from "./bindings";
import { PixelText } from "../ui/PixelText";

export interface TouchControlsProps {
  state: TouchState;
  placement: "below" | "overlay";
  height: number;
  blockLabel: string;
  dodgeLabel: string;
  rotateHint: string | null;
}

const PAD_W = 128;
const PAD_H = 128;

/** Directions held for a point inside the pad box. */
function padButtons(x: number, y: number): Button[] {
  if (x < -24 || y < -24 || x > PAD_W + 24 || y > PAD_H + 24) return [];
  if (y < 60) {
    if (x < 34) return ["up", "left"];
    if (x > PAD_W - 34) return ["up", "right"];
    return ["up"];
  }
  return x < PAD_W / 2 ? ["left"] : ["right"];
}

function Arrow({ dir }: { dir: "left" | "right" | "up" }) {
  const d =
    dir === "left" ? "M17 4 L7 12 L17 20 Z" : dir === "right" ? "M7 4 L17 12 L7 20 Z" : "M4 17 L12 7 L20 17 Z";
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

export function TouchControls({ state, placement, height, blockLabel, dodgeLabel, rotateHint }: TouchControlsProps) {
  const [, force] = useReducer((n: number) => n + 1, 0);
  const padRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => state.subscribe(force), [state]);
  useEffect(() => () => state.clear(), [state]);

  const padPointer = (e: ReactPointerEvent<HTMLDivElement>): void => {
    const el = padRef.current;
    if (!el) return;
    e.preventDefault();
    const r = el.getBoundingClientRect();
    state.set(e.pointerId, padButtons(e.clientX - r.left, e.clientY - r.top));
  };
  const padDown = (e: ReactPointerEvent<HTMLDivElement>): void => {
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // capture is optional
    }
    padPointer(e);
  };
  const padMove = (e: ReactPointerEvent<HTMLDivElement>): void => {
    if (e.buttons === 0 && e.pointerType === "mouse") return;
    padPointer(e);
  };
  const padUp = (e: ReactPointerEvent<HTMLDivElement>): void => {
    state.release(e.pointerId);
  };

  const act = (b: Button) => ({
    onPointerDown: (e: ReactPointerEvent<HTMLDivElement>) => {
      e.preventDefault();
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        // capture is optional
      }
      state.set(e.pointerId, [b]);
    },
    onPointerUp: (e: ReactPointerEvent<HTMLDivElement>) => state.release(e.pointerId),
    onPointerCancel: (e: ReactPointerEvent<HTMLDivElement>) => state.release(e.pointerId),
    onLostPointerCapture: (e: ReactPointerEvent<HTMLDivElement>) => state.release(e.pointerId),
    onContextMenu: (e: { preventDefault(): void }) => e.preventDefault(),
  });

  const on = (b: Button): string => (state.isHeld(b) ? " fl-tbtn-on" : "");
  const cls = placement === "below" ? "fl-touch fl-touch-below" : "fl-touch fl-touch-overlay";

  return (
    <div className={cls} style={{ height: `${height}px` }} aria-hidden="true">
      {rotateHint ? (
        <div className="fl-rotate">
          <PixelText text={rotateHint} size={0.5} color="#9a8fb8" />
        </div>
      ) : null}
      <div
        ref={padRef}
        className="fl-pad"
        onPointerDown={padDown}
        onPointerMove={padMove}
        onPointerUp={padUp}
        onPointerCancel={padUp}
        onLostPointerCapture={padUp}
        onContextMenu={(e) => e.preventDefault()}
      >
        <div className={`fl-tbtn${on("up")}`} style={{ left: "34px", top: "0px" }}>
          <Arrow dir="up" />
        </div>
        <div className={`fl-tbtn${on("left")}`} style={{ left: "0px", top: "68px" }}>
          <Arrow dir="left" />
        </div>
        <div className={`fl-tbtn${on("right")}`} style={{ left: "68px", top: "68px" }}>
          <Arrow dir="right" />
        </div>
      </div>
      <div className="fl-acts">
        <div className={`fl-tbtn fl-tbtn-act fl-tbtn-pill${on("block")}`} style={{ left: "0px", top: "14px" }} {...act("block")}>
          <PixelText text={blockLabel} />
        </div>
        <div className={`fl-tbtn fl-tbtn-act fl-tbtn-pill${on("dodge")}`} style={{ left: "112px", top: "0px" }} {...act("dodge")}>
          <PixelText text={dodgeLabel} />
        </div>
        <div className={`fl-tbtn fl-tbtn-act${on("light")}`} style={{ left: "0px", top: "92px" }} {...act("light")}>
          <PixelText text="L" size={1.5} />
        </div>
        <div className={`fl-tbtn fl-tbtn-act${on("medium")}`} style={{ left: "72px", top: "76px" }} {...act("medium")}>
          <PixelText text="M" size={1.5} />
        </div>
        <div className={`fl-tbtn fl-tbtn-act${on("heavy")}`} style={{ left: "144px", top: "60px" }} {...act("heavy")}>
          <PixelText text="H" size={1.5} />
        </div>
      </div>
    </div>
  );
}
