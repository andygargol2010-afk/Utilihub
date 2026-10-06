/** WCAG 2.x contrast ratio from sRGB relative luminance. */

export type ContrastInput = { foreground: string; background: string };

export type ContrastIssue = { field: string; message: string };

export type ContrastLevel = "fail" | "aa-large" | "aa" | "aaa";

export type ContrastResult = {
  foreground: string;
  background: string;
  ratio: number;
  ratioLabel: string;
  normalAa: boolean;
  normalAaa: boolean;
  largeAa: boolean;
  largeAaa: boolean;
  uiAa: boolean;
  level: ContrastLevel;
  suggestion: string | null;
  suggestionRatio: number | null;
};

export function emptyContrast(): ContrastInput {
  return { foreground: "", background: "" };
}

export function bodyPreset(): ContrastInput {
  return { foreground: "#0F172A", background: "#FFFFFF" };
}

export function borderlinePreset(): ContrastInput {
  return { foreground: "#767676", background: "#FFFFFF" };
}

export function failPreset(): ContrastInput {
  return { foreground: "#FF6B6B", background: "#FFFFFF" };
}

function parseHex(value: string): { ok: true; hex: string } | { ok: false; reason: "empty" | "bad" } {
  const trimmed = value.trim();
  if (!trimmed) return { ok: false, reason: "empty" };
  const raw = trimmed.startsWith("#") ? trimmed.slice(1) : trimmed;
  if (!/^[0-9a-fA-F]+$/.test(raw)) return { ok: false, reason: "bad" };
  if (raw.length === 3) {
    const hex = raw.split("").map((c) => c + c).join("");
    return { ok: true, hex: hex.toUpperCase() };
  }
  if (raw.length === 6) return { ok: true, hex: raw.toUpperCase() };
  return { ok: false, reason: "bad" };
}

function channel(hex: string, index: number) {
  return Number.parseInt(hex.slice(index, index + 2), 16);
}

function linearize(channelValue: number) {
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

function mix(hex: string, target: string, amount: number) {
  const out = [0, 2, 4].map((index) => {
    const from = channel(hex, index);
    const to = channel(target, index);
    return Math.round(from + (to - from) * amount)
      .toString(16)
      .padStart(2, "0");
  });
  return out.join("").toUpperCase();
}

function suggest(foreground: string, background: string) {
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

export function validateContrast(input: ContrastInput, es: boolean): ContrastIssue[] {
  const issues: ContrastIssue[] = [];
  const fg = parseHex(input.foreground);
  const bg = parseHex(input.background);
  if (!fg.ok && fg.reason === "empty" && !bg.ok && bg.reason === "empty") {
    issues.push({
      field: "foreground",
      message: es ? "Los dos colores están vacíos. Ingresá un hex o cargá un preset." : "Both colors are empty. Enter a hex or load a preset.",
    });
    return issues;
  }
  if (!fg.ok) {
    issues.push({
      field: "foreground",
      message: fg.reason === "empty"
        ? es ? "Falta el color del texto." : "Text color is empty."
        : es ? "El texto no es un hex válido (#RGB o #RRGGBB). NaN y signos no aplican." : "Text color is not a valid hex (#RGB or #RRGGBB). NaN and signs do not apply.",
    });
  }
  if (!bg.ok) {
    issues.push({
      field: "background",
      message: bg.reason === "empty"
        ? es ? "Falta el color de fondo." : "Background color is empty."
        : es ? "El fondo no es un hex válido (#RGB o #RRGGBB)." : "Background is not a valid hex (#RGB or #RRGGBB).",
    });
  }
  return issues;
}

export function computeContrast(input: ContrastInput): ContrastResult | null {
  if (validateContrast(input, false).length) return null;
  const foreground = parseHex(input.foreground);
  const background = parseHex(input.background);
  if (!foreground.ok || !background.ok) return null;
  const ratio = contrastRatio(foreground.hex, background.hex);
  const normalAa = ratio >= 4.5;
  const normalAaa = ratio >= 7;
  const largeAa = ratio >= 3;
  const largeAaa = ratio >= 4.5;
  const uiAa = ratio >= 3;
  const level: ContrastLevel = normalAaa ? "aaa" : normalAa ? "aa" : largeAa ? "aa-large" : "fail";
  const suggestion = suggest(foreground.hex, background.hex);
  return {
    foreground: `#${foreground.hex}`,
    background: `#${background.hex}`,
    ratio,
    ratioLabel: formatRatio(ratio),
    normalAa,
    normalAaa,
    largeAa,
    largeAaa,
    uiAa,
    level,
    suggestion: suggestion.hex ? `#${suggestion.hex}` : null,
    suggestionRatio: suggestion.ratio,
  };
}
