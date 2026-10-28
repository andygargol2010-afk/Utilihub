// Lazy tool UIs part 04 — split out of ../registry.tsx on 2026-10-28.
// Add new entries in the smallest file of this folder; never rewrite files wholesale.
import { lazy } from "react";

export const BrailleToolUi = lazy(() =>
  import("../BrailleTool").then((m) => ({ default: m.BrailleTool })),
);

export const UlidToolUi = lazy(() =>
  import("../UlidTool").then((m) => ({ default: m.UlidTool })),
);

export const DecibelToolUi = lazy(() =>
  import("../DecibelTool").then((m) => ({ default: m.DecibelTool })),
);

export const JwtToolUi = lazy(() =>
  import("../JwtTool").then((m) => ({ default: m.JwtTool })),
);

export const PasswordEntropyToolUi = lazy(() =>
  import("../PasswordEntropyTool").then((m) => ({ default: m.PasswordEntropyTool })),
);

export const OpenGraphToolUi = lazy(() =>
  import("../OpenGraphTool").then((m) => ({ default: m.OpenGraphTool })),
);

export const MarkdownTableToolUi = lazy(() =>
  import("../MarkdownTableTool").then((m) => ({ default: m.MarkdownTableTool })),
);

export const JsonToTypescriptToolUi = lazy(() =>
  import("../JsonToTypescriptTool").then((m) => ({ default: m.JsonToTypescriptTool })),
);

export const LuhnToolUi = lazy(() =>
  import("../LuhnTool").then((m) => ({ default: m.LuhnTool })),
);

export const BpmDelayToolUi = lazy(() =>
  import("../BpmDelayTool").then((m) => ({ default: m.BpmDelayTool })),
);

export const VcardToolUi = lazy(() =>
  import("../VcardTool").then((m) => ({ default: m.VcardTool })),
);

export const SecurityTxtToolUi = lazy(() =>
  import("../SecurityTxtTool").then((m) => ({ default: m.SecurityTxtTool })),
);

export const RutChileToolUi = lazy(() =>
  import("../RutChileTool").then((m) => ({ default: m.RutChileTool })),
);

export const MorseToolUi = lazy(() =>
  import("../MorseTool").then((m) => ({ default: m.MorseTool })),
);

export const GitignoreToolUi = lazy(() =>
  import("../GitignoreTool").then((m) => ({ default: m.GitignoreTool })),
);

export const RiceToolUi = lazy(() =>
  import("../RiceTool").then((m) => ({ default: m.RiceTool })),
);

export const SrtOffsetToolUi = lazy(() =>
  import("../SrtOffsetTool").then((m) => ({ default: m.SrtOffsetTool })),
);

export const ManifestToolUi = lazy(() =>
  import("../ManifestTool").then((m) => ({ default: m.ManifestTool })),
);

export const OklchToolUi = lazy(() =>
  import("../OklchTool").then((m) => ({ default: m.OklchTool })),
);

export const WhatsAppLinkToolUi = lazy(() =>
  import("../WhatsAppLinkTool").then((m) => ({ default: m.WhatsAppLinkTool })),
);

export const IsoWeekToolUi = lazy(() =>
  import("../IsoWeekTool").then((m) => ({ default: m.IsoWeekTool })),
);

export const BeaufortToolUi = lazy(() =>
  import("../BeaufortTool").then((m) => ({ default: m.BeaufortTool })),
);

export const PalindromeToolUi = lazy(() =>
  import("../PalindromeTool").then((m) => ({ default: m.PalindromeTool })),
);

export const UnixTimestampToolUi = lazy(() =>
  import("../UnixTimestampTool").then((m) => ({ default: m.UnixTimestampTool })),
);

export const CaseConverterToolUi = lazy(() =>
  import("../CaseConverterTool").then((m) => ({ default: m.CaseConverterTool })),
);

export const PaceCalculatorToolUi = lazy(() =>
  import("../PaceCalculatorTool").then((m) => ({ default: m.PaceCalculatorTool })),
);

export const RandomColorToolUi = lazy(() =>
  import("../RandomColorTool").then((m) => ({ default: m.RandomColorTool })),
);

