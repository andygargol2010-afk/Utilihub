import { lazy, type ComponentType, type ReactNode } from "react";
import { GENERAL_TOOLS } from "@/lib/general";
import type { GeneralTool } from "@/lib/general/types";

/** Full general tool UI registry — restore 2026-10-13 anti-wipe + email validator + ohms law + password strength + hex color converter + aspect ratio + csv to json + xml to json + base64 + gpa + pomodoro + box shadow + download time + unit price + body fat + kinetic energy + timezone + percentage of + slug generator + bill split + currency converter + water intake + recipe cost + electricity cost + word counter + loan payment + average speed + acceleration + fuel efficiency + heart rate zones + savings goal + hourly rate + line sorter + business days + text normalizer + budget 503020 + uuid generator + date difference + recipe scaler + rule of 72 + room area + final grade + temperature converter + proportion calculator + css gradient generator + character counter + calorie deficit + trip time + force + bac + tip tax + sphere volume + sentence counter + cylinder volume + paragraph counter + density + word frequency + circle area + vowel counter + rectangle area + consonant counter + profit margin + weighted average + circle circumference + rectangle perimeter + pressure converter + calories burned + pyramid volume + trapezoid area + parallelogram area + rectangular prism volume + cube volume + syllable counter + triangle area + simple interest + tile + square area + fuel cost + reading time + coffee ratio + rhombus area. */
const TOOL_BY_SLUG = new Map(
  GENERAL_TOOLS.map((t) => [t.slug, t] as const)
);

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

      // Map slug → component file. Most follow PascalCase of the slug.
      // Special cases that differ from simple slug-to-Pascal are listed explicitly.
      const special: Record<string, string> = {
        "absolute-error": "AbsoluteErrorCalculator",
        "absolute-temperature": "AbsoluteTemperatureConverter",
        "absolute-value": "AbsoluteValueCalculator",
        "acceleration": "AccelerationCalculator",
        "add-days-to-date": "AddDaysToDate",
        "advanced-hex-to-hsl": "AdvancedHexToHsl",
        "advanced-markdown-to-html": "AdvancedMarkdownToHtml",
        "amount-per-person": "AmountPerPerson",
        "area-converter": "AreaConverter",
        "arithmetic-mean-calculator": "ArithmeticMeanCalculator",
        "aspect-ratio": "AspectRatioCalculator",
        "average": "AverageCalculator",
        "average-of-two-values": "AverageOfTwoValues",
        "average-purchase-price": "AveragePurchasePrice",
        "average-speed": "AverageSpeedCalculator",
        "baking-time-adjustment": "BakingTimeAdjustment",
        "base64-encode": "Base64Encode",
        "batch-file-names": "BatchFileNames",
        "bill-split": "BillSplitCalculator",
        "binary-to-decimal": "BinaryToDecimal",
        "body-fat": "BodyFatCalculator",
        "border-radius-generator": "BorderRadiusGenerator",
        "box-shadow-generator": "BoxShadowGenerator",
        "bread-hydration": "BreadHydration",
        "budget-50-30-20": "Budget503020",
        "business-days": "BusinessDaysCalculator",
        "calorie-deficit": "CalorieDeficitCalculator",
        "calories-burned": "CaloriesBurnedCalculator",
        "celsius-to-kelvin": "CelsiusToKelvin",
        "centimeters-to-inches": "CentimetersToInches",
        "centimeters-to-meters": "CentimetersToMeters",
        "character-counter": "CharacterCounter",
        "circle-area": "CircleAreaCalculator",
        "circle-circumference": "CircleCircumferenceCalculator",
        "coffee-ratio": "CoffeeRatioCalculator",
        "color-contrast-calculator": "ColorContrastCalculator",
        "color-mixer": "ColorMixer",
        "color-picker": "ColorPicker",
        "compress-image": "CompressImage",
        "consonant-counter": "ConsonantCounter",
        "css-gradient-generator": "CssGradientGenerator",
        "csv-to-json": "CsvToJson",
        "cube-volume": "CubeVolumeCalculator",
        "currency-converter": "CurrencyConverter",
        "cylinder-volume": "CylinderVolumeCalculator",
        "date-difference": "DateDifferenceCalculator",
        "density": "DensityCalculator",
        "download-time": "DownloadTimeCalculator",
        "electricity-cost": "ElectricityCostCalculator",
        "email-validator": "EmailValidator",
        "fee-calculator": "FeeCalculator",
        "final-grade": "FinalGradeCalculator",
        "fire-calculator": "FireCalculator",
        "force": "ForceCalculator",
        "fuel-cost": "FuelCostCalculator",
        "fuel-efficiency": "FuelEfficiencyCalculator",
        "gpa-calculator": "GpaCalculator",
        "heart-rate-zones": "HeartRateZonesCalculator",
        "hex-color-converter": "HexColorConverter",
        "hourly-rate": "HourlyRateCalculator",
        "inflation-and-purchasing-power": "InflationAndPurchasingPower",
        "investment-break-even": "InvestmentBreakEven",
        "kinetic-energy": "KineticEnergyCalculator",
        "line-sorter": "LineSorter",
        "loan-payment": "LoanPaymentCalculator",
        "ohms-law": "OhmsLawCalculator",
        "oven-celsius-to-fahrenheit": "OvenCelsiusToFahrenheit",
        "oven-fahrenheit-to-celsius": "OvenFahrenheitToCelsius",
        "paragraph-counter": "ParagraphCounter",
        "password-strength": "PasswordStrength",
        "percentage-error": "PercentageErrorCalculator",
        "percentage-of": "PercentageOfCalculator",
        "pomodoro-timer": "PomodoroTimer",
        "pressure-converter": "PressureConverter",
        "profit-margin": "ProfitMarginCalculator",
        "proportion-calculator": "ProportionCalculator",
        "pyramid-volume": "PyramidVolumeCalculator",
        "reading-time": "ReadingTimeCalculator",
        "recipe-cost": "RecipeCostCalculator",
        "recipe-scaler": "RecipeScaler",
        "rectangle-area": "RectangleAreaCalculator",
        "rectangle-perimeter": "RectanglePerimeterCalculator",
        "rectangular-prism-volume": "RectangularPrismVolumeCalculator",
        "rhombus-area": "RhombusAreaCalculator",
        "room-area": "RoomAreaCalculator",
        "rule-of-72": "RuleOf72Calculator",
        "savings-goal": "SavingsGoalCalculator",
        "sentence-counter": "SentenceCounter",
        "simple-interest": "SimpleInterestCalculator",
        "slug-generator": "SlugGenerator",
        "sphere-volume": "SphereVolumeCalculator",
        "square-area": "SquareAreaCalculator",
        "syllable-counter": "SyllableCounter",
        "temperature-converter": "TemperatureConverter",
        "text-normalizer": "TextNormalizer",
        "tile": "TileCalculator",
        "timezone": "TimezoneConverter",
        "tip-tax": "TipTaxCalculator",
        "trapezoid-area": "TrapezoidAreaCalculator",
        "triangle-area": "TriangleAreaCalculator",
        "trip-time": "TripTimeCalculator",
        "unit-price": "UnitPriceCalculator",
        "uuid-generator": "UuidGenerator",
        "vowel-counter": "VowelCounter",
        "water-intake": "WaterIntakeCalculator",
        "wcag-contrast": "WcagContrast",
        "weighted-average": "WeightedAverageCalculator",
        "word-counter": "WordCounter",
        "word-frequency": "WordFrequencyCounter",
        "xml-to-json": "XmlToJson",
        // PixeliHub and advanced tools live elsewhere or use DeferredToolUi
      };

      const componentName =
        special[prop] ??
        prop
          .split("-")
          .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
          .join("");

      const LazyComp = lazy(() =>
        import(`./${componentName}`).catch(() =>
          import("./ToolFallback").then((m) => ({
            default: m.default ?? (() => null),
          }))
        )
      );

      const render = (props: { tool: GeneralTool; locale?: "en" | "es" }) => (
        <LazyComp {...props} locale={locale} />
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
