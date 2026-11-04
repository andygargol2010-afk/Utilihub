// Dedicated UI by slug, part 04 — created to keep files under ~3.5 KB.
// Add new entries in the smallest file of this folder; never rewrite files wholesale.
import type { ToolComp } from "./types";
import * as UI from "./components";

export const SLUG_UI_04: Record<string, ToolComp> = {
  "calculadora-line-height": UI.LineHeightCalculatorToolUi,
  "calculadora-porcentaje-a-letra": UI.PercentageToLetterGradeCalculatorToolUi,
  "calculadora-palabras-por-oracion": UI.WordsPerSentenceCalculatorToolUi,
  "media-geometrica": UI.GeometricMeanCalculatorToolUi,
  "calculadora-cagr": UI.CagrCalculatorToolUi,
  "calculadora-distancia-haversine": UI.GreatCircleDistanceCalculatorToolUi,
};
