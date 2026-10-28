import { lazy, type ComponentType, type ReactNode } from "react";
import { GENERAL_TOOLS } from "@/lib/general";
import type { GeneralTool } from "@/lib/general/types";

/**
 * Thin registry — agents should almost never edit this file.
 *
 * Contract with DeferredToolUi:
 *   GENERAL_TOOL_UI[slug] must be a zero-arg function () => ReactNode
 *   that already closes over the tool + locale.
 *
 * Routing priority:
 *   1. kind image/pdf/media → MediaTool
 *   2. kind document → DocumentTool (must beat config.operation)
 *   3. design/color (kind or slug) → DesignTool
 *   4. config.operation (numeric) → ConfiguredTool
 *   5. other kinds → category tools
 *   6. else → GeneralTool
 */

const TOOL_BY_SLUG = new Map(GENERAL_TOOLS.map((t) => [t.slug, t]));

type ToolComp = ComponentType<{ tool: GeneralTool; locale?: "en" | "es" }>;

const GeneralToolUi = lazy(() =>
  import("./GeneralTool").then((m) => ({ default: m.GeneralTool })),
);
const ConfiguredToolUi = lazy(() =>
  import("./ConfiguredTool").then((m) => ({ default: m.ConfiguredTool })),
);
const MediaToolUi = lazy(() =>
  import("./MediaTool").then((m) => ({ default: m.MediaTool })),
);
const DesignToolUi = lazy(() =>
  import("./DesignTool").then((m) => ({ default: m.DesignTool })),
);
const DocumentToolUi = lazy(() =>
  import("./DocumentTool").then((m) => ({ default: m.DocumentTool })),
);
const ConverterToolUi = lazy(() =>
  import("./ConverterTool").then((m) => ({ default: m.ConverterTool })),
);
const TextToolUi = lazy(() =>
  import("./TextTool").then((m) => ({ default: m.TextTool })),
);
const MathToolUi = lazy(() =>
  import("./MathTool").then((m) => ({ default: m.MathTool })),
);
const FinanceToolUi = lazy(() =>
  import("./FinanceTool").then((m) => ({ default: m.FinanceTool })),
);
const ScienceToolUi = lazy(() =>
  import("./ScienceTool").then((m) => ({ default: m.ScienceTool })),
);
const TimeToolUi = lazy(() =>
  import("./TimeTool").then((m) => ({ default: m.TimeTool })),
);
const EducationToolUi = lazy(() =>
  import("./EducationTool").then((m) => ({ default: m.EducationTool })),
);
const SecurityToolUi = lazy(() =>
  import("./SecurityTool").then((m) => ({ default: m.SecurityTool })),
);
const FormulaToolUi = lazy(() =>
  import("./FormulaTool").then((m) => ({ default: m.FormulaTool })),
);
const GeneratorToolUi = lazy(() =>
  import("./GeneratorTool").then((m) => ({ default: m.GeneratorTool })),
);
const DevToolUi = lazy(() =>
  import("./DevTool").then((m) => ({ default: m.DevTool })),
);

