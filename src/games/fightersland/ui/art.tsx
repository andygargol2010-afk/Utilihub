/**
 * Small canvas widgets for the menus: animated fighter previews, portraits and map thumbnails.
 * Animated widgets share one requestAnimationFrame ticker running at the 60 Hz game rate.
 */
import { useEffect, useLayoutEffect, useRef } from "react";
import type { CSSProperties } from "react";
import type { CharId, MapId, SpriteFrame } from "../core/types";
import { drawMapThumb, drawSprite } from "../render/menuArt";
import { getPortrait, getPreviewSprite } from "../render/fighters/index";
import { useUiScale } from "./PixelText";

type TickFn = (tick: number) => void;
const subscribers = new Set<TickFn>();
let rafId = 0;
let tick = 0;
let last = 0;
let acc = 0;

function loop(t: number): void {
  if (last === 0) last = t;
  acc += Math.min(100, t - last);
  last = t;
  let advanced = false;
  while (acc >= 1000 / 60) {
    acc -= 1000 / 60;
    tick++;
    advanced = true;
  }
  if (advanced) for (const fn of subscribers) fn(tick);
  rafId = subscribers.size > 0 ? requestAnimationFrame(loop) : 0;
}

/** Subscribe to the shared menu ticker (client only). */
export function useTicker(fn: TickFn, enabled = true): void {
  const ref = useRef(fn);
  ref.current = fn;
  useEffect(() => {
    if (!enabled) return undefined;
    const cb: TickFn = (t) => ref.current(t);
    subscribers.add(cb);
    if (rafId === 0) {
      last = 0;
      acc = 0;
      rafId = requestAnimationFrame(loop);
    }
    cb(tick);
    return () => {
      subscribers.delete(cb);
      if (subscribers.size === 0 && rafId !== 0) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
    };
  }, [enabled]);
}

export interface SpriteBoxProps {
  /** Sprite for a given ticker value; called every tick when `animated`. */
  sprite: (tick: number) => SpriteFrame | null;
  /** Logical canvas size and the ground point inside it. */
  w: number;
  h: number;
  gx: number;
  gy: number;
  flip?: boolean;
  /** Extra size multiplier on top of the UI scale. */
  size?: number;
  animated?: boolean;
  /** Draw only every n-th tick (cheap previews). */
  every?: number;
  className?: string;
  style?: CSSProperties;
}

export function SpriteBox({ sprite, w, h, gx, gy, flip = false, size = 1, animated = true, every = 2, className, style }: SpriteBoxProps) {
  const ui = useUiScale();
  const ref = useRef<HTMLCanvasElement | null>(null);
  const lastSprite = useRef<SpriteFrame | null>(null);

  const paint = (t: number): void => {
    const c = ref.current;
    if (!c) return;
    const s = sprite(t);
    if (s === lastSprite.current) return;
    lastSprite.current = s;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, w, h);
    if (!s) return;
    const x = flip ? w - gx : gx;
    drawSprite(ctx, s, x, gy, { scale: 1, flip });
  };

  useLayoutEffect(() => {
    lastSprite.current = null;
    paint(tick);
  });
  useTicker((t) => {
    if (t % every === 0) paint(t);
  }, animated);

  const s = Math.max(1, Math.round(ui * size));
  return (
    <canvas
      ref={ref}
      className={className ? `fl-px ${className}` : "fl-px"}
      width={w}
      height={h}
      style={{ width: `${w * s}px`, height: `${h * s}px`, ...style }}
      aria-hidden="true"
    />
  );
}

/** Animated preview of a fighter on the select screen. */
export function FighterPreview({
  char,
  pose,
  flip = false,
  size = 1,
}: {
  char: CharId;
  pose: "idle" | "attack" | "win";
  flip?: boolean;
  size?: number;
}) {
  return (
    <SpriteBox
      sprite={(t) => getPreviewSprite(char, pose, t)}
      w={140}
      h={106}
      gx={54}
      gy={103}
      flip={flip}
      size={size}
      every={1}
    />
  );
}

/** Static 24x24 portrait. */
export function Portrait({ char, flip = false, size = 1 }: { char: CharId; flip?: boolean; size?: number }) {
  return <SpriteBox sprite={() => getPortrait(char)} w={24} h={24} gx={12} gy={24} flip={flip} size={size} animated={false} />;
}

/** Map thumbnail drawn by the stage renderer's menu art. */
export function MapThumb({ map, w, h, size = 1 }: { map: MapId; w: number; h: number; size?: number }) {
  const ui = useUiScale();
  const ref = useRef<HTMLCanvasElement | null>(null);
  useLayoutEffect(() => {
    const c = ref.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    ctx.clearRect(0, 0, w, h);
    drawMapThumb(ctx, map, w, h);
  }, [map, w, h]);
  const s = Math.max(1, Math.round(ui * size));
  return <canvas ref={ref} className="fl-px" width={w} height={h} style={{ width: `${w * s}px`, height: `${h * s}px` }} aria-hidden="true" />;
}
