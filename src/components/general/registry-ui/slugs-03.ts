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
  "calculadora-interes-simple": UI.SimpleInterestCalculatorToolUi,
  "calculadora-factor-de-escala": UI.ScaleFactorCalculatorToolUi,
  "calculadora-descuento-sucesivo": UI.SuccessiveDiscountCalculatorToolUi,
  "calculadora-imc": UI.BmiCalculatorToolUi,
  "calculadora-porcentaje-de-numero": UI.PercentageOfNumberCalculatorToolUi,
  "calculadora-markup": UI.MarkupCalculatorToolUi,
  "calculadora-precio-por-unidad": UI.UnitPriceCalculatorToolUi,
  "calculadora-tasa-de-ahorro": UI.SavingsRateCalculatorToolUi,
  "calculadora-iva": UI.IvaCalculatorToolUi,
  "calculadora-tiempo-de-lectura": UI.ReadingTimeCalculatorToolUi,
  "conversor-cucharadas-ml": UI.TablespoonMlConverterToolUi,
  "conversor-onzas-ml": UI.FluidOuncesMlConverterToolUi,
  "conversor-tazas-ml": UI.CupsMlConverterToolUi,
  "conversor-celsius-kelvin": UI.CelsiusKelvinConverterToolUi,
  "conversor-gramos-libras": UI.GramsToPoundsConverterToolUi,
  "calculadora-caudal": UI.FlowRateCalculatorToolUi,
  "calculadora-cuota-prestamo": UI.LoanMonthlyPaymentCalculatorToolUi,
  "calculadora-perimetro-rectangulo": UI.RectanglePerimeterCalculatorToolUi,
  "calculadora-media-ponderada": UI.WeightedAverageCalculatorToolUi,
  "calculadora-media-cuadratica": UI.QuadraticMeanCalculatorToolUi,
  "calculadora-desviacion-absoluta-media": UI.MeanAbsoluteDeviationCalculatorToolUi,
  "calculadora-media-armonica": UI.HarmonicMeanCalculatorToolUi,
  "calculadora-media-geometrica": UI.GeometricMeanCalculatorToolUi,
  "calculadora-mediana": UI.MedianCalculatorToolUi,
  "calculadora-rango-estadistico": UI.StatisticalRangeCalculatorToolUi,
  "calculadora-moda": UI.ModeCalculatorToolUi,
};
