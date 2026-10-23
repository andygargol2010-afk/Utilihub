/**
 * Registry entries (A) — agents may append one object per new tool.
 * Keep this file small (< 10 KB). Do NOT write PLACEHOLDER.
 */
export type RegistryEntry = {
  slug: string;
  name: string;
  path: string;
  export: string;
};

export const REGISTRY_ENTRIES_A: readonly RegistryEntry[] = [
  { slug: "calculadora-roi", name: "RoiCalculatorTool", path: "./RoiCalculatorTool", export: "RoiCalculatorTool" },
  { slug: "calculadora-dpi", name: "DpiCalculatorTool", path: "./DpiCalculatorTool", export: "DpiCalculatorTool" },
  { slug: "calculadora-pendiente", name: "SlopeCalculatorTool", path: "./SlopeCalculatorTool", export: "SlopeCalculatorTool" },
  { slug: "contador-lineas", name: "LineCounterTool", path: "./LineCounterTool", export: "LineCounterTool" },
  { slug: "calculadora-interes-compuesto", name: "CompoundInterestCalculatorTool", path: "./CompoundInterestCalculatorTool", export: "CompoundInterestCalculatorTool" },
  { slug: "calculadora-calorias-diarias", name: "DailyCaloriesCalculatorTool", path: "./DailyCaloriesCalculatorTool", export: "DailyCaloriesCalculatorTool" },
  { slug: "calculadora-desviacion-estandar", name: "StandardDeviationCalculatorTool", path: "./StandardDeviationCalculatorTool", export: "StandardDeviationCalculatorTool" },
  { slug: "calculadora-volumen-cono", name: "ConeVolumeCalculatorTool", path: "./ConeVolumeCalculatorTool", export: "ConeVolumeCalculatorTool" },
  { slug: "calculadora-horas-entre-fechas", name: "HoursBetweenDatesCalculatorTool", path: "./HoursBetweenDatesCalculatorTool", export: "HoursBetweenDatesCalculatorTool" },
  { slug: "calculadora-palabras-por-minuto", name: "WordsPerMinuteCalculatorTool", path: "./WordsPerMinuteCalculatorTool", export: "WordsPerMinuteCalculatorTool" },
  { slug: "calculadora-area-superficie-esfera", name: "SphereSurfaceAreaCalculatorTool", path: "./SphereSurfaceAreaCalculatorTool", export: "SphereSurfaceAreaCalculatorTool" },
  { slug: "calculadora-perimetro-cuadrado", name: "SquarePerimeterCalculatorTool", path: "./SquarePerimeterCalculatorTool", export: "SquarePerimeterCalculatorTool" },
  { slug: "conversor-millas-km", name: "MilesToKmConverterTool", path: "./MilesToKmConverterTool", export: "MilesToKmConverterTool" },
  { slug: "calculadora-aumento-salarial", name: "SalaryRaiseCalculatorTool", path: "./SalaryRaiseCalculatorTool", export: "SalaryRaiseCalculatorTool" },
  { slug: "calculadora-consumo-gas", name: "GasConsumptionCalculatorTool", path: "./GasConsumptionCalculatorTool", export: "GasConsumptionCalculatorTool" },
  { slug: "calculadora-ratio-dorado", name: "GoldenRatioCalculatorTool", path: "./GoldenRatioCalculatorTool", export: "GoldenRatioCalculatorTool" },
  { slug: "conversor-texto-slug", name: "TextToSlugConverterTool", path: "./TextToSlugConverterTool", export: "TextToSlugConverterTool" },
  { slug: "calculadora-dias-habiles", name: "BusinessDaysCalculatorTool", path: "./BusinessDaysCalculatorTool", export: "BusinessDaysCalculatorTool" },
  { slug: "calculadora-caudal", name: "FlowRateCalculatorTool", path: "./FlowRateCalculatorTool", export: "FlowRateCalculatorTool" },
] as const;
