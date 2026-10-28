// Dedicated UI by slug, part 03 — further split 2026-10-28 to keep files under ~3.5 KB.
// Add new entries in the smallest file of this folder; never rewrite files wholesale.
import type { ToolComp } from "./types";
import * as UI from "./components";

export const SLUG_UI_03: Record<string, ToolComp> = {
  "calculadora-oraciones-por-parrafo": UI.SentencesPerParagraphCalculatorToolUi,
  "calculadora-hipotenusa": UI.HypotenuseCalculatorToolUi,
  "calculadora-promedio-simple": UI.SimpleAverageCalculatorToolUi,
  "calculadora-cambio-porcentual": UI.PercentageChangeCalculatorToolUi,
  "calculadora-regla-de-tres": UI.RuleOfThreeCalculatorToolUi,
};
