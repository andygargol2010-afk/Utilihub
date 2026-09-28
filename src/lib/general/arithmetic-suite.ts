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
  config: { mode: "arithmetic-suite" },
});

export const ARITHMETIC_SUITE_TOOLS: GeneralTool[] = [
  base(
    "factorizacion-prima",
    "Prime factorization calculator",
    "Break a positive integer into its prime factors with exponents (e.g. 360 = 2³ × 3² × 5).",
    [
      "Prime factorization writes a number as a product of primes raised to powers.",
      "Useful for LCM/GCD work, simplifying radicals, and number-theory homework.",
      "This tool handles positive integers up to a practical browser limit and shows the expanded product form.",
    ],
    [
      "Enter a positive integer n ≥ 2.",
      "Calculate to see the prime factors with exponents.",
      "1 is neither prime nor composite — factorization is not defined in the usual sense.",
    ],
    [
      { q: "Is 1 prime?", a: "No. 1 has no prime factorization as a product of primes." },
      { q: "Negative numbers?", a: "Use the absolute value; factorization is defined for positive integers." },
    ],
    ["prime factorization", "factor tree", "factorización prima"],
  ),
  base(
    "es-primo",
    "Is prime? / next prime calculator",
    "Test whether an integer is prime and find the next prime greater than or equal to a starting value.",
    [
      "A prime has exactly two distinct positive divisors: 1 and itself.",
      "The tool reports prime/composite status and can jump to the next prime after n.",
      "Trial division is used — fine for typical homework-sized integers.",
    ],
    [
      "Enter an integer n.",
      "See whether n is prime and the next prime ≥ n (or > n).",
      "n ≤ 1 is neither prime nor composite.",
    ],
    [
      { q: "Is 2 prime?", a: "Yes — the only even prime." },
      { q: "How large can n be?", a: "Very large integers may be slow in the browser; prefer values under ~10⁹ for instant results." },
    ],
    ["is prime", "next prime", "número primo"],
  ),
  base(
    "raiz-cubica",
    "Cube root calculator",
    "Compute the real cube root of a number, including negatives (∛(−8) = −2).",
    [
      "Unlike square roots, real cube roots exist for every real number.",
      "The tool shows ∛x and optionally x^(1/3) verification by cubing the result back.",
      "Dedicated entry avoids mixing with the general nth-root tool.",
    ],
    [
      "Enter any real number x.",
      "Read the cube root.",
      "Check the verification card (root³ ≈ x).",
    ],
    [
      { q: "Negative inputs?", a: "Supported — the real cube root of a negative is negative." },
      { q: "Complex cube roots?", a: "This tool returns the principal real root only." },
    ],
    ["cube root", "∛", "raíz cúbica"],
  ),
  base(
    "multiplicacion-cruzada",
    "Cross multiplication calculator",
    "Solve a proportion a/b = c/x (or a/b = x/d) by cross-multiplying.",
    [
      "Cross multiplication turns a/b = c/d into a·d = b·c so you can solve for any one unknown.",
      "Classic method for similar triangles, recipe scaling, and rate problems.",
      "Pick which term is unknown and enter the other three.",
    ],
    [
      "Choose which variable is unknown (x in the proportion).",
      "Enter the three known values.",
      "Read the solved value.",
    ],
    [
      { q: "What if a denominator is zero?", a: "Proportions with a zero denominator are undefined." },
      { q: "Order of terms?", a: "Keep corresponding positions: a pairs with c, b with d." },
    ],
    ["cross multiplication", "solve proportion", "multiplicación cruzada"],
  ),
  base(
    "division-larga",
    "Long division calculator",
    "Divide integers with quotient, remainder, and the check equation dividend = quotient × divisor + remainder.",
    [
      "Integer division yields a quotient and a remainder with 0 ≤ remainder < |divisor|.",
      "The check identity confirms the result: dividend = q × divisor + r.",
      "Helpful when learning long division or verifying modular arithmetic steps.",
    ],
    [
      "Enter dividend and divisor (divisor ≠ 0).",
      "Calculate quotient and remainder.",
      "Use the check card to verify.",
    ],
    [
      { q: "Decimals?", a: "This version focuses on integer quotient and remainder. Use a decimal divider for fractional quotients." },
      { q: "Negative numbers?", a: "Signs follow truncating-toward-zero quotient with remainder shown in the result cards." },
    ],
    ["long division", "quotient remainder", "división con resto"],
  ),
  base(
    "cifras-significativas",
    "Significant figures calculator",
    "Count significant figures in a number and round to a chosen number of sig figs.",
    [
      "Significant figures communicate measurement precision: leading zeros do not count; trailing zeros may, depending on the decimal point.",
      "The tool counts sig figs in your input string and can round to n significant figures.",
      "Scientific notation is the unambiguous way to show trailing zeros as significant.",
    ],
    [
      "Enter the number as you write it (e.g. 0.00340 or 3400).",
      "Optionally enter how many sig figs to round to.",
      "Read the count and the rounded value.",
    ],
    [
      { q: "Are trailing zeros in 3400 significant?", a: "Ambiguous without a decimal or scientific notation. Prefer 3.400×10³ if all four count." },
      { q: "Leading zeros?", a: "Never significant — they only place the decimal point." },
    ],
    ["significant figures", "sig figs", "cifras significativas"],
  ),
  base(
    "orden-de-magnitud",
    "Order of magnitude calculator",
    "Estimate the order of magnitude as the nearest power of ten (or floor log₁₀).",
    [
      "Order of magnitude answers “about 10 to what power?” for a positive quantity.",
      "Common in physics estimates, astronomy, and Fermi problems.",
      "The tool shows log₁₀(x), floor(log₁₀), and the nearest power of ten.",
    ],
    [
      "Enter a positive number x.",
      "Read log₁₀, the floor order, and 10^k approximation.",
      "Zero and negatives are undefined for real log₁₀.",
    ],
    [
      { q: "Floor vs nearest?", a: "Floor gives the scientific-notation exponent band; nearest rounds the log to the closest integer power." },
      { q: "Why not zero?", a: "log₁₀(0) is undefined." },
    ],
    ["order of magnitude", "power of ten", "orden de magnitud"],
  ),
];
