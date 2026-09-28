import type { GeneralTool } from "./types";

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
  config: { mode: "explog-suite" },
});

export const EXPLOG_SUITE_TOOLS: GeneralTool[] = [
  base(
    "cambio-de-base",
    "Change of base logarithm calculator",
    "Convert log_b(x) using log_k(x)/log_k(b) for any positive bases.",
    [
      "Change of base: log_b(x) = log_k(x) / log_k(b) for any valid k (commonly k=10 or k=e).",
      "The tool evaluates log_b(x) via natural logs under the hood.",
      "Requires x > 0, b > 0, b ≠ 1.",
    ],
    [
      "Enter argument x and base b.",
      "Calculate log_b(x).",
      "Optionally compare with ln(x)/ln(b).",
    ],
    [
      { q: "Base e or 10?", a: "Any valid base works; the identity holds for all." },
      { q: "x between 0 and 1?", a: "Allowed — the log will be negative if base > 1." },
    ],
    ["change of base", "logarithm calculator", "cambio de base"],
  ),
  base(
    "logaritmo-natural",
    "Natural log & eˣ calculator",
    "Compute ln(x) and exp(x) = eˣ with a dedicated simple interface.",
    [
      "Natural logarithm ln is log base e; exp is its inverse.",
      "ln(x) needs x > 0; exp(x) is defined for all real x.",
      "Dedicated entry for the two most common transcendental ops.",
    ],
    [
      "Choose ln or exp mode.",
      "Enter x.",
      "Read the result.",
    ],
    [
      { q: "What is e?", a: "≈ 2.71828… the base of natural logarithms." },
      { q: "ln of a negative?", a: "Not real — domain is x > 0." },
    ],
    ["natural log", "ln calculator", "e^x", "logaritmo natural"],
  ),
  base(
    "crecimiento-exponencial",
    "Exponential growth & decay calculator",
    "Evaluate A = A₀ e^{kt} for growth (k>0) or decay (k<0).",
    [
      "Continuous growth/decay model: A(t) = A₀ e^{kt}.",
      "Positive k means growth; negative k means decay.",
      "Standard in radioactive decay, interest continuous compounding, and population models.",
    ],
    [
      "Enter initial A₀, rate k, and time t.",
      "Calculate A(t).",
      "Interpret the sign of k in your context.",
    ],
    [
      { q: "Discrete compound interest?", a: "Use A₀(1+r)^t instead; this tool is the continuous model." },
      { q: "Half-life?", a: "For decay, k = −ln(2)/half-life." },
    ],
    ["exponential growth", "exponential decay", "crecimiento exponencial"],
  ),
];
