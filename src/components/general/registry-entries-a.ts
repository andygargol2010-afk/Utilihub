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
] as const;
