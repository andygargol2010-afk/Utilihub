// Lazy tool UIs part 03 — split out of ../registry.tsx on 2026-10-28.
// Add new entries in the smallest file of this folder; never rewrite files wholesale.
import { lazy } from "react";

export const FlooringCalculatorToolUi = lazy(() =>
  import("../FlooringCalculatorTool").then((m) => ({ default: m.FlooringCalculatorTool })),
);

export const AirFryerCalculatorToolUi = lazy(() =>
  import("../AirFryerCalculatorTool").then((m) => ({ default: m.AirFryerCalculatorTool })),
);

export const BakersPercentageToolUi = lazy(() =>
  import("../BakersPercentageTool").then((m) => ({ default: m.BakersPercentageTool })),
);

export const DeckCalculatorToolUi = lazy(() =>
  import("../DeckCalculatorTool").then((m) => ({ default: m.DeckCalculatorTool })),
);

export const RoofCalculatorToolUi = lazy(() =>
  import("../RoofCalculatorTool").then((m) => ({ default: m.RoofCalculatorTool })),
);

export const PoolCalculatorToolUi = lazy(() =>
  import("../PoolCalculatorTool").then((m) => ({ default: m.PoolCalculatorTool })),
);

export const PaverCalculatorToolUi = lazy(() =>
  import("../PaverCalculatorTool").then((m) => ({ default: m.PaverCalculatorTool })),
);

export const SodCalculatorToolUi = lazy(() =>
  import("../SodCalculatorTool").then((m) => ({ default: m.SodCalculatorTool })),
);

export const GutterCalculatorToolUi = lazy(() =>
  import("../GutterCalculatorTool").then((m) => ({ default: m.GutterCalculatorTool })),
);

export const InsulationCalculatorToolUi = lazy(() =>
  import("../InsulationCalculatorTool").then((m) => ({ default: m.InsulationCalculatorTool })),
);

export const BrickCalculatorToolUi = lazy(() =>
  import("../BrickCalculatorTool").then((m) => ({ default: m.BrickCalculatorTool })),
);

export const YeastConverterToolUi = lazy(() =>
  import("../YeastConverterTool").then((m) => ({ default: m.YeastConverterTool })),
);

export const DoughWaterTempToolUi = lazy(() =>
  import("../DoughWaterTempTool").then((m) => ({ default: m.DoughWaterTempTool })),
);

export const SidingCalculatorToolUi = lazy(() =>
  import("../SidingCalculatorTool").then((m) => ({ default: m.SidingCalculatorTool })),
);

export const BaseboardCalculatorToolUi = lazy(() =>
  import("../BaseboardCalculatorTool").then((m) => ({ default: m.BaseboardCalculatorTool })),
);

export const GrassSeedCalculatorToolUi = lazy(() =>
  import("../GrassSeedCalculatorTool").then((m) => ({ default: m.GrassSeedCalculatorTool })),
);

export const FirewoodCalculatorToolUi = lazy(() =>
  import("../FirewoodCalculatorTool").then((m) => ({ default: m.FirewoodCalculatorTool })),
);

export const SheetCalculatorToolUi = lazy(() =>
  import("../SheetCalculatorTool").then((m) => ({ default: m.SheetCalculatorTool })),
);

export const CaulkCalculatorToolUi = lazy(() =>
  import("../CaulkCalculatorTool").then((m) => ({ default: m.CaulkCalculatorTool })),
);

export const GroutCalculatorToolUi = lazy(() =>
  import("../GroutCalculatorTool").then((m) => ({ default: m.GroutCalculatorTool })),
);

export const ThinsetCalculatorToolUi = lazy(() =>
  import("../ThinsetCalculatorTool").then((m) => ({ default: m.ThinsetCalculatorTool })),
);

export const HeatIndexToolUi = lazy(() =>
  import("../HeatIndexTool").then((m) => ({ default: m.HeatIndexTool })),
);

export const DewPointToolUi = lazy(() =>
  import("../DewPointTool").then((m) => ({ default: m.DewPointTool })),
);

