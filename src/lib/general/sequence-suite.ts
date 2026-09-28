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
  config: { mode: "sequence-suite" },
});

export const SEQUENCE_SUITE_TOOLS: GeneralTool[] = [
  base(
    "fibonacci",
    "Fibonacci calculator",
    "Compute the nth Fibonacci number F(n) and the sum of the first n terms.",
    [
      "Fibonacci sequence: F(0)=0, F(1)=1, and F(n)=F(n−1)+F(n−2) for n≥2.",
      "The tool returns F(n) and the sum F(0)+…+F(n) using the identity sum = F(n+2)−1.",
      "Useful for algorithms, biology models, and combinatorics examples.",
    ],
    [
      "Enter a non-negative integer n (recommended ≤ 70 for exact JS integers).",
      "Calculate F(n) and the partial sum.",
      "Larger n is shown in exponential notation when precision is lost.",
    ],
    [
      { q: "Does indexing start at 0 or 1?", a: "This tool uses F(0)=0, F(1)=1 (standard modern indexing)." },
      { q: "How large can n be?", a: "Exact integers up to about n=70 in JavaScript; beyond that results use floating approximation." },
    ],
    ["fibonacci calculator", "nth fibonacci", "fibonacci"],
  ),
  base(
    "sucesion-aritmetica",
    "Arithmetic sequence calculator",
    "Find the nth term and the sum of the first n terms of an arithmetic sequence.",
    [
      "An arithmetic sequence has constant difference d: aₙ = a₁ + (n−1)d.",
      "The sum of the first n terms is Sₙ = n/2 · (2a₁ + (n−1)d) = n/2 · (a₁ + aₙ).",
      "More complete than a simple term list: you get closed forms for aₙ and Sₙ.",
    ],
    [
      "Enter first term a₁, common difference d, and term index n ≥ 1.",
      "Calculate aₙ and Sₙ.",
      "Optionally compare with listing the first few terms mentally.",
    ],
    [
      { q: "Is n 1-based?", a: "Yes — n=1 is the first term a₁." },
      { q: "Negative difference?", a: "Allowed — the sequence decreases." },
    ],
    ["arithmetic sequence", "arithmetic series sum", "sucesión aritmética"],
  ),
  base(
    "sucesion-geometrica",
    "Geometric sequence calculator",
    "Find the nth term and the sum of the first n terms of a geometric sequence.",
    [
      "A geometric sequence has constant ratio r: aₙ = a₁ · r^(n−1).",
      "Sum: Sₙ = a₁(1−rⁿ)/(1−r) when r≠1; Sₙ = n·a₁ when r=1.",
      "Common in compound interest models and recursive growth.",
    ],
    [
      "Enter first term a₁, ratio r, and n ≥ 1.",
      "Calculate aₙ and Sₙ.",
      "Watch for |r| large with high n (overflow).",
    ],
    [
      { q: "What if r = 1?", a: "Every term equals a₁ and Sₙ = n·a₁." },
      { q: "r = 0?", a: "a₁ stays, then all later terms are 0." },
    ],
    ["geometric sequence", "geometric series sum", "sucesión geométrica"],
  ),
  base(
    "suma-naturales-cuadrados",
    "Sum of naturals & squares calculator",
    "Closed formulas for 1+2+…+n and 1²+2²+…+n².",
    [
      "Sum of first n naturals: n(n+1)/2.",
      "Sum of first n squares: n(n+1)(2n+1)/6.",
      "Classic formulas used in discrete math, Gauss’s story, and series proofs.",
    ],
    [
      "Enter a positive integer n.",
      "Read both sums.",
      "Verify small n by hand if learning the formulas.",
    ],
    [
      { q: "Does n include 0?", a: "Use n ≥ 1; the empty sum for n=0 is 0." },
      { q: "Cubes?", a: "Sum of cubes is [n(n+1)/2]² — not in this tool yet." },
    ],
    ["sum of natural numbers", "sum of squares", "suma de naturales"],
  ),
];
