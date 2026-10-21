import { lazy, type ComponentType, type ReactNode } from "react";
import { GENERAL_TOOLS } from "@/lib/general";
import type { GeneralTool } from "@/lib/general/types";

/** Full general tool UI registry — restore 2026-10-13 anti-wipe + email validator + ohms law + password strength + hex color converter + aspect ratio + csv to json + xml to json + base64 + gpa + pomodoro + box shadow + download time + unit price + body fat + kinetic energy + timezone + percentage of + slug generator + bill split + currency converter + water intake + recipe cost + electricity cost + word counter + loan payment + average speed + acceleration + fuel efficiency + heart rate zones + savings goal + hourly rate + line sorter + business days + text normalizer + budget 503020 + uuid generator + date difference + recipe scaler + rule of 72 + room area + final grade + temperature converter + proportion calculator + css gradient generator + character counter + calorie deficit + trip time + force + bac + tip tax + sphere volume + sentence counter + cylinder volume + paragraph counter + density + word frequency + circle area + vowel counter + rectangle area + consonant counter + profit margin + weighted average + circle circumference + rectangle perimeter + pressure converter + calories burned + pyramid volume + trapezoid area + parallelogram area + rectangular prism volume + cube volume + syllable counter + triangle area + simple interest + tile + square area + fuel cost + reading time + coffee ratio + rhombus area. */

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
const Status = lazy(() => import("./SlugGeneratorTool").then((m) => ({ default: m.SlugGeneratorTool })));