export const RaisedBedCalculatorToolUi = lazy(() =>
  import("../RaisedBedCalculatorTool").then((m) => ({ default: m.RaisedBedCalculatorTool })),
);

export const RetainingWallCalculatorToolUi = lazy(() =>
  import("../RetainingWallCalculatorTool").then((m) => ({ default: m.RetainingWallCalculatorTool })),
);

export const StudCalculatorToolUi = lazy(() =>
  import("../StudCalculatorTool").then((m) => ({ default: m.StudCalculatorTool })),
);

export const RainwaterCalculatorToolUi = lazy(() =>
  import("../RainwaterCalculatorTool").then((m) => ({ default: m.RainwaterCalculatorTool })),
);

export const BoardFootCalculatorToolUi = lazy(() =>
  import("../BoardFootCalculatorTool").then((m) => ({ default: m.BoardFootCalculatorTool })),
);

export const RobotsTxtToolUi = lazy(() =>
  import("../RobotsTxtTool").then((m) => ({ default: m.RobotsTxtTool })),
);

export const SchengenCalculatorToolUi = lazy(() =>
  import("../SchengenCalculatorTool").then((m) => ({ default: m.SchengenCalculatorTool })),
);

export const IsbnValidatorToolUi = lazy(() =>
  import("../IsbnValidatorTool").then((m) => ({ default: m.IsbnValidatorTool })),
);

export const IcsEventToolUi = lazy(() =>
  import("../IcsEventTool").then((m) => ({ default: m.IcsEventTool })),
);

export const WindChillToolUi = lazy(() =>
  import("../WindChillTool").then((m) => ({ default: m.WindChillTool })),
);

export const IsoDurationToolUi = lazy(() =>
  import("../IsoDurationTool").then((m) => ({ default: m.IsoDurationTool })),
);

export const LocaleConverterToolUi = lazy(() =>
  import("../LocaleConverterTool").then((m) => ({ default: m.LocaleConverterTool })),
);

export const ContrastToolUi = lazy(() =>
  import("../ContrastTool").then((m) => ({ default: m.ContrastTool })),
);

export const CronToolUi = lazy(() =>
  import("../CronTool").then((m) => ({ default: m.CronTool })),
);

export const NatoToolUi = lazy(() =>
  import("../NatoTool").then((m) => ({ default: m.NatoTool })),
);

export const JetLagToolUi = lazy(() =>
  import("../JetLagTool").then((m) => ({ default: m.JetLagTool })),
);

export const IbanToolUi = lazy(() =>
  import("../IbanTool").then((m) => ({ default: m.IbanTool })),
);

export const ShoeSizeToolUi = lazy(() =>
  import("../ShoeSizeTool").then((m) => ({ default: m.ShoeSizeTool })),
);

export const ChmodToolUi = lazy(() =>
  import("../ChmodTool").then((m) => ({ default: m.ChmodTool })),
);

export const ResistorBandsToolUi = lazy(() =>
  import("../ResistorBandsTool").then((m) => ({ default: m.ResistorBandsTool })),
);

export const ApaCitationToolUi = lazy(() =>
  import("../ApaCitationTool").then((m) => ({ default: m.ApaCitationTool })),
);

export const ChordTransposeToolUi = lazy(() =>
  import("../ChordTransposeTool").then((m) => ({ default: m.ChordTransposeTool })),
);

export const DniLetterToolUi = lazy(() =>
  import("../DniLetterTool").then((m) => ({ default: m.DniLetterTool })),
);

export const SubnetToolUi = lazy(() =>
  import("../SubnetTool").then((m) => ({ default: m.SubnetTool })),
);

export const CoordinatesToolUi = lazy(() =>
  import("../CoordinatesTool").then((m) => ({ default: m.CoordinatesTool })),
);

export const EanToolUi = lazy(() =>
  import("../EanTool").then((m) => ({ default: m.EanTool })),
);

export const ClampToolUi = lazy(() =>
  import("../ClampTool").then((m) => ({ default: m.ClampTool })),
);