const LetterFrequencyCalculatorToolUi = lazy(() =>
  import("./LetterFrequencyCalculatorTool").then((m) => ({ default: m.LetterFrequencyCalculatorTool })),
);
const WorkCalculatorToolUi = lazy(() =>
  import("./WorkCalculatorTool").then((m) => ({ default: m.WorkCalculatorTool })),
);
const RuleOfThreeCalculatorToolUi = lazy(() =>
  import("./RuleOfThreeCalculatorTool").then((m) => ({ default: m.RuleOfThreeCalculatorTool })),
);
const OvertimeCalculatorToolUi = lazy(() =>
  import("./OvertimeCalculatorTool").then((m) => ({ default: m.OvertimeCalculatorTool })),
);
const CubeVolumeCalculatorToolUi = lazy(() =>
  import("./CubeVolumeCalculatorTool").then((m) => ({ default: m.CubeVolumeCalculatorTool })),
);
const TriangleAreaCalculatorToolUi = lazy(() =>
  import("./TriangleAreaCalculatorTool").then((m) => ({ default: m.TriangleAreaCalculatorTool })),
);
const CircleAreaCalculatorToolUi = lazy(() =>
  import("./CircleAreaCalculatorTool").then((m) => ({ default: m.CircleAreaCalculatorTool })),
);
const OuncesToGramsConverterToolUi = lazy(() =>
  import("./OuncesToGramsConverterTool").then((m) => ({ default: m.OuncesToGramsConverterTool })),
);
const IdealWeightCalculatorToolUi = lazy(() =>
  import("./IdealWeightCalculatorTool").then((m) => ({ default: m.IdealWeightCalculatorTool })),
);
const ElectricalPowerCalculatorToolUi = lazy(() =>
  import("./ElectricalPowerCalculatorTool").then((m) => ({ default: m.ElectricalPowerCalculatorTool })),
);
const FlightTimeCalculatorToolUi = lazy(() =>
  import("./FlightTimeCalculatorTool").then((m) => ({ default: m.FlightTimeCalculatorTool })),
);
const SlopeCalculatorToolUi = lazy(() =>
  import("./SlopeCalculatorTool").then((m) => ({ default: m.SlopeCalculatorTool })),
);
const LineCounterToolUi = lazy(() =>
  import("./LineCounterTool").then((m) => ({ default: m.LineCounterTool })),
);
const CompoundInterestCalculatorToolUi = lazy(() =>
  import("./CompoundInterestCalculatorTool").then((m) => ({ default: m.CompoundInterestCalculatorTool })),
);
const DailyCaloriesCalculatorToolUi = lazy(() =>
  import("./DailyCaloriesCalculatorTool").then((m) => ({ default: m.DailyCaloriesCalculatorTool })),
);
const StandardDeviationCalculatorToolUi = lazy(() =>
  import("./StandardDeviationCalculatorTool").then((m) => ({ default: m.StandardDeviationCalculatorTool })),
);
const ConeVolumeCalculatorToolUi = lazy(() =>
  import("./ConeVolumeCalculatorTool").then((m) => ({ default: m.ConeVolumeCalculatorTool })),
);
const HoursBetweenDatesCalculatorToolUi = lazy(() =>
  import("./HoursBetweenDatesCalculatorTool").then((m) => ({ default: m.HoursBetweenDatesCalculatorTool })),
);
const WordsPerMinuteCalculatorToolUi = lazy(() =>
  import("./WordsPerMinuteCalculatorTool").then((m) => ({ default: m.WordsPerMinuteCalculatorTool })),
);
const SyllableCounterToolUi = lazy(() =>
  import("./SyllableCounterTool").then((m) => ({ default: m.SyllableCounterTool })),
);
const RoiCalculatorToolUi = lazy(() =>
  import("./RoiCalculatorTool").then((m) => ({ default: m.RoiCalculatorTool })),
);
const BmiCalculatorToolUi = lazy(() =>
  import("./BmiCalculatorTool").then((m) => ({ default: m.BmiCalculatorTool })),
);
const SquareRootCalculatorToolUi = lazy(() =>
  import("./SquareRootCalculatorTool").then((m) => ({ default: m.SquareRootCalculatorTool })),
);
const HarmonicMeanCalculatorToolUi = lazy(() =>
  import("./HarmonicMeanCalculatorTool").then((m) => ({ default: m.HarmonicMeanCalculatorTool })),
);
const LogarithmCalculatorToolUi = lazy(() =>
  import("./LogarithmCalculatorTool").then((m) => ({ default: m.LogarithmCalculatorTool })),
);
const AtmosphericPressureCalculatorToolUi = lazy(() =>
  import("./AtmosphericPressureCalculatorTool").then((m) => ({ default: m.AtmosphericPressureCalculatorTool })),
);
const AverageWordLengthCalculatorToolUi = lazy(() =>
  import("./AverageWordLengthCalculatorTool").then((m) => ({ default: m.AverageWordLengthCalculatorTool })),
);
const DailyInterestCalculatorToolUi = lazy(() =>
  import("./DailyInterestCalculatorTool").then((m) => ({ default: m.DailyInterestCalculatorTool })),
);
const WorkBreakRatioCalculatorToolUi = lazy(() =>
  import("./WorkBreakRatioCalculatorTool").then((m) => ({ default: m.WorkBreakRatioCalculatorTool })),
);
const UnitPriceToolUi = lazy(() =>
  import("./UnitPriceTool").then((m) => ({ default: m.UnitPriceTool })),
);
const RiceWaterCalculatorToolUi = lazy(() =>
  import("./RiceWaterCalculatorTool").then((m) => ({ default: m.RiceWaterCalculatorTool })),
);
const ArithmeticMeanCalculatorToolUi = lazy(() =>
  import("./ArithmeticMeanCalculatorTool").then((m) => ({ default: m.ArithmeticMeanCalculatorTool })),
);
const MedianCalculatorToolUi = lazy(() =>
  import("./MedianCalculatorTool").then((m) => ({ default: m.MedianCalculatorTool })),
);
const FactorialCalculatorToolUi = lazy(() =>
  import("./FactorialCalculatorTool").then((m) => ({ default: m.FactorialCalculatorTool })),
);
const DailyWaterIntakeCalculatorToolUi = lazy(() =>
  import("./DailyWaterIntakeCalculatorTool").then((m) => ({ default: m.DailyWaterIntakeCalculatorTool })),
);
const WaterConsumptionCalculatorToolUi = lazy(() =>
  import("./WaterConsumptionCalculatorTool").then((m) => ({ default: m.WaterConsumptionCalculatorTool })),
);
const SphereSurfaceAreaCalculatorToolUi = lazy(() =>
  import("./SphereSurfaceAreaCalculatorTool").then((m) => ({ default: m.SphereSurfaceAreaCalculatorTool })),
);
const SquarePerimeterCalculatorToolUi = lazy(() =>
  import("./SquarePerimeterCalculatorTool").then((m) => ({ default: m.SquarePerimeterCalculatorTool })),
);
const AgeCalculatorToolUi = lazy(() =>
  import("./AgeCalculatorTool").then((m) => ({ default: m.AgeCalculatorTool })),
);
const TipCalculatorToolUi = lazy(() =>
  import("./TipCalculatorTool").then((m) => ({ default: m.TipCalculatorTool })),
);
const GpaCalculatorToolUi = lazy(() =>
  import("./GpaCalculatorTool").then((m) => ({ default: m.GpaCalculatorTool })),
);
const RoomAreaCalculatorToolUi = lazy(() =>
  import("./RoomAreaCalculatorTool").then((m) => ({ default: m.RoomAreaCalculatorTool })),
);
const PxToRemCalculatorToolUi = lazy(() =>
  import("./PxToRemCalculatorTool").then((m) => ({ default: m.PxToRemCalculatorTool })),
);
const DailyTravelBudgetCalculatorToolUi = lazy(() =>
  import("./DailyTravelBudgetCalculatorTool").then((m) => ({ default: m.DailyTravelBudgetCalculatorTool })),
);
const PercentageDifferenceCalculatorToolUi = lazy(() =>
  import("./PercentageDifferenceCalculatorTool").then((m) => ({ default: m.PercentageDifferenceCalculatorTool })),
);
const SpeedDistanceTimeCalculatorToolUi = lazy(() =>
  import("./SpeedDistanceTimeCalculatorTool").then((m) => ({ default: m.SpeedDistanceTimeCalculatorTool })),
);
const IvaCalculatorToolUi = lazy(() =>
  import("./IvaCalculatorTool").then((m) => ({ default: m.IvaCalculatorTool })),
);
const KmhToMsConverterToolUi = lazy(() =>
  import("./KmhToMsConverterTool").then((m) => ({ default: m.KmhToMsConverterTool })),
);
const RomanToolUi = lazy(() =>
  import("./RomanTool").then((m) => ({ default: m.RomanTool })),
);
const SleepCycleToolUi = lazy(() =>
  import("./SleepCycleTool").then((m) => ({ default: m.SleepCycleTool })),
);
const BoxShadowToolUi = lazy(() =>
  import("./BoxShadowTool").then((m) => ({ default: m.BoxShadowTool })),
);
const AttendancePercentageCalculatorToolUi = lazy(() =>
  import("./AttendancePercentageCalculatorTool").then((m) => ({ default: m.AttendancePercentageCalculatorTool })),
);
const CostPerKmCalculatorToolUi = lazy(() =>
  import("./CostPerKmCalculatorTool").then((m) => ({ default: m.CostPerKmCalculatorTool })),
);
const DensityCalculatorToolUi = lazy(() =>
  import("./DensityCalculatorTool").then((m) => ({ default: m.DensityCalculatorTool })),
);
const PercentageErrorCalculatorToolUi = lazy(() =>
  import("./PercentageErrorCalculatorTool").then((m) => ({ default: m.PercentageErrorCalculatorTool })),
);
const TextCaseConverterToolUi = lazy(() =>
  import("./TextCaseConverterTool").then((m) => ({ default: m.TextCaseConverterTool })),
);
const TargetHeartRateCalculatorToolUi = lazy(() =>
  import("./TargetHeartRateCalculatorTool").then((m) => ({ default: m.TargetHeartRateCalculatorTool })),
);
const AspectRatioCalculatorToolUi = lazy(() =>
  import("./AspectRatioCalculatorTool").then((m) => ({ default: m.AspectRatioCalculatorTool })),
);
const DaysBetweenDatesCalculatorToolUi = lazy(() =>
  import("./DaysBetweenDatesCalculatorTool").then((m) => ({ default: m.DaysBetweenDatesCalculatorTool })),
);

const CubeRootCalculatorToolUi = lazy(() =>
  import("./CubeRootCalculatorTool").then((m) => ({ default: m.CubeRootCalculatorTool })),
);

const HoursToDecimalCalculatorToolUi = lazy(() =>
  import("./HoursToDecimalCalculatorTool").then((m) => ({ default: m.HoursToDecimalCalculatorTool })),
);
const HoursToDecimalConverterToolUi = lazy(() =>
  import("./HoursToDecimalConverterTool").then((m) => ({ default: m.HoursToDecimalConverterTool })),
);

// Dedicated UIs for tools re-wired after b300eb06 (mappings from the pre-2026-10-13 registry).
const SeoGrowthToolUi = lazy(() =>
  import("./SeoGrowthTool").then((m) => ({ default: m.SeoGrowthTool })),
);

const GpaCalculatorUi = lazy(() =>
  import("./GpaCalculator").then((m) => ({ default: m.GpaCalculator })),
);

const PercentAdvancedToolUi = lazy(() =>
  import("./PercentAdvancedTool").then((m) => ({ default: m.PercentAdvancedTool })),
);

const AlgebraAdvancedToolUi = lazy(() =>
  import("./AlgebraAdvancedTool").then((m) => ({ default: m.AlgebraAdvancedTool })),
);

const GeometrySuiteToolUi = lazy(() =>
  import("./GeometrySuiteTool").then((m) => ({ default: m.GeometrySuiteTool })),
);

const ArithmeticSuiteToolUi = lazy(() =>
  import("./ArithmeticSuiteTool").then((m) => ({ default: m.ArithmeticSuiteTool })),
);

const SequenceSuiteToolUi = lazy(() =>
  import("./SequenceSuiteTool").then((m) => ({ default: m.SequenceSuiteTool })),
);

const TrigSuiteToolUi = lazy(() =>
  import("./TrigSuiteTool").then((m) => ({ default: m.TrigSuiteTool })),
);

const ExpLogSuiteToolUi = lazy(() =>
  import("./ExpLogSuiteTool").then((m) => ({ default: m.ExpLogSuiteTool })),
);

const MatrixBinarySuiteToolUi = lazy(() =>
  import("./MatrixBinarySuiteTool").then((m) => ({ default: m.MatrixBinarySuiteTool })),
);

