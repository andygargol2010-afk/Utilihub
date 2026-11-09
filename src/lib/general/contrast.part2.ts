// Part 2 of 3 — split from contrast.ts on 2026-11-04. Edit here; contrast.ts re-exports.

export function channel(hex: string, index: number) {
  return Number.parseInt(hex.slice(index, index + 2), 16);
}

export function linearize(channelValue: number) {
  const s = channelValue / 255;
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

export function relativeLuminance(hex: string) {
  const r = linearize(channel(hex, 0));
  const g = linearize(channel(hex, 2));
  const b = linearize(channel(hex, 4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(foreground: string, background: string) {
  const lighter = Math.max(relativeLuminance(foreground), relativeLuminance(background));
  const darker = Math.min(relativeLuminance(foreground), relativeLuminance(background));
  return (lighter + 0.05) / (darker + 0.05);
}

export function formatRatio(ratio: number) {
  return `${ratio.toFixed(2)}:1`;
}

export function mix(hex: string, target: string, amount: number) {
  const out = [0, 2, 4].map((index) => {
    const from = channel(hex, index);
    const to = channel(target, index);
    return Math.round(from + (to - from) * amount)
      .toString(16)
      .padStart(2, "0");
  });
  return out.join("").toUpperCase();
}

export function suggest(foreground: string, background: string) {
  const current = contrastRatio(foreground, background);
  if (current + 1e-9 >= 4.5) return { hex: null as string | null, ratio: null as number | null };
  const towardBlack = contrastRatio("000000", background);
  const towardWhite = contrastRatio("FFFFFF", background);
  const target = towardBlack >= towardWhite ? "000000" : "FFFFFF";
  if (Math.max(towardBlack, towardWhite) < 4.5) return { hex: null, ratio: null };
  let low = 0;
  let high = 1;
  let best = target;
  for (let step = 0; step < 16; step += 1) {
    const mid = (low + high) / 2;
    const candidate = mix(foreground, target, mid);
    if (contrastRatio(candidate, background) >= 4.5) {
      best = candidate;
      high = mid;
    } else low = mid;
  }
  return { hex: best, ratio: contrastRatio(best, background) };
}
