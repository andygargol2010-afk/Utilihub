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
  "conversor-kcal-kj": UI.KcalKjConverterToolUi,
  "calculadora-escalado-receta": UI.RecipeScalerCalculatorToolUi,
  "calculadora-peso-objetivo-imc": UI.TargetWeightByBmiCalculatorToolUi,
  "calculadora-tasa-efectiva-anual": UI.EffectiveAnnualRateCalculatorToolUi,
  "ley-de-ohm": UI.OhmsLawCalculatorToolUi,
  "calculadora-meses-entre-fechas": UI.MonthsBetweenDatesCalculatorToolUi,
  "calculadora-area-paralelogramo": UI.ParallelogramAreaCalculatorToolUi,
  "calculadora-escala-modular": UI.ModularScaleCalculatorToolUi,
  "calculadora-area-trapecio": UI.TrapezoidAreaCalculatorToolUi,
  "calculadora-area-rombo": UI.RhombusAreaCalculatorToolUi,
  "calculadora-palabras-unicas": UI.UniqueWordsCalculatorToolUi,
  "calculadora-letra-a-porcentaje": UI.LetterToPercentageCalculatorToolUi,
  "calculadora-tiempo-estimado-llegada": UI.EstimatedArrivalTimeCalculatorToolUi,
  "conversor-grados-a-radianes": UI.DegreesToRadiansConverterToolUi,
  "calculadora-arroz-crudo-a-cocido": UI.UncookedToCookedRiceCalculatorToolUi,
};
