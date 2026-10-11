import { lazy, type ComponentType, type ReactNode } from "react";
import { GENERAL_TOOLS } from "@/lib/general";
import type { GeneralTool } from "@/lib/general/types";

const GeneralToolUi = lazy(() => import("./GeneralTool").then((m) => ({ default: m.GeneralTool })));
const ConfiguredTool = lazy(() => import("./ConfiguredTool").then((m) => ({ default: m.ConfiguredTool })));
const AdvancedCalculatorTool = lazy(() =>
  import("./AdvancedCalculatorTool").then((m) => ({ default: m.AdvancedCalculatorTool })),
);
const AdvancedDateTool = lazy(() => import("./AdvancedDateTool").then((m) => ({ default: m.AdvancedDateTool })));
const MathTool = lazy(() => import("./MathTool").then((m) => ({ default: m.MathTool })));
const DesignTool = lazy(() => import("./DesignTool").then((m) => ({ default: m.DesignTool })));
const Modeler3D = lazy(() => import("./Modeler3D").then((m) => ({ default: m.Modeler3D })));
const HouseModeler3D = lazy(() => import("./HouseModeler3D").then((m) => ({ default: m.HouseModeler3D })));
const SecurityTool = lazy(() => import("./SecurityTool").then((m) => ({ default: m.SecurityTool })));
const TimeTool = lazy(() => import("./TimeTool").then((m) => ({ default: m.TimeTool })));
const ConverterTool = lazy(() => import("./ConverterTool").then((m) => ({ default: m.ConverterTool })));
const ScienceTool = lazy(() => import("./ScienceTool").then((m) => ({ default: m.ScienceTool })));
const FormulaTool = lazy(() => import("./FormulaTool").then((m) => ({ default: m.FormulaTool })));
const FinanceTool = lazy(() => import("./FinanceTool").then((m) => ({ default: m.FinanceTool })));
const EducationTool = lazy(() => import("./EducationTool").then((m) => ({ default: m.EducationTool })));
const GeneratorTool = lazy(() => import("./GeneratorTool").then((m) => ({ default: m.GeneratorTool })));
const TextTool = lazy(() => import("./TextTool").then((m) => ({ default: m.TextTool })));
const DevTool = lazy(() => import("./DevTool").then((m) => ({ default: m.DevTool })));
const MediaTool = lazy(() => import("./MediaTool").then((m) => ({ default: m.MediaTool })));
const SequenceTool = lazy(() => import("./SequenceTool").then((m) => ({ default: m.SequenceTool })));
const PowerRootTool = lazy(() => import("./PowerRootTool").then((m) => ({ default: m.PowerRootTool })));
const NormalDistributionTool = lazy(() =>
  import("./NormalDistributionTool").then((m) => ({ default: m.NormalDistributionTool })),
);
const PoissonTool = lazy(() => import("./PoissonTool").then((m) => ({ default: m.PoissonTool })));
const CombinatoricsTool = lazy(() => import("./CombinatoricsTool").then((m) => ({ default: m.CombinatoricsTool })));
const PercentAdvancedTool = lazy(() =>
  import("./PercentAdvancedTool").then((m) => ({ default: m.PercentAdvancedTool })),
);
const AlgebraAdvancedTool = lazy(() =>
  import("./AlgebraAdvancedTool").then((m) => ({ default: m.AlgebraAdvancedTool })),
);
const GeometrySuiteTool = lazy(() => import("./GeometrySuiteTool").then((m) => ({ default: m.GeometrySuiteTool })));
const ArithmeticSuiteTool = lazy(() =>
  import("./ArithmeticSuiteTool").then((m) => ({ default: m.ArithmeticSuiteTool })),
);
const SequenceSuiteTool = lazy(() => import("./SequenceSuiteTool").then((m) => ({ default: m.SequenceSuiteTool })));
const TrigSuiteTool = lazy(() => import("./TrigSuiteTool").then((m) => ({ default: m.TrigSuiteTool })));
const ExpLogSuiteTool = lazy(() => import("./ExpLogSuiteTool").then((m) => ({ default: m.ExpLogSuiteTool })));
const MatrixBinarySuiteTool = lazy(() =>
  import("./MatrixBinarySuiteTool").then((m) => ({ default: m.MatrixBinarySuiteTool })),
);
const GpaCalculator = lazy(() => import("./GpaCalculator").then((m) => ({ default: m.GpaCalculator })));
const OvertimePayTool = lazy(() => import("./OvertimePayTool").then((m) => ({ default: m.OvertimePayTool })));
const UtmBuilderTool = lazy(() => import("./UtmBuilderTool").then((m) => ({ default: m.UtmBuilderTool })));
const TileCalculatorTool = lazy(() => import("./TileCalculatorTool").then((m) => ({ default: m.TileCalculatorTool })));
const VatExtractorTool = lazy(() => import("./VatExtractorTool").then((m) => ({ default: m.VatExtractorTool })));
const AcSizeTool = lazy(() => import("./AcSizeTool").then((m) => ({ default: m.AcSizeTool })));
const ConcreteCalculatorTool = lazy(() => import("./ConcreteCalculatorTool").then((m) => ({ default: m.ConcreteCalculatorTool })));
const WallpaperCalculatorTool = lazy(() => import("./WallpaperCalculatorTool").then((m) => ({ default: m.WallpaperCalculatorTool })));
const DrywallCalculatorTool = lazy(() => import("./DrywallCalculatorTool").then((m) => ({ default: m.DrywallCalculatorTool })));
const MeetingCostTool = lazy(() => import("./MeetingCostTool").then((m) => ({ default: m.MeetingCostTool })));
const PaintCalculatorTool = lazy(() => import("./PaintCalculatorTool").then((m) => ({ default: m.PaintCalculatorTool })));
const StairCalculatorTool = lazy(() => import("./StairCalculatorTool").then((m) => ({ default: m.StairCalculatorTool })));
const FenceCalculatorTool = lazy(() => import("./FenceCalculatorTool").then((m) => ({ default: m.FenceCalculatorTool })));
const GravelCalculatorTool = lazy(() => import("./GravelCalculatorTool").then((m) => ({ default: m.GravelCalculatorTool })));
const FlooringCalculatorTool = lazy(() => import("./FlooringCalculatorTool").then((m) => ({ default: m.FlooringCalculatorTool })));
const AirFryerCalculatorTool = lazy(() => import("./AirFryerCalculatorTool").then((m) => ({ default: m.AirFryerCalculatorTool })));
const BakersPercentageTool = lazy(() => import("./BakersPercentageTool").then((m) => ({ default: m.BakersPercentageTool })));
const DeckCalculatorTool = lazy(() => import("./DeckCalculatorTool").then((m) => ({ default: m.DeckCalculatorTool })));
const RoofCalculatorTool = lazy(() => import("./RoofCalculatorTool").then((m) => ({ default: m.RoofCalculatorTool })));
const PoolCalculatorTool = lazy(() => import("./PoolCalculatorTool").then((m) => ({ default: m.PoolCalculatorTool })));
