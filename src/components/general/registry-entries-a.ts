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
] as const;
