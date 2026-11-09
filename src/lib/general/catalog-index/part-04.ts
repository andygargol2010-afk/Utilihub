// GENERAL_TOOLS part 04 — split out of ../index.ts on 2026-10-28 (same order; index.ts spreads parts in order).
// Add new entries in the smallest file of this folder; never rewrite files wholesale.
import { ATTENDANCE_PERCENTAGE_CALCULATOR_TOOLS } from "../attendance-percentage-calculator-tool";
import { COST_PER_KM_CALCULATOR_TOOLS } from "../cost-per-km-calculator-tool";
import { DENSITY_CALCULATOR_TOOLS } from "../density-calculator-tool";
import { PERCENTAGE_ERROR_CALCULATOR_TOOLS } from "../percentage-error-calculator-tool";
import { ASPECT_RATIO_TOOLS } from "../aspect-ratio-tool";
import { DAYS_BETWEEN_DATES_CALCULATOR_TOOLS } from "../days-between-dates-calculator-tool";
import { TANK_VOLUME_CALCULATOR_TOOLS } from "../tank-volume-calculator-tool";
import { PIZZA_PORTIONS_CALCULATOR_TOOLS } from "../pizza-portions-calculator-tool";
import { FINANCE_TOOLS } from "../finance";
import { SEO_GROWTH_TOOLS } from "../seo-growth";
import { GAP_TOOLS } from "../gap-tools";
import { PERCENT_ADVANCED_TOOLS } from "../percent-advanced";
import { ALGEBRA_ADVANCED_TOOLS } from "../algebra-advanced";
import { GEOMETRY_SUITE_TOOLS } from "../geometry-suite";
import { ARITHMETIC_SUITE_TOOLS } from "../arithmetic-suite";
import { SEQUENCE_SUITE_TOOLS } from "../sequence-suite";
import { TRIG_SUITE_TOOLS } from "../trig-suite";
import { EXPLOG_SUITE_TOOLS } from "../explog-suite";
import { MATRIX_BINARY_SUITE_TOOLS } from "../matrix-binary-suite";
import { OVERTIME_PAY_TOOLS } from "../overtime-pay";
import { UTM_BUILDER_TOOLS } from "../utm-builder";
import { VAT_EXTRACTOR_TOOLS } from "../vat-extractor";
import { AC_SIZE_TOOLS } from "../ac-size";
import { CONCRETE_CALCULATOR_TOOLS } from "../concrete-calculator";
import { WALLPAPER_CALCULATOR_TOOLS } from "../wallpaper-calculator";
import { DRYWALL_CALCULATOR_TOOLS } from "../drywall-calculator";
import { MEETING_COST_TOOLS } from "../meeting-cost";
import { FENCE_CALCULATOR_TOOLS } from "../fence-calculator";
import { STAIR_CALCULATOR_TOOLS } from "../stair-calculator";
import { GRAVEL_CALCULATOR_TOOLS } from "../gravel-calculator";
import { FLOORING_CALCULATOR_TOOLS } from "../flooring-calculator";
import { AIRFRYER_CALCULATOR_TOOLS } from "../airfryer-calculator";
import { BAKERS_PERCENTAGE_TOOLS } from "../bakers-percentage";
import { DECK_CALCULATOR_TOOLS } from "../deck-calculator";
import { ROOF_CALCULATOR_TOOLS } from "../roof-calculator";
import { POOL_CALCULATOR_TOOLS } from "../pool-calculator";
import { PAVER_CALCULATOR_TOOLS } from "../paver-calculator";
import { SOD_CALCULATOR_TOOLS } from "../sod-calculator";
import { GUTTER_CALCULATOR_TOOLS } from "../gutter-calculator";
import { INSULATION_CALCULATOR_TOOLS } from "../insulation-calculator";
import { BRICK_CALCULATOR_TOOLS } from "../brick-calculator";

export const GENERAL_TOOLS_PART_04 = [
  ...ATTENDANCE_PERCENTAGE_CALCULATOR_TOOLS,
  ...COST_PER_KM_CALCULATOR_TOOLS,
  ...DENSITY_CALCULATOR_TOOLS,
  ...PERCENTAGE_ERROR_CALCULATOR_TOOLS,
  ...ASPECT_RATIO_TOOLS,
  ...DAYS_BETWEEN_DATES_CALCULATOR_TOOLS,
  ...TANK_VOLUME_CALCULATOR_TOOLS,
  ...PIZZA_PORTIONS_CALCULATOR_TOOLS,
  // Re-wired after b300eb06 (old relative order). Current tools above keep their EN paths on collisions.
  // csv-a-json: no generic UI computes it; conversor-csv-json (CSV_TO_JSON_TOOLS) covers the intent.
  // Not re-wired: SAVINGS_GOAL_TOOLS, RULE_OF_72_TOOLS, PROFIT_MARGIN_CALCULATOR_TOOLS (category finanzas;
  // /finance and /es/finanzas routes only serve FINANCIAL_TOOLS, so their pages would 404).
  ...FINANCE_TOOLS,
  ...SEO_GROWTH_TOOLS,
  ...GAP_TOOLS.filter((tool) => tool.slug !== "csv-a-json"),
  ...PERCENT_ADVANCED_TOOLS,
  ...ALGEBRA_ADVANCED_TOOLS,
  ...GEOMETRY_SUITE_TOOLS,
  ...ARITHMETIC_SUITE_TOOLS,
  ...SEQUENCE_SUITE_TOOLS,
  ...TRIG_SUITE_TOOLS,
  ...EXPLOG_SUITE_TOOLS,
  ...MATRIX_BINARY_SUITE_TOOLS,
  ...OVERTIME_PAY_TOOLS,
  ...UTM_BUILDER_TOOLS,
  ...VAT_EXTRACTOR_TOOLS,
  ...AC_SIZE_TOOLS,
  ...CONCRETE_CALCULATOR_TOOLS,
  ...WALLPAPER_CALCULATOR_TOOLS,
  ...DRYWALL_CALCULATOR_TOOLS,
  ...MEETING_COST_TOOLS,
  ...FENCE_CALCULATOR_TOOLS,
  ...STAIR_CALCULATOR_TOOLS,
  ...GRAVEL_CALCULATOR_TOOLS,
  ...FLOORING_CALCULATOR_TOOLS,
  ...AIRFRYER_CALCULATOR_TOOLS,
  ...BAKERS_PERCENTAGE_TOOLS,
  ...DECK_CALCULATOR_TOOLS,
  ...ROOF_CALCULATOR_TOOLS,
  ...POOL_CALCULATOR_TOOLS,
  ...PAVER_CALCULATOR_TOOLS,
  ...SOD_CALCULATOR_TOOLS,
  ...GUTTER_CALCULATOR_TOOLS,
  ...INSULATION_CALCULATOR_TOOLS,
  ...BRICK_CALCULATOR_TOOLS,
];
