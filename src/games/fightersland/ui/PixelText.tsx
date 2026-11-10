/**
 * Text drawn with the game's bitmap font on a tiny canvas, upscaled with crisp pixels.
 * The canvas is hidden from assistive tech; pass `label` (or put the component inside an
 * element with its own aria-label) so screen readers get the real text.
 */
import { createContext, useContext, useLayoutEffect, useMemo, useRef } from "react";
import type { CSSProperties } from "react";
import { FONT_HEIGHT, drawText, measureText } from "../render/font";

/** Integer CSS-px-per-font-px scale of the DOM UI (set by the stage from its size). */
export const UiScaleContext = createContext(2);

export function useUiScale(): number {
  return useContext(UiScaleContext);
}

export interface PixelTextProps {
  text: string;
  /** Multiplier on top of the UI scale (1 = body text, 2 = headings…). */
  size?: number;
  color?: string;
  shadow?: string | null;
  align?: "left" | "center" | "right";
  /** Maximum line width in font pixels; longer text wraps at spaces. */
  wrap?: number;
  /** Accessible text; when omitted the canvas is decorative (aria-hidden). */
  label?: string;
  className?: string;
  style?: CSSProperties;
}

export function wrapLines(text: string, wrap: number | undefined): string[] {
  const paragraphs = text.split("\n");
  if (wrap === undefined) return paragraphs;
  const out: string[] = [];
  for (const para of paragraphs) {
    const words = para.split(" ");
    let line = "";
    for (const w of words) {
      const next = line ? `${line} ${w}` : w;
      if (line && measureText(next) > wrap) {
        out.push(line);
        line = w;
      } else {
        line = next;
      }
    }
    out.push(line);
  }
  return out;
}

export function PixelText({
  text,
  size = 1,
  color = "#f4efe6",
  shadow = "#120d1f",
  align = "left",
  wrap,
  label,
  className,
  style,
}: PixelTextProps) {
  const ui = useUiScale();
  const ref = useRef<HTMLCanvasElement | null>(null);
  const upper = text.toUpperCase();
  const lines = useMemo(() => wrapLines(upper, wrap), [upper, wrap]);
  const pad = shadow ? 1 : 0; // outline pixels on each side
  let maxW = 1;
  for (const l of lines) maxW = Math.max(maxW, measureText(l));
  const w = maxW + pad * 2;
  const h = lines.length * FONT_HEIGHT + pad * 2;
  const s = Math.max(1, Math.round(ui * size));

  useLayoutEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, c.width, c.height);
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i] ?? "";
      const x = align === "left" ? 0 : align === "center" ? Math.floor(maxW / 2) : maxW;
      drawText(ctx, line, x + pad, i * FONT_HEIGHT + pad, { color, scale: 1, shadow, align });
    }
  }, [lines, color, shadow, align, maxW, pad, w, h]);

  const css: CSSProperties = { width: `${w * s}px`, height: `${h * s}px`, ...style };
  return label ? (
    <canvas ref={ref} className={className ? `fl-px ${className}` : "fl-px"} width={w} height={h} style={css} role="img" aria-label={label} />
  ) : (
    <canvas ref={ref} className={className ? `fl-px ${className}` : "fl-px"} width={w} height={h} style={css} aria-hidden="true" />
  );
}