export const RandomUsernameToolUi = lazy(() =>
  import("../RandomUsernameTool").then((m) => ({ default: m.RandomUsernameTool })),
);

export const QrCodeGeneratorToolUi = lazy(() =>
  import("../QrCodeGeneratorTool").then((m) => ({ default: m.QrCodeGeneratorTool })),
);

export const RandomQuoteToolUi = lazy(() =>
  import("../RandomQuoteTool").then((m) => ({ default: m.RandomQuoteTool })),
);

export const WaterIntakeToolUi = lazy(() =>
  import("../WaterIntakeTool").then((m) => ({ default: m.WaterIntakeTool })),
);

export const TdeeCalculatorToolUi = lazy(() =>
  import("../TdeeCalculatorTool").then((m) => ({ default: m.TdeeCalculatorTool })),
);

export const DueDateCalculatorToolUi = lazy(() =>
  import("../DueDateCalculatorTool").then((m) => ({ default: m.DueDateCalculatorTool })),
);

export const DiscountCalculatorToolUi = lazy(() =>
  import("../DiscountCalculatorTool").then((m) => ({ default: m.DiscountCalculatorTool })),
);

export const MacroCalculatorToolUi = lazy(() =>
  import("../MacroCalculatorTool").then((m) => ({ default: m.MacroCalculatorTool })),
);

export const CompanyNameGeneratorToolUi = lazy(() =>
  import("../CompanyNameGeneratorTool").then((m) => ({ default: m.CompanyNameGeneratorTool })),
);

export const EmailValidatorToolUi = lazy(() =>
  import("../EmailValidatorTool").then((m) => ({ default: m.EmailValidatorTool })),
);

export const OhmsLawToolUi = lazy(() =>
  import("../OhmsLawTool").then((m) => ({ default: m.OhmsLawTool })),
);

export const PasswordStrengthToolUi = lazy(() =>
  import("../PasswordStrengthTool").then((m) => ({ default: m.PasswordStrengthTool })),
);

export const HexColorConverterToolUi = lazy(() =>
  import("../HexColorConverterTool").then((m) => ({ default: m.HexColorConverterTool })),
);

export const CsvToJsonToolUi = lazy(() =>
  import("../CsvToJsonTool").then((m) => ({ default: m.CsvToJsonTool })),
);

export const XmlToJsonToolUi = lazy(() =>
  import("../XmlToJsonTool").then((m) => ({ default: m.XmlToJsonTool })),
);

export const Base64ToolUi = lazy(() =>
  import("../Base64Tool").then((m) => ({ default: m.Base64Tool })),
);

export const PomodoroTimerToolUi = lazy(() =>
  import("../PomodoroTimerTool").then((m) => ({ default: m.PomodoroTimerTool })),
);

export const DownloadTimeToolUi = lazy(() =>
  import("../DownloadTimeTool").then((m) => ({ default: m.DownloadTimeTool })),
);

export const BodyFatCalculatorToolUi = lazy(() =>
  import("../BodyFatCalculatorTool").then((m) => ({ default: m.BodyFatCalculatorTool })),
);

export const KineticEnergyToolUi = lazy(() =>
  import("../KineticEnergyTool").then((m) => ({ default: m.KineticEnergyTool })),
);

export const TimezoneToolUi = lazy(() =>
  import("../TimezoneTool").then((m) => ({ default: m.TimezoneTool })),
);

export const PercentageOfToolUi = lazy(() =>
  import("../PercentageOfTool").then((m) => ({ default: m.PercentageOfTool })),
);

export const SlugGeneratorToolUi = lazy(() =>
  import("../SlugGeneratorTool").then((m) => ({ default: m.SlugGeneratorTool })),
);

export const TriangleAreaCalculatorToolUi = lazy(() =>
  import("../TriangleAreaCalculatorTool").then((m) => ({ default: m.TriangleAreaCalculatorTool })),
);

export const SimpleAverageCalculatorToolUi = lazy(() =>
  import("../SimpleAverageCalculatorTool").then((m) => ({ default: m.SimpleAverageCalculatorTool })),
);
