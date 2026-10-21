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
const FinanceTool = lazy(() => import("./FinanceTool").then((m) => ({ default: m.FinanceTool })));
const TextTool = lazy(() => import("./TextTool").then((m) => ({ default: m.TextTool })));
const DeveloperTool = lazy(() => import("./DeveloperTool").then((m) => ({ default: m.DeveloperTool })));
const HealthTool = lazy(() => import("./HealthTool").then((m) => ({ default: m.HealthTool })));
const CookingTool = lazy(() => import("./CookingTool").then((m) => ({ default: m.CookingTool })));
const EducationTool = lazy(() => import("./EducationTool").then((m) => ({ default: m.EducationTool })));
const GeometryTool = lazy(() => import("./GeometryTool").then((m) => ({ default: m.GeometryTool })));
const StatisticsTool = lazy(() => import("./StatisticsTool").then((m) => ({ default: m.StatisticsTool })));
const UnitsTool = lazy(() => import("./UnitsTool").then((m) => ({ default: m.UnitsTool })));
const ColorTool = lazy(() => import("./ColorTool").then((m) => ({ default: m.ColorTool })));
const DateMathTool = lazy(() => import("./DateMathTool").then((m) => ({ default: m.DateMathTool })));
const PercentageTool = lazy(() => import("./PercentageTool").then((m) => ({ default: m.PercentageTool })));
const RandomGeneratorsTool = lazy(() => import("./RandomGeneratorsTool").then((m) => ({ default: m.RandomGeneratorsTool })));
const EncodeDecodeTool = lazy(() => import("./EncodeDecodeTool").then((m) => ({ default: m.EncodeDecodeTool })));
const CountAnalyzeTool = lazy(() => import("./CountAnalyzeTool").then((m) => ({ default: m.CountAnalyzeTool })));
const PhysicsTool = lazy(() => import("./PhysicsTool").then((m) => ({ default: m.PhysicsTool })));
const RetirementTool = lazy(() => import("./RetirementTool").then((m) => ({ default: m.RetirementTool })));
const InvestingTool = lazy(() => import("./InvestingTool").then((m) => ({ default: m.InvestingTool })));
const SavingsTool = lazy(() => import("./SavingsTool").then((m) => ({ default: m.SavingsTool })));
const LoansTool = lazy(() => import("./LoansTool").then((m) => ({ default: m.LoansTool })));
const TravelTool = lazy(() => import("./TravelTool").then((m) => ({ default: m.TravelTool })));
const CompareTool = lazy(() => import("./CompareTool").then((m) => ({ default: m.CompareTool })));
const TimersTool = lazy(() => import("./TimersTool").then((m) => ({ default: m.TimersTool })));

