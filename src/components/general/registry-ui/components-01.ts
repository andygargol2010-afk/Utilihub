// Lazy tool UIs part 01 — split out of ../registry.tsx on 2026-10-28.
// Add new entries in the smallest file of this folder; never rewrite files wholesale.
import { lazy } from "react";

export const GeneralToolUi = lazy(() =>
  import("../GeneralTool").then((m) => ({ default: m.GeneralTool })),
);

export const ConfiguredToolUi = lazy(() =>
  import("../ConfiguredTool").then((m) => ({ default: m.ConfiguredTool })),
);

export const MediaToolUi = lazy(() =>
  import("../MediaTool").then((m) => ({ default: m.MediaTool })),
);

export const DesignToolUi = lazy(() =>
  import("../DesignTool").then((m) => ({ default: m.DesignTool })),
);

export const DocumentToolUi = lazy(() =>
  import("../DocumentTool").then((m) => ({ default: m.DocumentTool })),
);

export const ConverterToolUi = lazy(() =>
  import("../ConverterTool").then((m) => ({ default: m.ConverterTool })),
);

export const TextToolUi = lazy(() =>
  import("../TextTool").then((m) => ({ default: m.TextTool })),
);

export const MathToolUi = lazy(() =>
  import("../MathTool").then((m) => ({ default: m.MathTool })),
);

export const FinanceToolUi = lazy(() =>
  import("../FinanceTool").then((m) => ({ default: m.FinanceTool })),
);

export const ScienceToolUi = lazy(() =>
  import("../ScienceTool").then((m) => ({ default: m.ScienceTool })),
);

export const TimeToolUi = lazy(() =>
  import("../TimeTool").then((m) => ({ default: m.TimeTool })),
);

export const EducationToolUi = lazy(() =>
  import("../EducationTool").then((m) => ({ default: m.EducationTool })),
);

export const SecurityToolUi = lazy(() =>
  import("../SecurityTool").then((m) => ({ default: m.SecurityTool })),
);

export const FormulaToolUi = lazy(() =>
  import("../FormulaTool").then((m) => ({ default: m.FormulaTool })),
);

export const GeneratorToolUi = lazy(() =>
  import("../GeneratorTool").then((m) => ({ default: m.GeneratorTool })),
);

export const DevToolUi = lazy(() =>
  import("../DevTool").then((m) => ({ default: m.DevTool })),
);

export const LetterFrequencyCalculatorToolUi = lazy(() =>
  import("../LetterFrequencyCalculatorTool").then((m) => ({ default: m.LetterFrequencyCalculatorTool })),
);

export const WorkCalculatorToolUi = lazy(() =>
  import("../WorkCalculatorTool").then((m) => ({ default: m.WorkCalculatorTool })),
);

export const RuleOfThreeCalculatorToolUi = lazy(() =>
  import("../RuleOfThreeCalculatorTool").then((m) => ({ default: m.RuleOfThreeCalculatorTool })),
);

export const OvertimeCalculatorToolUi = lazy(() =>
  import("../OvertimeCalculatorTool").then((m) => ({ default: m.OvertimeCalculatorTool })),
);

export const CubeVolumeCalculatorToolUi = lazy(() =>
  import("../CubeVolumeCalculatorTool").then((m) => ({ default: m.CubeVolumeCalculatorTool })),
);

export const TriangleAreaCalculatorToolUi = lazy(() =>
  import("../TriangleAreaCalculatorTool").then((m) => ({ default: m.TriangleAreaCalculatorTool })),
);

export const CircleAreaCalculatorToolUi = lazy(() =>
  import("../CircleAreaCalculatorTool").then((m) => ({ default: m.CircleAreaCalculatorTool })),
);

export const OuncesToGramsConverterToolUi = lazy(() =>
  import("../OuncesToGramsConverterTool").then((m) => ({ default: m.OuncesToGramsConverterTool })),
);

export const IdealWeightCalculatorToolUi = lazy(() =>
  import("../IdealWeightCalculatorTool").then((m) => ({ default: m.IdealWeightCalculatorTool })),
);

export const ElectricalPowerCalculatorToolUi = lazy(() =>
  import("../ElectricalPowerCalculatorTool").then((m) => ({ default: m.ElectricalPowerCalculatorTool })),
);

