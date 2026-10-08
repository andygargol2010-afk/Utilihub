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
const DocumentTool = lazy(() => import("./DocumentTool").then((m) => ({ default: m.DocumentTool })));
const UtilityAdvancedTool = lazy(() =>
  import("./UtilityAdvancedTool").then((m) => ({ default: m.UtilityAdvancedTool })),
);
const SeoGrowthTool = lazy(() => import("./SeoGrowthTool").then((m) => ({ default: m.SeoGrowthTool })));
const PercentAdvancedTool = lazy(() =>
  import("./PercentAdvancedTool").then((m) => ({ default: m.PercentAdvancedTool })),
);
const AlgebraAdvancedTool = lazy(() =>
  import("./AlgebraAdvancedTool").then((m) => ({ default: m.AlgebraAdvancedTool })),
);
const GeometrySuiteTool = lazy(() =>
  import("./GeometrySuiteTool").then((m) => ({ default: m.GeometrySuiteTool })),
);
const ArithmeticSuiteTool = lazy(() =>
  import("./ArithmeticSuiteTool").then((m) => ({ default: m.ArithmeticSuiteTool })),
);
const SequenceSuiteTool = lazy(() =>
  import("./SequenceSuiteTool").then((m) => ({ default: m.SequenceSuiteTool })),
);
const TrigSuiteTool = lazy(() =>
  import("./TrigSuiteTool").then((m) => ({ default: m.TrigSuiteTool })),
);
const ExpLogSuiteTool = lazy(() =>
  import("./ExpLogSuiteTool").then((m) => ({ default: m.ExpLogSuiteTool })),
);
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
const PaverCalculatorTool = lazy(() => import("./PaverCalculatorTool").then((m) => ({ default: m.PaverCalculatorTool })));
const SodCalculatorTool = lazy(() => import("./SodCalculatorTool").then((m) => ({ default: m.SodCalculatorTool })));
const GutterCalculatorTool = lazy(() => import("./GutterCalculatorTool").then((m) => ({ default: m.GutterCalculatorTool })));
const InsulationCalculatorTool = lazy(() => import("./InsulationCalculatorTool").then((m) => ({ default: m.InsulationCalculatorTool })));
const BrickCalculatorTool = lazy(() => import("./BrickCalculatorTool").then((m) => ({ default: m.BrickCalculatorTool })));
const YeastConverterTool = lazy(() => import("./YeastConverterTool").then((m) => ({ default: m.YeastConverterTool })));
const DoughWaterTempTool = lazy(() => import("./DoughWaterTempTool").then((m) => ({ default: m.DoughWaterTempTool })));
const SidingCalculatorTool = lazy(() => import("./SidingCalculatorTool").then((m) => ({ default: m.SidingCalculatorTool })));
const BaseboardCalculatorTool = lazy(() => import("./BaseboardCalculatorTool").then((m) => ({ default: m.BaseboardCalculatorTool })));
const GrassSeedCalculatorTool = lazy(() => import("./GrassSeedCalculatorTool").then((m) => ({ default: m.GrassSeedCalculatorTool })));
const FirewoodCalculatorTool = lazy(() => import("./FirewoodCalculatorTool").then((m) => ({ default: m.FirewoodCalculatorTool })));
const SheetCalculatorTool = lazy(() => import("./SheetCalculatorTool").then((m) => ({ default: m.SheetCalculatorTool })));
const CaulkCalculatorTool = lazy(() => import("./CaulkCalculatorTool").then((m) => ({ default: m.CaulkCalculatorTool })));
const GroutCalculatorTool = lazy(() => import("./GroutCalculatorTool").then((m) => ({ default: m.GroutCalculatorTool })));
const ThinsetCalculatorTool = lazy(() => import("./ThinsetCalculatorTool").then((m) => ({ default: m.ThinsetCalculatorTool })));
const HeatIndexTool = lazy(() => import("./HeatIndexTool").then((m) => ({ default: m.HeatIndexTool })));
const DewPointTool = lazy(() => import("./DewPointTool").then((m) => ({ default: m.DewPointTool })));
const RaisedBedCalculatorTool = lazy(() => import("./RaisedBedCalculatorTool").then((m) => ({ default: m.RaisedBedCalculatorTool })));
const RetainingWallCalculatorTool = lazy(() => import("./RetainingWallCalculatorTool").then((m) => ({ default: m.RetainingWallCalculatorTool })));
const StudCalculatorTool = lazy(() => import("./StudCalculatorTool").then((m) => ({ default: m.StudCalculatorTool })));
const RainwaterCalculatorTool = lazy(() => import("./RainwaterCalculatorTool").then((m) => ({ default: m.RainwaterCalculatorTool })));
const BoardFootCalculatorTool = lazy(() => import("./BoardFootCalculatorTool").then((m) => ({ default: m.BoardFootCalculatorTool })));
const RobotsTxtTool = lazy(() => import("./RobotsTxtTool").then((m) => ({ default: m.RobotsTxtTool })));
const SchengenCalculatorTool = lazy(() => import("./SchengenCalculatorTool").then((m) => ({ default: m.SchengenCalculatorTool })));
const IsbnValidatorTool = lazy(() => import("./IsbnValidatorTool").then((m) => ({ default: m.IsbnValidatorTool })));
const IcsEventTool = lazy(() => import("./IcsEventTool").then((m) => ({ default: m.IcsEventTool })));
const WindChillTool = lazy(() => import("./WindChillTool").then((m) => ({ default: m.WindChillTool })));
const IsoDurationTool = lazy(() => import("./IsoDurationTool").then((m) => ({ default: m.IsoDurationTool })));
const ContrastTool = lazy(() => import("./ContrastTool").then((m) => ({ default: m.ContrastTool })));
const CronTool = lazy(() => import("./CronTool").then((m) => ({ default: m.CronTool })));
const NatoTool = lazy(() => import("./NatoTool").then((m) => ({ default: m.NatoTool })));
const JetLagTool = lazy(() => import("./JetLagTool").then((m) => ({ default: m.JetLagTool })));
const IbanTool = lazy(() => import("./IbanTool").then((m) => ({ default: m.IbanTool })));
const ShoeSizeTool = lazy(() => import("./ShoeSizeTool").then((m) => ({ default: m.ShoeSizeTool })));
const ChmodTool = lazy(() => import("./ChmodTool").then((m) => ({ default: m.ChmodTool })));
const ResistorBandsTool = lazy(() => import("./ResistorBandsTool").then((m) => ({ default: m.ResistorBandsTool })));
const ApaCitationTool = lazy(() => import("./ApaCitationTool").then((m) => ({ default: m.ApaCitationTool })));
const ChordTransposeTool = lazy(() => import("./ChordTransposeTool").then((m) => ({ default: m.ChordTransposeTool })));
const DniLetterTool = lazy(() => import("./DniLetterTool").then((m) => ({ default: m.DniLetterTool })));
const SubnetTool = lazy(() => import("./SubnetTool").then((m) => ({ default: m.SubnetTool })));
const CoordinatesTool = lazy(() => import("./CoordinatesTool").then((m) => ({ default: m.CoordinatesTool })));
const EanTool = lazy(() => import("./EanTool").then((m) => ({ default: m.EanTool })));
const ClampTool = lazy(() => import("./ClampTool").then((m) => ({ default: m.ClampTool })));
const BrailleTool = lazy(() => import("./BrailleTool").then((m) => ({ default: m.BrailleTool })));
const UlidTool = lazy(() => import("./UlidTool").then((m) => ({ default: m.UlidTool })));
const DecibelTool = lazy(() => import("./DecibelTool").then((m) => ({ default: m.DecibelTool })));
const JwtTool = lazy(() => import("./JwtTool").then((m) => ({ default: m.JwtTool })));
const PasswordEntropyTool = lazy(() => import("./PasswordEntropyTool").then((m) => ({ default: m.PasswordEntropyTool })));
const OpenGraphTool = lazy(() => import("./OpenGraphTool").then((m) => ({ default: m.OpenGraphTool })));
const MarkdownTableTool = lazy(() => import("./MarkdownTableTool").then((m) => ({ default: m.MarkdownTableTool })));
const JsonToTypescriptTool = lazy(() => import("./JsonToTypescriptTool").then((m) => ({ default: m.JsonToTypescriptTool })));
const LuhnTool = lazy(() => import("./LuhnTool").then((m) => ({ default: m.LuhnTool })));
const BpmDelayTool = lazy(() => import("./BpmDelayTool").then((m) => ({ default: m.BpmDelayTool })));

