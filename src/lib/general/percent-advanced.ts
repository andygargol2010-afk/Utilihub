import type { GeneralTool } from "./types";

/** Purpose-built percentage calculators — unique copy, no makeTool generics. */
const base = (
  slug: string,
  name: string,
  summary: string,
  about: string[],
  steps: string[],
  faq: { q: string; a: string }[],
  keywords: string[],
): GeneralTool => ({
  slug,
  name,
  title: `${name} free online | UtiliHub`,
  description: summary,
  summary,
  category: "matematicas",
  kind: "number",
  keywords,
  about,
  steps,
  faq,
  config: { mode: "percent-advanced" },
});

export const PERCENT_ADVANCED_TOOLS: GeneralTool[] = [
  base(
    "porcentaje-aumento",
    "Percentage increase calculator",
    "Find how much a value rose as a percent of the original, and optionally the absolute increase.",
    [
      "Percentage increase answers: if something went from A to B, by what percent of A did it grow?",
      "The formula is ((new − old) ÷ old) × 100. A rise from 80 to 100 is a 25% increase, not 20%.",
      "Use this when tracking prices, metrics, scores, or any quantity that went up over time.",
    ],
    [
      "Enter the starting (old) value and the ending (new) value.",
      "Read the percent increase and the absolute difference.",
      "If the result is negative, the quantity actually decreased — switch to the decrease tool for a positive label.",
    ],
    [
      { q: "Is percentage increase the same as percentage points?", a: "No. Going from 10% to 15% is a 5 percentage-point rise, but a 50% relative increase." },
      { q: "What if the old value is zero?", a: "Relative increase is undefined when the baseline is zero. Use an absolute difference instead." },
    ],
    ["percentage increase", "percent increase calculator", "aumento porcentual"],
  ),
  base(
    "porcentaje-disminucion",
    "Percentage decrease calculator",
    "Measure how much a value fell relative to its starting amount.",
    [
      "Percentage decrease is ((old − new) ÷ old) × 100 when new is lower than old.",
      "A drop from 200 to 150 is a 25% decrease. Retail discounts are often stated this way.",
      "If new is higher than old, the signed result will be negative — that means growth, not a cut.",
    ],
    [
      "Enter the original value and the lower value after the change.",
      "Review the percent decrease and how many units were lost.",
      "Compare with percentage increase when you need the mirror framing.",
    ],
    [
      { q: "How is this different from a discount calculator?", a: "Discount tools usually start from price and a % off. This tool starts from two observed values and recovers the % drop." },
      { q: "Can I use it for weight loss?", a: "Yes: old weight and new weight give the relative reduction percentage." },
    ],
    ["percentage decrease", "percent decrease", "disminución porcentual"],
  ),
  base(
    "diferencia-porcentual",
    "Percentage difference calculator",
    "Compare two values with the symmetric percentage difference relative to their average.",
    [
      "Percentage difference uses |A − B| ÷ ((A + B) / 2) × 100. Neither value is treated as the exclusive baseline.",
      "It is useful when both measurements are peers (two lab results, two quotes, two sensors).",
      "It is not the same as percentage change, which always divides by a chosen starting value.",
    ],
    [
      "Enter value A and value B in either order.",
      "Read the percentage difference and the absolute gap.",
      "Use percentage change instead if one value is clearly the baseline.",
    ],
    [
      { q: "Why divide by the average?", a: "Using the midpoint treats A and B symmetrically so swapping them does not change the result." },
      { q: "What if one value is zero?", a: "The formula still works if the other is non-zero; both zero is undefined." },
    ],
    ["percentage difference", "percent difference calculator", "diferencia porcentual"],
  ),
  base(
    "porcentaje-de-porcentaje",
    "Percent of a percent calculator",
    "Multiply two percentages to find what share of a share you get.",
    [
      "“30% of 40%” is not 70% — it is 0.30 × 0.40 = 0.12, or 12%.",
      "Common in tax-on-tax edge cases, commission stacks, and multi-step probability-style shares.",
      "The tool multiplies the two rates and returns the combined percentage of the original whole.",
    ],
    [
      "Enter the first percentage and the second percentage.",
      "Read the combined percent of the whole.",
      "Optionally scale by a base amount if you also need the absolute quantity.",
    ],
    [
      { q: "Is this compound interest?", a: "No. Compound interest grows a principal over periods. This only multiplies two static percentage rates." },
      { q: "Order of the two percents?", a: "Multiplication is commutative — order does not matter for the product of rates." },
    ],
    ["percent of a percent", "percentage of percentage", "porcentaje de un porcentaje"],
  ),
  base(
    "porcentaje-hasta-meta",
    "Percent to goal calculator",
    "See how far you are toward a target and what remains in percent and units.",
    [
      "Progress toward a goal is (current ÷ goal) × 100, capped in interpretation when you overshoot.",
      "The remaining percentage is max(0, 100 − progress%) when you have not yet reached the target.",
      "Useful for fundraising, sales quotas, savings targets, and XP-style progress bars.",
    ],
    [
      "Enter the current amount and the goal amount.",
      "Read progress %, remaining %, and units still needed.",
      "If current exceeds goal, the tool reports completion over 100%.",
    ],
    [
      { q: "What if the goal is zero?", a: "A zero goal is invalid for relative progress. Set a positive target." },
      { q: "Does it handle negative current values?", a: "Negative progress is allowed mathematically but unusual for most goals — check your inputs." },
    ],
    ["percent to goal", "progress percentage", "porcentaje de meta"],
  ),
  base(
    "fraccion-a-porcentaje",
    "Fraction to percent calculator",
    "Convert a fraction (numerator over denominator) into a percentage.",
    [
      "Any fraction a/b equals (a ÷ b) × 100 percent. 3/4 becomes 75%.",
      "The same idea converts ratios and parts of a whole into a familiar percent scale.",
      "Decimal input is accepted in either field if you already have non-integer parts.",
    ],
    [
      "Enter the numerator and the denominator.",
      "Read the equivalent percentage.",
      "Simplify the fraction separately if you also need lowest terms.",
    ],
    [
      { q: "What about improper fractions?", a: "They work: 5/4 becomes 125%." },
      { q: "Denominator zero?", a: "Division by zero is rejected — a fraction needs a non-zero denominator." },
    ],
    ["fraction to percent", "fraction to percentage", "fracción a porcentaje"],
  ),
  base(
    "tiempo-duplicacion",
    "Doubling time calculator",
    "Estimate how long a quantity takes to double at a constant growth rate.",
    [
      "With continuous-style constant percent growth per period, doubling time is ln(2) ÷ ln(1 + r/100).",
      "At 7% per period, doubling takes roughly 10 periods (rule of 72 ≈ 72/7).",
      "Assumes the rate stays constant — real markets and populations vary.",
    ],
    [
      "Enter the growth rate as a percent per period (year, month, etc.).",
      "Read the number of periods needed to double.",
      "Match the period unit to how you measured the rate.",
    ],
    [
      { q: "Is this the rule of 72?", a: "The rule of 72 is a quick approximation. This calculator uses the exact logarithmic formula." },
      { q: "Negative growth?", a: "Negative rates mean decay; doubling time is not defined for permanent decline." },
    ],
    ["doubling time", "rule of 72", "tiempo de duplicación"],
  ),
  base(
    "markup-vs-margen",
    "Markup vs margin converter",
    "Convert between markup on cost and margin on selling price — they are not the same percent.",
    [
      "Markup is (price − cost) ÷ cost. Margin is (price − cost) ÷ price. A 50% markup is a 33.3% margin.",
      "Confusing the two leads to underpricing. Retailers usually quote margin; suppliers often quote markup.",
      "This tool converts either direction so both teams speak the same number.",
    ],
    [
      "Choose whether you know markup % or margin %.",
      "Enter that percentage.",
      "Read the equivalent figure on the other definition.",
    ],
    [
      { q: "Which should I use for pricing?", a: "Finance statements usually care about margin on revenue. Buying decisions often start from markup on cost." },
      { q: "Can margin be 100%?", a: "Only if cost is zero. As margin approaches 100%, markup grows without bound." },
    ],
    ["markup vs margin", "markup to margin", "margen vs markup"],
  ),
];
