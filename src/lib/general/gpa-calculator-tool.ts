import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-gpa",
  "GPA Calculator",
  "educacion",
  "calculator",
  "Calculate GPA from courses with letter grades and credit hours.",
  [
    "gpa calculator",
    "calculate gpa",
    "college gpa calculator",
    "calculadora de promedio",
    "calculadora gpa",
    "promedio universitario",
  ],
  {
    title: "GPA Calculator — Credits and Letter Grades | UtiliHub",
    description: "Free GPA calculator. Add courses with letter grades (A-F) and credits to compute your GPA on a 4.0 scale. Browser-only.",
    summaryEs: "Calcula el GPA a partir de cursos con notas en letras y créditos.",
  },
);
tool.faq.push(
  faq(
    "How is GPA calculated?",
    "Each letter grade is converted to points (A=4, B=3, C=2, D=1, F=0). GPA = sum(points × credits) / sum(credits).",
  ),
);

export const GPA_CALCULATOR_TOOLS = [tool];
