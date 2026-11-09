import { type ContrastInput, type ContrastIssue, parseHex, type ContrastResult, type ContrastLevel } from "./contrast.part1";
import { contrastRatio, suggest, formatRatio } from "./contrast.part2";
export { emptyContrast, bodyPreset, borderlinePreset, failPreset } from "./contrast.part1";
export type { ContrastInput, ContrastIssue, ContrastLevel, ContrastResult } from "./contrast.part1";
export { relativeLuminance, contrastRatio, formatRatio } from "./contrast.part2";

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
