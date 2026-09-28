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
  config: { mode: "matrix-binary-suite" },
});

export const MATRIX_BINARY_SUITE_TOOLS: GeneralTool[] = [
  base(
    "matriz-2x2",
    "2×2 matrix determinant & inverse",
    "Compute det(A) and A⁻¹ for a 2×2 matrix [[a,b],[c,d]].",
    [
      "For A = [[a,b],[c,d]], det(A) = ad−bc.",
      "If det ≠ 0, A⁻¹ = (1/det)·[[d,−b],[−c,a]].",
      "Singular matrices (det=0) have no inverse.",
    ],
    [
      "Enter a, b, c, d.",
      "Read the determinant.",
      "If invertible, read the inverse entries.",
    ],
    [
      { q: "When is there no inverse?", a: "When ad−bc = 0 (rows/columns linearly dependent)." },
      { q: "Larger matrices?", a: "This tool is specialized for 2×2 only." },
    ],
    ["2x2 determinant", "2x2 inverse", "matriz 2x2"],
  ),
  base(
    "bases-numericas",
    "Binary ↔ decimal ↔ hex converter",
    "Convert non-negative integers between binary, decimal, and hexadecimal.",
    [
      "Binary (base 2), decimal (base 10), and hex (base 16) are the everyday programmer bases.",
      "Enter a value in any of the three; the others update.",
      "Hex digits use 0-9 and A-F.",
    ],
    [
      "Choose the input base.",
      "Enter the value in that base.",
      "Read binary, decimal, and hex forms.",
    ],
    [
      { q: "Leading zeros?", a: "Optional; they do not change the value." },
      { q: "Negative numbers?", a: "This version targets non-negative integers." },
    ],
    ["binary to decimal", "hex converter", "binario decimal hexadecimal"],
  ),
  base(
    "bitwise",
    "Bitwise AND OR XOR calculator",
    "Compute bitwise AND, OR, and XOR of two integers.",
    [
      "Bitwise operators act on the binary representation of integers.",
      "AND is 1 only where both bits are 1; OR where either is 1; XOR where bits differ.",
      "Handy for flags, masks, and low-level debugging.",
    ],
    [
      "Enter two integers a and b.",
      "Read a AND b, a OR b, a XOR b in decimal and binary.",
      "Use non-negative values for clearest binary display.",
    ],
    [
      { q: "What about NOT?", a: "NOT depends on word size; this tool focuses on binary dyadic ops." },
      { q: "Shifts?", a: "Not included in this version." },
    ],
    ["bitwise AND", "bitwise OR", "bitwise XOR", "operadores bit a bit"],
  ),
];