type ToolComp = ComponentType<{ tool: GeneralTool; locale?: "en" | "es" }>;

function pickComponent(tool: GeneralTool): ToolComp {
  if (tool.slug === "gpa") return GpaCalculator as ToolComp;
  if (tool.slug === "calculadora-horas-extra") return OvertimePayTool as ToolComp;
  if (tool.slug === "generador-utm") return UtmBuilderTool as ToolComp;
  if (tool.slug === "calculadora-baldosas") return TileCalculatorTool as ToolComp;
  if (tool.slug === "quitar-iva") return VatExtractorTool as ToolComp;
  if (tool.slug === "calculadora-btu") return AcSizeTool as ToolComp;
  if (tool.slug === "calculadora-hormigon") return ConcreteCalculatorTool as ToolComp;
  if (tool.slug === "calculadora-papel-pintado") return WallpaperCalculatorTool as ToolComp;
  if (tool.slug === "calculadora-pladur") return DrywallCalculatorTool as ToolComp;
  if (tool.slug === "coste-reunion") return MeetingCostTool as ToolComp;
  if (tool.slug === "calculadora-pintura") return PaintCalculatorTool as ToolComp;
  if (tool.slug === "calculadora-valla") return FenceCalculatorTool as ToolComp;
  if (tool.slug === "calculadora-escalera") return StairCalculatorTool as ToolComp;
  if (tool.slug === "calculadora-grava") return GravelCalculatorTool as ToolComp;
  if (tool.slug === "calculadora-suelo-laminado") return FlooringCalculatorTool as ToolComp;
  if (tool.slug === "conversor-freidora-aire") return AirFryerCalculatorTool as ToolComp;
  if (tool.slug === "calculadora-porcentaje-panadero") return BakersPercentageTool as ToolComp;
  if (tool.slug === "calculadora-deck") return DeckCalculatorTool as ToolComp;
  if (tool.slug === "calculadora-tejado") return RoofCalculatorTool as ToolComp;
  if (tool.slug === "calculadora-piscina") return PoolCalculatorTool as ToolComp;
  if (tool.slug === "calculadora-adoquines") return PaverCalculatorTool as ToolComp;
  if (tool.slug === "calculadora-cesped") return SodCalculatorTool as ToolComp;
  if (tool.slug === "calculadora-canalones") return GutterCalculatorTool as ToolComp;
  if (tool.slug === "calculadora-aislamiento") return InsulationCalculatorTool as ToolComp;
  if (tool.slug === "calculadora-ladrillos") return BrickCalculatorTool as ToolComp;
  if (tool.slug === "conversor-levadura") return YeastConverterTool as ToolComp;
  if (tool.slug === "temperatura-agua-masa") return DoughWaterTempTool as ToolComp;
  if (tool.slug === "calculadora-siding") return SidingCalculatorTool as ToolComp;
  if (tool.slug === "calculadora-zocalos") return BaseboardCalculatorTool as ToolComp;
  if (tool.slug === "calculadora-semilla-cesped") return GrassSeedCalculatorTool as ToolComp;
  if (tool.slug === "calculadora-lena") return FirewoodCalculatorTool as ToolComp;
  if (tool.slug === "calculadora-tableros") return SheetCalculatorTool as ToolComp;
  if (tool.slug === "calculadora-silicona") return CaulkCalculatorTool as ToolComp;
  if (tool.slug === "calculadora-junta-baldosas") return GroutCalculatorTool as ToolComp;
  if (tool.slug === "calculadora-adhesivo-baldosas") return ThinsetCalculatorTool as ToolComp;
  if (tool.slug === "calculadora-sensacion-termica") return HeatIndexTool as ToolComp;
  if (tool.slug === "calculadora-punto-rocio") return DewPointTool as ToolComp;
  if (tool.slug === "calculadora-jardinera") return RaisedBedCalculatorTool as ToolComp;
  if (tool.slug === "calculadora-muro-contencion") return RetainingWallCalculatorTool as ToolComp;
  if (tool.slug === "calculadora-montantes") return StudCalculatorTool as ToolComp;
  if (tool.slug === "calculadora-agua-lluvia") return RainwaterCalculatorTool as ToolComp;
  if (tool.slug === "calculadora-pies-tablares") return BoardFootCalculatorTool as ToolComp;
  if (tool.slug === "generador-robots-txt") return RobotsTxtTool as ToolComp;
  if (tool.slug === "calculadora-schengen") return SchengenCalculatorTool as ToolComp;
  if (tool.slug === "validador-isbn") return IsbnValidatorTool as ToolComp;
  if (tool.slug === "generador-ics") return IcsEventTool as ToolComp;
  if (tool.slug === "calculadora-enfriamiento-viento") return WindChillTool as ToolComp;
  if (tool.slug === "generador-duracion-iso") return IsoDurationTool as ToolComp;
  if (tool.slug === "validador-contraste") return ContrastTool as ToolComp;
  if (tool.slug === "generador-cron") return CronTool as ToolComp;
  if (tool.slug === "traductor-fonetico-otan") return NatoTool as ToolComp;
  if (tool.slug === "planificador-jet-lag") return JetLagTool as ToolComp;
  if (tool.slug === "validador-iban") return IbanTool as ToolComp;
  if (tool.slug === "conversor-tallas-zapatos") return ShoeSizeTool as ToolComp;
  if (tool.slug === "conversor-permisos-chmod") return ChmodTool as ToolComp;
  if (tool.slug === "decodificador-bandas-resistencia") return ResistorBandsTool as ToolComp;
  if (tool.slug === "generador-cita-apa") return ApaCitationTool as ToolComp;
  if (tool.slug === "transportador-acordes") return ChordTransposeTool as ToolComp;
  if (tool.slug === "letra-dni-nie") return DniLetterTool as ToolComp;
  if (tool.slug === "calculadora-subred") return SubnetTool as ToolComp;
  if (tool.slug === "conversor-coordenadas") return CoordinatesTool as ToolComp;
  if (tool.slug === "validador-ean") return EanTool as ToolComp;
  if (tool.slug === "generador-css-clamp") return ClampTool as ToolComp;
  if (tool.slug === "traductor-braille") return BrailleTool as ToolComp;
  if (tool.slug === "generador-ulid") return UlidTool as ToolComp;
  if (tool.slug === "sumador-decibelios") return DecibelTool as ToolComp;
  if (tool.slug === "decodificador-jwt") return JwtTool as ToolComp;
  if (tool.slug === "estimador-entropia-contrasena") return PasswordEntropyTool as ToolComp;
  if (tool.slug === "generador-open-graph") return OpenGraphTool as ToolComp;
  if (tool.slug === "generador-tabla-markdown") return MarkdownTableTool as ToolComp;
  if (tool.slug === "json-a-typescript") return JsonToTypescriptTool as ToolComp;
  if (tool.slug === "validador-luhn") return LuhnTool as ToolComp;
  if (tool.slug === "convertidor-delay-bpm") return BpmDelayTool as ToolComp;
  if (tool.config?.mode === "seo-growth") return SeoGrowthTool as ToolComp;
  if (tool.config?.mode === "percent-advanced") return PercentAdvancedTool as ToolComp;
  if (tool.config?.mode === "algebra-advanced") return AlgebraAdvancedTool as ToolComp;
  if (tool.config?.mode === "geometry-suite") return GeometrySuiteTool as ToolComp;
  if (tool.config?.mode === "arithmetic-suite") return ArithmeticSuiteTool as ToolComp;
  if (tool.config?.mode === "sequence-suite") return SequenceSuiteTool as ToolComp;
  if (tool.config?.mode === "trig-suite") return TrigSuiteTool as ToolComp;
  if (tool.config?.mode === "explog-suite") return ExpLogSuiteTool as ToolComp;
  if (tool.config?.mode === "matrix-binary-suite") return MatrixBinarySuiteTool as ToolComp;
  if (tool.slug === "secuencias") return SequenceTool as ToolComp;
  if (tool.slug === "potencias-y-raices") return PowerRootTool as ToolComp;
  if (tool.slug === "distribucion-normal") return NormalDistributionTool as ToolComp;
  if (tool.slug === "distribucion-poisson") return PoissonTool as ToolComp;
  if (tool.config?.mode === "document") return DocumentTool as ToolComp;
  if (tool.category === "utilidades" && tool.kind === "formula") return UtilityAdvancedTool as ToolComp;
  if (tool.config?.mode === "finance") return FinanceTool as ToolComp;
  if (tool.config?.mode === "date") return AdvancedDateTool as ToolComp;
  if (tool.config?.mode === "advanced" && tool.config?.operation) return AdvancedCalculatorTool as ToolComp;
  if (tool.config?.operation) return ConfiguredTool as ToolComp;
  if (tool.category === "desarrollo") return DevTool as ToolComp;
  if (tool.kind === "image" || tool.kind === "pdf") return MediaTool as ToolComp;
  if (tool.kind === "generator") return GeneratorTool as ToolComp;
  if (tool.kind === "text") return TextTool as ToolComp;
  if (tool.kind === "time") return TimeTool as ToolComp;
  if (tool.kind === "education-test" || tool.category === "educacion") return EducationTool as ToolComp;
  if (tool.category === "diseno") return DesignTool as ToolComp;
  if (tool.category === "seguridad") return SecurityTool as ToolComp;
  if (tool.category === "ciencia") return ScienceTool as ToolComp;
  if (tool.category === "conversiones") return ConverterTool as ToolComp;
  if (tool.kind === "stats") return MathTool as ToolComp;
  if (tool.kind === "number") return FormulaTool as ToolComp;
  if (tool.category === "fechas") return TimeTool as ToolComp;
  return GeneralToolUi as ToolComp;
}

/** O(1) tool lookup — avoid scanning GENERAL_TOOLS on every registry access. */
// Studios live in registry-3d so this module has no import() edge to three.js.
const STUDIO_3D_SLUGS = new Set(["modelador-3d", "modelador-casas-3d"]);
const TOOL_BY_SLUG = new Map(
  GENERAL_TOOLS.filter((tool) => !STUDIO_3D_SLUGS.has(tool.slug)).map((tool) => [tool.slug, tool]),
);

/**
 * Build a registry that only materializes render closures for tools that are
 * actually opened (instead of allocating one closure per catalog entry × locale).
 */
function buildLazyRegistry(locale: "en" | "es"): Record<string, () => ReactNode> {
  const cache = new Map<string, () => ReactNode>();

  return new Proxy({} as Record<string, () => ReactNode>, {
    get(_target, prop) {
      if (typeof prop !== "string") return undefined;
      // Avoid Promise-like traps when something does `await registry`
      if (prop === "then") return undefined;

      const hit = cache.get(prop);
      if (hit) return hit;

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
