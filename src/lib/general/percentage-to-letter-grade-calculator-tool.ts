import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-porcentaje-a-letra",
  "Percentage to Letter Grade Calculator",
  "educacion",
  "calculator",
  "Convert a percentage score to a letter grade using the standard US scale.",
  [
    "percentage to letter grade",
    "percent to grade calculator",
    "calculadora porcentaje a letra",
    "nota porcentual a letra",
    "letter grade from percentage",
    "grade letter converter",
  ],
  {
    title: "Percentage to Letter Grade Calculator | UtiliHub",
    description:
      "Free percentage to letter grade calculator. Enter a score from 0 to 100 and get the corresponding letter grade (A–F). EN+ES. Runs in the browser.",
    summaryEs: "Convierte un porcentaje de calificación a nota en letra (escala A–F).",
  },
);
tool.faq.push(
  faq(
    "What scale is used?",
    "Standard US scale: A 90–100, B 80–89, C 70–79, D 60–69, F below 60. Institutions may vary; check your syllabus.",
  ),
);
tool.faq.push(
  faq(
    "Does it support plus/minus grades?",
    "This version uses the basic A–F scale without +/−. Many schools add A+ (97–100), A− (90–92), etc. Use your school’s scale when it differs.",
  ),
);

export const PERCENTAGE_TO_LETTER_GRADE_CALCULATOR_TOOLS = [tool];