const OvertimePayToolUi = lazy(() =>
  import("./OvertimePayTool").then((m) => ({ default: m.OvertimePayTool })),
);

const UtmBuilderToolUi = lazy(() =>
  import("./UtmBuilderTool").then((m) => ({ default: m.UtmBuilderTool })),
);

const VatExtractorToolUi = lazy(() =>
  import("./VatExtractorTool").then((m) => ({ default: m.VatExtractorTool })),
);

const AcSizeToolUi = lazy(() =>
  import("./AcSizeTool").then((m) => ({ default: m.AcSizeTool })),
);

const ConcreteCalculatorToolUi = lazy(() =>
  import("./ConcreteCalculatorTool").then((m) => ({ default: m.ConcreteCalculatorTool })),
);

const WallpaperCalculatorToolUi = lazy(() =>
  import("./WallpaperCalculatorTool").then((m) => ({ default: m.WallpaperCalculatorTool })),
);

const DrywallCalculatorToolUi = lazy(() =>
  import("./DrywallCalculatorTool").then((m) => ({ default: m.DrywallCalculatorTool })),
);

const MeetingCostToolUi = lazy(() =>
  import("./MeetingCostTool").then((m) => ({ default: m.MeetingCostTool })),
);

const FenceCalculatorToolUi = lazy(() =>
  import("./FenceCalculatorTool").then((m) => ({ default: m.FenceCalculatorTool })),
);

const StairCalculatorToolUi = lazy(() =>
  import("./StairCalculatorTool").then((m) => ({ default: m.StairCalculatorTool })),
);

const GravelCalculatorToolUi = lazy(() =>
  import("./GravelCalculatorTool").then((m) => ({ default: m.GravelCalculatorTool })),
);

const FlooringCalculatorToolUi = lazy(() =>
  import("./FlooringCalculatorTool").then((m) => ({ default: m.FlooringCalculatorTool })),
);

const AirFryerCalculatorToolUi = lazy(() =>
  import("./AirFryerCalculatorTool").then((m) => ({ default: m.AirFryerCalculatorTool })),
);

const BakersPercentageToolUi = lazy(() =>
  import("./BakersPercentageTool").then((m) => ({ default: m.BakersPercentageTool })),
);

const DeckCalculatorToolUi = lazy(() =>
  import("./DeckCalculatorTool").then((m) => ({ default: m.DeckCalculatorTool })),
);

const RoofCalculatorToolUi = lazy(() =>
  import("./RoofCalculatorTool").then((m) => ({ default: m.RoofCalculatorTool })),
);

const PoolCalculatorToolUi = lazy(() =>
  import("./PoolCalculatorTool").then((m) => ({ default: m.PoolCalculatorTool })),
);

const PaverCalculatorToolUi = lazy(() =>
  import("./PaverCalculatorTool").then((m) => ({ default: m.PaverCalculatorTool })),
);

const SodCalculatorToolUi = lazy(() =>
  import("./SodCalculatorTool").then((m) => ({ default: m.SodCalculatorTool })),
);

const GutterCalculatorToolUi = lazy(() =>
  import("./GutterCalculatorTool").then((m) => ({ default: m.GutterCalculatorTool })),
);

const InsulationCalculatorToolUi = lazy(() =>
  import("./InsulationCalculatorTool").then((m) => ({ default: m.InsulationCalculatorTool })),
);

const BrickCalculatorToolUi = lazy(() =>
  import("./BrickCalculatorTool").then((m) => ({ default: m.BrickCalculatorTool })),
);

const YeastConverterToolUi = lazy(() =>
  import("./YeastConverterTool").then((m) => ({ default: m.YeastConverterTool })),
);

const DoughWaterTempToolUi = lazy(() =>
  import("./DoughWaterTempTool").then((m) => ({ default: m.DoughWaterTempTool })),
);

const SidingCalculatorToolUi = lazy(() =>
  import("./SidingCalculatorTool").then((m) => ({ default: m.SidingCalculatorTool })),
);

const BaseboardCalculatorToolUi = lazy(() =>
  import("./BaseboardCalculatorTool").then((m) => ({ default: m.BaseboardCalculatorTool })),
);

const GrassSeedCalculatorToolUi = lazy(() =>
  import("./GrassSeedCalculatorTool").then((m) => ({ default: m.GrassSeedCalculatorTool })),
);

const FirewoodCalculatorToolUi = lazy(() =>
  import("./FirewoodCalculatorTool").then((m) => ({ default: m.FirewoodCalculatorTool })),
);

const SheetCalculatorToolUi = lazy(() =>
  import("./SheetCalculatorTool").then((m) => ({ default: m.SheetCalculatorTool })),
);

const CaulkCalculatorToolUi = lazy(() =>
  import("./CaulkCalculatorTool").then((m) => ({ default: m.CaulkCalculatorTool })),
);

const GroutCalculatorToolUi = lazy(() =>
  import("./GroutCalculatorTool").then((m) => ({ default: m.GroutCalculatorTool })),
);

const ThinsetCalculatorToolUi = lazy(() =>
  import("./ThinsetCalculatorTool").then((m) => ({ default: m.ThinsetCalculatorTool })),
);

const HeatIndexToolUi = lazy(() =>
  import("./HeatIndexTool").then((m) => ({ default: m.HeatIndexTool })),
);

const DewPointToolUi = lazy(() =>
  import("./DewPointTool").then((m) => ({ default: m.DewPointTool })),
);

const RaisedBedCalculatorToolUi = lazy(() =>
  import("./RaisedBedCalculatorTool").then((m) => ({ default: m.RaisedBedCalculatorTool })),
);

const RetainingWallCalculatorToolUi = lazy(() =>
  import("./RetainingWallCalculatorTool").then((m) => ({ default: m.RetainingWallCalculatorTool })),
);

const StudCalculatorToolUi = lazy(() =>
  import("./StudCalculatorTool").then((m) => ({ default: m.StudCalculatorTool })),
);

const RainwaterCalculatorToolUi = lazy(() =>
  import("./RainwaterCalculatorTool").then((m) => ({ default: m.RainwaterCalculatorTool })),
);

const BoardFootCalculatorToolUi = lazy(() =>
  import("./BoardFootCalculatorTool").then((m) => ({ default: m.BoardFootCalculatorTool })),
);

const RobotsTxtToolUi = lazy(() =>
  import("./RobotsTxtTool").then((m) => ({ default: m.RobotsTxtTool })),
);

const SchengenCalculatorToolUi = lazy(() =>
  import("./SchengenCalculatorTool").then((m) => ({ default: m.SchengenCalculatorTool })),
);

const IsbnValidatorToolUi = lazy(() =>
  import("./IsbnValidatorTool").then((m) => ({ default: m.IsbnValidatorTool })),
);

const IcsEventToolUi = lazy(() =>
  import("./IcsEventTool").then((m) => ({ default: m.IcsEventTool })),
);

const WindChillToolUi = lazy(() =>
  import("./WindChillTool").then((m) => ({ default: m.WindChillTool })),
);

const IsoDurationToolUi = lazy(() =>
  import("./IsoDurationTool").then((m) => ({ default: m.IsoDurationTool })),
);

const LocaleConverterToolUi = lazy(() =>
  import("./LocaleConverterTool").then((m) => ({ default: m.LocaleConverterTool })),
);

const ContrastToolUi = lazy(() =>
  import("./ContrastTool").then((m) => ({ default: m.ContrastTool })),
);

const CronToolUi = lazy(() =>
  import("./CronTool").then((m) => ({ default: m.CronTool })),
);

const NatoToolUi = lazy(() =>
  import("./NatoTool").then((m) => ({ default: m.NatoTool })),
);

const JetLagToolUi = lazy(() =>
  import("./JetLagTool").then((m) => ({ default: m.JetLagTool })),
);

const IbanToolUi = lazy(() =>
  import("./IbanTool").then((m) => ({ default: m.IbanTool })),
);

