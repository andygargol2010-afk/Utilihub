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
  { slug: "calculadora-perimetro-triangulo", name: "TrianglePerimeterCalculatorTool", path: "./TrianglePerimeterCalculatorTool", export: "TrianglePerimeterCalculatorTool" },
  { slug: "conversor-bytes", name: "BytesConverterTool", path: "./BytesConverterTool", export: "BytesConverterTool" },
  { slug: "calculadora-moda", name: "ModeCalculatorTool", path: "./ModeCalculatorTool", export: "ModeCalculatorTool" },
  { slug: "calculadora-horas-sueno", name: "SleepHoursCalculatorTool", path: "./SleepHoursCalculatorTool", export: "SleepHoursCalculatorTool" },
  { slug: "calculadora-imc", name: "BmiCalculatorTool", path: "./BmiCalculatorTool", export: "BmiCalculatorTool" },
  { slug: "conversor-metros-pies", name: "MetersToFeetConverterTool", path: "./MetersToFeetConverterTool", export: "MetersToFeetConverterTool" },
  { slug: "calculadora-media-geometrica", name: "GeometricMeanCalculatorTool", path: "./GeometricMeanCalculatorTool", export: "GeometricMeanCalculatorTool" },
  { slug: "calculadora-porcentaje-aumento", name: "PercentageIncreaseCalculatorTool", path: "./PercentageIncreaseCalculatorTool", export: "PercentageIncreaseCalculatorTool" },
  { slug: "calculadora-porcentaje-de-numero", name: "PercentageOfNumberCalculatorTool", path: "./PercentageOfNumberCalculatorTool", export: "PercentageOfNumberCalculatorTool" },
  { slug: "conversor-celsius-a-fahrenheit", name: "CelsiusFahrenheitConverterTool", path: "./CelsiusFahrenheitConverterTool", export: "CelsiusFahrenheitConverterTool" },
  { slug: "calculadora-descuento", name: "PercentageDiscountCalculatorTool", path: "./PercentageDiscountCalculatorTool", export: "PercentageDiscountCalculatorTool" },
  { slug: "calculadora-consumo-viaje", name: "TripFuelConsumptionCalculatorTool", path: "./TripFuelConsumptionCalculatorTool", export: "TripFuelConsumptionCalculatorTool" },
  { slug: "calculadora-horas-estudio", name: "StudyHoursCalculatorTool", path: "./StudyHoursCalculatorTool", export: "StudyHoursCalculatorTool" },
  { slug: "calculadora-dias-vacaciones", name: "VacationDaysCalculatorTool", path: "./VacationDaysCalculatorTool", export: "VacationDaysCalculatorTool" },
  { slug: "calculadora-raiz-cuadrada", name: "SquareRootCalculatorTool", path: "./SquareRootCalculatorTool", export: "SquareRootCalculatorTool" },
  { slug: "calculadora-media-armonica", name: "HarmonicMeanCalculatorTool", path: "./HarmonicMeanCalculatorTool", export: "HarmonicMeanCalculatorTool" },
  { slug: "calculadora-raiz-cubica", name: "CubeRootCalculatorTool", path: "./CubeRootCalculatorTool", export: "CubeRootCalculatorTool" },
  { slug: "conversor-pulgadas-cm", name: "InchesToCmConverterTool", path: "./InchesToCmConverterTool", export: "InchesToCmConverterTool" },
  { slug: "calculadora-ratio-trabajo-descanso", name: "WorkBreakRatioCalculatorTool", path: "./WorkBreakRatioCalculatorTool", export: "WorkBreakRatioCalculatorTool" },
  { slug: "calculadora-agua-arroz", name: "RiceWaterCalculatorTool", path: "./RiceWaterCalculatorTool", export: "RiceWaterCalculatorTool" },
  { slug: "conversor-yardas-metros", name: "YardsToMetersConverterTool", path: "./YardsToMetersConverterTool", export: "YardsToMetersConverterTool" },
  { slug: "calculadora-gasto-diario", name: "DailySpendingCalculatorTool", path: "./DailySpendingCalculatorTool", export: "DailySpendingCalculatorTool" },
  { slug: "calculadora-logaritmo", name: "LogarithmCalculatorTool", path: "./LogarithmCalculatorTool", export: "LogarithmCalculatorTool" },
  { slug: "calculadora-presion-atmosferica", name: "AtmosphericPressureCalculatorTool", path: "./AtmosphericPressureCalculatorTool", export: "AtmosphericPressureCalculatorTool" },
  { slug: "calculadora-longitud-promedio-palabra", name: "AverageWordLengthCalculatorTool", path: "./AverageWordLengthCalculatorTool", export: "AverageWordLengthCalculatorTool" },
  { slug: "calculadora-interes-diario", name: "DailyInterestCalculatorTool", path: "./DailyInterestCalculatorTool", export: "DailyInterestCalculatorTool" },
  { slug: "calculadora-ingesta-agua-diaria", name: "DailyWaterIntakeCalculatorTool", path: "./DailyWaterIntakeCalculatorTool", export: "DailyWaterIntakeCalculatorTool" },
  { slug: "calculadora-edad", name: "AgeCalculatorTool", path: "./AgeCalculatorTool", export: "AgeCalculatorTool" },
  { slug: "calculadora-propina", name: "TipCalculatorTool", path: "./TipCalculatorTool", export: "TipCalculatorTool" },
  { slug: "calculadora-gpa", name: "GpaCalculatorTool", path: "./GpaCalculatorTool", export: "GpaCalculatorTool" },
  { slug: "calculadora-area-rectangular", name: "RoomAreaCalculatorTool", path: "./RoomAreaCalculatorTool", export: "RoomAreaCalculatorTool" },
  { slug: "calculadora-px-a-rem", name: "PxToRemCalculatorTool", path: "./PxToRemCalculatorTool", export: "PxToRemCalculatorTool" },
  { slug: "calculadora-presupuesto-diario-viaje", name: "DailyTravelBudgetCalculatorTool", path: "./DailyTravelBudgetCalculatorTool", export: "DailyTravelBudgetCalculatorTool" },
] as const;
