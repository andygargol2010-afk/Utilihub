import { TOOL_SEO_OVERRIDES_RANK6_1 } from "./tool-seo-data/rank6-1";
import { TOOL_SEO_OVERRIDES_RANK6_2 } from "./tool-seo-data/rank6-2";
import { TOOL_SEO_OVERRIDES_RANK6_3 } from "./tool-seo-data/rank6-3";
import type { ToolSeoOverride } from "./tool-seo-overrides";

/**
 * SEO rank pass #2: another 5 high-intent tools.
 * Spread after RANK5 so these win on their slugs.
 */
// Entries live in ./tool-seo-data/rank6-N.ts (split 2026-10-28). Add new entries in the smallest file of that folder.
export const TOOL_SEO_OVERRIDES_RANK6: Record<string, ToolSeoOverride> = {
  ...TOOL_SEO_OVERRIDES_RANK6_1,
  ...TOOL_SEO_OVERRIDES_RANK6_2,
  ...TOOL_SEO_OVERRIDES_RANK6_3,
};

// Live catalog slug for the BMI tool (/tools/bmi-calculator, /es/herramientas/calculadora-imc).
TOOL_SEO_OVERRIDES_RANK6["calculadora-imc"] = TOOL_SEO_OVERRIDES_RANK6.imc;