export const FlightTimeCalculatorToolUi = lazy(() =>
  import("../FlightTimeCalculatorTool").then((m) => ({ default: m.FlightTimeCalculatorTool })),
);

export const SlopeCalculatorToolUi = lazy(() =>
  import("../SlopeCalculatorTool").then((m) => ({ default: m.SlopeCalculatorTool })),
);

export const LineCounterToolUi = lazy(() =>
  import("../LineCounterTool").then((m) => ({ default: m.LineCounterTool })),
);

export const CompoundInterestCalculatorToolUi = lazy(() =>
  import("../CompoundInterestCalculatorTool").then((m) => ({ default: m.CompoundInterestCalculatorTool })),
);

export const DailyCaloriesCalculatorToolUi = lazy(() =>
  import("../DailyCaloriesCalculatorTool").then((m) => ({ default: m.DailyCaloriesCalculatorTool })),
);

export const StandardDeviationCalculatorToolUi = lazy(() =>
  import("../StandardDeviationCalculatorTool").then((m) => ({ default: m.StandardDeviationCalculatorTool })),
);

export const ConeVolumeCalculatorToolUi = lazy(() =>
  import("../ConeVolumeCalculatorTool").then((m) => ({ default: m.ConeVolumeCalculatorTool })),
);

export const HoursBetweenDatesCalculatorToolUi = lazy(() =>
  import("../HoursBetweenDatesCalculatorTool").then((m) => ({ default: m.HoursBetweenDatesCalculatorTool })),
);

export const WordsPerMinuteCalculatorToolUi = lazy(() =>
  import("../WordsPerMinuteCalculatorTool").then((m) => ({ default: m.WordsPerMinuteCalculatorTool })),
);

export const SyllableCounterToolUi = lazy(() =>
  import("../SyllableCounterTool").then((m) => ({ default: m.SyllableCounterTool })),
);

export const RoiCalculatorToolUi = lazy(() =>
  import("../RoiCalculatorTool").then((m) => ({ default: m.RoiCalculatorTool })),
);

export const BmiCalculatorToolUi = lazy(() =>
  import("../BmiCalculatorTool").then((m) => ({ default: m.BmiCalculatorTool })),
);

export const SquareRootCalculatorToolUi = lazy(() =>
  import("../SquareRootCalculatorTool").then((m) => ({ default: m.SquareRootCalculatorTool })),
);

export const HarmonicMeanCalculatorToolUi = lazy(() =>
  import("../HarmonicMeanCalculatorTool").then((m) => ({ default: m.HarmonicMeanCalculatorTool })),
);

export const LogarithmCalculatorToolUi = lazy(() =>
  import("../LogarithmCalculatorTool").then((m) => ({ default: m.LogarithmCalculatorTool })),
);

export const AtmosphericPressureCalculatorToolUi = lazy(() =>
  import("../AtmosphericPressureCalculatorTool").then((m) => ({ default: m.AtmosphericPressureCalculatorTool })),
);

export const AverageWordLengthCalculatorToolUi = lazy(() =>
  import("../AverageWordLengthCalculatorTool").then((m) => ({ default: m.AverageWordLengthCalculatorTool })),
);

export const DailyInterestCalculatorToolUi = lazy(() =>
  import("../DailyInterestCalculatorTool").then((m) => ({ default: m.DailyInterestCalculatorTool })),
);

export const WorkBreakRatioCalculatorToolUi = lazy(() =>
  import("../WorkBreakRatioCalculatorTool").then((m) => ({ default: m.WorkBreakRatioCalculatorTool })),
);

export const UnitPriceToolUi = lazy(() =>
  import("../UnitPriceTool").then((m) => ({ default: m.UnitPriceTool })),
);

export const RiceWaterCalculatorToolUi = lazy(() =>
  import("../RiceWaterCalculatorTool").then((m) => ({ default: m.RiceWaterCalculatorTool })),
);

export const ArithmeticMeanCalculatorToolUi = lazy(() =>
  import("../ArithmeticMeanCalculatorTool").then((m) => ({ default: m.ArithmeticMeanCalculatorTool })),
);

export const MedianCalculatorToolUi = lazy(() =>
  import("../MedianCalculatorTool").then((m) => ({ default: m.MedianCalculatorTool })),
);

export const FactorialCalculatorToolUi = lazy(() =>
  import("../FactorialCalculatorTool").then((m) => ({ default: m.FactorialCalculatorTool })),
);