// Individual tool components (generated / maintained)
const AbsoluteErrorCalculatorTool = lazy(() => import("./AbsoluteErrorCalculatorTool").then((m) => ({ default: m.AbsoluteErrorCalculatorTool })));
const AbsoluteTemperatureConverterTool = lazy(() => import("./AbsoluteTemperatureConverterTool").then((m) => ({ default: m.AbsoluteTemperatureConverterTool })));
const AbsoluteValueCalculatorTool = lazy(() => import("./AbsoluteValueCalculatorTool").then((m) => ({ default: m.AbsoluteValueCalculatorTool })));
const AccelerationCalculatorTool = lazy(() => import("./AccelerationCalculatorTool").then((m) => ({ default: m.AccelerationCalculatorTool })));
const AddDaysToDateTool = lazy(() => import("./AddDaysToDateTool").then((m) => ({ default: m.AddDaysToDateTool })));
const AdvancedHexToHslTool = lazy(() => import("./AdvancedHexToHslTool").then((m) => ({ default: m.AdvancedHexToHslTool })));
const AdvancedMarkdownToHtmlTool = lazy(() => import("./AdvancedMarkdownToHtmlTool").then((m) => ({ default: m.AdvancedMarkdownToHtmlTool })));
const AmountPerPersonTool = lazy(() => import("./AmountPerPersonTool").then((m) => ({ default: m.AmountPerPersonTool })));
const AreaConverterTool = lazy(() => import("./AreaConverterTool").then((m) => ({ default: m.AreaConverterTool })));
const ArithmeticMeanCalculatorTool = lazy(() => import("./ArithmeticMeanCalculatorTool").then((m) => ({ default: m.ArithmeticMeanCalculatorTool })));
const AspectRatioCalculatorTool = lazy(() => import("./AspectRatioCalculatorTool").then((m) => ({ default: m.AspectRatioCalculatorTool })));
const AverageCalculatorTool = lazy(() => import("./AverageCalculatorTool").then((m) => ({ default: m.AverageCalculatorTool })));
const AverageOfTwoValuesTool = lazy(() => import("./AverageOfTwoValuesTool").then((m) => ({ default: m.AverageOfTwoValuesTool })));
const AveragePurchasePriceTool = lazy(() => import("./AveragePurchasePriceTool").then((m) => ({ default: m.AveragePurchasePriceTool })));
const AverageSpeedCalculatorTool = lazy(() => import("./AverageSpeedCalculatorTool").then((m) => ({ default: m.AverageSpeedCalculatorTool })));
const BakingTimeAdjustmentTool = lazy(() => import("./BakingTimeAdjustmentTool").then((m) => ({ default: m.BakingTimeAdjustmentTool })));
const Base64EncodeTool = lazy(() => import("./Base64EncodeTool").then((m) => ({ default: m.Base64EncodeTool })));
const BatchFileNamesTool = lazy(() => import("./BatchFileNamesTool").then((m) => ({ default: m.BatchFileNamesTool })));
const BillSplitCalculatorTool = lazy(() => import("./BillSplitCalculatorTool").then((m) => ({ default: m.BillSplitCalculatorTool })));
const BinaryToDecimalTool = lazy(() => import("./BinaryToDecimalTool").then((m) => ({ default: m.BinaryToDecimalTool })));
const BodyFatCalculatorTool = lazy(() => import("./BodyFatCalculatorTool").then((m) => ({ default: m.BodyFatCalculatorTool })));
const BorderRadiusGeneratorTool = lazy(() => import("./BorderRadiusGeneratorTool").then((m) => ({ default: m.BorderRadiusGeneratorTool })));
const BoxShadowGeneratorTool = lazy(() => import("./BoxShadowGeneratorTool").then((m) => ({ default: m.BoxShadowGeneratorTool })));
const BreadHydrationTool = lazy(() => import("./BreadHydrationTool").then((m) => ({ default: m.BreadHydrationTool })));
const Budget503020Tool = lazy(() => import("./Budget503020Tool").then((m) => ({ default: m.Budget503020Tool })));
const BusinessDaysCalculatorTool = lazy(() => import("./BusinessDaysCalculatorTool").then((m) => ({ default: m.BusinessDaysCalculatorTool })));
const CalorieDeficitCalculatorTool = lazy(() => import("./CalorieDeficitCalculatorTool").then((m) => ({ default: m.CalorieDeficitCalculatorTool })));
const CaloriesBurnedCalculatorTool = lazy(() => import("./CaloriesBurnedCalculatorTool").then((m) => ({ default: m.CaloriesBurnedCalculatorTool })));
const CelsiusToKelvinTool = lazy(() => import("./CelsiusToKelvinTool").then((m) => ({ default: m.CelsiusToKelvinTool })));
const CentimetersToInchesTool = lazy(() => import("./CentimetersToInchesTool").then((m) => ({ default: m.CentimetersToInchesTool })));
const CentimetersToMetersTool = lazy(() => import("./CentimetersToMetersTool").then((m) => ({ default: m.CentimetersToMetersTool })));
const CharacterCounterTool = lazy(() => import("./CharacterCounterTool").then((m) => ({ default: m.CharacterCounterTool })));
const CircleAreaCalculatorTool = lazy(() => import("./CircleAreaCalculatorTool").then((m) => ({ default: m.CircleAreaCalculatorTool })));
const CircleCircumferenceCalculatorTool = lazy(() => import("./CircleCircumferenceCalculatorTool").then((m) => ({ default: m.CircleCircumferenceCalculatorTool })));
const CoffeeRatioCalculatorTool = lazy(() => import("./CoffeeRatioCalculatorTool").then((m) => ({ default: m.CoffeeRatioCalculatorTool })));
const ColorContrastCalculatorTool = lazy(() => import("./ColorContrastCalculatorTool").then((m) => ({ default: m.ColorContrastCalculatorTool })));
const ColorMixerTool = lazy(() => import("./ColorMixerTool").then((m) => ({ default: m.ColorMixerTool })));
const ColorPickerTool = lazy(() => import("./ColorPickerTool").then((m) => ({ default: m.ColorPickerTool })));
const CompressImageTool = lazy(() => import("./CompressImageTool").then((m) => ({ default: m.CompressImageTool })));
const ConsonantCounterTool = lazy(() => import("./ConsonantCounterTool").then((m) => ({ default: m.ConsonantCounterTool })));
const CssGradientGeneratorTool = lazy(() => import("./CssGradientGeneratorTool").then((m) => ({ default: m.CssGradientGeneratorTool })));
const CsvToJsonTool = lazy(() => import("./CsvToJsonTool").then((m) => ({ default: m.CsvToJsonTool })));
const CubeVolumeCalculatorTool = lazy(() => import("./CubeVolumeCalculatorTool").then((m) => ({ default: m.CubeVolumeCalculatorTool })));
const CurrencyConverterTool = lazy(() => import("./CurrencyConverterTool").then((m) => ({ default: m.CurrencyConverterTool })));
const CylinderVolumeCalculatorTool = lazy(() => import("./CylinderVolumeCalculatorTool").then((m) => ({ default: m.CylinderVolumeCalculatorTool })));
const DateDifferenceCalculatorTool = lazy(() => import("./DateDifferenceCalculatorTool").then((m) => ({ default: m.DateDifferenceCalculatorTool })));
const DensityCalculatorTool = lazy(() => import("./DensityCalculatorTool").then((m) => ({ default: m.DensityCalculatorTool })));
const DownloadTimeCalculatorTool = lazy(() => import("./DownloadTimeCalculatorTool").then((m) => ({ default: m.DownloadTimeCalculatorTool })));
const ElectricityCostCalculatorTool = lazy(() => import("./ElectricityCostCalculatorTool").then((m) => ({ default: m.ElectricityCostCalculatorTool })));
const EmailValidatorTool = lazy(() => import("./EmailValidatorTool").then((m) => ({ default: m.EmailValidatorTool })));
const FeeCalculatorTool = lazy(() => import("./FeeCalculatorTool").then((m) => ({ default: m.FeeCalculatorTool })));
const FinalGradeCalculatorTool = lazy(() => import("./FinalGradeCalculatorTool").then((m) => ({ default: m.FinalGradeCalculatorTool })));
const FireCalculatorTool = lazy(() => import("./FireCalculatorTool").then((m) => ({ default: m.FireCalculatorTool })));
const ForceCalculatorTool = lazy(() => import("./ForceCalculatorTool").then((m) => ({ default: m.ForceCalculatorTool })));
const FuelCostCalculatorTool = lazy(() => import("./FuelCostCalculatorTool").then((m) => ({ default: m.FuelCostCalculatorTool })));
const FuelEfficiencyCalculatorTool = lazy(() => import("./FuelEfficiencyCalculatorTool").then((m) => ({ default: m.FuelEfficiencyCalculatorTool })));
const GpaCalculatorTool = lazy(() => import("./GpaCalculatorTool").then((m) => ({ default: m.GpaCalculatorTool })));
const HeartRateZonesCalculatorTool = lazy(() => import("./HeartRateZonesCalculatorTool").then((m) => ({ default: m.HeartRateZonesCalculatorTool })));
const HexColorConverterTool = lazy(() => import("./HexColorConverterTool").then((m) => ({ default: m.HexColorConverterTool })));
const HourlyRateCalculatorTool = lazy(() => import("./HourlyRateCalculatorTool").then((m) => ({ default: m.HourlyRateCalculatorTool })));
const InflationAndPurchasingPowerTool = lazy(() => import("./InflationAndPurchasingPowerTool").then((m) => ({ default: m.InflationAndPurchasingPowerTool })));
const InvestmentBreakEvenTool = lazy(() => import("./InvestmentBreakEvenTool").then((m) => ({ default: m.InvestmentBreakEvenTool })));
const KineticEnergyCalculatorTool = lazy(() => import("./KineticEnergyCalculatorTool").then((m) => ({ default: m.KineticEnergyCalculatorTool })));
const LineSorterTool = lazy(() => import("./LineSorterTool").then((m) => ({ default: m.LineSorterTool })));
const LoanPaymentCalculatorTool = lazy(() => import("./LoanPaymentCalculatorTool").then((m) => ({ default: m.LoanPaymentCalculatorTool })));
const OhmsLawCalculatorTool = lazy(() => import("./OhmsLawCalculatorTool").then((m) => ({ default: m.OhmsLawCalculatorTool })));
const OvenCelsiusToFahrenheitTool = lazy(() => import("./OvenCelsiusToFahrenheitTool").then((m) => ({ default: m.OvenCelsiusToFahrenheitTool })));
const OvenFahrenheitToCelsiusTool = lazy(() => import("./OvenFahrenheitToCelsiusTool").then((m) => ({ default: m.OvenFahrenheitToCelsiusTool })));
const ParagraphCounterTool = lazy(() => import("./ParagraphCounterTool").then((m) => ({ default: m.ParagraphCounterTool })));
const PasswordStrengthTool = lazy(() => import("./PasswordStrengthTool").then((m) => ({ default: m.PasswordStrengthTool })));
const PercentageErrorCalculatorTool = lazy(() => import("./PercentageErrorCalculatorTool").then((m) => ({ default: m.PercentageErrorCalculatorTool })));
const PercentageOfCalculatorTool = lazy(() => import("./PercentageOfCalculatorTool").then((m) => ({ default: m.PercentageOfCalculatorTool })));
const PomodoroTimerTool = lazy(() => import("./PomodoroTimerTool").then((m) => ({ default: m.PomodoroTimerTool })));
const PressureConverterTool = lazy(() => import("./PressureConverterTool").then((m) => ({ default: m.PressureConverterTool })));
const ProfitMarginCalculatorTool = lazy(() => import("./ProfitMarginCalculatorTool").then((m) => ({ default: m.ProfitMarginCalculatorTool })));
const ProportionCalculatorTool = lazy(() => import("./ProportionCalculatorTool").then((m) => ({ default: m.ProportionCalculatorTool })));
const PyramidVolumeCalculatorTool = lazy(() => import("./PyramidVolumeCalculatorTool").then((m) => ({ default: m.PyramidVolumeCalculatorTool })));
const ReadingTimeCalculatorTool = lazy(() => import("./ReadingTimeCalculatorTool").then((m) => ({ default: m.ReadingTimeCalculatorTool })));
const RecipeCostCalculatorTool = lazy(() => import("./RecipeCostCalculatorTool").then((m) => ({ default: m.RecipeCostCalculatorTool })));
const RecipeScalerTool = lazy(() => import("./RecipeScalerTool").then((m) => ({ default: m.RecipeScalerTool })));
const RectangleAreaCalculatorTool = lazy(() => import("./RectangleAreaCalculatorTool").then((m) => ({ default: m.RectangleAreaCalculatorTool })));
const RectanglePerimeterCalculatorTool = lazy(() => import("./RectanglePerimeterCalculatorTool").then((m) => ({ default: m.RectanglePerimeterCalculatorTool })));
const RectangularPrismVolumeCalculatorTool = lazy(() => import("./RectangularPrismVolumeCalculatorTool").then((m) => ({ default: m.RectangularPrismVolumeCalculatorTool })));
const RhombusAreaCalculatorTool = lazy(() => import("./RhombusAreaCalculatorTool").then((m) => ({ default: m.RhombusAreaCalculatorTool })));
const RoomAreaCalculatorTool = lazy(() => import("./RoomAreaCalculatorTool").then((m) => ({ default: m.RoomAreaCalculatorTool })));
const RuleOf72CalculatorTool = lazy(() => import("./RuleOf72CalculatorTool").then((m) => ({ default: m.RuleOf72CalculatorTool })));
const SavingsGoalCalculatorTool = lazy(() => import("./SavingsGoalCalculatorTool").then((m) => ({ default: m.SavingsGoalCalculatorTool })));
const SentenceCounterTool = lazy(() => import("./SentenceCounterTool").then((m) => ({ default: m.SentenceCounterTool })));
const SimpleInterestCalculatorTool = lazy(() => import("./SimpleInterestCalculatorTool").then((m) => ({ default: m.SimpleInterestCalculatorTool })));
const SlugGeneratorTool = lazy(() => import("./SlugGeneratorTool").then((m) => ({ default: m.SlugGeneratorTool })));
const SphereVolumeCalculatorTool = lazy(() => import("./SphereVolumeCalculatorTool").then((m) => ({ default: m.SphereVolumeCalculatorTool })));
const SquareAreaCalculatorTool = lazy(() => import("./SquareAreaCalculatorTool").then((m) => ({ default: m.SquareAreaCalculatorTool })));
const SyllableCounterTool = lazy(() => import("./SyllableCounterTool").then((m) => ({ default: m.SyllableCounterTool })));
const TemperatureConverterTool = lazy(() => import("./TemperatureConverterTool").then((m) => ({ default: m.TemperatureConverterTool })));
const TextNormalizerTool = lazy(() => import("./TextNormalizerTool").then((m) => ({ default: m.TextNormalizerTool })));
const TileCalculatorTool = lazy(() => import("./TileCalculatorTool").then((m) => ({ default: m.TileCalculatorTool })));
const TimezoneConverterTool = lazy(() => import("./TimezoneConverterTool").then((m) => ({ default: m.TimezoneConverterTool })));
const TipTaxCalculatorTool = lazy(() => import("./TipTaxCalculatorTool").then((m) => ({ default: m.TipTaxCalculatorTool })));
const TrapezoidAreaCalculatorTool = lazy(() => import("./TrapezoidAreaCalculatorTool").then((m) => ({ default: m.TrapezoidAreaCalculatorTool })));
const TriangleAreaCalculatorTool = lazy(() => import("./TriangleAreaCalculatorTool").then((m) => ({ default: m.TriangleAreaCalculatorTool })));
const TripTimeCalculatorTool = lazy(() => import("./TripTimeCalculatorTool").then((m) => ({ default: m.TripTimeCalculatorTool })));
const UnitPriceCalculatorTool = lazy(() => import("./UnitPriceCalculatorTool").then((m) => ({ default: m.UnitPriceCalculatorTool })));
const UuidGeneratorTool = lazy(() => import("./UuidGeneratorTool").then((m) => ({ default: m.UuidGeneratorTool })));
const VowelCounterTool = lazy(() => import("./VowelCounterTool").then((m) => ({ default: m.VowelCounterTool })));
const WaterIntakeCalculatorTool = lazy(() => import("./WaterIntakeCalculatorTool").then((m) => ({ default: m.WaterIntakeCalculatorTool })));
const WcagContrastTool = lazy(() => import("./WcagContrastTool").then((m) => ({ default: m.WcagContrastTool })));
const WeightedAverageCalculatorTool = lazy(() => import("./WeightedAverageCalculatorTool").then((m) => ({ default: m.WeightedAverageCalculatorTool })));
const WordCounterTool = lazy(() => import("./WordCounterTool").then((m) => ({ default: m.WordCounterTool })));
const WordFrequencyCounterTool = lazy(() => import("./WordFrequencyCounterTool").then((m) => ({ default: m.WordFrequencyCounterTool })));
const XmlToJsonTool = lazy(() => import("./XmlToJsonTool").then((m) => ({ default: m.XmlToJsonTool })));