const ShoeSizeToolUi = lazy(() =>
  import("./ShoeSizeTool").then((m) => ({ default: m.ShoeSizeTool })),
);

const ChmodToolUi = lazy(() =>
  import("./ChmodTool").then((m) => ({ default: m.ChmodTool })),
);

const ResistorBandsToolUi = lazy(() =>
  import("./ResistorBandsTool").then((m) => ({ default: m.ResistorBandsTool })),
);

const ApaCitationToolUi = lazy(() =>
  import("./ApaCitationTool").then((m) => ({ default: m.ApaCitationTool })),
);

const ChordTransposeToolUi = lazy(() =>
  import("./ChordTransposeTool").then((m) => ({ default: m.ChordTransposeTool })),
);

const DniLetterToolUi = lazy(() =>
  import("./DniLetterTool").then((m) => ({ default: m.DniLetterTool })),
);

const SubnetToolUi = lazy(() =>
  import("./SubnetTool").then((m) => ({ default: m.SubnetTool })),
);

const CoordinatesToolUi = lazy(() =>
  import("./CoordinatesTool").then((m) => ({ default: m.CoordinatesTool })),
);

const EanToolUi = lazy(() =>
  import("./EanTool").then((m) => ({ default: m.EanTool })),
);

const ClampToolUi = lazy(() =>
  import("./ClampTool").then((m) => ({ default: m.ClampTool })),
);

const BrailleToolUi = lazy(() =>
  import("./BrailleTool").then((m) => ({ default: m.BrailleTool })),
);

const UlidToolUi = lazy(() =>
  import("./UlidTool").then((m) => ({ default: m.UlidTool })),
);

const DecibelToolUi = lazy(() =>
  import("./DecibelTool").then((m) => ({ default: m.DecibelTool })),
);

const JwtToolUi = lazy(() =>
  import("./JwtTool").then((m) => ({ default: m.JwtTool })),
);

const PasswordEntropyToolUi = lazy(() =>
  import("./PasswordEntropyTool").then((m) => ({ default: m.PasswordEntropyTool })),
);

const OpenGraphToolUi = lazy(() =>
  import("./OpenGraphTool").then((m) => ({ default: m.OpenGraphTool })),
);

const MarkdownTableToolUi = lazy(() =>
  import("./MarkdownTableTool").then((m) => ({ default: m.MarkdownTableTool })),
);

const JsonToTypescriptToolUi = lazy(() =>
  import("./JsonToTypescriptTool").then((m) => ({ default: m.JsonToTypescriptTool })),
);

const LuhnToolUi = lazy(() =>
  import("./LuhnTool").then((m) => ({ default: m.LuhnTool })),
);

const BpmDelayToolUi = lazy(() =>
  import("./BpmDelayTool").then((m) => ({ default: m.BpmDelayTool })),
);

const VcardToolUi = lazy(() =>
  import("./VcardTool").then((m) => ({ default: m.VcardTool })),
);

const SecurityTxtToolUi = lazy(() =>
  import("./SecurityTxtTool").then((m) => ({ default: m.SecurityTxtTool })),
);

const RutChileToolUi = lazy(() =>
  import("./RutChileTool").then((m) => ({ default: m.RutChileTool })),
);

const MorseToolUi = lazy(() =>
  import("./MorseTool").then((m) => ({ default: m.MorseTool })),
);

const GitignoreToolUi = lazy(() =>
  import("./GitignoreTool").then((m) => ({ default: m.GitignoreTool })),
);

const RiceToolUi = lazy(() =>
  import("./RiceTool").then((m) => ({ default: m.RiceTool })),
);

const SrtOffsetToolUi = lazy(() =>
  import("./SrtOffsetTool").then((m) => ({ default: m.SrtOffsetTool })),
);

const ManifestToolUi = lazy(() =>
  import("./ManifestTool").then((m) => ({ default: m.ManifestTool })),
);

const OklchToolUi = lazy(() =>
  import("./OklchTool").then((m) => ({ default: m.OklchTool })),
);

const WhatsAppLinkToolUi = lazy(() =>
  import("./WhatsAppLinkTool").then((m) => ({ default: m.WhatsAppLinkTool })),
);

const IsoWeekToolUi = lazy(() =>
  import("./IsoWeekTool").then((m) => ({ default: m.IsoWeekTool })),
);

const BeaufortToolUi = lazy(() =>
  import("./BeaufortTool").then((m) => ({ default: m.BeaufortTool })),
);

const PalindromeToolUi = lazy(() =>
  import("./PalindromeTool").then((m) => ({ default: m.PalindromeTool })),
);

const UnixTimestampToolUi = lazy(() =>
  import("./UnixTimestampTool").then((m) => ({ default: m.UnixTimestampTool })),
);

const CaseConverterToolUi = lazy(() =>
  import("./CaseConverterTool").then((m) => ({ default: m.CaseConverterTool })),
);

const PaceCalculatorToolUi = lazy(() =>
  import("./PaceCalculatorTool").then((m) => ({ default: m.PaceCalculatorTool })),
);

const RandomColorToolUi = lazy(() =>
  import("./RandomColorTool").then((m) => ({ default: m.RandomColorTool })),
);

const RandomUsernameToolUi = lazy(() =>
  import("./RandomUsernameTool").then((m) => ({ default: m.RandomUsernameTool })),
);

const QrCodeGeneratorToolUi = lazy(() =>
  import("./QrCodeGeneratorTool").then((m) => ({ default: m.QrCodeGeneratorTool })),
);

const RandomQuoteToolUi = lazy(() =>
  import("./RandomQuoteTool").then((m) => ({ default: m.RandomQuoteTool })),
);

const WaterIntakeToolUi = lazy(() =>
  import("./WaterIntakeTool").then((m) => ({ default: m.WaterIntakeTool })),
);

const TdeeCalculatorToolUi = lazy(() =>
  import("./TdeeCalculatorTool").then((m) => ({ default: m.TdeeCalculatorTool })),
);

const DueDateCalculatorToolUi = lazy(() =>
  import("./DueDateCalculatorTool").then((m) => ({ default: m.DueDateCalculatorTool })),
);

const DiscountCalculatorToolUi = lazy(() =>
  import("./DiscountCalculatorTool").then((m) => ({ default: m.DiscountCalculatorTool })),
);

const MacroCalculatorToolUi = lazy(() =>
  import("./MacroCalculatorTool").then((m) => ({ default: m.MacroCalculatorTool })),
);

const CompanyNameGeneratorToolUi = lazy(() =>
  import("./CompanyNameGeneratorTool").then((m) => ({ default: m.CompanyNameGeneratorTool })),
);

const EmailValidatorToolUi = lazy(() =>
  import("./EmailValidatorTool").then((m) => ({ default: m.EmailValidatorTool })),
);

const OhmsLawToolUi = lazy(() =>
  import("./OhmsLawTool").then((m) => ({ default: m.OhmsLawTool })),
);

const PasswordStrengthToolUi = lazy(() =>
  import("./PasswordStrengthTool").then((m) => ({ default: m.PasswordStrengthTool })),
);

const HexColorConverterToolUi = lazy(() =>
  import("./HexColorConverterTool").then((m) => ({ default: m.HexColorConverterTool })),
);

const CsvToJsonToolUi = lazy(() =>
  import("./CsvToJsonTool").then((m) => ({ default: m.CsvToJsonTool })),
);

const XmlToJsonToolUi = lazy(() =>
  import("./XmlToJsonTool").then((m) => ({ default: m.XmlToJsonTool })),
);

const Base64ToolUi = lazy(() =>
  import("./Base64Tool").then((m) => ({ default: m.Base64Tool })),
);

const PomodoroTimerToolUi = lazy(() =>
  import("./PomodoroTimerTool").then((m) => ({ default: m.PomodoroTimerTool })),
);

const DownloadTimeToolUi = lazy(() =>
  import("./DownloadTimeTool").then((m) => ({ default: m.DownloadTimeTool })),
);

