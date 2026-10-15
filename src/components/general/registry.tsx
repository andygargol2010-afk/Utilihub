import { lazy, type ComponentType, type ReactNode } from "react";
import { GENERAL_TOOLS } from "@/lib/general";
import type { GeneralTool } from "@/lib/general/types";

/** Full general tool UI registry — restore 2026-10-13 anti-wipe + email validator + ohms law + password strength + hex color converter + aspect ratio + csv to json + xml to json + base64 + gpa + pomodoro + box shadow + download time + unit price + body fat + kinetic energy + timezone + percentage of + slug generator + bill split + currency converter + water intake. */

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
const PercentageChangeTool = lazy(() => import("./PercentageChangeTool").then((m) => ({ default: m.PercentageChangeTool })));
const MacroCalculatorTool = lazy(() => import("./MacroCalculatorTool").then((m) => ({ default: m.MacroCalculatorTool })));
const IdealWeightCalculatorTool = lazy(() => import("./IdealWeightCalculatorTool").then((m) => ({ default: m.IdealWeightCalculatorTool })));
const CompanyNameGeneratorTool = lazy(() => import("./CompanyNameGeneratorTool").then((m) => ({ default: m.CompanyNameGeneratorTool })));
const EmailValidatorTool = lazy(() => import("./EmailValidatorTool").then((m) => ({ default: m.EmailValidatorTool })));
const OhmsLawTool = lazy(() => import("./OhmsLawTool").then((m) => ({ default: m.OhmsLawTool })));
const PasswordStrengthTool = lazy(() => import("./PasswordStrengthTool").then((m) => ({ default: m.PasswordStrengthTool })));
const HexColorConverterTool = lazy(() => import("./HexColorConverterTool").then((m) => ({ default: m.HexColorConverterTool })));
const AspectRatioTool = lazy(() => import("./AspectRatioTool").then((m) => ({ default: m.AspectRatioTool })));
const CsvToJsonTool = lazy(() => import("./CsvToJsonTool").then((m) => ({ default: m.CsvToJsonTool })));
const XmlToJsonTool = lazy(() => import("./XmlToJsonTool").then((m) => ({ default: m.XmlToJsonTool })));
const Base64Tool = lazy(() => import("./Base64Tool").then((m) => ({ default: m.Base64Tool })));
const GpaCalculatorTool = lazy(() => import("./GpaCalculatorTool").then((m) => ({ default: m.GpaCalculatorTool })));
const PomodoroTimerTool = lazy(() => import("./PomodoroTimerTool").then((m) => ({ default: m.PomodoroTimerTool })));
const BoxShadowTool = lazy(() => import("./BoxShadowTool").then((m) => ({ default: m.BoxShadowTool })));
const DownloadTimeTool = lazy(() => import("./DownloadTimeTool").then((m) => ({ default: m.DownloadTimeTool })));
const UnitPriceTool = lazy(() => import("./UnitPriceTool").then((m) => ({ default: m.UnitPriceTool })));
const BodyFatCalculatorTool = lazy(() => import("./BodyFatCalculatorTool").then((m) => ({ default: m.BodyFatCalculatorTool })));
const KineticEnergyTool = lazy(() => import("./KineticEnergyTool").then((m) => ({ default: m.KineticEnergyTool })));
const TimezoneTool = lazy(() => import("./TimezoneTool").then((m) => ({ default: m.TimezoneTool })));
const PercentageOfTool = lazy(() => import("./PercentageOfTool").then((m) => ({ default: m.PercentageOfTool })));
const SlugGeneratorTool = lazy(() => import("./SlugGeneratorTool").then((m) => ({ default: m.SlugGeneratorTool })));
const BillSplitTool = lazy(() => import("./BillSplitTool").then((m) => ({ default: m.BillSplitTool })));
const CurrencyConverterTool = lazy(() => import("./CurrencyConverterTool").then((m) => ({ default: m.CurrencyConverterTool })));
const WaterIntakeTool = lazy(() => import("./WaterIntakeTool").then((m) => ({ default: m.WaterIntakeTool })));

type ToolComp = ComponentType<{ tool: GeneralTool; locale?: "en" | "es" }>;

function pickComponent(tool: GeneralTool): ToolComp {
  if (tool.slug === "calculadora-cambio-porcentaje") return PercentageChangeTool as ToolComp;
  if (tool.slug === "calculadora-macros") return MacroCalculatorTool as ToolComp;
  if (tool.slug === "calculadora-peso-ideal") return IdealWeightCalculatorTool as ToolComp;
  if (tool.slug === "generador-nombres-empresa") return CompanyNameGeneratorTool as ToolComp;
  if (tool.slug === "validador-email") return EmailValidatorTool as ToolComp;
  if (tool.slug === "calculadora-ley-ohm") return OhmsLawTool as ToolComp;
  if (tool.slug === "password-strength") return PasswordStrengthTool as ToolComp;
  if (tool.slug === "conversor-color-hex") return HexColorConverterTool as ToolComp;
  if (tool.slug === "calculadora-relacion-aspecto") return AspectRatioTool as ToolComp;
  if (tool.slug === "conversor-csv-json") return CsvToJsonTool as ToolComp;
  if (tool.slug === "conversor-xml-json") return XmlToJsonTool as ToolComp;
  if (tool.slug === "base64-encoder-decoder") return Base64Tool as ToolComp;
  if (tool.slug === "calculadora-gpa") return GpaCalculatorTool as ToolComp;
  if (tool.slug === "temporizador-pomodoro") return PomodoroTimerTool as ToolComp;
  if (tool.slug === "generador-sombra-css") return BoxShadowTool as ToolComp;
  if (tool.slug === "calculadora-tiempo-descarga") return DownloadTimeTool as ToolComp;
  if (tool.slug === "calculadora-precio-unitario") return UnitPriceTool as ToolComp;
  if (tool.slug === "calculadora-grasa-corporal") return BodyFatCalculatorTool as ToolComp;
  if (tool.slug === "calculadora-energia-cinetica") return KineticEnergyTool as ToolComp;
  if (tool.slug === "conversor-zona-horaria") return TimezoneTool as ToolComp;
  if (tool.slug === "calculadora-porcentaje-de") return PercentageOfTool as ToolComp;
  if (tool.slug === "generador-slug") return SlugGeneratorTool as ToolComp;
  if (tool.slug === "dividir-cuenta") return BillSplitTool as ToolComp;
  if (tool.slug === "conversor-divisas") return CurrencyConverterTool as ToolComp;
  if (tool.slug === "calculadora-ingesta-agua") return WaterIntakeTool as ToolComp;
  if (tool.slug === "calculadora-fecha-avanzada") return AdvancedDateTool as ToolComp;
  if (tool.config?.mode === "advanced-calculator") return AdvancedCalculatorTool as ToolComp;
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
  if (tool.category === "finanzas") return FinanceTool as ToolComp;
  return GeneralToolUi as ToolComp;
}

const STUDIO_3D_SLUGS = new Set(["modelador-3d", "modelador-casas-3d"]);
const TOOL_BY_SLUG = new Map(
  GENERAL_TOOLS.filter((tool) => !STUDIO_3D_SLUGS.has(tool.slug)).map((tool) => [tool.slug, tool]),
);

function buildLazyRegistry(locale: "en" | "es"): Record<string, () => ReactNode> {
  const cache = new Map<string, () => ReactNode>();
  return new Proxy({} as Record<string, () => ReactNode>, {
    get(_target, prop) {
      if (typeof prop !== "string") return undefined;
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
