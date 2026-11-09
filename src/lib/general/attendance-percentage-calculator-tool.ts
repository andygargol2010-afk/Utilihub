import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-porcentaje-asistencia",
  "Attendance Percentage Calculator",
  "educacion",
  "calculator",
  "Calculate attendance percentage for classes or meetings.",
  [
    "attendance percentage calculator",
    "class attendance percentage",
    "calculadora porcentaje asistencia",
    "porcentaje de asistencia clases",
  ],
  {
    title: "Attendance Percentage Calculator | UtiliHub",
    description: "Free attendance percentage calculator. Total classes and attended. Browser-only.",
    summaryEs: "Calcula el porcentaje de asistencia a clases o reuniones.",
  },
);
tool.faq.push(
  faq(
    "How is attendance percentage calculated?",
    "Attended classes divided by total classes, times 100: (attended / total) × 100. Example: 18 attended out of 20 total = 90%.",
  ),
);
tool.faq.push(
  faq(
    "What if attended is greater than total?",
    "No result is shown. Attended must be between 0 and the total number of classes.",
  ),
);

export const ATTENDANCE_PERCENTAGE_CALCULATOR_TOOLS = [tool];