const BodyFatCalculatorToolUi = lazy(() =>
  import("./BodyFatCalculatorTool").then((m) => ({ default: m.BodyFatCalculatorTool })),
);

const KineticEnergyToolUi = lazy(() =>
  import("./KineticEnergyTool").then((m) => ({ default: m.KineticEnergyTool })),
);

const TimezoneToolUi = lazy(() =>
  import("./TimezoneTool").then((m) => ({ default: m.TimezoneTool })),
);

const PercentageOfToolUi = lazy(() =>
  import("./PercentageOfTool").then((m) => ({ default: m.PercentageOfTool })),
);

const SlugGeneratorToolUi = lazy(() =>
  import("./SlugGeneratorTool").then((m) => ({ default: m.SlugGeneratorTool })),
);

const BillSplitToolUi = lazy(() =>
  import("./BillSplitTool").then((m) => ({ default: m.BillSplitTool })),
);

const CurrencyConverterToolUi = lazy(() =>
  import("./CurrencyConverterTool").then((m) => ({ default: m.CurrencyConverterTool })),
);

const RecipeCostCalculatorToolUi = lazy(() =>
  import("./RecipeCostCalculatorTool").then((m) => ({ default: m.RecipeCostCalculatorTool })),
);

const ElectricityCostToolUi = lazy(() =>
  import("./ElectricityCostTool").then((m) => ({ default: m.ElectricityCostTool })),
);

const WordCounterToolUi = lazy(() =>
  import("./WordCounterTool").then((m) => ({ default: m.WordCounterTool })),
);

const LoanPaymentToolUi = lazy(() =>
  import("./LoanPaymentTool").then((m) => ({ default: m.LoanPaymentTool })),
);

const AverageSpeedToolUi = lazy(() =>
  import("./AverageSpeedTool").then((m) => ({ default: m.AverageSpeedTool })),
);

const AccelerationToolUi = lazy(() =>
  import("./AccelerationTool").then((m) => ({ default: m.AccelerationTool })),
);

const FuelEfficiencyToolUi = lazy(() =>
  import("./FuelEfficiencyTool").then((m) => ({ default: m.FuelEfficiencyTool })),
);

const HeartRateZoneToolUi = lazy(() =>
  import("./HeartRateZoneTool").then((m) => ({ default: m.HeartRateZoneTool })),
);


const HourlyRateToolUi = lazy(() =>
  import("./HourlyRateTool").then((m) => ({ default: m.HourlyRateTool })),
);

const LineSorterToolUi = lazy(() =>
  import("./LineSorterTool").then((m) => ({ default: m.LineSorterTool })),
);

const BusinessDaysToolUi = lazy(() =>
  import("./BusinessDaysTool").then((m) => ({ default: m.BusinessDaysTool })),
);

const TextNormalizerToolUi = lazy(() =>
  import("./TextNormalizerTool").then((m) => ({ default: m.TextNormalizerTool })),
);

const Budget503020ToolUi = lazy(() =>
  import("./Budget503020Tool").then((m) => ({ default: m.Budget503020Tool })),
);

const UuidGeneratorToolUi = lazy(() =>
  import("./UuidGeneratorTool").then((m) => ({ default: m.UuidGeneratorTool })),
);

const DateDifferenceToolUi = lazy(() =>
  import("./DateDifferenceTool").then((m) => ({ default: m.DateDifferenceTool })),
);

const RecipeScalerToolUi = lazy(() =>
  import("./RecipeScalerTool").then((m) => ({ default: m.RecipeScalerTool })),
);


const FinalGradeToolUi = lazy(() =>
  import("./FinalGradeTool").then((m) => ({ default: m.FinalGradeTool })),
);

const TemperatureConverterToolUi = lazy(() =>
  import("./TemperatureConverterTool").then((m) => ({ default: m.TemperatureConverterTool })),
);

const ProportionCalculatorToolUi = lazy(() =>
  import("./ProportionCalculatorTool").then((m) => ({ default: m.ProportionCalculatorTool })),
);

const CssGradientGeneratorToolUi = lazy(() =>
  import("./CssGradientGeneratorTool").then((m) => ({ default: m.CssGradientGeneratorTool })),
);

const CharacterCounterToolUi = lazy(() =>
  import("./CharacterCounterTool").then((m) => ({ default: m.CharacterCounterTool })),
);

const CalorieDeficitToolUi = lazy(() =>
  import("./CalorieDeficitTool").then((m) => ({ default: m.CalorieDeficitTool })),
);

const TripTimeToolUi = lazy(() =>
  import("./TripTimeTool").then((m) => ({ default: m.TripTimeTool })),
);

const ForceCalculatorToolUi = lazy(() =>
  import("./ForceCalculatorTool").then((m) => ({ default: m.ForceCalculatorTool })),
);

const BacCalculatorToolUi = lazy(() =>
  import("./BacCalculatorTool").then((m) => ({ default: m.BacCalculatorTool })),
);

const TipTaxCalculatorToolUi = lazy(() =>
  import("./TipTaxCalculatorTool").then((m) => ({ default: m.TipTaxCalculatorTool })),
);

const SphereVolumeCalculatorToolUi = lazy(() =>
  import("./SphereVolumeCalculatorTool").then((m) => ({ default: m.SphereVolumeCalculatorTool })),
);

const SentenceCounterToolUi = lazy(() =>
  import("./SentenceCounterTool").then((m) => ({ default: m.SentenceCounterTool })),
);

const CylinderVolumeCalculatorToolUi = lazy(() =>
  import("./CylinderVolumeCalculatorTool").then((m) => ({ default: m.CylinderVolumeCalculatorTool })),
);

const ParagraphCounterToolUi = lazy(() =>
  import("./ParagraphCounterTool").then((m) => ({ default: m.ParagraphCounterTool })),
);

const WordFrequencyCounterToolUi = lazy(() =>
  import("./WordFrequencyCounterTool").then((m) => ({ default: m.WordFrequencyCounterTool })),
);

const VowelCounterToolUi = lazy(() =>
  import("./VowelCounterTool").then((m) => ({ default: m.VowelCounterTool })),
);

const RectangleAreaCalculatorToolUi = lazy(() =>
  import("./RectangleAreaCalculatorTool").then((m) => ({ default: m.RectangleAreaCalculatorTool })),
);

const ConsonantCounterToolUi = lazy(() =>
  import("./ConsonantCounterTool").then((m) => ({ default: m.ConsonantCounterTool })),
);


const WeightedAverageCalculatorToolUi = lazy(() =>
  import("./WeightedAverageCalculatorTool").then((m) => ({ default: m.WeightedAverageCalculatorTool })),
);

const CircleCircumferenceCalculatorToolUi = lazy(() =>
  import("./CircleCircumferenceCalculatorTool").then((m) => ({ default: m.CircleCircumferenceCalculatorTool })),
);

const RectanglePerimeterCalculatorToolUi = lazy(() =>
  import("./RectanglePerimeterCalculatorTool").then((m) => ({ default: m.RectanglePerimeterCalculatorTool })),
);

const PressureConverterToolUi = lazy(() =>
  import("./PressureConverterTool").then((m) => ({ default: m.PressureConverterTool })),
);

const CaloriesBurnedCalculatorToolUi = lazy(() =>
  import("./CaloriesBurnedCalculatorTool").then((m) => ({ default: m.CaloriesBurnedCalculatorTool })),
);

const PyramidVolumeCalculatorToolUi = lazy(() =>
  import("./PyramidVolumeCalculatorTool").then((m) => ({ default: m.PyramidVolumeCalculatorTool })),
);

const TrapezoidAreaCalculatorToolUi = lazy(() =>
  import("./TrapezoidAreaCalculatorTool").then((m) => ({ default: m.TrapezoidAreaCalculatorTool })),
);

const ParallelogramAreaCalculatorToolUi = lazy(() =>
  import("./ParallelogramAreaCalculatorTool").then((m) => ({ default: m.ParallelogramAreaCalculatorTool })),
);

