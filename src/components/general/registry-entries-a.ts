/**
 * Registry entries (A) — agents may append one object per new tool.
 * Keep this file small (< 10 KB). Do NOT write stub markers.
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
  { slug: "calculadora-raiz-cuadrada", name: "SquareRootCalculatorTool", path: "./SquareRootCalculatorTool", export: "SquareRootCalculatorTool" },
  { slug: "calculadora-media-armonica", name: "HarmonicMeanCalculatorTool", path: "./HarmonicMeanCalculatorTool", export: "HarmonicMeanCalculatorTool" },
  { slug: "calculadora-logaritmo", name: "LogarithmCalculatorTool", path: "./LogarithmCalculatorTool", export: "LogarithmCalculatorTool" },
  { slug: "calculadora-presion-atmosferica", name: "AtmosphericPressureCalculatorTool", path: "./AtmosphericPressureCalculatorTool", export: "AtmosphericPressureCalculatorTool" },
  { slug: "calculadora-longitud-media-palabra", name: "AverageWordLengthCalculatorTool", path: "./AverageWordLengthCalculatorTool", export: "AverageWordLengthCalculatorTool" },
  { slug: "calculadora-interes-diario", name: "DailyInterestCalculatorTool", path: "./DailyInterestCalculatorTool", export: "DailyInterestCalculatorTool" },
  { slug: "calculadora-ratio-trabajo-descanso", name: "WorkBreakRatioCalculatorTool", path: "./WorkBreakRatioCalculatorTool", export: "WorkBreakRatioCalculatorTool" },
  { slug: "calculadora-precio-unitario", name: "UnitPriceTool", path: "./UnitPriceTool", export: "UnitPriceTool" },
  { slug: "calculadora-agua-arroz", name: "RiceWaterCalculatorTool", path: "./RiceWaterCalculatorTool", export: "RiceWaterCalculatorTool" },
  { slug: "calculadora-media-aritmetica", name: "ArithmeticMeanCalculatorTool", path: "./ArithmeticMeanCalculatorTool", export: "ArithmeticMeanCalculatorTool" },
  { slug: "calculadora-mediana", name: "MedianCalculatorTool", path: "./MedianCalculatorTool", export: "MedianCalculatorTool" },
  { slug: "calculadora-factorial", name: "FactorialCalculatorTool", path: "./FactorialCalculatorTool", export: "FactorialCalculatorTool" },
  { slug: "calculadora-agua-diaria", name: "DailyWaterIntakeCalculatorTool", path: "./DailyWaterIntakeCalculatorTool", export: "DailyWaterIntakeCalculatorTool" },
  { slug: "calculadora-consumo-agua", name: "WaterConsumptionCalculatorTool", path: "./WaterConsumptionCalculatorTool", export: "WaterConsumptionCalculatorTool" },
  { slug: "calculadora-edad", name: "AgeCalculatorTool", path: "./AgeCalculatorTool", export: "AgeCalculatorTool" },
  { slug: "calculadora-propina", name: "TipCalculatorTool", path: "./TipCalculatorTool", export: "TipCalculatorTool" },
  { slug: "calculadora-gpa", name: "GpaCalculatorTool", path: "./GpaCalculatorTool", export: "GpaCalculatorTool" },
  { slug: "calculadora-area-habitacion", name: "RoomAreaCalculatorTool", path: "./RoomAreaCalculatorTool", export: "RoomAreaCalculatorTool" },
  { slug: "calculadora-px-rem", name: "PxToRemCalculatorTool", path: "./PxToRemCalculatorTool", export: "PxToRemCalculatorTool" },
  { slug: "calculadora-presupuesto-viaje-diario", name: "DailyTravelBudgetCalculatorTool", path: "./DailyTravelBudgetCalculatorTool", export: "DailyTravelBudgetCalculatorTool" },
  { slug: "calculadora-frecuencia-letras", name: "LetterFrequencyCalculatorTool", path: "./LetterFrequencyCalculatorTool", export: "LetterFrequencyCalculatorTool" },
  { slug: "calculadora-trabajo", name: "WorkCalculatorTool", path: "./WorkCalculatorTool", export: "WorkCalculatorTool" },
  { slug: "calculadora-volumen-cubo", name: "CubeVolumeCalculatorTool", path: "./CubeVolumeCalculatorTool", export: "CubeVolumeCalculatorTool" },
  { slug: "calculadora-area-triangulo", name: "TriangleAreaCalculatorTool", path: "./TriangleAreaCalculatorTool", export: "TriangleAreaCalculatorTool" },
  { slug: "calculadora-area-circulo", name: "CircleAreaCalculatorTool", path: "./CircleAreaCalculatorTool", export: "CircleAreaCalculatorTool" },
  { slug: "conversor-onzas-gramos", name: "OuncesToGramsConverterTool", path: "./OuncesToGramsConverterTool", export: "OuncesToGramsConverterTool" },
  { slug: "calculadora-peso-ideal", name: "IdealWeightCalculatorTool", path: "./IdealWeightCalculatorTool", export: "IdealWeightCalculatorTool" },
  { slug: "calculadora-potencia-electrica", name: "ElectricalPowerCalculatorTool", path: "./ElectricalPowerCalculatorTool", export: "ElectricalPowerCalculatorTool" },
  { slug: "calculadora-tiempo-vuelo", name: "FlightTimeCalculatorTool", path: "./FlightTimeCalculatorTool", export: "FlightTimeCalculatorTool" },
  { slug: "contador-silabas", name: "SyllableCounterTool", path: "./SyllableCounterTool", export: "SyllableCounterTool" },
  { slug: "calculadora-imc", name: "BmiCalculatorTool", path: "./BmiCalculatorTool", export: "BmiCalculatorTool" },
  { slug: "calculadora-iva", name: "IvaCalculatorTool", path: "./IvaCalculatorTool", export: "IvaCalculatorTool" },
  { slug: "conversor-kmh-ms", name: "KmhToMsConverterTool", path: "./KmhToMsConverterTool", export: "KmhToMsConverterTool" },
  { slug: "conversor-numeros-romanos", name: "RomanTool", path: "./RomanTool", export: "RomanTool" },
  { slug: "calculadora-ciclo-sueno", name: "SleepCycleTool", path: "./SleepCycleTool", export: "SleepCycleTool" },
  { slug: "generador-sombra-css", name: "BoxShadowTool", path: "./BoxShadowTool", export: "BoxShadowTool" },
  { slug: "calculadora-porcentaje-asistencia", name: "AttendancePercentageCalculatorTool", path: "./AttendancePercentageCalculatorTool", export: "AttendancePercentageCalculatorTool" },
  { slug: "calculadora-costo-por-km", name: "CostPerKmCalculatorTool", path: "./CostPerKmCalculatorTool", export: "CostPerKmCalculatorTool" },
] as const;