const TOOL_BY_SLUG = new Map(GENERAL_TOOLS.map((t) => [t.slug, t] as const));

function buildLazyRegistry(locale: "en" | "es") {
  const cache = new Map<
    string,
    ComponentType<{ tool: GeneralTool; locale?: "en" | "es" }>
  >();

  return new Proxy({} as Record<string, ComponentType<{ tool: GeneralTool; locale?: "en" | "es" }>>, {
    get(_target, prop) {
      if (typeof prop !== "string") return undefined;
      if (cache.has(prop)) return cache.get(prop);

      const tool = TOOL_BY_SLUG.get(prop);
      if (!tool) return undefined;

      // Map of known individual components
      const special: Record<string, ComponentType<any>> = {
        "absolute-error": AbsoluteErrorCalculatorTool,
        "absolute-temperature": AbsoluteTemperatureConverterTool,
        "absolute-value": AbsoluteValueCalculatorTool,
        "acceleration": AccelerationCalculatorTool,
        "add-days-to-date": AddDaysToDateTool,
        "advanced-hex-to-hsl": AdvancedHexToHslTool,
        "advanced-markdown-to-html": AdvancedMarkdownToHtmlTool,
        "amount-per-person": AmountPerPersonTool,
        "area-converter": AreaConverterTool,
        "arithmetic-mean-calculator": ArithmeticMeanCalculatorTool,
        "aspect-ratio": AspectRatioCalculatorTool,
        "average": AverageCalculatorTool,
        "average-of-two-values": AverageOfTwoValuesTool,
        "average-purchase-price": AveragePurchasePriceTool,
        "average-speed": AverageSpeedCalculatorTool,
        "baking-time-adjustment": BakingTimeAdjustmentTool,
        "base64-encode": Base64EncodeTool,
        "batch-file-names": BatchFileNamesTool,
        "bill-split": BillSplitCalculatorTool,
        "binary-to-decimal": BinaryToDecimalTool,
        "body-fat": BodyFatCalculatorTool,
        "border-radius-generator": BorderRadiusGeneratorTool,
        "box-shadow-generator": BoxShadowGeneratorTool,
        "bread-hydration": BreadHydrationTool,
        "budget-50-30-20": Budget503020Tool,
        "business-days": BusinessDaysCalculatorTool,
        "calorie-deficit": CalorieDeficitCalculatorTool,
        "calories-burned": CaloriesBurnedCalculatorTool,
        "celsius-to-kelvin": CelsiusToKelvinTool,
        "centimeters-to-inches": CentimetersToInchesTool,
        "centimeters-to-meters": CentimetersToMetersTool,
        "character-counter": CharacterCounterTool,
        "circle-area": CircleAreaCalculatorTool,
        "circle-circumference": CircleCircumferenceCalculatorTool,
        "coffee-ratio": CoffeeRatioCalculatorTool,
        "color-contrast-calculator": ColorContrastCalculatorTool,
        "color-mixer": ColorMixerTool,
        "color-picker": ColorPickerTool,
        "compress-image": CompressImageTool,
        "consonant-counter": ConsonantCounterTool,
        "css-gradient-generator": CssGradientGeneratorTool,
        "csv-to-json": CsvToJsonTool,
        "cube-volume": CubeVolumeCalculatorTool,
        "currency-converter": CurrencyConverterTool,
        "cylinder-volume": CylinderVolumeCalculatorTool,
        "date-difference": DateDifferenceCalculatorTool,
        "density": DensityCalculatorTool,
        "download-time": DownloadTimeCalculatorTool,
        "electricity-cost": ElectricityCostCalculatorTool,
        "email-validator": EmailValidatorTool,
        "fee-calculator": FeeCalculatorTool,
        "final-grade": FinalGradeCalculatorTool,
        "fire-calculator": FireCalculatorTool,
        "force": ForceCalculatorTool,
        "fuel-cost": FuelCostCalculatorTool,
        "fuel-efficiency": FuelEfficiencyCalculatorTool,
        "gpa-calculator": GpaCalculatorTool,
        "heart-rate-zones": HeartRateZonesCalculatorTool,
        "hex-color-converter": HexColorConverterTool,
        "hourly-rate": HourlyRateCalculatorTool,
        "inflation-and-purchasing-power": InflationAndPurchasingPowerTool,
        "investment-break-even": InvestmentBreakEvenTool,
        "kinetic-energy": KineticEnergyCalculatorTool,
        "line-sorter": LineSorterTool,
        "loan-payment": LoanPaymentCalculatorTool,
        "ohms-law": OhmsLawCalculatorTool,
        "oven-celsius-to-fahrenheit": OvenCelsiusToFahrenheitTool,
        "oven-fahrenheit-to-celsius": OvenFahrenheitToCelsiusTool,
        "paragraph-counter": ParagraphCounterTool,
        "password-strength": PasswordStrengthTool,
        "percentage-error": PercentageErrorCalculatorTool,
        "percentage-of": PercentageOfCalculatorTool,
        "pomodoro-timer": PomodoroTimerTool,
        "pressure-converter": PressureConverterTool,
        "profit-margin": ProfitMarginCalculatorTool,
        "proportion-calculator": ProportionCalculatorTool,
        "pyramid-volume": PyramidVolumeCalculatorTool,
        "reading-time": ReadingTimeCalculatorTool,
        "recipe-cost": RecipeCostCalculatorTool,
        "recipe-scaler": RecipeScalerTool,
        "rectangle-area": RectangleAreaCalculatorTool,
        "rectangle-perimeter": RectanglePerimeterCalculatorTool,
        "rectangular-prism-volume": RectangularPrismVolumeCalculatorTool,
        "rhombus-area": RhombusAreaCalculatorTool,
        "room-area": RoomAreaCalculatorTool,
        "rule-of-72": RuleOf72CalculatorTool,
        "savings-goal": SavingsGoalCalculatorTool,
        "sentence-counter": SentenceCounterTool,
        "simple-interest": SimpleInterestCalculatorTool,
        "slug-generator": SlugGeneratorTool,
        "sphere-volume": SphereVolumeCalculatorTool,
        "square-area": SquareAreaCalculatorTool,
        "syllable-counter": SyllableCounterTool,
        "temperature-converter": TemperatureConverterTool,
        "text-normalizer": TextNormalizerTool,
        "tile": TileCalculatorTool,
        "timezone": TimezoneConverterTool,
        "tip-tax": TipTaxCalculatorTool,
        "trapezoid-area": TrapezoidAreaCalculatorTool,
        "triangle-area": TriangleAreaCalculatorTool,
        "trip-time": TripTimeCalculatorTool,
        "unit-price": UnitPriceCalculatorTool,
        "uuid-generator": UuidGeneratorTool,
        "vowel-counter": VowelCounterTool,
        "water-intake": WaterIntakeCalculatorTool,
        "wcag-contrast": WcagContrastTool,
        "weighted-average": WeightedAverageCalculatorTool,
        "word-counter": WordCounterTool,
        "word-frequency": WordFrequencyCounterTool,
        "xml-to-json": XmlToJsonTool,
      };

      const Comp = special[prop] ?? GeneralToolUi;

      const render = (props: { tool: GeneralTool; locale?: "en" | "es" }) => (
        <Comp {...props} locale={locale} />
      );
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
