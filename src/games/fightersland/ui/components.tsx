/**
 * Shared menu building blocks: app context, pixel buttons, toggles, icons and rating bars.
 */
import { createContext, useContext } from "react";
import type { CSSProperties, ReactNode } from "react";
import type { GameApp } from "../app/game";
import { PixelText } from "./PixelText";
import { measureText } from "../render/font";

export const AppContext = createContext<GameApp | null>(null);

export function useApp(): GameApp {
  const app = useContext(AppContext);
  if (!app) throw new Error("Fightersland UI used outside its AppContext");
  return app;
}

/** Stage size in CSS px, for screens that adapt their arrangement. */
export const StageSizeContext = createContext<{ w: number; h: number }>({ w: 1280, h: 720 });

export function useStageSize(): { w: number; h: number } {
  return useContext(StageSizeContext);
}

/** Largest PixelText size multiplier (≤ max) for which `text` fits in `maxCss` px. */
export function fitTextSize(text: string, maxCss: number, ui: number, max: number): number {
  const w = Math.max(1, measureText(text.toUpperCase()));
  let size = max;
  while (size > 0.5 && w * Math.round(ui * size) > maxCss) size -= 0.5;
  return Math.max(0.5, size);
}

export interface FlButtonProps {
  label: string;
  /** Visible text (defaults to the label). */
  text?: string;
  onClick: () => void;
  size?: number;
  primary?: boolean;
  small?: boolean;
  autoFocus?: boolean;
  /** Clicked by Esc / Backspace / gamepad B. */
  back?: boolean;
  pressed?: boolean;
  disabled?: boolean;
  color?: string;
  className?: string;
  style?: CSSProperties;
  onFocusItem?: () => void;
  children?: ReactNode;
  /** Skip the confirm sound (the action plays its own). */
  silent?: boolean;
}

export function FlButton({
  label,
  text,
  onClick,
  size = 1,
  primary = false,
  small = false,
  autoFocus = false,
  back = false,
  pressed,
  disabled = false,
  color,
  className,
  style,
  onFocusItem,
  children,
  silent = false,
}: FlButtonProps) {
  const app = useApp();
  let cls = "fl-btn";
  if (primary) cls += " fl-btn-primary";
  if (small) cls += " fl-btn-small";
  if (className) cls += ` ${className}`;
  const extra: Record<string, string> = {};
  if (autoFocus) extra["data-fl-autofocus"] = "";
  if (back) extra["data-fl-back"] = "";
  return (
    <button
      type="button"
      className={cls}
      aria-label={label}
      {...(pressed !== undefined ? { "aria-pressed": pressed } : {})}
      disabled={disabled}
      data-fl-nav=""
      {...extra}
      style={style}
      onClick={() => {
        if (!silent) app.sfx(back ? "back" : "ok");
        onClick();
      }}
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse" && !disabled) e.currentTarget.focus({ preventScroll: true });
      }}
      onFocus={onFocusItem}
    >
      {children ?? <PixelText text={text ?? label} size={size} {...(color ? { color } : {})} />}
    </button>
  );
}

export function Toggle({ label, value, onText, offText, onChange }: { label: string; value: boolean; onText: string; offText: string; onChange: (v: boolean) => void }) {
  const app = useApp();
  return (
    <button
      type="button"
      className="fl-btn fl-btn-row"
      role="switch"
      aria-checked={value}
      aria-label={label}
      data-fl-nav=""
      onClick={() => {
        app.sfx("toggle");
        onChange(!value);
      }}
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse") e.currentTarget.focus({ preventScroll: true });
      }}
    >
      <PixelText text={label} />
      <PixelText text={value ? onText : offText} color={value ? "#f5c84a" : "#9a8fb8"} />
    </button>
  );
}

export function Icon({ name }: { name: "exit" | "pause" | "sound" | "mute" }) {
  return (
    <svg className="fl-icon" viewBox="0 0 20 20" aria-hidden="true" shapeRendering="crispEdges">
      {name === "exit" ? <path d="M4 4L16 16M16 4L4 16" stroke="currentColor" strokeWidth="3" fill="none" /> : null}
      {name === "pause" ? <path d="M4 3h4v14H4zM12 3h4v14h-4z" /> : null}
      {name === "sound" || name === "mute" ? <path d="M2 7h4l5-4h1v14h-1l-5-4H2z" /> : null}
      {name === "sound" ? <path d="M14 6h2v8h-2zM17 4h2v12h-2z" /> : null}
      {name === "mute" ? <path d="M13 7L19 13M19 7L13 13" stroke="currentColor" strokeWidth="2" fill="none" /> : null}
    </svg>
  );
}

export function CornerButton({ label, icon, onClick, back = false }: { label: string; icon: "exit" | "pause" | "sound" | "mute"; onClick: () => void; back?: boolean }) {
  const app = useApp();
  return (
    <button
      type="button"
      className="fl-btn fl-btn-small"
      aria-label={label}
      title={label}
      {...(back ? { "data-fl-back": "" } : {})}
      onClick={() => {
        app.sfx("ok");
        onClick();
      }}
    >
      <Icon name={icon} />
    </button>
  );
}

export function RatingBar({ value, color }: { value: number; color: string }) {
  const cells = [1, 2, 3, 4, 5];
  return (
    <span className="fl-bar" style={{ ["--bar" as string]: color }} aria-hidden="true">
      {cells.map((c) => (
        <i key={c} className={c <= value ? "fl-on" : ""} />
      ))}
    </span>
  );
}
