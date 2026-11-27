import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-ratio-dorado",
  "Golden Ratio Calculator",
  "diseno",
  "calculator",
  "Calculate golden ratio segments from a base length. φ ≈ 1.618.",
  [
    "golden ratio calculator",
    "calculadora ratio aureo",
    "calculadora ratio dorado",
    "golden ratio",
    "ratio aureo",
  ],
  {
    title: "Golden Ratio Calculator — φ Segments from Any Length | UtiliHub",
    description: "Free golden ratio calculator. Enter a base length in any unit and get the major (φ×a) and minor (a/φ) segments, plus the total, instantly in your browser.",
    summaryEs: "Calcula los segmentos de la proporción áurea (φ ≈ 1,618) a partir de una longitud base: segmento mayor, menor y total, en cualquier unidad.",
  },
);
tool.faq.push(faq("What is the golden ratio?", "Approximately 1.618, often used in design and nature for aesthetically pleasing proportions."));
tool.faq.push(faq("How are the segments calculated?", "Given a base length a: the major segment is φ × a, the minor segment is a ÷ φ, and the combined length is a + φ × a. The result uses the same unit you enter (px, cm, in, etc.)."));
tool.faq.push(faq("Where is the golden ratio used?", "Layout grids, typography scales, logo composition, and photography framing, among other design applications."));

export const GOLDEN_RATIO_CALCULATOR_TOOLS = [tool];