const RectangularPrismVolumeCalculatorToolUi = lazy(() =>
  import("./RectangularPrismVolumeCalculatorTool").then((m) => ({ default: m.RectangularPrismVolumeCalculatorTool })),
);

function pickComponent(tool: GeneralTool): ToolComp {
  const kind = (tool.kind || "").toLowerCase();
  const slug = (tool.slug || "").toLowerCase();
  const category = (tool.category || "").toLowerCase();
  const mode = String((tool.config as { mode?: unknown } | undefined)?.mode ?? "").toLowerCase();

  // Dedicated calculator / text tools that must not fall into generic Math/Text/ScienceTool
  if (slug === "conversor-numeros-romanos") return RomanToolUi;
  if (slug === "calculadora-ciclo-sueno") return SleepCycleToolUi;
  if (slug === "generador-sombra-css") return BoxShadowToolUi;
  if (slug === "calculadora-frecuencia-letras") return LetterFrequencyCalculatorToolUi;
  if (slug === "calculadora-trabajo") return WorkCalculatorToolUi;
  if (slug === "calculadora-regla-de-tres") return RuleOfThreeCalculatorToolUi;
  if (slug === "calculadora-horas-extras") return OvertimeCalculatorToolUi;
  if (slug === "calculadora-volumen-cubo") return CubeVolumeCalculatorToolUi;
  if (slug === "calculadora-area-triangulo") return TriangleAreaCalculatorToolUi;
  if (slug === "calculadora-area-circulo") return CircleAreaCalculatorToolUi;
  if (slug === "conversor-onzas-gramos") return OuncesToGramsConverterToolUi;
  if (slug === "calculadora-peso-ideal") return IdealWeightCalculatorToolUi;
  if (slug === "calculadora-peso-saludable") return IdealWeightCalculatorToolUi;
  if (slug === "calculadora-potencia-electrica") return ElectricalPowerCalculatorToolUi;
  if (slug === "calculadora-tiempo-vuelo") return FlightTimeCalculatorToolUi;
  if (slug === "calculadora-pendiente") return SlopeCalculatorToolUi;
  if (slug === "contador-lineas") return LineCounterToolUi;
  if (slug === "calculadora-interes-compuesto") return CompoundInterestCalculatorToolUi;
  if (slug === "calculadora-calorias-diarias") return DailyCaloriesCalculatorToolUi;
  if (slug === "calculadora-desviacion-estandar") return StandardDeviationCalculatorToolUi;
  if (slug === "calculadora-volumen-cono") return ConeVolumeCalculatorToolUi;
  if (slug === "calculadora-horas-entre-fechas") return HoursBetweenDatesCalculatorToolUi;
  if (slug === "calculadora-palabras-por-minuto") return WordsPerMinuteCalculatorToolUi;
  if (slug === "contador-silabas") return SyllableCounterToolUi;
  if (slug === "calculadora-roi") return RoiCalculatorToolUi;
  if (slug === "calculadora-imc") return BmiCalculatorToolUi;
  if (slug === "calculadora-raiz-cuadrada") return SquareRootCalculatorToolUi;
  if (slug === "calculadora-media-armonica") return HarmonicMeanCalculatorToolUi;
  if (slug === "calculadora-logaritmo") return LogarithmCalculatorToolUi;
  if (slug === "calculadora-presion-atmosferica") return AtmosphericPressureCalculatorToolUi;
  if (slug === "calculadora-longitud-media-palabra") return AverageWordLengthCalculatorToolUi;
  if (slug === "calculadora-longitud-promedio-palabra") return AverageWordLengthCalculatorToolUi;
  if (slug === "calculadora-interes-diario") return DailyInterestCalculatorToolUi;
  if (slug === "calculadora-ratio-trabajo-descanso") return WorkBreakRatioCalculatorToolUi;
  if (slug === "calculadora-precio-unitario") return UnitPriceToolUi;
  if (slug === "calculadora-agua-arroz") return RiceWaterCalculatorToolUi;
  if (slug === "calculadora-media-aritmetica") return ArithmeticMeanCalculatorToolUi;
  if (slug === "calculadora-mediana") return MedianCalculatorToolUi;
  if (slug === "calculadora-factorial") return FactorialCalculatorToolUi;
  if (slug === "calculadora-agua-diaria") return DailyWaterIntakeCalculatorToolUi;
  if (slug === "calculadora-ingesta-agua-diaria") return DailyWaterIntakeCalculatorToolUi;
  if (slug === "calculadora-consumo-agua") return WaterConsumptionCalculatorToolUi;
  if (slug === "calculadora-area-superficie-esfera") return SphereSurfaceAreaCalculatorToolUi;
  if (slug === "calculadora-perimetro-cuadrado") return SquarePerimeterCalculatorToolUi;
  if (slug === "calculadora-edad") return AgeCalculatorToolUi;
  if (slug === "calculadora-propina") return TipCalculatorToolUi;
  if (slug === "calculadora-gpa") return GpaCalculatorToolUi;
  if (slug === "calculadora-area-habitacion") return RoomAreaCalculatorToolUi;
  if (slug === "calculadora-area-rectangular") return RoomAreaCalculatorToolUi;
  if (slug === "calculadora-px-rem") return PxToRemCalculatorToolUi;
  if (slug === "calculadora-px-a-rem") return PxToRemCalculatorToolUi;
  if (slug === "calculadora-presupuesto-viaje-diario") return DailyTravelBudgetCalculatorToolUi;
  if (slug === "calculadora-presupuesto-diario-viaje") return DailyTravelBudgetCalculatorToolUi;
  if (slug === "calculadora-diferencia-porcentual") return PercentageDifferenceCalculatorToolUi;
  if (slug === "calculadora-velocidad-distancia-tiempo") return SpeedDistanceTimeCalculatorToolUi;
  if (slug === "calculadora-iva") return IvaCalculatorToolUi;
  if (slug === "conversor-kmh-ms") return KmhToMsConverterToolUi;
  if (slug === "calculadora-porcentaje-asistencia") return AttendancePercentageCalculatorToolUi;
  if (slug === "calculadora-costo-por-km") return CostPerKmCalculatorToolUi;
  if (slug === "calculadora-densidad") return DensityCalculatorToolUi;
  if (slug === "calculadora-error-porcentual") return PercentageErrorCalculatorToolUi;
  if (slug === "conversor-texto-caso") return TextCaseConverterToolUi;
  if (slug === "calculadora-frecuencia-cardiaca-objetivo") return TargetHeartRateCalculatorToolUi;
  if (slug === "calculadora-relacion-aspecto") return AspectRatioCalculatorToolUi;
  if (slug === "calculadora-dias-entre-fechas") return DaysBetweenDatesCalculatorToolUi;
  if (slug === "calculadora-raiz-cubica") return CubeRootCalculatorToolUi;
  if (slug === "calculadora-horas-a-decimal") return HoursToDecimalCalculatorToolUi;
  if (slug === "conversor-horas-decimal") return HoursToDecimalConverterToolUi;

  // Tools re-wired after b300eb06: dedicated component by slug, then by config.mode.
  if (slug === "gpa") return GpaCalculatorUi;
  if (slug === "calculadora-horas-extra") return OvertimePayToolUi;
  if (slug === "generador-utm") return UtmBuilderToolUi;
  if (slug === "quitar-iva") return VatExtractorToolUi;
  if (slug === "calculadora-btu") return AcSizeToolUi;
  if (slug === "calculadora-hormigon") return ConcreteCalculatorToolUi;
  if (slug === "calculadora-papel-pintado") return WallpaperCalculatorToolUi;
  if (slug === "calculadora-pladur") return DrywallCalculatorToolUi;
  if (slug === "coste-reunion") return MeetingCostToolUi;
  if (slug === "calculadora-valla") return FenceCalculatorToolUi;
  if (slug === "calculadora-escalera") return StairCalculatorToolUi;
  if (slug === "calculadora-grava") return GravelCalculatorToolUi;
  if (slug === "calculadora-suelo-laminado") return FlooringCalculatorToolUi;
  if (slug === "conversor-freidora-aire") return AirFryerCalculatorToolUi;
  if (slug === "calculadora-porcentaje-panadero") return BakersPercentageToolUi;
  if (slug === "calculadora-deck") return DeckCalculatorToolUi;
  if (slug === "calculadora-tejado") return RoofCalculatorToolUi;
  if (slug === "calculadora-piscina") return PoolCalculatorToolUi;
  if (slug === "calculadora-adoquines") return PaverCalculatorToolUi;
  if (slug === "calculadora-cesped") return SodCalculatorToolUi;
  if (slug === "calculadora-canalones") return GutterCalculatorToolUi;
  if (slug === "calculadora-aislamiento") return InsulationCalculatorToolUi;
  if (slug === "calculadora-ladrillos") return BrickCalculatorToolUi;
  if (slug === "conversor-levadura") return YeastConverterToolUi;
  if (slug === "temperatura-agua-masa") return DoughWaterTempToolUi;
  if (slug === "calculadora-siding") return SidingCalculatorToolUi;
  if (slug === "calculadora-zocalos") return BaseboardCalculatorToolUi;
  if (slug === "calculadora-semilla-cesped") return GrassSeedCalculatorToolUi;
  if (slug === "calculadora-lena") return FirewoodCalculatorToolUi;
  if (slug === "calculadora-tableros") return SheetCalculatorToolUi;
  if (slug === "calculadora-silicona") return CaulkCalculatorToolUi;
  if (slug === "calculadora-junta-baldosas") return GroutCalculatorToolUi;
  if (slug === "calculadora-adhesivo-baldosas") return ThinsetCalculatorToolUi;
  if (slug === "calculadora-sensacion-termica") return HeatIndexToolUi;
  if (slug === "calculadora-punto-rocio") return DewPointToolUi;
  if (slug === "calculadora-jardinera") return RaisedBedCalculatorToolUi;
  if (slug === "calculadora-muro-contencion") return RetainingWallCalculatorToolUi;
  if (slug === "calculadora-montantes") return StudCalculatorToolUi;
  if (slug === "calculadora-agua-lluvia") return RainwaterCalculatorToolUi;
  if (slug === "calculadora-pies-tablares") return BoardFootCalculatorToolUi;
  if (slug === "generador-robots-txt") return RobotsTxtToolUi;
  if (slug === "calculadora-schengen") return SchengenCalculatorToolUi;
  if (slug === "validador-isbn") return IsbnValidatorToolUi;
  if (slug === "generador-ics") return IcsEventToolUi;
  if (slug === "calculadora-enfriamiento-viento") return WindChillToolUi;
  if (slug === "generador-duracion-iso") return IsoDurationToolUi;
  if (slug === "conversor-locale") return LocaleConverterToolUi;
  if (slug === "validador-contraste") return ContrastToolUi;
  if (slug === "generador-cron") return CronToolUi;
  if (slug === "traductor-fonetico-otan") return NatoToolUi;
  if (slug === "planificador-jet-lag") return JetLagToolUi;
  if (slug === "validador-iban") return IbanToolUi;
  if (slug === "conversor-tallas-zapatos") return ShoeSizeToolUi;
  if (slug === "conversor-permisos-chmod") return ChmodToolUi;
  if (slug === "decodificador-bandas-resistencia") return ResistorBandsToolUi;
  if (slug === "generador-cita-apa") return ApaCitationToolUi;
  if (slug === "transportador-acordes") return ChordTransposeToolUi;
  if (slug === "letra-dni-nie") return DniLetterToolUi;
  if (slug === "calculadora-subred") return SubnetToolUi;
  if (slug === "conversor-coordenadas") return CoordinatesToolUi;
  if (slug === "validador-ean") return EanToolUi;
  if (slug === "generador-css-clamp") return ClampToolUi;
  if (slug === "traductor-braille") return BrailleToolUi;
  if (slug === "generador-ulid") return UlidToolUi;
  if (slug === "sumador-decibelios") return DecibelToolUi;
  if (slug === "decodificador-jwt") return JwtToolUi;
  if (slug === "estimador-entropia-contrasena") return PasswordEntropyToolUi;
  if (slug === "generador-open-graph") return OpenGraphToolUi;
  if (slug === "generador-tabla-markdown") return MarkdownTableToolUi;
  if (slug === "json-a-typescript") return JsonToTypescriptToolUi;
  if (slug === "validador-luhn") return LuhnToolUi;
  if (slug === "convertidor-delay-bpm") return BpmDelayToolUi;
  if (slug === "generador-vcard") return VcardToolUi;
  if (slug === "generador-security-txt") return SecurityTxtToolUi;
  if (slug === "validador-rut-chile") return RutChileToolUi;
  if (slug === "traductor-morse") return MorseToolUi;
  if (slug === "generador-gitignore") return GitignoreToolUi;
  if (slug === "calculadora-arroz") return RiceToolUi;
  if (slug === "desfase-srt") return SrtOffsetToolUi;
  if (slug === "generador-manifest-pwa") return ManifestToolUi;
  if (slug === "convertidor-oklch") return OklchToolUi;
  if (slug === "generador-enlace-whatsapp") return WhatsAppLinkToolUi;
  if (slug === "conversor-semana-iso") return IsoWeekToolUi;
  if (slug === "conversor-escala-beaufort") return BeaufortToolUi;
  if (slug === "validador-palindromo") return PalindromeToolUi;
  if (slug === "conversor-timestamp-unix") return UnixTimestampToolUi;
  if (slug === "convertidor-casos-texto") return CaseConverterToolUi;
  if (slug === "calculadora-ritmo-carrera") return PaceCalculatorToolUi;
  if (slug === "generador-color-aleatorio") return RandomColorToolUi;
  if (slug === "generador-nombre-usuario") return RandomUsernameToolUi;
  if (slug === "generador-codigo-qr") return QrCodeGeneratorToolUi;
  if (slug === "generador-frases-aleatorias") return RandomQuoteToolUi;
  if (slug === "calculadora-ingesta-agua") return WaterIntakeToolUi;
  if (slug === "calculadora-tdee") return TdeeCalculatorToolUi;
  if (slug === "calculadora-fecha-parto") return DueDateCalculatorToolUi;
  if (slug === "calculadora-descuento") return DiscountCalculatorToolUi;
  if (slug === "calculadora-macros") return MacroCalculatorToolUi;
  if (slug === "calculadora-peso-ideal") return IdealWeightCalculatorToolUi;
  if (slug === "generador-nombres-empresa") return CompanyNameGeneratorToolUi;
  if (slug === "validador-email") return EmailValidatorToolUi;
  if (slug === "calculadora-ley-ohm") return OhmsLawToolUi;
  if (slug === "password-strength") return PasswordStrengthToolUi;
  if (slug === "conversor-color-hex") return HexColorConverterToolUi;
  if (slug === "conversor-csv-json") return CsvToJsonToolUi;
  if (slug === "conversor-xml-json") return XmlToJsonToolUi;
  if (slug === "base64-encoder-decoder") return Base64ToolUi;
  if (slug === "temporizador-pomodoro") return PomodoroTimerToolUi;
  if (slug === "calculadora-tiempo-descarga") return DownloadTimeToolUi;
  if (slug === "calculadora-grasa-corporal") return BodyFatCalculatorToolUi;
  if (slug === "calculadora-energia-cinetica") return KineticEnergyToolUi;
  if (slug === "conversor-zona-horaria") return TimezoneToolUi;
  if (slug === "calculadora-porcentaje-de") return PercentageOfToolUi;
  if (slug === "generador-slug") return SlugGeneratorToolUi;
  if (slug === "dividir-cuenta") return BillSplitToolUi;
  if (slug === "conversor-divisas") return CurrencyConverterToolUi;
  if (slug === "calculadora-costo-receta") return RecipeCostCalculatorToolUi;
  if (slug === "calculadora-costo-electricidad") return ElectricityCostToolUi;
  if (slug === "contador-palabras") return WordCounterToolUi;
  if (slug === "calculadora-cuota-prestamo") return LoanPaymentToolUi;
  if (slug === "calculadora-velocidad-media") return AverageSpeedToolUi;
  if (slug === "calculadora-aceleracion") return AccelerationToolUi;
  if (slug === "calculadora-eficiencia-combustible") return FuelEfficiencyToolUi;
  if (slug === "calculadora-zonas-frecuencia-cardiaca") return HeartRateZoneToolUi;
  if (slug === "calculadora-tarifa-horaria") return HourlyRateToolUi;
  if (slug === "ordenador-lineas-texto") return LineSorterToolUi;
  if (slug === "calculadora-dias-habiles") return BusinessDaysToolUi;
  if (slug === "normalizador-texto") return TextNormalizerToolUi;
  if (slug === "calculadora-presupuesto-503020") return Budget503020ToolUi;
  if (slug === "generador-uuid") return UuidGeneratorToolUi;
  if (slug === "calculadora-diferencia-fechas") return DateDifferenceToolUi;
  if (slug === "escalador-receta") return RecipeScalerToolUi;
  if (slug === "calculadora-area-habitacion") return RoomAreaCalculatorToolUi;
  if (slug === "calculadora-nota-final") return FinalGradeToolUi;
  if (slug === "conversor-temperatura") return TemperatureConverterToolUi;
  if (slug === "calculadora-proporcion") return ProportionCalculatorToolUi;
  if (slug === "generador-gradiente-css") return CssGradientGeneratorToolUi;
  if (slug === "contador-caracteres") return CharacterCounterToolUi;
  if (slug === "calculadora-deficit-calorico") return CalorieDeficitToolUi;
  if (slug === "calculadora-tiempo-viaje") return TripTimeToolUi;
  if (slug === "calculadora-fuerza") return ForceCalculatorToolUi;
  if (slug === "calculadora-bac") return BacCalculatorToolUi;
  if (slug === "calculadora-propina-impuesto") return TipTaxCalculatorToolUi;
  if (slug === "calculadora-volumen-esfera") return SphereVolumeCalculatorToolUi;
  if (slug === "contador-oraciones") return SentenceCounterToolUi;
  if (slug === "calculadora-volumen-cilindro") return CylinderVolumeCalculatorToolUi;
  if (slug === "contador-parrafos") return ParagraphCounterToolUi;
  if (slug === "contador-frecuencia-palabras") return WordFrequencyCounterToolUi;
  if (slug === "calculadora-area-circulo") return CircleAreaCalculatorToolUi;
  if (slug === "contador-vocales") return VowelCounterToolUi;
  if (slug === "calculadora-area-rectangulo") return RectangleAreaCalculatorToolUi;
  if (slug === "contador-consonantes") return ConsonantCounterToolUi;
  if (slug === "calculadora-promedio-ponderado") return WeightedAverageCalculatorToolUi;
  if (slug === "calculadora-circunferencia") return CircleCircumferenceCalculatorToolUi;
  if (slug === "calculadora-perimetro-rectangulo") return RectanglePerimeterCalculatorToolUi;
  if (slug === "conversor-presion") return PressureConverterToolUi;
  if (slug === "calculadora-calorias-quemadas") return CaloriesBurnedCalculatorToolUi;
  if (slug === "calculadora-volumen-piramide") return PyramidVolumeCalculatorToolUi;
  if (slug === "calculadora-area-trapecio") return TrapezoidAreaCalculatorToolUi;
  if (slug === "calculadora-area-paralelogramo") return ParallelogramAreaCalculatorToolUi;
  if (slug === "calculadora-volumen-prisma-rectangular") return RectangularPrismVolumeCalculatorToolUi;
  if (mode === "finance") return FinanceToolUi;
  if (mode === "seo-growth") return SeoGrowthToolUi;
  if (mode === "percent-advanced") return PercentAdvancedToolUi;
  if (mode === "algebra-advanced") return AlgebraAdvancedToolUi;
  if (mode === "geometry-suite") return GeometrySuiteToolUi;
  if (mode === "arithmetic-suite") return ArithmeticSuiteToolUi;
  if (mode === "sequence-suite") return SequenceSuiteToolUi;
  if (mode === "trig-suite") return TrigSuiteToolUi;
  if (mode === "explog-suite") return ExpLogSuiteToolUi;
  if (mode === "matrix-binary-suite") return MatrixBinarySuiteToolUi;

  // 1) Media
  if (kind === "image" || kind === "pdf" || kind === "media") return MediaToolUi;

  // 2) Document beats config.operation
  if (kind === "document") return DocumentToolUi;

  // 3) Design / color
  if (
    kind === "design" ||
    kind === "color" ||
    category === "diseno" ||
    category === "design" ||
    slug.startsWith("css-")
  ) {
    return DesignToolUi;
  }

  // 4) Config-driven numeric vs document operations
  if (tool.config && typeof tool.config === "object" && "operation" in tool.config) {
    const op = String((tool.config as { operation?: string }).operation || "");
    if (
      op === "pdf-metadata" ||
      op === "text-diff" ||
      op === "csv-inspector" ||
      op === "markdown-html" ||
      op === "file-name-batch"
    ) {
      return DocumentToolUi;
    }
    return ConfiguredToolUi;
  }

  // 5) Kind routes
  if (kind === "converter" || kind === "conversion" || kind === "unit") return ConverterToolUi;
  if (kind === "text" || kind === "code" || kind === "encode") return TextToolUi;
  if (kind === "math" || kind === "stats" || kind === "calculator") return MathToolUi;
  if (kind === "finance" || kind === "money") return FinanceToolUi;
  if (kind === "science" || kind === "physics") return ScienceToolUi;
  if (kind === "time" || kind === "date" || kind === "timer") return TimeToolUi;
  if (kind === "education" || kind === "school") return EducationToolUi;
  if (kind === "security" || kind === "password") return SecurityToolUi;
  if (kind === "generator") return GeneratorToolUi;
  if (kind === "dev" || kind === "developer") return DevToolUi;

  // 6) Category routes
  if (category === "math" || category === "matematicas") return MathToolUi;
  if (category === "science" || category === "ciencia") return ScienceToolUi;
  if (category === "formula") return FormulaToolUi;
  if (category === "finance" || category === "finanzas") return FinanceToolUi;
  if (category === "education" || category === "educacion") return EducationToolUi;
  if (category === "generator" || category === "generadores") return GeneratorToolUi;
  if (category === "text" || category === "texto") return TextToolUi;
  if (category === "dev" || category === "desarrollo") return DevToolUi;
  if (category === "media") return MediaToolUi;
  if (category === "design" || category === "diseno") return DesignToolUi;
  if (category === "security" || category === "seguridad") return SecurityToolUi;
  if (category === "time" || category === "fechas") return TimeToolUi;
  if (category === "converter" || category === "conversiones") return ConverterToolUi;

  return GeneralToolUi;
}

function buildLazyRegistry(locale: "en" | "es") {
  const cache = new Map<string, () => ReactNode>();

  return new Proxy({} as Record<string, () => ReactNode>, {
    get(_target, prop) {
      if (typeof prop !== "string") return undefined;
      if (cache.has(prop)) return cache.get(prop);

      const tool = TOOL_BY_SLUG.get(prop);
      if (!tool) return undefined;

      const Comp = pickComponent(tool);
      const render = () => <Comp tool={tool} locale={locale} />;
      cache.set(prop, render);
      return render;
    },
    has(_target, prop) {
      return typeof prop === "string" && TOOL_BY_SLUG.has(prop);
    },
  });
}

export const GENERAL_TOOL_UI = buildLazyRegistry("en");
export const GENERAL_TOOL_UI_ES = buildLazyRegistry("es");
